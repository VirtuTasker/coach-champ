import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-8">
        <span className="text-2xl">✦</span>
        <h1 className="font-display font-bold text-2xl text-indigo mt-2">
          Welcome back
        </h1>
      </div>
      <SignIn
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
