import { 
  DecisionContext, 
  ValidationProtocol, 
  StatisticalDiagnostic 
} from '../types/decision';

export class ValidationAdvisor {
  public static generateProtocol(ctx: DecisionContext): ValidationProtocol {
    const family = ctx.problemFamily || 'supervised_binary_classification';
    const isExtremeImbalance = ctx.classImbalance === 'extreme_rare_events';
    const isTemporal = family === 'time_series_forecasting' || ctx.dataModality === 'time_series';

    // 1. Determine Validation Split Strategy
    let splitStrategy = 'Stratified 5-Fold Cross-Validation';
    let splitJustification = 'Preserves class balance across all training and test folds, reducing variance in evaluation estimates.';

    if (isTemporal) {
      splitStrategy = 'Rolling-Origin Time-Series Cross-Validation (Expanding Window)';
      splitJustification = 'CRITICAL: Observations are temporally dependent. Random k-fold shuffling is strictly prohibited because future data would leak into training, causing lookahead bias and illusory high accuracy.';
    } else if (family === 'unsupervised_clustering') {
      splitStrategy = 'Bootstrap Stability Resampling (B=100 folds) & Train/Holdout Silhouette Evaluation';
      splitJustification = 'Evaluates whether discovered clusters are robust to random perturbations or merely artifacts of sample noise.';
    } else if (family === 'causal_inference') {
      splitStrategy = 'Double ML K-Fold Cross-Fitting (e.g. 5-fold cross-fitting)';
      splitJustification = 'Eliminates regularization bias and overfitting of nuisance parameters when estimating causal treatment effects.';
    } else if (family === 'supervised_regression') {
      splitStrategy = 'Repeated K-Fold Cross-Validation (5 folds, 3 repeats)';
      splitJustification = 'Standard unbiased estimator of out-of-sample generalization error for continuous independent observations.';
    }

    // 2. Data Leakage Prevention Rules
    const leakagePreventionRules: string[] = [
      'Fit all transformers (StandardScaler, OneHotEncoder, SimpleImputer) exclusively on the training fold; then call transform() on validation/test folds.',
      'Target Encoding must use out-of-fold target calculation (K-Fold Target Encoding) to prevent target leakage into training features.',
      'Feature selection must be performed inside cross-validation loops, never globally prior to splitting.'
    ];

    if (isTemporal) {
      leakagePreventionRules.push('Strictly enforce point-in-time feature computation: features at timestamp t must use only data available at <= t.');
      leakagePreventionRules.push('Lag features and rolling statistics must not include the current observation t=0 if predicting ahead.');
    } else {
      leakagePreventionRules.push('If multiple observations belong to the same entity (e.g. user, patient, store), use GroupKFold to ensure entities never leak across train and test sets.');
    }

    // 3. Recommended Evaluation Metrics
    const metricsRecommended: { name: string; description: string; whyRelevantForCase: string }[] = [];

    if (family === 'supervised_binary_classification') {
      if (isExtremeImbalance) {
        metricsRecommended.push(
          {
            name: 'PR-AUC (Precision-Recall Area Under Curve / Average Precision)',
            description: 'Summarizes tradeoff between true positive rate and positive predictive value across all thresholds.',
            whyRelevantForCase: 'MANDATORY for rare events. Unlike ROC-AUC, PR-AUC does not get artificially inflated by a massive true negative class.'
          },
          {
            name: 'Brier Score & Expected Calibration Error (ECE)',
            description: 'Mean squared difference between predicted probabilities and actual binary outcomes.',
            whyRelevantForCase: 'Ensures output probabilities can be trusted for financial risk calculations, rather than being uncalibrated rank scores.'
          },
          {
            name: 'Cost-Weighted Utility Matrix',
            description: 'Total Financial Impact = (TP * Reward) - (FP * Inspection Cost) - (FN * Catastrophic Miss Cost).',
            whyRelevantForCase: 'Aligns algorithmic threshold directly with business profit, since a False Negative is far more expensive than a False Positive.'
          }
        );
      } else {
        metricsRecommended.push(
          {
            name: 'ROC-AUC',
            description: 'Area under the receiver operating characteristic curve.',
            whyRelevantForCase: 'Standard measure of ranking quality across all classification thresholds.'
          },
          {
            name: 'Brier Score',
            description: 'Measures calibration and sharpness of predicted probabilities.',
            whyRelevantForCase: 'Validates that a 70% prediction corresponds to an actual 70% empirical probability.'
          },
          {
            name: 'Balanced Accuracy & F1-Macro',
            description: 'Harmonic mean of precision and recall unweighted by class frequency.',
            whyRelevantForCase: 'Prevents majority class dominance.'
          }
        );
      }
    } else if (family === 'supervised_regression') {
      metricsRecommended.push(
        {
          name: 'RMSE (Root Mean Squared Error)',
          description: 'Square root of average squared residual errors in original target units.',
          whyRelevantForCase: 'Penalizes large outlier mistakes heavily; matches Euclidean loss.'
        },
        {
          name: 'MAE (Mean Absolute Error)',
          description: 'Average magnitude of errors without quadratic exaggeration.',
          whyRelevantForCase: 'Directly interpretable average error per observation, robust to extreme outliers.'
        },
        {
          name: 'WAPE (Weighted Absolute Percentage Error)',
          description: 'Sum of absolute errors divided by total sum of actual target.',
          whyRelevantForCase: 'Avoids division-by-zero problems inherent in MAPE when actual target values are small or zero.'
        }
      );
    } else if (family === 'time_series_forecasting') {
      metricsRecommended.push(
        {
          name: 'MASE (Mean Absolute Scaled Error)',
          description: 'Compares model MAE against a naive seasonal persistence baseline.',
          whyRelevantForCase: 'Independent of series scale; a score < 1 proves the model is genuinely outperforming a trivial seasonal baseline.'
        },
        {
          name: 'WAPE',
          description: 'Total absolute forecast error divided by total volume.',
          whyRelevantForCase: 'Standard supply-chain and demand planning metric.'
        },
        {
          name: 'Forecast Bias (Mean Error)',
          description: 'Average signed error indicating whether model systematically over- or under-forecasts.',
          whyRelevantForCase: 'Identifies structural warehouse over-stocking or under-stocking tendencies.'
        }
      );
    } else if (family === 'unsupervised_clustering') {
      metricsRecommended.push(
        {
          name: 'Silhouette Coefficient (-1 to +1)',
          description: 'Measures how similar an observation is to its own cluster compared to neighboring clusters.',
          whyRelevantForCase: 'Evaluates cluster compactness and separation. Note: Internal metrics do not prove business validity.'
        },
        {
          name: 'Davies-Bouldin Index',
          description: 'Ratio of within-cluster distances to between-cluster distances (lower is better).',
          whyRelevantForCase: 'Fast validation of cluster separation.'
        },
        {
          name: 'Resampling Cluster Stability (Jaccard Index across bootstraps)',
          description: 'Measures whether identical cluster memberships emerge when re-running on data subsets.',
          whyRelevantForCase: 'Ensures discovered segments are persistent and actionable, not random noise artifacts.'
        }
      );
    } else {
      metricsRecommended.push(
        {
          name: 'Primary Domain Metric',
          description: 'Domain-specific utility function.',
          whyRelevantForCase: 'Directly tied to the analytical objective.'
        }
      );
    }

    // 4. Statistical Diagnostics
    const statisticalDiagnostics = this.getDiagnosticsForFamily(family);

    return {
      splitStrategy,
      splitJustification,
      leakagePreventionRules,
      metricsRecommended,
      statisticalDiagnostics
    };
  }

