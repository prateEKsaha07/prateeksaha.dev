import type { Work } from './index'

export const geargrid: Work = {
  slug: 'geargrid',
  title: 'GearGrid',
  tag: 'Full Stack · Marketplace',
  summary: 'A peer-to-peer farm equipment rental marketplace. Small farmers rent tractors, tillers, harvesters, and sprayers from nearby owners instead of buying them — with slot-based booking, digital handover agreements, and reliability scoring. Built solo for the Tata Young Social Innovators Challenge 2026.',
  date: 'September 2026 – present',
  live: null,
  github: 'https://github.com/prateEKsaha07',

  facts: {
    stack: ['React', 'FastAPI', 'Supabase', 'Vite', 'Tailwind'],
    database: 'Supabase Postgres · Row Level Security',
    auth: 'Supabase Auth (unified profile)',
    realtime: 'Supabase Edge Functions · pg_cron',
    hosting: 'Vercel (frontend) · Render (backend)',
    status: 'In active development — POC phase',
  },

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `Small and marginal farmers in India often can't afford to buy mechanized equipment — a single tractor can cost more than a year's income. So they either skip mechanization entirely or pay informal middlemen a markup for rentals. Meanwhile, equipment owned by larger farmers sits idle for most of the season with no reliable way to reach nearby farms that need it.

**GearGrid is a peer-to-peer marketplace for farm equipment rental.** Owners list idle equipment; farmers browse listings or post a request. Owners pick from incoming bids. A slot-based booking calendar lets the same equipment be booked by multiple farmers on different dates without conflict. Digital handover agreements, OTP verification, and condition photos at pickup and return create a real trust layer — not just a listing board.

The project was built for the **Tata Young Social Innovators Challenge 2026** (Sector: Agriculture; Problem Statement: *"How can small farmers share expensive equipment instead of owning it?"*). It adapts the reverse-marketplace architecture from MarketFlip — request/bid lifecycle, pincode matching, reliability scoring — and repurposes it for a domain where the same dynamics matter but the stakes are higher.

It's built solo, in phases. Currently in the POC stage, with the schema fully designed and the core booking flow in progress.`,
    },
    {
      id: 'architecture',
      title: 'Architecture',
      content: `GearGrid follows the same three-layer structure as MarketFlip — a React SPA on Vercel, a FastAPI backend on Render, and Supabase as the persistence and auth layer. Background work runs on Supabase Edge Functions and pg_cron.

\`\`\`mermaid
flowchart LR
    Browser([User Browser]) -->|HTTPS| FE[React SPA<br/>Vercel]
    FE -->|REST + Bearer token| API[FastAPI<br/>Render]
    API -->|Supabase SDK| SB[(Supabase<br/>Postgres + Auth + RLS)]
    API -->|Photo upload| CLD[Cloudinary]
    API -->|Voice input| WS[Web Speech API<br/>browser-native]
    API -.->|scheduled| EF[Supabase Edge Functions<br/>expiry · reminders · cron]
    EF --> SB
\`\`\`

**Request flow.** The SPA calls FastAPI with a Supabase Bearer token. FastAPI validates against Supabase Auth and executes the query via the Supabase Python SDK. RLS is enabled as a secondary safety net — the backend checks ownership rules first.

**Role model.** Unlike MarketFlip, GearGrid has no fixed owner/renter role per account. Every user is a single unified profile. Whether someone acts as owner or renter is determined **per-listing** and **per-request** — the same user can list a tractor and rent a sprayer in the same session. This was a deliberate design choice; fixed roles don't match how farming equipment actually gets shared.

**Voice input.** Posting a rental request supports voice capture via the browser-native Web Speech API. This targets low-literacy users who can describe what they need verbally but may struggle with typed forms. No external API — the Web Speech API is free and runs in the browser.

**Photo handling.** Every photo — equipment listings, profile photos, condition photos at pickup and return — goes through Cloudinary. Chosen over Supabase Storage for multi-image handling and on-the-fly transformations.

**Background work.** Return reminders, auto-expiry of stale requests, and rating prompts run on Supabase Edge Functions scheduled with pg_cron. Same pattern as MarketFlip's auction closure.`,
    },
    {
      id: 'data-model',
      title: 'Data model',
      content: `The schema is fully designed — thirteen tables covering the rental lifecycle from listing to return to dispute record. Some are implemented; others are designed ahead of the phase where they'll be built.

\`\`\`mermaid
erDiagram
    USERS ||--o{ EQUIPMENT_LISTINGS : owns
    USERS ||--o{ RENTAL_REQUESTS : posts
    USERS ||--o{ BIDS : places
    USERS ||--|| RELIABILITY_SCORES : has
    USERS ||--o{ NOTIFICATIONS : receives

    EQUIPMENT_CATEGORIES ||--o{ EQUIPMENT_LISTINGS : classifies
    EQUIPMENT_LISTINGS ||--o{ BIDS : receives
    RENTAL_REQUESTS ||--o{ BIDS : receives

    BIDS ||--o| BOOKINGS : confirms
    BOOKINGS ||--o{ AGREEMENTS : has
    BOOKINGS ||--o{ RATINGS : has
    BOOKINGS ||--o{ EXTENSION_REQUESTS : has
    BOOKINGS ||--o{ PAYMENT_CONFIRMATIONS : has
    BOOKINGS ||--|| INVOICES : generates

    USERS {
        uuid id PK
        text name
        text phone
        text pincode
        text language_pref
        bool id_verified
    }
    EQUIPMENT_CATEGORIES {
        uuid id PK
        text name
        text group
    }
    EQUIPMENT_LISTINGS {
        uuid id PK
        uuid owner_id FK
        uuid category_id FK
        text title
        decimal price_per_day
        text pincode
        text status
    }
    RENTAL_REQUESTS {
        uuid id PK
        uuid renter_id FK
        text category
        date needed_from
        date needed_to
        text pincode
        text status
        bool voice_input_used
    }
    BIDS {
        uuid id PK
        uuid listing_id FK
        uuid request_id FK
        uuid bidder_id FK
        decimal proposed_price
        date proposed_start
        date proposed_end
        text status
    }
    BOOKINGS {
        uuid id PK
        uuid listing_id FK
        uuid bid_id FK
        uuid owner_id FK
        uuid renter_id FK
        date start_date
        date end_date
        decimal deposit_amount
        text status
    }
    AGREEMENTS {
        uuid id PK
        uuid booking_id FK
        text stage
        text condition_photo_url
        bool otp_verified
    }
    RELIABILITY_SCORES {
        uuid user_id PK
        decimal owner_score
        decimal renter_score
        int non_return_flags
    }
\`\`\`

**The booking calendar is the hardest part of the data model.** A listing can be bid on by multiple renters at once, but only one booking can own any given date range. When a bid is accepted, overlapping pending bids are rejected automatically with status \`auto_rejected_overlap\`. Enforcing this consistently requires transactional checks at the database level, not just application logic.

**Role is per-listing, not per-user.** Unlike MarketFlip where a user is either a buyer or a shop owner, GearGrid users have no fixed role. The same person can own three listings and have two active rental requests. This shaped the reliability score design — separate scores for the owner-role and renter-role, computed independently.

**Two-stage ratings.** Both parties rate each other twice — once at pickup, once at return. Different criteria apply at each stage (condition-as-described at pickup, condition-on-return-ok at return). This catches the two failure modes that matter: the equipment arriving in worse condition than listed, and the equipment coming back damaged.

**Payments are recorded, not processed.** No money moves through the app in the POC. Payments happen directly between renter and owner, and each side confirms via \`payment_confirmations\`. Invoices are generated for every completed booking, snapshotting rental days, price, deposit position, commission, and tax — so that when a payment gateway is added, these tables gain gateway transaction IDs rather than being redesigned.`,
    },
    {
      id: 'api',
      title: 'API design',
      content: `The FastAPI backend exposes a REST API grouped by rental lifecycle stage. All routes except auth require a Bearer token. Route list reflects the current design — some are implemented, others are specified and pending build.`,
    },
    {
      id: 'trust-layer',
      title: 'Trust layer',
      content: `The most important design decision in GearGrid wasn't the marketplace mechanics — it was the trust layer. A listing board alone doesn't solve the problem because farmers already have informal channels; what's missing is a way to trust the transaction.

Four pieces make up the trust layer:

**Digital handover agreements.** Two agreement records per booking — one at pickup, one at return. Each captures a condition photo, notes, and signatures from both parties. This is the primary record if a dispute arises: what did the equipment look like when it left, what did it look like when it came back.

**OTP exchange at handover.** When equipment changes hands, both parties confirm with a one-time code. This prevents the "I never received it" / "I never handed it over" class of disputes. Similar to MarketFlip's delivery verification, but applied to a two-way physical handover.

**Condition photos.** Cloudinary-hosted photos at pickup and return give objective evidence of condition. Age and usage wear are inevitable on rented equipment; the photos make damage visible and attributable.

**Two-stage ratings.** Every transaction produces up to four ratings (each party rates the other at pickup and at return). Ratings feed into a role-specific reliability score — separate values for someone's record as an owner and their record as a renter. A user with a strong owner score and a weak renter score is a different signal than someone strong in both.

**Non-return flagging.** If equipment is not returned, either party can flag it. This creates a permanent record and feeds into reliability scoring. An escalation path exists for disputed cases.

Together, these four pieces turn a rental listing board into a marketplace with real accountability. Without them, the platform would be an app-based version of the informal middleman problem it's trying to solve.`,
    },
    {
      id: 'progress',
      title: 'Where it stands',
      content: `GearGrid is being built solo in phases. The roadmap has eight phases; progress as of this writing:

- **Phase 0 — Setup.** Complete. Repo structure mirrors MarketFlip (\`gg-core\`, \`gg-web\`, \`gg-docs\`).
- **Phase 1 — Core schema & auth.** In progress. Thirteen tables defined; core tables (\`users\`, \`equipment_listings\`, \`rental_requests\`, \`bids\`, \`bookings\`) designed and being migrated.
- **Phase 2 — Listing & request flow.** Being built.
- **Phase 3 — Slot calendar.** Planned.
- **Phase 4 — Trust layer.** Planned. This is the largest phase — agreements, OTP, condition photos, deposits, invoices.
- **Phase 5 — Extension & relist.** Planned.
- **Phase 6 — Trust & anti-fraud.** Planned. Reliability scoring reuses the MarketFlip pattern with a role split.
- **Phase 7 — Accessibility.** Planned. Voice input via Web Speech API, SMS return reminders.
- **Phase 8 — Polish & deploy.** Planned.

**Timeline.** The submission for TYSIC is due mid-October 2026. The full working trust layer — Phases 1 through 6 — is targeted for the semi-finale round, dates to be announced. Everything after that (payment gateway, group pooling, insurance, multilingual expansion) is deferred as post-POC.

**What's reused from MarketFlip.** The request/bid lifecycle pattern, pincode-based matching, the \`is_success\` status-flag convention, reliability scoring, and the overall project structure. GearGrid is a repurposing of that architecture into a domain where the same shape of problem — two-sided marketplace with trust as the bottleneck — matters more.`,
    },
    {
      id: 'decisions',
      title: 'Design decisions',
      content: `A few choices worth calling out, because they shaped the build more than the feature list does.

**Unified profile, no fixed role.** Most marketplaces assign a role at signup — you're a buyer or a seller, and that's what you are. Farmers don't work that way. Someone who owns a tractor might need to rent a sprayer for the same harvest. The role is a property of each listing and each request, not of the account. This sounds like a small change and cascades through the whole schema: reliability scores split by role, permission checks per listing, the UI adapting contextually. Worth it — a fixed-role model would have felt wrong from day one.

**Slot-based booking, not single-tenant.** When a farmer rents a tractor for two days in harvest season, the tractor isn't gone for the season — it's gone for those two days. Multiple renters need to book the same equipment on non-overlapping dates. This is the calendar problem, and it's what makes GearGrid different from a simple "post and buy" marketplace. Enforcing overlap checks correctly means transactional locks at the database level — application logic alone can't prevent two simultaneous bids from both being accepted.

**Payments recorded, not processed.** The POC doesn't move money. Renters and owners pay each other directly, and the app records that a payment happened via two-party confirmation. This is intentional — integrating a payment gateway is a compliance and integration project, not a feature. The data model is built so that when a gateway is added, it slots into the existing tables without a migration.

**Category-specific fields, nullable.** Tractor listings need \`registration_number\`, \`fuel_type\`, \`horsepower\`. Sprayer listings need \`power_source\`, \`capacity_spec\`. Hand tools need \`condition_grade\` and nothing else. Rather than building one giant generic listing table, the schema uses a category reference table with a \`group\` field (handheld / vehicle / stationary) that determines which extra fields show up in the UI. All category-specific fields are nullable — the UI conditionally renders them.

**Design the whole schema up front.** Thirteen tables exist in the schema even though only five are being actively built in Phase 1. Fields like \`farm_size_acres\`, \`years_farming\`, and \`is_fpo_member\` are defined but nullable and unused at MVP. This is deliberate: adding columns to a Postgres table after it has live data is annoying, adding empty nullable columns now costs nothing. The tradeoff is a schema that looks bigger than the current build — worth it to avoid migrations later.`,
    },
    {
      id: 'next',
      title: "What's next",
      content: `The next three phases are the ones that matter for the TYSIC submission:

**Phase 3 — Slot calendar.** The core value of the platform. Without it, GearGrid is a listing board; with it, it's a system that solves the actual coordination problem.

**Phase 4 — Trust layer.** Agreements, OTP, condition photos, deposit confirmation, invoice generation. The largest phase and the one that turns a demo into something a farmer would actually use.

**Phase 7 — Accessibility.** Voice input and SMS reminders are the features that make this usable by the audience it's built for. A farmer who can't easily type a request, or doesn't check the app daily, needs both.

Beyond the POC, the deferred list is long: group pooling (multiple farmers co-renting one machine), smart ranked matching, demand prediction, predictive maintenance, barter/exchange flows, FPO integration, weather-aware scheduling, and eventually an in-app payment gateway with escrow-held deposits.

None of that ships before the core loop works.`,
    },
  ],
}