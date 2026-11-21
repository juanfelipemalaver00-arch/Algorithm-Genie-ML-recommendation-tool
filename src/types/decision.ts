export type NodeId = string;

export type StageId = 
  | 'stage_1_ml_necessity'
  | 'stage_2_data_readiness'
  | 'stage_3_problem_identification'
  | 'stage_4_algorithm_selection'
  | 'stage_5_evaluation_metrics'
  | 'stage_6_validation_assumptions'
  | 'stage_7_explainability'
  | 'stage_8_recommendations';

export type ExplanationLevel = 'simple' | 'technical';

export type DataReadinessStatus = 'ready' | 'conditionally_ready' | 'not_ready';

export type ScopeCoverage = 'fully_covered' | 'partially_covered' | 'outside_scope';

export type ProblemFamily = 
  | 'no_ml_needed'
  | 'no_data'
  | 'supervised_binary_classification'
  | 'supervised_multiclass_classification'
  | 'supervised_multilabel_classification'
  | 'supervised_regression'
  | 'time_series_forecasting'
  | 'unsupervised_clustering'
  | 'unsupervised_dimensionality_reduction'
  | 'anomaly_detection_unsupervised'
  | 'anomaly_detection_supervised'
  | 'recommendation_systems'
  | 'causal_inference'
  | 'reinforcement_learning'
  | 'survival_analysis'
  | 'nlp_text_classification'
  | 'computer_vision'
  | 'graph_ml'
  | 'geospatial_ml'
  | 'multimodal'
  | 'out_of_scope_advanced';

export interface AnswerOption {
  id: string;
  label: string;
  description?: string;
  technicalDetails?: string;
  nextNodeId: NodeId;
  tag?: string;
  contextUpdates?: Partial<DecisionContext>;
}

export interface DiagnosticNode {
  id: NodeId;
  stage: StageId;
  stageName: string;
  question: string;
  whyItMatters: {
    simple: string;
    technical: string;
  };
  options: AnswerOption[];
  allowTextInput?: boolean;
  textInputPlaceholder?: string;
  textInputNextNodeId?: NodeId;
  technicalConsiderations?: string[];
  warnings?: string[];
  isTerminal?: boolean;
}

export interface DecisionContext {
  objectiveDescription?: string;
  objectiveType?: string;
  mlNecessity?: 'not_needed' | 'heuristics_better' | 'ml_justified';
  alternativeSuggested?: string;
  modelUsage?: 'exploratory' | 'internal_decision' | 'automated_business' | 'customer_facing_realtime' | 'batch_predictions' | 'scientific_research';
  costOfErrors?: 'low' | 'moderate' | 'high_critical';
  latencyRequirement?: 'ultra_low_ms' | 'interactive_subsecond' | 'batch_no_hurry';
  interpretabilityRequirement?: 'strict_regulatory' | 'high_business_trust' | 'moderate' | 'black_box_acceptable';
  computationalBudget?: 'low_laptop_cpu' | 'medium_single_gpu_cloud' | 'high_distributed_cluster';
  
  dataModality?: 'tabular' | 'text' | 'image' | 'audio' | 'video' | 'time_series' | 'graph' | 'geospatial' | 'multimodal' | 'no_data';
  observationCount?: 'tiny_under_1k' | 'small_1k_10k' | 'medium_10k_100k' | 'large_100k_1m' | 'massive_over_1m' | 'zero';
  featureCount?: 'few_under_20' | 'medium_20_100' | 'high_100_1000' | 'extreme_over_1000';
  labelAvailability?: 'fully_labeled' | 'partially_labeled' | 'no_labels' | 'uncertain_quality';
  labelReliability?: 'high_audited' | 'medium_some_noise' | 'unreliable_ambiguous' | 'not_applicable';
  dataQualityIssues?: string[];
  missingDataMechanism?: 'MCAR' | 'MAR' | 'MNAR' | 'minimal_missing' | 'unknown';
  targetLeakageRisk?: 'high_leakage_detected' | 'safe_available_at_inference' | 'uncertain';
  dataReadinessStatus?: DataReadinessStatus;
  dataReadinessReason?: string;

