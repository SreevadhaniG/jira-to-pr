export function buildRetryPrompt(
  originalPrompt: string,
  validationError: string
): string {
  return `
Your previous fix failed.

Validation Error:

${validationError}

Original Request:

${originalPrompt}

Please provide a corrected solution.
`;
}