import { github } from "../github/client.js";
import type { PullRequestContext } from "../types/github.js";
import type { WorkflowResult } from "../types/workflow.js";

export async function createPullRequestWorkflow(
  context: PullRequestContext,
): Promise<WorkflowResult<string>> {

  const response =
    await github.rest.pulls.create({
      owner: context.owner,
      repo: context.repo,
      title: context.title,
      body: context.description,
      head: context.head,
      base: context.base,
    });

  return {
    success: true,
    data: response.data.html_url,
  };
}