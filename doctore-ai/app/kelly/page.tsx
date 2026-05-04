import { KellyCalculator } from "@/components/KellyCalculator";

export default function KellyPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="metric-label">Risk engine</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Fractional Kelly stake sizing</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/56">The engine turns model edge into a stake recommendation while applying fractional Kelly and maximum exposure caps.</p>
      </div>
      <KellyCalculator />
    </main>
  );
}
