export interface TestJourney {
  id: string;
  title: string;
  category: string;
  description: string;
  expectedResult: string;
  optionSequence: string[];
}

export const TEST_JOURNEYS: TestJourney[] = [
  {
    id: 'journey_no_ml',
    title: '1. Business Rules / No ML Needed',
    category: 'Stage 1: ML Necessity',
    description: 'User has clear, deterministic business logic where simple SQL or expert rules solve the problem without ML complexity.',
    expectedResult: 'Terminal recommendation for Rule Engine / SQL Heuristics with explanation of why ML would add unnecessary operational debt.',
    optionSequence: ['opt_predict_cat', 'opt_rules_sufficient']
  },
  {
    id: 'journey_no_data',
    title: '2. No Available Data',
    category: 'Stage 2: Data Readiness',
    description: 'User wants predictive AI but has not collected or logged historical data yet.',
    expectedResult: 'Data Readiness "NOT READY" with data ingestion & schema logging roadmap before model selection.',
    optionSequence: ['opt_predict_val', 'opt_rules_inadequate', 'opt_usage_batch_pipeline', 'opt_moderate_cost', 'opt_modality_none']
  },
  {
    id: 'journey_unreliable_labels',
    title: '3. Unreliable / Noisy Labels',
    category: 'Stage 2: Data Readiness',
    description: 'Supervised classification where historical labels were subjectively assigned with high annotator disagreement.',
    expectedResult: 'Data Readiness "CONDITIONALLY READY" with Confident Learning (Cleanlab), label auditing, and noise-robust loss functions.',
    optionSequence: [
      'opt_predict_cat',
      'opt_rules_inadequate',
      'opt_usage_internal',
      'opt_critical_high_cost',
      'opt_modality_tabular',
      'opt_size_medium',
      'opt_features_low',
      'opt_labels_complete',
      'opt_labels_noisy',
      'opt_quality_clean',
      'opt_leakage_safe',
      'opt_fam_binary_class',
      'opt_imb_moderate',
      'opt_exp_strict'
    ]
  },
  {
    id: 'journey_tabular_binary',
    title: '4. Tabular Binary Classification (Credit/Churn)',
    category: 'Stage 3: Supervised Tabular',
    description: 'Moderate sample size tabular dataset predicting loan default with severe cost of false negatives and strict regulatory auditing.',
    expectedResult: 'Recommends L2 Logistic Regression (Baseline), Explainable Boosting Machine / LightGBM (Primary), Stratified K-Fold CV, and PR-AUC/Brier metrics.',
    optionSequence: [
      'opt_predict_cat',
      'opt_rules_inadequate',
      'opt_usage_automated_realtime',
      'opt_critical_high_cost',
      'opt_modality_tabular',
      'opt_size_medium',
      'opt_features_low',
      'opt_labels_complete',
      'opt_labels_high_quality',
      'opt_quality_clean',
      'opt_leakage_safe',
      'opt_fam_binary_class',
      'opt_imb_extreme',
      'opt_exp_strict'
    ]
  },
  {
    id: 'journey_tabular_regression',
    title: '5. Tabular Regression (Sales / Asset Pricing)',
    category: 'Stage 3: Supervised Tabular',
    description: 'Predicting continuous house/asset pricing with tabular features, non-linear interactions, and right-skewed values.',
    expectedResult: 'Recommends Ridge/ElasticNet (Baseline), CatBoost/XGBoost Regressor (Primary), Random Forest (Alternative), Repeated K-Fold CV, and RMSE/WAPE metrics.',
    optionSequence: [
      'opt_predict_val',
      'opt_rules_inadequate',
      'opt_usage_batch_pipeline',
      'opt_moderate_cost',
      'opt_modality_tabular',
      'opt_size_large',
      'opt_features_low',
      'opt_labels_complete',
      'opt_labels_high_quality',
      'opt_quality_clean',
      'opt_leakage_safe',
      'opt_fam_regression',
      'opt_reg_skewed',
      'opt_exp_business'
    ]
  },
  {
    id: 'journey_time_series',
    title: '6. Time-Series Forecasting (Energy / Retail)',
    category: 'Stage 3: Temporal Forecasting',
    description: 'Forecasting multi-entity store demand with seasonality, trend, and external promotional covariates.',
    expectedResult: 'Strict prohibition of random k-fold splitting; recommends Rolling-Origin CV, Seasonal Naive/ETS (Baseline), LightGBM with lag features (Primary), and MASE/WAPE metrics.',
    optionSequence: [
      'opt_forecast_time',
      'opt_rules_inadequate',
      'opt_usage_batch_pipeline',
      'opt_moderate_cost',
      'opt_modality_timeseries',
      'opt_size_large',
      'opt_features_low',
      'opt_labels_complete',
      'opt_labels_high_quality',
      'opt_quality_clean',
      'opt_leakage_safe',
      'opt_fam_time_series',
      'opt_ts_multiple_exogenous',
      'opt_exp_business'
    ]
  },
  {
    id: 'journey_clustering',
    title: '7. Unsupervised Customer Clustering',
    category: 'Stage 3: Unsupervised Learning',
    description: 'Discovering natural customer behavioral cohorts without historical target labels, with arbitrary densities and noise.',
    expectedResult: 'Recommends K-Means++ with Scaled Features (Baseline), HDBSCAN (Primary), Silhouette analysis, Hopkins statistic check, and stability bootstrapping.',
    optionSequence: [
      'opt_segment_cluster',
      'opt_rules_inadequate',
      'opt_usage_internal',
      'opt_moderate_cost',
      'opt_modality_tabular',
      'opt_size_medium',
      'opt_features_low',
      'opt_labels_none',
      'opt_quality_clean',
      'opt_leakage_safe',
      'opt_fam_clustering',
      'opt_cluster_density_noise',
      'opt_exp_business'
    ]
  },
  {
    id: 'journey_anomaly_unsupervised',
    title: '8. Unsupervised Anomaly Detection',
    category: 'Stage 3: Anomaly Detection',
    description: 'Detecting network intrusions or equipment failures with zero historical ground-truth anomaly labels.',
    expectedResult: 'Recommends Isolation Forest (Baseline), Local Outlier Factor (Primary), and Deep Autoencoder (Advanced) with explicit warning about false alarm rates.',
    optionSequence: [
      'opt_detect_anomalies',
      'opt_rules_inadequate',
      'opt_usage_automated_realtime',
      'opt_moderate_cost',
      'opt_modality_tabular',
      'opt_size_medium',
      'opt_features_low',
      'opt_labels_none',
      'opt_quality_clean',
      'opt_leakage_safe',
      'opt_fam_anomaly',
      'opt_anom_unsupervised',
      'opt_exp_business'
    ]
  },
  {
    id: 'journey_anomaly_supervised',
    title: '9. Supervised Rare Fraud Detection',
    category: 'Stage 3: Anomaly Detection',
    description: 'Detecting financial payment fraud where confirmed past fraud cases are labeled (0.2% positive base rate).',
    expectedResult: 'Recommends Balanced Logistic Regression (Baseline), XGBoost with scale_pos_weight & Focal Loss (Primary), Out-of-Time CV, and PR-AUC.',
    optionSequence: [
      'opt_detect_anomalies',
      'opt_rules_inadequate',
      'opt_usage_automated_realtime',
      'opt_critical_high_cost',
      'opt_modality_tabular',
      'opt_size_large',
      'opt_features_low',
      'opt_labels_complete',
      'opt_labels_high_quality',
      'opt_quality_clean',
      'opt_leakage_safe',
      'opt_fam_anomaly',
      'opt_anom_supervised',
      'opt_exp_strict'
    ]
  },
  {
    id: 'journey_nlp_text',
    title: '10. NLP Text Classification (Support Tickets)',
    category: 'Stage 3: Natural Language Processing',
    description: 'Classifying incoming customer inquiries into routing categories under tight CPU latency budget (< 10ms).',
    expectedResult: 'Recommends TF-IDF with Linear SVM / Logistic Regression (Baseline) and DistilBERT/FastText (Primary), Macro-F1 metric, and token importance.',
    optionSequence: [
      'opt_predict_cat',
      'opt_rules_inadequate',
      'opt_usage_automated_realtime',
      'opt_moderate_cost',
      'opt_modality_text',
      'opt_size_medium',
      'opt_features_low',
      'opt_labels_complete',
      'opt_labels_high_quality',
      'opt_quality_clean',
      'opt_leakage_safe',
      'opt_fam_nlp',
      'opt_nlp_fast_cpu',
      'opt_exp_business'
    ]
  },
  {
    id: 'journey_causal_inference',
    title: '11. Causal Inference (Marketing Campaign Effect)',
    category: 'Stage 3: Causal Identification',
    description: 'Determining the actual incremental revenue caused by sending a promotional discount using observational data with confounders.',
    expectedResult: 'Explicitly distinguishes predictive correlation from causal identification; recommends OLS with Covariates (Baseline), Double Machine Learning / Causal Forest (Primary), and Covariate Balance checks.',
    optionSequence: [
      'opt_causal_effect',
      'opt_rules_inadequate',
      'opt_usage_internal',
      'opt_moderate_cost',
      'opt_modality_tabular',
      'opt_size_medium',
      'opt_features_low',
      'opt_labels_complete',
      'opt_labels_high_quality',
      'opt_quality_clean',
      'opt_leakage_safe',
      'opt_fam_causal',
      'opt_causal_observational',
      'opt_exp_strict'
    ]
  },
  {
    id: 'journey_out_of_scope',
    title: '12. Specialized / Outside Implemented Scope',
    category: 'Stage 11: Scope Limitations',
    description: 'User mentions complex Physics-Informed Neural Networks, Quantum ML, or multi-node distributed LLM training.',
    expectedResult: 'Flags as OUTSIDE IMPLEMENTED SCOPE with scientific transparency, explaining why automated trees cannot reliably recommend custom PDE/HPC architectures.',
    optionSequence: ['opt_advanced_specialized']
  }
];
