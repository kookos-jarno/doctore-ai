# Doctore AI mobile UI/UX wireframe

## Objective

Create a mobile-first dark-mode user flow for Doctore AI that moves a user from betting-feed discovery into pick evaluation, authentication, filtering, analytics, and conversion.

The product position remains:

> Edge, not picks.

The UI must feel like a disciplined quant terminal, not a casino or casual tipster app.

## Visual direction

### Theme

- Mode: dark-only MVP
- Background: near-black / deep navy
- Text: white and muted grey
- Interactions: muted green, steel blue, low-saturation accent states
- Cards: elevated dark panels with subtle borders
- Graphs: simple monochrome or muted accent lines

### Tone

- Analytical
- Premium
- Calm
- Trustworthy
- Data-first

Avoid:

- Neon casino styling
- Flashy guaranteed-win language
- Overloaded dashboards
- Excessive animation
- Loud colors

## Mobile flow overview

```text
[Betting Feed]
      |
      v
[Tracked Pick Detail]
      |
      v
[Sign In / Sign Up]
      |
      v
[Filters]
      |
      +----> [Analytics]
                 |
                 v
          [Login / Trial CTA]
```

Alternative board direction:

```text
Betting Feed  --->  Tracked Picks  --->  Sign In
                                      |
                                      v
Analytics    <---     Filters    <--- CTA / Login
```

## Screen 1: Betting Feed

### Purpose

Introduce quantified picks with edge, confidence, and a visible free-trial CTA.

### Primary content

- App header: `Doctore AI`
- Subheading: `Quant betting feed`
- Hero pick card:
  - Market: `MLB Moneyline`
  - Pick: `Team A to Win`
  - Odds: `2.10`
  - EV: `+10.9%`
  - Confidence: `72%`
  - CTA: `Start Free Trial`

### Wireframe

```text
┌─────────────────────────┐
│ Doctore AI        PRO   │
│ Quant betting feed      │
├─────────────────────────┤
│ Featured Edge           │
│ Team A to Win           │
│ MLB Moneyline           │
│ EV +10.9%   Conf 72%    │
│ Odds 2.10   Stake €42   │
│ [Start Free Trial]      │
├─────────────────────────┤
│ Upcoming edges          │
│ Team C total over       │
│ Team D ML               │
└─────────────────────────┘
```

## Screen 2: Tracked Pick Detail

### Purpose

Give the user enough analysis to understand why the pick exists and whether it is actionable.

### Primary content

- Pick title: `Team A to Win`
- Confidence metric
- EV metric
- Model probability
- Implied probability
- Suggested stake
- Analysis bullets

### Wireframe

```text
┌─────────────────────────┐
│ ← Pick Detail           │
├─────────────────────────┤
│ Team A to Win           │
│ Confidence 72%          │
│ EV +10.9%               │
│ Model 58.5%             │
│ Market 47.6%            │
├─────────────────────────┤
│ Analysis                │
│ • Pitching edge         │
│ • Market mispricing     │
│ • Line movement stable  │
├─────────────────────────┤
│ Suggested stake €42     │
│ [Track Pick]            │
└─────────────────────────┘
```

## Screen 3: Sign In / Sign Up

### Purpose

Gate deeper actions after the user has already seen value.

### Primary content

- Headline: `Track your edge history`
- Sign in CTA
- Sign up CTA
- Benefit bullets:
  - Save tracked picks
  - Unlock filters
  - View analytics

## Screen 4: Filters

### Purpose

Allow users to sort and narrow the feed by signal quality.

### Filter groups

- Sport: MLB, NBA, NHL
- EV: +3%, +5%, +10%
- Confidence: 60%+, 70%+, 80%+

### UX rules

- Use chips or segmented controls.
- Keep controls usable with one hand.
- Default filters should surface high-signal picks.

## Screen 5: Analytics

### Purpose

Show performance credibility and help users evaluate the model beyond a single pick.

### Primary content

- Line graph
- Win rate
- ROI
- Tracked picks
- Average EV
- Recent outcomes

## Screen 6: CTA / Login variant

### Purpose

Bring the user back to conversion after they have seen analytics value.

### Primary content

- Headline: `Unlock full tracking`
- CTA: `Start Free Trial`
- Secondary: `Log In`
- Trust copy: `No guaranteed returns. Analytics only.`

## Navigation model

Recommended bottom navigation:

```text
Feed | Filters | Analytics | Account
```

## Conversion logic

1. Feed preview: public or soft-gated.
2. Pick detail: partial preview.
3. Track pick: requires sign-up.
4. Filters: requires sign-up.
5. Analytics: partial preview, full view requires trial.
6. API/B2B routes: API key protected.

## Content rules

Use:

- `Expected value`
- `Model probability`
- `Market implied probability`
- `Suggested stake`
- `Tracked pick`
- `Confidence score`

Avoid:

- `Lock`
- `Guaranteed win`
- `Easy money`
- `Risk-free`
- `Sure bet`

## Implementation notes

The Vercel-ready prototype is implemented in:

```text
app/page.tsx
app/layout.tsx
app/globals.css
```

No charting or UI dependency is required for the MVP wireframe.
