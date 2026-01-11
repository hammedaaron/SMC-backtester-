import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { Trade, Result, User } from '../types';

interface DashboardProps {
  trades: Trade[];
  user: User;
  setTab: (tab: any) => void;
  setUser: (user: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ trades, user, setTab, setUser }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [showGuide, setShowGuide] = useState(false);

  const stats = useMemo(() => {
    const total = trades.length;
    if (total === 0) return { winRate: 0, efficiency: 0, totalWeek: 0 };
    const wins = trades.filter(t => t.result === Result.WIN).length;
    const efficiency = (trades.filter(t => Object.values(t.setup).filter(Boolean).length >= 4).length / Math.max(1, total)) * 100;
    return { winRate: Math.round((wins / total) * 100), efficiency: Math.round(efficiency), totalWeek: trades.length };
  }, [trades]);

  useLayoutEffect(() => {
    if (wheelRef.current) {
      const tueElement = wheelRef.current.querySelector('#day-1') as HTMLElement;
      if (tueElement) {
        wheelRef.current.scrollLeft = tueElement.offsetLeft - 24; 
      }
    }
  }, []);

  const togglePlannedDay = (dayIndex: number) => {
    const currentDays = user.template.plannedTradingDays || [];
    let updatedDays;
    if (currentDays.includes(dayIndex)) {
      updatedDays = currentDays.filter(d => d !== dayIndex);
    } else {
      updatedDays = [...currentDays, dayIndex];
    }
    setUser({
      ...user,
      template: {
        ...user.template,
        plannedTradingDays: updatedDays
      }
    });
  };

  const widgets = user.template.dashboardWidgets;

