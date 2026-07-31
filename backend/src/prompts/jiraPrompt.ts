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

Your task is to analyze the Jira issue and repository context and produce an implementation plan.

At this stage, DO NOT generate or modify source code.

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
3. Determine which files must be modified or created to implement the Jira issue.
4. For each file, describe the required changes.
5. Write a short implementation summary.
6. Do NOT generate or modify source code.

==============================
OUTPUT
==============================

Return ONLY valid JSON.

The response must exactly match this schema:

{
  "summary": "Short implementation summary.",
  "files": [
    {
      "relativePath": "relative/path/to/file1",
      "requiredChanges": "Describe what needs to change in this file."
    },
    {
      "relativePath": "relative/path/to/file2",
      "requiredChanges": "Describe what needs to change in this file."
    }
  ]
}

Rules:

- Use repository-relative paths.
- Include only files that need to be modified or created.
- For each file, provide a concise description of the required changes.
- Do not explain how to implement the changes.
- Do not generate source code.
- Do not include explanations.
- Do not include markdown.
- Do not wrap the JSON in code fences.
`;
}