import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail, unlockSoonEmail, unlockedEmail, recipientEmail } from "@/lib/emails/send";

const SOON_WINDOW_HOURS = 24;

/**
 * GET /api/cron/notify — intended to run on a schedule (Vercel Cron, a
 * GitHub Action, cron-job.org, etc). Requires ?secret= to match
 * CRON_SECRET so it can't be triggered by anyone else.
 *
 * Sends, at most once per capsule (tracked in notification_log so retries
 * and overlapping runs stay idempotent):
 *  - an "opens soon" email when a capsule's unlock falls within the next
 *    SOON_WINDOW_HOURS
 *  - an "it's unlocked" email right after unlock_at passes, to the owner
 *    and, for "recipient"-privacy capsules, to the named recipient too
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();
  const soonThreshold = new Date(now.getTime() + SOON_WINDOW_HOURS * 60 * 60 * 1000);

  let soonSent = 0;
  let unlockedSent = 0;

  const { data: soonCapsules } = await supabase
    .from("capsules")
    .select("id, user_id, title, unlock_at, timezone")
    .gt("unlock_at", now.toISOString())
    .lte("unlock_at", soonThreshold.toISOString());

  for (const capsule of soonCapsules ?? []) {
    const { error: logError } = await supabase
      .from("notification_log")
      .insert({ capsule_id: capsule.id, type: "upcoming" });

    if (logError) continue;

    const { data: authUser } = await supabase.auth.admin.getUserById(capsule.user_id);
    const email = authUser?.user?.email;
    if (email) {
      await sendEmail({
        to: email,
        ...unlockSoonEmail({
          title: capsule.title,
          unlockDate: new Date(capsule.unlock_at).toLocaleString("en-US", { timeZone: capsule.timezone }),
          capsuleUrl: `${siteUrl}/capsule/${capsule.id}`,
        }),
      });
      soonSent++;
    }
  }

  const { data: justUnlocked } = await supabase
    .from("capsules")
    .select("id, user_id, title, privacy, recipient_email, recipient_subject")
    .lte("unlock_at", now.toISOString());

  for (const capsule of justUnlocked ?? []) {
    const { error: logError } = await supabase
      .from("notification_log")
      .insert({ capsule_id: capsule.id, type: "unlocked" });

    if (logError) continue;

    const capsuleUrl = `${siteUrl}/capsule/${capsule.id}`;
    const { data: authUser } = await supabase.auth.admin.getUserById(capsule.user_id);
    const ownerEmail = authUser?.user?.email;
    const ownerName = authUser?.user?.user_metadata?.full_name || "Someone";

    if (ownerEmail) {
      await sendEmail({ to: ownerEmail, ...unlockedEmail({ title: capsule.title, capsuleUrl }) });
      unlockedSent++;
    }

    if (capsule.privacy === "recipient" && capsule.recipient_email) {
      await sendEmail({
        to: capsule.recipient_email,
        ...recipientEmail({
          title: capsule.title,
          senderName: ownerName,
          capsuleUrl,
          subject: capsule.recipient_subject,
        }),
      });
    }
  }

  return NextResponse.json({ ok: true, soonSent, unlockedSent });
}
