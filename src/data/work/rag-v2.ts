import type { Work } from './index'

export const ragV2: Work = {
  slug: 'rag-v2',
  title: 'AI Study Companion',
  tag: 'AI · RAG · Full Stack',
  summary: 'A retrieval-augmented study assistant that turns uploaded materials into a searchable, question-answering knowledge base. Modular FastAPI backend with seven feature modules, per-user FAISS indexes, Cohere embeddings, and a React dashboard that ties ingestion, notes, quizzes, and roadmap planning into one learning loop.',
  date: 'July – present',
  live: 'https://rag-v2-gules.vercel.app/',
  github: 'https://github.com/prateEKsaha07/RAG_v2',

  facts: {
    stack: ['React', 'Vite', 'FastAPI', 'Pydantic', 'Tailwind'],
    database: 'Supabase (Postgres + Storage) · local FAISS indexes',
    auth: 'Supabase Auth (JWT via Bearer)',
    embeddings: 'Cohere embed-english-light-v3.0',
    llm: 'Cohere Command-R',
    hosting: 'Vercel (frontend) · Render (backend)',
    status: 'Active development — migration to multi-user in progress',
  },

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `RAG_v2 is an **AI-powered study assistant** built around retrieval-augmented generation. Users upload their own materials — PDFs, notes, lecture content — and the system indexes them into a per-user vector store. From there, every feature is grounded in that content: question answering retrieves relevant passages before generating an answer, quizzes are generated from indexed material, weak-topic detection reads quiz results, and roadmaps are built from the subject structure of what was uploaded.

The goal was to build a learning environment where the AI's answers come from **your content**, not a generic model. The whole app is architected around that idea: the retrieval layer is the first-class citizen, and every module either writes to it, reads from it, or reasons over the results.

The system has seven backend modules — Ingestion, QA, Notes, Quiz, Roadmap, Analytics, and Books — each responsible for one part of the learning workflow. The frontend exposes them through a tabbed dashboard that ties the flow together: upload → ask → quiz → detect gaps → plan.

Currently in **active development**. The modular architecture is complete and functional, and the current work is a data migration toward full multi-user isolation.`,
    },
    {
      id: 'architecture',
      title: 'Architecture',
      content: `The system has two layers — a React SPA on Vercel and a FastAPI backend on Render — with Supabase handling auth and persistent metadata, and FAISS indexes for vector retrieval.

\`\`\`mermaid
flowchart LR
    Browser([User Browser]) -->|HTTPS| FE[React SPA<br/>Vercel]
    FE -->|REST + Bearer token| API[FastAPI<br/>Render]
    API -->|Auth + metadata| SB[(Supabase<br/>Postgres + Storage)]
    API -->|Embed| COH_E[Cohere Embed<br/>embed-english-light-v3.0]
    API -->|Generate| COH_L[Cohere Command-R<br/>LLM]
    API -->|Store vectors| FAISS[(FAISS<br/>per-user indexes)]
    API -->|Store files| FS[Local uploads<br/>backend disk]
\`\`\`

**Ingestion flow.** When a user uploads a file, the Ingestion module reads it, splits it into chunks, generates embeddings via Cohere, and stores the vectors in a FAISS index. The index lives on the backend's disk (or in the FAISS folder structure), which is one of the reasons the app is currently migrating toward a more portable storage model.

**Q&A flow.** A question arrives at the QA module. It's embedded with the same Cohere model, used to search the relevant FAISS index for the closest matching chunks, and those chunks are passed as context to Cohere Command-R. The LLM generates an answer grounded in the retrieved passages, and the response returns with source references.

**Notes flow.** Notes are stored as Markdown files in Supabase Storage and as metadata rows in a \`notes\` table. Each note is also written into a separate \`notes_faiss_index\`, so that notes participate in Q&A alongside uploaded materials. The QA module queries both indexes and merges the results.

**Quiz flow.** The Quiz module pulls content from the active subject's FAISS index and generates multiple-choice questions via the LLM. When the user submits answers, the module scores them and records weak topics into \`quiz_history\`. That history feeds the Analytics module and the Roadmap module.

**Roadmap flow.** The Roadmap module organizes subjects into weekly plans. Each topic has a status — \`not_started\`, in progress, \`completed\` — and quiz results determine what the roadmap considers "weak". The plan is stored as a nested JSON structure on a \`roadmaps\` row, with weeks, dates, and topic entries.

**What's notably not here.** There's no separate vector database — FAISS runs as a Python library inside the backend. There's no queue or async worker — ingestion runs inline on the request. There's no real-time layer — this isn't a collaborative tool. It's a single-user study app with per-user data scoping, and the architecture reflects that.`,
    },
    {
      id: 'data-model',
      title: 'Data model',
      content: `The persistent state lives in Supabase across four main tables — \`books\`, \`notes\`, \`quiz_history\`, and \`roadmaps\` — plus Storage buckets for files and local FAISS indexes for vectors.

\`\`\`mermaid
erDiagram
    AUTH_USERS ||--o{ BOOKS : owns
    AUTH_USERS ||--o{ NOTES : owns
    AUTH_USERS ||--o{ QUIZ_HISTORY : attempts
    AUTH_USERS ||--o{ ROADMAPS : plans

    BOOKS {
        uuid id PK
        uuid user_id FK
        text title
        text filename
        text storage_path
        int total_pages
        int current_page
        bool favorite
        bool archived
        timestamptz uploaded_at
        timestamptz last_opened
    }
    NOTES {
        uuid id PK
        uuid user_id FK
        text filename
        text subject
        text subject_key
        text title
        text[] tags
        int word_count
        bool ingested
        timestamptz last_edited
    }
    QUIZ_HISTORY {
        uuid id PK
        uuid user_id FK
        text subject
        int score
        int total
        text[] weak_topics
        timestamptz created_at
    }
    ROADMAPS {
        uuid id PK
        uuid user_id FK
        text subject
        text subject_key
        text scope
        int unit_number
        int hours_per_day
        date target_date
        text status
        jsonb weeks
        text[] weak_topics
        timestamptz created_at
    }
\`\`\`

**Storage layers.** Three separate persistence mechanisms:

1. **Supabase tables** — metadata for books, notes, quiz history, roadmaps.
2. **Supabase Storage** — the actual PDFs (in a \`books\` bucket) and Markdown note files (in a \`notes\` bucket). Files are namespaced by \`<user_id>/<filename>\`.
3. **Local FAISS indexes** — vectors for retrieved content. Two indexes: one for uploaded material, one for notes. Stored on the backend's disk under \`faiss_index/\` and \`notes_faiss_index/\`.

**The roadmap \`weeks\` shape is the most complex structure in the schema.** It's a nested JSON array where each week has \`week\`, \`start_date\`, \`end_date\`, and \`topics\`. Each topic has \`unit\`, \`unit_name\`, and a nested \`topic\` object with \`name\`, \`hours\`, \`days_needed\`, \`status\`, \`completed_date\`, and optionally \`is_weak\`. This stores an entire multi-week study plan on a single row rather than normalizing into separate tables.

**User scoping is the current architectural focus.** Every table has a \`user_id\` column, and every query filters on it. But the FAISS indexes are shared across all users in the current build, which is what the ongoing migration is fixing — one index per user, or one indexed collection with user_id filtering at the vector level. Until that ships, the app is functional for local and single-user testing but not truly multi-tenant.`,
    },
    {
      id: 'api',
      title: 'API design',
      content: `The FastAPI backend exposes a REST API grouped by module. All routes except auth require a Bearer token, verified against Supabase. Route list reflects the current design.`,
    },
    {
      id: 'modules',
      title: 'Module design',
      content: `The backend is organized into seven feature-oriented modules under \`app/modules/\`. Each module owns one concern in the learning workflow and has its own router and service layer. This is the structure that makes the app maintainable — new features slot into the module they belong to, rather than spreading across a monolith.

**Ingestion.** Reads uploaded files, splits them into chunks, embeds each chunk with Cohere, and writes vectors into the FAISS index. The most load-bearing module — everything downstream depends on the quality of what ingestion produces.

**QA.** Answers questions grounded in indexed content. Embeds the question, searches the FAISS index, retrieves the top matching chunks, and passes them as context to the LLM. Returns both the answer and its sources. Queries both the material index and the notes index, merging results.

**Notes.** Manages a personal knowledge layer. Notes are Markdown files stored in Supabase Storage, with metadata in a \`notes\` table. Each note is also indexed into a dedicated notes FAISS index so it participates in Q&A. Tags are generated from note content via the LLM.

**Quiz.** Generates multiple-choice questions from the active subject's indexed material. Scores submitted answers, identifies weak topics from incorrect responses, and writes results to \`quiz_history\`. This is the module that turns reading into assessment — without it, the roadmap has nothing to plan against.

**Roadmap.** Builds a structured study plan from a subject's topic structure. Tracks per-topic status (\`not_started\`, in progress, \`completed\`). Supports starting a topic, completing it, extending deadlines, and generating weekly study schedules. The roadmap is the app's organizing metaphor — it turns a flat list of materials into a sequence.

**Analytics.** Aggregates data from the other modules into a dashboard. Reads from \`books\`, \`notes\`, \`quiz_history\`, and \`roadmaps\`, and returns a single compiled payload with overview stats, study progress, quiz performance, roadmap status, recent activity, and weekly progress. This is the module that makes the app feel coherent — without it, each feature would be a separate island.

**Books.** Handles PDF metadata and file management. Retrieves book details, returns signed URLs for reading, tracks reading position. Coordinates with Storage to fetch the actual PDF bytes.

**Why modular matters here.** The app has seven independently evolving concerns. If everything were in one router and one service file, every change would risk regressing something else. The module structure means the Quiz module can be replaced without touching QA, and the Analytics module can add new views without changing how the underlying data is produced.`,
    },
    {
      id: 'analytics',
      title: 'Analytics deep dive',
      content: `The Analytics module is the most fully specified module in the project — it has its own architecture document, endpoint contract, and frontend layout. Worth describing in detail because it shows what "complete" looks like in this codebase, in contrast to the other modules that are still maturing.

**Single endpoint, compiled response.** The module exposes one route: \`GET /analytics/dashboard\`. It returns a single JSON payload with six top-level keys:

- \`overview\` — aggregate counts and averages (uploaded books, notes, quiz attempts, average score, active roadmaps, reading progress, study streak)
- \`study\` — current book, recently opened, completion percentage
- \`quiz\` — pass rate, average score, best and latest scores, weak-topic aggregation, recent attempts
- \`roadmap\` — active and completed roadmap counts, nearest deadline, current subject
- \`activity\` — recent cross-module events (book opened, note edited, quiz taken)
- \`weekly_progress\` — a seven-day view of activity by module

**Internal structure.** The service layer is a single public function, \`get_dashboard_data(user_id)\`, that fans out to six private sub-functions — one per top-level key. Each sub-function queries its relevant tables and returns a shaped dict. The router does nothing but call the service and serialize the result. This makes the module trivially testable: mock the tables, call the function, compare the output.

**Frontend layout.** The dashboard is a tabbed view with six panels — Overview, Study, Quiz, Performance, Roadmaps, Reports — each rendering a different slice of the same payload. Charts are SVG-based via Recharts. No data fetching per tab — one request on mount, six views over the response.

**Why this module is the model to follow.** Every other module in the codebase is a set of features. Analytics is a set of features plus a documented contract. The difference in maintainability is significant — when the shape of the response changes, there's one place to look. When a new view is added, it reads from an existing key. The other modules would benefit from the same treatment: fewer endpoints, more compiled responses, documented schemas.

**Planned v2.0.0 work.** Server-side document exporters (PDF/CSV/JSON report downloads), LLM-powered learning recommendations from weak topics, expansion from weekly to monthly temporal views, and gamification (streaks, badges). None of these change the module's contract — they extend what the endpoint returns or add sibling endpoints.`,
    },
    {
      id: 'progress',
      title: 'Where it stands',
      content: `RAG_v2 is functional and being actively refined. The honest state:

**Working.** Upload and ingestion into the FAISS index. Semantic Q&A grounded in indexed content, with source references. Notes creation, tagging, and participation in Q&A. Quiz generation and evaluation with weak-topic detection. Roadmap generation with weekly planning. Analytics dashboard with seven-day activity views. All seven backend modules are implemented and route correctly.

**In progress.** The data migration from local file-based storage toward Supabase-backed persistence for the vector layer. The current FAISS indexes live on the backend's disk, which works for single-user testing but doesn't scale to a real multi-tenant product. The migration is the largest single piece of work remaining.

**Not yet shipped.** Full multi-user isolation. Stronger data persistence guarantees for the vector layer. Deployment readiness for production — the README notes explicitly that Vercel deployment "may not be fully reliable" until the migration completes. Sample data exists for two subjects (Java and AI) so local testing works, but the app doesn't yet have the isolation guarantees it needs for real users.

**What this state means.** RAG_v2 is a strong portfolio project precisely because it's honest about its state. A prototype that ships its architecture clearly, documents its tradeoffs, and names the pieces that aren't done is more valuable as evidence of engineering judgment than a project that claims to be production-ready and isn't.`,
    },
    {
      id: 'decisions',
      title: 'Design decisions',
      content: `A few choices worth calling out, because they shaped the build more than the feature list does.

**Modular by feature, not by layer.** Most FastAPI projects organize by layer — one big \`routes.py\`, one big \`services.py\`, one \`models.py\`. RAG_v2 organizes by feature instead: \`modules/Ingestion/\`, \`modules/QA/\`, \`modules/Quiz/\`, and so on. Each feature folder owns its router, service, schemas, and any internal helpers. When the Quiz module needs to change, everything it needs is in one directory. This pays off the moment the app has more than two or three features.

**FAISS, not a vector database.** There are managed vector databases (Pinecone, Weaviate, Qdrant) that would handle persistence, scaling, and multi-user isolation out of the box. RAG_v2 uses FAISS instead — a Python library, no server. The tradeoff: zero operational cost and total control over index structure, but no built-in persistence and no isolation guarantees. The migration the project is currently undertaking is essentially "add what a managed vector DB would have given us for free." Choosing FAISS was right for a learning project and wrong for a production system, and the project now has to earn that lesson.

**Cohere for both embeddings and generation.** The stack uses Cohere \`embed-english-light-v3.0\` for embeddings and \`Command-R\` for generation. One vendor, one API key, one billing relationship. The cost is that mixing models is harder — if OpenAI's embeddings outperform Cohere's, switching means re-indexing every chunk. But it keeps the initial build simple, which was the right call at the prototype stage.

**Notes as first-class citizens.** Notes aren't just a scratchpad — they're indexed into their own FAISS collection and participate in Q&A alongside uploaded materials. This means a question can be answered using both a textbook PDF and your own summary of it, and the QA module merges results from both sources. Notes are also stored as actual Markdown files in Supabase Storage rather than as database rows, so they're portable and exportable by design.

**Roadmaps as JSON columns.** The roadmap structure is a nested JSON array stored on a single Postgres row rather than normalized across tables. This makes roadmap generation a single insert, and roadmap reads a single SELECT. The tradeoff is that querying "which topics across all users are marked as weak" would require JSON traversal instead of a JOIN. For a single-user study tool, the denormalized shape is simpler to work with. At scale, it would be the wrong choice.

**Seven-day analytics, not historical.** The analytics module returns a seven-day view of activity by default. Streaks and monthly views are listed as v2.0.0 work. This is a scope decision — the most valuable slice of activity data is the last week, and building for a longer horizon before anyone has a month of data would be premature.`,
    },
    {
      id: 'next',
      title: "What's next",
      content: `The next phase of work is mostly about production readiness rather than new features.

**Finish the migration.** The vector layer needs to move from local FAISS indexes to a storage model that supports true multi-user isolation. This is the single largest piece of outstanding work.

**Improve deployment.** The README is explicit that Vercel deployment "may not be fully reliable" until the migration completes. Once the storage layer is stable, deployment becomes a solved problem.

**Expand analytics.** v2.0.0 includes server-side document exporters (PDF/CSV/JSON reports), LLM-driven learning recommendations based on weak topics, monthly historical views, and gamification (streaks, badges).

**Broaden subject support.** Currently the app ships with sample data for two subjects (Java and AI). Broader subject support means accepting more document formats, handling larger files, and improving the ingestion pipeline's robustness.

None of this is a rewrite. The modular structure was designed to make these changes additive rather than disruptive. That's the payoff of spending the early effort on architecture instead of features.`,
    },
  ],
}