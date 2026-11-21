import { DecisionContext, ScopeCoverage } from '../types/decision';

export interface ScopeAssessment {
  coverage: ScopeCoverage;
  badgeLabel: string;
  badgeColor: string;
  familyNotCovered?: string;
  whyCannotRecommend?: string;
  requiredSpecializedAnalysis?: string;
  uncoveredDomainsList: {
    domain: string;
    description: string;
    whySeparateModuleNeeded: string;
  }[];
}

export class ScopeValidator {
  public static evaluateScope(ctx: DecisionContext): ScopeAssessment {
    const family = ctx.problemFamily;
    const isOutOfScope = ctx.scopeCoverage === 'outside_scope' || family === 'out_of_scope_advanced';

    const uncoveredDomainsList = [
      {
        domain: 'Physics-Informed Neural Networks (PINNs) & Scientific ML',
        description: 'Modeling physical dynamics governed by partial differential equations (PDEs), Navier-Stokes, or molecular orbital mechanics.',
        whySeparateModuleNeeded: 'Requires embedding mathematical conservation laws (energy, mass, momentum) directly into custom loss gradients, fundamentally distinct from standard empirical risk minimization.'
      },
      {
        domain: 'Massive-Scale Distributed Parallel ML (> 100 Billion Parameters)',
        description: 'Training foundational LLMs or multi-billion parameter recommendation models across multi-node GPU/TPU clusters.',
        whySeparateModuleNeeded: 'Requires tensor/pipeline parallelism (Megatron-LM, DeepSpeed ZeRO-3, FSDP) and hardware interconnect optimization rather than standard algorithm selection.'
      },
      {
        domain: 'Dynamic Spatio-Temporal Graph Neural Networks (GNNs)',
        description: 'Large-scale graph topology where nodes, edges, and features continuously evolve (e.g. real-time payment fraud rings, power grid topology).',
        whySeparateModuleNeeded: 'Requires specialized graph message-passing libraries (PyG, DGL) and non-Euclidean representation learning beyond tabular matrices.'
      },
      {
        domain: 'Federated Learning & Differential Privacy',
        description: 'Training models across decentralized edge devices or privacy-siloed hospitals without aggregating raw data centrally.',
        whySeparateModuleNeeded: 'Requires cryptographic aggregation protocols (FedAvg, Secure Aggregation) and formal differential privacy noise budgets (epsilon, delta).'
      },
      {
        domain: 'Online Continuous Learning with Non-Stationary Streams',
        description: 'Real-time updating of weights per streaming transaction without storing history (e.g. streaming telemetry).',
        whySeparateModuleNeeded: 'Requires streaming algorithms (River, Vowpal Wabbit) with catastrophic forgetting mitigation, distinct from batch retraining.'
      }
    ];

    if (isOutOfScope) {
      return {
        coverage: 'outside_scope',
        badgeLabel: 'Outside Current Decision Scope',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        familyNotCovered: 'Advanced / Specialized Research Architectures',
        whyCannotRecommend: 'The user problem involves specialized mathematical physics, distributed cluster co-design, or decentralized constraints that exceed standard enterprise tabular and classical ML patterns. Providing an off-the-shelf algorithm recommendation would be misleading and irresponsible.',
        requiredSpecializedAnalysis: 'Requires a dedicated architectural feasibility study, custom loss function derivation with domain physicists/engineers, and tailored high-performance computing (HPC) hardware budgeting.',
        uncoveredDomainsList
      };
    }

    if (family === 'reinforcement_learning' || family === 'causal_inference') {
      return {
        coverage: 'partially_covered',
        badgeLabel: 'Partially Covered (High-Level Framework)',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        familyNotCovered: 'Advanced Deep RL Environment Synthesis & Observational Causal Discovery',
        whyCannotRecommend: 'While the decision tree identifies suitable baseline frameworks (LinUCB, PPO, Double ML), end-to-end execution requires dedicated environment simulation or domain DAG construction that cannot be fully automated through static questionnaire answers.',
        requiredSpecializedAnalysis: 'Requires formal Causal Directed Acyclic Graph (DAG) construction with domain experts or high-fidelity Gym simulation environment validation before deployment.',
        uncoveredDomainsList
      };
    }

    return {
      coverage: 'fully_covered',
      badgeLabel: 'Fully Covered by Decision Tree',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      uncoveredDomainsList
    };
  }
}
