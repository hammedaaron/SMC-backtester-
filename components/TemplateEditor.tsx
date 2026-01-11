
import React, { useState } from 'react';
import { User, CustomField } from '../types';
import { ICONS } from '../constants';

interface TemplateEditorProps {
  user: User;
  setUser: (user: User) => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ user, setUser }) => {
  const [newCoin, setNewCoin] = useState('');
  const [newSession, setNewSession] = useState('');
  const [editingSession, setEditingSession] = useState<string | null>(null);

  const updateTemplate = (updates: Partial<User['template']>) => {
    setUser({
      ...user,
      template: { ...user.template, ...updates }
    });
  };

  const toggleConfluence = (id: string) => {
    const updated = user.template.customConfluences.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    );
    updateTemplate({ customConfluences: updated });
  };

  const addCoin = () => {
    if (newCoin && !user.template.coins.includes(newCoin.toUpperCase()) && user.template.coins.length < 30) {
      updateTemplate({ coins: [...user.template.coins, newCoin.toUpperCase()] });
      setNewCoin('');
    }
  };

  const removeCoin = (coin: string) => {
    updateTemplate({ coins: user.template.coins.filter(c => c !== coin) });
  };

  const addSession = () => {
    if (newSession.trim()) {
      let updatedSessions;
      if (editingSession) {
        updatedSessions = user.template.sessions.map(s => s === editingSession ? newSession.trim() : s);
        setEditingSession(null);
      } else if (!user.template.sessions.includes(newSession.trim())) {
        updatedSessions = [...user.template.sessions, newSession.trim()];
      } else {
        return;
      }
      updateTemplate({ sessions: updatedSessions });
      setNewSession('');
    }
  };

  const removeSession = (session: string) => {
    updateTemplate({ sessions: user.template.sessions.filter(s => s !== session) });
  };

  const startEditSession = (session: string) => {
    setNewSession(session);
    setEditingSession(session);
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="px-1">
        <h2 className="text-2xl font-black text-brand-textPrimary italic uppercase tracking-tight">Configuration</h2>
        <p className="text-[10px] text-brand-textSecondary font-black uppercase tracking-[0.2em] mt-1 opacity-60">Personalize your Edge</p>
      </div>

      {/* Coins Management */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-black text-brand-textSecondary uppercase tracking-widest px-1">Active Assets ({user.template.coins.length}/30)</h3>
        <div className="bybit-card rounded-[24px] p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {user.template.coins.map(coin => (
              <div key={coin} className="flex items-center gap-2 bg-brand-dark border border-brand-border px-3 py-1.5 rounded-xl">
                <span className="text-xs font-black text-brand-textPrimary">{coin}</span>
                <button onClick={() => removeCoin(coin)} className="text-brand-textSecondary hover:text-red-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. SOL" 
              value={newCoin}
              onChange={(e) => setNewCoin(e.target.value)}
              className="flex-1 bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-textPrimary focus:ring-1 focus:ring-brand-orange outline-none"
            />
            <button onClick={addCoin} className="px-4 py-2.5 bg-brand-orange text-brand-dark font-black text-xs rounded-xl active-scale">ADD</button>
          </div>
        </div>
      </section>

      {/* Confluences Management */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-black text-brand-textSecondary uppercase tracking-widest px-1">Trade Logic Fields</h3>
        <div className="bybit-card rounded-[24px] p-2 overflow-hidden">
          {user.template.customConfluences.map((conf) => (
            <button 
              key={conf.id} 
              onClick={() => toggleConfluence(conf.id)}
              className="w-full flex justify-between items-center p-4 hover:bg-brand-surface/50 transition-colors active-scale"
            >
              <span className={`text-xs font-bold ${conf.active ? 'text-brand-textPrimary' : 'text-brand-textSecondary opacity-40'}`}>{conf.label}</span>
              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${conf.active ? 'bg-brand-orange' : 'bg-brand-border'}`}>
                <div className={`w-4 h-4 bg-brand-dark rounded-full transition-transform ${conf.active ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Sessions Management */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-black text-brand-textSecondary uppercase tracking-widest px-1">Trading Sessions</h3>
        <div className="bybit-card rounded-[24px] p-5 space-y-4">
          <div className="flex flex-wrap gap-3">
            {user.template.sessions.map(s => (
              <div key={s} className="group relative flex items-center gap-2 px-4 py-2 bg-brand-surface border border-brand-border rounded-2xl text-xs font-black text-brand-textPrimary transition-all hover:border-brand-orange/50">
                <span onClick={() => startEditSession(s)} className="cursor-pointer">{s}</span>
                <button onClick={() => removeSession(s)} className="text-brand-textSecondary hover:text-rose-500 transition-colors">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder={editingSession ? "Edit Session Name" : "Session Name"} 
              value={newSession}
              onChange={(e) => setNewSession(e.target.value)}
              className="flex-1 bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-textPrimary focus:ring-1 focus:ring-brand-orange outline-none font-bold"
            />
            <button onClick={addSession} className="px-5 py-2.5 bg-brand-orange text-brand-dark font-black text-xs rounded-xl active-scale uppercase tracking-widest">
              {editingSession ? 'Update' : 'Add'}
            </button>
            {editingSession && (
              <button onClick={() => { setEditingSession(null); setNewSession(''); }} className="px-4 py-2.5 bg-brand-surface border border-brand-border text-brand-textSecondary font-black text-xs rounded-xl active-scale">
                CANCEL
              </button>
            )}
          </div>
          <p className="text-[9px] text-brand-textSecondary uppercase font-black tracking-widest opacity-40 px-1">Tap text to edit • Tap X to remove</p>
        </div>
      </section>
    </div>
  );
};

export default TemplateEditor;
