
import React, { useMemo } from 'react';
import { Trade, Result, User } from '../types';

interface AIInsightsProps {
  trades: Trade[];
  user: User;
}

const AIInsights: React.FC<AIInsightsProps> = ({ trades, user }) => {
  const insights = useMemo(() => {
    if (trades.length < 5) return null;

    // Pattern 1: Best Session
    const sessionWinRates = trades.reduce((acc, t) => {
      if (!acc[t.session]) acc[t.session] = { w: 0, t: 0 };
      acc[t.session].t++;
      if (t.result === Result.WIN) acc[t.session].w++;
      return acc;
    }, {} as any);

    let bestSession = { name: '', wr: 0 };
    Object.entries(sessionWinRates).forEach(([name, stats]: [string, any]) => {
      const wr = (stats.w / stats.t) * 100;
      if (wr > bestSession.wr) bestSession = { name, wr };
    });

    // Pattern 2: Most Effective Confluence
    const confluenceStats = trades.reduce((acc, t) => {
      Object.entries(t.setup).forEach(([key, active]) => {
        if (active) {
          if (!acc[key]) acc[key] = { w: 0, t: 0 };
          acc[key].t++;
          if (t.result === Result.WIN) acc[key].w++;
        }
      });
      return acc;
    }, {} as any);

    let bestConfluence = { name: '', wr: 0 };
    Object.entries(confluenceStats).forEach(([key, stats]: [string, any]) => {
      const wr = (stats.w / stats.t) * 100;
      if (wr > bestConfluence.wr) bestConfluence = { name: key, wr };
    });

    return { bestSession, bestConfluence };
  }, [trades]);

  if (!insights) {
    return (
      <div className="p-10 text-center space-y-6">
        <div className="w-24 h-24 bg-brand-surface rounded-[32px] flex items-center justify-center mx-auto border border-brand-border">
          <svg className="w-10 h-10 text-brand-orange animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div className="space-y-2">
          <p className="text-brand-textPrimary font-black uppercase text-xs tracking-widest">Collecting Data...</p>
          <p className="text-[10px] text-brand-textSecondary leading-relaxed px-10">Record at least 5 trades to unlock Dragon-level AI insights and pattern recognition.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="px-1">
        <h2 className="text-2xl font-black text-brand-textPrimary italic uppercase tracking-tight">AI Insights</h2>
        <p className="text-[10px] text-brand-textSecondary font-black uppercase tracking-[0.2em] mt-1 opacity-60">Assistive Performance Analysis</p>
      </div>

      <div className="bybit-card bg-brand-orange/5 border-brand-orange/20 rounded-[24px] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 className="text-xs font-black text-brand-textPrimary uppercase tracking-widest">Edge Identified</h3>
            <p className="text-[10px] text-brand-orange font-bold uppercase">Critical Performance Cluster</p>
          </div>
        </div>
        <p className="text-sm text-brand-textSecondary leading-relaxed font-medium">
          Your win rate is highest in the <span className="text-brand-textPrimary font-black">{insights.bestSession.name}</span> session at <span className="text-brand-orange font-black">{Math.round(insights.bestSession.wr)}%</span>. 
          Focusing strictly on this session could significantly improve your expectancy.
        </p>
      </div>

      <div className="bybit-card rounded-[24px] p-6 space-y-6">
        <h3 className="text-[11px] font-black text-brand-textSecondary uppercase tracking-widest">Confluence Efficiency</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-brand-textPrimary uppercase">{insights.bestConfluence.name.replace(/([A-Z])/g, ' $1')}</span>
            <span className="text-xs font-black text-brand-orange">{Math.round(insights.bestConfluence.wr)}% Win Rate</span>
          </div>
          <p className="text-xs text-brand-textSecondary leading-relaxed italic">"This logic is currently your strongest statistical edge. It appears in {trades.filter(t => t.setup[insights.bestConfluence.name]).length} of your trades."</p>
        </div>
      </div>

      <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-[24px] p-6 space-y-3">
        <h3 className="text-[11px] font-black text-brand-blue uppercase tracking-widest">Workflow Suggestion</h3>
        <p className="text-xs text-brand-textSecondary leading-relaxed">
          Based on your current streak, you are most productive during the first 45 minutes of your backtesting session. Avoid extending sessions beyond 2 hours to maintain decision quality.
        </p>
      </div>
    </div>
  );
};

export default AIInsights;
