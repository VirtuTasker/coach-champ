"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const INTEREST_OPTIONS = [
  "Space",
  "Animals",
  "Superheroes",
  "Dinosaurs",
  "Sports",
  "Art",
  "Music",
  "Science",
  "Princesses",
  "Mystery stories",
];

export default function OnboardingForm() {
  const router = useRouter();
  const [consentGiven, setConsentGiven] = useState(false);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [goals, setGoals] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!consentGiven) {
      setError("Please confirm parental consent to continue.");
      return;
    }
    if (!childName.trim() || !childAge) {
      setError("Please enter your child's name and age.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consentGiven: true,
          childName: childName.trim(),
          childAge: Number(childAge),
          school: school.trim() || undefined,
          grade: grade.trim() || undefined,
          interests,
          goals: goals.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Could not connect. Please check your internet and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* CONSENT SECTION - intentionally first and unmissable */}
      <div className="bg-indigo/5 border border-indigo/15 rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg text-indigo mb-2">
          Parental consent
        </h2>
        <p className="text-sm text-indigo-soft leading-relaxed mb-4">
          Coach Champ AI is designed for children, but this account and all
          consent belongs to you, the parent or guardian. We collect your
          child&apos;s name, age, and conversation data to personalize their
          experience. We never show ads to children and never sell personal
          data. You can request deletion of your child&apos;s data at any
          time from the dashboard settings.
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-1 w-5 h-5 accent-coral"
          />
          <span className="text-sm font-medium text-indigo">
            I am the parent or legal guardian of this child, and I consent to
            Coach Champ AI collecting and using the information below to
            personalize their experience, in line with the{" "}
            <a href="/privacy" className="text-coral underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
      </div>

      {/* CHILD PROFILE SECTION */}
      <div>
        <h2 className="font-display font-bold text-lg text-indigo mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-coral" />
          Tell us about your child
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-indigo mb-1.5">
              Child&apos;s name
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full rounded-xl border border-indigo/15 px-4 py-2.5 text-indigo focus:border-coral outline-none"
              placeholder="e.g. Aarav"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-indigo mb-1.5">
              Age
            </label>
            <input
              type="number"
              min={3}
              max={16}
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              className="w-full rounded-xl border border-indigo/15 px-4 py-2.5 text-indigo focus:border-coral outline-none"
              placeholder="e.g. 7"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-indigo mb-1.5">
              School (optional)
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full rounded-xl border border-indigo/15 px-4 py-2.5 text-indigo focus:border-coral outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-indigo mb-1.5">
              Grade (optional)
            </label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-xl border border-indigo/15 px-4 py-2.5 text-indigo focus:border-coral outline-none"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-indigo mb-2">
            What does your child love? (pick a few)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                  interests.includes(interest)
                    ? "bg-coral text-white border-coral"
                    : "bg-white text-indigo-soft border-indigo/15 hover:border-coral/40"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-indigo mb-1.5">
            Anything specific you&apos;d like Coach Champ to help with?
            (optional)
          </label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-indigo/15 px-4 py-2.5 text-indigo focus:border-coral outline-none resize-none"
            placeholder="e.g. He's shy about speaking up in class"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-coral-deep font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-coral hover:bg-coral-deep disabled:opacity-60 text-white font-semibold px-6 py-3.5 rounded-full transition-colors"
      >
        {submitting ? "Setting things up..." : "Meet Coach Champ"}
      </button>
    </form>
  );
}
