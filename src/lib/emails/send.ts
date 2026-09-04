import { Resend } from "resend";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email via Resend when RESEND_API_KEY is configured. If it isn't
 * (e.g. local development, or a demo deploy without an email provider set
 * up), the email is logged instead of sent so the rest of the product —
 * capsule creation, unlock notifications, sharing — keeps working.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[email:fallback] Would send "${subject}" to ${to}`);
    return { ok: true, delivered: false as const };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL || "TimeBloom <hello@timebloom.app>";

  try {
    await resend.emails.send({ from, to, subject, html });
    return { ok: true, delivered: true as const };
  } catch (error) {
    console.error("[email] send failed", error);
    return { ok: false, delivered: false as const };
  }
}

export function unlockSoonEmail(params: { title: string; unlockDate: string; capsuleUrl: string }) {
  return {
    subject: `“${params.title}” opens soon`,
    html: `
      <div style="font-family: Georgia, serif; background:#0B0E1F; color:#F5F1E8; padding:32px;">
        <h1 style="font-weight:400;">A memory is stirring.</h1>
        <p>Your capsule <strong>${params.title}</strong> unlocks on ${params.unlockDate}.</p>
        <p><a href="${params.capsuleUrl}" style="color:#E0B45C;">View it in TimeBloom →</a></p>
      </div>
    `,
  };
}

export function unlockedEmail(params: { title: string; capsuleUrl: string }) {
  return {
    subject: `“${params.title}” has unlocked`,
    html: `
      <div style="font-family: Georgia, serif; background:#0B0E1F; color:#F5F1E8; padding:32px;">
        <h1 style="font-weight:400;">Some moments were worth the wait.</h1>
        <p>Your capsule <strong>${params.title}</strong> is ready to be rediscovered.</p>
        <p><a href="${params.capsuleUrl}" style="color:#E0B45C;">Open it now →</a></p>
      </div>
    `,
  };
}

export function recipientEmail(params: { title: string; senderName: string; capsuleUrl: string; subject?: string | null }) {
  return {
    subject: params.subject || `${params.senderName} sent you a memory on TimeBloom`,
    html: `
      <div style="font-family: Georgia, serif; background:#0B0E1F; color:#F5F1E8; padding:32px;">
        <h1 style="font-weight:400;">Someone kept this for you.</h1>
        <p>${params.senderName} sealed a memory titled <strong>${params.title}</strong> for you. It has just unlocked.</p>
        <p><a href="${params.capsuleUrl}" style="color:#E0B45C;">Open the capsule →</a></p>
      </div>
    `,
  };
}
