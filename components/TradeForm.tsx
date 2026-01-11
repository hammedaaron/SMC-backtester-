
import React, { useState, useEffect } from 'react';
import { Trade, Result, Bias, SessionType, Timeframe, TradeType, SMCChecklist, User } from '../types';
import { TIMEFRAMES } from '../constants';
import JournalEditor from './JournalEditor';

interface TradeFormProps {
  onSave: (trade: Trade) => void;
  onCancel: () => void;
  initialData: Trade | null;
  trades: Trade[];
  user: User;
}

const LESSON_SNIPPETS = [
  "Wait for 15m MSS before entry",
  "Check Daily HTF PD Array",
  "Avoid trading late NY session",
  "Liquidity not swept yet",
  "Pure A+ setup followed rules",
  "Forced trade in consolidation"
];

const TradeForm: React.FC<TradeFormProps> = ({ onSave, onCancel, initialData, trades, user }) => {
  const [formData, setFormData] = useState<Partial<Trade>>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    coin: user.template.coins[0],
    session: user.template.sessions[0],
    timeframe: Timeframe.M15,
    htfTimeframe: Timeframe.DAILY,
    bias: Bias.BULL,
    type: TradeType.LONG,
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    rr: 0,
    setup: {
      premiumDiscount: false,
      liquiditySweep: false,
      mss: false,
      fvg: false,
      orderBlock: false,
      structureBroken: false,
      smtDivergence: false,
    },
    result: Result.WIN,
    exitPrice: 0,
    pnlPercent: 0,
    notes: '',
    lessonSnippet: ''
  });

  const [activeSection, setActiveSection] = useState<'info' | 'setup' | 'outcome'>('info');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (trades.length > 0) {
      const last = trades[0];
      setFormData(prev => ({
        ...prev,
        coin: last.coin,
        session: last.session,
      }));
    }
  }, [initialData, trades]);

  const setupStrength = Object.values(formData.setup || {}).filter(Boolean).length;
  const isAplus = setupStrength >= 4 && (formData.setup?.liquiditySweep && formData.setup?.mss);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value };
      if (['entryPrice', 'stopLoss', 'takeProfit'].includes(name)) {
        const entry = name === 'entryPrice' ? parseFloat(value) : (prev.entryPrice || 0);
        const sl = name === 'stopLoss' ? parseFloat(value) : (prev.stopLoss || 0);
        const tp = name === 'takeProfit' ? parseFloat(value) : (prev.takeProfit || 0);
        if (entry && sl && tp) {
          const risk = Math.abs(entry - sl);
          const reward = Math.abs(tp - entry);
          if (risk > 0) updated.rr = parseFloat((reward / risk).toFixed(2));
        }
      }
      return updated;
    });
  };

  const handleSetupToggle = (key: string) => {
    setFormData(prev => ({
      ...prev,
      setup: { ...prev.setup!, [key]: !prev.setup![key] }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(formData.date!);
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateObj);
    const isPriorityDay = ['Tuesday', 'Wednesday', 'Thursday'].includes(dayOfWeek);
    onSave({ ...formData as Trade, id: initialData?.id || Date.now().toString(), dayOfWeek, isPriorityDay });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 pb-24">
      <div className="flex justify-between items-center mb-2">
         <div>
           <h2 className="text-2xl font-black text-brand-textPrimary italic uppercase tracking-tight">{initialData ? 'Edit Order' : 'New Backtest'}</h2>
           <p className="text-[10px] text-brand-textSecondary font-black uppercase tracking-[0.2em] mt-1">Consistency Over Everything</p>
         </div>
         <button type="button" onClick={onCancel} className="p-3 bg-brand-surface rounded-2xl text-brand-textSecondary border border-brand-border active-scale transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
         </button>
      </div>

      <div className="bybit-card rounded-[24px] p-5 space-y-4">
         <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black uppercase text-brand-textSecondary tracking-widest">Setup Probablity</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isAplus ? 'text-brand-orange' : 'text-brand-textSecondary opacity-50'}`}>{isAplus ? 'A+ Logic' : 'Standard'}</span>
         </div>
         <div className="flex gap-1.5 h-2">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
               <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${setupStrength >= i ? 'bg-brand-orange shadow-[0_0_8px_#F7A707]' : 'bg-brand-dark'}`}></div>
            ))}
         </div>
      </div>

      <div className="space-y-4">
        <CollapsibleSection title="Trade Parameters" active={activeSection === 'info'} onClick={() => setActiveSection('info')} icon="📍">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Trade Date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
            <Field label="Asset" name="coin" type="select" options={user.template.coins} value={formData.coin} onChange={handleInputChange} />
            <Field label="Bias" name="bias" type="select" options={Object.values(Bias)} value={formData.bias} onChange={handleInputChange} />
            <Field label="Session" name="session" type="select" options={user.template.sessions} value={formData.session} onChange={handleInputChange} />
            <Field label="HTF" name="htfTimeframe" type="select" options={TIMEFRAMES} value={formData.htfTimeframe} onChange={handleInputChange} />
            <Field label="LTF" name="timeframe" type="select" options={TIMEFRAMES} value={formData.timeframe} onChange={handleInputChange} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="SMC Logic" active={activeSection === 'setup'} onClick={() => setActiveSection('setup')} icon="🧩">
          <div className="space-y-2">
            {user.template.customConfluences.filter(c => c.active).map(conf => (
              <CheckItem key={conf.id} label={conf.label} active={formData.setup?.[conf.id]} onClick={() => handleSetupToggle(conf.id)} />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Review & Outcome" active={activeSection === 'outcome'} onClick={() => setActiveSection('outcome')} icon="🏁">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Field label="Trade Result" name="result" type="select" options={Object.values(Result)} value={formData.result} onChange={handleInputChange} />
            <Field label="P&L (%)" name="pnlPercent" type="number" step="0.1" value={formData.pnlPercent} onChange={handleInputChange} />
            <Field label="Risk Reward" name="rr" type="number" step="0.01" value={formData.rr} onChange={handleInputChange} />
            <Field label="Entry" name="entryPrice" type="number" step="any" value={formData.entryPrice} onChange={handleInputChange} />
          </div>
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] text-brand-textSecondary uppercase font-black tracking-widest px-1 opacity-60">Quick Snippets</label>
                <div className="flex flex-wrap gap-2">
                   {LESSON_SNIPPETS.map(s => (
                     <button key={s} type="button" onClick={() => setFormData(p => ({ ...p, lessonSnippet: s }))} className={`text-[10px] px-4 py-2 rounded-xl border transition-all font-bold uppercase tracking-widest ${formData.lessonSnippet === s ? 'bg-brand-orange border-brand-orange text-brand-dark' : 'bg-brand-surface border-brand-border text-brand-textSecondary hover:text-brand-textPrimary'}`}>{s}</button>
                   ))}
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] text-brand-textSecondary uppercase font-black tracking-widest px-1 opacity-60">Session Journal</label>
                <JournalEditor value={formData.notes || ''} onChange={(val) => setFormData(prev => ({ ...prev, notes: val }))} />
             </div>
          </div>
        </CollapsibleSection>
      </div>

      <button type="submit" className="w-full bg-brand-orange text-brand-dark font-black py-5 rounded-[24px] shadow-[0_12px_32px_rgba(247,167,7,0.3)] transition-all active-scale flex items-center justify-center gap-3 mt-6 uppercase tracking-widest text-sm">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        {initialData ? 'Update Record' : 'Commit Order'}
      </button>
    </form>
  );
};

const CollapsibleSection: React.FC<{ title: string; active: boolean; onClick: () => void; children: React.ReactNode; icon: string }> = ({ title, active, onClick, children, icon }) => (
  <div className={`bybit-card rounded-[24px] overflow-hidden transition-all duration-300 ${active ? 'border-brand-orange/30 ring-1 ring-brand-orange/10' : ''}`}>
    <button type="button" onClick={onClick} className="w-full flex justify-between items-center p-6 text-left focus:outline-none active:bg-brand-surface/50">
      <div className="flex items-center gap-5">
        <span className="text-2xl grayscale brightness-125">{icon}</span>
        <span className="font-black text-brand-textPrimary uppercase tracking-widest text-[11px]">{title}</span>
      </div>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-brand-orange text-brand-dark rotate-180' : 'bg-brand-dark text-brand-textSecondary'}`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </button>
    {active && <div className="p-6 pt-0 animate-in fade-in slide-in-from-top-4 duration-300">{children}</div>}
  </div>
);

const Field: React.FC<any> = ({ label, name, type, options, value, onChange, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] text-brand-textSecondary uppercase font-black tracking-widest px-1 opacity-60">{label}</label>
    {type === 'select' ? (
      <select name={name} value={value} onChange={onChange} className="bg-brand-dark border border-brand-border rounded-2xl px-4 py-3.5 text-sm text-brand-textPrimary focus:ring-1 focus:ring-brand-orange outline-none transition-all appearance-none font-bold">{options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}</select>
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} className="bg-brand-dark border border-brand-border rounded-2xl px-4 py-3.5 text-sm text-brand-textPrimary focus:ring-1 focus:ring-brand-orange outline-none transition-all font-bold" {...props} />
    )}
  </div>
);

const CheckItem: React.FC<{ label: string; active?: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button type="button" onClick={onClick} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all active-scale ${active ? 'bg-brand-orange/10 border-brand-orange/40 text-brand-orange' : 'bg-brand-dark border-brand-border text-brand-textSecondary opacity-80'}`}>
    <span className="text-sm font-bold tracking-tight">{label}</span>
    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-brand-orange text-brand-dark' : 'border-2 border-brand-border'}`}>{active && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}</div>
  </button>
);

export default TradeForm;
