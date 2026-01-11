
import React, { useMemo } from 'react';
import { Trade, Result, User } from '../types';

interface AnalyticsProps {
  trades: Trade[];
  user: User;
}

const Analytics: React.FC<AnalyticsProps> = ({ trades, user }) => {
  const analytics = useMemo(() => {
    if (trades.length === 0) return null;

    const totalTrades = trades.length;
    const wins = trades.filter(t => t.result === Result.WIN).length;
    const losses = trades.filter(t => t.result === Result.LOSS).length;
    const winRate = (wins / totalTrades) * 100;
    const totalPnl = trades.reduce((sum, t) => sum + (t.pnlPercent || 0), 0);
    const avgRr = trades.reduce((sum, t) => sum + (t.rr || 0), 0) / totalTrades;

    const coinPerformance = trades.reduce((acc, t) => {
      if (!acc[t.coin]) acc[t.coin] = { wins: 0, total: 0, pnl: 0 };
      acc[t.coin].total++;
      acc[t.coin].pnl += t.pnlPercent || 0;
      if (t.result === Result.WIN) acc[t.coin].wins++;
      return acc;
    }, {} as Record<string, { wins: number, total: number, pnl: number }>);

    const setupPerformance = trades.reduce((acc, t) => {
      Object.entries(t.setup).forEach(([key, val]) => {
        if (val) {
          if (!acc[key]) acc[key] = { wins: 0, total: 0, pnl: 0 };
          acc[key].total++;
          acc[key].pnl += t.pnlPercent || 0;
          if (t.result === Result.WIN) acc[key].wins++;
        }
      });
      return acc;
    }, {} as Record<string, { wins: number, total: number, pnl: number }>);

    const pnlHistory = [...trades]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc, t) => {
        const last = acc.length > 0 ? acc[acc.length - 1] : 0;
        acc.push(last + (t.pnlPercent || 0));
        return acc;
      }, [] as number[]);

    return { 
      totalTrades, 
      winRate, 
      totalPnl, 
      avgRr, 
      wins, 
      losses, 
      coinPerformance, 
      setupPerformance, 
      pnlHistory 
    };
  }, [trades]);

  if (!analytics) {
    return (
      <div className="p-10 text-center space-y-6">
        <div className="w-24 h-24 bg-brand-surface rounded-[32px] flex items-center justify-center mx-auto border border-brand-border">
          <svg className="w-10 h-10 text-brand-textSecondary opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <div className="space-y-2">
          <p className="text-brand-textPrimary font-black uppercase text-xs tracking-widest">No Trading Data</p>
          <p className="text-[10px] text-brand-textSecondary leading-relaxed px-10">Execute and log your first backtest trade to generate performance analytics.</p>
        </div>
      </div>
    );
  }

  const maxHistory = Math.max(...analytics.pnlHistory.map(Math.abs), 1);

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="px-1">
        <h2 className="text-2xl font-black text-brand-textPrimary italic uppercase tracking-tight">Performance Deck</h2>
        <p className="text-[10px] text-brand-textSecondary font-black uppercase tracking-[0.2em] mt-1 opacity-60">Edge Validation & Growth</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bybit-card rounded-[24px] p-6 space-y-1">
          <p className="text-[9px] font-black text-brand-textSecondary uppercase tracking-widest opacity-60">Cumulative P&L</p>
          <p className={`text-2xl font-black tracking-tighter ${analytics.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
            {analytics.totalPnl > 0 ? '+' : ''}{analytics.totalPnl.toFixed(1)}%
          </p>
        </div>
        <div className="bybit-card rounded-[24px] p-6 space-y-1">
          <p className="text-[9px] font-black text-brand-textSecondary uppercase tracking-widest opacity-60">Win Rate</p>
          <p className="text-2xl font-black text-brand-textPrimary tracking-tighter">
            {Math.round(analytics.winRate)}%
          </p>
        </div>
      </div>

      {/* Equity Curve (Mini) */}
      <div className="bybit-card rounded-[24px] p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-brand-textSecondary uppercase tracking-widest">Growth Curve</h3>
          <span className={`text-[10px] font-black uppercase ${analytics.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
            {analytics.totalPnl >= 0 ? 'Expansion' : 'Drawdown'}
          </span>
        </div>
        <div className="h-32 flex items-end gap-1 px-1">
          {analytics.pnlHistory.map((val, i) => {
            const height = (Math.abs(val) / maxHistory) * 100;
            return (
              <div 
                key={i} 
                className={`flex-1 min-w-[4px] rounded-t-sm transition-all duration-500 ${val >= 0 ? 'bg-emerald-500/40 border-t border-emerald-400' : 'bg-red-500/40 border-t border-red-500'}`}
                style={{ height: `${Math.max(height, 5)}%` }}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-brand-textSecondary uppercase tracking-widest px-1">Session Summary</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Trades" value={analytics.totalTrades} />
          <StatBox label="Wins" value={analytics.wins} color="text-emerald-400" />
          <StatBox label="Losses" value={analytics.losses} color="text-red-500" />
        </div>
      </div>

      {/* Asset Performance */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-brand-textSecondary uppercase tracking-widest px-1">Asset Performance</h3>
        <div className="bybit-card rounded-[24px] overflow-hidden divide-y divide-brand-border/30">
          {/* Fix: Explicitly type data as any to resolve property access on unknown type */}
          {Object.entries(analytics.coinPerformance).map(([coin, data]: [string, any]) => (
            <div key={coin} className="flex justify-between items-center p-5">
              <div>
                <p className="text-sm font-black text-brand-textPrimary">{coin}</p>
                <p className="text-[9px] text-brand-textSecondary font-black uppercase opacity-60">{data.total} Trades</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${data.pnl >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                  {data.pnl > 0 ? '+' : ''}{data.pnl.toFixed(1)}%
                </p>
                <p className="text-[9px] text-brand-textSecondary font-black uppercase opacity-60">WR: {Math.round((data.wins / data.total) * 100)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logic Efficiency */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-brand-textSecondary uppercase tracking-widest px-1">Logic Affinity</h3>
        <div className="space-y-3">
          {/* Fix: Explicitly type parameters to resolve property access on unknown type */}
          {Object.entries(analytics.setupPerformance).sort((a: any, b: any) => b[1].pnl - a[1].pnl).map(([id, data]: [string, any]) => {
            const label = user.template.customConfluences.find(c => c.id === id)?.label || id;
            return (
              <div key={id} className="bybit-card rounded-2xl p-4 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-brand-textPrimary uppercase tracking-tight">{label}</p>
                  <div className="w-32 bg-brand-dark h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${data.pnl >= 0 ? 'bg-emerald-400' : 'bg-red-500'}`} 
                      style={{ width: `${Math.min((data.wins/data.total)*100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black ${data.pnl >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                    {data.pnl > 0 ? '+' : ''}{data.pnl.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color }) => (
  <div className="bybit-card rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
    <p className="text-[9px] font-black text-brand-textSecondary uppercase tracking-widest opacity-60">{label}</p>
    <p className={`text-lg font-black ${color || 'text-brand-textPrimary'}`}>{value}</p>
  </div>
);

export default Analytics;
