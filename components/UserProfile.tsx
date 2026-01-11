
import React from 'react';
import { User } from '../types';

interface UserProfileProps {
  user: User;
  setUser: (user: User) => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, setUser, onLogout }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="px-1">
        <h2 className="text-2xl font-black text-brand-textPrimary italic uppercase tracking-tight">Profile Settings</h2>
        <p className="text-[10px] text-brand-textSecondary font-black uppercase tracking-[0.2em] mt-1 opacity-60">System Configuration</p>
      </div>

      <div className="flex flex-col items-center gap-5 py-6 bybit-card rounded-[32px] border-brand-orange/10 bg-brand-orange/[0.02]">
        <div className="w-24 h-24 bg-brand-orange rounded-[32px] flex items-center justify-center text-5xl shadow-2xl shadow-brand-orange/20 font-black text-brand-dark">
           {user.username.charAt(0)}
        </div>
        <div className="text-center space-y-1">
           <h2 className="text-xl font-black text-brand-textPrimary uppercase tracking-tight">{user.username}</h2>
           <p className="text-[10px] text-brand-orange font-black uppercase tracking-[0.3em]">Master SMC Trader</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-brand-textSecondary uppercase tracking-widest px-1 opacity-60">Identity Management</h3>
        <div className="bybit-card rounded-[24px] p-6 space-y-6">
           <ProfileField label="Codename" name="username" value={user.username} onChange={handleChange} />
           <ProfileField label="Direct Email" name="email" value={user.email} onChange={handleChange} />
           <ProfileField label="Contact Mobile" name="mobile" value={user.mobile} onChange={handleChange} />
           <ProfileField label="Operational Timezone" name="timezone" value={user.timezone} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-brand-textSecondary uppercase tracking-widest px-1 opacity-60">System Options</h3>
        <div className="bybit-card rounded-[24px] p-2 divide-y divide-brand-border/30">
           <ToggleRow label="Institutional Dark Mode" active={true} />
           <ToggleRow label="Auto-calculate Reward Ratio" active={true} />
           <ToggleRow label="Real-time Cloud Sync" active={false} />
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black rounded-2xl transition-all active-scale uppercase tracking-[0.2em] text-xs"
        >
          Terminate Session (Log Out)
        </button>
      </div>
    </div>
  );
};

const ProfileField: React.FC<any> = ({ label, name, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[9px] text-brand-textSecondary uppercase font-black tracking-widest px-1 opacity-50">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value} 
      onChange={onChange}
      className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-4 text-sm text-brand-textPrimary focus:ring-1 focus:ring-brand-orange outline-none transition-all font-bold"
    />
  </div>
);

const ToggleRow: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
  <div className="flex justify-between items-center px-4 py-4">
    <span className="text-xs text-brand-textSecondary font-black uppercase tracking-widest">{label}</span>
    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${active ? 'bg-brand-orange' : 'bg-brand-border'}`}>
       <div className={`w-4 h-4 bg-brand-dark rounded-full transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </div>
  </div>
);

export default UserProfile;
