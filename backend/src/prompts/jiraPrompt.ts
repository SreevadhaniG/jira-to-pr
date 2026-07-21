import type { JiraIssue } from "../types/jira.js";
import type { RepositoryMetadata } from "../types/repository.js";

export function buildJiraPrompt(
  issue: JiraIssue,
  repository: RepositoryMetadata,
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

  return `
You are an experienced software engineer responsible for implementing Jira issues in an existing software project.

Your task is to analyze the Jira issue and the repository context to determine how the issue should be implemented.

At this stage, you are only creating an implementation plan. Do not generate or modify any source code.
==============================
JIRA ISSUE
==============================

Issue Key:
${issue.key}

Summary:
${issue.summary}

Description:
${issue.description}

==============================
REPOSITORY STRUCTURE
==============================

${repository.directoryTree}

==============================
CONFIGURATION FILES
==============================

${configurationFiles}

==============================
DOCUMENTATION
==============================

${documentationFiles}

==============================
TASK
==============================

1. Understand the Jira issue.
2. Analyze the repository structure.
3. Determine which files need to be inspected and potentially modified.
4. Write a short summary of the implementation approach.
5. Do not generate or modify any source code.

Return ONLY valid JSON.

The response must exactly match this schema:

{
  "summary": "A short description of the implementation.",
  "files": [
    "relative/path/to/file1",
    "relative/path/to/file2"
  ]
}

Rules:
- Do not include explanations.
- Do not include markdown.
- Do not wrap the JSON in code fences.
- Use repository-relative paths.
- Include every file that needs to be inspected or modified.
`;
}
