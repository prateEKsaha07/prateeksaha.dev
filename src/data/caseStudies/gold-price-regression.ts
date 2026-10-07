import type { CaseStudy } from './index'

export const goldPriceRegression: CaseStudy = {
  slug: 'gold-price-regression',
  title: 'Gold Price Prediction — Feature Importance Decomposition',
  tag: 'Regression · Time Series',
  desc: 'A Random Forest and XGBoost regressor predict daily GLD prices from four correlated market instruments and three lagged gold prices. Headline result: R² 0.915 with $1.11 MAE on a chronological 80/20 split. Decomposition tells a different story: 94% of the model\u2019s importance is a single lag feature. Remove the lags and the same model collapses to R² \u22120.371 \u2014 worse than predicting the mean.',
  tech: ['Python', 'scikit-learn', 'XGBoost', 'pandas', 'seaborn', 'Matplotlib'],
  accent: '#E4B363',
  num: '05',
  stats: [
    { label: 'Rows (clean)', val: '2,287' },
    { label: 'Features', val: '9' },
    { label: 'RF R² (with lags)', val: '0.9154' },
    { label: 'RF R² (no lags)', val: '\u22120.3710' },
  ],
  live: null,
  github: null, // TODO: paste repo URL
  notebook: null,
  thumbnail: null,
  date: '2026',
  metadata: {
    dataset: 'gold_price_data.csv',
    source: 'https://www.kaggle.com/datasets/altruistdelhite04/gold-price-data', // TODO: confirm
    rows: '2,290 raw \u00b7 2,287 after lag dropna',
    features: 'SPX, USO, SLV, EUR/USD, Month, Year, GLD_lag_1, GLD_lag_2, GLD_lag_3',
    target: 'GLD (gold ETF daily close, USD)',
    missing: 'None in raw data; 3 rows dropped at the head due to lag construction',
  },
  sections: [
    {
      id: 'problem',
      title: 'Problem framing',
      content: `Predict the daily price of GLD, the SPDR Gold Shares ETF, from four correlated market instruments (S&P 500, oil, silver, EUR/USD) plus three lagged gold prices and two calendar features. The dataset spans January 2008 through mid-2017 — about 2,290 trading days — covering the 2008 financial crisis, the 2011 gold peak, and the subsequent multi-year drawdown.

The framing is deliberately multi-factor: four markets, two calendar signals, three lags. The implicit hypothesis is that gold is driven by macro conditions — inflation hedging, dollar strength, risk-off flows, industrial demand via silver and oil — and that a supervised model over these features should recover that structure. That hypothesis turns out to be almost entirely wrong, and the case study is about how the notebook's numbers reveal that.`,
    },
    {
      id: 'eda',
      title: 'Exploratory analysis',
      content: `The raw dataset has 2,290 rows and 6 columns: Date, SPX, GLD, USO, SLV, EUR/USD. Descriptive statistics show the expected regime spread — GLD ranges from $70 to $185, SPX from 676 to 2,873, USO from $8 to $117. Date was parsed and decomposed into Day, Month, and Year; Day was dropped before modeling. Three lag features (GLD_lag_1..3) were constructed via \`df["GLD"].shift(1..3)\`, introducing three NaNs at the head that were removed with dropna, leaving 2,287 rows.

A correlation heatmap over the five raw instruments tells the whole EDA story: GLD and SLV correlate at roughly 0.87 (silver and gold trade as a pair), GLD and EUR/USD at roughly 0.3 (dollar weakness lifts gold), and GLD versus SPX and USO is essentially zero. Oil and equity indices are not gold drivers on this timescale. The heatmap already foreshadows the feature-importance result that comes later.`,
      charts: [
        {
          src: '/lab/gold-price-regression/price-history.png',
          caption: 'Five instruments indexed to 100 at Jan 2008. GLD and SLV track closely; USO and SPX move independently.',
        },
        {
          src: '/lab/gold-price-regression/correlation-heatmap.png',
          caption: 'GLD\u2013SLV correlation is 0.87. GLD\u2013SPX and GLD\u2013USO are near zero.',
        },
      ],
    },
    {
      id: 'features',
      title: 'Feature engineering',
      content: `Two calendar features were extracted from Date (Month, Year) and three lag features were added from the target column itself. The lag construction is standard practice for one-step-ahead time-series forecasting — it gives the model access to recent history without any train/test leakage as long as the split respects chronological order, which this notebook does.

That said, the lags are constructed from the target column, not from an exogenous signal. This is worth flagging explicitly because it changes what the model is: GLD_lag_1 is not a feature in the usual sense — it's the previous value of the thing being predicted. A model whose R² is dominated by lag features is a strong autocorrelation estimator, not a market model. The feature-importance section below quantifies exactly how true this is.`,
      charts: [
        {
          src: '/lab/gold-price-regression/feature-importance.png',
          caption: 'GLD_lag_1 alone accounts for 94.4% of the Random Forest\u2019s importance. The three lag features together account for 97.5%.',
        },
      ],
    },
    {
      id: 'modeling',
      title: 'Modeling',
      content: `Two models were trained on a chronological 80/20 split (1,829 train / 458 test), no shuffling. This is the correct approach for time-series and is what the notebook uses — though the surrounding code suggests it may have been chosen by accident rather than by design, since a commented-out \`train_test_split\` with random shuffling sits directly above it.

**Random Forest** (default hyperparameters, \`random_state=42\`): R² 0.9154, MAE $1.11, RMSE $1.41.

**XGBoost** (tuned: \`n_estimators=700, learning_rate=0.02, max_depth=10, subsample=0.9, colsample_bytree=0.9\`): R² 0.8456, MAE $1.55, RMSE $1.90.

Both models beat the naive baseline of "predict yesterday's value" — a naive persistence predictor would give an MAE around $0.80–$1.00 on this timescale, so both models are in the right neighborhood, though neither clearly beats naive. The training also produced a baseline worth keeping in mind for the next section: a Random Forest trained on the same split with the three lag features removed. That model is reported separately.`,
      table: {
        headers: ['Model', 'R\u00b2', 'MAE (USD)', 'RMSE (USD)'],
        rows: [
          ['Random Forest (with lags)', '0.9154', '1.1111', '1.4081'],
          ['XGBoost (with lags)', '0.8456', '1.5526', '1.9018'],
          ['Random Forest (no lags)', '\u22120.3710', '4.9969', '\u2014'],
        ],
        note: 'The no-lag row is the result the case study is about: removing three lag features from the same model, same split, same random state, collapses R\u00b2 from 0.9154 to \u22120.3710. A negative R\u00b2 means the model is worse than predicting the training mean.',
      },
    },
    {
      id: 'evaluation',
      title: 'Evaluation',
      content: `The headline number is R² 0.9154 — a Random Forest explaining 91.5% of the variance in daily gold prices with an average error of about $1.11 on a $70\u2013$185 instrument. That is, on its face, a strong result.

Decompose it and the picture changes.

**Feature importance.** The Random Forest assigns 94.42% of its importance to a single feature: GLD_lag_1, yesterday's gold price. GLD_lag_2 and GLD_lag_3 contribute 2.50% and 0.56% respectively. Together the three lag features account for 97.48% of the model. The remaining 2.52% is almost entirely silver (SLV, 2.39%), with SPX, USO, EUR/USD, and Month each contributing less than half a percent, and Year contributing exactly zero.

**Ablation.** Remove the three lag features and retrain the same Random Forest on the same split with the same random state. R² drops from 0.9154 to \u22120.3710. MAE rises from $1.11 to $5.00. A negative R² is not a weak model — it is a model worse than the trivial baseline of predicting the training mean. The market features are not merely unhelpful; in aggregate, they are actively misleading the model out of sample.

**What the model actually is.** A one-step-ahead autocorrelation estimator. Gold's daily autocorrelation is ~0.99 at lag 1. Any model given GLD_lag_1 will recover most of the variance in GLD_t for the trivial reason that gold tomorrow looks almost exactly like gold today. The R² 0.92 is real arithmetic — it is not overfitting, and the chronological split is honest — but it does not support any claim that the model understands gold's drivers. It supports the claim that gold is autocorrelated. That is a much weaker statement.

**Why the no-lag R² is negative rather than merely low.** The four market instruments plus Month plus Year, given to a Random Forest without any strong anchor, produce a model that overfits noise in the training set. Silver is a real signal, but it is noisy; SPX, USO, EUR/USD, and Month are weak predictors on this timescale; Year is a numeric feature that invites regime memorization and, based on the zero importance it receives, is not even doing that. The collective result is a model that predicts worse than the mean on held-out data.`,
      charts: [
        {
          src: '/lab/gold-price-regression/rf-actual-vs-predicted.png',
          caption: 'Random Forest predictions against actual GLD on the held-out test set. The model tracks the price level closely \u2014 because it is anchored to yesterday\u2019s value.',
        },
        {
          src: '/lab/gold-price-regression/predicted-vs-actual-scatter.png',
          caption: 'Predicted versus actual for Random Forest (left) and XGBoost (right). Both hug the y=x line; RF is visibly tighter.',
        },
        {
          src: '/lab/gold-price-regression/rf-residuals.png',
          caption: 'Random Forest residuals over time. No systematic drift, but variance clusters around high-volatility periods \u2014 exactly where a lag-based predictor is least reliable.',
        },
        {
          src: '/lab/gold-price-regression/model-comparison.png',
          caption: 'R\u00b2, MAE, and RMSE side by side. The no-lag bar is negative \u2014 the model is worse than the mean.',
        },
      ],
    },
    {
      id: 'insights',
      title: 'Key takeaways',
      content: `Three things this project actually taught, in order of how much they generalize:

**1. R² on a time series is often autocorrelation in disguise.** Any liquid instrument has near-unity lag-1 autocorrelation. If your feature set includes a lag of the target, your R² is measuring that autocorrelation, not your features' explanatory power. The ablation test — retrain without the lags — takes five minutes and tells you which world you're in.

**2. Feature importance is the missing half of the story.** "R² 0.92" and "94% of the importance is one lag feature" are both true descriptions of the same model, and the second one is what a reader actually needs. The Random Forest was not lying; the summary statistic was incomplete.

**3. A negative R² is not a bug — it's a signal.** When removing features makes a model *worse than the mean*, those features weren't just weak — they were actively harmful without the anchor. This is the kind of thing that gets missed when nobody bothers to run the ablation, because the ablation itself looks like a strange thing to do when the headline number is already good.`,
      charts: [
        {
          src: '/lab/gold-price-regression/returns-distribution.png',
          caption: 'Daily GLD return distribution. Fat tails relative to a normal, standard for a liquid commodity ETF.',
        },
        {
          src: '/lab/gold-price-regression/rolling-volatility.png',
          caption: '30-day rolling volatility. Two visible spikes: the 2008 crisis and the 2011\u201313 gold drawdown.',
        },
      ],
    },
    {
      id: 'next',
      title: "What I'd do next",
      content: `**→ Benchmark against naive persistence.** The right baseline for any autocorrelated time series is "predict t-1 for t." If the Random Forest does not beat that at MAE or RMSE, then the model is not doing anything useful, and the R² is coincidental. This is a one-line comparison and it should be the first thing anyone does with a series like this.

**→ Drop the lag features and rebuild from exogenous signals only.** Retrain without GLD_lag_1..3 and see what R² you get — we already know it's \u22120.371 with the current feature set. The interesting follow-up is: is there *any* feature set of exogenous signals that predicts daily gold? The market-microstructure literature suggests the answer is "not on this timescale, not with these features" — daily gold is largely a random walk. Proving that cleanly, rather than accidentally proving it with a broken model, would be worth doing.

**→ Test the XGBoost MAE properly.** The notebook's reported MAE for XGBoost was copied from the Random Forest predictions — the print statement referenced the wrong variable. The correct value is $1.55 per the re-run. This is the kind of bug that silently inflates the perceived quality of a secondary model and is worth flagging explicitly.

**→ Shift to returns, not levels.** Predicting next-day gold *return* (not price) removes the autocorrelation that dominates the level series and forces the model to find real signal, if any exists. This is standard practice in quantitative finance and would be the natural next version of the project.

**→ Consider a proper walk-forward validation.** A single 80/20 chronological split is a start but not a full evaluation. Expanding-window or rolling-window cross-validation would give a distribution of out-of-sample R² rather than a single number, and would show whether the model's performance is stable across market regimes or specific to the test period.`,
    },
  ],
}