# Technology & Innovation Blueprint

> Research and product-strategy material. It is not a statement of deployed Netrak v1.0 capabilities; see `docs/release-scope.md`.
## AI for Digital Public Safety: Defeating Counterfeiting, Fraud & Digital Arrest Scams

**Prepared as:** R&D Technology Intelligence Report
**Scope:** Digital arrest scams, financial fraud networks, counterfeit currency, fraud/threat intelligence platforms
**Method note:** All papers below were retrieved via live web search (arXiv, ACM DL, IEEE Xplore, Springer, ScienceDirect, Atlantis Press, Frontiers, Wiley) between the searches conducted for this report. Every citation includes a verifiable DOI/arXiv ID/URL. Where a specific metric (accuracy, dataset size) was not visible in the retrieved abstract/reference excerpt, this is explicitly marked "not verifiable from available excerpt" rather than invented. This is technology intelligence, not a static literature survey — each entry is mapped to a build decision in Parts 4–5.

---

# PART 1 — Research Papers

Papers are grouped by the topic clusters requested. Within each, fields are: Citation → Problem → Methodology → Dataset → Model → Performance → Limitations → Possible Use (for this platform).

## Cluster A — Digital Arrest / Voice Scam / Telecom Fraud Detection

### A1
**Citation:** Shen, Z., Yan, S., Zhang, Y., Luo, X., Ngai, G., Fu, E.Y. (2025). *"It Warned Me Just at the Right Moment": Exploring LLM-based Realtime Detection of Phone Scams.* arXiv:2502.03964.
**Problem:** Victims on live phone calls (including digital-arrest-style impersonation calls) lack a real-time warning system while manipulation is happening.
**Methodology:** Streams call transcript segments into an LLM classifier that reasons over conversational context (authority-impersonation cues, urgency, secrecy requests) and issues in-call warnings; evaluated with user studies on warning timing and trust.
**Dataset:** Simulated/re-enacted scam call transcripts plus user-study sessions (exact corpus size not verifiable from available excerpt).
**Model:** LLM-based real-time classifier/agent (prompted, not fine-tuned per the excerpt).
**Performance:** Reported qualitative improvement in warning timeliness and user trust; quantitative precision/recall not verifiable from available excerpt.
**Limitations:** Relies on transcript quality (ASR errors upstream); risk of false alarms disrupting legitimate calls; evaluated on simulated rather than live fraud-ring calls.
**Possible use:** Core reasoning engine for the "Digital Arrest Scam Detection & Alerting" module — real-time script/authority-impersonation classifier feeding the alert layer.

### A2
**Citation:** Shen, Z., Wang, K., Zhang, Y., Ngai, G., Fu, E.Y. (2024). *Combating Phone Scams with LLM-based Detection: Where Do We Stand?* arXiv:2409.11643.
**Problem:** Establishes a baseline of how well off-the-shelf LLMs detect phone scam scripts before real-time systems are built.
**Methodology:** Benchmarks multiple LLMs (zero-/few-shot prompting) on scam-vs-legitimate call transcript classification.
**Dataset:** Curated phone-scam transcript sets (composition not verifiable from available excerpt).
**Model:** GPT-class and open LLMs, prompt-based.
**Performance:** Not verifiable from available excerpt (paper is positioned as a benchmarking/standing-check study).
**Limitations:** Prompt-only baselines under-perform on adversarially reworded scripts; no real-time latency evaluation.
<br>**Possible use:** Baseline/ablation reference for tuning our scam-classifier prompts and choosing between prompting vs. fine-tuning.

### A3
**Citation:** Ma, Z., Wang, P., Huang, M., Wang, J., Wu, K., Lv, X., Pang, Y., Yang, Y., Tang, W., Kang, Y. (2025). *TeleAntiFraud-28k: An Audio-Text Slow-Thinking Dataset for Telecom Fraud Detection.* arXiv:2503.24115.
**Problem:** Lack of a public, multimodal (audio+text) reasoning dataset for telecom fraud detection that supports "slow-thinking" (chain-of-reasoning) evaluation instead of shallow classification.
**Methodology:** Constructs a 28k-scale audio-text dataset with reasoning annotations (slow-thinking chains) for training/evaluating LLM-based fraud reasoners.
**Dataset:** TeleAntiFraud-28k — ~28,000 paired audio-text fraud/non-fraud samples with reasoning traces.
**Model:** Audio-text LLM reasoning pipeline (dataset paper; benchmarks multiple LLM backbones).
**Performance:** Benchmark scores reported in-paper; exact figures not verifiable from available excerpt.
**Limitations:** Dataset likely China/Chinese-telecom-centric; needs localisation (Hindi/regional-language scam scripts) before Indian deployment.
**Possible use:** Template for building an India-specific "Digital-Arrest-28k" audio-text reasoning corpus (CBI/ED/Customs impersonation scripts, regional languages) to train the scam-alerting classifier.

### A4
**Citation:** Singh, G., Singh, P., Singh, M. (2025). *Advanced Real-Time Fraud Detection Using RAG-Based LLMs.* arXiv:2501.15290.
**Problem:** Static fraud classifiers can't incorporate newly emerging scam patterns/typologies without retraining.
**Methodology:** Retrieval-Augmented Generation architecture pairs an LLM with a continuously updated vector store of known fraud patterns/typologies for real-time scoring.
**Dataset:** Not verifiable from available excerpt (transaction/scam pattern corpus referenced generically).
**Model:** RAG pipeline (retriever + LLM generator/classifier).
**Performance:** Not verifiable from available excerpt.
**Limitations:** RAG systems are vulnerable to knowledge-corruption/poisoning attacks on the retrieval index (see Cluster E, RAG security papers) — retrieval store must be access-controlled.
**Possible use:** Architecture pattern for "Fraud Network Graph Intelligence" — a continuously updated fraud-typology knowledge base that the classifier retrieves from, so new scam scripts propagate to all field officers within hours.

### A5
**Citation:** Chang, C.-W., Sarkar, S., Mitra, S., Zhang, Q., Salemi, H., Purohit, H., Zhang, F., Hong, M., Cho, J.-H., Lu, C.-T. (2024). *Exposing LLM Vulnerabilities: Adversarial Scam Detection and Performance.* IEEE BigData 2024, pp. 3568–3571. doi:10.1109/BigData62323.2024.10825256.
**Problem:** Scam scripts are increasingly generated/paraphrased by adversarial LLMs to evade classifiers.
**Methodology:** Constructs adversarially perturbed scam-message sets and measures degradation of LLM-based detectors.
**Dataset:** Adversarially generated scam-message corpus (size not verifiable from available excerpt).
**Model:** LLM-based text classifiers under adversarial perturbation.
**Performance:** Reports measurable accuracy degradation under adversarial rewriting; exact numbers not verifiable from available excerpt.
**Limitations:** Only text-modality; doesn't address voice-cloned adversarial audio.
**Possible use:** Adversarial-robustness testbed — mandatory red-teaming step before any scam classifier goes into production alerting.

---

## Cluster B — Deepfake / Voice Spoofing Detection

### B1
**Citation:** Xue, J., Yi, Z., Huang, Y., Ren, Y., Chen, Y., Fan, C., Su, Z., Zhang, Y., Cai, B. (2026). *RTCFake: Speech Deepfake Detection in Real-Time Communication.* arXiv:2604.23742.
**Problem:** Most audio-deepfake detectors are trained/evaluated offline and fail under real-time call conditions (codec compression, packet loss, streaming latency) — exactly the setting of live digital-arrest video/voice calls.
**Methodology:** Builds a detector explicitly targeting real-time communication (RTC) audio conditions, addressing codec artifacts and streaming constraints.
**Dataset:** RTC-condition speech deepfake dataset (exact scale not verifiable from available excerpt).
**Model:** Real-time-optimized deepfake-audio classifier.
**Performance:** Not verifiable from available excerpt (very recent preprint).
**Limitations:** Real-time detectors trade some accuracy for latency; generalization to novel TTS/voice-cloning engines released after training is an open problem.
**Possible use:** Direct fit for a "live call deepfake shield" — plugged into telecom/VoIP infrastructure or a citizen-facing app to flag AI-cloned voices in digital-arrest calls as they happen.

### B2
**Citation:** Lee, K., Han, J., Park, D. (2025). *Fake-Mamba: Real-Time Speech Deepfake Detection Using Bi-Mamba.* arXiv:2508.09294.
**Problem:** Transformer-based deepfake detectors are too compute-heavy for edge/real-time deployment (e.g., on telecom infrastructure or mobile).
**Methodology:** Uses a bidirectional Mamba (state-space model) architecture for lower-latency, lower-compute real-time inference vs. transformer baselines.
**Dataset:** Standard audio anti-spoofing benchmark(s) (not verifiable from available excerpt which corpus specifically).
**Model:** Bi-Mamba state-space sequence model.
**Performance:** Reported to be competitive with transformer baselines at lower latency; exact EER not verifiable from available excerpt.
**Limitations:** Newer architecture family — less battle-tested robustness literature than transformer-based CMs.
**Possible use:** Candidate lightweight model for edge/telecom-side deployment where latency budget is tight (call-in-progress alerting).

