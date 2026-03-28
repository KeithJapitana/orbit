import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    workspaces: 1,
    boards: 2,
    members: 5,
  },
  lite: {
    name: "Lite",
    price: 9,
    priceId: process.env.STRIPE_LITE_PRICE_ID!,
    workspaces: 5,
    boards: 10,
    members: 15,
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    workspaces: Infinity,
    boards: Infinity,
    members: Infinity,
  },
} as const;

export type PlanTier = keyof typeof PLANS;
