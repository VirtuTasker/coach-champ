import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-8">
        <span className="text-2xl">✦</span>
        <h1 className="font-display font-bold text-2xl text-indigo mt-2">
          Create your parent account
        </h1>
        <p className="text-indigo-soft text-sm mt-1 max-w-sm">
          This account belongs to you, the parent or guardian. You&apos;ll add
          your child&apos;s profile after signing up.
        </p>
      </div>
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-coral hover:bg-coral-deep text-white",
            footerActionLink: "text-coral hover:text-coral-deep",
          },
        }}
      />
    </main>
  );
}
