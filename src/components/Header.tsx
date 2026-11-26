import React from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  ChevronDown 
} from 'lucide-react';
import { ExplanationLevel } from '../types/decision';
import { TEST_JOURNEYS, TestJourney } from '../presets/testJourneys';

interface HeaderProps {
  explanationLevel: ExplanationLevel;
  onToggleExplanationLevel: () => void;
  onSelectJourney: (journey: TestJourney) => void;
  onReset: () => void;
  isComplete: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  explanationLevel,
  onToggleExplanationLevel,
  onSelectJourney,
  onReset,
  isComplete
}) => {
  const [journeyDropdownOpen, setJourneyDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md border-b border-sky-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Title (Clean: no corner logo box) */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl">
              Algorithm <span className="text-sky-600">Genie</span>
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-100/80 text-sky-700 rounded-full border border-sky-200">
              ML Recommendation Tool v1.0
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
            Auditable Decision Tree & Algorithmic Strategy Advisor
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Preset Test Journeys Dropdown */}
          <div className="relative">
            <button
              onClick={() => setJourneyDropdownOpen(!journeyDropdownOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50/80 hover:bg-sky-100/80 text-sky-800 border border-sky-200/80 transition-all duration-200 shadow-xs"
              title="Test predefined user journeys"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden md:inline">Test Journeys</span>
              <ChevronDown className="w-3 h-3 text-sky-600 ml-0.5" />
            </button>

            {journeyDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-lg border border-sky-200 rounded-xl shadow-xl z-50 p-2 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setJourneyDropdownOpen(false)}
              >
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select a Predefined User Journey
                </div>
                {TEST_JOURNEYS.map((journey) => (
                  <button
                    key={journey.id}
                    onClick={() => {
                      onSelectJourney(journey);
                      setJourneyDropdownOpen(false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-sky-50/80 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-sky-700">
                        {journey.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {journey.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Explanation Level Toggle */}
          <button
            onClick={onToggleExplanationLevel}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border shadow-xs ${
              explanationLevel === 'technical'
                ? 'bg-blue-600 text-white border-blue-700 shadow-sky-500/10'
                : 'bg-white/80 hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
            title="Toggle between Simple (Executive) and Technical (Senior DS/MLE) explanations"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>
              {explanationLevel === 'technical' ? 'Technical View' : 'Simple View'}
            </span>
          </button>

          {/* Reset Session */}
          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-slate-100/80 border border-slate-200 transition-all duration-200"
            title="Reset diagnostic session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>

        </div>

      </div>
    </header>
  );
};
