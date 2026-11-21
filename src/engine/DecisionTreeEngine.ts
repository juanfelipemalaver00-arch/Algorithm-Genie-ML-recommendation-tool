import { 
  NodeId, 
  DiagnosticNode, 
  DecisionContext, 
  UserAnswerHistoryItem 
} from '../types/decision';
import { DECISION_TREE_NODES } from './treeData';

export class DecisionTreeEngine {
  private currentNodeId: NodeId;
  private history: UserAnswerHistoryItem[] = [];
  private context: DecisionContext = {};

  constructor(initialNodeId: NodeId = 'q1_objective', initialContext?: Partial<DecisionContext>) {
    this.currentNodeId = initialNodeId;
    if (initialContext) {
      this.context = { ...initialContext };
    }
  }

  public getCurrentNode(): DiagnosticNode {
    const node = DECISION_TREE_NODES[this.currentNodeId];
    if (!node) {
      throw new Error(`Node with id "${this.currentNodeId}" not found in decision tree.`);
    }
    return node;
  }

  public getContext(): DecisionContext {
    return { ...this.context };
  }

  public getHistory(): UserAnswerHistoryItem[] {
    return [...this.history];
  }

  public isComplete(): boolean {
    const node = this.getCurrentNode();
    return !!node.isTerminal;
  }

  /**
   * Calculate diagnostic progress percentage based on completed stages
   */
  public getProgressPercentage(): number {
    if (this.isComplete()) return 100;
    const stagesOrdered = [
      'stage_1_ml_necessity',
      'stage_2_data_readiness',
      'stage_3_problem_identification',
      'stage_7_explainability',
      'stage_8_recommendations'
    ];
    const currentNode = this.getCurrentNode();
    const stageIndex = stagesOrdered.indexOf(currentNode.stage);
    if (stageIndex === -1) return Math.min(85, this.history.length * 12);
    const baseProgress = (stageIndex / stagesOrdered.length) * 100;
    const microStep = Math.min(15, this.history.length * 2);
    return Math.min(95, Math.round(baseProgress + microStep));
  }

  /**
   * User selects an answer option
   */
  public selectOption(optionId: string, customText?: string): DiagnosticNode {
    const currentNode = this.getCurrentNode();
    const selectedOption = currentNode.options.find(opt => opt.id === optionId);

    if (!selectedOption) {
      throw new Error(`Option with id "${optionId}" does not exist on node "${this.currentNodeId}".`);
    }

    // Save history snapshot before moving forward
    this.history.push({
      nodeId: currentNode.id,
      question: currentNode.question,
      selectedOptionId: selectedOption.id,
      selectedOptionLabel: selectedOption.label,
      customText,
      contextSnapshot: { ...this.context }
    });

    // Merge context updates
    if (selectedOption.contextUpdates) {
      this.context = {
        ...this.context,
        ...selectedOption.contextUpdates
      };
    }

    if (customText) {
      this.context.objectiveDescription = customText;
    }

    // Advance to next node
    this.currentNodeId = selectedOption.nextNodeId;
    return this.getCurrentNode();
  }

  /**
   * Rewind to a previous step in history, allowing user to change past answers.
   * Discards downstream questions to maintain consistency.
   */
  public goToHistoryIndex(targetIndex: number): DiagnosticNode {
    if (targetIndex < 0 || targetIndex >= this.history.length) {
      throw new Error(`Invalid history index: ${targetIndex}`);
    }

    const targetStep = this.history[targetIndex];
    // Restore context from snapshot at that point
    this.context = { ...targetStep.contextSnapshot };
    this.currentNodeId = targetStep.nodeId;
    // Truncate history to target index
    this.history = this.history.slice(0, targetIndex);

    return this.getCurrentNode();
  }

  /**
   * Go back one step
   */
  public goBack(): DiagnosticNode | null {
    if (this.history.length === 0) return null;
    return this.goToHistoryIndex(this.history.length - 1);
  }

  /**
   * Reset the diagnostic session
   */
  public reset(startNodeId: NodeId = 'q1_objective'): DiagnosticNode {
    this.currentNodeId = startNodeId;
    this.history = [];
    this.context = {};
    return this.getCurrentNode();
  }
}
