import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SidebarSummary } from './components/SidebarSummary';
import { ChatInterface } from './components/ChatInterface';
import { ResultsDashboard } from './components/ResultsDashboard';
import { SplashScreen } from './components/SplashScreen';
import { DecisionTreeEngine } from './engine/DecisionTreeEngine';
import { DiagnosticOrchestrator } from './engine/DiagnosticOrchestrator';
import { ExplanationLevel, ComprehensiveDiagnosisResult } from './types/decision';
import { TestJourney } from './presets/testJourneys';

export const App: React.FC = () => {
  // Initialize Decision Tree Engine
  const engine = useMemo(() => new DecisionTreeEngine(), []);

  const [currentNode, setCurrentNode] = useState(engine.getCurrentNode());
  const [history, setHistory] = useState(engine.getHistory());
  const [context, setContext] = useState(engine.getContext());
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('simple');

  const isComplete = engine.isComplete();
  const progressPercentage = engine.getProgressPercentage();

  // Synthesize results when complete
  const diagnosisResult: ComprehensiveDiagnosisResult | null = useMemo(() => {
    if (!isComplete) return null;
    return DiagnosticOrchestrator.synthesize(context);
  }, [isComplete, context]);

  const updateStateFromEngine = () => {
    setCurrentNode(engine.getCurrentNode());
    setHistory(engine.getHistory());
    setContext(engine.getContext());
  };

  const handleSelectOption = (optionId: string, customText?: string) => {
    engine.selectOption(optionId, customText);
    updateStateFromEngine();
  };

  const handleGoBack = () => {
    const prevNode = engine.goBack();
    if (prevNode) {
      updateStateFromEngine();
    }
  };

  const handleRewindToStep = (index: number) => {
    engine.goToHistoryIndex(index);
    updateStateFromEngine();
  };

  const handleReset = () => {
    engine.reset();
    updateStateFromEngine();
  };

  const handleToggleExplanationLevel = () => {
    setExplanationLevel(prev => prev === 'simple' ? 'technical' : 'simple');
  };

  const handleSelectJourney = (journey: TestJourney) => {
    engine.reset();
    for (const optId of journey.optionSequence) {
      engine.selectOption(optId);
    }
    updateStateFromEngine();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/70 via-blue-50/40 to-slate-100 flex flex-col font-sans selection:bg-sky-200 selection:text-sky-900">
      
      {/* 2-Second Logo Splash Screen with smooth fade out */}
      <SplashScreen />

      {/* Top Navigation */}
      <Header
        explanationLevel={explanationLevel}
        onToggleExplanationLevel={handleToggleExplanationLevel}
        onSelectJourney={handleSelectJourney}
        onReset={handleReset}
        isComplete={isComplete}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        
        {/* Left Interactive Sidebar / Decision Trail */}
        <SidebarSummary
          progressPercentage={progressPercentage}
          currentNode={currentNode}
          history={history}
          context={context}
          onRewindToStep={handleRewindToStep}
          dataReadinessStatus={diagnosisResult?.dataReadiness.status || (context.dataModality === 'no_data' ? 'not_ready' : 'ready')}
          scopeCoverage={diagnosisResult?.scopeCoverage || 'fully_covered'}
        />

        {/* Center Main Work Area: Chat or Final Dashboard */}
        {isComplete && diagnosisResult ? (
          <ResultsDashboard
            result={diagnosisResult}
            history={history}
            explanationLevel={explanationLevel}
            onRestart={handleReset}
          />
        ) : (
          <ChatInterface
            currentNode={currentNode}
            explanationLevel={explanationLevel}
            onSelectOption={handleSelectOption}
            onGoBack={handleGoBack}
            canGoBack={history.length > 0}
            onReset={handleReset}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-sky-100 bg-white/40 backdrop-blur-xs py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Algorithm Genie &copy; 2026. Auditable Machine Learning Recommendation Tool.</span>
          <span className="text-[11px] text-slate-400">Grounding: Scikit-Learn Standards &bull; Google ML Production Systems &bull; SHAP Framework</span>
        </div>
      </footer>

    </div>
  );
};
