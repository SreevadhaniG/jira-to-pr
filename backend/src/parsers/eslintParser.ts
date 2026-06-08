export interface LintIssue {
  file: string;
  line: number;
  message: string;
}

export function parseEslintOutput(output: string): LintIssue[] {
  const issues: LintIssue[] = [];

  const lines = output.split("\n");

  let currentFile = "";

  for (const line of lines) {
    const trimmedLine = line.trim();

    // File path line
    if (trimmedLine.endsWith(".ts") || trimmedLine.endsWith(".js")) {
      currentFile = trimmedLine;
      continue;
    }

    const match = trimmedLine.match(/^(\d+):(\d+)\s+error\s+(.+?)\s+@/);

    if (match) {
      const message = match[3];

      if (!message) {
        continue;
      }

      issues.push({
        file: currentFile,
        line: Number(match[1]),
        message,
      });
    }
  }

  return issues;
}
