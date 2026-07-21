import { repositoryContextWorkflow } from "../workflows/repositoryContextWorkflow.js";
import { jiraWorkflow } from "../workflows/jiraWorkflow.js";
import { branchWorkflow } from "../workflows/branchWorkflow.js";
import { issueResolutionWorkflow } from "../workflows/issueResoulutionWorkflow.js";
import { runCommand } from "../tools/terminal.js";

export async function startOrchestrator() {
  console.log("Orchestrator Started");

  const repository = {
    repositoryUrl: process.env.TEST_REPOSITORY_URL || "",
    repositoryPath: process.env.TEST_REPOSITORY_LINK || "",
    exists: true,
  };

  console.log("Repository Info:");
  console.log(repository);

  // ===============================
  // Repository Context Workflow
  // ===============================

  console.log("Building Repository Context...");

  const repositoryContextResult =
    await repositoryContextWorkflow(repository);

  if (!repositoryContextResult.success) {
    console.log(repositoryContextResult.error);
    return;
  }

  const repositoryContext =
    repositoryContextResult.data;

  // ===============================
  // Jira Workflow
  // ===============================

  console.log("Fetching Jira Issue...");

  const jiraResult =
    await jiraWorkflow("SCRUM-1");

  if (!jiraResult.success) {
    console.log(jiraResult.error);
    return;
  }

  const jiraIssue =
    jiraResult.data;

  console.log("Jira Issue:");
  console.log(jiraIssue);

  // ===============================
  // Branch Workflow
  // ===============================

  const pwdResult =
    await runCommand(
      "echo %cd%",
      repository.repositoryPath,
    );

  console.log("EXECUTING IN:");
  console.log(pwdResult.stdout);

  const branchResult =
    await branchWorkflow(
      jiraIssue,
      repository,
    );

  if (!branchResult.success) {
    console.log(branchResult.error);
    return;
  }

  console.log("Branch:");
  console.log(branchResult.data);

  // ===============================
  // Implementation Planning
  // ===============================

  console.log("Generating Implementation Plan...");

  const implementationPlanResult =
    await issueResolutionWorkflow(
      jiraIssue,
      repositoryContext,
    );

  if (!implementationPlanResult.success) {
    console.log(implementationPlanResult.error);
    return;
  }

  console.log("Implementation Plan:");
  console.log(implementationPlanResult.data);

  console.log("Orchestrator Finished");
}