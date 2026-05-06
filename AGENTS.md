# Doctore AI — agent skill profiles

This file defines operational rules, coding standards, and architecture constraints for AI coding agents working on Doctore AI.

Doctore AI is not a tipster product. It is analytical infrastructure for model-market comparison, positive expected value discovery, fractional Kelly stake sizing, bankroll discipline, and controlled B2B API access.

Core product message:

> We find the edge. You execute the strategy.

## Global rules for all agents

1. Preserve the product position as a quantitative decision terminal. Do not introduce casino, hype, or guaranteed-profit language.
2. Keep all betting language probabilistic. Use terms such as expected value, model probability, implied probability, variance, drawdown, calibration, and bankroll risk.
3. Never claim guaranteed returns.
4. Prefer small, reviewable changes over broad rewrites.
5. Use TypeScript in strict mode.
6. Keep file and component names lowercase with hyphen separation where practical.
7. Keep business logic in `lib/`, API handlers in `app/api/`, UI composition in `app/` and `components/`.
8. Maintain Linux compatibility. File paths must be case-correct.
9. Do not add external paid APIs without documenting pricing, rate limits, fallback behavior, and environment variables.
10. Any model, probability, EV, or staking change must include a short mathematical rationale in the PR or commit notes.

## Frontend Agent Skill

### Scope

Frontend agents own the Next.js 15, React 19, Tailwind CSS, accessibility, and product UI layer.

### Responsibilities

- Build mobile-first and desktop-ready UI.
- Implement quant-terminal style views: signal feed, signal detail, Kelly calculator, bankroll tracking, pricing, and API docs.
- Use server components by default.
- Use client components only when interactivity requires browser state, effects, or event handlers.
- Keep visual language premium, analytical, and restrained.
- Ensure WCAG 2.2 AA accessibility standards.

### Standards

- Use semantic HTML before custom div-heavy structures.
- Every interactive element must be keyboard accessible.
- Buttons must be real `<button>` elements unless navigation requires links.
- Inputs must have labels or accessible names.
- Do not rely on color alone to communicate state.
- Maintain visible focus states.
- Keep text contrast high on dark backgrounds.
- Use responsive layouts from mobile upward.

### File conventions

- Components: `components/signal-card.tsx`, `components/metric-card.tsx`.
- App routes: `app/dashboard/page.tsx`, `app/kelly/page.tsx`.
- Avoid uppercase component filenames unless the existing project already uses them.
- Co-locate route-specific UI inside the route folder only when it is not reused.

### Forbidden changes

- Do not add gambling entertainment visuals such as slot machines, roulette, casino chips, or neon casino styling.
- Do not add fake testimonials implying profit certainty.
- Do not create inaccessible custom controls.

## Backend Agent Skill

### Scope

Backend agents own API routes, validation, mathematical correctness, Prisma access, Supabase compatibility, security controls, and data integrity.

### Responsibilities

- Implement EV, implied probability, Kelly, bankroll, signal, and API-key logic.
- Validate every external input with Zod or equivalent explicit validation.
- Keep calculation functions pure and testable.
- Keep route handlers thin; move business logic into `lib/`.
- Use Prisma efficiently: select only required fields, avoid unbounded queries, and add pagination where needed.
- Design Supabase compatibility with row-level security in mind.
- Protect B2B endpoints with API keys, rate limits, and audit-friendly response patterns.

### Mathematical standards

Use decimal odds as the canonical internal odds format unless a route explicitly converts from another format.

Implied probability:

```text
impliedProbability = 1 / decimalOdds
```

Expected value:

```text
ev = modelProbability * decimalOdds - 1
```

Kelly fraction:

```text
b = decimalOdds - 1
p = modelProbability
q = 1 - p
fullKelly = (b * p - q) / b
fractionalKelly = max(0, fullKelly) * kellyFraction
```

Stake cap:

```text
stake = min(bankroll * fractionalKelly, bankroll * maxStakePct)
```

### Validation rules

- `bankroll > 0`
- `decimalOdds > 1`
- `0 < modelProbability < 1`
- `0 < kellyFraction <= 1`
- `0 < maxStakePct <= 100`
- Dates must be ISO-compatible.
- API keys must never be stored in plaintext.
- Do not leak whether a specific API key exists.

### Security standards

- Hash API keys before persistence.
- Use constant-time comparison where practical.
- Add rate limits to protected routes.
- Never expose secrets to the client.
- Use `NEXT_PUBLIC_` only for values safe to expose.
- Avoid logging raw API keys, tokens, user bankroll details, or personal information.

### Supabase / RLS constraints

- Treat user-owned rows as private by default.
- Any Supabase table design must include ownership or tenant scoping.
- RLS policies must deny by default and allow only explicit access patterns.
- B2B tenants must not share data unless deliberately configured.

## Review & Docs Agent Skill

### Scope

Review agents act as QA, architecture guardrails, documentation maintainers, and release-readiness reviewers.

### Responsibilities

- Review security, correctness, architecture, accessibility, and operational readiness.
- Verify mathematical formulas and edge-case behavior.
- Check that frontend changes follow WCAG 2.2 AA expectations.
- Check Linux path compatibility and case-sensitive imports.
- Ensure docs match implementation.
- Reject vague claims, guaranteed-return wording, and hype language.

### Review checklist

Use this standard format:

```md
# Review report

## Summary

One to three sentences on what changed and whether it is safe to merge.

## Blocking issues

- [ ] Issue, file, line, impact, required fix.

## Non-blocking issues

- [ ] Issue, file, line, impact, recommended fix.

## Security

- API key handling:
- Auth / authorization:
- Data leakage risk:
- Logging risk:

## Mathematical correctness

- Implied probability:
- EV calculation:
- Kelly sizing:
- Stake caps:
- Edge cases:

## Accessibility

- Keyboard access:
- Labels and names:
- Contrast:
- Focus states:
- Reduced-motion considerations:

## Architecture

- Route boundaries:
- Business logic placement:
- Database access:
- Scalability:

## Documentation impact

- README:
- Environment variables:
- API examples:
- Migration notes:

## Verdict

Approve / request changes / needs manual test.
```

### Documentation standards

- Keep setup instructions executable.
- Document every required environment variable.
- Include curl examples for public and protected API routes.
- Mark demo data clearly as demo data.
- Keep risk and compliance copy visible for betting-related features.

## Architecture boundaries

### Allowed

- Next.js App Router pages and API routes.
- React server components by default.
- Tailwind CSS utility styling.
- Prisma for database access.
- Zod for input validation.
- Supabase-compatible schema decisions.
- Protected B2B API endpoints.

### Requires explicit review

- New external data providers.
- Real-money execution integrations.
- Automated bet placement.
- User identity and subscription billing changes.
- Model changes that affect probability, EV, or stake sizing.
- Changes to bankroll risk logic.

### Forbidden without compliance review

- Guaranteed profit language.
- Automated real-money betting execution.
- Hidden affiliate routing.
- Unclear odds sourcing.
- Storing plaintext API keys.
- Exposing private user betting history across tenants.

## Definition of done

A change is complete only when:

1. It builds successfully.
2. TypeScript passes.
3. Public UI is keyboard accessible.
4. API inputs are validated.
5. Mathematical behavior is documented when changed.
6. Security-sensitive routes avoid secret leakage.
7. README or docs are updated when setup, API, or environment behavior changes.
