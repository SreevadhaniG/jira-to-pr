export interface TerminalAction {
  command: string;
  reason: string;
}

export interface TerminalActionPlan {
  required: boolean;
  summary: string;
  actions: TerminalAction[];
}
