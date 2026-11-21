# Algorithm Genie — ML Recommendation Tool

> **An Interactive, Auditable Machine Learning Algorithm Decision Assistant & Production Architecture Advisor.**  
> *Translating business objectives and data constraints into mathematically grounded, auditable ML recommendations.*

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Audit Engine](https://img.shields.io/badge/Decision_Tree-Deterministic_%26_Auditable-0284C7?style=flat-square)]()
[![Tests](https://img.shields.io/badge/12%2F12_Journeys-Passing-emerald?style=flat-square)]()

---

## 📖 Executive Summary

**Algorithm Genie** is not an improvisational chatbot that hallucinates model suggestions. It is a **deterministic, auditable decision-support system** engineered for Data Scientists, Machine Learning Engineers, Product Managers, and Business Analysts.

The application navigates an explicit, multi-stage decision tree to answer five fundamental questions:
1. **Is Machine Learning genuinely necessary**, or can a simpler deterministic heuristic / SQL model solve the problem more reliably?
2. **Is your available data sufficiently ready**, diagnosing missingness mechanisms (MCAR/MAR/MNAR), sample size regimes ($n \gg p$ vs. $p > n$), label reliability, and target leakage?
3. **What is the exact mathematical problem family** (Supervised Classification, Regression, Time-Series Panel Forecasting, Unsupervised Clustering, Anomaly Detection, Recommendation Systems, Causal Inference vs. Prediction, Bandits / RL)?
4. **Which algorithms are appropriate**, organizing candidate models into four disciplined tiers: **Recommended Baseline**, **Primary Production Candidate**, **Alternative Candidate**, and **Advanced Architecture**?
5. **How should the model be validated, evaluated, explained, deployed, and monitored** through a complete 21-step operational roadmap?

---

## 🎨 Visual Aesthetics & Product Design

- **Frosted Glassmorphism:** Translucent floating cards (`bg-white/80 backdrop-blur-xl`), soft icy blue borders (`border-sky-100`), and subtle atmospheric shadows.
- **Transparencies & Light Blue Theme:** Palette inspired by modern enterprise tooling (`#f0f9ff` [sky-50], `#e0f2fe` [sky-100], `#38bdf8` [sky-400], `#0284c7` [sky-600]).
- **Progressive Disclosure:** Each diagnostic node presents a concise question, selectable choices, and a **"Why this question matters"** drawer.
- **Dual Explanation Levels:** 
  - **Simple View:** Accessible, high-level business explanations for executives and non-technical stakeholders.
  - **Technical View:** In-depth statistical framing (e.g. VC dimension, Rubin's missingness taxonomy, Neyman-orthogonal scores, logit linearity) for Senior Data Scientists.
- **Interactive Rewindable Trail:** Users can click any past question in the sidebar history to roll back answers; downstream branches automatically recalculate.

---

## 🔬 The 11 Diagnostic Stages

### Stage 1: Objective & ML Necessity
- Evaluates whether business rules, SQL queries, or descriptive BI dashboards can solve the problem deterministically.
- Captures production operating requirements: inference latency SLA (< 50ms real-time API vs. batch), cost of errors (asymmetric loss matrices), and regulatory auditing constraints.

### Stage 2: Data Availability & Readiness Assessment
- Evaluates data modalities (tabular, time-series, text, images).
- Compares sample volume against feature dimensions ($n$ vs. $p$).
- Audits label reliability, label noise, and inter-annotator disagreement.
- Distinguishes Rubin's missingness mechanisms: **MCAR** (Missing Completely at Random), **MAR** (Missing at Random), and **MNAR** (Missing Not at Random — rejects crude mean imputation).
- Evaluates target leakage and point-in-time feature validity.
- Outputs one of three states: **Ready for Controlled Modeling**, **Conditionally Ready** (actionable remediation items), or **Not Ready** (critical roadblock).

### Stage 3: Problem Identification & Framing
- Differentiates:
  - **Binary Classification** (calibrated posterior probabilities $P(Y=1|X)$).
  - **Multiclass & Multilabel Classification** (nominal vs. ordinal proportional odds vs. multi-tag).
  - **Tabular Regression** (continuous response, right-skewed Tweedie/Gamma GLMs, quantile regression).
  - **Time-Series Forecasting** (univariate vs. global panel with exogenous covariates).
  - **Unsupervised Clustering** (convex spherical vs. arbitrary density manifolds with noise).
  - **Anomaly Detection** (unsupervised isolation vs. supervised rare-event cost-sensitive learning).
  - **Recommendation Systems** (content-based cold-start vs. collaborative matrix factorization).
  - **Causal Inference vs. Predictive ML** (identifying counterfactual treatment effects $E[Y(1) - Y(0)]$ under confounding; strictly prohibits confusing predictive feature weights with causal impact).
  - **Reinforcement Learning & Bandits** (immediate contextual feedback vs. full sequential MDPs).

### Stage 4: Algorithm Candidate Strategy (4 Tiers)
- **Tier 1 (Mandatory Baseline):** Simplest disciplined benchmark model (e.g. L2 Logistic Regression, Ridge Regression, Seasonal Naive, K-Means++).
- **Tier 2 (Primary Candidate):** Best justified model based on constraints (e.g. LightGBM, CatBoost, Explainable Boosting Machine [EBM], HDBSCAN, Double ML).
- **Tier 3 (Alternative Candidate):** Viable alternative with different engineering trade-offs (e.g. Random Forest).
- **Tier 4 (Advanced Candidate):** High-capacity model deployed only when empirical validation justifies the operational cost (e.g. Temporal Fusion Transformer, TabNet, Deep Autoencoder).

### Stage 5: Target Evaluation Metrics
- Strictly aligns metrics with business loss functions.
- Rejects raw accuracy for imbalanced classification in favor of **PR-AUC**, **Brier score**, and **Cost-Weighted Utility Matrices**.
- Recommends **WAPE** and **MASE** for demand forecasting; **Silhouette** and **Stability Resampling** for clustering.

### Stage 6: Validation Strategy & Statistical Diagnostics
- Enforces strict leak-free splitting:
  - **Stratified K-Fold** for balanced/imbalanced classification.
  - **Rolling-Origin TimeSeriesSplit** for temporal data (strictly prohibits random shuffling).
  - **GroupKFold** when entities share repeated observations.
- Provides a comprehensive **Statistical Assumptions Diagnostic Suite**:
  - *Linearity:* Residual vs. fitted plots, Ramsey RESET test.
  - *Homoscedasticity:* Breusch-Pagan / White test.
  - *Multicollinearity:* Variance Inflation Factors (VIF > 5.0).
  - *Logit Linearity:* Box-Tidwell test.
  - *Stationarity:* Augmented Dickey-Fuller (ADF) & KPSS tests.
  - *Autocorrelation:* Ljung-Box test on residuals.
  - *Cluster Tendency:* Hopkins Statistic ($H > 0.7$).

### Stage 7: Explainability & Interpretability
- Evaluates glass-box intrinsic models (EBM, GLMs) vs. post-hoc explainers (**TreeSHAP**, Partial Dependence Plots [PDP], ICE curves, Permutation Feature Importance).
- Displays explicit governance warnings: *SHAP values quantify statistical model attribution, NEVER real-world causal mechanisms.*

### Stage 8: Model Recommendation Synthesis
- Generates comparative matrices covering interpretability, computational footprint, data requirements, primary assumptions, and key failure risks.

### Stage 9: End-to-End 21-Step Implementation Roadmap
Structured into three actionable phases:
- **Phase 1 (Framing & Data):** Problem charter, access governance, data profiling, labeling audits, EDA, principled cleaning, and feature engineering.
- **Phase 2 (Modeling & Validation):** Validation split generator, baseline construction, candidate training, Bayesian hyperparameter tuning (Optuna), threshold calibration, assumption diagnostics, and explainability audits.
- **Phase 3 (Production & Governance):** Model cards, serialization (ONNX/Treelite), API/Batch serving, shadow mode testing, canary rollout, real-time drift telemetry (PSI/Evidently), and automated retraining triggers.

### Stage 10: Downloadable Technical Reports
- **Professional PDF Report:** Generated in-browser using `jsPDF` with executive summary, tiered candidate cards, validation directives, roadmap milestones, and governance disclaimers.
- **Markdown (.md) Export:** Complete structured report for Notion, GitHub, or documentation repositories.

### Stage 11: Scope Limitations & Scientific Transparency
- Dedicated section: *"What this decision tree does NOT cover"*.
- Explicitly flags out-of-scope domains (Physics-Informed Neural Networks, petabyte-scale distributed training, dynamic GNNs, federated differential privacy) with transparent explanations of why automated static trees cannot replace custom scientific co-design.

---

## 🧪 Automated Test Suite (12 Predefined Journeys)

Algorithm Genie includes an automated verification suite testing all 12 core user journeys:

```bash
npm run test:journeys
```

```
====================================================
VERIFYING ALL 12 MACHINE LEARNING DECISION JOURNEYS
====================================================

Testing Journey: "1. Business Rules / No ML Needed"...            ✓ PASSED!
Testing Journey: "2. No Available Data"...                        ✓ PASSED!
Testing Journey: "3. Unreliable / Noisy Labels"...                ✓ PASSED!
Testing Journey: "4. Tabular Binary Classification (Credit)"...   ✓ PASSED!
Testing Journey: "5. Tabular Regression (Asset Pricing)"...       ✓ PASSED!
Testing Journey: "6. Time-Series Forecasting (Retail Demand)"...  ✓ PASSED!
Testing Journey: "7. Unsupervised Customer Clustering"...         ✓ PASSED!
Testing Journey: "8. Unsupervised Anomaly Detection"...           ✓ PASSED!
Testing Journey: "9. Supervised Rare Fraud Detection"...          ✓ PASSED!
Testing Journey: "10. NLP Text Classification (Tickets)"...       ✓ PASSED!
Testing Journey: "11. Causal Inference (Campaign Uplift)"...      ✓ PASSED!
Testing Journey: "12. Specialized / Outside Implemented Scope"... ✓ PASSED!

====================================================
ALL 12 / 12 JOURNEYS PASSED SUCCESSFULLY!
====================================================
```

---

## 🛠️ Project Structure & Decoupled Architecture

```
Algorithm Genie/
├── src/
│   ├── types/
│   │   └── decision.ts              # TypeScript schemas for nodes, context, candidates, diagnostics
│   ├── engine/
│   │   ├── treeData.ts              # Declarative Decision Tree source of truth
│   │   ├── DecisionTreeEngine.ts    # State machine, history rollback, branch navigation
│   │   ├── RecommendationEngine.ts  # Algorithm candidate selection & tiering logic
│   │   ├── ValidationAdvisor.ts     # Split selection, leakage rules & statistical diagnostics
│   │   ├── RoadmapGenerator.ts      # 21-step operational roadmap compiler
│   │   ├── ScopeValidator.ts        # Scope coverage evaluator & boundary auditor
│   │   ├── DiagnosticOrchestrator.ts# Synthesis engine producing comprehensive results
│   │   └── ReportGenerator.ts       # Client-side PDF (jsPDF) & Markdown export generator
│   ├── presets/
│   │   └── testJourneys.ts          # 12 automated journey definitions
│   ├── components/
│   │   ├── Header.tsx               # Brand, journey selector, view toggle, reset
│   │   ├── SidebarSummary.tsx       # Progress indicator, diagnostic badges, rewindable trail
│   │   ├── ChatInterface.tsx        # Conversational cards, progressive disclosure, options
│   │   └── ResultsDashboard.tsx     # 5-tab results suite (Candidates, Diagnostics, Roadmap, Scope, Export)
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # React entry point
│   └── index.css                    # Tailwind CSS & custom glassmorphism styles
├── scripts/
│   └── verifyJourneys.ts            # Verification test script
├── vercel.json                      # Vercel deployment configuration
├── package.json
└── vite.config.ts                   # Vite bundler configuration (base: './')
```

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the automated test suite
npm run test:journeys

# 3. Start local development server
npm run dev

# 4. Build for production (outputs to dist/)
npm run build
```

---

## 🚢 Production Deployment

### Option A: Vercel (Recommended)
This application includes [`vercel.json`](file:///c:/Users/DELL/OneDrive/Escritorio/Git_Portfolio/Algorithm%20decision%20Tool/vercel.json) pre-configured for instant zero-config deployments.
1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and select this repository.
3. Click **Deploy**. Vercel will build the Vite bundle and deploy globally on high-speed edge CDN.

### Option B: GitHub Pages
Run the built-in deployment script:
```bash
npm run deploy
```
This compiles the application and pushes the `dist` folder to your repository's `gh-pages` branch.

---

## 📚 Technical References & Grounding

1. **Scikit-learn: Model Selection & Evaluation**: [scikit-learn.org/stable/model_selection.html](https://scikit-learn.org/stable/model_selection.html)
2. **Scikit-learn: Common Pitfalls & Data Leakage**: [scikit-learn.org/stable/common_pitfalls.html](https://scikit-learn.org/stable/common_pitfalls.html)
3. **Scikit-learn: Inspection & Interpretability**: [scikit-learn.org/stable/inspection.html](https://scikit-learn.org/stable/inspection.html)
4. **Google Machine Learning Crash Course**: [developers.google.com/machine-learning/crash-course](https://developers.google.com/machine-learning/crash-course)
5. **Google: Production ML Systems & Monitoring**: [developers.google.com/machine-learning/crash-course/production-ml-systems/monitoring](https://developers.google.com/machine-learning/crash-course/production-ml-systems/monitoring)
6. **Forecasting: Principles and Practice (Time-series Cross-Validation)**: [otexts.com/fpp3/tscv.html](https://otexts.com/fpp3/tscv.html)
7. **SHAP: Lundberg & Lee, A Unified Approach to Interpreting Model Predictions (NeurIPS 2017)**: [shap.readthedocs.io](https://shap.readthedocs.io/)

---

## 📄 License
MIT License. Built with auditable engineering standards &bull; 2026.
