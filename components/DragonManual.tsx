
import React, { useState } from 'react';

interface ManualSection {
  title: string;
  icon: string;
  content: React.ReactNode;
}

const DragonManual: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const sections: ManualSection[] = [
    {
      title: "Core SMC Philosophy",
      icon: "🐉",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-brand-textSecondary leading-relaxed">SMC Backtester is designed for the <span className="text-brand-orange font-bold">Smart Money</span> mindset. We don't just track trades; we track institutional footprints.</p>
          <div className="bg-brand-surface rounded-xl p-4 border border-brand-border space-y-2">
            <h4 className="text-[10px] font-black text-brand-orange uppercase">Institutional Flow</h4>
            <p className="text-[11px] text-brand-textPrimary italic">"Think like a whale, act like a dragon."</p>
          </div>
        </div>
      )
    },
    {
      title: "The Tue–Thu Protocol",
      icon: "⚡",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-brand-textSecondary leading-relaxed">Mid-week expansion is where the highest probability setups reside. Mondays are for observation, Fridays for management.</p>
          <div className="grid grid-cols-3 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
              <div key={d} className={`p-2 rounded-lg text-center border ${['Tue', 'Wed', 'Thu'].includes(d) ? 'border-brand-orange bg-brand-orange/10 text-brand-orange' : 'border-brand-border bg-brand-dark text-brand-textSecondary opactiy-50'}`}>
                <span className="text-[10px] font-black uppercase">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "KPI Engine Deep Dive",
      icon: "📊",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-brand-textSecondary leading-relaxed">Understand your metrics to kill your ego.</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-1.5"></div>
              <div>
                <span className="text-xs font-black text-brand-textPrimary block">Efficiency Score</span>
                <p className="text-[10px] text-brand-textSecondary">Measures consistency in following your checklist.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-1.5"></div>
              <div>
                <span className="text-xs font-black text-brand-textPrimary block">Consistency Wheel</span>
                <p className="text-[10px] text-brand-textSecondary">Visualizes your trade distribution across the week.</p>
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "AI Insights System",
      icon: "🤖",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-brand-textSecondary leading-relaxed">Our AI layer analyzes cluster patterns to find your "affinities".</p>
          <div className="bybit-card p-4 rounded-xl border-brand-blue/30 bg-brand-blue/5">
             <h4 className="text-[10px] font-black text-brand-blue uppercase mb-2">Pattern Recognition</h4>
             <p className="text-[11px] text-brand-textSecondary italic">"The AI detects which specific SMC setup (e.g. FVG + Liquidity Sweep) has your highest cumulative R:R."</p>
          </div>
        </div>
      )
    },
    {
      title: "Mastering the Journal",
      icon: "✍️",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-brand-textSecondary leading-relaxed">The richest traders are the best writers. Use our Telegram-style editor to document the psychology behind the trade.</p>
          <div className="bg-brand-dark p-3 rounded-lg border border-brand-border">
            <p className="text-[10px] text-brand-textSecondary">Pro Tip: Use <span className="text-brand-orange">Rich Text</span> formatting to highlight emotional triggers during high-volatility sessions.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-2">
         <button onClick={onBack} className="p-2.5 bg-brand-surface border border-brand-border rounded-xl active-scale transition-all">
           <svg className="w-5 h-5 text-brand-textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
         </button>
         <div>
           <h2 className="text-2xl font-black text-brand-textPrimary italic uppercase tracking-tight">Dragon Manual</h2>
           <p className="text-[10px] text-brand-textSecondary font-black uppercase tracking-[0.2em] mt-1 opacity-60">Master the SMC Operating System</p>
         </div>
      </div>

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div key={idx} className={`bybit-card rounded-[24px] overflow-hidden transition-all duration-300 ${openSection === idx ? 'border-brand-orange/40' : 'border-brand-border'}`}>
            <button 
              onClick={() => setOpenSection(openSection === idx ? null : idx)}
              className="w-full flex justify-between items-center p-6 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{section.icon}</span>
                <span className="font-black text-brand-textPrimary uppercase tracking-widest text-[11px]">{section.title}</span>
              </div>
              <svg className={`w-4 h-4 text-brand-textSecondary transition-transform duration-300 ${openSection === idx ? 'rotate-180 text-brand-orange' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openSection === idx && (
              <div className="p-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-brand-border/10 mt-2 mx-4">
                <div className="pt-4">
                  {section.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-brand-surface/30 rounded-3xl p-8 border border-dashed border-brand-border text-center">
        <p className="text-[10px] font-black text-brand-textSecondary uppercase tracking-[0.4em] mb-2 opacity-50">Operational Readiness</p>
        <p className="text-xs text-brand-textPrimary font-bold italic leading-relaxed">"You are now ready to backtest with the discipline of an institutional legend."</p>
      </div>
    </div>
  );
};

export default DragonManual;
