
import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="relative h-screen bg-brand-dark overflow-y-auto scrollbar-hide flex flex-col items-center">
      {/* Background Architectural Watermark */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full text-brand-orange">
          <path fill="currentColor" d="M100 20c-44.1 0-80 35.9-80 80s35.9 80 80 80 80-35.9 80-80-35.9-80-80-80zm0 145c-35.8 0-65-29.2-65-65s29.2-65 65-65 65 29.2 65 65-29.2 65-65 65z"/>
        </svg>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative z-10 w-full px-8 pt-24 pb-16 flex flex-col items-center text-center">
        <div className="mb-10">
          <h1 className="luxury-text italic text-2xl text-brand-orange tracking-widest uppercase opacity-80">Dragon HAMS☆R</h1>
          <div className="h-[1px] w-12 bg-brand-orange mx-auto mt-2 opacity-40"></div>
        </div>
        
        <h2 className="text-4xl font-black text-brand-textPrimary uppercase leading-[1.1] mb-6 tracking-tight">
          Stop documenting your trading like a beginner.
        </h2>
        
        <p className="text-sm text-brand-textSecondary leading-relaxed max-w-[320px] mb-12 font-medium opacity-80">
          SMC BACKTESTER is a purpose-built system for traders who use Smart Money Concepts and want consistency, clarity, and real data—not scattered notes and broken spreadsheets.
        </p>

        <div className="w-full space-y-4">
          <button 
            onClick={onEnter}
            className="w-full py-5 bg-brand-orange text-brand-dark font-black rounded-xl active-scale transition-all uppercase tracking-[0.2em] text-xs"
          >
            Start Backtesting Properly
          </button>
          <button 
            onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full py-5 border border-brand-border text-brand-textPrimary font-black rounded-xl active-scale transition-all uppercase tracking-[0.2em] text-xs bg-brand-surface/20"
          >
            See Why This Is Different
          </button>
        </div>
      </section>

      {/* 2. THE PROBLEM */}
      <section id="problem" className="relative z-10 w-full px-6 py-16 space-y-8">
        <div className="space-y-2 px-2">
          <h3 className="text-xl font-black text-brand-textPrimary uppercase tracking-tight">The problem isn’t your strategy.</h3>
          <p className="text-brand-orange font-black text-xs uppercase tracking-widest">It’s how you document it.</p>
        </div>

        <div className="grid gap-4">
          <ProblemCard 
            title="Google Sheets" 
            desc="Fragile, time-consuming, and prone to burnout. Sheets were never built for trading logic." 
          />
          <ProblemCard 
            title="Notes Apps" 
            desc="Zero context, zero analytics. You are just writing stories without statistical validation." 
          />
          <ProblemCard 
            title="Screenshots" 
            desc="Visual noise without structured learning. Pixels don't build an edge; data does." 
          />
        </div>

        <div className="py-8 px-4 border-t border-brand-border mt-4">
          <p className="luxury-text italic text-brand-textSecondary text-lg text-center">
            "These tools were never designed for trading systems."
          </p>
        </div>
      </section>

      {/* 3. THE SOLUTION */}
      <section className="relative z-10 w-full px-6 py-16 bg-brand-surface/30">
        <div className="mb-12 space-y-2 px-2">
          <h3 className="text-xl font-black text-brand-textPrimary uppercase tracking-tight">Built specifically for SMC traders.</h3>
          <p className="text-brand-textSecondary font-medium text-xs leading-relaxed">Not a spreadsheet. Not a notes app. A complete backtesting engine.</p>
        </div>

        <div className="space-y-3">
          <SolutionItem title="Purpose-Built Logic" desc="Native fields for FVG, MSS, Order Blocks, and SMT. No custom hacks required." />
          <SolutionItem title="Session Intelligence" desc="Automatic tracking for London, NY, and Asia kill zones." />
          <SolutionItem title="Daily Thresholds" desc="Built-in discipline tracking and burnout prevention logic." />
          <SolutionItem title="KPI Engine" desc="Automatic win-rate, efficiency, and affinity calculations." />
        </div>
      </section>

      {/* 4. WHO IT'S FOR */}
      <section className="relative z-10 w-full px-6 py-20 text-center space-y-8">
        <h3 className="text-xl font-black text-brand-textPrimary uppercase tracking-tight">Whether you’re starting or refining your edge.</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bybit-card rounded-2xl text-left space-y-3">
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">New Traders</span>
            <p className="text-xs text-brand-textSecondary leading-relaxed">Learn structure. Avoid overtrading. Build discipline early.</p>
          </div>
          <div className="p-6 bybit-card rounded-2xl text-left space-y-3">
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Professionals</span>
            <p className="text-xs text-brand-textSecondary leading-relaxed">Validate edge. Track consistency. Refine setups statistically.</p>
          </div>
        </div>

        <p className="luxury-text italic text-brand-textPrimary text-xl pt-4">Same system. Different stages.</p>
      </section>

      {/* 5. UI/UX PROMISE */}
      <section className="relative z-10 w-full px-6 py-16 bg-brand-dark space-y-10 border-t border-brand-border">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-brand-textPrimary uppercase tracking-tight">Serious tools don’t need to feel complicated.</h3>
          <p className="text-xs text-brand-textSecondary uppercase tracking-widest font-black opacity-60">Minimalism x Precision</p>
        </div>

        <div className="bybit-card rounded-3xl p-8 space-y-6">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
               <span className="text-xs font-black text-brand-textPrimary uppercase">Bybit-level visual seriousness</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
               <span className="text-xs font-black text-brand-textPrimary uppercase">Telegram-level ease of use</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
               <span className="text-xs font-black text-brand-textPrimary uppercase">Zero spreadsheet anxiety</span>
             </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="relative z-10 w-full px-8 py-24 text-center space-y-8">
        <div className="space-y-4">
          <h3 className="text-3xl font-black text-brand-textPrimary uppercase tracking-tight leading-none">If you trade SMC, this should be your journal.</h3>
          <p className="text-brand-orange font-black text-xs uppercase tracking-widest">Everything else is a workaround.</p>
        </div>

        <button 
          onClick={onEnter}
          className="w-full py-6 bg-brand-orange text-brand-dark font-black rounded-xl shadow-[0_0_50px_rgba(247,167,7,0.2)] active-scale transition-all uppercase tracking-[0.3em] text-sm"
        >
          Start Using SMC BACKTESTER
        </button>
        
        <p className="text-[9px] text-brand-textSecondary font-black uppercase tracking-[0.5em] opacity-40">System Architecture by Dragon HAMS☆R</p>
      </section>
    </div>
  );
};

const ProblemCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="bybit-card rounded-2xl p-6 border-l-2 border-l-brand-border hover:border-l-brand-orange transition-all duration-300">
    <h4 className="text-[11px] font-black text-brand-textPrimary uppercase tracking-widest mb-2">{title}</h4>
    <p className="text-xs text-brand-textSecondary leading-relaxed">{desc}</p>
  </div>
);

const SolutionItem: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="p-6 border border-brand-border rounded-2xl bg-brand-dark/40">
    <h4 className="text-[11px] font-black text-brand-orange uppercase tracking-widest mb-1.5">{title}</h4>
    <p className="text-xs text-brand-textSecondary leading-relaxed font-medium">{desc}</p>
  </div>
);

export default LandingPage;
