import type { CaseStudy } from './index'

export const customerSegmentation: CaseStudy = {
  slug: 'customer-segmentation',
  title: 'Customer Segmentation — KMeans on Marketing Data',
  tag: 'Clustering · Marketing',
  desc: 'KMeans segmentation over a 2,216-row marketing dataset with 28 features covering income, purchase history, household structure, and campaign response. The original notebook reported five segments, but a scaler bug meant the model was clustering on unscaled data — and because Income ranged from $1,730 to $666,666 while campaign flags were 0/1, KMeans collapsed onto a 5-way income binning. This case study compares the original pipeline against a corrected one.',
  tech: ['Python', 'scikit-learn', 'pandas', 'seaborn', 'Matplotlib', 't-SNE'],
  accent: '#7C6AE8',
  num: '06',
  stats: [
    { label: 'Rows (clean)', val: '2,216' },
    { label: 'Features (fixed)', val: '37' },
    { label: 'Segments', val: '5' },
    { label: 'Original cluster sizes', val: '677 / 406 / 1 / 672 / 460' },
  ],
  live: null,
  github: null, // TODO: repo URL
  notebook: null,
  thumbnail: null,
  date: '2026',
  metadata: {
    dataset: 'Marketing campaign dataset (new.csv)',
    source: 'https://www.kaggle.com/datasets/rodsaldanha/arketing-campaign', // TODO: confirm
    rows: '2,240 raw \u00b7 2,216 after dropna',
    features: '28 columns original \u00b7 37 after one-hot encoding (Education, Marital_Status expanded)',
    target: 'None \u2014 unsupervised segmentation',
    missing: '24 Income values dropped via dropna; Z_CostContact and Z_Revenue dropped as constants',
  },
  sections: [
    {
      id: 'problem',
      title: 'Problem framing',
      content: `Segment a set of 2,216 customers into behavioural groups that a marketing team could target differently. The dataset mixes household demographics (income, education, marital status, kid/teen counts), purchase history across six product categories (wines, fruits, meat, fish, sweets, gold), channel usage (web, catalog, store), and campaign response flags. The implicit question is: are there distinct purchasing personalities in here, or is it one continuous population with no natural breakpoints?

That distinction matters because the downstream action is different. If clusters are real and well-separated, they justify differentiated campaign design. If they're a smooth gradient that KMeans sliced into five arbitrary bands, the right answer is probably regression on income or propensity, not segmentation.

The original notebook ran KMeans with k=5 and produced a segmentation. It also contains two bugs that made the first result misleading \u2014 both of which are visible in the code and neither of which affect the final conclusion in the way one might expect. That gap between what the pipeline intended and what it actually computed is the subject of this case study.`,
    },
    {
      id: 'eda',
      title: 'Exploratory analysis',
      content: `The raw file has 2,240 rows and 29 columns. Twenty-four rows have a missing \`Income\` value; the notebook drops them rather than imputing, leaving 2,216 rows. Two columns, \`Z_CostContact\` (constant 3) and \`Z_Revenue\` (constant 11), are dropped along with the \`Dt_Customer\` timestamp after it is decomposed into Day / Month / Year.

The categorical columns are \`Education\` (5 levels: Basic, 2n Cycle, Graduation, Master, PhD) and \`Marital_Status\` (8 levels, including the near-empty \`Absurd\` and \`YOLO\` categories). Distributions are dominated by \`Graduation\` (roughly half of all customers) and \`Married\` (roughly 40%). Both categoricals carry genuine signal \u2014 education correlates with income, marital status correlates with household size \u2014 but neither has a natural integer ordering that would justify replacing the label with a scalar.

The correlation heatmap on the numeric features reveals the expected cluster of \`MntWines\`, \`MntMeatProducts\`, and \`MntGoldProds\` correlating with each other (all high-spend categories), and \`NumWebPurchases\` correlating with \`NumCatalogPurchases\` (multi-channel shoppers). \`Income\` correlates with every \`Mnt*\` column at roughly 0.5\u20130.7, which is the throughline that ends up dominating the original clustering.`,
      charts: [
        {
          src: '/lab/customer-segmentation/categorical-distributions.png',
          caption: 'Education and Marital Status distributions. Graduation and Married dominate both, but no category is absent.',
        },
        {
          src: '/lab/customer-segmentation/correlation-heatmap-full.png',
          caption: 'Full numeric correlation matrix. Income anchors the Mnt* block; purchase channels form their own correlated cluster.',
        },
      ],
    },
    {
      id: 'features',
      title: 'Feature engineering',
      content: `The notebook performs three transformations before clustering:

**Date decomposition.** \`Dt_Customer\` was split on dashes into Day / Month / Year, giving three numeric columns. Whether customer tenure should be a single "days since signup" value rather than three decomposed calendar fields is debatable \u2014 Day and Month are cyclic, Year is not, and KMeans on cyclic features is meaningless. But since the notebook drops \`Dt_Customer\` itself and keeps the three fragments, the net effect is that customer tenure enters the model as a mostly noise contribution.

**Label encoding.** \`Education\` and \`Marital_Status\` were passed through \`sklearn.preprocessing.LabelEncoder\`. This assigns arbitrary integer codes: for \`Marital_Status\`, values like \`Absurd\` and \`YOLO\` receive the same numeric treatment as \`Married\` and \`Single\`, imposing a distance in feature space that has no real-world meaning. For \`Education\` the ordering happens to be roughly ordinal (Basic < 2n Cycle < Graduation < Master < PhD), so label encoding is defensible there \u2014 but only by accident. The correct transformation for nominal categories is one-hot encoding.

**Scaling \u2014 computed but discarded.** The notebook runs \`StandardScaler().fit_transform(df)\`, prints the first rows of the result, and then never uses the scaled array again. Both the KMeans fit and the t-SNE embedding are computed on \`df\` itself, which is unscaled. This is the single most consequential mistake in the pipeline: with \`Income\` ranging up to 666,666 and binary columns ranging from 0 to 1, KMeans' Euclidean distance is effectively measuring income difference and ignoring everything else.

The corrected pipeline in this case study one-hot encodes \`Education\` and \`Marital_Status\` (producing 37 features total), then applies \`StandardScaler\` and actually uses the scaled matrix for KMeans and t-SNE.`,
    },
    {
      id: 'modeling',
      title: 'Modeling',
      content: `Two KMeans pipelines were run: the original as-shipped (unscaled data, label-encoded categoricals, k=5) and a corrected version (scaled data, one-hot encoded categoricals, k=5). Both use \`init='k-means++'\`, \`max_iter=500\`, \`random_state=22\`, and \`n_init=10\`.

**Cluster sizes reveal the failure mode immediately.**

The original pipeline produces cluster sizes \`[677, 406, 1, 672, 460]\`. The single-member cluster is a customer with an income of $666,666 \u2014 the outlier dominates Euclidean distance so completely that KMeans carves out a singleton for it and splits the remaining customers into four groups that are, in effect, income bands. The income means per original cluster confirm this: $23K, $42K, $63K, $83K, and $667K. That is a monotonic sequence, which is what you would see if you had simply ranked customers by income and binned them into five buckets. The six \`Mnt*\` columns, the channel features, the campaign flags, and the household structure are all invisible to the model.

The fixed pipeline produces cluster sizes \`[541, 975, 196, 474, 30]\`. Income means per fixed cluster are $34K, $56K, $71K, $84K, and $71K \u2014 still income-influenced, but no longer a monotonic sequence, and the cluster boundaries are now shaped by purchase history and household structure as well. The largest fixed cluster contains 975 customers, which is large enough to suggest the fixed model is still finding one dominant "average customer" group; the 30-member cluster is small and probably reflects a distinct high-spend profile.

**The elbow curve has no sharp knee.** Inertia drops from 82,000 at k=1 to 62,000 at k=5 to 42,000 at k=20. The largest single-step drop is k=1\u2192k=2 (11,400), then it flattens into a smooth curve with no clear breakpoint. If the elbow criterion were applied strictly, k=2 would be the answer, not k=5. The notebook's choice of k=5 was defensible on business grounds (five segments is a manageable number for a marketing team) but was not supported by the inertia curve. That is a real limitation of elbow-based cluster selection on datasets without strong cluster structure \u2014 it will happily return whatever you ask for.`,
      table: {
        headers: ['Pipeline', 'Cluster sizes', 'Income means ($K)', 'Notes'],
        rows: [
          ['Original (unscaled, label-encoded)', '677 / 406 / 1 / 672 / 460', '23 / 42 / 63 / 83 / 667', 'Cluster 2 is a singleton containing the $666,666 outlier; income sequence is monotonic'],
          ['Fixed (scaled, one-hot)', '541 / 975 / 196 / 474 / 30', '34 / 56 / 71 / 84 / 71', 'Non-monotonic; smaller clusters defined by interaction of income with purchase features'],
        ],
        note: 'The original pipeline reports segments that are effectively income quantiles. The fixed pipeline produces a segmentation where purchase behaviour and household structure shape the boundaries alongside income.',
      },
    },
    {
      id: 'evaluation',
      title: 'Evaluation',
      content: `Neither pipeline reports a quantitative clustering metric \u2014 no silhouette score, no Calinski-Harabasz, no Davies-Bouldin. This is a real gap. Without an internal validity metric, there is no objective way to say whether the fixed segmentation is *better* than the original, only that it is *different*. The cluster-size evidence makes a strong case that the original was degenerate (a singleton cluster is a near-certain sign of an unscaled outlier), but "not degenerate" and "useful" are not the same thing.

The t-SNE visualisations add another caveat. Running t-SNE on the original unscaled matrix produces a scatter that is dominated by the income axis \u2014 customers separate along a single long dimension, with the $666,666 outlier sitting far off in a corner. Running t-SNE on the fixed matrix produces a more distributed scatter, but no clearly separated blobs. The five KMeans clusters overlap substantially in t-SNE space, which is a strong indication that the underlying data does not contain five well-separated groups. KMeans has sliced a continuous distribution into five segments of roughly equal variance, which is what KMeans does regardless of whether real clusters exist.

There is also a subtle problem with t-SNE as validation here: t-SNE preserves local structure but distorts global distances, so the distance between clusters in the embedding is not directly interpretable. The right way to visualise cluster separation on this data would be PCA on the first two components, or UMAP. t-SNE is useful for sanity-checking that clusters are locally coherent but not for arguing that they are globally separated.

The honest conclusion is: the original pipeline's segmentation is measurably wrong (it fails to use 27 of 28 features), the fixed pipeline's segmentation is measurably better but still not supported by a cluster-structure test, and the dataset may not contain well-separated clusters at all.`,
      charts: [
        {
          src: '/lab/customer-segmentation/tsne-original.png',
          caption: 't-SNE on the original pipeline. The embedding is dominated by the income axis; the outlier sits far off to one side.',
        },
        {
          src: '/lab/customer-segmentation/tsne-fixed.png',
          caption: 't-SNE on the fixed pipeline. Clusters overlap substantially, suggesting no five well-separated groups in the data.',
        },
        {
          src: '/lab/customer-segmentation/cluster-size-comparison.png',
          caption: 'Cluster sizes side by side. The original pipeline produces a singleton cluster; the fixed pipeline produces a large dominant cluster instead.',
        },
        {
          src: '/lab/customer-segmentation/income-by-cluster.png',
          caption: 'Income distribution per cluster in the fixed pipeline. Still income-influenced, but no longer monotonic.',
        },
        {
          src: '/lab/customer-segmentation/elbow-curve.png',
          caption: 'Elbow curve on scaled features. No sharp knee; the largest drop is k=1\u2192k=2, not k=4\u2192k=5.',
        },
        {
          src: '/lab/customer-segmentation/cluster-profile-heatmap.png',
          caption: 'Mean z-scored feature values per cluster \u2014 which features actually define each segment.',
        },
      ],
    },
    {
      id: 'next',
      title: "What I'd do next",
      content: `**\u2192 Fix the scaler in the source notebook.** The most important item. The original notebook's reported segmentation is not a behavioural segmentation, and the code that was supposed to make it one is three lines above the fit call, computed and thrown away.

**\u2192 Replace LabelEncoder with one-hot encoding for Marital_Status.** Education is ordinal, so label encoding is defensible there, but Marital_Status is nominal and label encoding invents distances. Both should probably be one-hot encoded for consistency, and if Education's ordering is preserved, that should be an explicit design decision, not a default.

**\u2192 Report clustering validity metrics.** Silhouette score, Calinski-Harabasz index, and Davies-Bouldin index all computed at k=2..10 would give an objective comparison between k values. My expectation is that silhouette will peak at k=2 or k=3 and be low (below 0.2) at k=5, which would confirm that the dataset is a continuum, not five clusters.

**\u2192 Try GMM or HDBSCAN.** Gaussian Mixture Models allow soft cluster assignments and can be compared on BIC, which gives another angle on the optimal k. HDBSCAN does not require specifying k and will return fewer clusters if they are not well-separated \u2014 which is exactly the right failure mode for this data.

**\u2192 Consider whether segmentation is the right framing at all.** If the underlying structure is a continuum, a marketing team is better served by a propensity model (probability of responding to a campaign) and an expected-value calculation than by a five-way segmentation. That is a bigger pivot, but it may be the honest answer for this dataset.

**\u2192 PCA instead of t-SNE for visualisation.** t-SNE is excellent for showing local structure and terrible for arguing global separation. Replacing the t-SNE plots with PCA or UMAP would let the reader judge cluster separation more accurately.`,
    },
  ],
}