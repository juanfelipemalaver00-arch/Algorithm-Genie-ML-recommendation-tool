import { 
  DecisionContext, 
  AlgorithmCandidate 
} from '../types/decision';

export class RecommendationEngine {
  public static generateCandidates(ctx: DecisionContext): {
    baseline: AlgorithmCandidate;
    primary?: AlgorithmCandidate;
    alternative?: AlgorithmCandidate;
    advanced?: AlgorithmCandidate;
  } {
    const family = ctx.problemFamily || 'supervised_binary_classification';

    switch (family) {
      case 'no_ml_needed':
        return this.getNoMlCandidates(ctx);

      case 'no_data':
        return this.getNoDataCandidates(ctx);

      case 'supervised_binary_classification':
        return this.getBinaryClassificationCandidates(ctx);

      case 'supervised_multiclass_classification':
      case 'supervised_multilabel_classification':
        return this.getMulticlassClassificationCandidates(ctx);

      case 'supervised_regression':
        return this.getRegressionCandidates(ctx);

      case 'time_series_forecasting':
        return this.getTimeSeriesCandidates(ctx);

      case 'unsupervised_clustering':
        return this.getClusteringCandidates(ctx);

      case 'anomaly_detection_unsupervised':
      case 'anomaly_detection_supervised':
        return this.getAnomalyCandidates(ctx);

      case 'recommendation_systems':
        return this.getRecSysCandidates(ctx);

      case 'causal_inference':
        return this.getCausalInferenceCandidates(ctx);

      case 'reinforcement_learning':
        return this.getReinforcementLearningCandidates(ctx);

      case 'nlp_text_classification':
        return this.getNlpCandidates(ctx);

      default:
        return this.getBinaryClassificationCandidates(ctx);
    }
  }

  // --- 1. NO ML NEEDED ---
  private static getNoMlCandidates(_ctx: DecisionContext) {
    const baseline: AlgorithmCandidate = {
      name: 'Deterministic Business Rules Engine / SQL Heuristics',
      family: 'Expert Rule-Based Decision Logic',
      tier: 'baseline',
      suitabilityScore: 98,
      whySuitable: 'Your problem logic is well-understood, deterministic, and can be fully represented through domain rules or SQL CASE/JOIN logic without the technical debt of training, deploying, and maintaining an ML model.',
      assumptions: ['Business relationships remain stable or can be updated manually by domain experts.', 'The rule space is small enough to avoid exponential complexity.'],
      advantages: [
        'Zero training cost and immediate execution in milliseconds.',
        '100% auditable and explainable logic.',
        'Zero susceptibility to statistical distribution drift.',
        'No specialized ML infrastructure required.'
      ],
      disadvantages: [
        'Does not discover unknown non-linear interactions.',
        'Requires manual rule updates when business policies change.'
      ],
      dataRequirements: 'Structured SQL tables or streaming event fields.',
      interpretability: 'High',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Unit testing against historical test cases and boundary conditions.',
      recommendedMetrics: ['Rule Precision', 'False Alarm Rate', 'Execution Latency (ms)'],
      explainabilityOptions: ['Direct boolean logic printout / Decision table tree'],
      mainRisks: ['Rule bloat over time as edge cases accumulate.']
    };

    return { baseline };
  }

  // --- 2. NO DATA ---
  private static getNoDataCandidates(_ctx: DecisionContext) {
    const baseline: AlgorithmCandidate = {
      name: 'Data Collection & Synthetic Simulation Baseline',
      family: 'Data Ingestion & Logging Pipeline',
      tier: 'baseline',
      suitabilityScore: 20,
      whySuitable: 'Machine Learning requires historical observations to learn mappings. At this stage, your priority must be implementing event logging and establishing a data contract before selecting algorithms.',
      assumptions: ['Data collection pipeline will capture relevant predictive features at point-of-decision without leakage.'],
      advantages: ['Ensures high data quality from inception.'],
      disadvantages: ['No predictive model can be trained today.'],
      dataRequirements: 'Design logging schema; minimum pilot sample size target: 500-2,000 verified cases.',
      interpretability: 'High',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Data contract schema validation and distribution checks.',
      recommendedMetrics: ['Data Completeness Rate', 'Event Logging Latency'],
      explainabilityOptions: ['Schema documentation'],
      mainRisks: ['Collecting variables that do not actually correlate with the future business outcome.']
    };

    return { baseline };
  }