  private static getDiagnosticsForFamily(family: string): StatisticalDiagnostic[] {
    switch (family) {
      case 'supervised_binary_classification':
      case 'supervised_multiclass_classification':
        return [
          {
            assumptionOrCondition: 'Logit Linearity of Continuous Features (Logistic Regression)',
            strictness: 'Approximate / Robust',
            diagnosticProcedure: 'Box-Tidwell test (regressing y on x and x*ln(x)) or inspecting Component-plus-Residual (partial residual) plots.',
            interpretationOfViolation: 'Indicates non-linear relationship between feature and log-odds, causing systematic underestimation at extreme ranges.',
            remediationAction: 'Use restricted cubic splines, binning, or upgrade from Logistic Regression to Explainable Boosting Machine (EBM) / LightGBM.'
          },
          {
            assumptionOrCondition: 'Multicollinearity among Predictors',
            strictness: 'Approximate / Robust',
            diagnosticProcedure: 'Compute Variance Inflation Factors (VIF) on feature correlation matrix. Flag features with VIF > 5.0.',
            interpretationOfViolation: 'Inflated standard errors, unstable coefficients with swinging signs, and loss of interpretability.',
            remediationAction: 'Apply L2 Ridge regularization, drop redundant collinear features, or utilize PCA dimensionality reduction.'
          },
          {
            assumptionOrCondition: 'Complete or Quasi-Complete Separation',
            strictness: 'Strict Requirement',
            diagnosticProcedure: 'Check maximum likelihood convergence warnings and identify coefficients with astronomical magnitudes (> 50) and enormous standard errors.',
            interpretationOfViolation: 'A predictor (or linear combination) perfectly predicts the target, causing MLE weights to diverge to infinity.',
            remediationAction: 'Apply Firth’s penalized likelihood logistic regression or switch to tree-based models.'
          },
          {
            assumptionOrCondition: 'Probability Calibration Quality',
            strictness: 'Engineering / Empirical Practicality',
            diagnosticProcedure: 'Generate Calibration Reliability Diagram (plotting predicted probability deciles vs empirical observed positive rates).',
            interpretationOfViolation: 'Model outputs overconfident probabilities (e.g. predictions of 95% only succeed 70% of the time).',
            remediationAction: 'Fit an isotonic regression or Platt scaling sigmoid calibrator on an independent validation holdout set.'
          }
        ];

      case 'supervised_regression':
        return [
          {
            assumptionOrCondition: 'Linearity of the Conditional Mean (Strict for OLS; Not required for Tree-based models)',
            strictness: 'Strict Requirement',
            diagnosticProcedure: 'Plot residuals (y - y_hat) against fitted values y_hat, and perform Ramsey RESET test.',
            interpretationOfViolation: 'Curvature in residual plot indicates missing quadratic, interaction, or non-linear terms.',
            remediationAction: 'Include polynomial features, logarithmic transforms, or use tree-based models (CatBoost/RandomForest).'
          },
          {
            assumptionOrCondition: 'Homoscedasticity of Residual Variance',
            strictness: 'Approximate / Robust',
            diagnosticProcedure: 'Breusch-Pagan test or White test for heteroscedasticity.',
            interpretationOfViolation: 'Residual variance expands or shrinks with prediction magnitude; standard OLS confidence intervals are invalid.',
            remediationAction: 'Use Huber-White robust standard errors (sandwich estimator) or log-transform the target variable.'
          },
          {
            assumptionOrCondition: 'Absence of Influential High-Leverage Outliers',
            strictness: 'Engineering / Empirical Practicality',
            diagnosticProcedure: 'Calculate Cook’s Distance for each observation; flag points with Cook’s D > 4/n.',
            interpretationOfViolation: 'A handful of anomalous data points exert disproportionate pull on the regression plane.',
            remediationAction: 'Audit flagged records for logging errors, replace MSE with Huber/MAE robust loss, or use RANSAC regressor.'
          }
        ];

      case 'time_series_forecasting':
        return [
          {
            assumptionOrCondition: 'Stationarity of Modeled Series (ARIMA/SARIMA)',
            strictness: 'Strict Requirement',
            diagnosticProcedure: 'Run Augmented Dickey-Fuller (ADF) test (H0: unit root) and KPSS test (H0: stationarity).',
            interpretationOfViolation: 'Non-stationary mean or variance leads to spurious regressions and unstable forecasts.',
            remediationAction: 'Apply first-order differencing (d=1), seasonal differencing (D=1), or Box-Cox variance stabilization.'
          },
          {
            assumptionOrCondition: 'Autocorrelation of Residuals (White Noise Check)',
            strictness: 'Strict Requirement',
            diagnosticProcedure: 'Ljung-Box Q-test on forecast residuals across multiple lags (e.g. lag 10, 20) and inspection of ACF/PACF plots.',
            interpretationOfViolation: 'Residuals contain unmodeled temporal signal; past errors predict future errors, proving model under-specification.',
            remediationAction: 'Increase autoregressive order (p) or moving-average order (q), or incorporate missing seasonal lag features.'
          }
        ];

      case 'unsupervised_clustering':
        return [
          {
            assumptionOrCondition: 'Feature Scale Comparability & Outlier Distortion (K-Means)',
            strictness: 'Strict Requirement',
            diagnosticProcedure: 'Verify feature variance ratios and compute Mahalanobis outlier distances before clustering.',
            interpretationOfViolation: 'Features with large numeric ranges dominate Euclidean distance, rendering small-variance features irrelevant.',
            remediationAction: 'Apply RobustScaler or StandardScaler; replace K-Means with K-Medoids or HDBSCAN if extreme outliers are present.'
          },
          {
            assumptionOrCondition: 'Cluster Tendency (Hopkins Statistic)',
            strictness: 'Engineering / Empirical Practicality',
            diagnosticProcedure: 'Calculate Hopkins Statistic H on feature matrix (testing whether data differs from uniform random distribution).',
            interpretationOfViolation: 'If H is near 0.5, data is uniformly distributed random noise; any clusters found by algorithms are spurious illusions.',
            remediationAction: 'H must be > 0.7 to justify clustering. If H < 0.6, reject clustering and do not force segment definitions.'
          }
        ];

      default:
        return [
          {
            assumptionOrCondition: 'Independent and Identically Distributed (I.I.D.) Sampling',
            strictness: 'Strict Requirement',
            diagnosticProcedure: 'Check for temporal autocorrelation, grouped clusters, or spatial correlation in the sampling frame.',
            interpretationOfViolation: 'Standard cross-validation yields overly optimistic performance metrics due to hidden data leakage.',
            remediationAction: 'Use GroupKFold, TimeSeriesSplit, or Spatial Block Cross-Validation matching the data generation process.'
          }
        ];
    }
  }
}
