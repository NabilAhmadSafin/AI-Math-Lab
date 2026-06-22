import { WorkflowStep } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function WorkflowTracker({ steps, activeStepId }: { steps: WorkflowStep[], activeStepId: string | null }) {
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="flex flex-col">
      <h2 className="text-[11px] uppercase tracking-widest text-slate-500 mb-3 text-center">Workflow Engine</h2>
      
      <div className="space-y-3 mb-6">
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="text-[10px] font-mono text-slate-400 flex justify-between">
          <span>STEP {String(completedCount).padStart(2, '0')}/{String(steps.length).padStart(2, '0')}</span>
          <span className="text-blue-400">{activeStepId ? 'PROCESSING_ACTIVE' : 'IDLE'}</span>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = step.status === 'active';
          const isCompleted = step.status === 'completed';
          const isFailed = step.status === 'failed';
          
          let colorClass = 'text-slate-500';
          let bgClass = 'bg-slate-900/40 border-slate-800/50';
          let titleClass = 'text-slate-400';
          
          if (isCompleted) { colorClass = 'text-emerald-500'; bgClass = 'bg-slate-900/40 border-emerald-900/30'; titleClass = 'text-slate-300'; }
          else if (isActive) { colorClass = 'text-blue-400'; bgClass = 'bg-blue-900/10 border-blue-500/30'; titleClass = 'text-blue-300'; }
          else if (isFailed) { colorClass = 'text-rose-500'; bgClass = 'bg-rose-900/10 border-rose-500/30'; titleClass = 'text-rose-300'; }

          return (
            <div key={step.id} className={cn("border rounded p-3 transition-colors", bgClass)}>
               <div className="flex justify-between items-center mb-1.5">
                  <span className={cn("text-[9px] uppercase tracking-widest font-mono", colorClass)}>
                    PHASE 0{index + 1}
                  </span>
                  {isActive && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></div>}
               </div>
               <h4 className={cn("text-[11px] font-medium mb-1", titleClass)}>{step.name}</h4>
               <p className="text-[10px] text-slate-500 font-mono leading-relaxed">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