  // --- 3. BINARY CLASSIFICATION ---
  private static getBinaryClassificationCandidates(ctx: DecisionContext) {
    const isStrictInterpretability = ctx.interpretabilityRequirement === 'strict_regulatory';
    const isUltraLowLatency = ctx.latencyRequirement === 'ultra_low_ms';
    const isSmallSample = ctx.observationCount === 'tiny_under_1k';
    const isExtremeImbalance = ctx.classImbalance === 'extreme_rare_events';

    const baseline: AlgorithmCandidate = {
      name: 'L2-Regularized Logistic Regression',
      family: 'Generalized Linear Models (GLM)',
      tier: 'baseline',
      suitabilityScore: 88,
      whySuitable: 'Essential benchmark model for tabular binary classification. Provides well-calibrated posterior probabilities P(Y=1|X) and directly interpretable odds ratios.',
      assumptions: [
        'Linearity of the continuous predictors in the log-odds space logit(p).',
        'Minimal multicollinearity among predictors (VIF < 5).',
        'No extreme quasi-complete separation.'
      ],
      advantages: [
        'Microsecond inference speed (< 1ms).',
        'Coefficients directly explain marginal change in log-odds.',
        'Extremely fast training and low memory footprint.',
        'Provides calibrated probabilities out of the box.'
      ],
      disadvantages: [
        'Cannot capture non-linear relationships or multi-feature interactions without manual feature engineering.',
        'Vulnerable to extreme outliers in continuous features.'
      ],
      dataRequirements: 'Scaled numerical features (StandardScaler) and one-hot encoded low-cardinality categoricals.',
      interpretability: 'High',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Stratified 5-Fold Cross-Validation with inner-fold feature scaling.',
      recommendedMetrics: isExtremeImbalance 
        ? ['PR-AUC (Average Precision)', 'Brier Score', 'Recall at Fixed Precision']
        : ['ROC-AUC', 'PR-AUC', 'Brier Score', 'Log Loss'],
      explainabilityOptions: ['Model Coefficients (Odds Ratios)', 'Weight Magnitude Bar Plots'],
      mainRisks: ['Underfitting if true data generating process is heavily non-linear.']
    };

    const primary: AlgorithmCandidate = isStrictInterpretability
      ? {
          name: 'Explainable Boosting Machine (EBM) / GA2M',
          family: 'Generalized Additive Models with Interactions (GAM)',
          tier: 'primary',
          suitabilityScore: 94,
          whySuitable: 'Combines the predictive power of gradient boosting with the glass-box interpretability of linear models. Complies with strict regulatory audit requirements while capturing non-linear curves and 2-way interactions.',
          assumptions: ['Additivity of main effects and selected pairwise interactions.', 'Sufficient observations per feature bin.'],
          advantages: [
            'Exact glass-box interpretability: each feature has a transparent visual score curve.',
            'Competitive accuracy matching standard Random Forest or XGBoost.',
            'Built-in pairwise interaction detection.',
            'Directly auditable by legal and compliance teams.'
          ],
          disadvantages: [
            'Slower training time than LightGBM on large datasets.',
            'Higher-order (3-way+) interactions are ignored by design.'
          ],
          dataRequirements: 'Handles raw numerical and categorical variables directly without manual scaling.',
          interpretability: 'High',
          computationalCost: 'Moderate (CPU/Single GPU)',
          implementationComplexity: 'Moderate',
          recommendedValidation: 'Stratified 5-Fold Cross-Validation with nested hyperparameter tuning.',
          recommendedMetrics: ['PR-AUC', 'ROC-AUC', 'Expected Calibration Error (ECE)', 'Cost-Weighted Loss'],
          explainabilityOptions: ['Exact Global Term Plots (Shape functions)', 'Exact Local Prediction Attribution'],
          mainRisks: ['Slower inference than pure Logistic Regression.']
        }
      : {
          name: 'LightGBM / XGBoost Classifier',
          family: 'Gradient Boosted Decision Trees (GBDT)',
          tier: 'primary',
          suitabilityScore: 96,
          whySuitable: 'Industry standard for structured tabular classification. Excels at non-linear boundaries, complex interactions, and native handling of missing values and categorical data.',
          assumptions: [
            'Tabular feature structure with statistical stationarity.',
            'Adequate training sample size to avoid leaf overfitting (min_child_samples tuning).'
          ],
          advantages: [
            'State-of-the-art predictive performance on tabular benchmarks.',
            'Native support for missing values without arbitrary imputation.',
            'Built-in scale_pos_weight parameter to handle class imbalance.',
            'Fast training using histogram-based splitting.'
          ],
          disadvantages: [
            'Requires post-hoc explainability methods (TreeSHAP) for interpretation.',
            'Can overfit if depth and learning rate are unregularized.',
            'Predicted probabilities may need Platt scaling or isotonic calibration.'
          ],
          dataRequirements: 'Tabular matrix. LightGBM supports native categorical indices.',
          interpretability: 'Medium',
          computationalCost: isUltraLowLatency ? 'Low (CPU fast)' : 'Moderate (CPU/Single GPU)',
          implementationComplexity: 'Moderate',
          recommendedValidation: 'Stratified 5-Fold Cross-Validation, preventing leakage by preprocessing within folds.',
          recommendedMetrics: isExtremeImbalance 
            ? ['PR-AUC', 'Focal Loss / Cost-Weighted Log Loss', 'Recall@Precision=0.90']
            : ['ROC-AUC', 'PR-AUC', 'Balanced Accuracy', 'Brier Score'],
          explainabilityOptions: ['TreeSHAP (Local & Global)', 'Partial Dependence Plots (PDP)', 'Permutation Importance'],
          mainRisks: ['Overconfidence on out-of-distribution inputs; uncalibrated probabilities in leaf nodes.']
        };

    const alternative: AlgorithmCandidate = {
      name: 'Random Forest Classifier',
      family: 'Bagging Ensemble of Decision Trees',
      tier: 'alternative',
      suitabilityScore: 89,
      whySuitable: 'Robust ensemble that reduces variance through bootstrap aggregation. Less sensitive to hyperparameter tuning than gradient boosting and harder to overfit.',
      assumptions: ['Low individual tree correlation achieved via random feature subsampling.'],
      advantages: [
        'Highly resistant to overfitting.',
        'Requires very little hyperparameter tuning to get strong baseline results.',
        'Embarrassingly parallel training across all CPU cores.',
        'Out-of-Bag (OOB) error provides free internal validation.'
      ],
      disadvantages: [
        'Large model file size in memory (MBs to GBs).',
        'Cannot extrapolate beyond the range of training feature values.',
        'Slower inference than shallow gradient boosting trees.'
      ],
      dataRequirements: 'Standard tabular features; missing values must be imputed beforehand.',
      interpretability: 'Medium',
      computationalCost: 'Moderate (CPU/Single GPU)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Stratified K-Fold CV + Out-of-Bag validation monitoring.',
      recommendedMetrics: ['ROC-AUC', 'PR-AUC', 'F1-Macro'],
      explainabilityOptions: ['MDI Feature Importance', 'TreeSHAP', 'Permutation Feature Importance'],
      mainRisks: ['Suboptimal calibration on extreme probability tails.']
    };

    const advanced: AlgorithmCandidate = isSmallSample
      ? {
          name: 'Calibrated Support Vector Classifier (RBF Kernel)',
          family: 'Kernel Methods',
          tier: 'advanced',
          suitabilityScore: 78,
          whySuitable: 'Effective in small sample regimes with high feature count (p close to n) by maximizing the geometric margin.',
          assumptions: ['Proper feature standardization (zero mean, unit variance).', 'Effective C and gamma tuning.'],
          advantages: ['Strong theoretical margin bounds on small datasets.'],
          disadvantages: ['Quadratic to cubic training complexity O(n^2 to n^3); does not scale to large datasets.'],
          dataRequirements: 'Strict numerical scaling required.',
          interpretability: 'Low',
          computationalCost: 'Moderate (CPU/Single GPU)',
          implementationComplexity: 'Moderate',
          recommendedValidation: 'Repeated Stratified 5-Fold Cross-Validation.',
          recommendedMetrics: ['PR-AUC', 'Balanced Accuracy'],
          explainabilityOptions: ['Kernel SHAP (approximate)'],
          mainRisks: ['Very slow training if dataset exceeds 50,000 rows.']
        }
      : {
          name: 'FT-Transformer / TabNet Architecture',
          family: 'Deep Learning for Tabular Data',
          tier: 'advanced',
          suitabilityScore: 72,
          whySuitable: 'Neural architecture with feature tokenizer and self-attention designed for tabular data. Only recommended when large datasets (> 100k samples) or multimodal fusion are present.',
          assumptions: ['Substantial sample size to train embedding tables and attention layers.'],
          advantages: [
            'Can learn dense vector embeddings for high-cardinality categories.',
            'Facilitates end-to-end multimodal training with text or images.'
          ],
          disadvantages: [
            'Rarely beats tuned LightGBM/XGBoost on pure tabular data while requiring 10x-50x more compute.',
            'High inference latency and GPU infrastructure requirements.'
          ],
          dataRequirements: 'Requires extensive data (N > 50,000) and GPU acceleration.',
          interpretability: 'Low',
          computationalCost: 'High (GPU/Cluster required)',
          implementationComplexity: 'High',
          recommendedValidation: 'Early stopping on Stratified Validation Set with Learning Rate Scheduler.',
          recommendedMetrics: ['Log Loss', 'ROC-AUC', 'PR-AUC'],
          explainabilityOptions: ['Attention Weight Visualizations', 'Integrated Gradients'],
          mainRisks: ['Heavy engineering overhead with no guarantee of surpassing gradient boosted trees.']
        };

    return { baseline, primary, alternative, advanced };
  }

