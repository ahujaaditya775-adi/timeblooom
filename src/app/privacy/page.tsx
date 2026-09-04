import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="border-b border-white/10 bg-midnight-950 pb-16 pt-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <h1 className="font-display text-4xl text-moonlight-100">Privacy policy</h1>
          <p className="mt-4 text-moonlight-300/70">Last updated {new Date().getFullYear()}</p>

          <div className="prose prose-invert mt-10 max-w-none space-y-6 text-moonlight-200/85">
            <p>
              TimeBloom exists to hold your memories privately until the moment you've chosen for them. This
              page explains, plainly, what that means in practice.
            </p>

            <h2 className="font-display text-2xl text-moonlight-100">What we store</h2>
            <p>
              Your account details (name, email), the capsules you create (title, letter, mood, unlock date),
              and any photos, video, or voice notes you attach. Everything is stored in a private database and
              private file storage — nothing is public by default.
            </p>

            <h2 className="font-display text-2xl text-moonlight-100">Who can see a capsule</h2>
            <p>
              Only you, until it unlocks. If you choose "shareable link" or "future recipient" privacy, the
              content becomes visible to whoever holds the link or receives the email — but only after the
              unlock date, never before.
            </p>

            <h2 className="font-display text-2xl text-moonlight-100">Deleting your data</h2>
            <p>
              You can delete any individual capsule, or your entire account, at any time from Settings. Account
              deletion removes your capsules, media, and reflections permanently.
            </p>

            <h2 className="font-display text-2xl text-moonlight-100">Contact</h2>
            <p>Questions about your data can be sent through the contact page.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
