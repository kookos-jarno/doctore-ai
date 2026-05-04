export const DEMO_USER_EMAIL = "demo@doctore.ai";

export const TIERS = [
  {
    name: "FREE",
    price: "€0",
    description: "Acquisition tier for calculator-led onboarding.",
    features: ["Basic Kelly calculator", "Delayed odds", "Basic metrics"]
  },
  {
    name: "PRO",
    price: "€29/mo",
    description: "Main B2C revenue tier for disciplined retail users.",
    features: ["Real-time edge feed", "Advanced bankroll tracking", "EV dashboard", "Bet history"]
  },
  {
    name: "SHARP",
    price: "€99/mo",
    description: "Power-user tier with controlled API/webhook access.",
    features: ["Custom alerts", "Automated bet logging", "Advanced risk controls", "Personal API/webhooks"]
  }
] as const;
