import type { RepositoryMetadata } from "../types/repository.js";
import type { WorkflowResult } from "../types/workflow.js";
import type { JiraIssue } from "../types/jira.js";
import { buildJiraPrompt } from "../prompts/jiraPrompt.js";
import type { ImplementationPlan } from "../types/implementation.js";
import { llmService } from "../services/llm.js";

export async function issueResolutionWorkflow(
  jiraIssue: JiraIssue,
  repositoryContext: RepositoryMetadata,
): Promise<WorkflowResult<ImplementationPlan>> {
  const prompt = buildJiraPrompt(jiraIssue, repositoryContext);

  const plan = await llmService.generateJSON<ImplementationPlan>(prompt);

  return {
    success: true,
    data: plan,
  };
}
