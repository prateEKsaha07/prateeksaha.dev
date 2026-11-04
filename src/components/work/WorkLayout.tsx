import { Link } from 'react-router-dom'
import { Markdown } from './Markdown'
import { ApiList, type ApiGroup } from './ApiList'
import type { Work } from '../../data/work'

// ═══════════════════════════════════════════════════════════════
// API groups per project — keyed by slug
// ═══════════════════════════════════════════════════════════════

const marketflipApiGroups: ApiGroup[] = [
  {
    title: 'Auth',
    endpoints: [
      { method: 'POST',  path: '/auth/signup',              description: 'Create a Supabase Auth account and its corresponding profile row.' },
      { method: 'POST',  path: '/auth/login',               description: 'Sign in and return the Supabase access token and role.' },
      { method: 'GET',   path: '/auth/profiles/{id}',       description: 'Fetch a profile by user ID.' },
      { method: 'PATCH', path: '/auth/profiles/{id}',       description: 'Update a profile. Only the owner can modify their own profile.' },
    ],
  },
  {
    title: 'Requests',
    note: 'Buyer-driven marketplace',
    endpoints: [
      { method: 'POST', path: '/requests',              description: 'Create a purchase request. Fields: item_name, budget_min, budget_max, pincode, category_id, image_urls.' },
      { method: 'GET',  path: '/requests',              description: 'Browse and filter open requests. Supports category and pincode filters.' },
      { method: 'GET',  path: '/requests/{id}',         description: 'View a request and, for the buyer, its bids.' },
      { method: 'POST', path: '/requests/{id}/bids',    description: 'Submit a shop offer on a request. Body: price, note.' },
    ],
  },
  {
    title: 'Bids',
    endpoints: [
      { method: 'GET',   path: '/bids',                 description: 'List bids placed by the current shop owner.' },
      { method: 'GET',   path: '/bids/{id}',            description: 'Fetch a single bid with its request context.' },
      { method: 'PATCH', path: '/bids/{id}/select',     description: 'Buyer selects a winning bid. Rejects sibling bids and unlocks the conversation.' },
    ],
  },
  {
    title: 'Auctions',
    note: 'Shop-driven marketplace',
    endpoints: [
      { method: 'POST', path: '/auctions',              description: 'Create an auction. Fields: item_name, starting_price, reserve_price, end_time.' },
      { method: 'GET',  path: '/auctions',              description: 'Browse active auctions. Supports status and category filters.' },
      { method: 'GET',  path: '/auctions/{id}',         description: 'View an auction and its bid history.' },
      { method: 'POST', path: '/auctions/{id}/bids',    description: 'Place a bid on an auction. Enforces current_highest_bid > previous.' },
    ],
  },
  {
    title: 'Chat',
    endpoints: [
      { method: 'GET',   path: '/chat/conversations',                     description: 'List the current user\'s conversations.' },
      { method: 'GET',   path: '/chat/conversations/{id}/messages',       description: 'Fetch message history. Reverse-chronological, paginated.' },
      { method: 'POST',  path: '/chat/conversations/{id}/messages',       description: 'Send a message. Rate limited to 1 per 2 seconds per user.' },
      { method: 'PATCH', path: '/chat/conversations/{id}/read',           description: 'Mark all messages in a conversation as read.' },
    ],
  },
  {
    title: 'AI Assistant',
    note: 'Buyer-side, shipped',
    endpoints: [
      { method: 'POST',  path: '/ai/parse-request',              description: 'Natural language → structured request draft via Gemini.' },
      { method: 'PATCH', path: '/ai/parse-request/{log_id}',     description: 'Record the buyer\'s accept or edit choice against a parse log.' },
      { method: 'GET',   path: '/ai/categories',                 description: 'Fetch the live category list — used as prompt context during parsing.' },
      { method: 'POST',  path: '/ai/ask',                        description: 'Answer a data question about the buyer\'s own requests and bids.' },
    ],
  },
  {
    title: 'ML',
    endpoints: [
      { method: 'POST', path: '/ml/price-suggestion', description: 'Suggest a price for a new request based on budget range and category.' },
      { method: 'POST', path: '/ml/rank-bids',        description: 'Rank a set of bids by price (60%) and shop reliability (40%).' },
      { method: 'GET',  path: '/ml/recommendations',  description: 'Suggest related categories based on transaction co-occurrence.' },
      { method: 'GET',  path: '/ml/demand-forecast',  description: 'Return a 7-day demand forecast per category.' },
      { method: 'POST', path: '/ml/detect-fraud',     description: 'Score a bid for fraud risk and return contributing factors.' },
    ],
  },
]

