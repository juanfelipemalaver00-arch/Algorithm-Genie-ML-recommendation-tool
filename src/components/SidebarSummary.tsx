import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  Undo2, 
  Compass, 
  Activity, 
  Database,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  DecisionContext, 
  UserAnswerHistoryItem, 
  DiagnosticNode,
  DataReadinessStatus,
  ScopeCoverage 
} from '../types/decision';

interface SidebarSummaryProps {
  progressPercentage: number;
  currentNode: DiagnosticNode;
  history: UserAnswerHistoryItem[];
  context: DecisionContext;
  onRewindToStep: (index: number) => void;
  dataReadinessStatus?: DataReadinessStatus;
  scopeCoverage?: ScopeCoverage;
}

export const SidebarSummary: React.FC<SidebarSummaryProps> = ({
  progressPercentage,
  currentNode,
  history,
  context,
  onRewindToStep,
  dataReadinessStatus = 'ready',
  scopeCoverage = 'fully_covered'
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col space-y-4">
      
      {/* 1. Diagnostic Progress Card */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-lg shadow-sky-500/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Diagnostic Progress
            </span>
          </div>
          <span className="text-xs font-extrabold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full">
            {progressPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
          <div 
            className="bg-gradient-to-r from-sky-400 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-between">
          <span className="font-medium text-slate-700 truncate">
            {currentNode.stageName}
          </span>
          <span className="text-[11px] text-slate-400">
            Step {history.length + 1}
          </span>
        </div>
      </div>

      {/* 2. System Diagnostic Badges */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-lg shadow-sky-500/5 space-y-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
          <Activity className="w-4 h-4 text-sky-600" />
          <span>Diagnostic Status</span>
        </span>

        {/* Data Readiness Badge */}
        <div className="p-2.5 rounded-xl border transition-all text-xs flex items-start space-x-2.5 bg-white/60 border-slate-200/80">
          <div className="mt-0.5">
            {dataReadinessStatus === 'ready' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {dataReadinessStatus === 'conditionally_ready' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            {dataReadinessStatus === 'not_ready' && <XCircle className="w-4 h-4 text-rose-500" />}
          </div>
          <div>
            <div className="font-semibold text-slate-800">
              {dataReadinessStatus === 'ready' && 'Data: Experimentation Ready'}
              {dataReadinessStatus === 'conditionally_ready' && 'Data: Conditionally Ready'}
              {dataReadinessStatus === 'not_ready' && 'Data: Not Ready'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {context.observationCount ? `Sample: ${context.observationCount}` : 'Awaiting data profile'}
            </div>
          </div>
        </div>

        {/* Scope Coverage Badge */}
        <div className="p-2.5 rounded-xl border transition-all text-xs flex items-start space-x-2.5 bg-white/60 border-slate-200/80">
          <div className="mt-0.5">
            {scopeCoverage === 'fully_covered' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
            {scopeCoverage === 'partially_covered' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            {scopeCoverage === 'outside_scope' && <XCircle className="w-4 h-4 text-rose-500" />}
          </div>
          <div>
            <div className="font-semibold text-slate-800">
              {scopeCoverage === 'fully_covered' && 'Scope: Fully Covered'}
              {scopeCoverage === 'partially_covered' && 'Scope: Partially Covered'}
              {scopeCoverage === 'outside_scope' && 'Scope: Outside Implemented Scope'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {context.problemFamily ? `Family: ${context.problemFamily}` : 'Determining problem type'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Auditable Decision Trail (Rewindable History) */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-lg shadow-sky-500/5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-sky-600" />
            <span>Decision Trail</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {history.length} answered
          </span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Your decision answers will be recorded here. You can click any step to rewind and edit.
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
            {history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onRewindToStep(idx)}
                className="w-full text-left p-2.5 rounded-xl border border-sky-100/80 bg-white/80 hover:bg-sky-50 hover:border-sky-300 transition-all duration-200 group relative"
                title="Click to rewind back to this question and modify answer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-sky-600 uppercase">
                    Step {idx + 1}
                  </span>
                  <Undo2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600 transition-colors" />
                </div>
                <div className="text-xs font-medium text-slate-800 line-clamp-1 mt-0.5">
                  {item.question}
                </div>
                <div className="text-[11px] text-sky-700 font-semibold truncate mt-1 flex items-center">
                  <ChevronRight className="w-3 h-3 shrink-0 mr-0.5" />
                  <span className="truncate">{item.selectedOptionLabel}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
};