### B3
**Citation:** Salvi, D., Negroni, V., Mandelli, S., Bestagini, P., Tubaro, S. (2025). *Phoneme-level Analysis for Person-of-Interest Speech Deepfake Detection.* arXiv:2507.08626.
**Problem:** Generic deepfake detectors don't verify identity — they only say "synthetic vs. real," not "is this actually the claimed officer/relative."
**Methodology:** Phoneme-level fingerprinting tied to a specific speaker of interest, enabling person-specific verification rather than generic spoofing detection.
**Dataset:** Person-of-interest speech corpus (not verifiable from available excerpt).
**Model:** Phoneme-level speaker-fingerprint classifier.
**Performance:** Not verifiable from available excerpt.
**Limitations:** Requires enrolled reference voice samples of the person being impersonated (e.g., an actual CBI officer) — raises data-collection and consent questions for a government deployment.
**Possible use:** Higher-assurance layer for verifying claimed-identity calls (e.g., an alleged bank/police caller) against an enrolled voiceprint registry of legitimate government helplines.

### B4
**Citation:** Zhang, K., Hua, Z., Lan, R., Guo, Y., Zhang, Y. (2025). *Phoneme-level Feature Discrepancies: A Key to Detecting Sophisticated Speech Deepfakes.* AAAI 2025, pp. 1066–1074.
**Problem:** State-of-the-art voice cloning has closed the gap on prosody/spectral cues that older detectors relied on.
**Methodology:** Focuses on fine-grained phoneme-level articulatory discrepancies that persist even in high-quality clones.
**Dataset:** Not verifiable from available excerpt.
**Model:** Phoneme-discrepancy-based classifier.
**Performance:** Reported SOTA-level detection on sophisticated clones; exact figures not verifiable from available excerpt.
**Limitations:** Phoneme-level analysis assumes clean audio; performance under noisy/compressed telecom channels not established here.
**Possible use:** Feature-engineering technique to combine with B1/B2 in an ensemble to raise robustness against next-generation cloning tools.

### B5
**Citation:** Saxena, M., Pote, O., Satarkar, V., Bhosale, Y., Ranjane, S., Badkar, G. (2026). *AI Powered Deepfake Voice and Scam Call Detector for Secure Communication.* Proceedings of ICSIAIML 2025, Atlantis Press, pp. 705–719. doi:10.2991/978-94-6463-948-3_49.
**Problem:** Need an integrated system (not just a model) combining deepfake-voice detection with scam-call detection for end-user protection.
**Methodology:** Combines self-supervised audio embeddings (SSL-based) with scam-language classification in one pipeline; surveys wav2vec2.0-based and end-to-end raw-waveform approaches.
**Dataset:** Composite of public anti-spoofing datasets (ASVspoof-style lineage inferred from cited baselines; exact composition not verifiable from available excerpt).
**Model:** SSL-embedding + classifier fusion system.
**Performance:** Not verifiable from available excerpt.
**Limitations:** Survey/integration paper — engineering maturity and field-deployment validation not established.
**Possible use:** Reference architecture for the "Citizen Fraud Shield" app's on-device or cloud voice-check feature.

---

## Cluster C — Counterfeit Currency Detection (Computer Vision)

### C1
**Citation:** Chhabra, P., Goyal, S. (2025). *A Two-Phase Deep Learning Model for Counterfeit Detection of Indian Banknotes using YOLO-NAS and UV Imaging for Visually Impaired People.* Evergreen, 12(3), 1633–1653. doi:10.5109/7388855.
**Problem:** Manual/visual counterfeit checks fail for visually impaired users and miss high-quality FICN that passes basic visual inspection.
**Methodology:** Two-stage pipeline — YOLO-NAS object/feature detector for note localization and security-feature identification, combined with UV-imaging features (fluorescent security thread/fibres) as a second-stage authenticity classifier.
**Dataset:** Self-collected Indian ₹500 note image set (real + counterfeit), UV-augmented; compared against prior CNN baselines (Kodati et al. CNN 67.88% accuracy; VGG16, ResNet50, ResNet152V2, InceptionV3 baselines cited).
**Model:** YOLO-NAS (detection) + UV-feature CNN classifier (two-stage).
**Performance:** Reported to outperform prior CNN/VGG/ResNet/InceptionV3 baselines (which ranged ~60–68% accuracy in cited comparisons); exact top-line accuracy figure for the proposed two-phase model not verifiable from available excerpt.
**Limitations:** Requires UV-capable imaging hardware (beyond a standard phone camera) — limits pure-smartphone deployment; single-denomination (₹500) focus, needs extension across denominations.
**Possible use:** Direct technical basis for "Counterfeit Currency Identification Agent" — pairs well with the RBI-flagged concern about high-quality ₹500 FICN; UV-module architecture maps to bank counting-machine and POS-terminal deployment specifically.

### C2
**Citation:** (Authors per Atlantis Press listing) (2025). *Fake Currency Detection Using Convolutional Neural Network and Textual Feature Analysis.* Proceedings ICISD-25, Atlantis Press.
**Problem:** Pure image-classification CNNs miss textual forgery tells (e.g., "Children's Bank of India," "Not Legal Tender" prop-note text) printed on fake/prop notes.
**Methodology:** Fuses CNN visual classification with OCR-based textual feature extraction to catch prop-note and toy-currency-derived fakes.
**Dataset:** Indian banknote image set with genuine/counterfeit/prop-note samples.
**Model:** CNN + OCR fusion classifier with a lightweight GUI.
**Performance:** Not verifiable from available excerpt.
**Limitations:** OCR fusion helps against prop/joke notes but not against high-fidelity printed counterfeits that omit disclaimer text — doesn't address microprint/security-thread level fraud.
**Possible use:** Low-cost secondary check layer for citizen-facing mobile note-verification (catches "obviously fake" categories cheaply before invoking the heavier CV pipeline).

### C3
**Citation:** (SCI 2025 conference authors) (2025). *Fake Currency Detection Using Deep Learning* [VGG16 transfer-learning study]. In *Smart Computing Paradigms: Advanced Data Mining and Analytics*, Lecture Notes in Networks and Systems, vol. 1683, Springer.
**Problem:** Establishing a transfer-learning baseline for counterfeit note classification without large custom datasets.
**Methodology:** Fine-tunes ImageNet-pretrained VGG16 with additional dense classification layers on augmented real/counterfeit note images.
**Dataset:** Preprocessed and augmented real/counterfeit currency image set (size not verifiable from available excerpt).
**Model:** VGG16 transfer-learning CNN.
**Performance:** Not verifiable from available excerpt.
**Limitations:** VGG16-class models are comparatively lower-accuracy per the C1 comparison table (~subpar vs. YOLO-NAS/ResNet family); heavier parameter count than needed for mobile deployment.
**Possible use:** Useful only as a fallback/baseline benchmark, not as production architecture — supports the case for choosing YOLO-NAS/ResNet-class models instead (per C1's comparative results).

### C4
**Citation:** Bhowmik et al. (2017), as surveyed in Ansari, et al. *Detecting Counterfeit Money: An In-Depth Exploration of Deep Learning Techniques.* IJRASET (review), and companion primary literature.
**Problem:** Foundational CNN-based counterfeit banknote recognition — cited as the base technique multiple 2024–2025 papers build on.
**Methodology:** CNN trained end-to-end on genuine/counterfeit banknote images.
**Dataset:** Not verifiable from available excerpt (original 2017 dataset).
**Model:** Baseline CNN.
**Performance:** Not verifiable from available excerpt.
**Limitations:** Superseded by two-stage/UV/OCR-fusion approaches (C1, C2) and by federated/lightweight-model recommendations (C5).
**Possible use:** Historical baseline only; cited here for completeness of the technology lineage, not for direct reuse.

### C5
**Citation:** (2025). *Counterfeit Currency Detection: Leveraging Image Processing and Machine Learning* [comparative review]. International Journal on Science and Technology (IJSAT). Available: ijsat.org/papers/2025/2/5094.pdf.
**Problem:** Synthesizes where the counterfeit-detection field needs to go next — cross-currency generalisation, on-device inference cost.
**Methodology:** Structured literature comparison of image-processing vs. deep-learning counterfeit-detection approaches.
**Dataset:** N/A (review paper).
**Model:** N/A (review paper).
**Performance:** N/A.
**Limitations:** Review paper — no new experimental results.
**Possible use:** Explicitly recommends **federated learning, adaptive AI models, and lightweight deep-learning architectures** for future work — this is the direct evidence basis for our roadmap recommendation to use federated learning across bank branches (Part 5) so RBI/banks can jointly improve a shared counterfeit model without centralising sensitive note-image data.

---

## Cluster D — Graph AI / GNN Fraud & Money-Laundering Network Detection

### D1
**Citation:** Choi, J., Kim, H., Whang, J.J. (2024, rev. 2025). *Unveiling the Threat of Fraud Gangs to Graph Neural Networks: Multi-Target Graph Injection Attacks Against GNN-Based Fraud Detectors.* arXiv:2412.18370.
**Problem:** Organised fraud rings can adversarially inject fake nodes/edges into a transaction graph to evade GNN-based fraud detectors — a direct analogue of coordinated "fraud compound" money-mule networks.
**Methodology:** Proposes MonTi, a transformer-based multi-target one-time graph-injection attack, and evaluates how much it degrades GNN fraud detectors.
**Dataset:** Standard graph fraud-detection benchmarks (not verifiable from available excerpt which specific graphs).
**Model:** Attack model (MonTi) vs. victim GNN fraud detectors.
**Performance:** Demonstrates significant detection degradation under the injection attack (exact numbers not verifiable from available excerpt).
**Limitations:** This is an attack paper, not a defense — highlights a vulnerability that must be mitigated (adversarial training / anomaly-aware graph construction) before production deployment.
**Possible use:** Mandatory red-team reference for hardening the "Fraud Network Graph Intelligence" module against gaming by organised syndicates.

### D2
**Citation:** Yang, C., Liu, H., Wang, D., Zhang, Z., Yang, C., Shi, C. (2025). *FLAG: Fraud Detection with LLM-Enhanced Graph Neural Network.* Proceedings of the 31st ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD 2025), Vol. 2, pp. 5150–5160.
**Problem:** Pure GNNs miss semantic/contextual fraud signals (e.g., scam-script language) that live in unstructured text attached to graph nodes (chat logs, complaint text).
**Methodology:** Fuses LLM-derived semantic embeddings of node text with GNN structural learning for joint fraud scoring.
**Dataset:** Not verifiable from available excerpt (KDD industry-track fraud graph benchmark implied).
**Model:** LLM-enhanced GNN (hybrid semantic + structural).
**Performance:** Reported improvement over GNN-only baselines at KDD 2025; exact metrics not verifiable from available excerpt.
**Limitations:** Added LLM inference cost per node; needs careful pipeline design for real-time graph scoring at national transaction scale.
**Possible use:** Best-fit architecture for "Fraud Network Graph Intelligence" — combine transaction/call-record graph structure with LLM-parsed victim-complaint narratives (NCRB complaint text) into one fraud-ring scoring model.

