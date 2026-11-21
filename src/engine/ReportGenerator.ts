import jsPDF from 'jspdf';
import { 
  ComprehensiveDiagnosisResult, 
  DecisionContext, 
  UserAnswerHistoryItem 
} from '../types/decision';

export class ReportGenerator {
  public static generateMarkdownReport(
    result: ComprehensiveDiagnosisResult,
    history: UserAnswerHistoryItem[]
  ): string {
    const ctx = result.context;
    const now = new Date().toISOString().split('T')[0];

    const md: string[] = [];
    md.push(`# Machine Learning Algorithm Decision & Implementation Report`);
    md.push(`**Generated On:** ${now} | **Assistant Version:** v1.0.0 (Auditable Decision Tree Engine)`);
    md.push(`**Status:** Diagnostic Complete (Pre-Modeling Architecture Plan)`);
    md.push(`\n---\n`);

    // 1. Executive Summary
    md.push(`## 1. Executive Summary`);
    md.push(`This technical architecture report summarizes the diagnostic findings for the user's analytical objective.`);
    md.push(`- **Identified Problem Family:** \`${ctx.problemFamily || 'Not Specified'}\``);
    md.push(`- **Data Readiness Status:** **${result.dataReadiness.status.toUpperCase()}** — ${result.dataReadiness.headline}`);
    md.push(`- **Decision Scope Coverage:** **${result.scopeCoverage.toUpperCase()}**`);
    md.push(`- **Primary Recommended Baseline:** ${result.candidates.baseline.name}`);
    if (result.candidates.primary) {
      md.push(`- **Primary Production Candidate:** ${result.candidates.primary.name}`);
    }
    md.push(`\n> **Methodological Note:** No model has been trained yet. This report defines the optimal, auditable algorithmic strategy, validation safeguards, and operational roadmap based on an explicit decision tree.`);
    md.push(`\n---\n`);

    // 2. User Objectives & Operating Constraints
    md.push(`## 2. Problem Framing & Operational Constraints`);
    md.push(`- **User Objective:** ${ctx.objectiveType || 'General Prediction'}`);
    md.push(`- **Intended Usage Environment:** ${ctx.modelUsage || 'Internal Decision Support'}`);
    md.push(`- **Cost of Errors:** ${ctx.costOfErrors || 'Moderate'}`);
    md.push(`- **Latency Requirement:** ${ctx.latencyRequirement || 'Interactive / Batch'}`);
    md.push(`- **Interpretability Requirement:** ${ctx.interpretabilityRequirement || 'Standard'}`);
    md.push(`- **Compute Budget:** ${ctx.computationalBudget || 'Standard Cloud / Laptop'}`);
    md.push(`\n---\n`);

    // 3. Diagnostic Answer Audit Trail
    md.push(`## 3. Auditable Diagnostic Trail`);
    md.push(`The following explicit path was traversed through the decision tree:`);
    history.forEach((step, idx) => {
      md.push(`${idx + 1}. **${step.question}**`);
      md.push(`   - *Selection:* ${step.selectedOptionLabel}`);
    });
    md.push(`\n---\n`);

    // 4. Data Readiness Assessment
    md.push(`## 4. Data Readiness Assessment`);
    md.push(`- **Data Modality:** ${ctx.dataModality || 'Tabular'}`);
    md.push(`- **Sample Size Regime:** ${ctx.observationCount || 'Moderate'}`);
    md.push(`- **Feature Ratio:** ${ctx.featureCount || 'Standard'}`);
    md.push(`- **Label Availability:** ${ctx.labelAvailability || 'Fully Labeled'}`);
    md.push(`- **Label Reliability:** ${ctx.labelReliability || 'Verified'}`);
    md.push(`- **Missing Data Mechanism:** ${ctx.missingDataMechanism || 'Minimal'}`);
    md.push(`- **Target Leakage Risk:** ${ctx.targetLeakageRisk || 'Safe'}`);
    md.push(`\n**Assessment Summary:** ${result.dataReadiness.explanation}`);
    md.push(`\n**Immediate Pre-Modeling Actions:**`);
    result.dataReadiness.immediateActionItems.forEach(item => {
      md.push(`- ${item}`);
    });
    md.push(`\n---\n`);

    // 5. Algorithm Candidates Strategy
    md.push(`## 5. Recommended Algorithm Strategy`);
    md.push(`Candidates are structured into explicit methodological tiers:`);
    
    // Baseline
    const b = result.candidates.baseline;
    md.push(`\n### [Tier 1: Mandatory Baseline] ${b.name}`);
    md.push(`- **Family:** ${b.family}`);
    md.push(`- **Why Suitable:** ${b.whySuitable}`);
    md.push(`- **Interpretability:** ${b.interpretability} | **Compute Cost:** ${b.computationalCost}`);
    md.push(`- **Key Advantages:** ${b.advantages.join(', ')}`);
    md.push(`- **Main Risks:** ${b.mainRisks.join(', ')}`);

    // Primary
    if (result.candidates.primary) {
      const p = result.candidates.primary;
      md.push(`\n### [Tier 2: Primary Candidate] ${p.name}`);
      md.push(`- **Family:** ${p.family}`);
      md.push(`- **Why Suitable:** ${p.whySuitable}`);
      md.push(`- **Interpretability:** ${p.interpretability} | **Compute Cost:** ${p.computationalCost}`);
      md.push(`- **Key Advantages:** ${p.advantages.join(', ')}`);
      md.push(`- **Main Risks:** ${p.mainRisks.join(', ')}`);
    }

    // Alternative
    if (result.candidates.alternative) {
      const a = result.candidates.alternative;
      md.push(`\n### [Tier 3: Alternative Candidate] ${a.name}`);
      md.push(`- **Family:** ${a.family}`);
      md.push(`- **Why Suitable:** ${a.whySuitable}`);
      md.push(`- **Trade-offs:** ${a.advantages.join(', ')}`);
    }

    // Advanced
    if (result.candidates.advanced) {
      const adv = result.candidates.advanced;
      md.push(`\n### [Tier 4: Advanced Candidate] ${adv.name}`);
      md.push(`- **Family:** ${adv.family}`);
      md.push(`- **Why Suitable:** ${adv.whySuitable}`);
      md.push(`- **Complexity Note:** Only deploy if primary models fail to reach required performance benchmarks.`);
    }
    md.push(`\n---\n`);

    // 6. Validation Protocol & Metrics
    md.push(`## 6. Rigorous Validation Strategy & Metrics`);
    md.push(`- **Splitting Scheme:** **${result.validationProtocol.splitStrategy}**`);
    md.push(`- **Justification:** ${result.validationProtocol.splitJustification}`);
    md.push(`\n**Data Leakage Prevention Directives:**`);
    result.validationProtocol.leakagePreventionRules.forEach(rule => {
      md.push(`- [ ] ${rule}`);
    });
    md.push(`\n**Target Evaluation Metrics:**`);
    result.validationProtocol.metricsRecommended.forEach(m => {
      md.push(`- **${m.name}:** ${m.description} (*Why relevant:* ${m.whyRelevantForCase})`);
    });
    md.push(`\n---\n`);

    // 7. Statistical Assumption & Diagnostic Suite
    md.push(`## 7. Statistical Assumption Diagnostic Suite`);
    md.push(`| Assumption / Condition | Strictness | Diagnostic Procedure | Interpretation if Violated | Remediation Action |`);
    md.push(`| :--- | :--- | :--- | :--- | :--- |`);
    result.validationProtocol.statisticalDiagnostics.forEach(d => {
      md.push(`| **${d.assumptionOrCondition}** | ${d.strictness} | ${d.diagnosticProcedure} | ${d.interpretationOfViolation} | ${d.remediationAction} |`);
    });
    md.push(`\n---\n`);

    // 8. Explainability Protocol
    md.push(`## 8. Explainability & Interpretability Protocol`);
    md.push(`- **Required Level:** ${result.explainabilityProtocol.level}`);
    result.explainabilityProtocol.recommendedTechniques.forEach(t => {
      md.push(`- **${t.technique} (${t.scope}):** ${t.rationale}`);
      md.push(`  *Warning:* ${t.criticalWarning}`);
    });
    md.push(`\n---\n`);

    // 9. 21-Step Roadmap
    md.push(`## 9. End-to-End Implementation Roadmap (21 Steps)`);
    result.roadmap.forEach(s => {
      md.push(`### Step ${s.stepNumber}: ${s.title} [${s.phase}]`);
      md.push(`- **Action:** ${s.whatMustBeDone}`);
      md.push(`- **Tools:** \`${s.recommendedTools.join(', ')}\``);
      md.push(`- **Deliverable:** ${s.expectedDeliverable}`);
      md.push(`- **Gate Condition:** *${s.gateConditionToProceed}*`);
    });
    md.push(`\n---\n`);

    // 10. Scope Boundaries
    md.push(`## 10. What This Decision Tree Does NOT Cover`);
    md.push(`To preserve scientific integrity and avoid overclaiming, the following specialized domains are strictly outside the scope of this automated decision tree:`);
    md.push(`- Physics-Informed Neural Networks (PINNs) and custom differential equations.`);
    md.push(`- Petabyte-scale multi-node parallel model training (ZeRO-3 / Megatron-LM).`);
    md.push(`- Real-time spatio-temporal Dynamic Graph Neural Networks.`);
    md.push(`- Decentralized Federated Learning and Differential Privacy guarantees.`);
    md.push(`\n---\n`);

    // 11. Technical References
    md.push(`## 11. Grounding References & Standards`);
    md.push(`1. Scikit-learn Model Selection & Evaluation Guide (scikit-learn.org/stable/model_selection.html)`);
    md.push(`2. Scikit-learn Common Pitfalls & Data Leakage (scikit-learn.org/stable/common_pitfalls.html)`);
    md.push(`3. Google Machine Learning Rules & Production ML Systems (developers.google.com/machine-learning)`);
    md.push(`4. Forecasting: Principles & Practice (otexts.com/fpp3/tscv.html)`);
    md.push(`5. SHAP: Lundberg & Lee, A Unified Approach to Interpreting Model Predictions (NeurIPS 2017)`);

    return md.join('\n');
  }

