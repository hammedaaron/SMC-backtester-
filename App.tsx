
import React, { useState, useEffect } from 'react';
import { Trade, User, AppTemplate } from './types';
import { ICONS, COINS, SESSIONS } from './constants';
import Dashboard from './components/Dashboard';
import TradeList from './components/TradeList';
import TradeForm from './components/TradeForm';
import HelpSection from './components/HelpSection';
import UserProfile from './components/UserProfile';
import Analytics from './components/Analytics';
import TemplateEditor from './components/TemplateEditor';
import AIInsights from './components/AIInsights';
import ProfileDropdown from './components/ProfileDropdown';
import DragonManual from './components/DragonManual';
import LandingPage from './components/LandingPage';
import SignupForm from './components/SignupForm';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'journal' | 'add' | 'help' | 'settings' | 'analytics' | 'template' | 'insights' | 'manual'>('dashboard');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  
  const defaultTemplate: AppTemplate = {
    coins: [...COINS],
    sessions: [...SESSIONS],
    plannedTradingDays: [1, 2, 3], // Tue, Wed, Thu by default
    customConfluences: [
      { id: 'premiumDiscount', label: 'Premium / Discount', active: true },
      { id: 'liquiditySweep', label: 'Liquidity Sweep', active: true },
      { id: 'mss', label: 'MSS (Market Structure Shift)', active: true },
      { id: 'fvg', label: 'FVG (Fair Value Gap)', active: true },
      { id: 'orderBlock', label: 'Order Block (OB)', active: true },
      { id: 'structureBroken', label: 'BOS (Break of Structure)', active: true },
      { id: 'smtDivergence', label: 'SMT Divergence', active: true },
    ],
    dashboardWidgets: ['burnout', 'streaks', 'kpis', 'consistency', 'insights_preview']
  };

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedTrades = localStorage.getItem('smc_trades_v2');
    const savedUser = localStorage.getItem('smc_user_v2');
    const entered = localStorage.getItem('smc_entered');
    
    if (entered) setHasEntered(true);

    if (savedTrades) {
      try { setTrades(JSON.parse(savedTrades)); } catch (e) { console.error(e); }
    }
    
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const todayStr = new Date().toDateString();
        if (u.lastActiveDay !== todayStr) {
          u.todayMinutes = 0;
          u.lastActiveDay = todayStr;
        }
        if (!u.template) u.template = defaultTemplate;
        if (!u.template.plannedTradingDays) u.template.plannedTradingDays = [1, 2, 3];
        setUser(u);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smc_user_v2', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setUser(prev => {
        if (!prev) return prev;
        const updatedMinutes = (prev.todayMinutes || 0) + 1;
        return { ...prev, todayMinutes: updatedMinutes };
      });
    }, 60000); 
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem('smc_trades_v2', JSON.stringify(trades));
    const dates = Array.from(new Set(trades.map(t => new Date(t.date).toDateString()))).sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    let checkDate = new Date();
    for (const d of dates) {
      if (d === checkDate.toDateString()) { streak++; checkDate.setDate(checkDate.getDate() - 1); } else break;
    }
    setUser(prev => prev ? ({ ...prev, streakCount: streak, maxStreak: Math.max(prev.maxStreak, streak) }) : null);
  }, [trades]);

  const handleAddTrade = (trade: Trade) => {
    if (editingTrade) {
      setTrades(prev => prev.map(t => t.id === trade.id ? trade : t));
      setEditingTrade(null);
    } else {
      setTrades(prev => [trade, ...prev]);
    }
    setActiveTab('journal');
    setAlert({ message: "Legendary progress recorded!", type: 'success' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('smc_trades_v2');
    localStorage.removeItem('smc_user_v2');
    localStorage.removeItem('smc_entered');
    window.location.reload();
  };

  const enterApp = () => {
    setHasEntered(true);
    localStorage.setItem('smc_entered', 'true');
  };

  const handleSignup = (username: string) => {
    const newUser: User = {
      username: username,
      email: '',
      mobile: '',
      timezone: 'UTC',
      dailyHourLimit: 3,
      todayMinutes: 0,
      lastActiveDay: new Date().toDateString(),
      streakCount: 0,
      maxStreak: 0,
      milestonesReached: [],
      template: defaultTemplate,
      aiEnabled: true
    };
    setUser(newUser);
  };

  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'warning' | 'info' | 'success' } | null>(null);

  const renderContent = () => {
    if (!user) return null;
    switch (activeTab) {
      case 'dashboard': return <Dashboard trades={trades} user={user} setTab={setActiveTab} setUser={setUser} />;
      case 'analytics': return <Analytics trades={trades} user={user} />;
      case 'journal': return <TradeList trades={trades} onEdit={(t) => { setEditingTrade(t); setActiveTab('add'); }} onDelete={(id) => setTrades(p => p.filter(t => t.id !== id))} user={user} />;
      case 'add': return <TradeForm onSave={handleAddTrade} initialData={editingTrade} onCancel={() => { setEditingTrade(null); setActiveTab('journal'); }} trades={trades} user={user} />;
      case 'help': return <HelpSection />;
      case 'settings': return <UserProfile user={user} setUser={setUser} onLogout={handleLogout} />;
      case 'template': return <TemplateEditor user={user} setUser={setUser} />;
      case 'insights': return <AIInsights trades={trades} user={user} />;
      case 'manual': return <DragonManual onBack={() => setActiveTab('dashboard')} />;
      default: return <Dashboard trades={trades} user={user} setTab={setActiveTab} setUser={setUser} />;
    }
  };

  if (!hasEntered) {
    return <LandingPage onEnter={enterApp} />;
  }

  if (!user) {
    return <SignupForm onSignup={handleSignup} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-brand-dark overflow-hidden border-x border-brand-border shadow-2xl relative">
      {alert && (
        <div className="absolute top-20 left-4 right-4 z-50 p-4 rounded-2xl bg-brand-orange text-brand-dark font-black shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            {alert.message}
          </div>
        </div>
      )}

      <header className="px-6 py-5 border-b border-brand-border bg-brand-dark/90 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-brand-orange tracking-tight leading-none italic uppercase">
            SMC Backtester
          </h1>
          <p className="text-[10px] text-brand-textSecondary uppercase tracking-[0.2em] font-black mt-1.5 opacity-60">Trader OS</p>
        </div>
        <div className="flex gap-2 relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)} 
            className={`p-2 bg-brand-surface rounded-xl border transition-all active-scale flex items-center justify-center ${isProfileOpen ? 'border-brand-orange bg-brand-orange/10' : 'border-brand-border'}`}
          >
             <div className="w-5 h-5 bg-brand-orange rounded-md flex items-center justify-center text-[10px] font-black text-brand-dark">
               {user.username.charAt(0)}
             </div>
          </button>
          
          {isProfileOpen && (
            <ProfileDropdown 
              user={user} 
              onLogout={handleLogout} 
              onClose={() => setIsProfileOpen(false)} 
              onOpenManual={() => { setActiveTab('manual'); setIsProfileOpen(false); }}
              onOpenSettings={() => { setActiveTab('settings'); setIsProfileOpen(false); }}
            />
          )}

          <div className="bg-brand-surface px-3 py-1.5 rounded-xl border border-brand-border flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${['Tuesday', 'Wednesday', 'Thursday'].includes(new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())) ? 'bg-brand-orange animate-pulse shadow-[0_0_8px_#F7A707]' : 'bg-brand-border'}`}></div>
             <span className="text-[11px] font-black text-brand-orange">{user.streakCount} 🔥</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="view-transition">
          {renderContent()}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-brand-dark/95 backdrop-blur-xl border-t border-brand-border px-4 py-3 pb-6 flex justify-around items-center z-20">
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<ICONS.Dashboard className="w-6 h-6" />} label="Home" />
        <NavButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<ICONS.Analytics className="w-6 h-6" />} label="Growth" />
        
        <button 
          onClick={() => { setEditingTrade(null); setActiveTab('add'); }}
          className={`relative -top-7 w-16 h-16 bg-brand-orange rounded-2xl shadow-2xl flex items-center justify-center border-4 border-brand-dark active-scale transition-all ${activeTab === 'add' ? 'scale-110' : ''}`}
        >
          <ICONS.Add className="w-8 h-8 text-brand-dark stroke-[3px]" />
        </button>

        <NavButton active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} icon={<ICONS.Journal className="w-6 h-6" />} label="Log" />
        <NavButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<ICONS.Help className="w-6 h-6" />} label="Insight" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1.5 transition-all flex-1 active-scale ${active ? 'text-brand-orange' : 'text-brand-textSecondary hover:text-brand-textPrimary'}`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-widest transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60'}`}>
      {label}
    </span>
  </button>
);

export default App;