  // --- 4. MULTICLASS & MULTILABEL ---
  private static getMulticlassClassificationCandidates(ctx: DecisionContext) {
    const isMultilabel = ctx.targetVariableType === 'multilabel';
    const isOrdinal = ctx.targetVariableType === 'ordinal';

    const baseline: AlgorithmCandidate = {
      name: isOrdinal 
        ? 'Ordinal Logistic Regression (Proportional Odds Model)'
        : (isMultilabel ? 'Binary Relevance with Logistic Regression' : 'Multinomial Logistic Regression (Softmax)'),
      family: 'Generalized Linear Models',
      tier: 'baseline',
      suitabilityScore: 86,
      whySuitable: isOrdinal 
        ? 'Accounts for the natural ordering of classes, penalizing distant category mistakes more severely than adjacent ones.'
        : 'Interpretable probabilistic baseline with calibrated class probabilities across all categories.',
      assumptions: ['Linearity in logit space', isOrdinal ? 'Proportional odds assumption (parallel slopes)' : 'Independence of Irrelevant Alternatives (IIA)'],
      advantages: ['Fast training and inference', 'Coefficients explain class log-odds directly'],
      disadvantages: ['Cannot model complex non-linear feature interactions natively'],
      dataRequirements: 'Standardized numeric features and one-hot categoricals.',
      interpretability: 'High',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Stratified K-Fold Cross-Validation preserving class ratios.',
      recommendedMetrics: ['Macro-F1', 'Multiclass Log Loss', isOrdinal ? 'Quadratic Weighted Kappa' : 'Balanced Accuracy'],
      explainabilityOptions: ['Class-specific coefficient tables'],
      mainRisks: ['Violation of proportional odds in ordinal models.']
    };

    const primary: AlgorithmCandidate = {
      name: 'LightGBM Multiclass / Multi-output Classifier',
      family: 'Gradient Boosted Decision Trees',
      tier: 'primary',
      suitabilityScore: 95,
      whySuitable: 'Top-tier accuracy for tabular multiclass tasks with fast multi-tree boosting and native categorical support.',
      assumptions: ['Adequate sample representation across minority classes.'],
      advantages: ['Handles class imbalances natively', 'Captures non-linear boundaries across multi-class spaces'],
      disadvantages: ['Requires training K trees per iteration for K classes, scaling memory footprint'],
      dataRequirements: 'Tabular matrix with labeled class integers.',
      interpretability: 'Medium',
      computationalCost: 'Moderate (CPU/Single GPU)',
      implementationComplexity: 'Moderate',
      recommendedValidation: 'Stratified K-Fold Cross-Validation.',
      recommendedMetrics: ['Macro-F1', 'Weighted F1', 'Multi-class Log Loss', 'Confusion Matrix'],
      explainabilityOptions: ['TreeSHAP per class'],
      mainRisks: ['Memory inflation if number of classes K > 100.']
    };

    return { baseline, primary };
  }

