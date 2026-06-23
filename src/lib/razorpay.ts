// =============================================================
// RAZORPAY CLIENT
// =============================================================
// Server-only Razorpay instance. Your RAZORPAY_KEY_SECRET never
// reaches the browser - only the public RAZORPAY_KEY_ID does
// (via NEXT_PUBLIC_RAZORPAY_KEY_ID), which is safe to expose
// because it can only be used to start a checkout, not move money.
// =============================================================

import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local."
  );
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
