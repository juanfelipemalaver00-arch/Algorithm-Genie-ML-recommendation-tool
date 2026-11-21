import { 
  DecisionContext, 
  ComprehensiveDiagnosisResult, 
  DataReadinessStatus 
} from '../types/decision';
import { RecommendationEngine } from './RecommendationEngine';
import { ValidationAdvisor } from './ValidationAdvisor';
import { RoadmapGenerator } from './RoadmapGenerator';
import { ScopeValidator } from './ScopeValidator';

export class DiagnosticOrchestrator {
  public static synthesize(ctx: DecisionContext): ComprehensiveDiagnosisResult {
    // 1. Data Readiness Evaluation
    const { status, headline, explanation, immediateActionItems } = this.evaluateDataReadiness(ctx);

    // 2. Scope Assessment
    const scopeAssessment = ScopeValidator.evaluateScope(ctx);

    // 3. Algorithm Candidates
    const candidates = RecommendationEngine.generateCandidates(ctx);

    // 4. Validation Protocol & Assumptions
    const validationProtocol = ValidationAdvisor.generateProtocol(ctx);

    // 5. Explainability Protocol
    const explainabilityProtocol = this.generateExplainabilityProtocol(ctx);

    // 6. Roadmap
    const roadmap = RoadmapGenerator.generateRoadmap(ctx);

    // 7. Deployment Recommendation
    const deploymentRecommendation = this.generateDeploymentRecommendation(ctx);

    return {
      context: ctx,
      scopeCoverage: scopeAssessment.coverage,
      outOfScopeDetails: scopeAssessment.familyNotCovered ? {
        familyNotCovered: scopeAssessment.familyNotCovered,
        whyCannotRecommend: scopeAssessment.whyCannotRecommend || '',
        requiredSpecializedAnalysis: scopeAssessment.requiredSpecializedAnalysis || ''
      } : undefined,
      dataReadiness: {
        status,
        headline,
        explanation,
        immediateActionItems
      },
      candidates,
      validationProtocol,
      explainabilityProtocol,
      roadmap,
      deploymentRecommendation
    };
  }

  private static evaluateDataReadiness(ctx: DecisionContext): {
    status: DataReadinessStatus;
    headline: string;
    explanation: string;
    immediateActionItems: string[];
  } {
    if (ctx.dataModality === 'no_data' || ctx.observationCount === 'zero') {
      return {
        status: 'not_ready',
        headline: 'Critical Data Roadblock: No Historical Data Available',
        explanation: 'Machine learning algorithms require empirical observations to discover functional relationships. Attempting to select algorithms without historical data is premature.',
        immediateActionItems: [
          'Design and implement an event logging schema capturing business entity interactions.',
          'Define data retention policies and point-in-time timestamping.',
          'Accumulate at least 1,000 to 5,000 representative sample transactions before modeling.'
        ]
      };
    }

    if (ctx.mlNecessity === 'heuristics_better') {
      return {
        status: 'not_ready',
        headline: 'Deterministic Rules More Appropriate than ML',
        explanation: 'The analytical logic can be cleanly expressed with deterministic SQL or business heuristics. Introducing an ML pipeline would add unnecessary operational debt.',
        immediateActionItems: [
          'Draft clear decision rule tables with domain experts.',
          'Implement rules in SQL views or lightweight rule engine.',
          'Benchmark rule accuracy against business objectives.'
        ]
      };
    }

    const issues: string[] = [];
    if (ctx.labelReliability === 'unreliable_ambiguous') {
      issues.push('Significant label noise or subjective annotation inconsistency detected.');
    }
    if (ctx.targetLeakageRisk === 'high_leakage_detected') {
      issues.push('Severe risk of target leakage: some features contain retrospective post-event information.');
    }
    if (ctx.missingDataMechanism === 'MNAR') {
      issues.push('Missing Not At Random (MNAR) data patterns detected; missingness itself carries selective survival bias.');
    }
    if (ctx.labelAvailability === 'partially_labeled') {
      issues.push('Only a small percentage of observations possess verified ground truth labels.');
    }

    if (issues.length > 0) {
      return {
        status: 'conditionally_ready',
        headline: 'Conditionally Ready: Critical Data Remediation Required Before Modeling',
        explanation: `Modeling is technically possible, but the following issues must be resolved to prevent deceptive validation scores: ${issues.join(' ')}`,
        immediateActionItems: [
          'Audit feature store columns to guarantee zero post-event lookahead leakage.',
          'Execute label confidence analysis (Cleanlab) or dual-annotator consensus reviews.',
          'Engineer explicit missingness indicator boolean flags (is_missing_x) before imputation.'
        ]
      };
    }

    return {
      status: 'ready',
      headline: 'Ready for Controlled Modeling Experiments',
      explanation: 'Sufficient sample size, verified labels, and clean feature definitions allow proceeding to baseline model training under disciplined cross-validation.',
      immediateActionItems: [
        'Establish leak-free cross-validation splits.',
        'Train simple interpretable baseline (e.g. Regularized Logistic/Linear Regression).',
        'Profile baseline calibration and residual distributions.'
      ]
    };
  }

