import { 
  DecisionContext, 
  ImplementationRoadmapStep 
} from '../types/decision';

export class RoadmapGenerator {
  public static generateRoadmap(ctx: DecisionContext): ImplementationRoadmapStep[] {
    const isTemporal = ctx.problemFamily === 'time_series_forecasting' || ctx.dataModality === 'time_series';
    const isClustering = ctx.problemFamily === 'unsupervised_clustering';
    const isRealTime = ctx.latencyRequirement === 'ultra_low_ms';

    return [
      {
        stepNumber: 1,
        phase: 'Phase 1: Framing & Data',
        title: '1. Problem Definition & Metric Alignment',
        whatMustBeDone: 'Translate high-level business goals into a concrete mathematical loss function and establish acceptable false-positive vs false-negative trade-offs.',
        whyItMatters: 'Prevents building a mathematically accurate model that fails to deliver business value.',
        recommendedTools: ['Confluence / Notion PRD', 'Loss-Matrix Spreadsheet', 'Stakeholder Sign-off Document'],
        expectedDeliverable: 'Signed Problem Charter specifying offline decision metric, SLA, and business cost matrix.',
        gateConditionToProceed: 'Clear agreement on primary evaluation metric and error costs.'
      },
      {
        stepNumber: 2,
        phase: 'Phase 1: Framing & Data',
        title: '2. Data Inventory & Access Governance',
        whatMustBeDone: 'Audit all upstream data sources, establish read credentials, catalog schema definitions, and verify compliance (GDPR/HIPAA/PII).',
        whyItMatters: 'Guarantees that raw data can be legally accessed and continuously reproduced in production.',
        recommendedTools: ['Data Catalog (Knowledge Catalog, Amundsen)', 'SQL Warehouses (BigQuery, Snowflake)', 'dbt'],
        expectedDeliverable: 'Data Inventory Matrix detailing column definitions, refresh cadences, and PII classifications.',
        gateConditionToProceed: 'Verified read access to production raw event logs without manual intervention.'
      },
      {
        stepNumber: 3,
        phase: 'Phase 1: Framing & Data',
        title: '3. Data Quality & Missingness Assessment',
        whatMustBeDone: 'Profile raw tables for null rates, duplicates, cardinality, outliers, and classify missing data mechanisms into MCAR, MAR, or MNAR.',
        whyItMatters: 'Unprincipled data cleaning destroys genuine signal and leads to garbage-in, garbage-out models.',
        recommendedTools: ['Great Expectations', 'ydata-profiling', 'Pandas / Polars', 'dbt test'],
        expectedDeliverable: 'Automated Data Quality Profiling Report and Missingness Diagnostic Summary.',
        gateConditionToProceed: 'Zero unexplained duplicate keys; missingness mechanism identified for all key predictors.'
      },
      {
        stepNumber: 4,
        phase: 'Phase 1: Framing & Data',
        title: '4. Ground Truth Labeling & Reliability Audit',
        whatMustBeDone: isClustering 
          ? 'Establish domain criteria and proxy validation rules for evaluating future cluster utility.'
          : 'Audit historical ground truth labels for ambiguity, measure inter-annotator agreement (Cohen’s Kappa), and resolve label lag.',
        whyItMatters: 'Models cannot exceed the quality of their ground-truth supervision; noisy labels cap model performance.',
        recommendedTools: ['Label Studio', 'Cleanlab (Confident Learning)', 'Prodigy'],
        expectedDeliverable: 'Labeling Guidelines Documentation and verified benchmark ground-truth test set.',
        gateConditionToProceed: 'Inter-annotator agreement Kappa > 0.80 or audited gold-standard benchmark created.'
      },
      {
        stepNumber: 5,
        phase: 'Phase 1: Framing & Data',
        title: '5. Exploratory Data Analysis (EDA)',
        whatMustBeDone: 'Inspect univariate distributions, bivariate correlations, temporal trends, categorical cardinality, and check for target leakage.',
        whyItMatters: 'Uncovers non-linear relationships, informs feature transformations, and detects lookahead bias before modeling.',
        recommendedTools: ['Seaborn', 'Plotly', 'Sweetviz', 'Statsmodels'],
        expectedDeliverable: 'Jupyter / Colab EDA notebook summarizing top correlations and potential data pitfalls.',
        gateConditionToProceed: 'All suspicious correlation anomalies (> 0.95 with target) verified to ensure no target leakage.'
      },
      {
        stepNumber: 6,
        phase: 'Phase 1: Framing & Data',
        title: '6. Data Cleaning & Principled Preprocessing',
        whatMustBeDone: 'Implement deterministic pipelines for type casting, outlier capping (Winsorization), and missing value imputation based on MAR/MNAR diagnosis.',
        whyItMatters: 'Ensures reproducible preprocessing that behaves identically during batch inference or real-time serving.',
        recommendedTools: ['Scikit-learn ColumnTransformer', 'IterativeImputer', 'Polars'],
        expectedDeliverable: 'Reusable Sklearn Pipeline object transforming raw records into cleaned feature matrices.',
        gateConditionToProceed: 'Pipeline runs end-to-end without throwing exceptions on unseen dirty test batches.'
      },
      {
        stepNumber: 7,
        phase: 'Phase 1: Framing & Data',
        title: '7. Feature Engineering & Temporal Safeguards',
        whatMustBeDone: isTemporal 
          ? 'Construct lag features, rolling window averages, exponential moving statistics, and calendar cyclical encodings (sin/cos).'
          : 'Construct domain interaction terms, ratio features, target encodings with out-of-fold regularization, and frequency encodings.',
        whyItMatters: 'Feature engineering is the single highest leverage activity for improving tabular model accuracy.',
        recommendedTools: ['Feature-engine', 'Scikit-learn', 'tsfresh (if time-series)'],
        expectedDeliverable: 'Engineered Feature Store schema with point-in-time calculation timestamps.',
        gateConditionToProceed: 'Every feature verified to be available strictly before the prediction timestamp.'
      },
      {
        stepNumber: 8,
        phase: 'Phase 2: Modeling & Validation',
        title: '8. Validation Split Strategy Implementation',
        whatMustBeDone: isTemporal
          ? 'Implement TimeSeriesSplit / Rolling-Origin CV; enforce chronological train-before-test ordering.'
          : 'Implement StratifiedKFold or GroupKFold; isolate preprocessing fits strictly inside fold loops.',
        whyItMatters: 'Flawed validation splits produce overly optimistic offline scores that crash when deployed to production.',
        recommendedTools: ['Scikit-learn Model Selection', 'NestedCV Pipelines'],
        expectedDeliverable: 'Cross-validation splitting generator script with leak-free transformation guarantees.',
        gateConditionToProceed: 'Zero entity or temporal leakage verified across train and validation folds.'
      },
      {
        stepNumber: 9,
        phase: 'Phase 2: Modeling & Validation',
        title: '9. Baseline Model Construction',
        whatMustBeDone: 'Train the recommended baseline (e.g. Regularized Logistic/Linear Regression or Seasonal Naive) with minimal tuning.',
        whyItMatters: 'Provides the critical hurdle that any complex machine learning algorithm must decisively beat to justify its existence.',
        recommendedTools: ['Scikit-learn DummyClassifier / Ridge / LogisticRegression', 'Statsmodels'],
        expectedDeliverable: 'Benchmark performance scorecard with baseline execution latency and error metrics.',
        gateConditionToProceed: 'Baseline score logged to experiment tracker.'
      },
      {
        stepNumber: 10,
        phase: 'Phase 2: Modeling & Validation',
        title: '10. Candidate Model Training',
        whatMustBeDone: 'Train primary and alternative algorithm candidates (e.g. LightGBM, CatBoost, XGBoost, EBM) on identical cross-validation splits.',
        whyItMatters: 'Compares different inductive biases (bagging vs boosting vs additive models) fairly.',
        recommendedTools: ['LightGBM', 'XGBoost', 'CatBoost', 'InterpretML'],
        expectedDeliverable: 'Trained model artifacts and comparative fold score distributions.',
        gateConditionToProceed: 'At least one candidate model beats the baseline with statistical significance.'
      },
      {
        stepNumber: 11,
        phase: 'Phase 2: Modeling & Validation',
        title: '11. Hyperparameter Optimization',
        whatMustBeDone: 'Run Bayesian optimization over tree depth, learning rate, regularization (L1/L2), subsample ratio, and minimum leaf samples.',
        whyItMatters: 'Extracts optimal performance while penalizing model complexity to prevent overfitting.',
        recommendedTools: ['Optuna', 'Scikit-optimize'],
        expectedDeliverable: 'Optuna study database containing hyperparameter importance plots and best parameter dictionary.',
        gateConditionToProceed: 'Cross-validation score plateaus; validation curves show healthy training-validation gap.'
      },
      {
        stepNumber: 12,
        phase: 'Phase 2: Modeling & Validation',
        title: '12. Rigorous Model Evaluation & Threshold Tuning',
        whatMustBeDone: 'Calculate PR-AUC, Brier score, and optimize decision threshold against the business cost-utility matrix.',
        whyItMatters: 'The default 0.5 classification threshold is almost never optimal for business objectives with asymmetric error costs.',
        recommendedTools: ['Scikit-learn metrics', 'Cost-Curve Visualizer'],
        expectedDeliverable: 'Calibrated Decision Threshold Recommendation with expected cost-savings estimate.',
        gateConditionToProceed: 'Optimal threshold verified on held-out test set.'
      },
      {
        stepNumber: 13,
        phase: 'Phase 2: Modeling & Validation',
        title: '13. Statistical Assumption & Robustness Diagnostics',
        whatMustBeDone: 'Execute formal diagnostic suite: VIF multicollinearity, calibration curves, residual plots, and stress-test on perturbed data.',
        whyItMatters: 'Confirms that model behavior satisfies operating requirements and will not fail catastrophically under edge cases.',
        recommendedTools: ['Statsmodels', 'Scikit-learn calibration', 'Robustness Testing Framework'],
        expectedDeliverable: 'Statistical Diagnostic Report documenting diagnostic tests, p-values, and remediation steps.',
        gateConditionToProceed: 'All critical diagnostic criteria satisfied or remediated.'
      },
      {
        stepNumber: 14,
        phase: 'Phase 2: Modeling & Validation',
        title: '14. Model Explainability & Interpretability',
        whatMustBeDone: 'Compute SHAP values (TreeExplainer), Permutation Feature Importance, and Partial Dependence Plots for key features.',
        whyItMatters: 'Validates that the model relies on sensible business drivers and provides compliance auditing capabilities.',
        recommendedTools: ['SHAP', 'InterpretML', 'DALEX'],
        expectedDeliverable: 'Global Feature Summary Bar Plot and Local Prediction Explainer widget.',
        gateConditionToProceed: 'Domain stakeholders review and approve top feature relationships.'
      },
      {
        stepNumber: 15,
        phase: 'Phase 3: Production & Governance',
        title: '15. Final Model Selection & Governance Review',
        whatMustBeDone: 'Weigh accuracy gains against inference latency, memory footprint, explainability, and maintenance overhead.',
        whyItMatters: 'A 0.5% higher AUC is not worth a 50x increase in cloud infrastructure costs or loss of interpretability.',
        recommendedTools: ['Model Governance Checklist', 'Model Card Documentation Template'],
        expectedDeliverable: 'Comprehensive Model Card detailing intended use, limitations, biases, and chosen architecture.',
        gateConditionToProceed: 'Formal sign-off by engineering, product, and compliance leaders.'
      },
      {
        stepNumber: 16,
        phase: 'Phase 3: Production & Governance',
        title: '16. Model Serialization & Runtime Packaging',
        whatMustBeDone: 'Export trained model and preprocessing pipeline into production-grade immutable artifacts (ONNX or Treelite for fast CPU inference).',
        whyItMatters: 'Standard pickle files are security hazards and can break across minor library version differences.',
        recommendedTools: ['ONNX Runtime', 'Treelite (for ultra-fast GBDT C++ compilation)', 'Joblib'],
        expectedDeliverable: 'Versioned model artifact file (model.onnx) registered in Model Registry (MLflow/Vertex AI).',
        gateConditionToProceed: 'Numerical equivalence check: ONNX output matches Python pipeline within 1e-5 tolerance.'
      },
      {
        stepNumber: 17,
        phase: 'Phase 3: Production & Governance',
        title: '17. Serving Interface Development',
        whatMustBeDone: isRealTime 
          ? 'Build a high-performance async REST API with request schema validation, health checks, and sub-20ms P99 latency.'
          : 'Implement automated batch inference job triggered via cron or orchestrator reading from SQL tables.',
        whyItMatters: 'Connects the trained model artifact to downstream business consumers and user applications.',
        recommendedTools: isRealTime 
          ? ['FastAPI with Pydantic v2', 'Uvicorn', 'Gunicorn']
          : ['Airflow / Dagster', 'dbt-Python', 'SQL Scheduled Queries'],
        expectedDeliverable: 'Production serving code repository with health endpoints and request/response logging.',
        gateConditionToProceed: 'Automated load test confirms API passes throughput and SLA requirements.'
      },
      {
        stepNumber: 18,
        phase: 'Phase 3: Production & Governance',
        title: '18. Automated Testing & Shadow Deployment',
        whatMustBeDone: 'Deploy model in Shadow Mode: mirror live production traffic and compare model predictions against existing systems without taking live action.',
        whyItMatters: 'Safely surfaces runtime bugs, memory leaks, and input schema mismatches with zero business risk.',
        recommendedTools: ['Pytest', 'Locust (load testing)', 'Envoy / Istio (traffic mirroring)'],
        expectedDeliverable: 'Shadow Run Audit Report comparing live latency and prediction distribution against offline test sets.',
        gateConditionToProceed: 'Shadow mode runs for 7 continuous days with 0 runtime crashes and expected distributions.'
      },
      {
        stepNumber: 19,
        phase: 'Phase 3: Production & Governance',
        title: '19. Production Deployment & Canary Rollout',
        whatMustBeDone: 'Package serving application into a Docker container and initiate a Canary rollout (10% -> 25% -> 50% -> 100% of live traffic).',
        whyItMatters: 'Enables instant rollback if unexpected edge cases cause production errors.',
        recommendedTools: ['Docker', 'Kubernetes / Cloud Run', 'GitHub Actions CI/CD'],
        expectedDeliverable: 'Containerized deployment with automated blue-green or canary release pipeline.',
        gateConditionToProceed: 'Canary phase exhibits normal error rates and expected business conversion.'
      },
      {
        stepNumber: 20,
        phase: 'Phase 3: Production & Governance',
        title: '20. Live Observability & Drift Monitoring',
        whatMustBeDone: 'Set up real-time telemetry tracking input data drift (Kolmogorov-Smirnov / PSI), prediction drift, missing feature spikes, and latency.',
        whyItMatters: 'Models degrade silently over time as real-world consumer behavior evolves (concept drift).',
        recommendedTools: ['Evidently AI', 'Prometheus & Grafana', 'Whylogs', 'Datadog'],
        expectedDeliverable: 'Real-time Monitoring Dashboard with automated Slack / PagerDuty alerts for drift.',
        gateConditionToProceed: 'Alert triggers tested and verified by engineering on-call team.'
      },
      {
        stepNumber: 21,
        phase: 'Phase 3: Production & Governance',
        title: '21. Automated Retraining & Continuous Maintenance',
        whatMustBeDone: 'Define automated retraining triggers (scheduled monthly or performance-threshold triggered) and model retirement protocol.',
        whyItMatters: 'Prevents model obsolescence and guarantees perpetual alignment with changing data distributions.',
        recommendedTools: ['Airflow / Kubeflow Pipelines', 'MLflow / Vertex AI Pipelines'],
        expectedDeliverable: 'End-to-end automated retraining pipeline with automatic champion/challenger evaluation.',
        gateConditionToProceed: 'Retraining DAG successfully executed in staging environment.'
      }
    ];
  }
}
