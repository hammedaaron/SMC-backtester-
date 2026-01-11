
import React, { useState, useMemo } from 'react';
import { Trade, Result, SessionType, User } from '../types';

interface TradeListProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  user: User;
}

const TradeList: React.FC<TradeListProps> = ({ trades, onEdit, onDelete, user }) => {
  const [filter, setFilter] = useState<{ result?: Result; session?: SessionType | string; query: string }>({ query: '' });

  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      if (filter.result && t.result !== filter.result) return false;
      if (filter.session && t.session !== filter.session) return false;
      if (filter.query) {
        const q = filter.query.toLowerCase();
        return t.coin.toLowerCase().includes(q) || 
               t.notes.toLowerCase().includes(q) || 
               (t.lessonSnippet && t.lessonSnippet.toLowerCase().includes(q));
      }
      return true;
    });
  }, [trades, filter]);

  const exportCSV = () => {
    const headers = ['Date', 'Coin', 'Session', 'Type', 'Result', 'RR', 'PnL%', 'Lesson', 'Notes'];
    const rows = filteredTrades.map(t => [
      t.date, t.coin, t.session, t.type, t.result, t.rr, t.pnlPercent, t.lessonSnippet || '', t.notes.replace(/<[^>]*>?/gm, '').replace(/,/g, ';')
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `smc_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      {/* Telegram-style sticky header and filters */}
      <div className="space-y-4 sticky top-0 bg-brand-dark/95 backdrop-blur-xl z-10 py-2 -mx-6 px-6 border-b border-brand-border/50">
        <div className="flex justify-between items-center">
           <h2 className="text-xs font-black text-brand-textSecondary uppercase tracking-widest">Backtest Log</h2>
           <button onClick={exportCSV} className="text-[10px] font-black uppercase text-brand-orange bg-brand-orange/10 px-4 py-2 rounded-xl active-scale">
             Export CSV
           </button>
        </div>

        <div className="relative">
           <input 
             type="text" 
             placeholder="Search setups or assets..." 
             value={filter.query}
             onChange={(e) => setFilter(prev => ({ ...prev, query: e.target.value }))}
             className="w-full bg-brand-surface border border-brand-border rounded-2xl px-12 py-3.5 text-sm text-brand-textPrimary focus:ring-1 focus:ring-brand-orange outline-none transition-all placeholder:text-brand-textSecondary/50 font-medium"
           />
           <svg className="w-5 h-5 text-brand-textSecondary/50 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          <FilterPill label="All" active={!filter.result && !filter.session} onClick={() => setFilter(p => ({ ...p, result: undefined, session: undefined }))} />
          <FilterPill label="Wins" active={filter.result === Result.WIN} onClick={() => setFilter(p => ({ ...p, result: Result.WIN }))} />
          <FilterPill label="Losses" active={filter.result === Result.LOSS} onClick={() => setFilter(p => ({ ...p, result: Result.LOSS }))} />
          {user.template.sessions.map(s => (
            <FilterPill key={s} label={s} active={filter.session === s} onClick={() => setFilter(p => ({ ...p, session: s }))} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTrades.map((trade) => (
          <div key={trade.id} className="bybit-card rounded-[24px] p-6 space-y-5 group active-scale transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-black text-2xl text-brand-textPrimary tracking-tight">{trade.coin}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest ${trade.type === 'Long' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trade.type}
                  </span>
                </div>
                <p className="text-[10px] text-brand-textSecondary font-black uppercase tracking-[0.2em]">
                  {new Date(trade.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {trade.session}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${trade.result === Result.WIN ? 'bg-emerald-500 text-brand-dark' : trade.result === Result.LOSS ? 'bg-red-500 text-brand-dark' : 'bg-brand-surface text-brand-textSecondary border border-brand-border'}`}>
                {trade.result}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 py-4 border-y border-brand-border/30">
              <MetricItem label="R:R" value={`${trade.rr}:1`} />
              <MetricItem label="P&L" value={`${trade.pnlPercent}%`} highlight={trade.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'} />
              <MetricItem label="Bias" value={trade.bias} align="right" />
            </div>

            {trade.lessonSnippet && (
              <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                 </div>
                 <p className="text-xs font-bold text-brand-blue/90 leading-tight italic">{trade.lessonSnippet}</p>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2 opacity-40 group-hover:opacity-100 transition-opacity">
               <button onClick={() => onEdit(trade)} className="w-10 h-10 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center text-brand-textSecondary hover:text-brand-orange hover:border-brand-orange transition-all active-scale">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
               </button>
               <button onClick={() => onDelete(trade.id)} className="w-10 h-10 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center text-brand-textSecondary hover:text-red-500 hover:border-red-500 transition-all active-scale">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FilterPill: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all active-scale border ${active ? 'bg-brand-orange border-brand-orange text-brand-dark' : 'bg-brand-surface border-brand-border text-brand-textSecondary hover:text-brand-textPrimary'}`}>{label}</button>
);

const MetricItem: React.FC<{ label: string; value: string | number; highlight?: string; align?: string }> = ({ label, value, highlight, align }) => (
  <div className={`flex flex-col gap-1.5 ${align === 'right' ? 'items-end' : ''}`}>
    <p className="text-[10px] text-brand-textSecondary uppercase font-black tracking-widest opacity-60">{label}</p>
    <p className={`text-sm font-black tracking-tight ${highlight || 'text-brand-textPrimary'}`}>{value}</p>
  </div>
);

export default TradeList;