  // --- 5. REGRESSION ---
  private static getRegressionCandidates(ctx: DecisionContext) {
    const isStrict = ctx.interpretabilityRequirement === 'strict_regulatory';

    const baseline: AlgorithmCandidate = {
      name: 'Ridge & Lasso Linear Regression (ElasticNet)',
      family: 'Regularized Linear Models',
      tier: 'baseline',
      suitabilityScore: 87,
      whySuitable: 'Standard disciplined baseline. L1 (Lasso) performs automatic feature selection; L2 (Ridge) handles collinearity by shrinking coefficients.',
      assumptions: [
        'Linearity of the conditional expectation E[Y|X].',
        'Homoscedasticity of residuals for valid standard errors.',
        'Independence of observations.'
      ],
      advantages: [
        'Convex optimization with guaranteed global optimum.',
        'Extremely fast training and low latency.',
        'Coefficients provide transparent sensitivity analysis.'
      ],
      disadvantages: [
        'Cannot capture non-linear curvatures or threshold effects without basis expansions (splines/polynomials).'
      ],
      dataRequirements: 'Standardized features (zero mean, unit variance).',
      interpretability: 'High',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: '5-Fold Cross-Validation with nested tuning of alpha and l1_ratio.',
      recommendedMetrics: ['RMSE', 'MAE', 'R-squared', 'Median Absolute Error'],
      explainabilityOptions: ['Standardized regression coefficients', 'Feature p-values'],
      mainRisks: ['Underfitting when true physical mapping has sharp non-linear interactions.']
    };

    const primary: AlgorithmCandidate = isStrict
      ? {
          name: 'Explainable Boosting Regressor (EBM)',
          family: 'Generalized Additive Models (GAM)',
          tier: 'primary',
          suitabilityScore: 93,
          whySuitable: 'Provides tree-boosted accuracy while strictly decomposing predictions into transparent 1D shape graphs and 2D interaction heatmaps.',
          assumptions: ['Additivity of primary univariate response curves and selected interaction pairs.'],
          advantages: ['100% auditable glass-box curves', 'Accuracy competitive with Random Forest'],
          disadvantages: ['Higher order (>2) interactions are excluded'],
          dataRequirements: 'Raw tabular features.',
          interpretability: 'High',
          computationalCost: 'Moderate (CPU/Single GPU)',
          implementationComplexity: 'Moderate',
          recommendedValidation: '5-Fold Cross-Validation.',
          recommendedMetrics: ['MAE', 'RMSE', 'WAPE'],
          explainabilityOptions: ['Exact shape functions per feature'],
          mainRisks: ['Slower training than linear regression.']
        }
      : {
          name: 'CatBoost / XGBoost Regressor',
          family: 'Gradient Boosted Decision Trees',
          tier: 'primary',
          suitabilityScore: 96,
          whySuitable: 'Leading tabular regression engine. CatBoost provides exceptional out-of-the-box handling of categorical features and reduces target leakage via ordered boosting.',
          assumptions: ['Sufficient sample size to partition feature space effectively.'],
          advantages: [
            'Captures complex non-linear relationships and high-order interactions.',
            'Supports custom loss functions (Huber, Tweedie, Quantile loss).',
            'Robust to outliers in feature space.'
          ],
          disadvantages: [
            'Cannot extrapolate linear trends outside training data range (predictions flatten at boundaries).'
          ],
          dataRequirements: 'Tabular features. CatBoost accepts string categoricals directly.',
          interpretability: 'Medium',
          computationalCost: 'Moderate (CPU/Single GPU)',
          implementationComplexity: 'Moderate',
          recommendedValidation: '5-Fold Cross-Validation (or TimeSeriesSplit if temporal).',
          recommendedMetrics: ['MAE', 'RMSE', 'WAPE', 'Pinball Loss (if predicting quantiles)'],
          explainabilityOptions: ['TreeSHAP', 'Partial Dependence Plots'],
          mainRisks: ['Dangerous extrapolation: predictions do not grow linearly past historical max values.']
        };

    const alternative: AlgorithmCandidate = {
      name: 'Random Forest Regressor',
      family: 'Bagging Ensemble',
      tier: 'alternative',
      suitabilityScore: 89,
      whySuitable: 'Strong non-linear regression candidate that averages independent randomized trees to reduce prediction variance.',
      assumptions: ['Subsampled trees have low correlation.'],
      advantages: ['Hard to overfit', 'Few sensitive hyperparameters', 'Parallel training'],
      disadvantages: ['Cannot extrapolate beyond historical bounds', 'High memory usage for large tree ensembles'],
      dataRequirements: 'Tabular data with imputed missing values.',
      interpretability: 'Medium',
      computationalCost: 'Moderate (CPU/Single GPU)',
      implementationComplexity: 'Low',
      recommendedValidation: 'K-Fold CV and Out-Of-Bag evaluation.',
      recommendedMetrics: ['RMSE', 'MAE', 'R-squared'],
      explainabilityOptions: ['Permutation Importance', 'TreeSHAP'],
      mainRisks: ['Underestimating extreme peak values due to leaf averaging.']
    };

    return { baseline, primary, alternative };
  }

  // --- 6. TIME-SERIES FORECASTING ---
  private static getTimeSeriesCandidates(ctx: DecisionContext) {
    const isMultiSeries = ctx.temporalStructure === 'multiple_related_series';

    const baseline: AlgorithmCandidate = {
      name: 'Seasonal Naive & Exponential Smoothing (ETS)',
      family: 'Classical Univariate Time Series',
      tier: 'baseline',
      suitabilityScore: 88,
      whySuitable: 'Mandatory benchmark. Forecasts future periods using past seasonal lags or exponentially decaying weights. Often beats complex neural networks on noisy series.',
      assumptions: ['Regular sampling intervals without missing timestamps', 'Consistent seasonal cycle frequency.'],
      advantages: ['Zero hyperparameter tuning required', 'Runs in milliseconds', 'Provides probabilistic confidence intervals.'],
      disadvantages: ['Cannot incorporate external explanatory variables (pricing, weather, promotions).'],
      dataRequirements: 'Regular timestamped sequence (hourly, daily, weekly, or monthly).',
      interpretability: 'High',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Rolling-Origin Time-Series Cross-Validation (TimeSeriesSplit); NEVER random shuffle.',
      recommendedMetrics: ['MASE (Mean Absolute Scaled Error)', 'WAPE', 'MAE', 'Prediction Interval Coverage'],
      explainabilityOptions: ['Trend-Seasonal-Residual (STL) Decomposition Plots'],
      mainRisks: ['Failure during structural regime shifts or sudden external policy shocks.']
    };

    const primary: AlgorithmCandidate = isMultiSeries
      ? {
          name: 'LightGBM with Lagged & Rolling Window Features',
          family: 'Supervised Feature-Engineered Boosting',
          tier: 'primary',
          suitabilityScore: 95,
          whySuitable: 'Global forecasting champion for multiple related series. Learns cross-series dynamics while seamlessly incorporating external calendar, pricing, and promotional covariates.',
          assumptions: ['Strict lag feature construction without future lookahead leakage.'],
          advantages: [
            'Scales to hundreds of thousands of parallel series.',
            'Incorporates exogenous features natively.',
            'Fast training and low memory footprint.'
          ],
          disadvantages: [
            'Multi-step forecasting requires recursive predictions or direct multi-output models.'
          ],
          dataRequirements: 'Panel dataset with entity ID, timestamp, target, and exogenous features.',
          interpretability: 'Medium',
          computationalCost: 'Moderate (CPU/Single GPU)',
          implementationComplexity: 'Moderate',
          recommendedValidation: 'Temporal Expanding Window / Rolling-Origin Cross-Validation.',
          recommendedMetrics: ['WAPE', 'RMSSE', 'MASE', 'Forecast Bias'],
          explainabilityOptions: ['TreeSHAP over lag and exogenous features'],
          mainRisks: ['Error accumulation in recursive multi-step forecasting horizons.']
        }
      : {
          name: 'SARIMAX / AutoARIMA with Exogenous Regressors',
          family: 'Autoregressive Integrated Moving Average',
          tier: 'primary',
          suitabilityScore: 92,
          whySuitable: 'Standard statistical framework for single series forecasting with trend, seasonal differencing, and external regressors.',
          assumptions: ['Stationarity of differenced series (verified by ADF/KPSS)', 'Residual white noise (Ljung-Box test).'],
          advantages: ['Rigorous statistical inference', 'Theoretical prediction intervals.'],
          disadvantages: ['Computational scaling is poor for thousands of series', 'Sensitive to outliers and missing timestamps.'],
          dataRequirements: 'Uniformly sampled time-series without gaps.',
          interpretability: 'High',
          computationalCost: 'Moderate (CPU/Single GPU)',
          implementationComplexity: 'Moderate',
          recommendedValidation: 'Rolling-origin backtesting over test horizons.',
          recommendedMetrics: ['MASE', 'sMAPE', 'AIC / BIC (for model order selection)'],
          explainabilityOptions: ['AR/MA coefficient inspection and impulse response functions'],
          mainRisks: ['Model misspecification if non-stationarity is deterministic rather than stochastic.']
        };

    const advanced: AlgorithmCandidate = {
      name: 'Temporal Fusion Transformer (TFT) / PatchTST',
      family: 'Deep Learning for Time Series',
      tier: 'advanced',
      suitabilityScore: 82,
      whySuitable: 'State-of-the-art neural architecture for multi-horizon forecasting with interpretable multi-head attention and variable selection networks.',
      assumptions: ['Large volume of historical temporal sequences (> 100k timestamps).'],
      advantages: ['Self-attention over past and future horizons', 'Native quantile prediction intervals.'],
      disadvantages: ['Requires PyTorch / Darts infrastructure and GPU training', 'Excessive complexity for single small series.'],
      dataRequirements: 'Panel time-series across many entities with extensive history.',
      interpretability: 'Medium',
      computationalCost: 'High (GPU/Cluster required)',
      implementationComplexity: 'High',
      recommendedValidation: 'Chronological Train/Validation/Test split with sliding prediction horizons.',
      recommendedMetrics: ['Quantile Loss (Pinball)', 'WAPE', 'Coverage Probability'],
      explainabilityOptions: ['Variable Selection Weights', 'Temporal Self-Attention Heatmaps'],
      mainRisks: ['Overfitting if history is short; heavy deployment container requirements.']
    };

    return { baseline, primary, advanced };
  }