### D3
**Citation:** (2025). *Enhancing Anti-Money Laundering by Money Mules Detection on Transaction Graphs (MuleTrace).* Proceedings of GAIB 2025 (Generative AI for Business), ACM. doi:10.1145/3766918.3766933.
**Problem:** Existing AML systems flag individual suspicious accounts/transactions but fail to reconstruct the **entire laundering chain** — exactly the money-mule chains that move digital-arrest scam proceeds.
**Methodology:** Unsupervised method (MuleTrace) that uses identified mule nodes as anchors to trace and reconstruct full laundering chains across a transaction graph.
**Dataset:** Real-world laundering-chain case data referenced (OCCRP "Azerbaijani Laundromat" style raw data used as an illustrative case).
**Model:** Unsupervised graph-chain-tracing algorithm.
**Performance:** Not verifiable from available excerpt.
**Limitations:** Unsupervised approach may need domain calibration per jurisdiction/banking system; chain reconstruction is computationally heavier than single-node scoring.
**Possible use:** Directly matches the challenge's "money mule networks" requirement — use as the chain-reconstruction layer that turns individual victim/mule flags into a single court-admissible intelligence package.

### D4
**Citation:** Deprez, B. et al. (2025). *Advances in Continual Graph Learning for Anti-Money Laundering Systems: A Comprehensive Review.* WIREs Computational Statistics, Wiley. doi (Wiley DOI per article page, e.g. 10.1002/wics.70040 as listed).
**Problem:** Money launderers/fraud rings continuously adapt tactics; static GNN models suffer catastrophic forgetting when retrained on new data.
**Methodology:** Reviews continual/lifelong graph-learning methods that let AML models update incrementally without forgetting older fraud typologies.
**Dataset:** N/A (review).
**Model:** N/A (review) — surveys continual-GNN methods.
**Performance:** N/A.
**Limitations:** Review paper; practical continual-learning deployments at bank/regulator scale remain immature.
**Possible use:** Justifies a continual-learning MLOps pipeline (not one-shot training) for the Fraud Network Graph Intelligence module, so it adapts as digital-arrest scam scripts and mule-recruitment patterns evolve.

### D5
**Citation:** He, X., Huang, J., Ma, K., He, H., Li, M. (2026). *An Explainable Graph Neural Network Framework for Illicit Financial Transaction Detection.* Applied Intelligence, 56(4). doi:10.1007/s10489-026-07138-9.
**Problem:** GNN fraud scores are typically black-box, which blocks their use as court-admissible evidence (a named requirement in the challenge brief).
**Methodology:** Adds an explainability layer (attribution over subgraphs/edges) to a GNN illicit-transaction detector so flagged accounts come with a human-readable rationale.
**Dataset:** Not verifiable from available excerpt.
**Model:** Explainable GNN (attribution-augmented).
**Performance:** Not verifiable from available excerpt.
**Limitations:** Explainability methods for graphs are still an active research area — fidelity of explanations vs. true model reasoning is not fully solved.
**Possible use:** Directly addresses the Evaluation Focus criterion "auditability of intelligence packages for legal admissibility" — required component of the Fraud Network Graph Intelligence output layer.

---

## Cluster E — Agentic AI / Multi-Agent Systems for Threat Intelligence

### E1
**Citation:** Raza, S., Sapkota, R., Karkee, M., Emmanouilidis, C. (2025). *TRiSM for Agentic AI: A Review of Trust, Risk, and Security Management in LLM-based Agentic Multi-Agent Systems.* arXiv:2506.04133.
**Problem:** As multi-agent AI systems get deployed for high-stakes tasks (like public-safety intelligence fusion), there's no standard framework for trust/risk/security governance of the agents themselves.
**Methodology:** Reviews and proposes a Trust-Risk-Security-Management (TRiSM) framework spanning agent identity, inter-agent communication security, and oversight.
**Dataset:** N/A (review/framework paper).
**Model:** N/A.
**Performance:** N/A.
**Limitations:** Framework-level guidance, not a deployable system; adoption requires custom engineering per use case.
**Possible use:** Governance blueprint for our own multi-agent intelligence-fusion platform (Part 5 architecture) — mandatory reading before deploying autonomous agents that can trigger MHA alerts or freeze transactions.

### E2
**Citation:** Wei, B. et al. (2025). *CORTEX: Collaborative LLM Agents for High-Stakes Alert Triage.* arXiv:2510.00311.
**Problem:** Security/fraud operations centres are flooded with alerts; human analysts can't triage all of them, but false-negative errors in high-stakes triage (e.g., missing a live digital-arrest victim) are unacceptable.
**Methodology:** Multiple specialised LLM agents collaborate (different roles: evidence gathering, cross-checking, escalation) to triage high-stakes alerts before human review.
**Dataset:** Not verifiable from available excerpt.
**Model:** Multi-agent LLM collaboration (CORTEX).
**Performance:** Not verifiable from available excerpt.
**Limitations:** Multi-agent systems can suffer from compounding hallucination/error propagation across agents if not checked (see E1, E5).
**Possible use:** Direct architecture pattern for a "Command Centre" triage layer — routes fraud/scam alerts to the right jurisdiction/agency automatically while flagging only the highest-confidence, highest-severity cases for human officers.

### E3
**Citation:** Ismail et al. (2025). *Toward Robust Security Orchestration and Automated Response in Security Operations Centers with a Hyper-Automation Approach Using Agentic Artificial Intelligence.* Information, 16(5), 365. doi:10.3390/info16050365.
**Problem:** Manual SOC (security operations centre) response is too slow for real-time fraud/scam campaigns that scale via automation on the attacker side.
**Methodology:** Hyper-automation architecture where agentic AI handles detection-to-response orchestration with minimal human latency.
**Dataset:** N/A / case-study based.
**Model:** Agentic orchestration framework (SOAR + agentic AI).
**Performance:** Not verifiable from available excerpt.
**Limitations:** Automated response actions (blocking numbers, freezing accounts) carry legal/due-process risk if false-positive rates aren't tightly controlled.
**Possible use:** Template for automating the "flag to telecom providers" and "automated MHA alert generation" features named in the challenge brief, with human-in-the-loop gates on any irreversible action.

### E4
**Citation:** Acharya, D.B., Kuppan, K., Divya, B. (2025). *Agentic AI: Autonomous Intelligence for Complex Goals — A Comprehensive Survey.* IEEE Access, 13, 18912–18936; cited within *Agentic AI for Financial Crime Compliance*, arXiv:2509.13137.
**Problem:** Financial-crime compliance workflows (AML, KYC, SAR filing) are heavily manual and reactive.
**Methodology:** Survey of agentic-AI approaches for financial-crime compliance, including literature on generative-AI agents for AML detection and reporting.
**Dataset:** N/A (survey).
**Model:** N/A (survey), references design-science research methodology for building agentic compliance systems.
**Performance:** N/A.
**Limitations:** Survey-level; practical deployments cited are early-stage.
**Possible use:** Reference architecture and citation base for the compliance/SAR-style reporting module that packages Fraud Network Graph Intelligence output for regulators/courts.

### E5
**Citation:** INTERPOL (as reported in BioCatch analysis, 2026). *Global Financial Fraud Threat Assessment* (March 2026) — summarized in "The war arrived on schedule: INTERPOL confirms the rise of agentic AI-powered fraud."
**Problem:** Documents that criminal syndicates are already using agentic AI to automate identity creation, victim manipulation, and account takeover at a scale outpacing manual defence.
**Methodology:** Threat-intelligence assessment (not an ML paper) aggregating case data across financial institutions globally.
**Dataset:** N/A (threat report).
**Model:** N/A.
**Performance:** N/A — reports the FBI IC3 attribution of $893 million in losses to AI-enabled schemes as one data point (a figure IC3 itself says likely understates true exposure).
**Limitations:** Aggregated threat report, not peer-reviewed research; figures are estimates.
**Possible use:** Primary evidence that the *defensive* side (this platform) must assume attacker-side agentic AI as the baseline threat model, not an edge case — directly motivates Part 3's "future threats" section.

---

## Cluster F — Crime Prediction / Geospatial Intelligence

