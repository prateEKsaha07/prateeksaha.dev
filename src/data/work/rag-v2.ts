import type { Work } from './index'

export const ragV2: Work = {
  slug: 'rag-v2',
  title: 'RAG_v2 — AI Study Assistant',
  tag: 'Full-Stack AI Platform',
  summary:
    'A modular AI study assistant that lets learners upload their own material, ask retrieval-grounded questions, build searchable notes, generate and evaluate quizzes, plan study roadmaps, read PDF books, track analytics, and collaborate in shared workspaces.',
  date: '2026',
  live: 'https://rag-v2-gules.vercel.app/',
  github: 'https://github.com/prateEKsaha07/RAG_v2',

  facts: {
    stack: [
      'React 19',
      'Vite',
      'Tailwind CSS',
      'Framer Motion',
      'Recharts',
      'React PDF',
      'FastAPI',
      'Pydantic',
      'LangChain',
      'Python 3.11.9',
    ],
    database: 'Supabase (PostgreSQL) + Supabase Storage',
    auth: 'Supabase Auth (bearer-token validation on FastAPI)',
    embeddings: 'Cohere embeddings',
    llm: 'Cohere chat model',
    hosting: 'Render (backend/render.yaml present)',
    collaboration: 'Workspace-scoped notes, messages, polls, tasks, activity updates; Supabase Realtime',
    status: 'Actively developing — feature-rich, with some persistence and API integrations in transition',
  },

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `RAG_v2 is a web-based AI study assistant. Learners work with their **own study materials**: they upload content, ask questions grounded in it, create notes, take quizzes, track progress, and plan what to study next.

The system is split into a **React single-page frontend** and a **FastAPI backend**. Cohere provides embeddings and language-model responses, FAISS provides local vector search, and Supabase provides authentication, database records, and file storage.

The intended learning loop is:

\`\`\`text
Upload material → index it → ask questions or study → take a quiz
→ identify weak topics → follow a roadmap → review progress
\`\`\`

### Main persistence locations

| Data | Persistence |
|---|---|
| User identity and sessions | Supabase Auth |
| Profile, books, notes metadata, quiz records, roadmaps, collaboration | Supabase database |
| Book PDFs and note Markdown files | Supabase Storage |
| Shared uploaded-study-material vectors | Local shared FAISS index |
| Personal note vectors | Local per-user FAISS indexes |
| Original uploaded Markdown | \`backend/data/uploads/\` |
| Subject tags and topic metadata | JSON files under \`backend/tags/\` |
| Local quiz history and sample roadmap data | JSON files under \`backend/analytics/\` |

Not all features use the same persistence mechanism: some user data is scoped per-user, while the uploaded-content index is **shared**.`,
    },
    {
      id: 'architecture',
      title: 'Architecture',
      content: `### High-level request flow

1. The frontend presents screens for login, the learning dashboard, uploads, Q&A, quizzes, notes, study books, roadmaps, analytics, profiles, and collaboration.
2. Supabase Auth signs users in and provides access tokens. The frontend sends those tokens to protected FastAPI endpoints.
3. FastAPI validates the token and routes requests to feature-specific modules.
4. Supabase stores user-scoped records and uploaded book/note files.
5. FAISS and Cohere support semantic retrieval and AI generation.

\`\`\`mermaid
flowchart LR
    UI["React SPA"] -->|Bearer token| API["FastAPI"]
    UI -->|Auth| SA["Supabase Auth"]
    API -->|Validate| SA
    API -->|Records and files| SB["Supabase DB + Storage"]
    API -->|Retrieve| FA["FAISS index"]
    API -->|Embed / Generate| CO["Cohere"]
\`\`\`

### RAG pipeline

The backend initializes RAG resources at startup in \`backend/app/core/rag.py\`: Cohere embeddings, the shared upload FAISS index, and a Cohere chat model.

- **Ingestion** (\`modules/Ingestion/services.py\`) processes Markdown in \`backend/data/uploads/\`, splits it into chunks, attaches subject/unit/topic metadata, and saves to the shared FAISS index.
- **Q&A** (\`modules/Qa/services.py\`) searches uploaded material and — when available — the signed-in user's notes index, combines relevant content, and asks the language model to answer. Requests can specify a subject and whether general knowledge is allowed.

\`\`\`text
Upload (.md) ─▶ Chunk ─▶ Embed (Cohere) ─▶ Shared FAISS
                                              │
Question ──────────────────────────────▶ Retrieve ─▶ Build context
                                              │
Notes (per user) ─▶ Notes FAISS ──────────────┘
                                              ▼
                                     Cohere chat model ─▶ Answer + sources + confidence
\`\`\`

### Technology stack

| Area | Technologies |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Data & visualization | Axios, \`fetch\`, Recharts, React PDF, Framer Motion |
| Backend | Python 3.11.9, FastAPI, Pydantic |
| AI & retrieval | LangChain, Cohere embeddings + chat, FAISS |
| Auth & persistence | Supabase Auth, PostgreSQL-backed records, Supabase Storage |
| Deployment | Render (\`backend/render.yaml\`) |`,
    },
    {
      id: 'data-model',
      title: 'Data model',
      content: `Persistence is deliberately split across several stores. The table below is the canonical map.

| Store | Contents | Scope |
|---|---|---|
| Supabase Auth | User identity, sessions, access tokens | Per user |
| Supabase DB | Profiles, books, note metadata, quiz records, roadmaps, collaboration entities | Per user / per workspace |
| Supabase Storage | Book PDFs, note Markdown files | Per user |
| Shared FAISS index | Vectors for uploaded study material | **Shared** across users |
| Per-user notes FAISS | Vectors for a user's notes | Per user |
| \`backend/data/uploads/\` | Original uploaded Markdown | Shared |
| \`backend/tags/\` | Subject tags and topic metadata (JSON) | Global |
| \`backend/analytics/\` | \`quiz_history.json\`, \`roadmaps/\` (JSON) | Local file |

### Entity sketch

\`\`\`mermaid
erDiagram
    USER ||--o{ NOTE : owns
    USER ||--o{ BOOK : owns
    USER ||--o{ QuizAttempt : takes
    USER ||--o{ ROADMAP : plans
    USER ||--o{ WorkspaceMember : joins
    WORKSPACE ||--o{ WorkspaceMember : has
    WORKSPACE ||--o{ MESSAGE : contains
    WORKSPACE ||--o{ POLL : contains
    WORKSPACE ||--o{ TASK : contains
    WORKSPACE ||--o{ SharedResource : shares
    TASK ||--o{ TaskComment : has
    POLL ||--o{ VOTE : has
\`\`\`

> **Note:** quiz attempts are written to Supabase on evaluation, but \`GET /quiz-history\` reads a local JSON file. These two histories can diverge — see *Design decisions*.`,
    },
    {
      id: 'api',
      title: 'API design',
      content: `The backend defines **66 route handlers**. "Protected" routes require a valid bearer token; "public" routes have no current-user dependency.

\`\`\`json
[
  {
    "title": "Health & Service",
    "note": "Public status checks",
    "endpoints": [
      { "method": "GET", "path": "/", "description": "Returns a basic server-online response." },
      { "method": "GET", "path": "/health", "description": "Reports service status and whether the upload vector store is loaded." }
    ]
  },
  {
    "title": "Q&A",
    "note": "Retrieval-grounded answering",
    "endpoints": [
      { "method": "POST", "path": "/qa/ask", "description": "Accepts a question, optional subject, and general-knowledge flag; returns answer, sources, context count, and confidence." }
    ]
  },
  {
    "title": "Quizzes",
    "endpoints": [
      { "method": "POST", "path": "/quiz/generate-quiz", "description": "Generates a quiz for a subject; optional unit_number narrows the source material." },
      { "method": "POST", "path": "/quiz/evaluate", "description": "Evaluates submitted quiz answers and returns results, weak topics, and recommendations." }
    ]
  },
  {
    "title": "Ingestion",
    "endpoints": [
      { "method": "POST", "path": "/ingestion/ingest", "description": "Accepts an uploaded .md file, processes Markdown uploads, and reloads the shared vector store." }
    ]
  },
  {
    "title": "Notes",
    "note": "CRUD and per-user indexing",
    "endpoints": [
      { "method": "POST", "path": "/notes/generate-tags", "description": "Suggests tags for note content and a subject." },
      { "method": "POST", "path": "/notes/fetch-url", "description": "Fetches a webpage title for the supplied URL." },
      { "method": "POST", "path": "/notes/subject-tags", "description": "Returns the subject's available tags." },
      { "method": "POST", "path": "/notes/ingest", "description": "Ingests the current user's notes into their notes index." },
      { "method": "POST", "path": "/notes", "description": "Creates a note. Body includes subject, title, content, tags, and optional URLs." },
      { "method": "GET", "path": "/notes", "description": "Lists the current user's notes; supports optional subject and comma-separated tags query parameters." },
      { "method": "GET", "path": "/notes/{filename}", "description": "Returns the content of a named note." },
      { "method": "PUT", "path": "/notes/{filename}", "description": "Updates a note's title, content, tags, and URLs." },
      { "method": "DELETE", "path": "/notes/{filename}", "description": "Deletes a note." }
    ]
  },
  {
    "title": "Roadmaps",
    "endpoints": [
      { "method": "POST", "path": "/roadmap", "description": "Creates a roadmap. Body includes subject, hours_per_day, target_date, scope, and optional unit_number." },
      { "method": "GET", "path": "/roadmap/{subject}", "description": "Returns the user's active roadmap for a subject." },
      { "method": "DELETE", "path": "/roadmap/{subject}", "description": "Deletes the user's roadmap for a subject." },
      { "method": "PUT", "path": "/roadmap/{subject}/extend", "description": "Updates the roadmap target date using new_target_date." },
      { "method": "PUT", "path": "/roadmap/{subject}/complete-topic", "description": "Marks a topic complete using week and topic_name." }
    ]
  },
  {
    "title": "Subjects & Uploads",
    "endpoints": [
      { "method": "GET", "path": "/subjects", "description": "Lists available subjects from the tag files." },
      { "method": "GET", "path": "/subjects/{subject}/units", "description": "Returns units found in the vector-store metadata for a subject." },
      { "method": "GET", "path": "/uploads", "description": "Lists uploaded Markdown subjects." },
      { "method": "GET", "path": "/uploads/{subject}", "description": "Returns the matching Markdown upload and file metadata." }
    ]
  },
  {
    "title": "Quiz History",
    "endpoints": [
      { "method": "GET", "path": "/quiz-history", "description": "Returns local JSON quiz history; optional subject filters the response." }
    ]
  },
  {
    "title": "Books",
    "endpoints": [
      { "method": "GET", "path": "/books/test", "description": "Tests authenticated access to the books module." },
      { "method": "GET", "path": "/books/public", "description": "Confirms that the books router responds." },
      { "method": "POST", "path": "/books/", "description": "Uploads a PDF and records book metadata." },
      { "method": "GET", "path": "/books/", "description": "Lists the current user's books." },
      { "method": "GET", "path": "/books/{book_id}", "description": "Retrieves one of the user's books and creates a signed file URL." },
      { "method": "DELETE", "path": "/books/{book_id}", "description": "Deletes a book record and attempts to remove its stored PDF." },
      { "method": "PATCH", "path": "/books/{book_id}/progress", "description": "Updates the current reading page." },
      { "method": "PATCH", "path": "/books/{book_id}/open", "description": "Intended to update the last-opened timestamp." }
    ]
  },
  {
    "title": "Analytics",
    "endpoints": [
      { "method": "GET", "path": "/analytics/dashboard", "description": "Returns the combined analytics dashboard payload." },
      { "method": "GET", "path": "/analytics/ping", "description": "Returns a basic backend status message." }
    ]
  },
  {
    "title": "Profiles",
    "endpoints": [
      { "method": "GET", "path": "/profiles/test", "description": "Tests authenticated profile-module access." },
      { "method": "GET", "path": "/profiles/me", "description": "Fetches the authenticated user's profile." },
      { "method": "PATCH", "path": "/profiles/me", "description": "Updates supplied fields on the authenticated user's profile." }
    ]
  },
  {
    "title": "Collaboration",
    "note": "All routes protected",
    "endpoints": [
      { "method": "POST", "path": "/collaboration/workspaces", "description": "Creates a workspace." },
      { "method": "GET", "path": "/collaboration/workspaces", "description": "Lists workspaces the user belongs to." },
      { "method": "POST", "path": "/collaboration/workspaces/{workspace_id}/invitations", "description": "Invites a user by email." },
      { "method": "GET", "path": "/collaboration/invitations", "description": "Lists invitations associated with the user." },
      { "method": "POST", "path": "/collaboration/invitations/{invitation_id}/accept", "description": "Accepts an invitation." },
      { "method": "POST", "path": "/collaboration/invitations/{invitation_id}/reject", "description": "Rejects an invitation." },
      { "method": "GET", "path": "/collaboration/workspaces/{workspace_id}/members", "description": "Lists workspace members." },
      { "method": "PATCH", "path": "/collaboration/workspaces/{workspace_id}/members/{user_id}/role", "description": "Changes a member's role." },
      { "method": "DELETE", "path": "/collaboration/workspaces/{workspace_id}/members/{user_id}", "description": "Removes a member." },
      { "method": "POST", "path": "/collaboration/workspaces/{workspace_id}/resources/notes", "description": "Shares a note into the workspace." },
      { "method": "GET", "path": "/collaboration/workspaces/{workspace_id}/resources", "description": "Lists workspace resources." },
      { "method": "DELETE", "path": "/collaboration/workspaces/{workspace_id}/resources/{resource_id}", "description": "Revokes a shared resource." },
      { "method": "GET", "path": "/collaboration/workspaces/{workspace_id}/resources/{resource_id}/note", "description": "Retrieves a shared note." },
      { "method": "POST", "path": "/collaboration/workspaces/{workspace_id}/messages", "description": "Sends a workspace message." },
      { "method": "GET", "path": "/collaboration/workspaces/{workspace_id}/messages", "description": "Lists messages; supports limit and before query parameters." },
      { "method": "GET", "path": "/collaboration/workspaces/{workspace_id}/updates", "description": "Lists activity updates; supports limit and after." },
      { "method": "POST", "path": "/collaboration/workspaces/{workspace_id}/polls", "description": "Creates a poll." },
      { "method": "GET", "path": "/collaboration/workspaces/{workspace_id}/polls", "description": "Lists workspace polls." },
      { "method": "GET", "path": "/collaboration/polls/{poll_id}", "description": "Gets poll details." },
      { "method": "POST", "path": "/collaboration/polls/{poll_id}/vote", "description": "Casts a vote." },
      { "method": "PATCH", "path": "/collaboration/polls/{poll_id}/close", "description": "Closes a poll." },
      { "method": "PATCH", "path": "/collaboration/polls/{poll_id}/pin", "description": "Pins or unpins a poll." },
      { "method": "POST", "path": "/collaboration/workspaces/{workspace_id}/tasks", "description": "Creates a workspace task." },
      { "method": "GET", "path": "/collaboration/workspaces/{workspace_id}/tasks", "description": "Lists workspace tasks." },
      { "method": "PATCH", "path": "/collaboration/tasks/{task_id}", "description": "Updates a task." },
      { "method": "POST", "path": "/collaboration/tasks/{task_id}/comments", "description": "Adds a task comment." },
      { "method": "GET", "path": "/collaboration/tasks/{task_id}/comments", "description": "Lists task comments." },
      { "method": "DELETE", "path": "/collaboration/tasks/{task_id}", "description": "Deletes a task." }
    ]
  }
]
\`\`\`

FastAPI's generated docs are normally available at \`/docs\`, \`/redoc\`, and \`/openapi.json\` unless disabled at runtime.`,
    },
    {
      id: 'modules',
      title: 'Module design',
      content: `Each backend feature lives under \`backend/app/modules/\`. The shared core handles cross-cutting concerns.

\`\`\`text
backend/app/
├── core/
│   ├── auth.py            # Bearer-token validation, current-user lookup
│   ├── config.py          # Configuration
│   ├── deps.py            # LLM / embeddings / vector-store deps
│   ├── rag.py             # RAG resources + FAISS loading
│   ├── supabase_client.py # Backend Supabase client
│   └── text_utils.py      # Subject normalization, JSON parsing
├── modules/
│   ├── Analytics/         # Aggregated learning dashboard
│   ├── Collaboration/     # Workspaces, members, messages, polls, tasks
│   ├── Ingestion/         # Markdown processing + vector indexing
│   ├── Notes/             # Notes, tags, URL metadata, notes indexing
│   ├── Qa/                # Retrieval-grounded Q&A
│   ├── Quiz/              # Generation, scoring, recommendations
│   ├── QuizHistory/       # Local JSON quiz-history route
│   ├── Roadmap/           # Personalized study plans
│   ├── Subjects/          # Subject + unit discovery
│   ├── Uploads/           # Uploaded Markdown lookup
│   ├── books/             # PDF library + reading progress
│   └── profile/           # Signed-in user's profile
├── shared/
└── main.py                # App + router registration
\`\`\`

### Module responsibilities

| Module | Responsibility |
|---|---|
| **Auth & Profile** | Supabase Auth login/signup; profile owner derived from token; fetch/update profile fields |
| **Upload & Subject discovery** | Markdown upload → ingestion; subjects from tag JSON; units from FAISS metadata |
| **Q&A** | Retrieve from upload + notes indexes, build context + short history, return answer with sources and confidence |
| **Notes** | CRUD, subject/tag filters, optional URLs, 500-word limit in service, separate file + metadata storage, per-user indexing |
| **Quizzes** | Generate up to 5 MCQs, evaluate, return weak topics, store attempts in Supabase, generate review recommendations |
| **Roadmaps** | Weekly schedule from units/topics, target date, daily hours, optional unit scope; track completion; incorporate weak-topic history |
| **Study library** | PDF upload, list, page-navigation reading, save current page; files in Storage, metadata in DB |
| **Analytics** | Combine book, note, quiz, roadmap, activity, weekly-progress data into six frontend areas |
| **Collaboration** | Workspaces, invitations, roles, shared notes, messages, activity, polls, tasks with comments, Realtime message subscription |`,
    },
    {
      id: 'collaboration',
      title: 'Collaboration module',
      content: `All 28 collaboration routes are **protected**. The module covers workspaces, membership, shared resources, messaging, polls, and tasks.

### Capability map

| Area | Endpoints |
|---|---|
| Workspaces | \`POST /workspaces\`, \`GET /workspaces\` |
| Invitations | \`POST /workspaces/{id}/invitations\`, \`GET /invitations\`, \`POST /invitations/{id}/accept\`, \`POST /invitations/{id}/reject\` |
| Members | \`GET /workspaces/{id}/members\`, \`PATCH .../members/{user_id}/role\`, \`DELETE .../members/{user_id}\` |
| Shared resources | \`POST .../resources/notes\`, \`GET .../resources\`, \`DELETE .../resources/{resource_id}\`, \`GET .../resources/{resource_id}/note\` |
| Messages | \`POST .../messages\`, \`GET .../messages\` (\`limit\`, \`before\`) |
| Activity | \`GET .../updates\` (\`limit\`, \`after\`) |
| Polls | \`POST .../polls\`, \`GET .../polls\`, \`GET /polls/{id}\`, \`POST /polls/{id}/vote\`, \`PATCH /polls/{id}/close\`, \`PATCH /polls/{id}/pin\` |
| Tasks | \`POST .../tasks\`, \`GET .../tasks\`, \`PATCH /tasks/{id}\`, \`POST /tasks/{id}/comments\`, \`GET /tasks/{id}/comments\`, \`DELETE /tasks/{id}\` |

### Lifecycle

\`\`\`mermaid
sequenceDiagram
    participant Owner
    participant WS as Workspace
    participant Invitee
    participant Member
    Owner->>WS: POST /workspaces
    Owner->>WS: POST /invitations (email)
    WS-->>Invitee: GET /invitations
    Invitee->>WS: POST /invitations/{id}/accept
    WS-->>Member: GET /workspaces
    Member->>WS: POST /messages (Realtime broadcast)
    Member->>WS: POST /polls and POST /tasks
    Member->>WS: GET /updates (limit, after)
\`\`\`

The frontend subscribes to **workspace-message inserts** through Supabase Realtime, so new messages appear without polling.`,
    },
    {
      id: 'analytics',
      title: 'Analytics deep dive',
      content: `The analytics dashboard combines **book, note, quiz, roadmap, activity, and weekly-progress data** into a single protected payload from \`GET /analytics/dashboard\`.

### Frontend organization

| Page | Content |
|---|---|
| Overview | High-level summary cards |
| Performance | Trends and comparative metrics |
| Study | Reading/study activity |
| Quiz | Attempts, scores, weak topics |
| Roadmaps | Plan status and completion |
| Reports | Aggregated summaries and charts |

\`\`\`text
Supabase (books, notes, quizzes, roadmaps, activity)
        │
        ▼
GET /analytics/dashboard  ──▶  combined payload
        │
        ▼
Frontend: Overview · Performance · Study · Quiz · Roadmaps · Reports
        │
        ▼
Recharts (cards, summaries, trends, charts)
\`\`\`

### Caveats

- \`study_time: 0\` is a **placeholder** in the dashboard service.
- The service has **fallback behavior** that returns zeroed overview values if aggregation fails.
- \`GET /analytics/ping\` is a public status check. There is **no** subject-specific analytics route — older helpers referencing \`/analytics/{subject}\` do not match the backend.`,
    },
    {
      id: 'progress',
      title: 'Where it stands',
      content: `The project is **actively developing**. The README notes ongoing work around **data migration** and **multi-user support**.

### Implemented and working

- Supabase Auth login/signup with bearer-token protection on FastAPI routes.
- Markdown ingestion → shared FAISS index with subject/unit/topic metadata.
- Retrieval-grounded Q&A with sources and a confidence indicator.
- Notes CRUD with per-user FAISS indexing, tags, subjects, and URL metadata.
- Quiz generation (up to 5 MCQs), evaluation, weak-topic output, and recommendations.
- Roadmap generation with weekly schedules and topic completion tracking.
- PDF book library with reading-progress updates.
- Analytics dashboard with six frontend areas and charts.
- Full collaboration suite: workspaces, invitations, roles, shared notes, messages, polls, tasks, activity, Realtime.

### In transition / caveats

| Area | Observation |
|---|---|
| Q&A notes-index import | Service imports \`get_notes_faiss_path\` from \`Notes.notes\`; helper lives in \`Notes/services.py\`. May break \`/qa/ask\` when loading a user's notes index. |
| Legacy API paths | \`frontend/src/api.js\` still references \`/ask\`, \`/ingest\`, and \`/analytics/{subject}\` — none match registered routes. |
| Quiz history | Evaluation writes to Supabase; \`GET /quiz-history\` reads local JSON. Histories can diverge. |
| Shared upload index | Uploaded Markdown feeds a **shared** FAISS index — not fully user-isolated. |
| Book operations | \`update_last_opened\` is empty; uploads use \`books\` bucket while deletion appears to target \`_books\`. Verify against deployed storage. |
| Analytics values | \`study_time: 0\` placeholder; fallback can return zeroed overviews. |
| Auth token patterns | Some helpers read Supabase session; others read \`access_token\` from local storage (written by login). Not centralized. |
| Docs drift | Module docs describe intended/planned behavior that may differ from source. Routers and services are the source of truth. |

> This status reflects **source inspection**, not runtime test results. External services and deployment configuration have not been verified here.`,
    },
    {
      id: 'decisions',
      title: 'Design decisions',
      content: `Several architectural choices shape the system and its current caveats.

### 1. Split persistence by purpose

**Decision:** Use Supabase for identity, records, and files; local FAISS for vectors; JSON files for tags and some history.

**Rationale:** Vector search runs locally with FAISS for speed and low operational cost; relational and file data live in a managed platform.

**Trade-off:** Multiple stores mean multiple consistency surfaces — e.g., quiz attempts land in Supabase while \`/quiz-history\` reads a JSON file.

### 2. Shared upload index vs. per-user notes index

**Decision:** Uploaded study material is indexed **globally**; each user's notes get a **personal** index.

**Rationale:** Uploaded material is treated as shared study content; notes are private and personal.

**Trade-off:** The upload index is not user-isolated, which differs from a fully per-user content model.

### 3. Modular FastAPI backend

**Decision:** One module folder per feature (\`Qa\`, \`Quiz\`, \`Notes\`, \`Roadmap\`, \`Analytics\`, \`Collaboration\`, \`books\`, \`profile\`, …) with a shared \`core/\`.

**Rationale:** Clear ownership, easy navigation, and a single place for auth, config, and RAG resources.

**Trade-off:** A few cross-module imports (e.g., Q&A → Notes helper) can drift out of sync.

### 4. Token-validated, per-route protection

**Decision:** Protected routes use a shared auth dependency; public routes are explicitly unguarded.

**Rationale:** Keeps auth logic centralized while allowing genuinely public reads (subjects, uploads, quiz-history).

**Trade-off:** Frontend token handling is not fully centralized — some helpers use the Supabase session, others read \`access_token\` from local storage.

### 5. Realtime for collaboration

**Decision:** The frontend subscribes to workspace-message inserts through Supabase Realtime.

**Rationale:** Live updates without polling.

**Trade-off:** Adds a Realtime dependency alongside the FastAPI request path.`,
    },
    {
      id: 'next',
      title: "What's next",
      content: `Prioritized follow-ups, drawn from the implementation findings.

### Correctness

- **Fix the Q&A notes-index import** — resolve \`get_notes_faiss_path\` to \`Notes/services.py\` (or add the missing \`Notes/notes.py\`).
- **Unify quiz history** — make \`GET /quiz-history\` read Supabase, or write evaluations to the JSON file, so the two histories cannot diverge.
- **Verify book storage buckets** — reconcile \`books\` (upload) vs \`_books\` (delete) against the deployed Supabase Storage setup.
- **Implement \`update_last_opened\`** — the route exists but the service is empty.

### Consistency

- **Centralize the frontend API client** — retire legacy paths in \`frontend/src/api.js\` (\`/ask\`, \`/ingest\`, \`/analytics/{subject}\`) and standardize token access through one helper.
- **Replace analytics placeholders** — compute real \`study_time\` and ensure the zeroed-overview fallback is surfaced, not silent.
- **Align module docs with source** — mark planned vs. implemented behavior so docs stop drifting.

### Direction

- **Multi-user data migration** — the README flags this as ongoing work; it pairs naturally with deciding whether the upload index becomes per-user or stays shared with access controls.
- **Isolation options** — if uploaded material should be private, extend the per-user FAISS pattern to uploads.

\`\`\`mermaid
flowchart LR
    A["Fix import mismatch"] --> B["Unify quiz history"]
    B --> C["Verify storage buckets"]
    C --> D["Centralize frontend API client"]
    D --> E["Real analytics values"]
    E --> F["Multi-user data migration"]
    F --> G["Isolation strategy for uploads"]
\`\`\`

The central loop — **ingest → retrieve → assess → plan → review** — is already in place. The work ahead is primarily about **consistency between stores and clients**, not new capability.`,
    },
  ],
}