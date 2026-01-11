
import React from 'react';
import { SMC_DEFINITIONS } from '../constants';

const HelpSection: React.FC = () => {
  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="px-1">
        <h2 className="text-2xl font-black text-brand-textPrimary italic uppercase tracking-tight">SMC Academy</h2>
        <p className="text-[10px] text-brand-textSecondary font-black uppercase tracking-[0.2em] mt-1 opacity-60">Master the Smart Money Logic</p>
      </div>

      {/* SMC Cards */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-brand-textSecondary uppercase tracking-widest px-1">Core Concepts</h3>
        {SMC_DEFINITIONS.map((def, idx) => (
          <div key={idx} className="bybit-card rounded-[24px] p-5 space-y-2 active-scale transition-all">
            <h4 className="font-black text-brand-orange text-xs uppercase tracking-widest">{def.title}</h4>
            <p className="text-xs text-brand-textSecondary leading-relaxed font-medium">{def.description}</p>
          </div>
        ))}
      </div>

      {/* Backtesting Rules */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-black text-brand-textSecondary uppercase tracking-widest px-1">The Professional Standard</h3>
        <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-[24px] p-6 space-y-6">
           <RuleItem number="01" title="The Tue–Thu Rule" desc="Focus 80% of effort on Mid-week data. This is where market clarity peak volume reside." />
           <RuleItem number="02" title="Journal Every Outcome" desc="Wins build confidence, losses build the edge. Never skip the post-trade notes." />
           <RuleItem number="03" title="Deep Focus Only" desc="45-minute cycles prevent decision fatigue. Treat backtesting like a live trade execution." />
        </div>
      </section>
      
      <div className="text-center pt-4 opacity-30">
        <p className="text-[9px] text-brand-textSecondary font-black uppercase tracking-[0.3em]">Legendary Edition v5.0.0</p>
      </div>
    </div>
  );
};

const RuleItem: React.FC<{ number: string; title: string; desc: string }> = ({ number, title, desc }) => (
  <div className="flex gap-5">
    <span className="text-brand-blue font-black text-xl italic leading-none">{number}</span>
    <div className="space-y-1">
      <h4 className="text-brand-textPrimary font-black text-[11px] uppercase tracking-widest">{title}</h4>
      <p className="text-xs text-brand-textSecondary leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

export default HelpSection;
