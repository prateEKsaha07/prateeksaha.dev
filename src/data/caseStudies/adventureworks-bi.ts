import type { CaseStudy } from './index'

export const adventureworksBi: CaseStudy = {
  slug: 'adventureworks-bi',
  title: 'AdventureWorks — Sales Analysis',
  tag: 'Data Analytics · Power BI',
  desc: 'End-to-end sales analysis on the AdventureWorks MySQL database. SQL extraction with joins and aggregations, star-schema modeling in Power BI, DAX measures for margins and ranking, and an interactive dashboard comparing actual sales against budget across customers, products, and geographies.',
  tech: ['MySQL', 'SQL', 'Power BI', 'DAX', 'Power Query'],
  accent: '#FFB800',
  num: '03',
  stats: [
    { label: 'Tables modeled', val: '5' },
    { label: 'DAX measures', val: '8+' },
  ],
  live: null,
  github: 'https://github.com/prateEKsaha07/CRM-Sales-Overview-Data-Analysis',
  notebook: null,
  thumbnail: null,
  date: '2026',
  metadata: {
    dataset: 'AdventureWorks (Microsoft sample database)',
    source: 'https://learn.microsoft.com/en-us/sql/samples/adventureworks-install-configure',
    rows: 'Multi-table relational',
    features: 'Sales, Product, Customer, Date, Geography, Budget',
    target: 'Business insights · Sales vs Budget',
  },
  sections: [
    {
      id: 'problem',
      title: 'Problem framing',
      content: `AdventureWorks is Microsoft's sample database — a fictional bicycle manufacturer with a realistic multi-table schema covering sales, products, customers, geography, and finance. It's designed to mirror the shape of a real business's data: relational, normalized, and connected across entities.

The task was to build a **sales analysis solution** that answers the questions a business analyst would actually be asked: how are sales trending, which customers and products drive revenue, and how does actual performance compare to the budget. That's not a modeling problem — it's a reporting problem, and it exercises a different skill set than machine learning.

Three skills in particular: **SQL** for structured extraction across normalized tables, **data modeling** to shape that data into something a BI tool can consume efficiently, and **DAX** to express business logic as reusable measures. The dashboard is the output, but the work happens before the visuals.`,
    },
    {
      id: 'sql',
      title: 'SQL extraction',
      content: `Data was retrieved from the MySQL instance of AdventureWorks using hand-written SQL rather than a drag-and-drop ETL tool. The queries combine sales data with product and customer detail using **INNER JOINs**, filter with **WHERE** clauses, and aggregate with **GROUP BY** to produce the fact and dimension extracts that feed the model.

Writing the extraction in SQL instead of extracting raw tables and joining inside Power BI keeps the relational logic in one place — the database. It also makes the pipeline auditable: any number in the dashboard can be traced back to a specific query.

\`\`\`sql
SELECT
  c.CustomerID,
  CONCAT(c.FirstName, ' ', c.LastName) AS CustomerName,
  SUM(s.TotalDue) AS TotalSales,
  COUNT(s.SalesOrderID) AS OrderCount
FROM Sales s
INNER JOIN Customer c ON s.CustomerID = c.CustomerID
WHERE s.OrderDate >= '2024-01-01'
GROUP BY c.CustomerID, c.FirstName, c.LastName
ORDER BY TotalSales DESC;
\`\`\`

**Data validation.** Before loading anything into Power BI, each extract was sanity-checked: row counts against the source tables, referential integrity on the join keys, and null checks on fields that would be used in measures. Getting this right at the SQL layer prevents incorrect numbers from propagating into visuals — where they're much harder to catch.

Charts below show one of the extraction queries in the MySQL workbench.`,
      charts: [
        {
          src: '/lab/adventureworks-bi/02-sql-query.png',
          caption: 'One of the SQL extracts — the customer join, showing the shape of the query output before Power BI transformation.',
        },
      ],
    },
    {
      id: 'transformation',
      title: 'Power Query transformation',
      content: `Once extracted, the data passes through **Power Query** for cleaning and reshaping. This layer is deliberately separate from the SQL layer — SQL handles relational logic (which rows, which joins), Power Query handles **column-level hygiene**: renaming fields for clarity, correcting data types, removing nulls and empty columns, and standardizing date and numeric formats.

**The date table was generated in Power Query, not imported.** AdventureWorks ships with a transactional sales table but no dedicated calendar dimension. Rather than rely on auto-date hierarchies (which bloat the model and break down across fiscal years), a proper date table was built using M script — one row per day, with columns for year, quarter, month, week number, day name, and fiscal period.

\`\`\`m
let
    StartDate = #date(2022, 1, 1),
    EndDate = #date(2026, 12, 31),
    DayCount = Duration.Days(EndDate - StartDate) + 1,
    DateList = List.Dates(StartDate, DayCount, #duration(1,0,0,0)),
    DateTable = Table.FromList(
        DateList,
        Splitter.SplitByNothing(),
        {"Date"}
    ),
    AddYear = Table.AddColumn(DateTable, "Year", each Date.Year([Date])),
    AddMonth = Table.AddColumn(AddYear, "Month", each Date.Month([Date])),
    AddQuarter = Table.AddColumn(AddMonth, "Quarter", each Date.QuarterOfYear([Date]))
in
    AddQuarter
\`\`\`

Every date field across the model references this single table. When a slicer filters "2025", it's filtering through this table, and every measure that depends on time context reads from it. This is the standard **date-table pattern** — it's what makes time intelligence functions like YTD, MTD, and YoY work correctly.`,
      charts: [
        {
          src: '/lab/adventureworks-bi/03-date-table-script.png',
          caption: 'The M script that generates the date dimension. One table, generated once, referenced by every time-based measure in the model.',
        },
      ],
    },
    {
      id: 'modeling',
      title: 'Data modeling',
      content: `The Power BI model uses a **star schema** — one fact table surrounded by dimension tables, with one-to-many relationships from each dimension to the fact.

**Fact table:**
- \`Sales\` — the transactional grain, one row per order line

**Dimension tables:**
- \`Product\` — product hierarchy, category, subcategory
- \`Customer\` — customer details and geography keys
- \`Date\` — the generated date table
- \`Geography\` — region, country, city for map visuals
- \`Budget\` — separate fact-like table for planned figures

**Relationships.** Every dimension connects to Sales with one-to-many cardinality, single-direction filtering. Sales also connects to Budget through shared Date and Product keys, which is what makes actual-vs-budget comparison possible without a separate join in every measure.

**Why a star schema and not a flat table?** A flat table would work for simple visuals but breaks down the moment you need to filter across multiple dimensions. Star schema gives Power BI's engine the shape it expects — filter context propagates from dimensions to fact, and time intelligence works correctly. It's also the shape a business analyst would recognize: the same pattern is used in every well-modeled warehouse.

**The Budget table was the tricky one.** Budget is stored at a different grain than Sales — by month and product category, not by order line. Rather than force the two into the same table, the model keeps them separate and lets relationships do the work. Actual sales get compared against budget at the category-month level, which is the grain the business actually plans at.`,
      charts: [
        {
          src: '/lab/adventureworks-bi/01-star-schema.png',
          caption: 'The star schema. Sales at the center, one-to-many relationships outward to Product, Customer, Date, and Geography. Budget connects through shared keys for actual-vs-budget comparisons.',
        },
      ],
    },
    {
      id: 'dax',
      title: 'DAX measures',
      content: `All business logic is expressed as reusable **DAX measures** rather than calculated columns. Measures evaluate in the context of whatever filters are active — the same measure produces different numbers depending on what's sliced, which is what makes a dashboard interactive.

**Core measures:**

- **Total Sales** — \`SUM(Sales[TotalDue])\`, the baseline
- **Total Budget** — \`SUM(Budget[Amount])\`, from the budget table
- **Sales Variance** — actual minus budget, the business's primary health check
- **Profit** — revenue minus cost
- **Profit Margin %** — profit divided by revenue
- **Sales by Category** — filtered aggregate per product category
- **Customer Ranking** — dynamic ranking using \`RANKX\`
- **Contribution % to Total Sales** — each customer's share of total

**Where context modification matters.** \`CALCULATE\` is used to modify filter context — for example, to compute "sales last year" by applying a date filter inside a measure, regardless of what the report page is currently slicing on. \`RANKX\` iterates over a table to produce rankings that recalculate when the underlying data or filters change.

The measure that best demonstrates DAX context: **Customer Ranking**. It ranks each customer by sales within the currently selected slice. Change the slicer from "all years" to "2025" and the ranks recompute. Change the category filter and they recompute again. That behavior is what \`RANKX\` with proper filter propagation gives you — and why measures beat static columns for anything analytical.`,
      charts: [
        {
          src: '/lab/adventureworks-bi/04-dax-measures.png',
          caption: 'The measure definitions. Each one is a reusable expression that adapts to whatever the report page is filtered by.',
        },
      ],
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      content: `The final dashboard is a single-page Sales Overview, designed so that every visual answers a business question rather than just displaying data.

**Composition:**
- **KPI card** at the top with total sales and a growth indicator
- **Sales trend** over time — the primary time series
- **Category-wise sales distribution** — where revenue concentrates
- **Top customers** — who drives the numbers
- **Top sub-categories** — the granular product view
- **Sales vs Budget** — a monthly comparison
- **Geographic distribution** — a map visual by customer city
- **Interactive slicers** — Year, Month, Category, Sub-Category, and Customer City

**Design principles applied.** Every visual is filtered by the slicers, and every measure responds to that filter context. The KPI card sits at the top because that's the number an executive looks at first. Trend goes second because "is this getting better or worse" is the next question. Detail views — top customers, sub-categories — come last, once the reader has oriented themselves.

**Why interactive slicers and not static filters.** Static filters produce static reports, which are useful once and stale immediately. Slicers let the same dashboard answer different questions — "how did Q3 perform" and "which cities buy the most Category X" are the same layout with different filters applied. The dashboard was built once; the number of questions it can answer is much larger.`,
      charts: [
        {
          src: '/lab/adventureworks-bi/05-dashboard-overview.png',
          caption: 'The completed Sales Overview dashboard. KPI, trend, category breakdown, top customers, top sub-categories, actual vs budget, geographic distribution, and interactive slicers across Year, Month, Category, Sub-Category, and City.',
        },
      ],
    },
    {
      id: 'insights',
      title: 'Key insights',
      content: `A few things the dashboard revealed once it was live:

**Revenue concentration.** A single product category contributes the majority of total revenue. This isn't unusual for AdventureWorks's data, but seeing the concentration on the category slice makes a clear case for either doubling down on the winner or investing in diversification — a judgment call for the business, not the analyst.

**Top customers matter disproportionately.** The customer ranking measure exposed a small set of high-value customers accounting for a significant share of revenue. That's a retention risk signal as much as it is a sales signal.

**Budget alignment varies by month and segment.** Certain months consistently outperform budget and others consistently underperform, and the pattern differs across product segments. That's the sort of finding that changes how a company forecasts — not just whether targets were met, but where the systematic variance lives.

**Geography drives meaningful variation.** Sales distribution by city isn't uniform. The map view makes it easy to see where the business has geographic concentration and where it has room to grow.

None of these are novel findings — they're the kind of thing a business analyst surfaces every quarter. That's the point. The dashboard doesn't produce surprising insights; it produces reliable ones, fast, on demand.`,
    },
    {
      id: 'next',
      title: "What I'd do next",
      content: `Three improvements, in order of value:

**→ Add row-level security.** The dashboard currently shows all data to anyone who opens it. In a real deployment, sales reps should see their own territory and managers should see their own team. RLS in Power BI service is the standard pattern — it's a small configuration change that unlocks actual multi-user deployment.

**→ Build a drill-through page for customers.** The Top Customers visual is currently a static ranking. Drill-through would let a user click a customer and land on a filtered detail page showing that customer's order history, product mix, and time series. This is the difference between "a report" and "an exploratory tool."

**→ Migrate to a scheduled refresh pipeline.** Right now the data flows MySQL → Power BI manually. A scheduled refresh through the Power BI service, or a proper ETL pipeline through something like Airflow or dbt, would make the dashboard self-updating. That's the shift from analyst artifact to production reporting.`,
    },
  ],
}