  const renderWidget = (id: string) => {
    switch (id) {
      case 'burnout':
        const burnRate = ((user.todayMinutes || 0) / (user.dailyHourLimit * 60)) * 100;
        return (
          <div key={id} className="bybit-card rounded-[24px] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-[11px] font-black text-brand-textSecondary uppercase tracking-widest">Focus Session</h2>
                <p className="text-brand-textPrimary font-bold text-sm mt-0.5">{user.todayMinutes}m / {user.dailyHourLimit}h Goal</p>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase ${burnRate > 80 ? 'bg-red-500/10 text-red-400' : 'bg-brand-orange/10 text-brand-orange'}`}>
                {burnRate > 80 ? 'Limit Reached' : 'Optimal'}
              </span>
            </div>
            <div className="w-full bg-brand-dark h-2.5 rounded-full overflow-hidden border border-brand-border">
              <div 
                className="h-full bg-brand-orange transition-all duration-1000 shadow-[0_0_8px_#F7A707]" 
                style={{ width: `${Math.min(burnRate, 100)}%` }}
              ></div>
            </div>
          </div>
        );
      case 'streaks':
        return (
          <div key={id} className="grid grid-cols-2 gap-4">
            <div className="bybit-card rounded-[24px] p-5 text-center flex flex-col items-center justify-center space-y-1">
              <p className="text-3xl font-black text-brand-orange leading-tight">{user.streakCount} 🔥</p>
              <p className="text-[10px] font-black text-brand-textSecondary uppercase tracking-widest">Day Streak</p>
            </div>
            <div className="bybit-card rounded-[24px] p-5 text-center flex flex-col items-center justify-center space-y-1">
              <p className="text-3xl font-black text-brand-textPrimary leading-tight">{stats.efficiency}%</p>
              <p className="text-[10px] font-black text-brand-textSecondary uppercase tracking-widest">Efficiency</p>
            </div>
          </div>
        );
      case 'insights_preview':
        return (
          <div key={id} onClick={() => setTab('insights')} className="bybit-card bg-brand-blue/5 border-brand-blue/20 rounded-[24px] p-6 active-scale transition-all relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-16 h-16 text-brand-blue" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
             </div>
             <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-brand-textPrimary text-xs uppercase tracking-widest">Assistive Insights</h3>
                <span className="text-[9px] font-black text-brand-blue uppercase bg-brand-blue/10 px-2 py-0.5 rounded">AI Active</span>
             </div>
             <p className="text-xs text-brand-textSecondary leading-relaxed italic">"Your highest Win Rate session is currently London. Focus on NY session risk management."</p>
          </div>
        );
      case 'consistency':
        return (
          <div key={id} className="bybit-card rounded-[24px] p-6 space-y-5">
             <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-brand-textSecondary uppercase tracking-[0.2em]">Consistency Wheel</h3>
                <span className="text-[9px] font-black text-brand-textPrimary opacity-40">TAP TO PLAN DAYS</span>
             </div>
             <div 
               ref={wheelRef} 
               className="flex gap-4 h-16 items-end overflow-x-auto scrollbar-hide px-1 snap-x"
             >
                {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((day, i) => {
                   const dayNum = (i + 1) % 7;
                   const active = trades.some(t => {
                     const date = new Date(t.date);
                     return date.getDay() === dayNum;
                   });
                   const isPlanned = (user.template.plannedTradingDays || []).includes(i);

                   return (
                     <button 
                       key={i} 
                       id={`day-${i}`} 
                       onClick={() => togglePlannedDay(i)}
                       className="flex-shrink-0 w-12 flex flex-col items-center gap-2 snap-center focus:outline-none group"
                     >
                        <div className={`w-full rounded-lg border transition-all duration-300 relative ${active ? 'bg-brand-orange border-brand-orange h-full shadow-[0_0_12px_rgba(247,167,7,0.3)]' : isPlanned ? 'bg-brand-orange/20 border-brand-orange h-3/4' : 'bg-brand-dark border-transparent h-1/4'}`}>
                           {isPlanned && !active && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-orange rounded-full animate-pulse"></div>}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${active ? 'text-brand-orange' : isPlanned ? 'text-brand-orange/80' : 'text-brand-textSecondary opacity-40'}`}>{day}</span>
                     </button>
                   );
                })}
                <div className="flex-shrink-0 w-4"></div> {/* End spacer */}
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      {/* Dynamic Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-brand-textPrimary tracking-tight uppercase italic">Portfolio Overview</h2>
        <button onClick={() => setTab('template')} className="text-[10px] font-black text-brand-orange uppercase tracking-widest bg-brand-orange/5 px-3 py-1.5 rounded-xl border border-brand-orange/20 active-scale">Customize</button>
      </div>

      {/* Enhanced Guide Dropdown */}
      <div className="bybit-card rounded-[24px] overflow-hidden border-brand-orange/30 shadow-[0_4px_20px_rgba(247,167,7,0.05)]">
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="w-full flex justify-between items-center p-5 text-left active:bg-brand-surface transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-orange/15 flex items-center justify-center text-brand-orange shadow-[0_0_10px_rgba(247,167,7,0.1)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-brand-textPrimary uppercase tracking-widest">The SMC Playbook</span>
              <span className="text-[9px] font-black text-brand-orange/60 uppercase tracking-tight">Tap to reveal operational secrets</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!showGuide && <span className="text-[8px] font-black text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded animate-pulse uppercase">Read Me</span>}
            <svg className={`w-4 h-4 text-brand-textSecondary transition-transform ${showGuide ? 'rotate-180 text-brand-orange' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </button>
        {showGuide && (
          <div className="p-6 pt-0 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="h-[1px] w-full bg-brand-border/50 mb-2"></div>
            
            <GuideItem 
              icon="🎯" 
              title="1. Log Every Setup" 
              desc="Consistency is built on volume. Even 'failed' backtests provide data on what environments to avoid. Use the 'A+ Logic' toggle to mark high-conviction trades." 
            />
            
            <GuideItem 
              icon="🕒" 
              title="2. Respect Kill Zones" 
              desc="Smart Money moves during specific times. Stick to your chosen Session (London, NY, Asia) andHTF/LTF alignment for the most realistic data." 
            />

            <GuideItem 
              icon="📈" 
              title="3. Leverage Affinity Data" 
              desc="The 'Logic Affinity' in Analytics tells you which SMC tool (FVG, MSS, etc.) is actually paying you. Stop using tools that don't produce R:R." 
            />

            <GuideItem 
              icon="🛡️" 
              title="4. Manage Fatigue" 
              desc="Decision fatigue is the #1 edge killer. When the 'Focus Session' bar hits 80%, stop backtesting. Bad data is worse than no data." 
            />

            <div className="pt-2 space-y-2">
              <button 
                onClick={() => setTab('template')}
                className="w-full py-3 bg-brand-orange text-brand-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-xl active-scale transition-all"
              >
                Personalize Your Setup Logic
              </button>
              <button 
                onClick={() => setTab('manual')}
                className="w-full py-3 bg-brand-surface border border-brand-border text-brand-textPrimary text-[10px] font-black uppercase tracking-[0.2em] rounded-xl active-scale"
              >
                Access Dragon Manual
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {widgets.map(w => renderWidget(w))}
      </div>
    </div>
  );
};

const GuideItem: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex gap-4 group">
    <div className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="space-y-1">
      <h4 className="text-[10px] font-black text-brand-orange uppercase tracking-widest leading-none">{title}</h4>
      <p className="text-[11px] text-brand-textSecondary leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

export default Dashboard;