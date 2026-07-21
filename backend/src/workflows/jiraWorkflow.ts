import { jiraService } from "../services/jira.js";
import type { JiraIssue } from "../types/jira.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function jiraWorkflow(
  issueKey: string,
): Promise<WorkflowResult<JiraIssue>>{
  const issue = await jiraService.getIssue(issueKey);

  return {
    success: true,
    data: issue,
  };
}