  // --- 7. CLUSTERING ---
  private static getClusteringCandidates(ctx: DecisionContext) {
    const isDensity = ctx.clusterGeometryExpectation === 'arbitrary_density';
    const isHierarchical = ctx.clusterGeometryExpectation === 'hierarchical_tree';

    const baseline: AlgorithmCandidate = {
      name: 'K-Means++ with Standardized Features',
      family: 'Centroid-Based Partitioning',
      tier: 'baseline',
      suitabilityScore: 88,
      whySuitable: 'Fast, interpretable clustering benchmark. Partitions observations into K Voronoi cells by minimizing within-cluster sum of squares (inertia).',
      assumptions: [
        'Clusters are spherical, convex, and have roughly comparable variance.',
        'Features are on comparable scales (StandardScaler is mandatory).',
        'Number of clusters K must be specified in advance.'
      ],
      advantages: ['Linear complexity O(n*K*d)', 'Scales to millions of points with MiniBatchKMeans.'],
      disadvantages: ['Fails on non-convex or concentric shapes', 'Heavily distorted by outliers.'],
      dataRequirements: 'Strictly numerical normalized continuous features.',
      interpretability: 'High',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Elbow Method, Silhouette Analysis, and Cluster Stability under Bootstrapping.',
      recommendedMetrics: ['Silhouette Score', 'Davies-Bouldin Index', 'Business Segment Interpretability'],
      explainabilityOptions: ['Cluster Centroid Radar Charts and Feature Distribution Boxplots'],
      mainRisks: ['Forcing non-clusterable random noise data into artificial clusters.']
    };

    const primary: AlgorithmCandidate = isDensity
      ? {
          name: 'HDBSCAN (Hierarchical Density-Based Spatial Clustering)',
          family: 'Density-Based Clustering',
          tier: 'primary',
          suitabilityScore: 94,
          whySuitable: 'Discovers clusters of arbitrary geometries and variable densities without requiring K to be specified. Automatically isolates noise and anomalies into an unassigned category.',
          assumptions: ['Clusters correspond to dense regions separated by sparse noise.'],
          advantages: [
            'Does not force outliers into fake clusters (outputs explicit noise label -1).',
            'Finds arbitrary shapes (crescents, rings, non-convex manifolds).',
            'No need to specify K.'
          ],
          disadvantages: ['Sensitive to distance metric selection and curse of dimensionality.'],
          dataRequirements: 'Continuous features or precomputed distance matrices; PCA/UMAP reduction recommended first.',
          interpretability: 'Medium',
          computationalCost: 'Moderate (CPU/Single GPU)',
          implementationComplexity: 'Moderate',
          recommendedValidation: 'Excess of Mass (EOM) persistence score and cluster stability checks.',
          recommendedMetrics: ['Relative Validity DBCV Score', 'Percentage of Unassigned Noise Points'],
          explainabilityOptions: ['2D UMAP projection colored by cluster assignments'],
          mainRisks: ['In high dimensions (p > 50), distance concentration makes density estimation unstable.']
        }
      : (isHierarchical
        ? {
            name: 'Agglomerative Hierarchical Clustering',
            family: 'Connectivity-Based Clustering',
            tier: 'primary',
            suitabilityScore: 92,
            whySuitable: 'Builds a bottom-up taxonomic tree (dendrogram) showing how micro-clusters merge into macro-segments at different distance thresholds.',
            assumptions: ['Valid pairwise distance matrix and appropriate linkage criterion (Ward, Complete, Average).'],
            advantages: ['Full dendrogram hierarchy allows flexible post-hoc selection of granularity.'],
            disadvantages: ['Quadratic memory complexity O(n^2); cannot scale past ~30,000 observations.'],
            dataRequirements: 'Continuous features scaled appropriately.',
            interpretability: 'High',
            computationalCost: 'Moderate (CPU/Single GPU)',
            implementationComplexity: 'Low',
            recommendedValidation: 'Cophenetic Correlation Coefficient and dendrogram height analysis.',
            recommendedMetrics: ['Silhouette Score', 'Cophenetic Correlation'],
            explainabilityOptions: ['Interactive Hierarchical Dendrogram'],
            mainRisks: ['Inability to scale to large datasets without subsampling.']
          }
        : {
            name: 'Gaussian Mixture Models (GMM)',
            family: 'Probabilistic Model-Based Clustering',
            tier: 'primary',
            suitabilityScore: 91,
            whySuitable: 'Soft clustering that estimates full elliptical covariance matrices, assigning observations probabilistic membership scores across K Gaussian distributions.',
            assumptions: ['Data is generated from a mixture of K multivariate normal distributions.'],
            advantages: ['Provides soft assignment probabilities', 'Accommodates oblong elliptical clusters.'],
            disadvantages: ['EM algorithm can converge to local optima; covariance estimation requires regularization.'],
            dataRequirements: 'Scaled continuous features.',
            interpretability: 'High',
            computationalCost: 'Moderate (CPU/Single GPU)',
            implementationComplexity: 'Moderate',
            recommendedValidation: 'BIC (Bayesian Information Criterion) and AIC minimization across K.',
            recommendedMetrics: ['BIC', 'Silhouette Score'],
            explainabilityOptions: ['Ellipsoidal Covariance Contour Plots'],
            mainRisks: ['Singular covariance matrices if sample size per cluster is too small.']
          });

    return { baseline, primary };
  }

