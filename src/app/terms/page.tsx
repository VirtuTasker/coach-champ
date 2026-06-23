import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          <strong>Note to Rahul:</strong> same as the privacy policy — this is
          a starting template. Get it reviewed before launch.
        </div>

        <h1 className="font-display font-bold text-3xl text-indigo mb-6">
          Terms of Service
        </h1>

        <div className="space-y-6 text-indigo-soft leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-lg text-indigo mb-2">
              Acceptance
            </h2>
            <p>
              By creating an account, you confirm you are an adult parent or
              legal guardian of the child profile(s) you create, and you
              agree to these terms on their behalf.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-indigo mb-2">
              The service
            </h2>
            <p>
              Coach Champ AI provides an AI-powered companion for children
              for entertainment and educational purposes. It is not a
              substitute for professional educational, medical, or
              psychological advice.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-indigo mb-2">
              Subscriptions
            </h2>
            <p>
              Paid plans renew automatically until cancelled. You can cancel
              anytime from your account settings; access continues until the
              end of the current billing period.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-indigo mb-2">
              Acceptable use
            </h2>
            <p>
              The service must not be used to attempt to extract harmful
              content, bypass safety features, or input content
              inappropriate for children.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