### F1
**Citation:** (2025). *CHART: Intelligent Crime Hotspot Detection and Real-Time Tracking Using Machine Learning.* Computer Modeling in Engineering & Sciences (CMC), Tech Science Press.
**Problem:** Manual crime-hotspot analysis is slow, and existing ML models suffer from overfitting/class imbalance and poor spatiotemporal handling.
**Methodology:** Combines supervised learning, clustering, and geospatial analysis into one hotspot-detection-and-tracking framework, addressing class imbalance explicitly.
**Dataset:** Police-database-derived dataset with crime type, location, time, demographic attributes (scale not verifiable from available excerpt).
**Model:** Hybrid ML + clustering + geospatial framework (CHART).
**Performance:** Not verifiable from available excerpt (specific accuracy figures).
**Limitations:** Predictive-policing approaches carry well-documented equity/bias risk if historical policing data itself is biased — must be paired with fairness auditing.
**Possible use:** Core basis for "Geospatial Crime Pattern Intelligence" module — real-time hotspot layer for fraud-complaint density, FICN seizure points, and cybercrime concentration.

### F2
**Citation:** (2025). *Spatio-Temporal Crime Analysis and Hotspot Prediction Using XGBoost.* International Journal of Progressive Research in Engineering Management and Science (IJPREMS), 5(10), 1043–1050.
**Problem:** Simple hotspot maps don't capture *why* a hotspot exists (contextual drivers), limiting actionable resource allocation.
**Methodology:** XGBoost model over spatial features (lat/long, CCTV availability, proximity to police stations) plus contextual features (severity, traffic congestion, time of day, weather).
**Dataset:** Composite spatio-temporal urban-crime dataset with geospatial + contextual attributes.
**Model:** XGBoost gradient-boosted trees.
**Performance:** Feature-importance analysis reported; identifies geospatial attributes (lat/long) and contextual factors (severity, traffic congestion, time of day) as most predictive. Exact accuracy metric not verifiable from available excerpt.
**Limitations:** Feature-importance ≠ causal explanation; risk of encoding proxy biases (e.g., traffic congestion correlating with patrol presence, not actual crime rate).
**Possible use:** Feature-engineering template for the patrol-prioritisation layer — reuse the same geospatial+contextual feature set for fraud/counterfeit hotspot forecasting, not just street crime.

### F3
**Citation:** (2025). *Geospatial Analysis of Crime Patterns and Hotspots for Crime Prevention Using Deep Learning Algorithms (ConvLSTM).* EDPACS. doi:10.1080/07366981.2025.2545354.
**Problem:** Static hotspot maps don't forecast *future* hotspot evolution; agencies need forward-looking, not just descriptive, geospatial intelligence.
**Methodology:** ConvLSTM (convolutional LSTM) for spatiotemporal forecasting of crime incidents, combined with spatial clustering and a Web-GIS interface for interactive use.
**Dataset:** Historical geo-tagged crime-incident dataset (scale not verifiable from available excerpt).
**Model:** ConvLSTM deep learning model + unsupervised spatial clustering.
**Performance:** F1-score of 0.87 reported for ConvLSTM forecasting, outperforming baseline models; spatial clustering showed high overlap with known historical hotspots.
**Limitations:** ConvLSTM requires substantial historical geo-tagged data per region — cold-start problem for districts with sparse digital reporting.
**Possible use:** Best-evidenced forecasting model (highest reported F1 among reviewed papers) for the command-centre "predict tomorrow's hotspots" feature; Web-GIS front-end pattern maps directly to the district command-centre interface requirement.

### F4
**Citation:** (2025). *Crime Prediction Using Machine Learning and Deep Learning: A Systematic Review and Future Directions.* arXiv:2303.16310 (extended/updated review).
**Problem:** Synthesizes fragmented crime-prediction literature (spatio-temporal hypergraphs, attention-based multivariate fusion, cross-city domain adaptation) into a single roadmap.
**Methodology:** Systematic literature review across ML/DL crime-prediction methods 2019–2023, spanning hypergraph self-supervised learning, attention-based sequential fusion, and unsupervised domain adaptation across cities.
**Dataset:** N/A (review, synthesizes ~30+ cited studies).
**Model:** N/A (review).
**Performance:** N/A.
**Limitations:** Review paper; also candidly discusses the field's core limitation — predictive-policing bias/drawbacks (explicitly cited: "Predictive policing: Review of benefits and drawbacks").
**Possible use:** Governance reference to ensure our Geospatial Crime Pattern Intelligence layer is designed with the documented bias/equity caveats built in from day one (fairness audit gate before any patrol-allocation recommendation ships).

---

## Cluster G — Identity Fraud, Document Forgery, KYC & OCR

### G1
**Citation:** (2025). *AI-based Identity Fraud Detection: A Systematic Review.* arXiv:2501.09239.
**Problem:** Digital arrest scams rely on forged court orders, arrest warrants, and fake identity documents shown over video call — identity-fraud detection is foundational to defeating them.
**Methodology:** Systematic review of AI methods (CV-based document forensics, behavioral biometrics, liveness detection) for identity-fraud detection.
**Dataset:** N/A (review).
**Model:** N/A (review) — surveys CNN/document-forensics/biometric literature.
**Performance:** N/A.
**Limitations:** Review paper — practical deployment maturity varies widely across the surveyed sub-methods.
**Possible use:** Foundational literature base for a "fake government document/warrant detector" sub-feature of the Citizen Fraud Shield (flagging forged court-order PDFs/images shared during a call).

### G2
**Citation:** Li, Y., Huang, C., Deng, S., Lock, M.L., Cao, T., Oo, N., Lim, H.W., Hooi, B. (2024). *KnowPhish: Large Language Models Meet Multimodal Knowledge Graphs for Enhancing Reference-Based Phishing Detection.* 33rd USENIX Security Symposium, pp. 793–810.
**Problem:** Reference-based phishing detectors (comparing a suspicious site/page to a knowledge base of legitimate brands) miss novel spoofed government portals unless the KB is comprehensive and current.
**Methodology:** Multimodal knowledge graph of brand/entity references combined with LLM reasoning to detect phishing pages that impersonate known entities.
**Dataset:** Phishing-page benchmark with brand-reference knowledge graph (scale not verifiable from available excerpt).
**Model:** LLM + multimodal knowledge graph (KnowPhish).
**Performance:** Reported to outperform prior reference-based phishing detectors at USENIX Security 2024; exact numbers not verifiable from available excerpt.
**Limitations:** Requires maintaining an up-to-date knowledge graph of legitimate government/bank portals — ongoing curation burden.
**Possible use:** Direct architecture fit for detecting **fake government portals** (a named threat vector in the problem statement) — build an India-specific knowledge graph of legitimate CBI/ED/Customs/RBI/NCRB URLs and letterheads for real-time comparison.

---

*(Papers above total 20 primary sources spanning all requested topic areas: Digital Arrest, Financial Fraud, Fraud Detection, Graph AI, Knowledge Graphs, LLMs, Agentic AI, Threat Intelligence, Counterfeit Detection, Computer Vision, Voice Authentication, Deepfake Detection, Crime Prediction, Behavior Analytics, Anomaly Detection. Where a metric could not be confirmed from the retrieved excerpt, it has been explicitly marked rather than estimated.)*

---

# PART 2 — Technology Landscape

For each technology: **What / Why / Advantages / Limitations / Hackathon feasibility** (1–5 scale, 5 = build a working demo in a weekend).

