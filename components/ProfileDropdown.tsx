
import React from 'react';
import { User } from '../types';

interface ProfileDropdownProps {
  user: User;
  onLogout: () => void;
  onClose: () => void;
  onOpenManual: () => void;
  onOpenSettings: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout, onClose, onOpenManual, onOpenSettings }) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute top-14 right-0 w-64 bybit-card rounded-[24px] shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="p-4 border-b border-brand-border mb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-brand-dark font-black text-lg">
            {user.username.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-black text-brand-textPrimary truncate">{user.username}</h3>
            <p className="text-[10px] text-brand-textSecondary uppercase tracking-widest font-black opacity-50">Master Trader</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <DropdownItem 
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            label="Dragon Manual"
            onClick={onOpenManual}
          />
          <DropdownItem 
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            label="Settings"
            onClick={onOpenSettings}
          />
        </div>
        
        <div className="pt-2 mt-2 border-t border-brand-border">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3.5 text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest active-scale"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

const DropdownItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3.5 text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-surface rounded-xl transition-all font-black uppercase text-[10px] tracking-widest active-scale"
  >
    <span className="text-brand-orange">{icon}</span>
    {label}
  </button>
);

export default ProfileDropdown;
