import { Check } from "lucide-react";
import { TIERS } from "@/lib/constants";

export function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {TIERS.map((tier) => (
        <div key={tier.name} className="terminal-card flex rounded-3xl p-6">
          <div className="flex flex-1 flex-col">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-terminal-accent">{tier.name}</div>
            <div className="mt-3 text-4xl font-black text-white">{tier.price}</div>
            <p className="mt-3 min-h-14 text-sm leading-6 text-white/56">{tier.description}</p>
            <div className="mt-6 space-y-3">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-white/72">
                  <Check className="mt-0.5 shrink-0 text-terminal-accent" size={16} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button className="mt-8 rounded-full border border-terminal-accent/40 px-5 py-3 text-sm font-bold text-terminal-accent transition hover:bg-terminal-accent/10">
              Select {tier.name}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
