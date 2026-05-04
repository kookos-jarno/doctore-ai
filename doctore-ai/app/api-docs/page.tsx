const endpoints = [
  ["POST", "/api/kelly", "Calculate implied probability, EV, Kelly and capped stake."],
  ["POST", "/api/edges", "Evaluate one market payload without writing to the database."],
  ["GET", "/api/signals", "List ranked EV signals for the terminal dashboard."],
  ["POST", "/api/odds/ingest", "B2B-protected odds/model ingestion endpoint. Requires x-api-key."],
  ["GET", "/api/b2b/odds", "B2B-protected market and latest signal export. Requires x-api-key."],
  ["GET/PATCH", "/api/bankroll", "Read or update bankroll controls."],
  ["GET/POST", "/api/bets", "Read and log bets."],
  ["GET", "/api/health", "Service health check."]
];

export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="metric-label">Backend API</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Doctore AI API surface</h1>
        <p className="mt-3 text-sm leading-6 text-white/56">The backend exposes public calculator routes, dashboard routes, bet logging routes and protected B2B data endpoints.</p>
      </div>
      <div className="terminal-card overflow-hidden rounded-3xl">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-white/48">
            <tr>
              <th className="px-5 py-4">Method</th>
              <th className="px-5 py-4">Endpoint</th>
              <th className="px-5 py-4">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {endpoints.map(([method, path, purpose]) => (
              <tr key={path}>
                <td className="px-5 py-4 font-bold text-terminal-accent">{method}</td>
                <td className="px-5 py-4 font-mono text-white">{path}</td>
                <td className="px-5 py-4 text-white/62">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 terminal-card rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-white">Example: Kelly request</h2>
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-white/74">{`curl -X POST http://localhost:3000/api/kelly \\
  -H "Content-Type: application/json" \\
  -d '{"bankroll":10000,"oddsDecimal":2.05,"modelProbability":0.51,"kellyFraction":0.25,"maxStakePct":5}'`}</pre>
      </div>
    </main>
  );
}
