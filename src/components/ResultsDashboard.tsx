import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Download, 
  Share2, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Server, 
  Cpu, 
  Clock, 
  Eye, 
  HelpCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  ComprehensiveDiagnosisResult, 
  UserAnswerHistoryItem,
  ExplanationLevel 
} from '../types/decision';
import { ReportGenerator } from '../engine/ReportGenerator';

interface ResultsDashboardProps {
  result: ComprehensiveDiagnosisResult;
  history: UserAnswerHistoryItem[];
  explanationLevel: ExplanationLevel;
  onRestart: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  history,
  explanationLevel,
  onRestart
}) => {
  const [activeTab, setActiveTab] = useState<'algorithms' | 'validation' | 'roadmap' | 'scope' | 'export'>('algorithms');
  const [copied, setCopied] = useState(false);
  const [expandedRoadmapPhase, setExpandedRoadmapPhase] = useState<string | null>('Phase 1: Framing & Data');

  const { context, candidates, validationProtocol, dataReadiness, roadmap, scopeCoverage, deploymentRecommendation } = result;

  const handleDownloadPdf = () => {
    ReportGenerator.generatePdfReport(result, history);
  };

  const handleDownloadMarkdown = () => {
    const md = ReportGenerator.generateMarkdownReport(result, history);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ML_Decision_Report_${context.problemFamily || 'Diagnostic'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    const md = ReportGenerator.generateMarkdownReport(result, history);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col space-y-6">
      
      {/* Top Banner: Diagnosis Overview */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl shadow-sky-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 text-sky-800 border border-sky-200">
                Diagnostic Complete
              </span>
              <span className="text-xs font-mono text-slate-500">
                Audited Decision Result
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Machine Learning Architecture Recommendation
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Objective: <span className="font-semibold text-slate-800">{context.objectiveType || 'General Analytical Prediction'}</span> | Modality: <span className="font-semibold text-slate-800">{context.dataModality || 'Tabular'}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/90 hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-all"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Markdown</span>
            </button>
          </div>
        </div>

        {/* Data Readiness Banner */}
        <div className={`mt-6 p-4 rounded-2xl border flex items-start space-x-3.5 ${
          dataReadiness.status === 'ready'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : (dataReadiness.status === 'conditionally_ready'
              ? 'bg-amber-50/70 border-amber-200 text-amber-900'
              : 'bg-rose-50/70 border-rose-200 text-rose-900')
        }`}>
          <div className="mt-0.5 shrink-0">
            {dataReadiness.status === 'ready' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {dataReadiness.status === 'conditionally_ready' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
            {dataReadiness.status === 'not_ready' && <XCircle className="w-5 h-5 text-rose-600" />}
          </div>
          <div className="text-xs">
            <div className="font-extrabold text-sm">{dataReadiness.headline}</div>
            <p className="mt-1 leading-relaxed opacity-90">{dataReadiness.explanation}</p>
            {dataReadiness.immediateActionItems.length > 0 && (
              <div className="mt-2 space-y-1">
                <span className="font-bold">Required Pre-Modeling Actions:</span>
                <ul className="list-disc list-inside space-y-0.5 opacity-90">
                  {dataReadiness.immediateActionItems.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Glassmorphism Tab Navigation */}
      <div className="flex items-center space-x-1.5 p-1.5 bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('algorithms')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'algorithms'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Algorithm Candidates</span>
        </button>

        <button
          onClick={() => setActiveTab('validation')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'validation'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>2. Validation & Assumptions</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'roadmap'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>3. 21-Step Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('scope')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'scope'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>4. Scope & Limitations</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'export'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>5. Export & Report</span>
        </button>
      </div>

      {/* TAB 1: ALGORITHM CANDIDATES */}
      {activeTab === 'algorithms' && (
        <div className="space-y-6">
          
          {/* Methodological Guidance Note */}
          <div className="bg-sky-50/80 rounded-2xl p-4 border border-sky-100 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-sky-900">Tiered Recommendation Strategy:</span> We never recommend a single algorithm in isolation without a baseline. Always benchmark candidate models against the simple baseline under identical cross-validation folds.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Baseline Card */}
            {candidates.baseline && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-sky-200/80 shadow-lg shadow-sky-500/5 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      Tier 1: Mandatory Baseline
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Score: {candidates.baseline.suitabilityScore}/100
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {candidates.baseline.name}
                  </h3>
                  <div className="text-xs font-mono text-sky-700 mb-3">
                    {candidates.baseline.family}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {candidates.baseline.whySuitable}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Interpretability:</span>
                      <span className="font-semibold text-slate-800">{candidates.baseline.interpretability}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Compute Cost:</span>
                      <span className="font-semibold text-slate-800">{candidates.baseline.computationalCost}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Complexity:</span>
                      <span className="font-semibold text-slate-800">{candidates.baseline.implementationComplexity}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">Top Advantages:</span> {candidates.baseline.advantages.slice(0, 2).join('; ')}
                </div>
              </div>
            )}

            {/* Primary Candidate Card */}
            {candidates.primary && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-sky-500/80 shadow-xl shadow-sky-500/10 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-600 text-white shadow-xs">
                      Tier 2: Primary Candidate
                    </span>
                    <span className="text-xs font-bold text-sky-700">
                      Score: {candidates.primary.suitabilityScore}/100
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {candidates.primary.name}
                  </h3>
                  <div className="text-xs font-mono text-sky-700 mb-3">
                    {candidates.primary.family}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {candidates.primary.whySuitable}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Interpretability:</span>
                      <span className="font-semibold text-slate-800">{candidates.primary.interpretability}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Compute Cost:</span>
                      <span className="font-semibold text-slate-800">{candidates.primary.computationalCost}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Complexity:</span>
                      <span className="font-semibold text-slate-800">{candidates.primary.implementationComplexity}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">Top Advantages:</span> {candidates.primary.advantages.slice(0, 2).join('; ')}
                </div>
              </div>
            )}

            {/* Alternative Candidate Card */}
            {candidates.alternative && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-sky-100 shadow-md relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                      Tier 3: Alternative Candidate
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Score: {candidates.alternative.suitabilityScore}/100
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {candidates.alternative.name}
                  </h3>
                  <div className="text-xs font-mono text-sky-700 mb-3">
                    {candidates.alternative.family}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {candidates.alternative.whySuitable}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Interpretability:</span>
                      <span className="font-semibold text-slate-800">{candidates.alternative.interpretability}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Compute Cost:</span>
                      <span className="font-semibold text-slate-800">{candidates.alternative.computationalCost}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">Top Trade-off:</span> {candidates.alternative.advantages[0]}
                </div>
              </div>
            )}

            {/* Advanced Candidate Card */}
            {candidates.advanced && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 shadow-md relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
                      Tier 4: Advanced Architecture
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Score: {candidates.advanced.suitabilityScore}/100
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {candidates.advanced.name}
                  </h3>
                  <div className="text-xs font-mono text-purple-700 mb-3">
                    {candidates.advanced.family}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {candidates.advanced.whySuitable}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Compute Cost:</span>
                      <span className="font-semibold text-slate-800">{candidates.advanced.computationalCost}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-purple-700 font-semibold">
                  Note: Deploy only if primary gradient boosted trees fail to achieve desired accuracy.
                </div>
              </div>
            )}

          </div>

          {/* Comparative Matrix Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-xl overflow-hidden">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
              Candidate Attributes & Risk Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-2.5 pr-4">Candidate</th>
                    <th className="py-2.5 pr-4">Interpretability</th>
                    <th className="py-2.5 pr-4">Latency & Compute</th>
                    <th className="py-2.5 pr-4">Primary Assumption</th>
                    <th className="py-2.5">Main Operational Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[candidates.baseline, candidates.primary, candidates.alternative, candidates.advanced].filter(Boolean).map((cand, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/50 transition-colors">
                      <td className="py-3 pr-4 font-bold text-slate-900">
                        {cand!.name}
                        <div className="text-[10px] font-mono text-sky-700">{cand!.tier.toUpperCase()}</div>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-slate-700">{cand!.interpretability}</td>
                      <td className="py-3 pr-4 text-slate-600">{cand!.computationalCost}</td>
                      <td className="py-3 pr-4 text-slate-600 max-w-xs">{cand!.assumptions[0] || 'Standard I.I.D.'}</td>
                      <td className="py-3 text-rose-700 font-medium max-w-xs">{cand!.mainRisks[0] || 'Underfitting'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: VALIDATION & ASSUMPTIONS */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          
          {/* Validation Split Protocol */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Recommended Cross-Validation Split Strategy
              </h3>
            </div>
            
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs">
              <span className="font-extrabold text-sm text-sky-900 block mb-1">
                {validationProtocol.splitStrategy}
              </span>
              <p className="text-slate-700 leading-relaxed">
                {validationProtocol.splitJustification}
              </p>
            </div>

            {/* Leakage Directives */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Mandatory Data Leakage Safeguards
              </h4>
              <div className="space-y-2">
                {validationProtocol.leakagePreventionRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 bg-white/70 p-3 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Metrics */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Target Evaluation Metrics Justification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {validationProtocol.metricsRecommended.map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 text-xs">
                  <div className="font-extrabold text-slate-900 text-sm mb-1">{m.name}</div>
                  <p className="text-slate-600 mb-2">{m.description}</p>
                  <div className="p-2 rounded-xl bg-white/80 border border-sky-100 text-sky-900 font-medium">
                    <span className="font-bold">Why relevant: </span>{m.whyRelevantForCase}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistical Assumptions Diagnostic Suite Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-xl overflow-hidden">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Statistical Assumption & Diagnostics Suite
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Formal hypothesis tests, diagnostics, and concrete remediation steps if an assumption is violated.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-2.5 pr-4">Assumption / Operating Condition</th>
                    <th className="py-2.5 pr-4">Strictness</th>
                    <th className="py-2.5 pr-4">Diagnostic Procedure</th>
                    <th className="py-2.5 pr-4">Meaning of Violation</th>
                    <th className="py-2.5">Remediation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {validationProtocol.statisticalDiagnostics.map((diag, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/50 transition-colors">
                      <td className="py-3 pr-4 font-bold text-slate-900">{diag.assumptionOrCondition}</td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {diag.strictness}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono text-sky-800 text-[11px]">{diag.diagnosticProcedure}</td>
                      <td className="py-3 pr-4 text-slate-600">{diag.interpretationOfViolation}</td>
                      <td className="py-3 text-emerald-800 font-medium">{diag.remediationAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: 21-STEP ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          
          {/* Roadmap Header */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  End-to-End Implementation Roadmap (21 Steps)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Disciplined engineering progression from problem framing to live automated drift monitoring.
                </p>
              </div>
              <div className="text-xs font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                Deployment Target: {deploymentRecommendation.pattern}
              </div>
            </div>
          </div>

          {/* Grouped Roadmap Steps */}
          {(['Phase 1: Framing & Data', 'Phase 2: Modeling & Validation', 'Phase 3: Production & Governance'] as const).map((phase) => {
            const stepsInPhase = roadmap.filter(s => s.phase === phase);
            const isExpanded = expandedRoadmapPhase === phase;

            return (
              <div key={phase} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl overflow-hidden">
                <button
                  onClick={() => setExpandedRoadmapPhase(isExpanded ? null : phase)}
                  className="w-full p-5 flex items-center justify-between bg-sky-50/50 hover:bg-sky-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-extrabold text-xs">
                      {phase.startsWith('Phase 1') ? 'P1' : (phase.startsWith('Phase 2') ? 'P2' : 'P3')}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{phase}</h4>
                      <p className="text-xs text-slate-500">{stepsInPhase.length} Implementation Steps</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="p-5 divide-y divide-slate-100 space-y-4">
                    {stepsInPhase.map((step) => (
                      <div key={step.stepNumber} className="pt-4 first:pt-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <h5 className="text-sm font-extrabold text-slate-900">
                            {step.title}
                          </h5>
                          <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                            Tools: {step.recommendedTools.slice(0, 2).join(', ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          <span className="font-semibold text-slate-800">Action:</span> {step.whatMustBeDone}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                            <span className="font-bold text-slate-700">Deliverable: </span>
                            <span className="text-slate-600">{step.expectedDeliverable}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                            <span className="font-bold text-emerald-800">Gate Condition: </span>
                            <span className="text-emerald-900">{step.gateConditionToProceed}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        </div>
      )}

      {/* TAB 4: SCOPE LIMITATIONS */}
      {activeTab === 'scope' && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-6 h-6 text-sky-600" />
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  What This Decision Tree Does NOT Cover
                </h3>
                <p className="text-xs text-slate-500">
                  Commitment to scientific transparency and explicit algorithmic boundaries.
                </p>
              </div>
            </div>

            {/* Current Coverage Assessment */}
            <div className={`p-4 rounded-2xl border text-xs ${
              scopeCoverage === 'fully_covered'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : (scopeCoverage === 'partially_covered'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900')
            }`}>
              <span className="font-extrabold text-sm block mb-1">
                Your Objective Coverage Status: {scopeCoverage.toUpperCase()}
              </span>
              {result.outOfScopeDetails && (
                <div className="space-y-1.5 mt-2">
                  <p><span className="font-bold">Domain: </span>{result.outOfScopeDetails.familyNotCovered}</p>
                  <p><span className="font-bold">Why not covered: </span>{result.outOfScopeDetails.whyCannotRecommend}</p>
                  <p><span className="font-bold">Required Analysis: </span>{result.outOfScopeDetails.requiredSpecializedAnalysis}</p>
                </div>
              )}
            </div>

            {/* List of Non-Standard Advanced Domains */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Advanced Machine Learning Domains Outside Standard Scope
              </h4>
              
              <div className="space-y-2.5">
                {[
                  {
                    title: 'Physics-Informed Neural Networks (PINNs) & Computational Chemistry',
                    reason: 'Requires embedding differential conservation laws into loss gradients, distinct from standard empirical risk minimization.'
                  },
                  {
                    title: 'Massive Distributed Parallel Foundation Training (>100B params)',
                    reason: 'Requires tensor/pipeline parallelism (DeepSpeed ZeRO-3, Megatron-LM) and cluster networking co-design.'
                  },
                  {
                    title: 'Dynamic Spatio-Temporal Graph Neural Networks (GNNs)',
                    reason: 'Requires message-passing over non-Euclidean evolving topological graphs.'
                  },
                  {
                    title: 'Federated Differential Privacy Systems',
                    reason: 'Requires cryptographic aggregation protocols and differential privacy noise budget allocation.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-slate-600 mt-1">{item.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXPORT & REPORT */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Downloadable Technical Decision Report
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Export an executive-ready architectural document for engineering teams, stakeholders, and compliance audits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={handleDownloadPdf}
                className="p-5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex flex-col items-center justify-center space-y-2 shadow-lg shadow-sky-600/20 transition-all"
              >
                <Download className="w-6 h-6" />
                <span>Download PDF Report</span>
                <span className="text-[10px] font-normal opacity-80">Formatted with tables & summary</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="p-5 rounded-2xl bg-white/90 hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-xs flex flex-col items-center justify-center space-y-2 shadow-xs transition-all"
              >
                <FileText className="w-6 h-6 text-sky-600" />
                <span>Download Markdown (.md)</span>
                <span className="text-[10px] font-normal text-slate-500">Raw text for Notion/Git</span>
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="p-5 rounded-2xl bg-white/90 hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-xs flex flex-col items-center justify-center space-y-2 shadow-xs transition-all"
              >
                <Copy className="w-6 h-6 text-sky-600" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                <span className="text-[10px] font-normal text-slate-500">Quick paste into Slack/Email</span>
              </button>
            </div>

            {/* References Section */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Grounding Methodological References
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Scikit-learn Model Selection & Evaluation (scikit-learn.org/stable/model_selection.html)</li>
                <li>Scikit-learn Common Pitfalls and Data Leakage (scikit-learn.org/stable/common_pitfalls.html)</li>
                <li>Google Machine Learning Crash Course: Production ML Systems & Monitoring</li>
                <li>Forecasting: Principles & Practice (Time-series cross-validation)</li>
                <li>SHAP: Lundberg & Lee, A Unified Approach to Interpreting Model Predictions (NeurIPS 2017)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Restart Diagnostic Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onRestart}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-slate-100 border border-slate-200 shadow-xs transition-all"
        >
          <span>Start a New Diagnostic</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
