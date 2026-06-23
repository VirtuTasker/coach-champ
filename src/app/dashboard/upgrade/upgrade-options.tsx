"use client";

import { useState } from "react";
import Script from "next/script";
import { Star, Crown } from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

const PLAN_OPTIONS = [
  {
    key: "monthly",
    name: "Monthly",
    price: "₹499",
    period: "/month",
    features: ["Daily voice conversations", "Unlimited stories", "Weekly reports"],
  },
  {
    key: "premium",
    name: "Premium",
    price: "₹699",
    period: "/month",
    features: ["Everything in Monthly", "Advanced AI modules", "Monthly PDF reports"],
    highlight: true,
  },
  {
    key: "annual",
    name: "Annual",
    price: "₹4,999",
    period: "/year",
    features: ["Everything in Premium", "2 months free", "Bonus avatar moments"],
  },
];

export default function UpgradeOptions({ userEmail }: { userEmail: string }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  async function handleUpgrade(planKey: string) {
    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not start checkout");
        setLoadingPlan(null);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Coach Champ AI",
        description: `${data.planTier} subscription`,
        order_id: data.orderId,
        prefill: { email: userEmail },
        theme: { color: "#FF6B4A" },
        handler: function () {
          // Actual subscription upgrade happens via webhook (server-to-server),
          // this just gives the parent immediate visual feedback.
          window.location.href = "/dashboard?upgraded=true";
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Something went wrong starting checkout.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptReady(true)}
      />
      <div className="grid md:grid-cols-3 gap-5">
        {PLAN_OPTIONS.map((plan) => (
          <div
            key={plan.key}
            className={`rounded-2xl p-6 flex flex-col ${
              plan.highlight
                ? "bg-indigo text-cream shadow-xl"
                : "bg-white border border-indigo/10"
            }`}
          >
            {plan.highlight && (
              <span className="bg-gold text-indigo text-xs font-bold px-3 py-1 rounded-full self-start mb-3 flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Most loved
              </span>
            )}
            <h3 className="font-display font-bold text-lg mb-1">{plan.name}</h3>
            <p className="mb-4">
              <span className="text-2xl font-display font-extrabold">{plan.price}</span>
              <span className={plan.highlight ? "text-cream/70" : "text-indigo-soft"}>
                {" "}{plan.period}
              </span>
            </p>
            <ul className="space-y-2 mb-6 flex-1 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Star className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.highlight ? "text-gold fill-gold" : "text-coral fill-coral"}`} />
                  <span className={plan.highlight ? "text-cream/90" : "text-indigo-soft"}>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan.key)}
              disabled={!scriptReady || loadingPlan !== null}
              className={`font-semibold px-5 py-3 rounded-full transition-colors disabled:opacity-60 ${
                plan.highlight
                  ? "bg-coral hover:bg-coral-deep text-white"
                  : "bg-indigo/5 hover:bg-indigo/10 text-indigo"
              }`}
            >
              {loadingPlan === plan.key ? "Starting checkout..." : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