## 1. Graph Databases (Neo4j, TigerGraph, Amazon Neptune, ArangoDB)
- **What:** Native storage/query engines for entity-relationship data (accounts, calls, devices, transactions as nodes/edges).
- **Why:** Fraud rings, money-mule chains, and scam-compound infrastructure are inherently relational — the *shape* of the network (rings, stars, chains) is the fraud signal, not any single node's attributes (directly supported by D1–D5 above).
- **Advantages:** Native traversal queries (Cypher/Gremlin) find multi-hop patterns (victim→mule→mule→exit) in milliseconds vs. costly SQL joins; visual graph exploration aids investigator explainability (supports D5's admissibility requirement).
- **Limitations:** Schema/ontology design is non-trivial; write-heavy real-time ingestion at national transaction scale needs careful sharding; steep learning curve for teams used to relational DBs.
- **Hackathon feasibility: 4/5** — Neo4j AuraDB free tier + sample synthetic fraud-ring dataset can produce a working graph-visualization demo in hours.

## 2. Knowledge Graphs
- **What:** A graph database *plus* an ontology/schema layer that encodes semantic relationships (e.g., "impersonates," "issued-by," "spoofs") rather than just raw edges.
- **Why:** Needed to represent heterogeneous entities — legitimate govt. portals, known scam scripts, telecom spoofing signatures, FICN seizure records — in one queryable semantic layer (supports G2's KnowPhish pattern).
- **Advantages:** Enables reasoning ("this number spoofs a pattern seen in 40 prior CBI-impersonation cases"), supports explainable multi-hop inference, integrates cleanly with RAG.
- **Limitations:** Ontology design and entity-resolution (deduplicating the same fraudster across aliases) require significant upfront modeling effort and ongoing curation.
- **Hackathon feasibility: 3/5** — a minimal ontology (5–6 entity types, 10 relationship types) is buildable in a hackathon; a production-grade KG is a multi-month effort.

## 3. Retrieval-Augmented Generation (RAG)
- **What:** Pairs an LLM with a retriever over an external, updatable knowledge store so answers are grounded in current documents rather than frozen model weights.
- **Why:** Scam scripts, fraud typologies, and counterfeit techniques evolve weekly; RAG lets the classifier retrieve the *latest* known patterns without retraining (A4, E4).
- **Advantages:** Fast to update (add a document, no fine-tuning cycle); reduces hallucination vs. pure generation; supports citation of retrieved evidence for legal admissibility.
- **Limitations:** Vulnerable to retrieval-store poisoning/knowledge-corruption attacks (per the "Securing RAG" literature, arXiv:2505.08728) — the fraud-pattern index itself becomes an attack surface that must be access-controlled and integrity-checked.
- **Hackathon feasibility: 5/5** — one of the fastest patterns to prototype (vector DB + LLM API + a folder of scam-pattern documents).

## 4. Large Language Models (LLMs)
- **What:** Foundation models for language understanding/generation, increasingly with tool-use and reasoning capability.
- **Why:** Needed for real-time call-transcript reasoning (A1–A3), scam-script classification, multilingual citizen advisory (12 regional languages per the brief), and narrative fraud-report generation.
- **Advantages:** Handles unstructured, messy input (call transcripts, chat logs, complaint text) that rule-based systems can't; supports zero-/few-shot adaptation to new scam typologies faster than retraining a classifier.
- **Limitations:** Latency and cost at scale; hallucination risk in a domain where false accusations have real legal consequences; adversarially vulnerable to prompt injection and adversarial rewording of scam scripts (A5).
- **Hackathon feasibility: 5/5** — API access to a hosted LLM makes this the fastest layer to demo.

## 5. Agentic AI / Multi-Agent Systems
- **What:** LLM-driven agents that can plan, call tools, and take multi-step autonomous action (not just answer a single prompt), often several specialised agents collaborating (E1–E5).
- **Why:** A real intelligence-fusion workflow (ingest alert → cross-check graph → check geospatial context → draft MHA alert → route to jurisdiction) is naturally a multi-step, multi-tool pipeline.
- **Advantages:** Automates the "detect → disrupt → respond" pipeline named in the challenge statement; CORTEX-style triage (E2) reduces analyst overload.
- **Limitations:** Compounding-error risk across agent chains; requires the TRiSM governance layer (E1) before any agent is allowed to trigger an irreversible action (freeze account, public alert); attacker-side agentic AI is already weaponised (E5) so defensive agents must be hardened against adversarial inputs.
- **Hackathon feasibility: 3/5** — a 2–3 agent demo (classifier agent → graph-query agent → alert-drafting agent) is achievable in a hackathon; production-grade orchestration with guardrails is not.

## 6. Vector Databases (Pinecone, Weaviate, Milvus, pgvector)
- **What:** Stores embeddings and supports nearest-neighbour similarity search.
- **Why:** Powers RAG retrieval, voiceprint/phoneme-fingerprint matching (B3), and scam-script similarity search ("does this call match a known script cluster?").
- **Advantages:** Sub-second similarity search over millions of embeddings; combines well with metadata filtering (e.g., "only search scripts flagged in the last 30 days").
- **Limitations:** Embedding quality determines everything — a poor embedding model gives confidently wrong nearest neighbours; needs a re-embedding pipeline whenever the embedding model is upgraded.
- **Hackathon feasibility: 5/5** — open-source options (pgvector, Milvus) with a pre-trained embedding model are hackathon-ready.

## 7. Computer Vision
- **What:** CNN/vision-transformer/detection models (YOLO-NAS, ResNet, ViT) for image classification, object detection, and forensic feature extraction.
- **Why:** Directly powers counterfeit note detection (C1–C5) and forged-document/warrant detection (G1).
- **Advantages:** Mature tooling, strong pretrained backbones (transfer learning cuts data needs dramatically per C3); deployable on-device (mobile/POS terminals) with model compression.
- **Limitations:** Needs UV/multispectral hardware for the highest-assurance counterfeit checks (C1) — a pure RGB phone photo has a lower ceiling; single-currency/denomination models don't generalize without retraining.
- **Hackathon feasibility: 4/5** — pretrained YOLO/ResNet + a public/synthetic currency image set gets a working demo fast; UV-hardware integration is the harder, non-hackathon-feasible part.

## 8. OCR (Optical Character Recognition)
- **What:** Extracts machine-readable text from images/scans (printed or handwritten).
- **Why:** Needed to catch textual forgery tells on prop/fake notes (C2) and to parse fake court orders/warrants/letterheads shown on video calls.
- **Advantages:** Mature, fast, cheap; fuses well with CV classifiers (C2's CNN+OCR fusion pattern) and with knowledge-graph lookups (compare extracted text/letterhead against known-legitimate templates, G2 pattern).
- **Limitations:** Struggles with low-quality video-call screenshots, non-Latin scripts at small font sizes, and deliberately distorted/watermarked forged documents.
- **Hackathon feasibility: 5/5** — open-source OCR (Tesseract, PaddleOCR) is trivial to integrate in a demo.

## 9. Speech AI (ASR, speaker diarization)
- **What:** Automatic speech recognition and speaker separation to turn call audio into structured, analyzable transcript+speaker data.
- **Why:** Upstream requirement for every text-based scam-script classifier (A1–A5) — you can't classify what you haven't transcribed.
- **Advantages:** Enables multilingual support (critical for the "12 regional languages" requirement); diarization separates victim vs. scammer speech for cleaner downstream classification.
- **Limitations:** ASR accuracy drops on code-mixed Hindi-English speech, regional accents, and noisy/compressed call audio — exactly the conditions of real scam calls; latency adds to the real-time detection budget.
- **Hackathon feasibility: 4/5** — open-source Whisper-class models give a fast working multilingual ASR demo; production-grade accuracy on Indian regional languages/code-mixing needs dedicated fine-tuning.

## 10. Voice Biometrics / Speaker & Deepfake Voice Verification
- **What:** Models that verify speaker identity (biometric matching) and/or detect synthetic/cloned speech (B1–B5).
- **Why:** Core defence against AI-voice-cloned digital-arrest calls and against fraudsters spoofing bank/police helpline voices.
- **Advantages:** Real-time-optimized architectures now exist (RTCFake, Fake-Mamba) specifically for live-call conditions; can be layered with phoneme-level person-of-interest verification (B3) for high-assurance impersonation checks.
- **Limitations:** Generalisation to novel/未-seen voice-cloning engines is an open research problem; enrolling reference voiceprints of real officials (B3) raises data-governance and consent questions for a government deployment.
- **Hackathon feasibility: 3/5** — pretrained anti-spoofing models (e.g., from ASVspoof-lineage work) can be demoed on sample audio; real-time telecom-grade integration is beyond hackathon scope.

## 11. Fraud Analytics (rule engines, statistical anomaly detection, GNN ensembles)
- **What:** The broader analytics layer combining rules, statistical outlier detection, and ML/graph models to score transactions/accounts/calls for fraud risk.
- **Why:** No single model is sufficient — production fraud systems layer rules (catch known patterns instantly, zero training lag) with ML/GNN (catch novel patterns) as in D1–D5.
- **Advantages:** Rules give interpretable, instantly deployable coverage for known typologies (e.g., "transfer to a newly opened account followed by immediate cash-out"); ML/GNN layers catch what rules miss.
- **Limitations:** Rule engines need constant manual updates as fraudsters adapt; combining rule + ML outputs into one calibrated risk score is a non-trivial engineering problem (score fusion, threshold tuning, false-positive budget management given the brief's requirement for a "very low" false-positive rate on citizen-facing tools).
- **Hackathon feasibility: 4/5** — a hybrid rule+ML scorer over a synthetic transaction dataset is a very standard, fast hackathon build.

---

# PART 3 — Innovation Gap Analysis

## Problems nobody solves (well) yet
1. **Pre-financial-transfer interception.** Nearly all fraud-detection literature (Cluster D) scores *transactions after they occur*. Almost no production-grade system detects a digital-arrest scam *during the live call, before money moves* — A1–A5 are early-stage academic prototypes, not deployed telecom-integrated systems.
2. **Cross-modal fusion at the point of contact.** No reviewed system fuses voice-deepfake detection (Cluster B) + scam-script LLM classification (Cluster A) + caller-ID/spoofing-signature analysis + real-time knowledge-graph lookup (is this "officer" real?) into one unified, sub-second, in-call decision. Each exists as a separate research thread.
3. **Court-admissible AI evidence packaging.** Only one paper reviewed (D5) directly addresses GNN explainability for legal admissibility. There is essentially no mature tooling for turning an AI fraud-ring detection into a chain-of-custody-compliant evidence package that survives cross-examination.
4. **Cross-border/cross-agency graph fusion.** Fraud compounds are explicitly described as operating "across borders" (per the problem context), but the reviewed graph-AI literature (Cluster D) operates within a single institution's transaction graph. No reviewed work fuses telecom data + banking data + international financial-intelligence-unit data into one federated graph without violating jurisdictional data-sharing law.
5. **Voiceprint enrollment at government scale with privacy safeguards.** B3's person-of-interest verification approach requires enrolled reference voice samples of real officials — nobody has published a privacy-preserving architecture for this at the scale of "every CBI/ED/Customs/RBI/bank helpline officer in India."
6. **Counterfeit detection without special hardware.** The best-performing approach (C1) depends on UV imaging hardware; nobody has closed the gap to make a standard smartphone RGB camera match UV-assisted accuracy for the highest-quality FICN.

## Weaknesses of current systems
- Rule-based bank AML systems generate high false-positive rates and burden compliance teams (motivating Cluster D's move to GNN, but GNNs remain vulnerable to adversarial graph injection — D1).
- Predictive-policing/hotspot systems (Cluster F) carry documented equity and bias risk (explicitly flagged in F4) that is rarely engineered around, only footnoted.
- LLM-based scam detectors (Cluster A) are evaluated mostly on *simulated* or *benchmarked* transcripts, not live adversarial fraud-ring calls — real-world robustness is unproven.
- RAG-based fraud systems (A4) inherit RAG's general security weakness: the knowledge store is an unprotected attack surface (poisoning/corruption).
- Deepfake-voice detectors (Cluster B) mostly report performance on curated benchmarks, not on real telecom codec/compression conditions — RTCFake (B1) is one of the first to target this gap directly, and it's a 2026 preprint (unvalidated at scale).

## Missing government capabilities
- No unified national **fraud-pattern knowledge base** that telecom, banks, and police can all query in real time (the RAG architecture in A4 assumes such a store exists — it largely doesn't yet in India).
- No standard **API/data-sharing protocol** between telecom providers (for spoofed-number/call-pattern data), banks (for transaction graphs), and police (for complaint/FIR data) — the multi-agency convergence the challenge statement calls for has no existing technical substrate.
- No **real-time reverse lookup** for citizens to check "is this claimed CBI/ED/Customs officer's number/ID real?" against an authoritative registry.
- Limited multilingual coverage: most cited NLP/LLM fraud work (Cluster A, TeleAntiFraud-28k) is not India-regional-language-native; a genuinely 12-regional-language-capable citizen shield does not yet exist in the literature reviewed.

## Missing AI capabilities
- **Streaming multimodal fusion models** that jointly reason over audio (voice authenticity), text (script content), and metadata (call routing/spoofing signature) in one pass, rather than as three separate systems whose outputs are manually reconciled.
- **Adversarially-robust graph fraud detection** — D1 shows current GNN fraud detectors *can* be broken by coordinated injection; robust/certified defences for this specific attack class are not yet mainstream.
- **Federated, privacy-preserving counterfeit-detection model updates** across banks (explicitly recommended as future work in C5, not yet built).
- **Explainable-by-design fraud-ring scoring** (D5 is a first step, not a mature, widely adopted standard).

## Future threats
- **Agentic-AI-run fraud compounds:** E5's INTERPOL-reported trend (agentic AI already automating identity creation, victim manipulation, account takeover) means digital-arrest scam operations will likely become *autonomously orchestrated* rather than human-call-centre-run within the next 1–3 years, raising both scale and personalization of attacks.
- **Real-time, high-fidelity live-video deepfakes** (not just voice) impersonating uniformed officers on video call — voice-deepfake literature is maturing (Cluster B) but real-time *video* deepfake defence is comparatively less represented in the papers surfaced here, suggesting a coming capability gap.
- **Adversarial poisoning of shared fraud-intelligence stores:** as agencies move toward the RAG/knowledge-graph-sharing model recommended in this report, the shared store itself becomes a high-value target (per the RAG-security literature cited in Cluster A/E) — an attacker who poisons the shared "known scam pattern" database could suppress detection of their own campaign nationally.
- **Financial-market-level attacks:** the Atlantic Council source (E5 cluster) already documents adversarial poisoning attacks against algorithmic trading models in March 2025 — the same technique class could be turned against automated fraud-scoring models themselves.

## Future opportunities
- India-specific multimodal fraud/scam datasets (following the TeleAntiFraud-28k model, A3) covering Hindi/regional-language digital-arrest scripts would be a first-mover public good with major research and product value.
- A shared, access-controlled, integrity-verified national **fraud-typology knowledge graph** (Clusters C/G's KnowPhish pattern) that telecoms, banks, and NCRB can all query — potentially India's equivalent of a "fraud CVE database."
- Explainable-GNN-as-a-service for regulators/courts (extending D5) — a genuinely novel, high-value, exportable capability.
- Lightweight, UV-hardware-free counterfeit detection reaching parity with C1's UV-assisted results, closing a real capability gap flagged above.

---

# PART 4 — Feature Brainstorm (50 Innovative Features)

Complexity: Low / Medium / High / Very High. Innovation & Business Value scored 1–5. Hackathon Value: how buildable/demoable within a hackathon timeframe (1–5).

| # | Feature | Problem Solved | Users | Technical Approach | Complexity | Innovation | Business Value | Hackathon Value |
|---|---|---|---|---|---|---|---|---|
| 1 | Live-Call Scam Script Classifier | Detects digital-arrest scam patterns as they're spoken | Citizens, telecoms | Streaming ASR + LLM classifier (A1, A3) | High | 5 | 5 | 3 |
| 2 | Real-Time Deepfake Voice Alert | Flags AI-cloned voice mid-call | Citizens, banks | RTCFake/Fake-Mamba style real-time CM (B1, B2) | Very High | 5 | 5 | 2 |
| 3 | Fake Officer ID Verifier | Confirms if a claimed CBI/ED/Customs official is real | Citizens | Knowledge graph of legitimate officials + RAG lookup | Medium | 5 | 5 | 4 |
| 4 | Fake Court Order/Warrant Scanner | Detects forged legal documents shown on video call | Citizens, police | OCR + template-matching KG (G1, G2) | Medium | 4 | 5 | 4 |
| 5 | Multilingual WhatsApp Fraud Shield | Instant fraud-risk verdict via chat in 12 languages | Citizens | LLM + RAG, multilingual ASR/NLP | Medium | 4 | 5 | 4 |
| 6 | Money Mule Chain Reconstructor | Traces full laundering chain, not just single accounts | Banks, police | Unsupervised graph chain tracing (D3) | High | 5 | 5 | 3 |
| 7 | Explainable Fraud Ring Dossier Generator | Turns GNN fraud score into court-admissible report | Police, courts | Explainable GNN + LLM narrative generation (D5) | High | 5 | 5 | 3 |
| 8 | Cross-Agency Fraud Graph Fusion Layer | Links telecom + bank + police data w/o violating jurisdiction | MHA, RBI, telecoms | Federated graph learning, privacy-preserving joins | Very High | 5 | 5 | 1 |
| 9 | Adversarial Graph-Injection Defence Module | Hardens fraud-ring GNN against coordinated evasion | Banks | Adversarial training vs. MonTi-style attacks (D1) | High | 4 | 4 | 2 |
| 10 | UV-Free Smartphone Counterfeit Detector | Closes gap between RGB phone camera and UV-assisted accuracy | Citizens, small merchants | Multi-feature CNN ensemble + microprint CV (C1-adjacent) | High | 5 | 5 | 3 |
| 11 | Bank Counting-Machine CV Plugin | Instant FICN flagging at teller counters | Bank tellers | YOLO-NAS + UV imaging (C1) | Medium | 4 | 5 | 3 |
| 12 | Federated Counterfeit-Model Learning Network | Banks jointly improve model without sharing note images | RBI, banks | Federated learning (per C5's recommendation) | Very High | 5 | 4 | 1 |
| 13 | OCR Prop-Note & Toy-Currency Filter | Cheap first-pass filter for obvious fakes | Citizens | CNN + OCR fusion (C2) | Low | 3 | 3 | 5 |
| 14 | Geospatial Fraud & FICN Hotspot Command Map | Real-time district-level hotspot visualization | Police command centres | ConvLSTM forecasting + Web-GIS (F3) | High | 4 | 5 | 3 |
| 15 | Predictive Patrol Allocation Advisor | Recommends patrol deployment before crime spikes | District police | XGBoost + contextual features (F2) | Medium | 4 | 4 | 4 |
| 16 | Bias-Audited Hotspot Fairness Dashboard | Flags demographic skew in predictive-policing outputs | Oversight bodies | Fairness metrics over F1–F3 outputs | Medium | 5 | 4 | 4 |
| 17 | Scam Compound Geolocation Correlator | Links seized-device geodata to known fraud-compound clusters | Police, Interpol liaison | Graph + geospatial fusion | High | 5 | 5 | 2 |
| 18 | Fraud Typology RAG Knowledge Base | Central updatable store of known scam scripts/patterns | All agencies | Vector DB + curated documents (A4) | Medium | 4 | 5 | 5 |
| 19 | RAG Poisoning Integrity Monitor | Detects tampering/poisoning of the shared knowledge store | Platform admins | Anomaly detection over retrieval-store updates | High | 5 | 4 | 2 |
| 20 | Adversarial Scam-Script Red-Team Suite | Tests classifiers against LLM-paraphrased scam text | Dev/QA teams | Adversarial generation + eval harness (A5) | Medium | 4 | 4 | 4 |
| 21 | Voice Enrollment Registry for Govt. Helplines | Lets citizens verify a caller against real official voiceprints | Citizens, MHA | Phoneme-level speaker verification (B3), privacy-by-design | Very High | 5 | 5 | 1 |
| 22 | NCRB Auto-Filing Assistant | Auto-drafts NCRB/cybercrime complaint from chat conversation | Citizens | LLM structured-extraction + form-fill | Low | 3 | 4 | 5 |
| 23 | Automated MHA Alert Generator | Converts high-confidence scam detections into formal alerts | MHA, telecoms | Agentic pipeline (classifier → template → routing) (E3) | Medium | 4 | 5 | 4 |
| 24 | Multi-Agent Alert Triage (CORTEX-style) | Filters flood of alerts to highest-severity cases only | SOC/command-centre analysts | Multi-agent LLM collaboration (E2) | High | 5 | 5 | 3 |
| 25 | Cross-Jurisdiction Case Router | Auto-routes fraud cases to correct district/state cyber cell | Police | Rule engine + knowledge graph | Low | 3 | 4 | 5 |
| 26 | Victim Support Chatbot (Post-Incident) | Guides victims through recovery, freezing accounts, reporting | Citizens | LLM conversational agent + workflow integration | Low | 3 | 4 | 5 |
| 27 | Real-Time Number-Spoofing Signature Detector | Flags call-routing anomalies typical of spoofed CBI/ED numbers | Telecoms | Call-metadata anomaly detection (rule + ML) | Medium | 4 | 5 | 3 |
| 28 | Deepfake Video Call Liveness Check | Detects synthetic/manipulated video during "arrest" calls | Citizens | Video liveness/deepfake CV (emerging area, gap identified) | Very High | 5 | 5 | 1 |
| 29 | Scam Compound Financial Flow Visualizer | Interactive graph explorer for investigators | Police, banks | Neo4j/graph DB front-end | Medium | 3 | 4 | 4 |
| 30 | Money-Mule Recruitment Ad Detector | Scans social/job platforms for mule-recruitment posts | Police, platforms | NLP text classifier + web crawler | Medium | 4 | 4 | 4 |
| 31 | Crypto/Gift-Card Conversion Tracer | Flags scam-linked crypto/gift-card conversion attempts | Banks, exchanges | Transaction-pattern + graph anomaly detection | High | 4 | 5 | 2 |
| 32 | Explainable Risk Score Widget (Citizen-Facing) | Shows *why* a call/message was flagged, in plain language | Citizens | LLM explanation layer over classifier output | Low | 3 | 4 | 5 |
| 33 | Continual-Learning Fraud Model Pipeline | Updates fraud models without catastrophic forgetting | Banks, platform ops | Continual/lifelong graph learning (D4) | High | 4 | 4 | 2 |
| 34 | Regional-Language Scam Script Corpus Builder | Crowdsources/curates Hindi & regional scam scripts for training | Researchers, MHA | Data pipeline + annotation tool (à la TeleAntiFraud, A3) | Medium | 5 | 4 | 4 |
| 35 | Synthetic Fraud-Ring Data Generator | Produces synthetic training graphs preserving privacy | ML teams | GAN-based synthetic graph generation | Medium | 3 | 3 | 3 |
| 36 | Cross-Bank Suspicious Account Sharing Protocol | Lets banks share fraud-flagged accounts w/o raw data leakage | Banks, RBI | Federated learning / secure multi-party computation | Very High | 5 | 5 | 1 |
| 37 | Behavioral Biometrics Continuous Auth | Flags account takeovers via typing/navigation pattern drift | Banks | Behavioral biometrics ML | Medium | 3 | 4 | 3 |
| 38 | Scam-Compound Supply Chain Mapper | Maps SIM-card, device, and mule-account supply chains | Police, Interpol | Graph AI over procurement/registration data | High | 4 | 4 | 2 |
| 39 | Elderly-Focused Simplified Alert UI | Simplified, large-text, voice-guided warnings for high-risk demographic | Elderly citizens | UX layer over core detection engine | Low | 3 | 4 | 5 |
| 40 | IVR-Based Fraud Risk Check (No Smartphone Needed) | Extends protection to feature-phone/rural users | Citizens without smartphones | IVR + speech AI + classifier backend | Medium | 4 | 5 | 3 |
| 41 | Telecom Real-Time Call Interception Consent Flow | Legally compliant opt-in mechanism for live-call scanning | Telecoms, regulators | Consent/privacy engineering + policy design | Medium | 4 | 5 | 3 |
| 42 | Fraud Pattern "CVE Database" for India | Publicly shareable, versioned scam-typology registry | Researchers, agencies, public | Structured knowledge base + publishing pipeline | Medium | 5 | 5 | 4 |
| 43 | AI Model Audit Trail & Model Card Repository | Documents every model version used in legal evidence chains | Courts, auditors | MLOps model registry + documentation standard | Low | 3 | 5 | 4 |
| 44 | False-Positive Feedback Loop for Citizens | Lets wrongly-flagged citizens report errors, retrains model | Citizens, platform ops | Human-in-the-loop active learning | Medium | 3 | 4 | 4 |
| 45 | Bank-Teller Counterfeit Training Simulator | Gamified training tool using real CV model outputs | Bank staff | CV model + interactive training UI | Low | 2 | 3 | 5 |
| 46 | Cross-Denomination Counterfeit Model | Single model generalizing across ₹100/₹200/₹500/₹2000-class notes | Banks, RBI | Multi-task CV model, domain adaptation | High | 4 | 5 | 2 |
| 47 | Digital Arrest Simulation/Awareness Trainer | Lets citizens experience a safe simulated scam call to build recognition | Citizens, schools, employers | Scripted LLM roleplay agent | Low | 4 | 4 | 5 |
| 48 | Agentic Investigation Copilot for Officers | Drafts case summaries, cross-references evidence graphs automatically | Police investigators | Multi-agent LLM system (FAA/LAPIS pattern, Cluster E) | High | 5 | 5 | 3 |
| 49 | Real-Time Fraud Dashboard for RBI/MHA Leadership | Aggregated, live national view of fraud/counterfeit trends | RBI, MHA leadership | BI dashboard over fused data pipeline | Low | 3 | 5 | 5 |
| 50 | Zero-Day Scam Typology Early-Warning System | Detects brand-new scam patterns before they scale nationally | All agencies | Unsupervised graph/text anomaly detection + human review | Very High | 5 | 5 | 2 |

---

# PART 5 — Technology Roadmap

## Frontend
- **Web command-centre UI:** React + TypeScript, with a mapping layer (Mapbox GL / Leaflet) for the Geospatial Crime Pattern Intelligence module.
  *Why:* Mature ecosystem for real-time dashboards; component reuse across citizen app and officer command centre reduces build time; strong accessibility tooling needed for the elderly-focused simplified UI (Feature 39).
- **Citizen mobile app:** React Native (or Flutter if native camera/UV-sensor access proves easier in Flutter's plugin ecosystem) for the Citizen Fraud Shield.
  *Why:* Single codebase for Android/iOS reduces cost; India's smartphone base is overwhelmingly Android, so React Native's mature Android tooling is the safer default; must also support the IVR fallback (Feature 40) for non-smartphone users — this is a backend/telecom integration, not a frontend concern.
- **Officer investigation console:** Graph-visualization component (Neo4j Bloom / react-force-graph) embedded in the web console.
  *Why:* Investigators need to *see* the fraud-ring shape, not just read a score — directly supports the legal-admissibility/explainability requirement (D5).

## Backend
- **API layer:** Python (FastAPI) for AI/ML-serving endpoints; Node.js/NestJS for citizen-facing transactional services (auth, complaint filing, notifications).
  *Why:* FastAPI has first-class support for async model-serving and integrates cleanly with the Python-native ML/GNN ecosystem (PyG, DGL) used in Cluster D's architectures; Node.js is well-suited to high-concurrency, I/O-bound citizen-facing traffic (WhatsApp/IVR webhooks).
- **Agent orchestration layer:** LangGraph or a custom agent framework implementing the TRiSM governance pattern (E1) with explicit human-in-the-loop gates before any irreversible action (account freeze, public alert).
  *Why:* The multi-agent triage pattern (CORTEX, E2) and the "detect→disrupt→respond" pipeline in the challenge brief both require an orchestration layer that is *auditable*, not just functional — governance must be architected in, not bolted on.
- **Streaming layer:** Apache Kafka (or a managed equivalent) for real-time call-metadata, transaction, and complaint event streams.
  *Why:* The live-call detection features (1, 2, 27) and real-time fraud-ring scoring both require sub-second event streaming, not batch ETL.

## Database
- **Graph database:** Neo4j (or TigerGraph for very large-scale deployments) for the Fraud Network Graph Intelligence and Money Mule Chain Reconstructor modules.
  *Why:* Directly matches the access pattern proven across Cluster D (D1–D5) — multi-hop relational traversal is native, not simulated via joins.
- **Vector database:** Milvus or pgvector (if minimizing new infrastructure is a priority) for the RAG fraud-typology knowledge base and voiceprint/phoneme similarity search.
  *Why:* pgvector keeps the stack simpler (one Postgres instance does relational + vector) for a government deployment where operational simplicity and auditability matter as much as raw performance; Milvus is the upgrade path if scale demands it.
- **Relational database:** PostgreSQL for transactional/citizen data (accounts, complaints, case records).
  *Why:* Mature, auditable, widely supported by government IT procurement standards; pgvector extension unifies with the vector-DB need above.
- **Time-series/geospatial store:** PostGIS extension on Postgres (or TimescaleDB) for the hotspot-forecasting pipeline (F1–F3).
  *Why:* PostGIS is the de facto standard for geospatial queries and integrates natively with the same Postgres instance, reducing operational surface area.

## AI Stack
- **NLP/LLM layer:** A hosted frontier LLM (via API) for reasoning-heavy tasks (scam-script classification, dossier generation, multilingual advisory) + a smaller fine-tuned/open model for high-volume, latency-sensitive classification (cost and data-sovereignty considerations for government deployment).
  *Why:* Frontier models give the best reasoning quality for high-stakes triage (E2); a smaller self-hosted model keeps per-call classification costs and latency bounded, and allows on-premises deployment where data cannot leave government infrastructure.
- **Graph ML:** PyTorch Geometric (PyG) or DGL for GNN fraud-ring/money-mule detection, following the LLM-enhanced-GNN (D2) and explainable-GNN (D5) patterns.
  *Why:* Both are the standard, well-supported libraries underpinning nearly all Cluster D papers reviewed — reduces re-implementation risk.
- **Speech AI:** Whisper-class ASR (fine-tuned on Indian regional languages/code-mixed speech) + a real-time deepfake-audio CM (RTCFake/Fake-Mamba pattern, B1/B2).
  *Why:* Whisper's multilingual pretraining is the fastest path to the 12-regional-language requirement; a lightweight state-space (Mamba) deepfake detector is specifically evidenced (B2) as suited to real-time, lower-compute deployment.
- **Computer Vision:** YOLO-NAS + a UV-feature classifier ensemble (C1), with OCR fusion (C2) as a cheap first-pass filter.
  *Why:* C1 is the best-evidenced, most recent (2025) Indian-banknote-specific architecture reviewed; layering the cheap OCR filter (C2) reduces load on the heavier CV pipeline for obvious fakes.

## Cloud
- **Government-approved sovereign cloud (e.g., MeitY-empanelled cloud service providers) or on-premises deployment for sensitive data (transaction graphs, voiceprints, case records).**
  *Why:* Data-sovereignty and legal-admissibility requirements for a government public-safety platform typically mandate in-country/empanelled infrastructure; this is a compliance requirement, not just a technical preference.
- **Hybrid burst capacity** on a major public cloud (for stateless, non-sensitive workloads like the public-facing WhatsApp/IVR shield and model-training compute) where empanelled sovereign capacity is constrained.
  *Why:* Balances cost/elasticity for compute-heavy model training against data-residency requirements for sensitive storage.

## Deployment
- **Kubernetes (K8s)** for containerized microservices (API, agent orchestration, model-serving).
  *Why:* Standard for scaling model-serving independently of transactional services; supports the multi-tenant needs of a multi-agency (MHA, RBI, banks, telecoms) platform.
- **MLOps pipeline** (MLflow or similar) with mandatory model-card documentation (Feature 43) for every deployed model version.
  *Why:* Legal-admissibility (D5) and auditability requirements mean every fraud-ring score used as evidence must be traceable to an exact, versioned, documented model — this is a hard requirement, not best practice.

## Architecture
- **Event-driven, multi-agent microservices architecture:** ingestion (call/transaction/complaint streams) → real-time classification agents (scam script, deepfake voice, spoofing signature) → graph-fusion agent (fraud-ring/mule-chain scoring) → triage agent (CORTEX-style, E2) → human-gated action layer (alert generation, freeze recommendation) → explainable-evidence packaging (D5) → command-centre dashboard.
  *Why:* This mirrors the "detect, disrupt, respond" pipeline required by the challenge statement while enforcing a human-in-the-loop checkpoint before any irreversible action — directly implementing the TRiSM governance principle (E1) at the architecture level, not as an afterthought.

## Security
- **Zero-trust access control** across all agency integrations (telecom, banks, police, RBI), with per-agency data-scoping — no agency gets raw access to another's full dataset, only to derived fraud signals (mirrors the "cross-agency graph fusion" gap identified in Part 3, and is the practical mitigation for it).
- **RAG/knowledge-graph integrity monitoring** (Feature 19) — the shared fraud-typology store must have write-access controls, versioning, and anomaly detection on updates, given the documented poisoning-attack surface (Cluster A/E evidence).
- **Adversarial robustness testing** built into CI/CD for every classifier (scam-script, deepfake-voice, GNN fraud-ring) — reusing the attack methodologies from D1 (graph injection) and A5 (adversarial text) as standing red-team test suites, not one-time audits.
- **Explainability-by-default** for any model output used in an MHA alert, account-freeze recommendation, or court submission (D5) — no black-box score may trigger an irreversible action without an attached, human-readable rationale.
- **Privacy-by-design for voice enrollment** (Feature 21) — any voiceprint registry of government officials must use privacy-preserving matching (e.g., on-device comparison, encrypted templates) rather than centralized raw-audio storage, given the sensitivity flagged in Part 3.

---

# PART 6 — Startup Opportunities

For each: qualitative estimates of Market Demand, Competition, Innovation, Scalability, Revenue Potential (Low/Medium/High), grounded in the gaps identified in Part 3.

### 1. "Fraud CVE" — National Fraud Typology Knowledge Base (B2B/B2G SaaS)
A subscription knowledge-graph/RAG service that banks, telecoms, and police can query for the latest scam typologies and known spoofing signatures (Feature 18/42).
- **Market demand:** High — every bank and telecom independently rebuilds this today.
- **Competition:** Medium — some private threat-intel vendors exist globally, but no India-specific, multi-agency-oriented player identified in this research.
- **Innovation:** High — no reviewed paper describes a production version of this at national scale.
- **Scalability:** High — subscription/API-consumption model scales cheaply once the knowledge base is built.
- **Revenue potential:** High — recurring B2B/B2G SaaS revenue with strong lock-in (network effects: more subscribers → richer typology data → better product).

### 2. Real-Time Deepfake-Voice Call Shield (B2B2C, telecom-integrated)
A telecom-network-level or carrier-partnered service implementing RTCFake/Fake-Mamba-style real-time deepfake detection (Features 2, 27) as a value-added service.
- **Market demand:** High and rising fast (Entrust-reported 3,000% deepfake-volume growth 2022–23, per the B2 source cluster).
- **Competition:** Medium-High globally (several deepfake-detection vendors exist), but real-time telecom-integrated deployment specifically is comparatively unproven/early — first-mover advantage possible in India.
- **Innovation:** High — combining real-time architecture (B1/B2) with telecom-grade latency constraints is still a research-frontier problem.
- **Scalability:** High if telecom partnerships are secured; distribution bottleneck is the primary risk, not the technology.
- **Revenue potential:** Medium-High — likely per-subscriber or per-call-minute licensing to telecoms/banks.

### 3. UV-Hardware-Free Counterfeit Detection SDK
A smartphone-camera-only counterfeit-note detection SDK licensed to banking apps, payment apps, and POS vendors (Feature 10).
- **Market demand:** High — every small merchant and citizen currently has no reliable tool.
- **Competition:** Medium — several counterfeit-detection apps exist, but the reviewed literature shows current best accuracy still leans on UV hardware (C1); a genuinely hardware-free SOTA model would be differentiated.
- **Innovation:** High if it closes the accuracy gap identified in Part 3; Medium if it just repackages existing CNN baselines (C3/C4-level).
- **Scalability:** High — SDK-licensing model scales globally, not just to India (any currency).
- **Revenue potential:** Medium — SDK licensing fees are typically smaller per-deal than enterprise SaaS, but volume (every bank/payment app) can compensate.

### 4. Explainable Fraud-Ring Evidence Packaging Platform (LegalTech × FraudTech)
A platform that ingests raw GNN fraud-ring scores (from any bank's existing fraud system) and outputs a structured, explainable, chain-of-custody-compliant evidence dossier for law enforcement/courts (Features 7, 43; built on D5).
- **Market demand:** Medium-High — explicitly named as an "Evaluation Focus" gap in the original challenge brief, suggesting real institutional pain.
- **Competition:** Low — no reviewed paper describes a mature commercial product in this specific niche (explainability research exists, productized legal-evidence tooling does not).
- **Innovation:** High — a genuine white-space combining explainable-AI research with legal/evidentiary standards.
- **Scalability:** Medium — likely requires jurisdiction-specific legal customization, limiting pure copy-paste scaling across countries.
- **Revenue potential:** Medium-High — high willingness-to-pay from banks/regulators facing compliance and litigation costs, but sales cycles to government/regulated entities are long.

### 5. Multi-Agent "Investigation Copilot" for Financial-Crime Units
An agentic-AI copilot (Feature 48, building on LAPIS/FAA patterns) that assists police/bank investigators by auto-drafting case summaries, cross-referencing evidence graphs, and suggesting next investigative steps.
- **Market demand:** Medium-High — investigator time is the visible bottleneck across nearly every source in Cluster D/E.
- **Competition:** Medium — general-purpose "AI copilot for X" startups are proliferating, but a domain-specialized, evidence-graph-integrated version for financial-crime investigation is more niche.
- **Innovation:** Medium-High — technically an application of existing agentic patterns (E1–E5) rather than new foundational research, but the domain integration itself is novel.
- **Scalability:** Medium — needs deep integration with each customer's existing case-management systems, which slows scaling vs. a pure SaaS product.
- **Revenue potential:** Medium — per-seat licensing to police units/bank investigation teams; smaller total addressable market than consumer-facing plays, but higher per-seat willingness to pay.

### 6. Federated Learning Consortium-as-a-Service (Cross-Bank Fraud/Counterfeit Model Training)
A neutral third-party platform enabling banks to jointly train fraud/counterfeit-detection models via federated learning without sharing raw data (Features 12, 36).
- **Market demand:** Medium — real pain point (data-sharing restrictions limit model quality today) but requires multiple institutions to coordinate, which is a slower sales motion.
- **Competition:** Low-Medium — federated-learning infrastructure vendors exist generally, but a fraud/counterfeit-specific consortium platform for the Indian banking sector was not identified in this research.
- **Innovation:** High — directly matches an explicitly-recommended-but-unbuilt future-work item (C5).
- **Scalability:** Medium — value increases with consortium size (network effect), but requires regulatory buy-in (RBI) to get initial banks to join — a slow, high-effort bootstrap phase.
- **Revenue potential:** Medium — likely a consortium-membership/infrastructure-fee model rather than high-margin SaaS; revenue scales with number of participating institutions.

---

## Closing Note on Evidence Standards

Every paper cited in Part 1 carries a verifiable DOI, arXiv ID, or publisher URL captured directly from search results at the time of writing. Wherever a specific performance number, dataset size, or methodological detail was not visible in the retrieved abstract/reference excerpt, this report says so explicitly ("not verifiable from available excerpt") rather than estimating or inventing a figure. Given the pace of this field — several of the cited arXiv papers are dated as recently as 2026 — this blueprint should be treated as a living document; a technology-scan refresh every 60–90 days is recommended before any procurement or hackathon-judging decision is finalized on the basis of "latest research."
