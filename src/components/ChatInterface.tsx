import React from 'react';
import { 
  Bot, 
  HelpCircle, 
  ChevronRight, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  CheckCircle,
  Code2,
  Info
} from 'lucide-react';
import { 
  DiagnosticNode, 
  AnswerOption, 
  ExplanationLevel 
} from '../types/decision';

interface ChatInterfaceProps {
  currentNode: DiagnosticNode;
  explanationLevel: ExplanationLevel;
  onSelectOption: (optionId: string, customText?: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  onReset: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentNode,
  explanationLevel,
  onSelectOption,
  onGoBack,
  canGoBack,
  onReset
}) => {
  const [customText, setCustomText] = React.useState('');
  const [showTechnicalDetails, setShowTechnicalDetails] = React.useState(false);

  // Reset local state when node changes
  React.useEffect(() => {
    setCustomText('');
    setShowTechnicalDetails(false);
  }, [currentNode.id]);

  return (
    <div className="flex-1 flex flex-col space-y-4">
      
      {/* Active Diagnostic Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl shadow-sky-500/5 transition-all duration-300">
        
        {/* Assistant Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-700 tracking-wide uppercase">
                {currentNode.stageName}
              </div>
              <div className="text-xs text-slate-400">
                Auditable Decision Node: <code className="font-mono text-slate-600 font-semibold">{currentNode.id}</code>
              </div>
            </div>
          </div>

          {canGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-700 bg-sky-50/60 hover:bg-sky-100/80 border border-sky-100 transition-all"
              title="Return to previous question"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
          {currentNode.question}
        </h2>

        {/* Why This Matters Box (Progressive Disclosure) */}
        <div className="bg-gradient-to-r from-sky-50/70 to-blue-50/50 rounded-2xl p-4 border border-sky-100/80 mb-6">
          <div className="flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-slate-700 flex-1">
              <span className="font-bold text-slate-900 mr-1">Why this question matters:</span>
              {explanationLevel === 'technical' 
                ? currentNode.whyItMatters.technical 
                : currentNode.whyItMatters.simple}
            </div>
          </div>

          {/* Collapsible Technical Depth (if currently on Simple View) */}
          {explanationLevel === 'simple' && (
            <div className="mt-2.5 pt-2 border-t border-sky-100/60">
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="text-[11px] font-semibold text-sky-700 hover:text-sky-800 flex items-center space-x-1 transition-colors"
              >
                <Code2 className="w-3 h-3" />
                <span>{showTechnicalDetails ? 'Hide Technical Context' : 'Show Technical Context (Statistical & Mathematical Depth)'}</span>
              </button>

              {showTechnicalDetails && (
                <p className="text-[11px] text-slate-600 font-mono mt-1.5 pl-4 border-l-2 border-sky-300">
                  {currentNode.whyItMatters.technical}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Technical Considerations / Warnings (if any) */}
        {currentNode.technicalConsiderations && currentNode.technicalConsiderations.length > 0 && (
          <div className="mb-6 space-y-1.5">
            {currentNode.technicalConsiderations.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-amber-800 bg-amber-50/80 border border-amber-200/80 p-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Selectable Option Cards */}
        <div className="space-y-3">
          {currentNode.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id, customText)}
              className="w-full text-left p-4 rounded-2xl border border-sky-100 bg-white/70 hover:bg-sky-50/90 hover:border-sky-300 shadow-xs hover:shadow-md transition-all duration-200 group flex items-start justify-between space-x-3"
            >
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                  {option.label}
                </div>
                {option.description && (
                  <p className="text-xs text-slate-500 group-hover:text-slate-600 mt-1">
                    {option.description}
                  </p>
                )}
                {explanationLevel === 'technical' && option.technicalDetails && (
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    {option.technicalDetails}
                  </p>
                )}
              </div>
              <div className="w-7 h-7 rounded-full bg-sky-50 group-hover:bg-sky-600 flex items-center justify-center text-sky-600 group-hover:text-white transition-all shrink-0 mt-0.5">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        {/* Optional Custom Notes Input */}
        {currentNode.allowTextInput && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Add custom business objective details (optional):
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={currentNode.textInputPlaceholder || 'Type custom context here...'}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white/90"
            />
          </div>
        )}

      </div>

    </div>
  );
};
