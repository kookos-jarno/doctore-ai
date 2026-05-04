import { PricingCards } from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="metric-label">Monetization engine</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">B2C subscriptions + B2B Data API</h1>
        <p className="mt-3 text-sm leading-6 text-white/56">FREE drives onboarding, PRO monetizes serious users, SHARP serves power users, and B2B extends the product into infrastructure.</p>
      </div>
      <PricingCards />
      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        {[
          ["API Tier 1", "Raw odds ingestion, historical model data and market movement history."],
          ["White-label Kelly Engine", "Embed stake sizing, EV calculations and bankroll rules into partner platforms."],
          ["Compliance controls", "Secure API keys, strict rate limits, usage monitoring and audit-ready logs."]
        ].map(([title, body]) => (
          <div key={title} className="terminal-card rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/56">{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
