import { BankrollPanel } from "@/components/BankrollPanel";

export default function BankrollPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="metric-label">Portfolio control</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Bankroll tracking</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/56">Track exposure, drawdown, pending stake and performance discipline across logged bets.</p>
      </div>
      <BankrollPanel />
    </main>
  );
}
