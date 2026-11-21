import { DiagnosticNode } from '../types/decision';

export const DECISION_TREE_NODES: Record<string, DiagnosticNode> = {
  // ==========================================
  // STAGE 1: ML NECESSITY & OBJECTIVE FRAMING
  // ==========================================
  'q1_objective': {
    id: 'q1_objective',
    stage: 'stage_1_ml_necessity',
    stageName: 'Stage 1: Objective & ML Necessity',
    question: 'What is your primary analytical or business objective?',
    whyItMatters: {
      simple: 'Clarifying what outcome you want prevents building the wrong tool and immediately rules out unsuitable methods.',
      technical: 'Mathematical framing depends strictly on the target output space: conditional expectations E[Y|X], density estimation p(X), causal estimands E[Y(1) - Y(0)], or sequential policy optimization.'
    },
    options: [
      {
        id: 'opt_predict_val',
        label: 'Predict a numeric continuous value (e.g. price, sales demand, temperature, duration)',
        description: 'Target is a quantity on a continuous scale.',
        nextNodeId: 'q2_ml_necessity',
        contextUpdates: {
          objectiveType: 'numeric_prediction',
          targetVariableType: 'continuous'
        }
      },
      {
        id: 'opt_predict_cat',
        label: 'Predict a category, outcome, or discrete class (e.g. churn, fraud, diagnosis, ticket type)',
        description: 'Target is discrete categories or probabilistic class membership.',
        nextNodeId: 'q2_ml_necessity',
        contextUpdates: {
          objectiveType: 'classification'
        }
      },
      {
        id: 'opt_forecast_time',
        label: 'Forecast future sequence over time (e.g. next month energy load, inventory demand)',
        description: 'Observations have sequential temporal order where future values depend on past history.',
        nextNodeId: 'q2_ml_necessity',
        contextUpdates: {
          objectiveType: 'forecasting',
          dataModality: 'time_series'
        }
      },
      {
        id: 'opt_segment_cluster',
        label: 'Discover hidden customer or product segments without existing labels',
        description: 'Unsupervised grouping based on feature similarity geometry.',
        nextNodeId: 'q2_ml_necessity',
        contextUpdates: {
          objectiveType: 'clustering',
          labelAvailability: 'no_labels'
        }
      },
      {
        id: 'opt_detect_anomalies',
        label: 'Detect rare anomalies, outliers, or suspicious activities',
        description: 'Identify data points that deviate significantly from expected normal behavior.',
        nextNodeId: 'q2_ml_necessity',
        contextUpdates: {
          objectiveType: 'anomaly_detection'
        }
      },
      {
        id: 'opt_recommend_items',
        label: 'Recommend personalized products, content, or next actions to users',
        description: 'Matching user preferences, interactions, or item metadata.',
        nextNodeId: 'q2_ml_necessity',
        contextUpdates: {
          objectiveType: 'recommendations'
        }
      },
      {
        id: 'opt_causal_effect',
        label: 'Measure the causal effect of an intervention or policy (e.g. discount impact, medical treatment)',
        description: 'Estimating counterfactuals: what would happen if we intervene vs what happened without intervention.',
        nextNodeId: 'q2_ml_necessity',
        contextUpdates: {
          objectiveType: 'causal_inference'
        }
      },
      {
        id: 'opt_sequential_decisions',
        label: 'Optimize sequential actions via feedback and rewards (e.g. dynamic pricing, robotics, gaming)',
        description: 'System interacts with an environment, takes actions, and learns from delayed rewards.',
        nextNodeId: 'q2_ml_necessity',
        contextUpdates: {
          objectiveType: 'reinforcement_learning'
        }
      },
      {
        id: 'opt_advanced_specialized',
        label: 'Complex specialized domain (e.g. Physics-Informed ML, Federated Learning, Massive Graph)',
        description: 'Advanced domains requiring dedicated non-standard research architectures.',
        nextNodeId: 'terminal_out_of_scope',
        contextUpdates: {
          scopeCoverage: 'outside_scope',
          outOfScopeReason: 'Specialized domain requiring custom physics/federated/hardware-specific co-design.'
        }
      }
    ],
    technicalConsiderations: [
      'Do not conflate prediction P(Y|X) with causal intervention P(Y|do(X)).',
      'Distinguish static cross-sectional prediction from non-stationary time-series processes.'
    ]
  },

  'q2_ml_necessity': {
    id: 'q2_ml_necessity',
    stage: 'stage_1_ml_necessity',
    stageName: 'Stage 1: Objective & ML Necessity',
    question: 'Could this problem be solved effectively with simpler non-ML approaches (e.g. business rules, SQL queries, or heuristics)?',
    whyItMatters: {
      simple: 'Machine Learning adds significant technical debt, maintenance cost, and opacity. If a simple rule or calculation solves 90% of the problem, ML is unnecessary.',
      technical: 'Occams razor in production systems: deterministic heuristics have zero training cost, zero data drift failure modes, perfect interpretability, and microsecond latencies.'
    },
    options: [
      {
        id: 'opt_rules_sufficient',
        label: 'Yes — Clear, deterministic business logic or SQL thresholds already solve this accurately',
        description: 'The relationships are known, finite, and can be maintained by domain experts.',
        nextNodeId: 'terminal_no_ml_needed',
        contextUpdates: {
          mlNecessity: 'heuristics_better',
          problemFamily: 'no_ml_needed'
        }
      },
      {
        id: 'opt_rules_inadequate',
        label: 'No — Complex non-linear patterns, millions of interactions, or unknown mathematical mapping',
        description: 'Rules are too brittle, edge cases are overwhelming, or manual heuristics fail.',
        nextNodeId: 'q3_model_usage',
        contextUpdates: {
          mlNecessity: 'ml_justified'
        }
      },
      {
        id: 'opt_rules_uncertain',
        label: 'I am not sure — We have some rules today, but they are degrading or hard to scale',
        description: 'Exploratory need to compare a rules-based baseline against an empirical ML baseline.',
        nextNodeId: 'q3_model_usage',
        contextUpdates: {
          mlNecessity: 'ml_justified'
        }
      }
    ]
  },

  'q3_model_usage': {
    id: 'q3_model_usage',
    stage: 'stage_1_ml_necessity',
    stageName: 'Stage 1: Objective & ML Necessity',
    question: 'How and where will this model be used in operations?',
    whyItMatters: {
      simple: 'A model used to guide quarterly executive decisions has completely different speed and safety requirements than an automated API approving transactions in 15 milliseconds.',
      technical: 'Production operating constraints (SLA latency, fault tolerance, regulatory compliance, inference cost) dictate model family selection regardless of offline test AUC.'
    },
    options: [
      {
        id: 'opt_usage_internal',
        label: 'Internal decision support / periodic reporting (human-in-the-loop, offline or daily)',
        description: 'Batch predictions; high interpretability is critical so analysts can audit recommendations.',
        nextNodeId: 'q3b_constraints',
        contextUpdates: {
          modelUsage: 'internal_decision',
          latencyRequirement: 'batch_no_hurry',
          interpretabilityRequirement: 'high_business_trust'
        }
      },
      {
        id: 'opt_usage_automated_realtime',
        label: 'Customer-facing automated API (real-time, strict SLA < 50ms, high throughput)',
        description: 'Live production inference where latency and high availability are top priorities.',
        nextNodeId: 'q3b_constraints',
        contextUpdates: {
          modelUsage: 'customer_facing_realtime',
          latencyRequirement: 'ultra_low_ms'
        }
      },
      {
        id: 'opt_usage_batch_pipeline',
        label: 'Automated batch pipeline (e.g. overnight score generation, weekly forecasts)',
        description: 'Runs offline over large tables; throughput matters more than millisecond latency.',
        nextNodeId: 'q3b_constraints',
        contextUpdates: {
          modelUsage: 'batch_predictions',
          latencyRequirement: 'batch_no_hurry'
        }
      },
      {
        id: 'opt_usage_research_scientific',
        label: 'Scientific research or exploratory discovery (accuracy, hypothesis generation, insights)',
        description: 'Priority is statistical rigor, diagnostics, and uncovering latent structure.',
        nextNodeId: 'q3b_constraints',
        contextUpdates: {
          modelUsage: 'scientific_research',
          interpretabilityRequirement: 'high_business_trust'
        }
      }
    ]
  },

  'q3b_constraints': {
    id: 'q3b_constraints',
    stage: 'stage_1_ml_necessity',
    stageName: 'Stage 1: Objective & ML Necessity',
    question: 'What are the cost of errors and regulatory constraints for this use case?',
    whyItMatters: {
      simple: 'If a wrong prediction carries immense financial or legal risk, black-box algorithms without calibrated uncertainty are unacceptable.',
      technical: 'Asymmetric loss functions (Cost(FN) >> Cost(FP)), strict auditing (Equal Credit Opportunity Act, GDPR right-to-explanation), and compute budgets fundamentally constrain algorithm search space.'
    },
    options: [
      {
        id: 'opt_critical_high_cost',
        label: 'High critical risk & strict regulation (e.g. medical, lending credit, legal compliance)',
        description: 'Strict auditability required; false negatives or false positives carry catastrophic penalties.',
        nextNodeId: 'q4_data_modality',
        contextUpdates: {
          costOfErrors: 'high_critical',
          interpretabilityRequirement: 'strict_regulatory'
        }
      },
      {
        id: 'opt_moderate_cost',
        label: 'Moderate business risk (e.g. churn prevention, dynamic marketing, demand planning)',
        description: 'Errors cost money but are not life-threatening or heavily penalized by legal authorities.',
        nextNodeId: 'q4_data_modality',
        contextUpdates: {
          costOfErrors: 'moderate',
          interpretabilityRequirement: 'moderate'
        }
      },
      {
        id: 'opt_low_cost',
        label: 'Low risk / exploratory (e.g. movie recommendation, feed ranking, draft tagging)',
        description: 'User experience tolerates imperfections; maximum predictive power preferred.',
        nextNodeId: 'q4_data_modality',
        contextUpdates: {
          costOfErrors: 'low',
          interpretabilityRequirement: 'black_box_acceptable'
        }
      }
    ]
  },

  // ==========================================
  // STAGE 2: DATA AVAILABILITY & READINESS
  // ==========================================
  'q4_data_modality': {
    id: 'q4_data_modality',
    stage: 'stage_2_data_readiness',
    stageName: 'Stage 2: Data Readiness Assessment',
    question: 'What data modality do you currently have available?',
    whyItMatters: {
      simple: 'Different types of data (spreadsheets vs photos vs text) require completely different algorithms and preprocessing pipelines.',
      technical: 'Inductive biases of models match representation geometry: tabular data benefits from decision trees and gradient boosting, text requires tokenized transformers, images require 2D/3D convolutions or patch attention.'
    },
    options: [
      {
        id: 'opt_modality_tabular',
        label: 'Structured tabular dataset (rows and columns in SQL, CSV, or parquet)',
        description: 'Numerical and categorical features representing entities or transactions.',
        nextNodeId: 'q5_sample_size',
        contextUpdates: {
          dataModality: 'tabular'
        }
      },
      {
        id: 'opt_modality_text',
        label: 'Natural Language Text (emails, customer reviews, support tickets, articles)',
        description: 'Unstructured text passages in one or more languages.',
        nextNodeId: 'q5_sample_size',
        contextUpdates: {
          dataModality: 'text'
        }
      },
      {
        id: 'opt_modality_timeseries',
        label: 'Timestamped sequential series (uniform or irregular time intervals)',
        description: 'Measurements ordered by time with temporal dependencies.',
        nextNodeId: 'q5_sample_size',
        contextUpdates: {
          dataModality: 'time_series'
        }
      },
      {
        id: 'opt_modality_images',
        label: 'Images or Computer Vision data (photos, scans, satellite imagery)',
        description: 'Pixel arrays requiring spatial feature extraction.',
        nextNodeId: 'q5_sample_size',
        contextUpdates: {
          dataModality: 'image'
        }
      },
      {
        id: 'opt_modality_none',
        label: 'I do not have data yet (or only have a few speculative samples)',
        description: 'No existing historical data has been collected or logged.',
        nextNodeId: 'terminal_no_data',
        contextUpdates: {
          dataModality: 'no_data',
          dataReadinessStatus: 'not_ready',
          problemFamily: 'no_data'
        }
      }
    ]
  },

  'q5_sample_size': {
    id: 'q5_sample_size',
    stage: 'stage_2_data_readiness',
    stageName: 'Stage 2: Data Readiness Assessment',
    question: 'Approximately how many observations (rows/samples) do you have available?',
    whyItMatters: {
      simple: 'Small datasets cannot support highly complex models without severe overfitting. There is no single magic row number, but sample size relative to complexity is critical.',
      technical: 'Sample complexity vs VC dimension: deep neural networks and wide gradient boosting ensembles with millions of parameters require sufficient statistical power, whereas small N demands regularized linear models or empirical Bayes.'
    },
    options: [
      {
        id: 'opt_size_tiny',
        label: 'Fewer than 1,000 observations (Small sample)',
        description: 'High risk of overfitting; requires strong regularization, cross-validation, and parsimonious models.',
        nextNodeId: 'q5b_features',
        contextUpdates: {
          observationCount: 'tiny_under_1k'
        }
      },
      {
        id: 'opt_size_medium',
        label: '1,000 to 50,000 observations (Moderate sample)',
        description: 'Sweet spot for tree-based algorithms, regularized linear models, and standard machine learning.',
        nextNodeId: 'q5b_features',
        contextUpdates: {
          observationCount: 'medium_10k_100k'
        }
      },
      {
        id: 'opt_size_large',
        label: '50,000 to 1,000,000+ observations (Substantial sample)',
        description: 'Ample power for gradient boosting, neural architectures, and complex non-linear interactions.',
        nextNodeId: 'q5b_features',
        contextUpdates: {
          observationCount: 'large_100k_1m'
        }
      }
    ]
  },

  'q5b_features': {
    id: 'q5b_features',
    stage: 'stage_2_data_readiness',
    stageName: 'Stage 2: Data Readiness Assessment',
    question: 'How many features (variables / columns) are present relative to the observations?',
    whyItMatters: {
      simple: 'When you have more columns than rows, models easily pick up random noise. This is called the "curse of dimensionality".',
      technical: 'High-dimensional regime (p > n or p ≈ n) requires L1 sparsity (Lasso), Ridge shrinkage, PCA/SVD projection, or ensemble subsampling to prevent rank deficiency and severe variance inflation.'
    },
    options: [
      {
        id: 'opt_features_low',
        label: 'Standard ratio (10 to 50 features, with ample observations: n >> p)',
        description: 'Favorable statistical power; traditional algorithms perform stably.',
        nextNodeId: 'q6_labels',
        contextUpdates: {
          featureCount: 'few_under_20'
        }
      },
      {
        id: 'opt_features_high',
        label: 'High dimensionality (Hundreds to thousands of features: p is large)',
        description: 'Risk of multicollinearity, overfitting, and computational slowdown; feature selection required.',
        nextNodeId: 'q6_labels',
        contextUpdates: {
          featureCount: 'high_100_1000'
        }
      }
    ]
  },

  'q6_labels': {
    id: 'q6_labels',
    stage: 'stage_2_data_readiness',
    stageName: 'Stage 2: Data Readiness Assessment',
    question: 'Do you have historical target labels or ground truth for the outcome you want to predict?',
    whyItMatters: {
      simple: 'Supervised learning strictly requires that historical examples already have the correct answers (e.g. whether past customers actually churned).',
      technical: 'Supervised loss functions min L(f(x), y) require ground truth vector y. Without labels, the problem falls into unsupervised learning, self-supervised pretraining, or active annotation.'
    },
    options: [
      {
        id: 'opt_labels_complete',
        label: 'Yes — Every observation has a verified historical outcome / label',
        description: 'Supervised learning is fully viable.',
        nextNodeId: 'q7_label_reliability',
        contextUpdates: {
          labelAvailability: 'fully_labeled'
        }
      },
      {
        id: 'opt_labels_partial',
        label: 'Partially — Only a small percentage of observations are labeled (e.g. 5% to 20%)',
        description: 'Consider semi-supervised learning, active learning, or self-supervised representations.',
        nextNodeId: 'q7_label_reliability',
        contextUpdates: {
          labelAvailability: 'partially_labeled',
          dataReadinessStatus: 'conditionally_ready'
        }
      },
      {
        id: 'opt_labels_none',
        label: 'No — We have no target labels (exploratory, clustering, or unsupervised anomaly detection)',
        description: 'Must use unsupervised learning, heuristic clustering, or manual rule discovery.',
        nextNodeId: 'q8_data_quality',
        contextUpdates: {
          labelAvailability: 'no_labels',
          labelReliability: 'not_applicable'
        }
      }
    ]
  },

  'q7_label_reliability': {
    id: 'q7_label_reliability',
    stage: 'stage_2_data_readiness',
    stageName: 'Stage 2: Data Readiness Assessment',
    question: 'How reliable and consistent are your target labels?',
    whyItMatters: {
      simple: 'If your labels are noisy, inconsistent, or subjective, the model will faithfully learn human errors and produce unreliable predictions.',
      technical: 'Label noise shifts optimal decision boundaries, degrades maximum attainable generalization bound, and induces label distribution drift. Inter-annotator agreement (Cohen’s Kappa) or label smoothing becomes mandatory.'
    },
    options: [
      {
        id: 'opt_labels_high_quality',
        label: 'High reliability — Objective, verified ground truth (e.g. bank default, sensor failure)',
        description: 'Ground truth is unambiguous and audited.',
        nextNodeId: 'q8_data_quality',
        contextUpdates: {
          labelReliability: 'high_audited'
        }
      },
      {
        id: 'opt_labels_noisy',
        label: 'Moderate to noisy — Subjective human annotations, inconsistent historical records',
        description: 'Labels may have 10-30% disagreement or subjective judgment.',
        nextNodeId: 'q8_data_quality',
        contextUpdates: {
          labelReliability: 'unreliable_ambiguous',
          dataReadinessStatus: 'conditionally_ready',
          dataReadinessReason: 'Label noise detected: require label audit, confident learning (cleanlab), or loss functions robust to noise.'
        }
      }
    ]
  },

  'q8_data_quality': {
    id: 'q8_data_quality',
    stage: 'stage_2_data_readiness',
    stageName: 'Stage 2: Data Readiness Assessment',
    question: 'What is the current state of data quality and missing values?',
    whyItMatters: {
      simple: 'Blindly filling missing values with the average (mean imputation) can destroy relationships in your data. We must understand why data is missing.',
      technical: 'Rubin’s Missingness Taxonomy: MCAR (Missing Completely at Random), MAR (Missing at Random conditional on observed variables), or MNAR (Missing Not at Random — missingness depends on unobserved values). Tree algorithms handle missing values natively, but linear/distance models require principled imputation.'
    },
    options: [
      {
        id: 'opt_quality_clean',
        label: 'Clean data — Minimal missing values (< 5%), well-formatted, consistent schemas',
        description: 'Ready for standard preprocessing and modeling.',
        nextNodeId: 'q9_target_leakage',
        contextUpdates: {
          missingDataMechanism: 'minimal_missing'
        }
      },
      {
        id: 'opt_quality_mcar_mar',
        label: 'Moderate missing values (5-30%), but missingness is explained by recorded features (MAR/MCAR)',
        description: 'Can be addressed via Iterative/KNN Imputer or native tree handling.',
        nextNodeId: 'q9_target_leakage',
        contextUpdates: {
          missingDataMechanism: 'MAR',
          dataReadinessStatus: 'conditionally_ready',
          dataReadinessReason: 'Missing data requires principled imputation (IterativeImputer or MissForest); do not default to crude mean imputation.'
        }
      },
      {
        id: 'opt_quality_mnar_severe',
        label: 'Severe missingness (> 30%) or missingness depends on the outcome itself (MNAR) / heavy data errors',
        description: 'High risk: observations with missing data behave systematically differently from observed cases.',
        nextNodeId: 'q9_target_leakage',
        contextUpdates: {
          missingDataMechanism: 'MNAR',
          dataReadinessStatus: 'conditionally_ready',
          dataReadinessReason: 'MNAR detected: Missing indicator flags must be created; evaluate survivorship and selection bias before modeling.'
        }
      }
    ]
  },

  'q9_target_leakage': {
    id: 'q9_target_leakage',
    stage: 'stage_2_data_readiness',
    stageName: 'Stage 2: Data Readiness Assessment',
    question: 'Will all features be strictly available at inference time BEFORE the event occurs (no target leakage)?',
    whyItMatters: {
      simple: 'Target leakage occurs when your training data includes variables created after the outcome happened (e.g. using "account cancellation date" to predict customer churn). It gives artificially 99% accuracy in tests but fails completely in real life.',
      technical: 'Information leak from target Y into feature matrix X_train or temporal lookahead bias violates causal ordering. The model learns spurious identity mappings that vanish at serving time.'
    },
    options: [
      {
        id: 'opt_leakage_safe',
        label: 'Safe — All features are strictly logged prior to the prediction timestamp',
        description: 'Features represent genuine historical state available at inference time.',
        nextNodeId: 'q10_problem_family_router',
        contextUpdates: {
          targetLeakageRisk: 'safe_available_at_inference'
        }
      },
      {
        id: 'opt_leakage_risk',
        label: 'Potential risk — Some columns are updated post-event or aggregate future information',
        description: 'Requires temporal feature audit to eliminate lookahead bias.',
        nextNodeId: 'q10_problem_family_router',
        contextUpdates: {
          targetLeakageRisk: 'high_leakage_detected',
          dataReadinessStatus: 'conditionally_ready',
          dataReadinessReason: 'High target leakage risk: must run point-in-time feature store audit and strip all retrospective features.'
        }
      }
    ]
  },

  // ==========================================
  // STAGE 3: PROBLEM FAMILY ROUTER & REFINEMENT
  // ==========================================
  'q10_problem_family_router': {
    id: 'q10_problem_family_router',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: Problem Identification',
    question: 'Based on your objective and data, which mathematical problem family does this represent?',
    whyItMatters: {
      simple: 'Identifying the exact problem type ensures we evaluate the model against the right loss function and real-world success criteria.',
      technical: 'Determines the hypothesis space H, loss function L, and statistical inference framework.'
    },
    options: [
      {
        id: 'opt_fam_binary_class',
        label: 'Binary Classification (Predict between 2 outcomes: Yes/No, Default/Repay, Fraud/Normal)',
        description: 'Target Y in {0, 1}; models predict calibrated posterior probability P(Y=1|X).',
        nextNodeId: 'q11_class_imbalance',
        contextUpdates: {
          problemFamily: 'supervised_binary_classification',
          targetVariableType: 'binary'
        }
      },
      {
        id: 'opt_fam_multiclass',
        label: 'Multiclass or Multilabel Classification (3+ discrete categories or multiple tags per sample)',
        description: 'Target belongs to one of K classes (multiclass) or a subset of multiple tags (multilabel).',
        nextNodeId: 'q11b_multiclass_details',
        contextUpdates: {
          problemFamily: 'supervised_multiclass_classification',
          targetVariableType: 'multiclass'
        }
      },
      {
        id: 'opt_fam_regression',
        label: 'Tabular Regression (Predict a continuous numeric quantity like sales, price, or wait time)',
        description: 'Target Y in R; minimize expected error (e.g. MSE, MAE, Pinball loss).',
        nextNodeId: 'q12_regression_details',
        contextUpdates: {
          problemFamily: 'supervised_regression',
          targetVariableType: 'continuous'
        }
      },
      {
        id: 'opt_fam_time_series',
        label: 'Time-Series Forecasting (Predict future values across forward time periods)',
        description: 'Observations are temporally dependent; prediction horizon extends into the future.',
        nextNodeId: 'q13_timeseries_details',
        contextUpdates: {
          problemFamily: 'time_series_forecasting'
        }
      },
      {
        id: 'opt_fam_clustering',
        label: 'Unsupervised Clustering (Segment entities into cohesive groups without labels)',
        description: 'Discover dense clusters, spatial topology, or hierarchical dendrograms.',
        nextNodeId: 'q14_clustering_details',
        contextUpdates: {
          problemFamily: 'unsupervised_clustering'
        }
      },
      {
        id: 'opt_fam_anomaly',
        label: 'Anomaly Detection (Spot rare outliers, cyber intrusions, or equipment failures)',
        description: 'Unusual observations that deviate significantly from standard distribution.',
        nextNodeId: 'q15_anomaly_details',
        contextUpdates: {
          problemFamily: 'anomaly_detection_unsupervised'
        }
      },
      {
        id: 'opt_fam_recsys',
        label: 'Recommendation System (Rank items/content for users based on affinities)',
        description: 'Collaborative filtering, matrix factorization, or two-tower ranking.',
        nextNodeId: 'q16_recsys_details',
        contextUpdates: {
          problemFamily: 'recommendation_systems'
        }
      },
      {
        id: 'opt_fam_causal',
        label: 'Causal Inference & Policy Evaluation (Determine true impact of an intervention)',
        description: 'Observational or experimental data estimating treatment effects under confounding.',
        nextNodeId: 'q17_causal_details',
        contextUpdates: {
          problemFamily: 'causal_inference'
        }
      },
      {
        id: 'opt_fam_nlp',
        label: 'Natural Language Processing (Text classification, sentiment, semantic extraction)',
        description: 'Tokenized text processed via TF-IDF baselines or Pretrained Transformers.',
        nextNodeId: 'q18_nlp_details',
        contextUpdates: {
          problemFamily: 'nlp_text_classification'
        }
      },
      {
        id: 'opt_fam_rl',
        label: 'Reinforcement Learning / Contextual Bandits (Sequential exploration & action-reward)',
        description: 'Agent interacts dynamically with environment to maximize cumulative reward.',
        nextNodeId: 'q19_rl_details',
        contextUpdates: {
          problemFamily: 'reinforcement_learning'
        }
      }
    ]
  },

  // ==========================================
  // STAGE 3 SPECIFIC SUB-TREES
  // ==========================================
  'q11_class_imbalance': {
    id: 'q11_class_imbalance',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: Binary Classification Specifics',
    question: 'What is the class distribution between positive (rare) and negative events?',
    whyItMatters: {
      simple: 'If only 1% of transactions are fraudulent, a useless model that always says "Not Fraud" achieves 99% accuracy! Accuracy is dangerously misleading in imbalanced problems.',
      technical: 'Class imbalance shifts threshold calibration. Base rate P(Y=1) << P(Y=0) degrades accuracy; optimization must target PR-AUC, Cost-Weighted Log Loss, or Balanced Accuracy rather than raw ROC-AUC or 0/1 accuracy.'
    },
    options: [
      {
        id: 'opt_imb_balanced',
        label: 'Relatively balanced (30% to 70% positive cases)',
        description: 'Standard classification metrics and loss functions operate well.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          classImbalance: 'balanced'
        }
      },
      {
        id: 'opt_imb_moderate',
        label: 'Moderately imbalanced (5% to 25% positive cases)',
        description: 'Requires stratified splits and threshold tuning.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          classImbalance: 'moderate_imbalance'
        }
      },
      {
        id: 'opt_imb_extreme',
        label: 'Extreme rarity (< 2% positive cases, e.g. fraud or rare defect)',
        description: 'Accuracy is strictly forbidden; requires PR-AUC, focal loss, or anomaly framing.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          classImbalance: 'extreme_rare_events'
        }
      }
    ]
  },

  'q11b_multiclass_details': {
    id: 'q11b_multiclass_details',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: Multiclass Specifics',
    question: 'How are the classes structured in your target variable?',
    whyItMatters: {
      simple: 'Predicting an ordered rating (1 to 5 stars) is very different from predicting independent categories (dog vs cat vs bird).',
      technical: 'Mutually exclusive nominal classes use Softmax / Categorical Cross-Entropy; ordered classes (Likert scales) require Ordinal Logistic Regression to penalize distance errors; multi-label needs Binary Cross-Entropy with sigmoid per class.'
    },
    options: [
      {
        id: 'opt_mc_nominal',
        label: 'Nominal mutually exclusive classes (e.g. product category: electronics vs apparel vs food)',
        description: 'Each observation belongs to exactly one category.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          targetVariableType: 'multiclass'
        }
      },
      {
        id: 'opt_mc_ordinal',
        label: 'Ordinal classes with a natural ranking (e.g. low / medium / high or 1 to 5 stars)',
        description: 'Errors between adjacent classes are less severe than errors across distant extremes.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          targetVariableType: 'ordinal'
        }
      },
      {
        id: 'opt_mc_multilabel',
        label: 'Multilabel (each observation can have multiple tags simultaneously)',
        description: 'e.g. an article tagged with both "Finance" and "Technology".',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          problemFamily: 'supervised_multilabel_classification',
          targetVariableType: 'multilabel'
        }
      }
    ]
  },

  'q12_regression_details': {
    id: 'q12_regression_details',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: Regression Specifics',
    question: 'What is the nature and distribution of your continuous target variable?',
    whyItMatters: {
      simple: 'Financial variables often have extreme outliers or cannot be negative. Standard linear regression assuming symmetric bell curves will fail without transformation.',
      technical: 'Target distribution properties dictate loss functions: strictly positive skewed targets (e.g. prices) require log1p transform or Tweedie/Gamma GLM; heavy tails require Huber or MAE loss; asymmetric risk requires quantile regression.'
    },
    options: [
      {
        id: 'opt_reg_standard',
        label: 'Roughly symmetric continuous values with few extreme outliers',
        description: 'Standard MSE / RMSE optimization is appropriate.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          targetVariableType: 'continuous'
        }
      },
      {
        id: 'opt_reg_skewed',
        label: 'Heavily right-skewed positive numbers with extreme values (e.g. revenue, customer LTV)',
        description: 'Requires log transformation, Tweedie deviance, or robust loss functions.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          targetVariableType: 'continuous'
        }
      },
      {
        id: 'opt_reg_quantiles',
        label: 'Need prediction intervals or risk percentiles (e.g. 10th and 90th percentiles)',
        description: 'Quantile regression / pinball loss to provide uncertainty bounds.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          targetVariableType: 'continuous'
        }
      }
    ]
  },

  'q13_timeseries_details': {
    id: 'q13_timeseries_details',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: Time-Series Specifics',
    question: 'How is your time-series structured across entities and external drivers?',
    whyItMatters: {
      simple: 'Forecasting one single stock price requires different methods than forecasting 50,000 retail store items that share seasonal patterns and marketing promotions.',
      technical: 'Distinguishes univariate classical ARIMA/ETS from global multi-series panel forecasting with exogenous covariates (SARIMAX, LightGBM with lag features, Temporal Fusion Transformers).'
    },
    options: [
      {
        id: 'opt_ts_single_univariate',
        label: 'Single univariate series (one metric over time, e.g. total website traffic)',
        description: 'Focus on autocorrelation, trend, and recurring seasonality.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          temporalStructure: 'single_series',
          hasExogenousVariables: false
        }
      },
      {
        id: 'opt_ts_multiple_exogenous',
        label: 'Multiple related series or external drivers (e.g. sales across 100 stores + pricing + weather)',
        description: 'Benefits from global models learning cross-series patterns with exogenous features.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          temporalStructure: 'multiple_related_series',
          hasExogenousVariables: true
        }
      }
    ]
  },

  'q14_clustering_details': {
    id: 'q14_clustering_details',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: Clustering Specifics',
    question: 'What expected geometry or characteristics do your clusters have?',
    whyItMatters: {
      simple: 'K-Means only finds round, equal-sized clusters and is ruined by outliers. DBSCAN finds clusters of arbitrary shapes and isolates noise automatically.',
      technical: 'K-Means assumes convex, isotropic spherical clusters with uniform variance. Density-based algorithms (DBSCAN/HDBSCAN) identify arbitrarily shaped manifolds and separate background noise. GMM models elliptical covariances.'
    },
    options: [
      {
        id: 'opt_cluster_spherical',
        label: 'Compact, roughly equal-sized groups; need a fixed number of segments (e.g. 4 customer tiers)',
        description: 'K-Means or K-Medoids with feature scaling.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          clusterGeometryExpectation: 'spherical_equal'
        }
      },
      {
        id: 'opt_cluster_density_noise',
        label: 'Arbitrary shapes, unknown number of clusters, and significant noise/outliers',
        description: 'HDBSCAN / DBSCAN density-based clustering.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          clusterGeometryExpectation: 'arbitrary_density'
        }
      },
      {
        id: 'opt_cluster_hierarchical',
        label: 'Taxonomy or nested hierarchy (e.g. grouping products into subcategories and categories)',
        description: 'Agglomerative Hierarchical Clustering with dendrogram analysis.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          clusterGeometryExpectation: 'hierarchical_tree'
        }
      }
    ]
  },

  'q15_anomaly_details': {
    id: 'q15_anomaly_details',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: Anomaly Detection Specifics',
    question: 'Do you have historical labels identifying known anomalies or fraud cases?',
    whyItMatters: {
      simple: 'If you already have confirmed fraud cases, supervised learning with rare-event methods is vastly more accurate than guessing outliers blindly.',
      technical: 'Labeled anomalies enable supervised Neyman-Pearson / PR-AUC optimization (XGBoost with scale_pos_weight). Purely unsupervised settings must rely on Isolation Forests, One-Class SVMs, or Local Outlier Factor.'
    },
    options: [
      {
        id: 'opt_anom_unsupervised',
        label: 'No labels — We want to flag any observation that deviates from normal baseline distribution',
        description: 'Unsupervised Isolation Forest, Local Outlier Factor, or Mahalanobis distance.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          anomalyLabelPresence: 'purely_unsupervised',
          problemFamily: 'anomaly_detection_unsupervised'
        }
      },
      {
        id: 'opt_anom_supervised',
        label: 'Yes, some confirmed historical anomalies are labeled (even if rare, e.g. 0.5% fraud rate)',
        description: 'Supervised rare-event classification with cost-sensitive learning or anomaly score ensembling.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          anomalyLabelPresence: 'labeled_anomalies',
          problemFamily: 'anomaly_detection_supervised'
        }
      }
    ]
  },

  'q16_recsys_details': {
    id: 'q16_recsys_details',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: Recommendation Specifics',
    question: 'What interaction data is available between users and items?',
    whyItMatters: {
      simple: 'Recommending items to new users with zero history (cold start) requires item descriptions; recommending to existing active users works best via collaborative interaction patterns.',
      technical: 'Explicit vs implicit feedback (ratings vs clicks/views). Cold-start problems require Content-Based / Two-Tower embeddings; dense interaction matrices leverage Matrix Factorization (ALS, BPR) or graph collaborative filtering.'
    },
    options: [
      {
        id: 'opt_rec_interactions',
        label: 'Rich interaction matrix (user purchase/view history across a catalog of products)',
        description: 'Collaborative filtering and matrix factorization.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          problemFamily: 'recommendation_systems'
        }
      },
      {
        id: 'opt_rec_content',
        label: 'Sparse interactions / severe cold-start (new items/users; heavy metadata like tags & descriptions)',
        description: 'Content-based filtering using text/item embeddings and cosine similarity.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          problemFamily: 'recommendation_systems'
        }
      }
    ]
  },

  'q17_causal_details': {
    id: 'q17_causal_details',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: Causal Inference Specifics',
    question: 'Do you have data from randomized experiments (A/B tests) or purely observational data with confounders?',
    whyItMatters: {
      simple: 'In observational data, customers who received discounts might already be loyal shoppers. Predictive ML will falsely claim the discount caused loyalty. Causal inference removes these confounders.',
      technical: 'Predictive algorithms maximize E[Y|X], which reflects association. Causal identification requires estimating E[Y|do(T=1)] - E[Y|do(T=0)] under unconfoundedness, positivity, and SUTVA assumptions using Double ML, Propensity Matching, or IV.'
    },
    options: [
      {
        id: 'opt_causal_rct',
        label: 'Randomized Controlled Trial (A/B experiment with randomized treatment assignment)',
        description: 'Direct average treatment effect estimation with covariate adjustment.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          causalGoal: 'average_treatment_effect'
        }
      },
      {
        id: 'opt_causal_observational',
        label: 'Observational data (treatment was NOT randomly assigned; strong business confounding exists)',
        description: 'Requires Double Machine Learning (EconML), Causal Forests, or Propensity Score Weighting.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          causalGoal: 'heterogeneous_treatment_effect'
        }
      }
    ]
  },

  'q18_nlp_details': {
    id: 'q18_nlp_details',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: NLP Specifics',
    question: 'What is the scale of text and your latency/compute constraints for NLP?',
    whyItMatters: {
      simple: 'Running a massive Transformer or LLM API for thousands of requests per second can cost tens of thousands of dollars and introduce hundreds of milliseconds of latency, whereas TF-IDF with Logistic Regression runs in 2 milliseconds on CPU.',
      technical: 'Tradeoff between sample efficiency and compute budget: TF-IDF + Linear SVM/Logistic Regression provides an unbeatable fast baseline; pretrained HuggingFace Transformers (RoBERTa/MiniLM) or LLM zero-shot APIs provide state-of-the-art semantic depth.'
    },
    options: [
      {
        id: 'opt_nlp_fast_cpu',
        label: 'Fast CPU inference (< 10ms), low compute budget, standard ticket or sentiment classification',
        description: 'TF-IDF with Logistic Regression or Linear SVM baseline.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          computationalBudget: 'low_laptop_cpu'
        }
      },
      {
        id: 'opt_nlp_deep_transformer',
        label: 'Deep semantic understanding required, subtle nuances, GPU infrastructure available',
        description: 'Pretrained sentence transformer fine-tuning or small encoder (e.g. ModernBERT / DeBERTa).',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          computationalBudget: 'medium_single_gpu_cloud'
        }
      }
    ]
  },

  'q19_rl_details': {
    id: 'q19_rl_details',
    stage: 'stage_3_problem_identification',
    stageName: 'Stage 3: Reinforcement Learning Specifics',
    question: 'Are decisions sequential with delayed consequences, or one-step bandit selections?',
    whyItMatters: {
      simple: 'If today’s choice does not change tomorrow’s environment (like choosing which headline to show on a website), Contextual Bandits are 100x simpler to deploy than full Reinforcement Learning.',
      technical: 'Contextual Bandits assume single-step state transition without delayed credit assignment. Full Markov Decision Processes (MDP) requiring value/policy iteration (PPO, SAC, DQN) are only needed when actions alter future state trajectories.'
    },
    options: [
      {
        id: 'opt_rl_bandit',
        label: 'Immediate feedback / single-step choices (e.g. ad placement, headline selection, recommendation)',
        description: 'Contextual Bandits (LinUCB, Thompson Sampling) with exploration-exploitation balance.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          rlFeedbackLoop: 'immediate_contextual'
        }
      },
      {
        id: 'opt_rl_sequential',
        label: 'Sequential multi-step decisions with delayed rewards (e.g. robotic navigation, inventory replenishment)',
        description: 'Full MDP Reinforcement Learning (PPO, DQN, SAC) with policy/value learning.',
        nextNodeId: 'q20_interpretability_focus',
        contextUpdates: {
          rlFeedbackLoop: 'sequential_delayed_rewards'
        }
      }
    ]
  },

  // ==========================================
  // STAGE 7: EXPLAINABILITY & FINAL GATE
  // ==========================================
  'q20_interpretability_focus': {
    id: 'q20_interpretability_focus',
    stage: 'stage_7_explainability',
    stageName: 'Stage 7: Explainability Requirements',
    question: 'What level of explainability and auditing is required for stakeholders?',
    whyItMatters: {
      simple: 'Some industries (like banking and medicine) legally require explaining every single decision. In other tasks, maximizing raw predictive score is all that matters.',
      technical: 'Inherently interpretable glass-box models (EBM, GLM, shallow trees) vs post-hoc local/global approximations (SHAP, Permutation Importance). Critical rule: SHAP values quantify model attribution, NEVER causal mechanisms.'
    },
    options: [
      {
        id: 'opt_exp_strict',
        label: 'Strict regulatory or legal explanations required for every individual prediction',
        description: 'Requires intrinsic interpretability (Logistic/Ridge with coefficients) or auditable EBM.',
        nextNodeId: 'terminal_recommendation_ready',
        contextUpdates: {
          interpretabilityRequirement: 'strict_regulatory'
        }
      },
      {
        id: 'opt_exp_business',
        label: 'Business trust & feature attribution (need to know top drivers, but complex models are acceptable)',
        description: 'Ensemble models with SHAP TreeExplainer, Partial Dependence Plots, and Permutation Importance.',
        nextNodeId: 'terminal_recommendation_ready',
        contextUpdates: {
          interpretabilityRequirement: 'high_business_trust'
        }
      },
      {
        id: 'opt_exp_none',
        label: 'Performance is king; black-box predictions are acceptable if benchmarked thoroughly',
        description: 'Complex gradient boosting, deep neural architectures, or ensemble blends.',
        nextNodeId: 'terminal_recommendation_ready',
        contextUpdates: {
          interpretabilityRequirement: 'black_box_acceptable'
        }
      }
    ]
  },

  // ==========================================
  // TERMINAL NODES
  // ==========================================
  'terminal_no_ml_needed': {
    id: 'terminal_no_ml_needed',
    stage: 'stage_8_recommendations',
    stageName: 'Recommendation: No ML Needed',
    question: 'Diagnostic Complete: A Non-ML Solution is Recommended',
    whyItMatters: {
      simple: 'Machine Learning is an unnecessary overhead when business rules, SQL queries, or simple descriptive statistics solve the problem cleanly.',
      technical: 'Rule-based systems have zero training latency, 100% deterministic auditing, zero distribution drift failure, and minimal maintenance overhead.'
    },
    options: [],
    isTerminal: true
  },

  'terminal_no_data': {
    id: 'terminal_no_data',
    stage: 'stage_2_data_readiness',
    stageName: 'Recommendation: Data Roadmap Required',
    question: 'Diagnostic Complete: Data Not Ready for Machine Learning',
    whyItMatters: {
      simple: 'Machine Learning algorithms cannot learn without historical data. Attempting to choose algorithms now is putting the cart before the horse.',
      technical: 'Statistical learning theory requires empirical risk minimization over a representative sample space. Without data logging, modeling is mathematically impossible.'
    },
    options: [],
    isTerminal: true
  },

  'terminal_out_of_scope': {
    id: 'terminal_out_of_scope',
    stage: 'stage_8_recommendations',
    stageName: 'Recommendation: Scope Limitation & Specialized Architecture',
    question: 'Diagnostic Complete: Outside Implemented Scope',
    whyItMatters: {
      simple: 'To maintain scientific honesty, this assistant explicitly declares when an advanced domain exceeds standard off-the-shelf tabular and classical ML patterns.',
      technical: 'Specialized domains (e.g. Physics-Informed Neural Networks, Federated Differential Privacy, Massive-Scale Distributed TPU Graph Transformers) require dedicated co-design.'
    },
    options: [],
    isTerminal: true
  },

  'terminal_recommendation_ready': {
    id: 'terminal_recommendation_ready',
    stage: 'stage_8_recommendations',
    stageName: 'Recommendation: Comprehensive Multi-Model Strategy',
    question: 'Diagnostic Complete: Custom ML Recommendation & Implementation Roadmap Ready',
    whyItMatters: {
      simple: 'We have synthesized your objective, data readiness, constraints, and error costs into an auditable recommendation strategy.',
      technical: 'Full decision synthesis completed: model candidates tiered by baseline/primary/alternative/advanced, validation split defined with leakage safeguards, statistical assumption diagnostics mapped, and 21-step deployment roadmap generated.'
    },
    options: [],
    isTerminal: true
  }
};
