import type { CaseStudy } from './index'

export const diseaseSymptomClassifier: CaseStudy = {
  slug: 'disease-symptom-classifier',
  title: 'Disease Classification from Symptom Vectors',
  tag: 'Multiclass · Healthcare',
  desc: 'A 41-class symptom-to-disease classifier built on 10 binary symptom features and 2,000 labelled rows. RandomOverSampler for class balance, three base models (SVM, Random Forest, GaussianNB), and a mode-vote ensemble. The headline finding is cautionary: training-set accuracy reached 63% for Random Forest, but 5-fold cross-validation — the only held-out signal — tops out at 49.6% for SVM. The 13-point gap between train and CV is what happens when oversampling leaks rows across folds.',
  tech: ['Python', 'scikit-learn', 'imbalanced-learn', 'pandas', 'seaborn', 'Matplotlib'],
  accent: '#6C8AE4',
  num: '04',
  stats: [
    { label: 'Classes', val: '41' },
    { label: 'Features', val: '10' },
    { label: 'Rows', val: '2,000' },
    { label: 'Best CV accuracy', val: '0.4963' },
  ],
  live: null,
  github: 'https://github.com/prateEKsaha07',
  notebook: null,
  thumbnail: null,
  date: '2026',
  metadata: {
    dataset: 'improved_disease_dataset.csv',
    source: 'https://www.kaggle.com/datasets', // TODO: replace with exact Kaggle dataset URL
    rows: '2,000',
    features: '10 binary symptom indicators (fever, headache, nausea, vomiting, fatigue, joint_pain, skin_rash, cough, weight_loss, yellow_eyes)',
    target: 'disease (41 classes, label-encoded)',
    missing: 'fillna(0) applied unconditionally; no missing-value audit performed',
  },
  sections: [
    {
      id: 'problem',
      title: 'Problem framing',
      content: `Given a set of observed symptoms, predict which of 41 diseases the patient is most likely to have. The framing is a clean multiclass classification problem: 10 binary symptom features in, one disease label out, across 2,000 labelled rows. The intended application is a symptom-checker style triage aid — the kind of thing that could sit behind a chatbot or a clinic intake form.

The hard part, which the notebook underestimates, is that 2,000 rows across 41 classes averages to about 49 examples per class, and only 10 binary features to separate them. With 2¹⁰ = 1,024 possible symptom vectors and 41 labels, the class boundaries are inherently coarse. Two different diseases that present with the same symptom combination are indistinguishable in this feature space, no matter what model you throw at them. This constraint drives everything that follows.`,
    },
    {
      id: 'eda',
      title: 'Exploratory analysis',
      content: `The dataset has 2,000 rows and 11 columns: 10 binary symptom indicators plus a disease label. A LabelEncoder was applied to the disease column to produce integer targets. Symptom columns were not scaled (they are already 0/1) and no feature distributions were plotted beyond the class balance check.

A class distribution plot was rendered before resampling and shows the dataset is significantly imbalanced — some diseases appear far more frequently than others. With 2,000 rows split across 41 classes, several diseases are likely represented by only a handful of examples, which puts a hard floor on how much RandomOverSampler can accomplish without simply duplicating the same few rows many times over.

There is no analysis of symptom frequency, no co-occurrence matrix, and no check for duplicate rows or contradictory labels (identical symptom vectors assigned to different diseases). That last omission is important: with only 1,024 possible symptom vectors and 2,000 rows, duplicates are essentially guaranteed — and if any of those duplicates carry different disease labels, those are irreducible errors. The notebook never quantifies that ceiling.`,
      charts: [
        {
          src: '/lab/disease-symptom-classifier/class-distribution.png',
          caption: 'Class distribution before RandomOverSampler. Strong imbalance across 41 disease classes on 2,000 rows.',
        },
      ],
    },
    {
      id: 'features',
      title: 'Feature engineering',
      content: `No feature engineering was performed. The raw 10 binary symptom columns were used directly. A \`gender\` column is referenced conditionally in the notebook (\`if 'gender' in x_resampled.columns\`) and would be label-encoded if present, but the dataset is 11 columns total (10 symptoms + disease), so \`gender\` is not in this data and that branch never executes.

A \`fillna(0)\` was applied to \`x_resampled\`, which for binary symptom flags means "assume the symptom is absent." That is a defensible choice for symptom data, but the notebook never inspects whether any values were actually missing — the fill is unconditional and silently no-ops if there is nothing to fill.

With 2,000 rows over 41 classes and only 10 binary features, the space for meaningful feature work is the real story of this dataset. Aggregating symptoms into body-system groups (neurological, gastrointestinal, respiratory), encoding symptom severity as ordinal rather than binary, or building co-occurrence flags ("fever AND rash") are all unexplored. None were attempted.`,
    },
    {
      id: 'modeling',
      title: 'Modeling',
      content: `Four models were trained: Decision Tree, Random Forest, SVM (RBF default), and Gaussian Naive Bayes. Class imbalance was addressed with \`RandomOverSampler(random_state=42)\` applied once to the full dataset before any train/test split — this is the source of the evaluation problem discussed below, because duplicated minority-class rows end up on both sides of every subsequent split.

Model performance was first estimated with \`cross_val_score\` over \`StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\`. Those numbers are the only genuinely held-out estimates in the notebook. The SVM, Random Forest, and Decision Tree were then refit on the full resampled dataset and their confusion matrices were computed on the same resampled dataset — a train-set evaluation. Gaussian Naive Bayes was also fit and evaluated on the training set.

An ensemble was constructed by majority vote: \`mode([svm_pred, nv_pred, rf_pred])\` per sample. With three voters, \`mode\` returns the first element on a tie, so when all three models disagree the ensemble silently defers to whichever label was passed first — in this case, SVM. The ensemble is not a genuine vote, and its accuracy tracks SVM's almost exactly (0.6068 vs. 0.6043 on the training set), which confirms the behavior.`,
      table: {
        headers: ['Model', 'CV mean accuracy', 'Train-set accuracy', 'Gap'],
        rows: [
          ['Decision Tree', '0.4754', 'not reported', '—'],
          ['Random Forest', '0.4933', '0.6317', '+0.1384'],
          ['SVM (RBF)', '0.4963', '0.6043', '+0.1080'],
          ['Gaussian Naive Bayes', '0.3071', '0.4216', '+0.1145'],
          ['Ensemble (mode vote)', 'not reported', '0.6068', '—'],
        ],
        note: 'The train–CV gap is the story. Random Forest memorizes the training set 14 points better than it generalizes; SVM is the least overfit and the best generalizer despite not being the best memorizer. Gaussian Naive Bayes underfits on both axes — 0.3071 CV is close to the majority-class baseline for this imbalanced 41-way problem.',
      },
    },
    {
      id: 'evaluation',
      title: 'Evaluation',
      content: `This section is the point of the case study, and it is a negative result.

Every confusion matrix rendered in the notebook — for SVM, GaussianNB, Random Forest, and the ensemble — was computed on \`y_resampled\`, i.e., the same labels the models were trained on. There is no train/test split anywhere in the notebook. The "final accuracy is 60.64%" line refers to training-set agreement between the ensemble and labels the ensemble has already seen.

The only honest number is the 5-fold stratified cross-validation: 0.4754 for Decision Tree, 0.4933 for Random Forest, 0.4963 for SVM, and 0.3071 for Gaussian Naive Bayes. Even those are optimistic, because RandomOverSampler was applied to the full dataset before cross-validation, so duplicated minority-class rows leak across folds. The true out-of-fold accuracy is likely lower than what CV reported.

Look at the gap column in the modeling table. Random Forest's train accuracy (0.6317) is 13.8 points above its CV accuracy (0.4933). That is what memorization looks like when oversampled rows sit on both sides of the validation boundary. SVM shows a smaller gap (10.8 points) because the RBF kernel regularizes more aggressively — which is why it is the best generalizer here (0.4963 CV) despite not being the best trainer. Gaussian Naive Bayes sits at 0.3071 CV, which for a 41-class imbalanced problem is close to the majority-class baseline.

For context: a uniform random guess scores 1/41 ≈ 2.4%. A majority-class predictor would score somewhere in the range of the largest class proportion (the class balance plot suggests 5–10%). SVM's 49.6% CV is meaningfully above both, but it also means the model is wrong on half the held-out data. That is not deployable for any clinical or triage use — the honest framing is that the model learns something real but the ceiling imposed by 10 binary features over 41 classes caps it well below useful.

One additional red flag: the notebook's Random Forest cell is labeled "GaussianNB accuracy: 68.98%" in its print statement. That is a copy-paste error — the number is Random Forest train-set accuracy, and the "GaussianNB" label is wrong.`,
      charts: [
        {
          src: '/lab/disease-symptom-classifier/confusion-svm.png',
          caption: 'SVM confusion matrix — computed on training data. 0.6043 train accuracy vs. 0.4963 CV.',
        },
        {
          src: '/lab/disease-symptom-classifier/confusion-nb.png',
          caption: 'Gaussian Naive Bayes — 0.4216 train accuracy, 0.3071 CV. The weakest of the four models on both axes.',
        },
        {
          src: '/lab/disease-symptom-classifier/confusion-rf.png',
          caption: 'Random Forest — 0.6317 train accuracy, 0.4933 CV. The largest train–CV gap of any model.',
        },
        {
          src: '/lab/disease-symptom-classifier/confusion-ensemble.png',
          caption: 'Mode-vote ensemble — 0.6068 train accuracy, dominated by SVM due to mode tie-breaking.',
        },
      ],
    },
    {
      id: 'inference',
      title: 'Inference wrapper',
      content: `The notebook ends with a small \`predict_disease(symptoms)\` helper that accepts a comma-separated symptom string, builds a one-hot input row, and runs all three base models — returning each model's prediction plus a mode-vote consensus.

\`\`\`python
def predict_disease(input_symptoms):
    input_symptoms = input_symptoms.split(",")
    input_data = [0] * len(symptoms_index)
    for symptom in input_symptoms:
        if symptom in symptoms_index:
            input_data[symptoms_index[symptom]] = 1
    input_df = pd.DataFrame([input_data], columns=symptoms)

    rf_pred  = encoder.inverse_transform([rf_model.predict(input_df)[0]])[0]
    svm_pred = encoder.inverse_transform([svm_model.predict(input_df)[0]])[0]
    nv_pred  = encoder.inverse_transform([nv_model.predict(input_df)[0]])[0]

    final_pred = mode([rf_pred, nv_pred, svm_pred])
    return {
        "random forest classification": rf_pred,
        "vector metrix classfication":  svm_pred,
        "naive bayes classification":   nv_pred,
        "final prediction":             final_pred,
    }
\`\`\`

The interface is the right shape for a demo — the user types symptoms, gets structured output. The problem is that the wrapper sits on top of models whose generalization was never measured, and it inherits the same \`mode\` tie-breaking issue described in the modeling section. A demo run with \`"vomiting,skin_rash,nausea"\` returned Random Forest = Vertigo, SVM = Dengue, Naive Bayes = Dengue, final = Dengue — the last only because SVM and NB agreed by coincidence, not because the ensemble is doing meaningful work.`,
    },
    {
      id: 'next',
      title: "What I'd do next",
      content: `The first fix is the one that matters most: evaluate properly. That means either a held-out test set or, better, \`imblearn.pipeline.Pipeline\` with \`RandomOverSampler\` inside each \`StratifiedKFold\` fold, so oversampled rows never appear in validation. Based on the CV numbers above, my expectation is that the honest number drops into the 30–40% range for SVM and Random Forest, and below 25% for Gaussian Naive Bayes. Publishing those numbers — not the 60% train accuracy — is the case study.

Second, quantify the ceiling. With 2,000 rows and only 1,024 possible symptom vectors, duplicates are unavoidable. Group the dataset by symptom vector and check how many distinct vectors map to more than one disease. If, say, 30% of distinct vectors are ambiguous, then no classifier can exceed roughly 70% accuracy on this feature set, and that constraint should be reported alongside every metric. This is a ten-line analysis and it would reframe the whole project.

Third, replace \`mode\` with a proper voting rule. \`sklearn.ensemble.VotingClassifier\` with \`voting="soft"\` uses predicted probabilities and handles disagreement deterministically; \`voting="hard"\` at least raises on ties rather than silently picking the first label. The current \`mode([...])\` construction is not a legitimate ensemble.

Fourth, feature work. Ten binary symptoms over 41 classes is the real bottleneck. Options worth exploring: symptom severity as ordinal rather than binary, patient demographics if available (age and sex are strong priors for many conditions), and symptom co-occurrence features ("fever AND rash") to help the model exploit structure that individual binary features hide.

Finally, fix the misleading labels. The "GaussianNB accuracy: 68.98%" line in the Random Forest cell needs to be corrected before this notebook is shared anywhere; as written, it misrepresents which model produced which result.`,
    },
  ],
}