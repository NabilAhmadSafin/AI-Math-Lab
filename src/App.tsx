import { useEffect, useState } from 'react';
import { MathProblemInput } from './components/MathProblemInput';
import { WorkflowTracker } from './components/WorkflowTracker';
import { ProofOutput } from './components/ProofOutput';
import { ProofSession } from './types';

export default function App() {
  const [session, setSession] = useState<ProofSession | null>(null);
  const [pollIntervalId, setPollIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalId) clearInterval(pollIntervalId);
    };
  }, [pollIntervalId]);

  const pollSession = async (id: string) => {
    try {
      const res = await fetch(`/api/proofs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
        if (data.status === 'verified' || data.status === 'failed') {
          setPollIntervalId((prev) => {
            if (prev) clearInterval(prev);
            return null;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startWorkflow = async (problem: string) => {
    try {
      if (pollIntervalId) clearInterval(pollIntervalId);
      setSession(null);

      const res = await fetch('/api/proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem })
      });
      const data = await res.json();

      if (data.sessionId) {
        const id = setInterval(() => pollSession(data.sessionId), 1000);
        setPollIntervalId(id);
        pollSession(data.sessionId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeStep = session?.steps[session.currentStepIndex];

  return (
    <div className="h-screen w-full bg-[#020408] text-slate-300 font-sans overflow-hidden flex select-none">
      
      <aside className="w-80 lg:w-96 border-r border-slate-800/50 flex flex-col bg-[#050810] shrink-0">
        <div className="p-6 border-b border-slate-800/50 flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
            <h1 className="text-xs font-mono tracking-widest text-slate-400 uppercase">AI Math Lab v4.1</h1>
          </div>
          <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-tighter text-slate-500 mb-1">Project ID</div>
            <div className="text-sm font-mono text-blue-400">{session ? `MATH-${session.id.split('-')[0].toUpperCase()}` : 'AWAITING-INPUT'}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto fancy-scrollbar p-6 space-y-6">
          <MathProblemInput onSubmit={startWorkflow} disabled={session?.status === 'running'} />
          {session && (
            <div className="pt-4 border-t border-slate-800">
              <WorkflowTracker steps={session.steps} activeStepId={activeStep?.id || null} />
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#020408] overflow-hidden">
        <ProofOutput activeStep={activeStep} allSteps={session?.steps || []} problem={session?.problem} />
      </main>
      
      <aside className="w-12 border-l border-slate-800 flex flex-col items-center py-6 space-y-8 bg-[#050810] shrink-0">
        <div className="w-6 h-6 rounded-sm bg-slate-800 flex items-center justify-center text-[10px] hover:bg-slate-700 cursor-pointer text-slate-400 font-serif shadow-sm">Σ</div>
        <div className="w-6 h-6 rounded-sm bg-slate-800 flex items-center justify-center text-[10px] hover:bg-slate-700 cursor-pointer text-slate-400 text-lg font-serif shadow-sm">∫</div>
        <div className="w-6 h-6 rounded-sm bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 border border-blue-500/50 font-serif">G</div>
        <div className="w-6 h-6 rounded-sm bg-slate-800 flex items-center justify-center text-[10px] hover:bg-slate-700 cursor-pointer text-slate-400 shadow-sm">μ</div>
        <div className="flex-1"></div>
        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] hover:bg-slate-700 cursor-pointer text-slate-400 shadow-sm">?</div>
      </aside>

    </div>
  );
}

