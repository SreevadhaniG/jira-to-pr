export interface GeneratedFile {
  relativePath: string;
  content: string;
}

export interface CodeGenerationResult {
  summary: string;
  verificationCommands: string[];
  files: GeneratedFile[];
}
