import type { CaseStudy } from './index'

export const sentinelV8: CaseStudy = {
  slug: 'sentinel-v8',
  title: 'SENTINEL.v8 — Vehicle Detection',
  tag: 'Computer Vision · Object Detection',
  desc: 'YOLOv8 vehicle-detection system trained on a custom Indian traffic dataset combining IDD subsets with locally captured Bhilai footage. Three training phases across an expanding dataset, from ~500 to 1,100+ images. Final model: precision 0.81, mAP@50 0.63. Deployed with a Streamlit inference UI.',
  tech: ['Python', 'YOLOv8', 'PyTorch', 'OpenCV', 'Streamlit'],
  accent: '#FF6B35',
  num: '02',
  stats: [
    { label: 'Precision', val: '0.81' },
    { label: 'mAP@50', val: '0.63' },
  ],
  live: null,
  github: 'https://github.com/prateEKsaha07/Sentinel.v8',
  notebook: null,
  thumbnail: null,
  date: '2026',
  metadata: {
    dataset: 'Indian Driving Dataset (IDD) + custom Bhilai footage',
    source: 'https://idd.insaan.iiit.ac.in/',
    rows: '1,100+ images',
    features: '3 classes (car, bike, truck)',
    target: 'Bounding boxes + class labels',
    missing: 'Manual filtering applied — original XML had missing and inconsistent pairs',
  },
  sections: [
    {
      id: 'problem',
      title: 'Problem framing',
      content: `Vehicle detection on Indian roads is harder than on most benchmark datasets. Traffic is denser, occlusion is common, camera angles vary widely, and the mix of vehicle types is different from Western datasets. Most pretrained models do well on COCO-style imagery and poorly on Indian footage.

SENTINEL.v8 is a **YOLOv8-based vehicle detection system** built to work on this domain. The task is straightforward — detect cars, bikes, and trucks in traffic scenes, with bounding boxes and class labels — but the setup was built end-to-end: dataset preparation, annotation conversion, training, evaluation, and a Streamlit inference UI.

The goal was to demonstrate a complete object-detection workflow from raw data to working demo, while operating under real constraints: **CPU-only training** (no GPU), limited data volume, and noisy source annotations.`,
    },
    {
      id: 'eda',
      title: 'Dataset',
      content: `The dataset combines two sources. **Selected subsets of the Indian Driving Dataset (IDD)** — specifically the \`frontFar\`, \`rearNear\`, \`sideLeft\`, and \`sideRight\` camera angles — provide urban traffic scenes from Bangalore. **Custom footage captured in Bhilai** adds variation in road conditions, lighting, and perspective.

The original IDD annotations were in **Pascal VOC XML format**, not YOLO. And they came with two problems: missing image files for some annotations, and inconsistent labels. Before any training, the data needed:

1. XML → YOLO label conversion via a custom script
2. Filtering to only valid image-label pairs
3. Class mapping — the original dataset had many categories; only three were kept
4. Image-label synchronization to ensure directory consistency

The class decision was deliberate. Original annotations included riders, pedestrians, and other categories, which have inconsistent labeling and would confuse the model on a small dataset. **Three classes only: car, bike (mapped from motorcycle), truck.** This is a scope reduction, not a limitation — it lets the model focus on the classes that matter for the detection task.

The final cleaned dataset is roughly **1,100+ images** with corresponding YOLO labels. Quality over quantity — every pair is verified to exist and match.`,
      charts: [
        {
          src: '/src/assets/lab/sentinel-v8/01-labels-distribution.jpg',
          caption: 'Dataset overview. Label distribution shows clear class imbalance — cars dominate the corpus, bikes are moderate, trucks are sparse. This imbalance is the primary driver of the model\'s per-class performance gap.',
        },
      ],
    },
    {
      id: 'features',
      title: 'Data pipeline',
      content: `The pipeline from raw dataset to trainable data has four stages, each a small script.

**Stage 1 — XML to YOLO conversion.** A custom Python script using \`xml.etree.ElementTree\` reads each Pascal VOC XML file, extracts the bounding boxes and class labels, applies the class mapping (motorcycle → bike, other categories dropped), and writes a YOLO-format \`.txt\` file alongside each image. YOLO format is normalized center-x, center-y, width, height — one line per object.

**Stage 2 — Folder-wise processing.** The IDD dataset is organized by camera angle (\`frontFar\`, \`rearNear\`, etc.). Rather than merging everything and losing track of provenance, each folder was processed independently and then combined. This preserved the ability to audit which angles contributed how many samples.

**Stage 3 — Image-label synchronization.** A second script (\`sync.py\`) verifies that every image has a corresponding label file and vice versa, and copies valid pairs into the final \`dataset/images/\` and \`dataset/labels/\` folders. Orphaned files on either side were dropped.

**Stage 4 — Dataset configuration.** A \`dataset.yaml\` file configures the YOLOv8 data loader with paths, class names, and split ratios. This is the file passed to the training command.

\`\`\`yaml
path: ./dataset
train: images/train
val: images/val

names:
  0: car
  1: bike
  2: truck
\`\`\`

No feature engineering in the classical sense — for object detection, the equivalent is the annotation quality and class mapping decision, both of which were handled in Stage 1.`,
    },
    {
      id: 'modeling',
      title: 'Modeling',
      content: `The model is **YOLOv8 nano** — the smallest variant in the YOLOv8 family. This was a hardware decision, not a performance one. Training on a CPU (AMD Ryzen 5 5600G, no discrete GPU) required a model small enough to complete multiple epochs in reasonable time.

**Training configuration:**

- **Model:** YOLOv8n (nano variant)
- **Initialization:** Pretrained COCO weights — fine-tuned on the custom dataset, not trained from scratch
- **Epochs:** 30 (final run)
- **Image size:** 512×512
- **Device:** CPU
- **Batch size:** Adjusted to fit available memory

Using pretrained weights was the key efficiency decision. Training from scratch would have required far more data and compute than available; fine-tuning from COCO checkpoints let the model leverage general object-detection features and converge on the traffic domain in 30 epochs.

**Training progression.** The model was trained three separate times as the dataset grew, each run starting from the previous best checkpoint:

| Phase | Dataset size | Epochs | Precision | Recall | mAP@50 | mAP@50-95 |
|---|---|---|---|---|---|---|
| Initial | ~500 | 10 | 0.64 | 0.38 | 0.399 | 0.285 |
| Second | ~900 | 25 | 0.78 | 0.60 | 0.669 | 0.285 |
| Final | ~1,100+ | 30 | 0.81 | 0.56 | 0.63 | 0.47 |

The final model has **slightly lower mAP@50** than the second phase (0.63 vs 0.669), but **notably better mAP@50-95** (0.47 vs 0.285) and **better precision** (0.81 vs 0.78). This is a real and interesting result — the trade-off between tighter bounding boxes and slightly more conservative detection is visible in the metrics.

The image size was also reduced from YOLOv8's default 640 to 512 for the final phase, which sped up training at the cost of some small-object detection ability. That's part of why recall dropped slightly.`,
      charts: [
        {
          src: '/src/assets/lab/sentinel-v8/02-training-results.png',
          caption: 'Training curves across 30 epochs. Loss components (box, class, DFL) decrease steadily; mAP@50 and mAP@50-95 both trend upward. The curves suggest training had not fully saturated — more epochs or more data would likely yield further gains.',
        },
      ],
    },
    {
      id: 'evaluation',
      title: 'Evaluation',
      content: `The model performs **well on cars, moderately on bikes, and poorly on trucks**. This ordering tracks directly with class frequency in the training data.

\`\`\`
car    ── dominant class, strong detections, high confidence
bike   ── moderate, breaks down in crowded scenes with overlapping riders
truck  ── weakest, fails on distant or partially occluded objects
\`\`\`

**Where the model fails:**

- **Crowded bike scenes.** Multiple bikes with riders in close proximity cause overlapping bounding boxes and misclassifications. The model often detects two bikes as one or misses one entirely.
- **Small or distant trucks.** When a truck occupies a small portion of the frame, the model frequently misses it or classifies it as a car.
- **Rear and side views.** Performance is noticeably weaker on \`rearNear\` and \`sideLeft\`/\`sideRight\` angles compared to \`frontFar\`. Front-facing scenes have the most training samples and the most consistent annotation quality.
- **Static structures misclassified.** Occasional false positives where large background elements (buildings, signage) get classified as trucks.

**The class imbalance problem.** The confusion matrix shows the pattern clearly — most misclassifications involve truck being confused for car, or bikes being missed entirely. This is a data problem, not a model architecture problem. The nano variant is capable enough for the task; what's missing is more truck examples and cleaner bike annotations.

**Note on mAP@50-95.** This metric is stricter than mAP@50 — it averages across IoU thresholds from 0.50 to 0.95 in steps of 0.05. A value of 0.47 means the model's bounding boxes are reasonably tight but not precise. For a detection demo, this is acceptable; for a downstream system that needs pixel-accurate boxes, it would need improvement.`,
      charts: [
        {
          src: '/src/assets/lab/sentinel-v8/03-confusion-matrix.png',
          caption: 'Normalized confusion matrix. The dominant diagonal is car → car, which reflects class imbalance rather than model strength. The truck column shows the biggest misclassification rate — most often confused with car or background.',
        },
        {
          src: '/src/assets/lab/sentinel-v8/04-validation-predictions.jpg',
          caption: 'Predictions on validation images. Bounding boxes are tight on cars, looser on bikes in crowded scenes, and often missing entirely on distant trucks. This is the honest view of the model — good on the dominant class, weak on the minority classes.',
        },
      ],
    },
    {
      id: 'deployment',
      title: 'Deployment',
      content: `The trained model runs behind a **Streamlit interface** for image and video inference.

**Inference flow:**

1. User uploads an image or video through the Streamlit UI
2. File is saved to a local \`input/\` directory
3. YOLOv8 loads \`best.pt\` and runs inference on the uploaded file
4. Annotated output (bounding boxes + class labels + confidence scores) is saved to \`runs/detect/\`
5. Result is displayed in the Streamlit UI with the option to view the saved output

The Streamlit app supports both image and video input. For video, frames are processed individually and reassembled into an annotated video output. On CPU, short video clips (a few seconds) run in reasonable time; longer clips are impractical without GPU acceleration.

**What the demo does well.** It's a complete, working end-to-end inference demo — the kind of thing that lets someone upload a photo and see the model's output in a few seconds. That's the strongest argument for the model's value.

**What it doesn't do yet.** No webcam streaming, no real-time detection on live video, no deployment beyond local. The README lists webcam support, cloud deployment, and GPU optimization as future work.`,
    },
    {
      id: 'next',
      title: "What I'd do next",
      content: `Three concrete improvements, in priority order:

**→ Fix class balance before touching the model.** Trucks are the bottleneck. Adding 300–500 truck examples — especially distant and partially occluded trucks — would do more for overall mAP than any model change. The current truck detection failures are a data problem, and no architecture change fixes that.

**→ Clean the bike annotations.** Crowded bike scenes have the highest misclassification rate. Manual review of a few hundred bike-heavy images would clarify whether the issue is overlapping boxes, missing labels, or inconsistent category boundaries. This is annotation work, not engineering work, and it's the highest-leverage fix.

**→ Move training to GPU.** All training was done on CPU. Moving to even a modest GPU (Colab, Kaggle, or a cloud GPU instance) would allow training a larger YOLOv8 variant (small or medium instead of nano) at the default 640px image size. That combination — bigger model, higher resolution — would likely push mAP@50 into the 0.70s on the same dataset without any data changes.

Beyond those three, the natural extensions are webcam-based real-time detection, cloud deployment for the Streamlit app, and integration with a downstream system (traffic monitoring, analytics, or a mobility app). None of those are worth building until the class imbalance is addressed.`,
    },
  ],
}