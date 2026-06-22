import { useState } from 'react';

export function MathProblemInput({ onSubmit, disabled }: { onSubmit: (t: string) => void, disabled: boolean }) {
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col">
      <h2 className="text-[11px] uppercase tracking-widest text-slate-500 mb-3">Problem Formulation</h2>
      <textarea
        className="w-full bg-slate-900/50 text-slate-300 rounded border border-slate-700/50 p-3 min-h-[120px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder-slate-600 resize-y font-mono text-[11px] leading-relaxed transition-colors"
        placeholder="Enter a mathematical proposition, e.g., 'Let ABC be an acute triangle...'"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
      />
      <div className="flex justify-end mt-3">
        <button
          className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded text-[10px] uppercase font-mono tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            if (text.trim()) onSubmit(text);
          }}
          disabled={disabled || !text.trim()}
        >
          [ Initialize Execution ]
        </button>
      </div>
    </div>
  );
}
