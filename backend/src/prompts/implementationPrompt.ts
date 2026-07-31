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

Required Changes:
${file.requiredChanges}

Current Contents:

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

An implementation plan has already been prepared.

Each source file includes the specific changes that must be implemented.

Your task is to implement those changes while preserving existing functionality and following the project's conventions.

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
2. Review the required changes for each source file.
3. Implement the required changes for every provided file.
4. If previous validation output is provided:
   - Analyze the validation output carefully.
   - Fix every reported issue.
   - Preserve all previously correct changes.
5. Modify ONLY the provided files.
6. Preserve all unrelated functionality.
7. Follow the existing project style and conventions.
8. Do not modify files beyond the scope of the implementation plan.
9. Return ONLY the files whose contents changed.

==============================
VERIFICATION
==============================

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
IMPLEMENTATION RULES
==============================

Each source file contains a "Required Changes" section.

Treat it as the implementation objective for that file.

Implement the requested changes while preserving unrelated behavior.

Do not perform unrelated refactoring or introduce additional functionality unless it is required to satisfy the Jira issue or resolve validation errors.

Return complete file contents for every modified file.

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

- The response must consist of a single valid JSON object.
- The first character of the response must be '{'.
- The last character of the response must be '}'.
- Do not output any text before or after the JSON object.
- Do not use markdown.
- Do not use code fences.
- Do not include explanations.
- Return complete file contents.
- Return ONLY files that were modified.
- Do not return partial snippets.
- Return verification commands in execution order.
- Some provided files may not exist. If a provided file does not exist, create it.
- Do not create any files that are not listed in the implementation plan.
`;
}
