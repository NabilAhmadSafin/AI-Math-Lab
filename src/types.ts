export type StepStatus = 'pending' | 'active' | 'completed' | 'failed' | 'skipped';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
  output?: string;
  logs?: string[];
  duration?: number;
}

export interface ProofSession {
  id: string;
  problem: string;
  status: 'idle' | 'running' | 'verified' | 'failed';
  currentStepIndex: number;
  steps: WorkflowStep[];
  startedAt?: string;
  completedAt?: string;
}

export interface Idea {
  source: 'GPT' | 'Gemini';
  text: string;
  rank?: number;
}