  // --- 8. ANOMALY DETECTION ---
  private static getAnomalyCandidates(ctx: DecisionContext) {
    const isSupervised = ctx.anomalyLabelPresence === 'labeled_anomalies';

    if (isSupervised) {
      const baseline: AlgorithmCandidate = {
        name: 'Balanced Logistic Regression with Threshold Calibration',
        family: 'Cost-Sensitive Supervised Learning',
        tier: 'baseline',
        suitabilityScore: 89,
        whySuitable: 'Supervised baseline using class-weighted loss to penalize missed anomalies while preserving calibrated probabilities.',
        assumptions: ['Historical labeled anomalies are representative of future anomaly modes.'],
        advantages: ['Ultra-fast inference (< 1ms)', 'Direct probability estimation'],
        disadvantages: ['Fails when new unobserved attack vectors emerge (concept drift).'],
        dataRequirements: 'Historical data with verified anomaly tags.',
        interpretability: 'High',
        computationalCost: 'Low (CPU fast)',
        implementationComplexity: 'Low',
        recommendedValidation: 'Stratified K-Fold CV; Precision-Recall Curve threshold tuning.',
        recommendedMetrics: ['PR-AUC', 'Recall at 95% Precision', 'Expected Business Cost of Misclassification'],
        explainabilityOptions: ['Odds ratio feature contributions'],
        mainRisks: ['Survivorship bias: only detects types of fraud that past systems were able to catch.']
      };

      const primary: AlgorithmCandidate = {
        name: 'XGBoost with scale_pos_weight & Focal Loss',
        family: 'Gradient Boosted Decision Trees for Rare Events',
        tier: 'primary',
        suitabilityScore: 96,
        whySuitable: 'Industry standard for supervised fraud and defect detection. Heavily penalizes false negatives on minority class while capturing subtle multi-feature interactions.',
        assumptions: ['Sufficient anomaly examples to discover recurring behavioral patterns.'],
        advantages: ['Handles extreme imbalance', 'Outperforms deep networks on tabular fraud data.'],
        disadvantages: ['Must be continuously retrained as fraudsters adapt.'],
        dataRequirements: 'Tabular feature store with historical ground truth labels.',
        interpretability: 'Medium',
        computationalCost: 'Moderate (CPU/Single GPU)',
        implementationComplexity: 'Moderate',
        recommendedValidation: 'Temporal Out-of-Time Validation (train on months 1-6, test on month 7).',
        recommendedMetrics: ['PR-AUC', 'False Positive Rate at 90% Recall', 'Cost Savings ROI'],
        explainabilityOptions: ['TreeSHAP local force plots for each flagged transaction'],
        mainRisks: ['Adversarial drift: fraudsters alter behavior to bypass top SHAP features.']
      };

      return { baseline, primary };
    }

    // Unsupervised Anomaly Detection
    const baseline: AlgorithmCandidate = {
      name: 'Isolation Forest (iForest)',
      family: 'Randomized Tree Partitioning',
      tier: 'baseline',
      suitabilityScore: 94,
      whySuitable: 'Leading unsupervised anomaly detector. Isolates anomalies instead of modeling normal points: rare and unusual observations require fewer random splits to separate, yielding shorter path lengths.',
      assumptions: ['Anomalies are few in number and quantitatively distinct in feature space.'],
      advantages: [
        'Linear time complexity O(t*n*log(n)); scales to large datasets.',
        'Requires zero ground-truth labels.',
        'Insensitive to monotonic feature scaling.'
      ],
      disadvantages: ['Suffers in high-dimensional sparse spaces without prior dimension reduction.'],
      dataRequirements: 'Clean numerical feature matrix; impute missing values beforehand.',
      interpretability: 'Medium',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Contamination parameter sensitivity audit and synthetic outlier injection tests.',
      recommendedMetrics: ['Anomaly Score Distribution Spread', 'Manual Verification Sample Precision'],
      explainabilityOptions: ['Tree Path Length Attribution', 'Kernel SHAP over anomaly score function'],
      mainRisks: ['High false positive rate: flags harmless rare combinations that have no business risk.']
    };

    const primary: AlgorithmCandidate = {
      name: 'Local Outlier Factor (LOF) / Robust Mahalanobis Distance',
      family: 'Local Density & Covariance Estimation',
      tier: 'primary',
      suitabilityScore: 90,
      whySuitable: 'Detects anomalies relative to their local neighborhood density, identifying points that are outliers compared to nearby points even in multi-density regimes.',
      assumptions: ['Local density variations define normal vs abnormal status.'],
      advantages: ['Finds subtle local outliers that global methods miss.'],
      disadvantages: ['O(n^2) distance computation; slow for large serving pipelines.'],
      dataRequirements: 'Standardized continuous variables.',
      interpretability: 'Medium',
      computationalCost: 'Moderate (CPU/Single GPU)',
      implementationComplexity: 'Moderate',
      recommendedValidation: 'K-nearest neighbor distance distribution stability.',
      recommendedMetrics: ['Local Reachability Density Ratio'],
      explainabilityOptions: ['Nearest Neighbor Distance Decomposition'],
      mainRisks: ['Inference on streaming data requires storing historical reference points.']
    };

    const advanced: AlgorithmCandidate = {
      name: 'Deep Reconstruction Autoencoder',
      family: 'Self-Supervised Neural Networks',
      tier: 'advanced',
      suitabilityScore: 82,
      whySuitable: 'Trains an encoder-decoder network to reconstruct normal observations. Points with high reconstruction error ||x - x_hat||^2 are flagged as anomalies.',
      assumptions: ['Training data contains predominantly clean normal data.'],
      advantages: ['Handles complex non-linear combinations and multimodal data (images, signals).'],
      disadvantages: ['Risk of over-capacity: autoencoder may memorize and reconstruct anomalies cleanly.'],
      dataRequirements: 'Large dataset of primarily uncorrupted normal observations.',
      interpretability: 'Low',
      computationalCost: 'High (GPU/Cluster required)',
      implementationComplexity: 'High',
      recommendedValidation: 'Reconstruction error threshold calibration using ROC on validation holdouts.',
      recommendedMetrics: ['Reconstruction MSE Threshold', 'Latent Space Distance'],
      explainabilityOptions: ['Feature-level Reconstruction Error Attribution'],
      mainRisks: ['Bottleneck dimension tuning is precarious; requires GPU serving.']
    };

    return { baseline, primary, advanced };
  }

