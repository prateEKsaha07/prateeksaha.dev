export const resume = {
  name: 'Prateek Saha',
  title: 'Backend Developer · Data & ML',
  email: 'prateeksaha963@gmail.com',
  phone: '+91 6261156183',
  github: 'https://github.com/prateEKsaha07',
  linkedin: 'https://www.linkedin.com/in/prateeksaha',
  location: 'Bhilai, Chhattisgarh, India',

  summary: `Backend developer with a working data science side. I design and ship APIs, services, and full-stack applications — mostly with FastAPI, Postgres, and Supabase. Alongside that I run a public lab of ML case studies where I write up the reasoning behind modeling choices, not just the results. Currently pursuing an MCA at CSVTU while building real products.`,

  projects: [
    {
      title: 'MarketFlip',
      desc: 'Reverse marketplace where buyers post requests and sellers compete through live bids.',
      bullets: [
        'Built the FastAPI backend and designed the REST surface for auctions, bids, and user roles.',
        'Implemented role-based auth with OTP verification and JWT session handling.',
        'Added real-time chat between buyers and sellers, and ML features for price suggestion, bid ranking, and fraud detection.',
      ],
      tech: ['React 19', 'FastAPI', 'Supabase', 'PostgreSQL'],
      live: 'https://marketflip-mauve.vercel.app',
      github: 'https://github.com/prateEKsaha07/marketflip',
    },
    {
      title: 'AI Study Companion',
      desc: 'RAG-powered study assistant that ingests uploaded course materials and generates quizzes, weak-topic detection, and adaptive learning roadmaps.',
      bullets: [
        'Built the RAG pipeline with per-user FAISS vector indexes and Cohere embeddings.',
        'Designed quiz generation, weak-topic detection, and adaptive roadmap features on top of the vector store.',
        'Wired FastAPI backend to React frontend with a learning-analytics dashboard using Recharts.',
      ],
      tech: ['React', 'FastAPI', 'FAISS', 'Cohere'],
      live: 'https://rag-v2-gules.vercel.app/',
      github: 'https://github.com/prateEKsaha07/RAG_v2',
    },
    {
      title: 'SENTINEL.v8',
      desc: 'YOLOv8 vehicle-detection system trained on a custom Indian traffic dataset (IDD + Bhilai scenes, ~979 images).',
      bullets: [
        'Built the XML→YOLO annotation conversion pipeline for the training data.',
        'Ran multi-epoch training experiments; best run hit Precision 0.81 and mAP@50 0.63.',
        'Shipped a Streamlit inference UI for interactive image upload and detection.',
      ],
      tech: ['Python', 'YOLOv8', 'OpenCV', 'Streamlit'],
      live: null,
      github: 'https://github.com/prateEKsaha07/Sentinel.v8',
    },
  ],

  experience: [
    {
      role: 'Process Executive Intern',
      company: 'AugTech NextWealth IT Services',
      duration: 'Jun 2025 – Jan 2026',
      location: 'Bhilai, CG',
      bullets: [
        'Annotated and validated 3D LiDAR point clouds using GT Studio for an autonomous-driving dataset.',
        'Labeled vehicles, traffic signals, and occlusion regions across a large multi-class image corpus used for AI/ML training.',
        'Maintained 95%+ annotation accuracy across high-volume QA workflows, verified against reviewer feedback.',
        'Performed quality checks against daily productivity targets, consistently meeting or exceeding throughput requirements.',
      ],
    },
  ],

  education: [
    {
      degree: 'MCA',
      institution: 'Chhattisgarh Swami Vivekanand Technical University (CSVTU)',
      duration: '2025 – 2027',
      status: 'Pursuing',
    },
    {
      degree: 'BCA',
      institution: 'Hemchand Yadav Vishwavidyalaya, Durg',
      duration: '2021 – 2025',
      status: 'Completed',
    },
  ],

  skills: {
    'Backend':   ['FastAPI', 'REST APIs', 'JWT Auth', 'Django', 'Supabase'],
    'Data & ML': ['Pandas', 'NumPy', 'scikit-learn', 'YOLOv8', 'RAG', 'FAISS'],
    'Databases': ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite'],
    'Frontend':  ['React', 'Tailwind CSS', 'Vite'],
    'Languages': ['Python', 'SQL', 'JavaScript', 'C++', 'Java'],
    'Tools':     ['Git', 'GitHub', 'Vercel', 'Render', 'VS Code'],
  },

  certifications: [
    { name: 'Web Development Bootcamp', issuer: 'Colt Steele · Udemy', year: '2025' },
    { name: 'Machine Learning & Data Science', issuer: 'Kirill Eremenko · Udemy', year: '2026 (Ongoing)' },
    { name: 'Learn SQL using MySQL', issuer: 'Prateek Narang · Scaler', year: '2024' },
    { name: 'Data Structures & Algorithms (C++)', issuer: 'Aditya Jain · Scaler', year: '2024' },
  ],
}