  public static generatePdfReport(
    result: ComprehensiveDiagnosisResult,
    history: UserAnswerHistoryItem[]
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Header Title
    doc.setFillColor(2, 132, 199); // Sky-600
    doc.rect(margin, y, contentWidth, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('MACHINE LEARNING ALGORITHM DECISION REPORT', margin + 15, y + 25);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Auditable Decision Tree v1.0`, margin + 15, y + 40);
    y += 65;

    // Executive Summary
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('1. Executive Summary & Problem Classification', margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const summaryLines = [
      `Problem Family: ${result.context.problemFamily || 'Not Specified'}`,
      `Data Readiness Status: ${result.dataReadiness.status.toUpperCase()} (${result.dataReadiness.headline})`,
      `Decision Tree Scope Coverage: ${result.scopeCoverage.toUpperCase()}`,
      `Mandatory Baseline Model: ${result.candidates.baseline.name}`,
      result.candidates.primary ? `Primary Production Candidate: ${result.candidates.primary.name}` : ''
    ].filter(Boolean);

    summaryLines.forEach(line => {
      doc.text(line, margin + 10, y);
      y += 14;
    });
    y += 10;

    // Algorithm Recommendations
    checkPageBreak(120);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2. Algorithm Strategy & Candidates', margin, y);
    y += 18;

    const candidates = [
      result.candidates.baseline,
      result.candidates.primary,
      result.candidates.alternative
    ].filter(Boolean);

    candidates.forEach((c) => {
      if (!c) return;
      checkPageBreak(70);
      doc.setFillColor(240, 249, 255); // Sky-50
      doc.setDrawColor(186, 230, 253);
      doc.roundedRect(margin, y, contentWidth, 55, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(3, 105, 161);
      doc.text(`[${c.tier.toUpperCase()}] ${c.name}`, margin + 10, y + 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const splitWhy = doc.splitTextToSize(`Why Suitable: ${c.whySuitable}`, contentWidth - 20);
      doc.text(splitWhy.slice(0, 2), margin + 10, y + 28);

      doc.text(`Interpretability: ${c.interpretability} | Compute Cost: ${c.computationalCost}`, margin + 10, y + 46);
      y += 65;
    });

    // Validation & Leakage Safeguards
    checkPageBreak(100);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Validation Strategy & Leakage Prevention', margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Validation Scheme: ${result.validationProtocol.splitStrategy}`, margin + 10, y);
    y += 14;
    const splitJust = doc.splitTextToSize(`Justification: ${result.validationProtocol.splitJustification}`, contentWidth - 20);
    doc.text(splitJust, margin + 10, y);
    y += splitJust.length * 12 + 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Data Leakage Rules:', margin + 10, y);
    y += 14;
    doc.setFont('helvetica', 'normal');
    result.validationProtocol.leakagePreventionRules.slice(0, 3).forEach(rule => {
      const splitRule = doc.splitTextToSize(`- ${rule}`, contentWidth - 30);
      doc.text(splitRule, margin + 15, y);
      y += splitRule.length * 11 + 3;
    });
    y += 10;

    // Implementation Roadmap Highlights
    checkPageBreak(150);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('4. Implementation Roadmap (Phased Summary)', margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const keySteps = result.roadmap.filter((_, i) => [0, 4, 7, 8, 9, 12, 14, 16, 18, 19, 20].includes(i));
    keySteps.forEach(step => {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.text(`Step ${step.stepNumber}: ${step.title}`, margin + 10, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`Deliverable: ${step.expectedDeliverable}`, margin + 15, y + 10);
      y += 22;
    });

    // Limitations & Disclaimer Footer
    checkPageBreak(60);
    y += 10;
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, margin + contentWidth, y);
    y += 15;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Notice: This decision support document was deterministically generated via the auditable Machine Learning Decision Tree Engine.', margin, y);
    doc.text('Models must be empirically validated on private domain datasets prior to production deployment.', margin, y + 10);

    // Save PDF
    doc.save(`ML_Algorithm_Decision_Report_${result.context.problemFamily || 'Diagnostic'}.pdf`);
  }
}
