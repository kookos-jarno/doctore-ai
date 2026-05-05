type Metric = {
  label: string;
  value: string;
  tone?: 'positive' | 'neutral';
};

type ScreenProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const metrics: Metric[] = [
  { label: 'EV', value: '+10.9%', tone: 'positive' },
  { label: 'Confidence', value: '72%', tone: 'positive' },
  { label: 'Odds', value: '2.10' },
  { label: 'Stake', value: '€42' },
];

const feedItems = [
  ['MLB', 'Team C total over', '+7.4% EV'],
  ['NBA', 'Team D moneyline', '+5.8% EV'],
  ['NHL', 'Under 5.5 goals', '+4.1% EV'],
];

const filterGroups = [
  ['Sport', ['MLB', 'NBA', 'NHL']],
  ['EV', ['+3%', '+5%', '+10%']],
  ['Confidence', ['60%+', '70%+', '80%+']],
];

function PhoneScreen({ eyebrow, title, subtitle, children }: ScreenProps) {
  return (
    <section className="phone-screen">
      <div className="screen-topbar">
        <span>{eyebrow}</span>
        <span className="status-dot" aria-hidden="true" />
      </div>
      <div className="screen-header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function MetricGrid({ items }: { items: Metric[] }) {
  return (
    <div className="metric-grid">
      {items.map((metric) => (
        <div className="metric" key={metric.label}>
          <span>{metric.label}</span>
          <strong className={metric.tone === 'positive' ? 'positive' : undefined}>{metric.value}</strong>
        </div>
      ))}
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flow-arrow" aria-label={label}>
      <span>{label}</span>
      <div aria-hidden="true">→</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <div className="brand-pill">Doctore AI mobile MVP</div>
        <h1>Dark-mode betting intelligence flow</h1>
        <p>
          Mobile UI/UX wireframe for moving users from feed discovery to tracked pick analysis,
          sign-up, filters, analytics, and trial conversion.
        </p>
      </section>

      <section className="wireframe-grid" aria-label="Mobile application wireframe flow">
        <PhoneScreen eyebrow="Betting Feed" title="Doctore AI" subtitle="Quant betting feed">
          <article className="featured-card">
            <div className="card-label">Featured Edge</div>
            <h3>Team A to Win</h3>
            <p>MLB Moneyline · Pinnacle reference</p>
            <MetricGrid items={metrics} />
            <button className="primary-button">Start Free Trial</button>
          </article>

          <div className="list-stack">
            {feedItems.map(([sport, pick, edge]) => (
              <div className="feed-row" key={pick}>
                <span>{sport}</span>
                <strong>{pick}</strong>
                <em>{edge}</em>
              </div>
            ))}
          </div>
        </PhoneScreen>

        <FlowArrow label="Open pick" />

        <PhoneScreen eyebrow="Tracked Picks" title="Team A to Win" subtitle="Pick detail and model context">
          <MetricGrid
            items={[
              { label: 'Confidence', value: '72%', tone: 'positive' },
              { label: 'EV', value: '+10.9%', tone: 'positive' },
              { label: 'Model', value: '58.5%' },
              { label: 'Market', value: '47.6%' },
            ]}
          />
          <div className="analysis-card">
            <span>Analysis</span>
            <ul>
              <li>Pitching edge against current lineup split.</li>
              <li>Market implied probability trails model estimate.</li>
              <li>Line movement remains inside acceptable variance.</li>
            </ul>
          </div>
          <button className="secondary-button">Track Pick</button>
        </PhoneScreen>

        <FlowArrow label="Gate action" />

        <PhoneScreen eyebrow="Sign In" title="Track your edge history" subtitle="Save picks and unlock the model workflow">
          <div className="auth-card">
            <button className="primary-button">Create Account</button>
            <button className="ghost-button">Sign In</button>
          </div>
          <div className="benefit-list">
            <span>Save tracked picks</span>
            <span>Unlock filters</span>
            <span>View analytics</span>
          </div>
        </PhoneScreen>

        <FlowArrow label="Refine feed" />

        <PhoneScreen eyebrow="Filters" title="Signal controls" subtitle="Sort by sport, EV, and confidence">
          <div className="filter-stack">
            {filterGroups.map(([label, values]) => (
              <div className="filter-group" key={label as string}>
                <span>{label}</span>
                <div>
                  {(values as string[]).map((value) => (
                    <button key={value}>{value}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="secondary-button">Apply Filters</button>
        </PhoneScreen>

        <FlowArrow label="Review performance" />

        <PhoneScreen eyebrow="Analytics" title="Model performance" subtitle="Line graph and win statistics">
          <div className="chart-card" aria-label="Performance line graph">
            <svg viewBox="0 0 260 120" role="img" aria-label="Performance trend line">
              <path d="M8 96 L52 82 L96 88 L140 55 L184 60 L228 30 L252 22" />
              <circle cx="252" cy="22" r="4" />
            </svg>
          </div>
          <MetricGrid
            items={[
              { label: 'Win rate', value: '61%', tone: 'positive' },
              { label: 'ROI', value: '+8.4%', tone: 'positive' },
              { label: 'Tracked', value: '184' },
              { label: 'Avg EV', value: '+5.6%' },
            ]}
          />
        </PhoneScreen>

        <FlowArrow label="Convert" />

        <PhoneScreen eyebrow="CTA" title="Unlock full tracking" subtitle="Login variant for returning and trial users">
          <article className="featured-card compact">
            <div className="card-label">Trial access</div>
            <h3>Start with the feed. Scale with analytics.</h3>
            <p>No guaranteed returns. Analytics only.</p>
            <button className="primary-button">Start Free Trial</button>
            <button className="ghost-button">Log In</button>
          </article>
        </PhoneScreen>
      </section>
    </main>
  );
}