  // --- 9. RECOMMENDATION SYSTEMS ---
  private static getRecSysCandidates(_ctx: DecisionContext) {
    const baseline: AlgorithmCandidate = {
      name: 'Popularity-Based & Item-Item Cosine Similarity',
      family: 'Heuristic & Content-Based Collaborative Filtering',
      tier: 'baseline',
      suitabilityScore: 89,
      whySuitable: 'Foundational baseline. Recommends top items within category or items sharing highest TF-IDF/attribute cosine similarity. Solves the cold-start problem.',
      assumptions: ['Items with similar descriptive tags appeal to the same users.'],
      advantages: ['Works with zero user history (cold start)', 'Transparent reasoning ("Because you viewed X")'],
      disadvantages: ['Lacks personal taste discovery; produces repetitive recommendations.'],
      dataRequirements: 'Item metadata (categories, tags, attributes).',
      interpretability: 'High',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Temporal split (train on past interactions, test on subsequent week).',
      recommendedMetrics: ['Catalog Coverage', 'Precision@10', 'Novelty'],
      explainabilityOptions: ['Shared Attribute Tags Display'],
      mainRisks: ['Filter bubbles: recommending variations of the exact same item.']
    };

    const primary: AlgorithmCandidate = {
      name: 'Matrix Factorization (Implicit Alternating Least Squares / BPR)',
      family: 'Collaborative Filtering via Latent Factor Decomposition',
      tier: 'primary',
      suitabilityScore: 95,
      whySuitable: 'Standard engine for user-item implicit interactions (clicks, purchases, views). Decomposes interaction matrix into low-rank user and item embeddings.',
      assumptions: ['User preferences can be captured by k latent factor dimensions.'],
      advantages: ['Discovers serendipitous recommendations', 'Fast vector similarity lookup with FAISS/ScaNN.'],
      disadvantages: ['Severe cold-start failure for brand new users or items.'],
      dataRequirements: 'Sparse interaction matrix: (user_id, item_id, count/timestamp).',
      interpretability: 'Medium',
      computationalCost: 'Moderate (CPU/Single GPU)',
      implementationComplexity: 'Moderate',
      recommendedValidation: 'Leave-One-Out or Temporal User-Wise Holdout.',
      recommendedMetrics: ['NDCG@10', 'MAP@10', 'HitRate@10'],
      explainabilityOptions: ['Latent Factor Projection & Neighbor Visualization'],
      mainRisks: ['Popularity bias: disproportionately recommending blockbuster items.']
    };

    return { baseline, primary };
  }

  // --- 10. CAUSAL INFERENCE ---
  private static getCausalInferenceCandidates(_ctx: DecisionContext) {
    const baseline: AlgorithmCandidate = {
      name: 'Ordinary Least Squares with Covariate Adjustment',
      family: 'Linear Parametric Causal Modeling',
      tier: 'baseline',
      suitabilityScore: 88,
      whySuitable: 'Primary baseline under unconfoundedness. Regresses outcome Y on treatment T while controlling for observed confounders X.',
      assumptions: [
        'Conditional Independence / No unobserved confounders: (Y(0), Y(1)) independent of T | X.',
        'Positivity (Overlap): 0 < P(T=1|X) < 1 for all X.',
        'SUTVA (No spillover / Stable Unit Treatment Value Assumption).'
      ],
      advantages: ['Treatment coefficient directly represents Average Treatment Effect (ATE)', 'Clear standard errors.'],
      disadvantages: ['Assumes linear functional form; vulnerable to model misspecification.'],
      dataRequirements: 'Observational or experimental data with treatment indicator, outcome, and all confounders.',
      interpretability: 'High',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Placebo tests, refutation tests, and covariate balance diagnostics (Standardized Mean Differences).',
      recommendedMetrics: ['Estimated ATE with 95% Confidence Interval', 'Covariate Balance SMD < 0.1'],
      explainabilityOptions: ['Linear coefficient summary and balance plots'],
      mainRisks: ['Unobserved confounding bias; interpreting predictive weights as causal effects.']
    };

    const primary: AlgorithmCandidate = {
      name: 'Double Machine Learning (DML) / Causal Forest (EconML)',
      family: 'Non-Parametric Causal Estimation',
      tier: 'primary',
      suitabilityScore: 96,
      whySuitable: 'State-of-the-art framework uniting ML predictive power with causal identification. Uses Neyman-orthogonal scores and cross-fitting to eliminate regularization bias, estimating Heterogeneous Treatment Effects (CATE).',
      assumptions: ['Unconfoundedness given high-dimensional observed covariates', 'Positivity overlap.'],
      advantages: [
        'Allows flexible gradient boosting / neural nets for nuisance functions without biasing causal estimate.',
        'Identifies which customer subgroups benefit most from the intervention.',
        'Mathematically valid asymptotic confidence intervals.'
      ],
      disadvantages: ['Requires deep understanding of causal DAGs and potential outcomes.'],
      dataRequirements: 'Rich covariate matrix containing all common causes of treatment and outcome.',
      interpretability: 'High',
      computationalCost: 'Moderate (CPU/Single GPU)',
      implementationComplexity: 'High',
      recommendedValidation: 'Cross-fitting refutation tests, random common cause addition, placebo treatment tests.',
      recommendedMetrics: ['Policy Value', 'CATE Uplift Curve', 'QINI Curve'],
      explainabilityOptions: ['Tree-based subgroup policy visualization and CATE SHAP attributions'],
      mainRisks: ['Violating unconfoundedness: if an unmeasured business variable drives treatment, results are biased.']
    };

    return { baseline, primary };
  }