const geargridApiGroups: ApiGroup[] = [
  {
    title: 'Auth',
    endpoints: [
      { method: 'POST', path: '/auth/signup',        description: 'Create a Supabase Auth account and unified profile row.' },
      { method: 'POST', path: '/auth/login',         description: 'Return the Supabase access token. Role is not fixed.' },
      { method: 'GET',  path: '/auth/profiles/{id}', description: 'Fetch a user profile.' },
      { method: 'PATCH', path: '/auth/profiles/{id}', description: 'Update a profile — pincode, language preference, verification status.' },
    ],
  },
  {
    title: 'Equipment listings',
    note: 'Owner-side',
    endpoints: [
      { method: 'POST', path: '/listings',              description: 'Create an equipment listing. Fields vary by category group.' },
      { method: 'GET',  path: '/listings',              description: 'Browse listings by category and pincode.' },
      { method: 'GET',  path: '/listings/{id}',         description: 'View a listing and its active bids.' },
      { method: 'PATCH', path: '/listings/{id}',        description: 'Update a listing — price, photos, availability.' },
      { method: 'POST', path: '/listings/{id}/bids',    description: 'Renter places a bid on a listing with proposed dates.' },
    ],
  },
  {
    title: 'Rental requests',
    note: 'Renter-side — reverse flow',
    endpoints: [
      { method: 'POST', path: '/requests',              description: 'Post a rental request. Optionally voice-captured via Web Speech API.' },
      { method: 'GET',  path: '/requests',              description: 'Browse open requests by category and pincode.' },
      { method: 'POST', path: '/requests/{id}/bids',    description: 'Owner places a bid against a request.' },
    ],
  },
  {
    title: 'Bids',
    endpoints: [
      { method: 'GET',   path: '/bids',                 description: 'List bids placed by the current user.' },
      { method: 'PATCH', path: '/bids/{id}/accept',     description: 'Accept a bid. Rejects overlapping bids with status auto_rejected_overlap.' },
      { method: 'PATCH', path: '/bids/{id}/reject',     description: 'Reject a bid without accepting another.' },
    ],
  },
  {
    title: 'Bookings',
    endpoints: [
      { method: 'GET',   path: '/bookings',             description: 'List active and past bookings for the current user.' },
      { method: 'GET',   path: '/bookings/{id}',        description: 'View a booking in detail — status, dates, agreement state.' },
      { method: 'POST',  path: '/bookings/{id}/agreements', description: 'Create a pickup or return agreement with condition photo and notes.' },
      { method: 'POST',  path: '/bookings/{id}/verify-otp', description: 'Verify the OTP exchanged at handover.' },
      { method: 'PATCH', path: '/bookings/{id}/relist', description: 'Owner decides whether to relist the equipment after return.' },
    ],
  },
  {
    title: 'Extensions & ratings',
    endpoints: [
      { method: 'POST', path: '/bookings/{id}/extensions',    description: 'Request additional days on an active booking.' },
      { method: 'PATCH', path: '/extensions/{id}/approve',    description: 'Owner approves an extension after a conflict check.' },
      { method: 'POST', path: '/bookings/{id}/ratings',       description: 'Submit a pickup or return rating.' },
    ],
  },
  {
    title: 'Payments',
    note: 'Recorded, not processed',
    endpoints: [
      { method: 'POST',  path: '/bookings/{id}/payment-confirmations', description: 'Record a payment event — deposit, rental, extension, or deposit return.' },
      { method: 'PATCH', path: '/payment-confirmations/{id}/confirm',  description: 'Payer or receiver confirms the payment happened.' },
      { method: 'GET',   path: '/bookings/{id}/invoice',               description: 'Fetch the itemised invoice for a completed booking.' },
    ],
  },
]

