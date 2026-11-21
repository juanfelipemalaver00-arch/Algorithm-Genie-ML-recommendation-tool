import { DecisionTreeEngine } from '../src/engine/DecisionTreeEngine';
import { DiagnosticOrchestrator } from '../src/engine/DiagnosticOrchestrator';
import { TEST_JOURNEYS } from '../src/presets/testJourneys';
import { ReportGenerator } from '../src/engine/ReportGenerator';

console.log('====================================================');
console.log('VERIFYING ALL 12 MACHINE LEARNING DECISION JOURNEYS');
console.log('====================================================\n');

let passedCount = 0;

for (const journey of TEST_JOURNEYS) {
  console.log(`Testing Journey: "${journey.title}"...`);
  const engine = new DecisionTreeEngine();

  for (const optId of journey.optionSequence) {
    engine.selectOption(optId);
  }

  if (!engine.isComplete()) {
    console.error(`❌ FAILED: Journey "${journey.title}" did not reach a terminal state! Current node: ${engine.getCurrentNode().id}`);
    process.exit(1);
  }

  const context = engine.getContext();
  const result = DiagnosticOrchestrator.synthesize(context);
  const history = engine.getHistory();

  // Verify baseline exists
  if (!result.candidates.baseline) {
    console.error(`❌ FAILED: No baseline candidate generated for journey "${journey.title}"`);
    process.exit(1);
  }

  // Verify roadmap has all 21 steps
  if (result.roadmap.length !== 21) {
    console.error(`❌ FAILED: Expected 21 roadmap steps, got ${result.roadmap.length}`);
    process.exit(1);
  }

  // Verify markdown generation works without error
  const md = ReportGenerator.generateMarkdownReport(result, history);
  if (!md || md.length < 500) {
    console.error(`❌ FAILED: Markdown report generation produced insufficient content`);
    process.exit(1);
  }

  console.log(`  ✓ Terminal Node reached: ${engine.getCurrentNode().id}`);
  console.log(`  ✓ Problem Family: ${context.problemFamily || 'n/a'}`);
  console.log(`  ✓ Data Readiness: ${result.dataReadiness.status.toUpperCase()}`);
  console.log(`  ✓ Scope Coverage: ${result.scopeCoverage.toUpperCase()}`);
  console.log(`  ✓ Baseline Model: ${result.candidates.baseline.name}`);
  if (result.candidates.primary) {
    console.log(`  ✓ Primary Candidate: ${result.candidates.primary.name}`);
  }
  console.log(`  ✓ Metrics Count: ${result.validationProtocol.metricsRecommended.length}`);
  console.log(`  ✓ Diagnostic Checks: ${result.validationProtocol.statisticalDiagnostics.length}`);
  console.log(`  PASSED!\n`);
  passedCount++;
}

console.log('====================================================');
console.log(`ALL ${passedCount} / ${TEST_JOURNEYS.length} JOURNEYS PASSED SUCCESSFULLY!`);
console.log('====================================================');
