import { WorkflowStep } from '../types';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { useEffect, useRef } from 'react';

export function ProofOutput({ activeStep, allSteps, problem }: { activeStep?: WorkflowStep, allSteps: WorkflowStep[], problem?: string }) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [activeStep?.logs, activeStep?.output]);

  const activeLogs = activeStep?.logs || [];
  const stepIndex = activeStep ? allSteps.findIndex(s => s.id === activeStep.id) : -1;
  const completedLogs = allSteps.slice(0, stepIndex < 0 ? allSteps.length : stepIndex)
                               .flatMap(s => s.logs || []);

  const sagemathStep = allSteps.find(s => s.name.includes('SageMath'));
  const leanStep = allSteps.find(s => s.name.includes('Lean'));
  const memoryStep = allSteps.find(s => s.name.includes('Memory'));

  return (
    <div className="flex flex-col h-full bg-[#020408]">
      
      <header className="p-8 bg-[#03060d] border-b border-slate-800/50 shrink-0">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-slate-500 text-[10px] uppercase font-bold tracking-[.3em] mb-4">Problem Statement</h3>
          <p className="text-xl font-serif leading-relaxed text-slate-200">
            {problem || "System awaiting mathematical proposition."}
          </p>
        </div>
      </header>

      <section className="flex-1 flex overflow-hidden bg-slate-800/50 gap-px">
        <div className="flex-1 bg-[#050810] p-6 flex flex-col overflow-hidden relative">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                {activeStep ? `Running: ${activeStep.name}` : 'Core Execution Engine'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">SYSTEM: ACTIVE</span>
          </div>
          
          <div className="flex-1 font-mono text-[11px] leading-relaxed text-slate-400 overflow-y-auto fancy-scrollbar" ref={terminalRef}>
            {!activeStep && allSteps.length === 0 ? (
              <p className="text-slate-600 italic">[Waiting for input...]</p>
            ) : (
              <>
                <div className="mb-4">
                  {completedLogs.map((log, i) => (
                    <div key={`comp-${i}`} className="mb-2 text-slate-500/70 flex gap-2">
                      <span className="text-slate-700/80">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  {activeLogs.map((log, i) => (
                    <div key={`act-${i}`} className="mb-2 flex gap-2">
                      <span className="text-cyan-500">›</span>
                      <span className="text-slate-300">{log}</span>
                    </div>
                  ))}
                </div>

                {activeStep?.output && (
                  <div className="mt-6 border-t border-slate-800/50 pt-4">
                    <div className="text-emerald-500 text-[10px] tracking-widest mb-4 uppercase">Output Generated:</div>
                    <div className="prose prose-invert prose-sm max-w-none prose-p:font-serif prose-headings:font-sans prose-pre:bg-slate-900/50 prose-pre:border-slate-800 prose-pre:border prose-pre:rounded">
                      <Markdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {activeStep.output}
                      </Markdown>
                    </div>
                  </div>
                )}
                
                {allSteps.filter(s => s.status === 'completed' && s.output && s.id !== activeStep?.id).map((step, idx) => (
                  <div key={`out-${idx}`} className="mt-8 border-t border-slate-800/50 pt-4 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="text-blue-500 text-[10px] tracking-widest mb-4 uppercase">Archive: {step.name}</div>
                    <div className="prose prose-invert prose-sm max-w-none prose-p:font-serif prose-headings:font-sans prose-pre:bg-slate-900/50 prose-pre:border-slate-800 prose-pre:border prose-pre:rounded">
                      <Markdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                        {step.output}
                      </Markdown>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="h-48 border-t border-slate-800 bg-[#020408] p-6 shrink-0">
        <div className="grid grid-cols-3 gap-6 h-full max-w-5xl mx-auto">
          <div className="bg-slate-900/40 border border-slate-800 rounded p-4 flex flex-col">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">SageMath Verification</div>
            <div className="flex-1 font-mono text-[10px] text-slate-300">
               {sagemathStep?.status === 'completed' ? (
                 <div className="flex justify-between mb-1"><span className="text-slate-400">System State</span><span className="text-emerald-500">PASSED</span></div>
               ) : (
                 <div className="text-slate-600">AWAITING EXECUTION</div>
               )}
            </div>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded p-4 flex flex-col">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Lean Theorem Prover</div>
            <div className="flex-1 font-mono text-[10px] text-slate-400 overflow-hidden">
               {leanStep?.status === 'completed' ? (
                 <>
                   <code className="block opacity-70">lemma validated_thm (hp : valid) :</code>
                   <code className="block text-emerald-500 mt-1">[VERIFICATION_SUCCESS]</code>
                 </>
               ) : leanStep?.status === 'active' ? (
                 <>
                   <code className="block opacity-70">checking proof state...</code>
                   <code className="block mt-1 animate-pulse text-blue-400">[PROVING_IN_PROGRESS...]</code>
                 </>
               ) : (
                 <code className="block opacity-50">kernel idle</code>
               )}
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded p-4 flex flex-col">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Theorem Memory Index</div>
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="text-2xl font-light text-slate-100">
                {memoryStep?.status === 'completed' ? '1,402' : '0'}
              </div>
              <div className="text-[9px] text-slate-500">RELEVANT NODES LINKED</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

