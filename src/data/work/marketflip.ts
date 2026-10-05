import type { Work } from './index'

export const marketflip: Work = {
  slug: 'marketflip',
  title: 'MarketFlip',
  tag: 'Full Stack · Marketplace',
  summary: 'A reverse marketplace for local commerce — buyers post what they need, nearby shops send in competitive offers. Also supports shop-created auctions with live bidding, a real-time chat layer, OTP-based delivery verification, an AI assistant for natural-language request parsing and Q&A, and a five-model ML module.',
  date: 'March – September 2026',
  live: 'https://marketflip-mauve.vercel.app',
  github: 'https://github.com/prateEKsaha07/marketflip',

  facts: {
    stack: ['React 19', 'FastAPI', 'Supabase', 'Vite', 'Tailwind', 'scikit-learn'],
    database: 'Supabase Postgres · Row Level Security',
    auth: 'Supabase Auth (JWT via Bearer)',
    realtime: 'Supabase Realtime (chat subscriptions)',
    hosting: 'Vercel (frontend) · Render (backend)',
    status: 'Paused — Supabase free tier limit, auth offline',
  },

  sections: [
    // ── 01 ──
    {
      id: 'overview',
      title: 'Overview',
      content: `MarketFlip is a **reverse marketplace**. Instead of browsing shop inventory and hoping they have what you need, you publish a request — what you want, a budget range, your pincode — and nearby shop owners send in competitive offers. You compare bids, chat with shops, select an offer, and confirm delivery with a 4-digit verification code.

The platform also supports **shop-created auctions with live bidding**, because the same two-sided dynamics work in both directions.

The stack is React 19 on Vercel, FastAPI on Render, Supabase for Auth + Postgres + Realtime, and Cloudinary for image uploads. On top of that sits an **AI Assistant** — a floating orb on the dashboard that parses natural-language requests into structured drafts (via Google Gemini) and answers data questions about a buyer's own requests and bids. A five-model **ML module** runs inside the same FastAPI process for price suggestions, bid ranking, recommendations, demand forecasting, and fraud detection.

The project is currently **paused**. The Supabase free tier allows two projects, and I needed the second slot for a new build. Code is intact; live auth is offline.`,
    },

    // ── 02 ──
    {
      id: 'architecture',
      title: 'Architecture',
      content: `Three layers: the SPA on Vercel, the FastAPI backend on Render, and Supabase as the persistence and auth layer. Realtime chat, the AI assistant, and the ML module attach to that base.

\`\`\`mermaid
flowchart LR
    Browser([User Browser]) -->|HTTPS| FE[React 19 SPA<br/>Vercel]
    FE -->|REST + Bearer token| API[FastAPI<br/>Render]
    FE <-->|Postgres changes| RT[Supabase Realtime]
    API -->|Supabase SDK| SB[(Supabase<br/>Postgres + Auth + RLS)]
    RT -->|subscription| SB
    API -->|Parse + Q&A| GEM[Google Gemini<br/>Flash-Lite]
    API -->|Image upload| CLD[Cloudinary]
    API -.->|in-process| ML[ML module<br/>5 models · .joblib]
    API -.->|scheduled| EF[Supabase Edge Functions<br/>close-auctions · expire-requests]
    EF --> SB
\`\`\`

**Request flow.** The SPA calls FastAPI over HTTPS with a Supabase access token in the Authorization header. FastAPI validates the token against Supabase Auth, then executes the query against Postgres using the Supabase Python SDK. RLS is enabled on every app table — the backend uses both anon and service-role clients depending on the operation.

**Auth flow.** Signup and login are FastAPI routes that proxy to Supabase Auth. On login, the frontend stores the access token and attaches it to every subsequent call. There is no app-issued JWT — Supabase issues and validates the tokens.

**Chat flow.** Messages are stored in the \`messages\` table via FastAPI HTTP routes. The frontend subscribes to new INSERT events using Supabase Realtime. There is no backend WebSocket route. Rate limit is one message per two seconds.

**ML placement.** All five ML models load inside the FastAPI process from local \`.joblib\` artifacts. Nothing runs as a separate service. This works for small models but couples ML deployment with API deployment — noted honestly in the "What I'd do differently" section.

**Scheduled jobs.** Two Supabase Edge Functions run on a schedule — \`close-auctions\` (with 5-minute sniping protection) and \`expire-requests\`. They connect directly to Postgres.`,
    },

    // ── 03 ──
    {
      id: 'data-model',
      title: 'Data model',
      content: `The schema supports two parallel marketplace models plus chat, notifications, reviews, and reliability scoring. Auth lives in Supabase's \`auth.users\`; app-specific profile data lives in a separate \`profiles\` table keyed by the auth user ID.

\`\`\`mermaid
erDiagram
    PROFILES ||--o{ REQUESTS : posts
    PROFILES ||--o{ BIDS : submits
    PROFILES ||--o{ AUCTIONS : lists
    PROFILES ||--o{ AUCTION_BIDS : places
    PROFILES ||--o{ CONVERSATIONS : participates
    PROFILES ||--o{ REVIEWS : writes
    PROFILES ||--o{ NOTIFICATIONS : receives
    PROFILES ||--|| SHOP_RELIABILITY_SCORES : has

    REQUESTS ||--o{ BIDS : receives
    REQUESTS ||--o{ REQUEST_EVENTS : generates
    AUCTIONS ||--o{ AUCTION_BIDS : receives
    AUCTIONS ||--o{ AUCTION_CLOSE_EVENTS : logs

    CATEGORIES ||--o{ REQUESTS : classifies
    CATEGORIES ||--o{ AUCTIONS : classifies

    CONVERSATIONS ||--o{ MESSAGES : contains
    CONVERSATIONS ||--o{ CONVERSATION_ACTIVE_TRANSACTIONS : tracks

    PROFILES {
        uuid id PK
        text role
        text shop_name
        text address
        text pincode
        text phone
        bool is_verified
        int total_transactions
    }
    REQUESTS {
        uuid id PK
        uuid buyer_id FK
        text item_name
        decimal budget_min
        decimal budget_max
        text pincode
        uuid category_id FK
        text status
        text verification_code
    }
    BIDS {
        uuid id PK
        uuid request_id FK
        uuid shop_id FK
        decimal price
        text note
        text status
    }
    AUCTIONS {
        uuid id PK
        uuid shop_id FK
        text item_name
        decimal starting_price
        decimal reserve_price
        decimal current_highest_bid
        text status
        timestamptz end_time
    }
    AUCTION_BIDS {
        uuid id PK
        uuid auction_id FK
        uuid buyer_id FK
        decimal bid_amount
    }
    CONVERSATIONS {
        uuid id PK
        uuid buyer_id FK
        uuid shop_id FK
        text active_source_type
        uuid active_source_id FK
        bool locked
    }
    MESSAGES {
        uuid id PK
        uuid conversation_id FK
        uuid sender_id FK
        text content
        bool is_read
    }
    SHOP_RELIABILITY_SCORES {
        uuid shop_id PK
        int avg_response_time_minutes
        decimal completion_rate
        decimal selection_rate
        decimal reliability_score
    }
    CATEGORIES {
        uuid id PK
        text name
        uuid parent_category_id FK
    }
\`\`\`

**Two marketplace models.** Requests let buyers drive — shops bid downward against a buyer's budget. Auctions let shops drive — buyers bid upward until the timer expires. They share chat, notifications, verification, and reliability, but the direction of competition is opposite.

**Chat unlocking.** A conversation between a buyer and a shop is locked until there's an active transaction between them — a selected bid on a request, or a winning auction bid. The \`conversation_active_transactions\` table tracks which request or auction currently unlocks the conversation.

**Reliability scoring.** Each shop has a materialized score computed from three components: response time (30%), completion rate (35%), and selection rate (35%). The score feeds into bid ranking on the buyer's side.`,
    },

    // ── 04 ──
    {
      id: 'api',
      title: 'API design',
      content: `The FastAPI backend exposes a REST API grouped by domain. All routes except auth require a Bearer token.

**Auth**
- \`POST /auth/signup\` · \`POST /auth/login\`
- \`GET /auth/profiles/{id}\` · \`PATCH /auth/profiles/{id}\`

**Requests** — buyer-driven marketplace
- \`POST /requests\` · \`GET /requests\` · \`GET /requests/{id}\`
- \`POST /requests/{id}/bids\` — shop submits a bid

**Bids**
- \`GET /bids\` · \`GET /bids/{id}\`
- \`PATCH /bids/{id}/select\` — buyer selects a winning bid

**Auctions** — shop-driven marketplace
- \`POST /auctions\` · \`GET /auctions\` · \`GET /auctions/{id}\`
- \`POST /auctions/{id}/bids\` — buyer places a bid

**Chat**
- \`GET /chat/conversations\` · \`GET /chat/conversations/{id}/messages\`
- \`POST /chat/conversations/{id}/messages\` · \`PATCH /chat/conversations/{id}/read\`

**AI Assistant** (buyer-side, shipped)
- \`POST /ai/parse-request\` — natural language → structured request draft
- \`PATCH /ai/parse-request/{log_id}\` — record buyer's accept/edit choice
- \`GET /ai/categories\` · \`POST /ai/ask\`

**ML**
- \`POST /ml/price-suggestion\` · \`POST /ml/rank-bids\`
- \`GET /ml/recommendations\` · \`GET /ml/demand-forecast\`
- \`POST /ml/detect-fraud\`

**Chat transport.** No WebSocket route exists on the backend. Chat history and message sending go over REST. The frontend subscribes to new rows via Supabase Realtime's Postgres changes channel.

**AI Assistant architecture.** The assistant has two pipelines sharing one UI shell — one for parsing natural language into request drafts, one for answering questions about the buyer's data. The Q&A pipeline uses a provider registry pattern: each data domain exposes a \`fetch(user_id)\` function and a list of intent keywords. The registry matches keywords against the question, picks the relevant providers, fetches their data in parallel, and passes the combined context to Gemini. Adding a new data domain requires no changes to the core pipeline.`,
    },

    // ── 05 ──
    {
      id: 'ml-module',
      title: 'ML module',
      content: `The ML module is a folder inside the FastAPI backend — five models, all packaged as \`.joblib\` artifacts, all loaded at startup. Nothing runs as a separate service. The goal was to add intelligence to the marketplace without introducing a new deployment target.

\`\`\`mermaid
flowchart LR
    subgraph Data[Data layer]
        DL[data_loader.py<br/>Supabase queries]
        DF[data_source flag<br/>seed or live]
    end

    subgraph Models[Models]
        P[Price Suggestion<br/>Linear Regression]
        R[Bid Ranking<br/>Weighted Scoring]
        REC[Recommendations<br/>Apriori]
        FC[Demand Forecast<br/>Moving Average]
        FR[Fraud Detection<br/>RandomForest]
    end

    subgraph API[Prediction API]
        EP[ml/routes.py<br/>5 endpoints]
    end

    DL --> P
    DL --> R
    DL --> REC
    DL --> FC
    DL --> FR
    DF --> DL

    P --> EP
    R --> EP
    REC --> EP
    FC --> EP
    FR --> EP

    EP -->|REST| FE[Frontend dashboards]
\`\`\`

**The five models:**

| Model | Algorithm | Purpose |
|---|---|---|
| **Price Suggestion** | Linear Regression | Suggest a fair price for a new buyer request |
| **Bid Ranking** | Weighted Scoring | Order a buyer's bids by price and shop reliability |
| **Recommendations** | Apriori | Suggest related categories from transaction history |
| **Demand Forecast** | Moving Average | Show shops what demand looks like in the next 7 days |
| **Fraud Detection** | RandomForest | Flag suspicious bids for review |

**Bid ranking combines two signals.** How close a bid is to the buyer's budget midpoint, and the shop's reliability score. Weighting is 60% price, 40% reliability. Both inputs come from existing tables. Output is a sorted list the frontend renders directly.

**Price suggestion is a linear regression** trained on the seed dataset after cleaning. Features: budget range, budget midpoint, category, and pincode. The model artifact loads at API startup and responds on the \`/ml/price-suggestion\` endpoint.

**Recommendations run on transaction history.** Apriori generates association rules from item co-occurrence — \`{electronics, smartphone} → {headphones}\`. Rules are computed from the seed dataset and returned as ranked suggestions with confidence values.

**Demand forecasting is a moving average.** It takes the last N days of \`request_events\`, groups by category, and produces a 7-day forecast with a confidence band.

**Fraud detection uses a RandomForest classifier.** Features: price deviation from budget range, shop response time, total bids by shop, and bid note length. It returns a fraud probability and the contributing risk factors.

**Testing.** The ML module has a single test file — \`ml/test_ml.py\` — that loads the seed data and exercises all five models end-to-end. It verifies each model loads, predicts, and returns the expected output shape.`,
    },

    // ── 06 ──
    {
      id: 'ml-notes',
      title: 'ML: design notes',
      content: `The ML module is a prototype — five models that load, respond, and integrate with the marketplace UI. Building it taught me more about the constraints of applied ML than about the algorithms themselves.

**Bid ranking is the most useful of the five.** It's a weighted scoring system, not a trained model — 60% price, 40% shop reliability. The weights come from the business logic (buyers care about price most, then shop trust). It's explainable, deterministic, and doesn't need a model artifact. A good reminder that not everything benefits from machine learning; a well-chosen heuristic often beats a poorly-trained model.

**Recommendations run on real transaction history.** Apriori association rules are interpretable, come from actual co-occurrence, and don't have a model-class assumption to be wrong about. This is the kind of ML feature that fits naturally into a marketplace.

**Price suggestion, demand forecasting, and fraud detection are prototypes.** Each has a working endpoint and a loaded model. Each would benefit from more data before being trusted in production. The code is built to accept more data — the training pipeline reads from the same Supabase tables the app writes to, and switching from seed data to live data is a config flag.

**The five models taught me more about limitations than capabilities.** Small data, weak features, and no labeling strategy will produce models that technically load, technically predict, and technically return numbers — while being useless in practice. Building this module is why I now ask "how much data do we actually have?" before considering a model at all.

**Design choices that worked:**

- **Everything is in one folder** — \`ml/\` has five model files, one training pipeline, one test suite, one config. Onboarding is fast.
- **Seed vs live data flag** — \`TRAINING_DATA_SOURCE\` in \`config.py\` switches the whole module between generated test data and real user data. No code changes.
- **Feature flags per model** — each model can be enabled or disabled independently in config. Shipping one model doesn't require shipping the others.
- **Same FastAPI process** — no separate service, no extra deploy target, no queue. Loads at startup, responds inline.

**Constraints to revisit later:**

- Models load at startup, which couples ML deployment with API deployment.
- No retry or timeout on model inference.
- Retraining is manual — there's a \`train.py\` script but no scheduler.
- Model versions aren't tracked — overwriting a \`.joblib\` file loses the previous model.

All five models are live prototypes inside the platform. They represent the shape of what a marketplace ML system looks like, and they're honest about where each one stands.`,
    },

    // ── 07 ──
    {
      id: 'broke',
      title: 'What broke',
      content: `**The transaction lifecycle was the hard part.** Bid selection, delivery confirmation, OTP verification, and chat unlocking all have to stay consistent — across two parallel marketplace models (requests and auctions) that share most of this logic. Getting the state to move correctly in all cases was the single biggest source of bugs.

**OTP retry handling has no recovery path.** The 4-digit verification code allows up to five attempts. After that, the flow depends on a buyer override. There is no rate limiting on attempts and no resend mechanism. Fine for a portfolio; wouldn't survive real users.

**Realtime chat is silent on failure.** Supabase Realtime subscriptions can disconnect without the client noticing. When that happens, new messages stop appearing until the user refreshes the page. No heartbeat, no reconnection indicator. It works most of the time, but the failure mode is invisible — the worst kind.

**The Supabase free-tier limit took down auth.** Supabase allows two projects on the free tier. When I started a new build, MarketFlip got paused and its Supabase project went offline. The frontend still loads, the code still works, but login fails because the backend can't reach Supabase Auth. This is what "PAUSED" means in the README — not a bug, an infrastructure constraint.`,
    },

    // ── 08 ──
    {
      id: 'differently',
      title: "What I'd do differently",
      content: `**Define and test the transaction state machine first.** Bid selection → delivery → OTP verification → chat unlock is not complicated in principle, but it touches six tables and two marketplace flows. I built the pieces as features and then had to reconcile them. Next time I'd write the state diagram before writing any code.

**Get more data before building more models.** Price suggestion, demand forecasting, and fraud detection all suffer from small training sets. Adding a fifth model made the problem worse, not better. If I did this again, I'd spend the same effort on generating a larger synthetic dataset with realistic distributions, and only then build models on top.

**Rate-limit and add timeouts to the AI calls.** There is currently no rate limit on \`/ai/ask\` or \`/ai/parse-request\`, no retry on Gemini failures, and no client timeout on the Gemini call. A slow response holds the request; a burst can drain the daily quota.

**Move ML out of the FastAPI process.** Price suggestion loads a \`.joblib\` artifact at startup; the other four models run inline. Works for small models, but couples ML deployments with API deployments. In production, models should load from object storage at request time, or live behind their own service with a queue.

**Give Realtime a fallback.** A periodic HTTP fetch every minute when the Realtime connection is idle would resync state without the user knowing anything broke.

**Trim the surface area before adding features.** There are fourteen tables, ten functional domains, an AI subsystem, and five ML models in v2.0.0. A smaller core would have been finished faster and shipped cleaner. I'd rather have five polished features than fifteen half-done ones.`,
    },
  ],
}