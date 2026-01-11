
import React, { useRef, useEffect } from 'react';

interface JournalEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ value, onChange }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isEditing = useRef(false);

  // Synchronize internal HTML with prop only when not actively typing or if value changes externally
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value && !isEditing.current) {
      contentRef.current.innerHTML = value;
    }
  }, [value]);

  const applyFormat = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (contentRef.current) onChange(contentRef.current.innerHTML);
  };

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const handleFocus = () => { isEditing.current = true; };
  const handleBlur = () => { isEditing.current = false; };

  return (
    <div className="border border-brand-border rounded-2xl bg-brand-dark overflow-hidden transition-all focus-within:ring-1 focus-within:ring-brand-orange/40">
      <div className="flex gap-1.5 p-3 border-b border-brand-border bg-brand-surface/50 overflow-x-auto scrollbar-hide">
        <FormatBtn onClick={() => applyFormat('bold')} label="B" />
        <FormatBtn onClick={() => applyFormat('italic')} label="I" />
        <FormatBtn onClick={() => applyFormat('formatBlock', '<h1>')} label="H1" />
        <FormatBtn onClick={() => applyFormat('formatBlock', '<h2>')} label="H2" />
        <FormatBtn onClick={() => applyFormat('insertUnorderedList')} label="• List" />
      </div>

      <div 
        ref={contentRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="min-h-[200px] max-h-[400px] overflow-y-auto p-5 text-sm text-brand-textPrimary focus:outline-none leading-relaxed font-medium"
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
};

const FormatBtn: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <button 
    type="button" 
    onClick={onClick}
    className="w-9 h-9 flex items-center justify-center text-[11px] font-black bg-brand-dark text-brand-textSecondary border border-brand-border rounded-xl hover:text-brand-orange hover:border-brand-orange active-scale transition-all flex-shrink-0"
  >
    {label}
  </button>
);

export default JournalEditor;