  // --- 11. REINFORCEMENT LEARNING ---
  private static getReinforcementLearningCandidates(ctx: DecisionContext) {
    const isBandit = ctx.rlFeedbackLoop === 'immediate_contextual';

    if (isBandit) {
      const baseline: AlgorithmCandidate = {
        name: 'LinUCB / Thompson Sampling Contextual Bandit',
        family: 'Multi-Armed Bandits with Context',
        tier: 'baseline',
        suitabilityScore: 95,
        whySuitable: 'Ideal for real-time personalization (dynamic ad selection, recommendations, pricing). Balances exploration of uncertain arms with exploitation of proven top performers.',
        assumptions: ['Immediate feedback loop; decisions do not permanently alter environment state transition.'],
        advantages: ['Adapts in real-time', 'Minimizes cumulative regret', 'No complex offline Markov chain modeling.'],
        disadvantages: ['Cannot handle multi-step delayed rewards.'],
        dataRequirements: 'Logged contextual interaction stream: (context X, action A, reward R, propensity p).',
        interpretability: 'High',
        computationalCost: 'Low (CPU fast)',
        implementationComplexity: 'Moderate',
        recommendedValidation: 'Offline Policy Evaluation (Doubly Robust Estimation / Inverse Propensity Scoring).',
        recommendedMetrics: ['Cumulative Regret', 'Expected Policy Value'],
        explainabilityOptions: ['Arm Selection Probabilities and Confidence Intervals'],
        mainRisks: ['Logging policy bias in offline training data.']
      };

      return { baseline };
    }

    const baseline: AlgorithmCandidate = {
      name: 'Proximal Policy Optimization (PPO) with Discrete/Continuous Action Spaces',
      family: 'Policy Gradient Reinforcement Learning',
      tier: 'baseline',
      suitabilityScore: 92,
      whySuitable: 'Industry workhorse for sequential decision making with delayed rewards. Clipped surrogate objective prevents destructively large policy updates, ensuring stable optimization.',
      assumptions: ['System satisfies Markov Property: P(S_{t+1}|S_t, A_t) is independent of past history.', 'Accurate simulation environment or high-fidelity digital twin.'],
      advantages: ['Stable policy improvement', 'Works with continuous and discrete action spaces.'],
      disadvantages: ['Sample inefficient: requires millions of environment interactions', 'Extremely difficult to deploy safely in live physical systems.'],
      dataRequirements: 'Fast gym-compatible simulation environment or logged offline MDP transitions.',
      interpretability: 'Low',
      computationalCost: 'High (GPU/Cluster required)',
      implementationComplexity: 'High',
      recommendedValidation: 'Episodic evaluation across randomized environment seeds.',
      recommendedMetrics: ['Mean Episodic Cumulative Reward', 'Success Rate', 'Constraint Violation Frequency'],
      explainabilityOptions: ['Policy Value Function Trajectory Visualizations'],
      mainRisks: ['Reward hacking: agent exploits glitches in the simulation environment instead of learning real task.']
    };

    return { baseline };
  }

  // --- 12. NLP ---
  private static getNlpCandidates(ctx: DecisionContext) {
    const isFastCpu = ctx.computationalBudget === 'low_laptop_cpu';

    const baseline: AlgorithmCandidate = {
      name: 'TF-IDF with Linear Support Vector Machine / Logistic Regression',
      family: 'N-gram Bag of Words Linear Model',
      tier: 'baseline',
      suitabilityScore: 93,
      whySuitable: 'Unbeatable lightweight baseline. Sub-5ms CPU inference, zero GPU requirements, and remarkably strong accuracy on topical classification and sentiment.',
      assumptions: ['Word order beyond 2-grams is not required to determine the class.'],
      advantages: [
        'Trains in seconds on a standard laptop CPU.',
        'Extremely low latency (< 5ms) for high-throughput microservices.',
        'Inspectable word coefficients.'
      ],
      disadvantages: ['Lacks semantic context (e.g. polysemy, negation nuances, sarcasm).'],
      dataRequirements: 'Labeled text corpora (500+ samples per class).',
      interpretability: 'High',
      computationalCost: 'Low (CPU fast)',
      implementationComplexity: 'Low',
      recommendedValidation: 'Stratified 5-Fold Cross-Validation.',
      recommendedMetrics: ['Macro-F1', 'Balanced Accuracy', 'Inference Latency (ms)'],
      explainabilityOptions: ['Top positive and negative n-gram weights'],
      mainRisks: ['Out-of-vocabulary terms and spelling errors in raw text.']
    };

    const primary: AlgorithmCandidate = isFastCpu
      ? {
          name: 'FastText / DistilBERT Fine-Tuning',
          family: 'Distilled Transformer / Subword Embeddings',
          tier: 'primary',
          suitabilityScore: 94,
          whySuitable: 'Provides deep contextual representations while being 40% smaller and 60% faster than standard BERT, running comfortably on commodity cloud instances.',
          assumptions: ['Language matches pretraining distribution.'],
          advantages: ['Captures contextual word semantics and syntax', 'Modest hardware requirements.'],
          disadvantages: ['Requires PyTorch / HuggingFace serving container.'],
          dataRequirements: 'Labeled text dataset; benefits from domain adaptation.',
          interpretability: 'Medium',
          computationalCost: 'Moderate (CPU/Single GPU)',
          implementationComplexity: 'Moderate',
          recommendedValidation: 'Stratified Train/Val/Test with early stopping.',
          recommendedMetrics: ['Macro-F1', 'Classification Report'],
          explainabilityOptions: ['Integrated Gradients token attribution'],
          mainRisks: ['Latency overhead compared to TF-IDF.']
        }
      : {
          name: 'DeBERTa-v3 / ModernBERT Small Encoder',
          family: 'Pretrained Transformer Architecture',
          tier: 'primary',
          suitabilityScore: 97,
          whySuitable: 'State-of-the-art text representation using disentangled attention and enhanced masked language modeling. Exceptional accuracy on complex classification tasks.',
          assumptions: ['Token sequence length fits within maximum context window.'],
          advantages: ['Highest attainable F1 score on NLP benchmarks', 'Captures subtle nuances and negations.'],
          disadvantages: ['Requires GPU serving infrastructure (ONNX / TensorRT-LLM optimization recommended).'],
          dataRequirements: 'GPU for fine-tuning.',
          interpretability: 'Low',
          computationalCost: 'High (GPU/Cluster required)',
          implementationComplexity: 'Moderate',
          recommendedValidation: 'Stratified 5-Fold Cross-Validation with mixed-precision training.',
          recommendedMetrics: ['Macro-F1', 'Loss Curve Convergence'],
          explainabilityOptions: ['Attention map visualization', 'Integrated Gradients'],
          mainRisks: ['High cloud inference cost at scale.']
        };

    return { baseline, primary };
  }
}
