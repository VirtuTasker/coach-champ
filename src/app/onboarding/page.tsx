import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OnboardingForm from "./onboarding-form";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-2xl">✦</span>
          <h1 className="font-display font-bold text-3xl text-indigo mt-2">
            Welcome! Let&apos;s get set up
          </h1>
          <p className="text-indigo-soft mt-2">
            Just a couple of minutes, then your child can meet Coach Champ.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-indigo/10 p-6 md:p-8">
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
