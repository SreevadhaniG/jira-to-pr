export interface PlannedFile {
  relativePath: string;
  requiredChanges: string;
}

export interface ImplementationPlan {
  summary: string;
  files: PlannedFile[];
}