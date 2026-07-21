export interface GeneratedFile {
  relativePath: string;
  content: string;
}

export interface CodeGenerationResult {
  summary: string;
  validationCommand: string;
  files: GeneratedFile[];
}