  problemFamily?: ProblemFamily;
  targetVariableType?: 'continuous' | 'binary' | 'multiclass' | 'multilabel' | 'ordinal' | 'no_target';
  classImbalance?: 'balanced' | 'moderate_imbalance' | 'extreme_rare_events';
  temporalStructure?: 'pure_cross_sectional' | 'single_series' | 'multiple_related_series' | 'hierarchical';
  forecastHorizon?: 'short' | 'medium' | 'long';
  hasExogenousVariables?: boolean;
  clusterGeometryExpectation?: 'spherical_equal' | 'arbitrary_density' | 'hierarchical_tree' | 'unknown';
  anomalyLabelPresence?: 'labeled_anomalies' | 'purely_unsupervised' | 'evolving_novelties';
  causalGoal?: 'prediction_only' | 'average_treatment_effect' | 'heterogeneous_treatment_effect' | 'policy_evaluation';
  rlFeedbackLoop?: 'immediate_contextual' | 'sequential_delayed_rewards' | 'offline_logged';

  scopeCoverage?: ScopeCoverage;
  outOfScopeReason?: string;
}

export interface UserAnswerHistoryItem {
  nodeId: NodeId;
  question: string;
  selectedOptionId: string;
  selectedOptionLabel: string;
  customText?: string;
  contextSnapshot: DecisionContext;
}

export interface AlgorithmCandidate {
  name: string;
  family: string;
  tier: 'baseline' | 'primary' | 'alternative' | 'advanced';
  suitabilityScore: number; // 0-100
  whySuitable: string;
  assumptions: string[];
  advantages: string[];
  disadvantages: string[];
  dataRequirements: string;
  interpretability: 'High' | 'Medium' | 'Low' | 'Black-box';
  computationalCost: 'Low (CPU fast)' | 'Moderate (CPU/Single GPU)' | 'High (GPU/Cluster required)';
  implementationComplexity: 'Low' | 'Moderate' | 'High';
  recommendedValidation: string;
  recommendedMetrics: string[];
  explainabilityOptions: string[];
  mainRisks: string[];
}

export interface StatisticalDiagnostic {
  assumptionOrCondition: string;
  strictness: 'Strict Requirement' | 'Approximate / Robust' | 'Engineering / Empirical Practicality';
  diagnosticProcedure: string;
  interpretationOfViolation: string;
  remediationAction: string;
}

export interface ValidationProtocol {
  splitStrategy: string;
  splitJustification: string;
  leakagePreventionRules: string[];
  metricsRecommended: {
    name: string;
    description: string;
    whyRelevantForCase: string;
  }[];
  statisticalDiagnostics: StatisticalDiagnostic[];
}

export interface ImplementationRoadmapStep {
  stepNumber: number;
  phase: 'Phase 1: Framing & Data' | 'Phase 2: Modeling & Validation' | 'Phase 3: Production & Governance';
  title: string;
  whatMustBeDone: string;
  whyItMatters: string;
  recommendedTools: string[];
  expectedDeliverable: string;
  gateConditionToProceed: string;
}

export interface ComprehensiveDiagnosisResult {
  context: DecisionContext;
  scopeCoverage: ScopeCoverage;
  outOfScopeDetails?: {
    familyNotCovered: string;
    whyCannotRecommend: string;
    requiredSpecializedAnalysis: string;
  };
  dataReadiness: {
    status: DataReadinessStatus;
    headline: string;
    explanation: string;
    immediateActionItems: string[];
  };
  candidates: {
    baseline: AlgorithmCandidate;
    primary?: AlgorithmCandidate;
    alternative?: AlgorithmCandidate;
    advanced?: AlgorithmCandidate;
  };
  validationProtocol: ValidationProtocol;
  explainabilityProtocol: {
    level: string;
    recommendedTechniques: {
      technique: string;
      scope: 'Global' | 'Local' | 'Both';
      rationale: string;
      criticalWarning: string;
    }[];
  };
  roadmap: ImplementationRoadmapStep[];
  deploymentRecommendation: {
    pattern: string;
    architecture: string;
    monitoringRequirements: string[];
  };
}
