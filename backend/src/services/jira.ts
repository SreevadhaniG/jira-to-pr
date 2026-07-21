import type { JiraIssue } from "../types/jira.js";

export class JiraService {
  private readonly baseUrl = process.env.JIRA_BASE_URL!;
  private readonly email = process.env.JIRA_EMAIL!;
  private readonly apiToken = process.env.JIRA_API_TOKEN!;

  private getAuthHeader(): string {
    return `Basic ${Buffer.from(`${this.email}:${this.apiToken}`).toString(
      "base64",
    )}`;
  }

  async getIssue(issueKey: string): Promise<JiraIssue> {
    const response = await fetch(
      `${this.baseUrl}/rest/api/3/issue/${issueKey}`,
      {
        method: "GET",
        headers: {
          Authorization: this.getAuthHeader(),
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Jira issue '${issueKey}'. (${response.status} ${response.statusText})`,
      );
    }

    const issue = await response.json();

    return {
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      description: issue.fields.description
        ? this.extractDescription(issue.fields.description)
        : "",
    };
  }

  private extractDescription(description: any): string {
    if (!description?.content) {
      return "";
    }

    const lines: string[] = [];

    for (const block of description.content) {
      if (!block.content) {
        continue;
      }

      for (const node of block.content) {
        if (node.text) {
          lines.push(node.text);
        }
      }
    }

    return lines.join("\n");
  }
}

export const jiraService = new JiraService();
