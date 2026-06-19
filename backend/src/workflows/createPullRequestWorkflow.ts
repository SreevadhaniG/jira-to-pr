import { github } from "../github/client.js";
import type { PullRequestContext } from "../types/github.js";

export async function createPullRequestWorkflow(
  context: PullRequestContext,
): Promise<string> {

  const response =
    await github.rest.pulls.create({
      owner: context.owner,
      repo: context.repo,
      title: context.title,
      body: context.description,
      head: context.head,
      base: context.base,
    });

  return response.data.html_url;
}