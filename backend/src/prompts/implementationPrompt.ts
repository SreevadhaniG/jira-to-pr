import type { JiraIssue } from "../types/jira.js";
import type {
  RepositoryMetadata,
  RepositoryFile,
} from "../types/repository.js";
import type { ValidationResult } from "../types/validation.js";

export function buildImplementationPrompt(
  issue: JiraIssue,
  repository: RepositoryMetadata,
  sourceFiles: RepositoryFile[],
  validation?: ValidationResult,
): string {
  const configurationFiles = repository.configurationFiles
    .map(
      (file) => `
### ${file.relativePath}

\`\`\`
${file.content}
\`\`\`
`,
    )
    .join("\n");

  const documentationFiles = repository.documentationFiles
    .map(
      (file) => `
### ${file.relativePath}

\`\`\`
${file.content}
\`\`\`
`,
    )
    .join("\n");

  const files = sourceFiles
    .map(
      (file) => `
## ${file.relativePath}

\`\`\`
${file.content}
\`\`\`
`,
    )
    .join("\n");

  const validationSection = validation
    ? `
==============================
PREVIOUS VALIDATION
==============================

Validation Command:
${validation.command}

Validation Output:
${validation.output}

The previous implementation did not pass validation.

Update the implementation to resolve the validation errors while preserving all previously correct changes.
`
    : "";

  return `
You are an experienced software engineer responsible for implementing Jira issues.

You have already identified the relevant source files.

Your task is to modify ONLY the provided files to satisfy the Jira issue.

==============================
JIRA ISSUE
==============================

Key:
${issue.key}

Summary:
${issue.summary}

Description:
${issue.description}

==============================
CONFIGURATION
==============================

${configurationFiles}

==============================
DOCUMENTATION
==============================

${documentationFiles}

==============================
SOURCE FILES
==============================

${files}

${validationSection}

==============================
TASK
==============================

1. Understand the Jira issue.
2. If previous validation output is provided:
   - Analyze the validation output carefully.
   - Fix every reported issue.
   - Preserve all previously correct changes.
3. Modify ONLY the provided files.
4. Preserve existing functionality.
5. Follow the existing project style and conventions.
6. Do not invent files that were not provided.
7. Return ONLY the files that require changes.

Determine the sequence of commands required to verify your implementation.

Return the commands in the order they should be executed.

Examples:

- npx eslint .
- npm test
- npm run build
- pytest
- go test ./...

Prefer project-specific commands whenever available.

Do not include unnecessary commands.

==============================
OUTPUT
==============================

Return ONLY valid JSON.

The JSON must exactly match this schema:

{
  "summary": "Short summary of the implementation.",
  "verificationCommands": [
    "First verification command",
    "Second verification command"
  ],
  "files": [
    {
      "relativePath": "relative/path/to/file",
      "content": "Complete updated file content"
    }
  ]
}

Rules:

- Return complete file contents.
- Return ONLY files that were modified.
- Do not return partial snippets.
- Do not use markdown.
- Do not wrap the JSON in code fences.
- Do not include explanations.
- Return verification commands in execution order.
`;
}
