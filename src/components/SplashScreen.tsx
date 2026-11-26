import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.jpeg';

export const SplashScreen: React.FC = () => {
  const [isFading, setIsFading] = useState(false);
  const [isGone, setIsGone] = useState(false);

  useEffect(() => {
    // Show on white background for exactly 2 seconds
    const timer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // After 2s + 700ms fade transition, remove from DOM
    const removeTimer = setTimeout(() => {
      setIsGone(true);
    }, 2700);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (isGone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 transition-opacity duration-700 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden={isFading}
    >
      <div className="flex flex-col items-center max-w-sm w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/10 border border-slate-100 flex items-center justify-center bg-white p-2">
          <img
            src={logoImg}
            alt="Algorithm Genie Logo"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>
        <div className="mt-6 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            Loading Assistant...
          </span>
        </div>
      </div>
    </div>
  );
};
