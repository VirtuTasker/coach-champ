import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import UpgradeOptions from "./upgrade-options";

export default async function UpgradePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const email = user.emailAddresses?.[0]?.emailAddress ?? "";

  return (
    <main className="min-h-screen bg-cream px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-soft hover:text-indigo transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Teaser hook - placeholder for the pre-generated avatar video */}
        <div className="bg-indigo rounded-2xl p-8 mb-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <Lock className="w-7 h-7 text-gold mx-auto mb-3" />
            <h2 className="font-display font-bold text-xl text-cream mb-2">
              See Coach Champ come to life
            </h2>
            <p className="text-cream/70 text-sm max-w-md mx-auto">
              Premium families unlock animated avatar moments where Coach
              Champ celebrates milestones face-to-face with your child.
            </p>
            {/* This is where the 10-second pre-generated teaser video element goes */}
            <div className="mt-5 aspect-video max-w-sm mx-auto bg-white/10 rounded-xl flex items-center justify-center text-cream/50 text-sm">
              Teaser video placeholder
            </div>
          </div>
        </div>

        <h1 className="font-display font-bold text-2xl text-indigo mb-6 text-center">
          Choose your plan
        </h1>
        <UpgradeOptions userEmail={email} />
      </div>
    </main>
  );
}