  private static generateExplainabilityProtocol(ctx: DecisionContext) {
    const isStrict = ctx.interpretabilityRequirement === 'strict_regulatory';

    return {
      level: isStrict ? 'Strict Glass-Box Auditing Required' : 'Post-Hoc Feature Attribution & Trust Building',
      recommendedTechniques: [
        {
          technique: 'TreeSHAP (Shapley Additive Explanations)',
          scope: 'Both' as const,
          rationale: 'Provides mathematically consistent local prediction attributions based on cooperative game theory, alongside global feature impact beeswarm plots.',
          criticalWarning: 'MANDATORY CAUTION: SHAP values quantify statistical feature attribution to the model score. They DO NOT prove causal mechanisms in the real world.'
        },
        {
          technique: 'Partial Dependence Plots (PDP) & ICE Curves',
          scope: 'Global' as const,
          rationale: 'Visualizes the marginal effect of one or two features on the predicted outcome, revealing non-linear curves and interaction patterns.',
          criticalWarning: 'PDP assumes independence between features; if features are highly correlated, PDP calculates predictions in impossible data regions.'
        },
        {
          technique: 'Permutation Feature Importance',
          scope: 'Global' as const,
          rationale: 'Measures increase in prediction error after randomly shuffling feature values on out-of-fold validation sets.',
          criticalWarning: 'Unlike GBDT gain/impurity importance, permutation importance is computed on unseen validation data and does not artificially favor high-cardinality features.'
        }
      ]
    };
  }

  private static generateDeploymentRecommendation(ctx: DecisionContext) {
    const isRealTime = ctx.latencyRequirement === 'ultra_low_ms';

    if (isRealTime) {
      return {
        pattern: 'Low-Latency Microservice REST / gRPC API',
        architecture: 'FastAPI async Python service or compiled C++ ONNX/Treelite binary packaged in a Docker container deployed to Kubernetes or Google Cloud Run with auto-scaling.',
        monitoringRequirements: [
          'Inference P99 Latency (target < 30ms)',
          'Input Feature Drift using Population Stability Index (PSI)',
          'Daily Class Prediction Ratio Stability',
          'Missing Value Frequency Spike Alerts'
        ]
      };
    }

    return {
      pattern: 'Scheduled Offline Batch Inference Pipeline',
      architecture: 'Batch inference job executed nightly via Apache Airflow / Cloud Composer reading from SQL warehouse tables (BigQuery/Snowflake) and writing scored predictions back to an analytics table.',
      monitoringRequirements: [
        'Batch Execution Time & Memory Footprint',
        'Data Distribution KS-Test against Training Baseline',
        'Null Value Ingestion Spikes',
        'Upstream Schema Contract Changes'
      ]
    };
  }
}