// ─── RAG_v2 ────────────────────────────────────────────────────
const ragV2ApiGroups: ApiGroup[] = [
  {
    title: 'Health & Service',
    note: 'Public status checks',
    endpoints: [
      { method: 'GET', path: '/',       description: 'Returns a basic server-online response.' },
      { method: 'GET', path: '/health', description: 'Reports service status and whether the upload vector store is loaded.' },
    ],
  },
  {
    title: 'Q&A',
    note: 'Retrieval-grounded answering',
    endpoints: [
      { method: 'POST', path: '/qa/ask', description: 'Accepts a question, optional subject, and general-knowledge flag; returns answer, sources, context count, and confidence.' },
    ],
  },
  {
    title: 'Quizzes',
    endpoints: [
      { method: 'POST', path: '/quiz/generate-quiz', description: 'Generates a quiz for a subject; optional unit_number narrows the source material.' },
      { method: 'POST', path: '/quiz/evaluate',      description: 'Evaluates submitted quiz answers and returns results, weak topics, and recommendations.' },
    ],
  },
  {
    title: 'Ingestion',
    endpoints: [
      { method: 'POST', path: '/ingestion/ingest', description: 'Accepts an uploaded .md file, processes Markdown uploads, and reloads the shared vector store.' },
    ],
  },
  {
    title: 'Notes',
    note: 'CRUD and per-user indexing',
    endpoints: [
      { method: 'POST',   path: '/notes/generate-tags', description: 'Suggests tags for note content and a subject.' },
      { method: 'POST',   path: '/notes/fetch-url',     description: 'Fetches a webpage title for the supplied URL.' },
      { method: 'POST',   path: '/notes/subject-tags',  description: 'Returns the subject\'s available tags.' },
      { method: 'POST',   path: '/notes/ingest',        description: 'Ingests the current user\'s notes into their notes index.' },
      { method: 'POST',   path: '/notes',               description: 'Creates a note. Body includes subject, title, content, tags, and optional URLs.' },
      { method: 'GET',    path: '/notes',               description: 'Lists the current user\'s notes; supports optional subject and comma-separated tags query parameters.' },
      { method: 'GET',    path: '/notes/{filename}',    description: 'Returns the content of a named note.' },
      { method: 'PUT',    path: '/notes/{filename}',    description: 'Updates a note\'s title, content, tags, and URLs.' },
      { method: 'DELETE', path: '/notes/{filename}',    description: 'Deletes a note.' },
    ],
  },
  {
    title: 'Roadmaps',
    endpoints: [
      { method: 'POST',   path: '/roadmap',                              description: 'Creates a roadmap. Body includes subject, hours_per_day, target_date, scope, and optional unit_number.' },
      { method: 'GET',    path: '/roadmap/{subject}',                    description: 'Returns the user\'s active roadmap for a subject.' },
      { method: 'DELETE', path: '/roadmap/{subject}',                    description: 'Deletes the user\'s roadmap for a subject.' },
      { method: 'PUT',    path: '/roadmap/{subject}/extend',             description: 'Updates the roadmap target date using new_target_date.' },
      { method: 'PUT',    path: '/roadmap/{subject}/complete-topic',     description: 'Marks a topic complete using week and topic_name.' },
    ],
  },
  {
    title: 'Subjects & Uploads',
    endpoints: [
      { method: 'GET', path: '/subjects',                  description: 'Lists available subjects from the tag files.' },
      { method: 'GET', path: '/subjects/{subject}/units',  description: 'Returns units found in the vector-store metadata for a subject.' },
      { method: 'GET', path: '/uploads',                   description: 'Lists uploaded Markdown subjects.' },
      { method: 'GET', path: '/uploads/{subject}',         description: 'Returns the matching Markdown upload and file metadata.' },
    ],
  },
  {
    title: 'Quiz History',
    endpoints: [
      { method: 'GET', path: '/quiz-history', description: 'Returns local JSON quiz history; optional subject filters the response.' },
    ],
  },
  {
    title: 'Books',
    endpoints: [
      { method: 'GET',    path: '/books/test',                  description: 'Tests authenticated access to the books module.' },
      { method: 'GET',    path: '/books/public',                description: 'Confirms that the books router responds.' },
      { method: 'POST',   path: '/books/',                      description: 'Uploads a PDF and records book metadata.' },
      { method: 'GET',    path: '/books/',                      description: 'Lists the current user\'s books.' },
      { method: 'GET',    path: '/books/{book_id}',             description: 'Retrieves one of the user\'s books and creates a signed file URL.' },
      { method: 'DELETE', path: '/books/{book_id}',             description: 'Deletes a book record and attempts to remove its stored PDF.' },
      { method: 'PATCH',  path: '/books/{book_id}/progress',    description: 'Updates the current reading page.' },
      { method: 'PATCH',  path: '/books/{book_id}/open',        description: 'Intended to update the last-opened timestamp.' },
    ],
  },
  {
    title: 'Analytics',
    endpoints: [
      { method: 'GET', path: '/analytics/dashboard', description: 'Returns the combined analytics dashboard payload.' },
      { method: 'GET', path: '/analytics/ping',      description: 'Returns a basic backend status message.' },
    ],
  },
  {
    title: 'Profiles',
    endpoints: [
      { method: 'GET',   path: '/profiles/test', description: 'Tests authenticated profile-module access.' },
      { method: 'GET',   path: '/profiles/me',   description: 'Fetches the authenticated user\'s profile.' },
      { method: 'PATCH', path: '/profiles/me',   description: 'Updates supplied fields on the authenticated user\'s profile.' },
    ],
  },
  {
    title: 'Collaboration',
    note: 'All routes protected',
    endpoints: [
      { method: 'POST',   path: '/collaboration/workspaces',                                             description: 'Creates a workspace.' },
      { method: 'GET',    path: '/collaboration/workspaces',                                             description: 'Lists workspaces the user belongs to.' },
      { method: 'POST',   path: '/collaboration/workspaces/{workspace_id}/invitations',                  description: 'Invites a user by email.' },
      { method: 'GET',    path: '/collaboration/invitations',                                            description: 'Lists invitations associated with the user.' },
      { method: 'POST',   path: '/collaboration/invitations/{invitation_id}/accept',                     description: 'Accepts an invitation.' },
      { method: 'POST',   path: '/collaboration/invitations/{invitation_id}/reject',                     description: 'Rejects an invitation.' },
      { method: 'GET',    path: '/collaboration/workspaces/{workspace_id}/members',                      description: 'Lists workspace members.' },
      { method: 'PATCH',  path: '/collaboration/workspaces/{workspace_id}/members/{user_id}/role',       description: 'Changes a member\'s role.' },
      { method: 'DELETE', path: '/collaboration/workspaces/{workspace_id}/members/{user_id}',            description: 'Removes a member.' },
      { method: 'POST',   path: '/collaboration/workspaces/{workspace_id}/resources/notes',              description: 'Shares a note into the workspace.' },
      { method: 'GET',    path: '/collaboration/workspaces/{workspace_id}/resources',                    description: 'Lists workspace resources.' },
      { method: 'DELETE', path: '/collaboration/workspaces/{workspace_id}/resources/{resource_id}',      description: 'Revokes a shared resource.' },
      { method: 'GET',    path: '/collaboration/workspaces/{workspace_id}/resources/{resource_id}/note', description: 'Retrieves a shared note.' },
      { method: 'POST',   path: '/collaboration/workspaces/{workspace_id}/messages',                     description: 'Sends a workspace message.' },
      { method: 'GET',    path: '/collaboration/workspaces/{workspace_id}/messages',                     description: 'Lists messages; supports limit and before query parameters.' },
      { method: 'GET',    path: '/collaboration/workspaces/{workspace_id}/updates',                      description: 'Lists activity updates; supports limit and after.' },
      { method: 'POST',   path: '/collaboration/workspaces/{workspace_id}/polls',                        description: 'Creates a poll.' },
      { method: 'GET',    path: '/collaboration/workspaces/{workspace_id}/polls',                        description: 'Lists workspace polls.' },
      { method: 'GET',    path: '/collaboration/polls/{poll_id}',                                        description: 'Gets poll details.' },
      { method: 'POST',   path: '/collaboration/polls/{poll_id}/vote',                                   description: 'Casts a vote.' },
      { method: 'PATCH',  path: '/collaboration/polls/{poll_id}/close',                                  description: 'Closes a poll.' },
      { method: 'PATCH',  path: '/collaboration/polls/{poll_id}/pin',                                    description: 'Pins or unpins a poll.' },
      { method: 'POST',   path: '/collaboration/workspaces/{workspace_id}/tasks',                        description: 'Creates a workspace task.' },
      { method: 'GET',    path: '/collaboration/workspaces/{workspace_id}/tasks',                        description: 'Lists workspace tasks.' },
      { method: 'PATCH',  path: '/collaboration/tasks/{task_id}',                                        description: 'Updates a task.' },
      { method: 'POST',   path: '/collaboration/tasks/{task_id}/comments',                               description: 'Adds a task comment.' },
      { method: 'GET',    path: '/collaboration/tasks/{task_id}/comments',                               description: 'Lists task comments.' },
      { method: 'DELETE', path: '/collaboration/tasks/{task_id}',                                        description: 'Deletes a task.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════
// Map slug → API groups
// ═══════════════════════════════════════════════════════════════

const apiGroupsBySlug: Record<string, ApiGroup[]> = {
  marketflip: marketflipApiGroups,
  geargrid: geargridApiGroups,
  'rag-v2': ragV2ApiGroups,
}

export function WorkLayout({ w }: { w: Work }) {
  const apiGroups = apiGroupsBySlug[w.slug]

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="wk-hero">
        <div className="wk-container">
          <Link to="/work" className="wk-back">← Back to Work</Link>

          <div className="wk-meta-row">
            <span className="wk-meta-tag">{w.tag}</span>
            <span className="wk-meta-sep">/</span>
            <span className="wk-meta-date">{w.date}</span>
          </div>

          <h1 className="wk-title reveal">{w.title}</h1>

          <p className="wk-summary reveal delay-1">{w.summary}</p>

          <div className="wk-links reveal delay-2">
            {w.live && (
              <a href={w.live} target="_blank" rel="noreferrer" className="wk-link wk-link-primary">
                Live site <span className="wk-arrow">↗</span>
              </a>
            )}
            {w.github && (
              <a href={w.github} target="_blank" rel="noreferrer" className="wk-link">
                Repository <span className="wk-arrow">↗</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FACTS STRIP ═══ */}
      <section className="wk-facts-strip">
        <div className="wk-container">
          <div className="wk-facts-row reveal">
            <Fact label="Stack" values={w.facts.stack} />
            <Fact label="Database" values={[w.facts.database]} />
            <Fact label="Auth" values={[w.facts.auth]} />
            <Fact label="Collaboration" values={[w.facts.collaboration]} />
            <Fact label="Hosting" values={[w.facts.hosting]} />
            <Fact label="Status" values={[w.facts.status]} />
          </div>
        </div>
      </section>

      {/* ═══ BODY ═══ */}
      <section className="wk-body-section">
        <div className="wk-container">
          <div className="wk-main">
            {w.sections.map((s, i) => (
              <article key={s.id} className={`wk-section reveal delay-${Math.min(i + 1, 4)}`}>
                <header className="wk-section-header">
                  <span className="wk-section-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="wk-section-slash">/</span>
                  <span className="wk-section-label">{s.title}</span>
                  <span className="wk-section-line" />
                </header>

                <h2 className="wk-section-title">{s.title}</h2>

                <div className="wk-section-body">
                  {s.id === 'api' && apiGroups
                    ? <ApiList groups={apiGroups} />
                    : <Markdown content={s.content} />
                  }
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER NAV ═══ */}
      <section className="wk-footer-nav">
        <div className="wk-container">
          <Link to="/work" className="wk-footer-back">
            ← All write-ups
          </Link>
        </div>
      </section>

      {/* ═══ STYLES ═══ */}
      <style>{`
        .wk-container { max-width: 900px; margin: 0 auto; width: 100%; min-width: 0; }
        .wk-hero { padding: clamp(7rem, 12vw, 10rem) clamp(1.25rem, 5vw, 3rem) clamp(2.5rem, 5vw, 3.5rem); overflow: hidden; }
        .wk-back { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted-foreground); text-decoration: none; display: inline-block; margin-bottom: 2rem; transition: color 0.2s; cursor: none; }
        .wk-back:hover { color: var(--accent); }
        .wk-meta-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .wk-meta-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); }
        .wk-meta-sep { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--border); }
        .wk-meta-date { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; letter-spacing: 0.1em; color: var(--muted-foreground); }
        .wk-title { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: clamp(2.25rem, 7vw, 4.5rem); line-height: 1.02; letter-spacing: -0.04em; margin: 0 0 1.5rem; overflow-wrap: break-word; }
        .wk-summary { font-size: clamp(0.95rem, 1.6vw, 1.1rem); line-height: 1.75; color: var(--secondary-foreground); max-width: 720px; margin: 0 0 2rem; overflow-wrap: break-word; }
        .wk-links { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .wk-link { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.75rem 1.4rem; text-decoration: none; cursor: none; transition: all 0.2s; border: 1px solid var(--border); color: var(--foreground); display: inline-flex; align-items: center; gap: 0.5rem; }
        .wk-link:hover { border-color: var(--accent); color: var(--accent); }
        .wk-link-primary { background: var(--accent); color: var(--accent-foreground); border-color: var(--accent); }
        .wk-link-primary:hover { background: transparent; color: var(--accent); }
        .wk-arrow { font-size: 0.85em; opacity: 0.8; }
        .wk-facts-strip { padding: 0 clamp(1.25rem, 5vw, 3rem) clamp(2rem, 4vw, 3rem); border-bottom: 1px solid var(--border); margin-bottom: clamp(2.5rem, 5vw, 4rem); overflow: hidden; }
        .wk-facts-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr)); gap: 1.25rem 1.5rem; padding-bottom: clamp(2rem, 4vw, 3rem); border-bottom: 1px solid var(--border); }
        .wk-body-section { padding: 0 clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem); overflow: hidden; }
        .wk-main { min-width: 0; max-width: 100%; width: 100%; }
        .wk-section { margin-bottom: 3.5rem; min-width: 0; }
        .wk-section:last-child { margin-bottom: 0; }
        .wk-section-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem; }
        .wk-section-num { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; color: var(--accent); }
        .wk-section-slash { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--border); }
        .wk-section-label { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted-foreground); }
        .wk-section-line { flex: 1; height: 1px; background: var(--border); margin-left: 0.75rem; }
        .wk-section-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: clamp(1.5rem, 4vw, 2.25rem); letter-spacing: -0.025em; line-height: 1.15; margin: 0 0 1.5rem; overflow-wrap: break-word; }
        .wk-section-body { min-width: 0; }
        .work-mermaid { margin: 2rem 0; padding: 1.75rem 1rem; background: var(--muted); border: 1px solid var(--border); position: relative; overflow-x: auto; display: flex; justify-content: center; min-height: 100px; }
        .work-mermaid::before { content: 'diagram'; position: absolute; top: -0.5rem; left: 0.85rem; background: var(--background); padding: 0 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted-foreground); }
        .work-mermaid svg { max-width: 100%; height: auto; }
        .wk-footer-nav { padding: 2.5rem clamp(1.25rem, 5vw, 3rem) 4rem; border-top: 1px solid var(--border); overflow: hidden; }
        .wk-footer-back { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted-foreground); text-decoration: none; transition: color 0.2s; cursor: none; }
        .wk-footer-back:hover { color: var(--accent); }
        .wk-fact-label { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; display: block; margin-bottom: 0.5rem; }
        .wk-fact-values { display: flex; flex-direction: column; gap: 0.2rem; }
        .wk-fact-value { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--foreground); line-height: 1.45; word-break: break-word; }
      `}</style>
    </>
  )
}

function Fact({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <span className="wk-fact-label">{label}</span>
      <div className="wk-fact-values">
        {values.map((v, i) => (
          <span key={i} className="wk-fact-value">{v}</span>
        ))}
      </div>
    </div>
  )
}