import type { CaseStudy } from './index'

export const loanApproval: CaseStudy = {
  slug: 'loan-approval',
  title: 'Loan Approval Prediction',
  tag: 'Classification · Tabular',
  desc: 'Predicting loan approval from applicant features. Compared four classifiers — RandomForest memorized the training set at 98.32%, but LogisticRegression generalised better with 78.75% on test.',
  tech: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib', 'Seaborn'],
  accent: '#FF4C8B',
  num: '01',
  stats: [
    { label: 'Best test acc', val: '78.75%' },
    { label: 'Models compared', val: '4' },
  ],
  live: null,
  github: 'https://github.com/prateEKsaha07/Loan-Approval-Prediction',
  notebook: null,
  thumbnail: null,
  date: '2025',
  metadata: {
    dataset: 'Loan Approval Prediction',
    source: 'https://www.kaggle.com/datasets/altruistdelhite04/loan-prediction-problem-dataset',
    rows: '614',
    features: '11',
    target: 'Loan_Status (binary)',
    missing: 'Nulls in Dependents (12), LoanAmount (21), Loan_Amount_Term (14), Credit_History (49)',
  },
  sections: [
    {
      id: 'problem',
      title: 'Problem framing',
      content: `The question: given an applicant's demographic and financial profile, can we predict whether a loan will be approved?

This is a binary classification problem. The dataset is small (614 rows) and comes with mild class imbalance and several columns with missing values — both realistic quirks you'd handle in a real credit-risk workflow.`,
    },
    {
      id: 'eda',
      title: 'Exploratory analysis',
      content: `Five columns had missing values — Credit_History (49), LoanAmount (21), Loan_Amount_Term (14), Dependents (12), and Self_Employed. I imputed categorical columns with the mode and numeric columns with the median.

The correlation heatmap showed the two expected relationships: ApplicantIncome ↔ LoanAmount (r = 0.53, larger loans go to higher earners) and Credit_History ↔ Loan_Status (r = 0.56, the strongest single signal in the dataset). No other pair crossed 0.25, which meant feature engineering had limited room to help — the signal was mostly in one column.`,
      charts: [
        {
          src: '/src/assets/lab/loan-approval/01-correlation-heatmap.png',
          caption: 'Correlation matrix. Credit_History ↔ Loan_Status at r = 0.56 dominates. ApplicantIncome ↔ LoanAmount at 0.53 is expected. Everything else sits below 0.25 — a low-signal dataset.',
        },
        {
          src: '/src/assets/lab/loan-approval/02-missing-values.png',
          caption: 'Missing values were concentrated in Credit_History (49) — the one column that mattered most. That imbalance shaped how I handled imputation.',
        },
      ],
    },
    {
      id: 'features',
      title: 'Feature engineering',
      content: `All categorical columns were label-encoded (Gender, Married, Education, Self_Employed, Property_Area) and the target (Loan_Status) was mapped Y/N → 1/0.

I did not engineer new features. With only 614 rows and one dominant feature (Credit_History), engineered features would have added variance without adding signal. This was a deliberate choice, and the model results below show why it was probably still not enough.`,
    },
    {
      id: 'modeling',
      title: 'Modeling',
      content: `I compared four classifiers on a 60/40 train-test split with random_state=42. The training results looked great for tree-based models. The test results told a different story.`,
      table: {
        headers: ['Model', 'Train Acc', 'Test Acc', 'Gap'],
        rows: [
          ['KNeighborsClassifier', '75.42%', '65.00%', '-10.4'],
          ['RandomForestClassifier', '98.32%', '74.58%', '-23.7'],
          ['SVC', '68.44%', '69.58%', '+1.1'],
          ['LogisticRegression', '81.28%', '78.75%', '-2.5'],
        ],
        note: 'The gap column is the story. RandomForest memorized the training set and lost 24 points on test. LogisticRegression was 2.5 points off — the most stable model.',
      },
    },
    {
      id: 'evaluation',
      title: 'Evaluation',
      content: `RandomForest's 98.32% training accuracy was misleading — it dropped to 74.58% on test, a 24-point gap that signals severe overfitting. With only 358 training rows and a single dominant feature, a deep ensemble had nothing to regularize against.

LogisticRegression ended up being the better model in practice: 78.75% test accuracy with only a 2.5-point train-test gap. On tabular data with 614 rows and one strong feature, a linear model was the right call.

That said, 78% is not production-grade for credit risk. The honest read is that this dataset is too small and too single-featured for any model to reliably separate approvers from rejecters.`,
      charts: [
        {
          src: '/src/assets/lab/loan-approval/03-train-vs-test.png',
          caption: 'RandomForest memorized the training set (98.3%) and collapsed on test (74.6%). LogisticRegression was the more honest model.',
        },
      ],
    },
    {
      id: 'next',
      title: "What I'd do next",
      content: `Three things I'd do differently next time:

→ Increase the test split or use stratified 5-fold cross-validation. A single 60/40 split on 614 rows is too noisy to trust — the RandomForest gap might shrink or grow with a different seed.

→ Regularize RandomForest (max_depth, min_samples_leaf) instead of letting trees grow unbounded. The 98% train score is a red flag, not a win.

→ Report precision, recall, and F1 for the minority class instead of accuracy. With 69% approvals, a "predict everything as approved" baseline already scores 69% — accuracy alone rewards the majority class.`,
    },
  ],
}