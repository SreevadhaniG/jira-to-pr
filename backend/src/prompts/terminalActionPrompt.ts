import type { ValidationResult } from "../types/validation.js";

export function buildTerminalActionPrompt(
  validationResult: ValidationResult,
): string {
  return `
You are an AI assistant responsible for recovering the development environment.

The implementation has already been completed.

The source code MUST NOT be modified.

Your responsibility is ONLY to determine whether the validation failure can be resolved by executing terminal commands.

Validation Output:

${validationResult.output}

Examples of valid terminal actions:

- Install missing dependencies
- Install missing development tools
- Run dependency installation
- Regenerate generated files
- Run package manager commands

Do NOT:

- Modify source code
- Suggest code changes
- Suggest unrelated commands
- Repeat the validation command

If the validation failure cannot be fixed using terminal commands, return:

{
  "required": false,
  "summary": "...",
  "actions": []
}

Otherwise return:

{
  "required": true,
  "summary": "...",
  "actions": [
    {
      "command": "...",
      "reason": "..."
    }
  ]
}

Rules:

- Return valid JSON only.
- Do not use markdown.
- Do not include explanations.
`;
}
