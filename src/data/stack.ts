export type StackGroup = {
  label: string
  note?: string
  items: {
    name: string
    detail: string
  }[]
}

export const essentials = [
  { name: 'FastAPI', detail: 'Backend services' },
  { name: 'Postgres', detail: 'Relational data' },
  { name: 'React', detail: 'Frontend layer' },
  { name: 'Python', detail: 'Backend + data + ML' },
  { name: 'Vercel + Render', detail: 'Deployment' },
  { name: 'Supabase', detail: 'Auth + data + realtime' },
]

export const stack: StackGroup[] = [
  {
    label: 'Editor & Environment',
    items: [
      { name: 'VS Code', detail: 'Primary editor. Prettier, ESLint, Python, Tailwind IntelliSense.' },
      { name: 'PowerShell', detail: 'Windows terminal. Aliases for common Git workflows.' },
      { name: 'JetBrains Mono', detail: 'Font across editor, terminal, and this site.' },
      { name: 'Jupyter Notebook', detail: 'For exploratory analysis and case study notebooks.' },
    ],
  },
  {
    label: 'Backend',
    items: [
      { name: 'FastAPI', detail: 'Typed routes, async-native, OpenAPI docs out of the box.' },
      { name: 'Pydantic', detail: 'Request and response validation on every endpoint.' },
      { name: 'Uvicorn', detail: 'ASGI server for local dev and Render deployment.' },
      { name: 'Node.js', detail: 'Async runtime for JavaScript backends. Used across academic projects.' },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { name: 'React 19', detail: 'UI layer for every web project. Function components, hooks.' },
      { name: 'Vite', detail: 'Build tool. Fast dev server, straightforward production builds.' },
      { name: 'Tailwind CSS', detail: 'Utility-first styling. Faster than custom CSS for layout work.' },
      { name: 'React Router', detail: 'Client-side routing. Powers /lab, /work, /now on this site.' },
      { name: 'Framer Motion', detail: 'Animation for React. Used for landing-page motion.' },
      { name: 'Recharts', detail: 'SVG-based charts in React dashboards.' },
    ],
  },
  {
    label: 'Data & Databases',
    items: [
      { name: 'PostgreSQL', detail: 'Primary relational database. Supabase-hosted, RLS-enabled.' },
      { name: 'Supabase', detail: 'Postgres + Auth + Storage + Realtime. Backbone of two shipped projects.' },
      { name: 'Pandas + NumPy', detail: 'Data manipulation. Every notebook and case study starts here.' },
      { name: 'MySQL', detail: 'Used for SQL extraction in the AdventureWorks analysis.' },
      { name: 'MongoDB', detail: 'Document store. Foundational — used in a couple of small projects.' },
      { name: 'FAISS', detail: 'Vector similarity search. Powers the RAG pipeline in AI Study Companion.' },
      { name: 'Cloudinary', detail: 'Image hosting and transformation. Handles all user-uploaded photos.' },
    ],
  },
  {
    label: 'Machine Learning',
    items: [
      { name: 'scikit-learn', detail: 'Classical ML. Regression, classification, model evaluation.' },
      { name: 'TensorFlow + Keras', detail: 'Used in early ML coursework and a couple of projects.' },
      { name: 'PyTorch', detail: 'Deep learning framework. YOLOv8 for SENTINEL.v8.' },
      { name: 'YOLOv8', detail: 'Object detection. Custom-trained on Indian traffic data.' },
      { name: 'OpenCV', detail: 'Image and video processing. Pipeline work for computer vision.' },
      { name: 'Cohere', detail: 'Embeddings and Command-R LLM. Used across the RAG project.' },
      { name: 'Groq API', detail: 'LLaMA 3 inference for the Ask-Your-Database text-to-SQL tool.' },
      { name: 'Ollama', detail: 'Running LLMs locally for experimentation.' },
    ],
  },
  {
    label: 'Data Visualization',
    items: [
      { name: 'Matplotlib + Seaborn', detail: 'Charts for notebooks and case studies. Dark-themed to match this site.' },
      { name: 'Power BI', detail: 'Interactive dashboards with DAX and Power Query.' },
      { name: 'Recharts', detail: 'Charts inside React dashboards. Analytics view in AI Study Companion.' },
      { name: 'MS Excel', detail: 'Pivot tables, slicers, quick analysis before SQL.' },
    ],
  },
  {
    label: 'Annotation & Dataset Tooling',
    items: [
      { name: 'GT Studio', detail: '3D LiDAR annotation and validation. Used during the AugTech internship.' },
      { name: 'CVAT', detail: '2D image annotation for computer vision datasets.' },
      { name: 'Pascal VOC / YOLO formats', detail: 'Handled XML→YOLO conversion pipelines for training data.' },
    ],
  },
  {
    label: 'Deployment & Hosting',
    items: [
      { name: 'Vercel', detail: 'Frontend hosting. Auto-deploys from GitHub on every push.' },
      { name: 'Render', detail: 'Backend hosting. Runs FastAPI services for shipped projects.' },
      { name: 'Supabase Edge Functions', detail: 'Serverless jobs for scheduled tasks like auction closing.' },
      { name: 'pg_cron', detail: 'Postgres-based scheduled jobs. Handles expiries and reminders.' },
    ],
  },
  {
    label: 'Version Control & Tooling',
    items: [
      { name: 'Git + GitHub', detail: 'Source control. Feature branches, then merge to main.' },
      { name: 'npm', detail: 'Package manager for JavaScript projects.' },
      { name: 'pip + venv', detail: 'Python dependency management. One venv per backend project.' },
    ],
  },
  {
    label: 'Currently Learning',
    items: [
      { name: 'Cloud Platforms', detail: 'AWS and Azure fundamentals. Reading and small experiments.' },
      { name: 'Containerization', detail: 'Docker for local and deployment consistency.' },
      { name: 'Data Pipelines', detail: 'Big Data concepts, Databricks, and pipeline architecture.' },
      { name: 'Advanced ML', detail: 'Deeper algorithm study — theory and implementation.' },
      { name: 'Multi-agent LLM patterns', detail: 'Structuring multiple agents that collaborate on a task.' },
    ],
  },
]