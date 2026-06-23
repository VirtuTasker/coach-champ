import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cream px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-soft hover:text-indigo transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>

        <div className="bg-coral/10 border border-coral/30 rounded-xl p-4 mb-8 text-sm text-indigo">
          <strong>Note to Rahul:</strong> this is a starting template, not a
          finished legal document. Have an Indian lawyer familiar with the
          DPDP Act (and COPPA if you ever serve US families) review and
          finalize this before real users sign up.
        </div>

        <h1 className="font-display font-bold text-3xl text-indigo mb-6">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-indigo-soft leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-lg text-indigo mb-2">
              Who this applies to
            </h2>
            <p>
              Coach Champ AI is a service used by children, but accounts are
              created and controlled by a parent or legal guardian. Only a
              parent or guardian may create an account, give consent, and
              manage subscription and data settings.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-indigo mb-2">
              What we collect
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Parent: name, email, phone (for account and billing)</li>
              <li>Child: name, age, school, grade, interests, goals (provided by parent during setup)</li>
              <li>Conversation text and, for Premium users, voice audio processed to generate spoken replies</li>
              <li>Usage data: streaks, scores, completed missions, app activity</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-indigo mb-2">
              How we use it
            </h2>
            <p>
              To personalize Coach Champ&apos;s conversations and stories, track
              and report progress to parents, and operate subscriptions and
              support. We do not use children&apos;s data to show ads, and we
              do not sell personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-indigo mb-2">
              Voice data
            </h2>
            <p>
              Voice audio is sent to our voice provider to generate spoken
              replies and is not stored longer than necessary to provide the
              service.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-indigo mb-2">
              Parental controls
            </h2>
            <p>
              Parents can review, update, or request deletion of their
              child&apos;s data at any time by contacting support.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-indigo mb-2">
              Contact
            </h2>
            <p>For privacy questions or data deletion requests, contact us through the support channel listed in your account.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
