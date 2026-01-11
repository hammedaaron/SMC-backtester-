
import React, { useState } from 'react';

interface SignupFormProps {
  onSignup: (username: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 3) {
      onSignup(username.trim());
    }
  };

  return (
    <div className="relative h-screen bg-brand-dark flex flex-col items-center justify-center px-8 text-center overflow-hidden">
      {/* Background Architectural Watermark */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full text-brand-orange">
          <path fill="currentColor" d="M100 20c-44.1 0-80 35.9-80 80s35.9 80 80 80 80-35.9 80-80-35.9-80-80-80zm0 145c-35.8 0-65-29.2-65-65s29.2-65 65-65 65 29.2 65 65-29.2 65-65 65z"/>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-xs space-y-12">
        <div className="space-y-4">
          <h1 className="luxury-text italic text-4xl text-brand-orange tracking-tight leading-none uppercase">Initialize Identity</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-textSecondary opacity-60">System Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4 text-left">
            <label className="text-[10px] text-brand-textSecondary uppercase font-black tracking-widest px-1 opacity-60">Codename / Username</label>
            <input 
              autoFocus
              type="text" 
              placeholder="e.g. WHALE_HUNTER" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-xl px-6 py-5 text-sm text-brand-textPrimary focus:ring-1 focus:ring-brand-orange outline-none transition-all placeholder:text-brand-textSecondary/30 font-black uppercase tracking-widest"
            />
          </div>

          <button 
            type="submit"
            disabled={username.trim().length < 3}
            className={`w-full py-5 bg-brand-orange text-brand-dark font-black rounded-xl active-scale transition-all uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(247,167,7,0.2)] ${username.trim().length < 3 ? 'opacity-30 grayscale' : ''}`}
          >
            Authenticate Profile
          </button>
        </form>

        <p className="text-[9px] text-brand-textSecondary leading-relaxed font-medium opacity-50 px-4">
          By proceeding, you agree to document your journey with the discipline of Dragon HAMS☆R.
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
