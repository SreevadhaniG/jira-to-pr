import { repositoryContextWorkflow } from "../workflows/repositoryContextWorkflow.js";
import { jiraWorkflow } from "../workflows/jiraWorkflow.js";
import { branchWorkflow } from "../workflows/branchWorkflow.js";
import { issueResolutionWorkflow } from "../workflows/issueResoulutionWorkflow.js";
import { sourceFileWorkflow } from "../workflows/sourceFileWorkflow.js";
import { implementationWorkflow } from "../workflows/implementationWorkflow.js";
import { writeFilesWorkflow } from "../workflows/writeFilesWorkflow.js";
import { validationWorkflow } from "../workflows/validationWorkflow.js";

import { runCommand } from "../tools/terminal.js";

import type { ValidationResult } from "../types/validation.js";

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

  const repositoryContextResult = await repositoryContextWorkflow(repository);

  if (!repositoryContextResult.success) {
    console.log(repositoryContextResult.error);
    return;
  }

  const repositoryContext = repositoryContextResult.data;

  // ===============================
  // Jira Workflow
  // ===============================

  console.log("Fetching Jira Issue...");

  const jiraResult = await jiraWorkflow("SCRUM-1");

  if (!jiraResult.success) {
    console.log(jiraResult.error);
    return;
  }

  const jiraIssue = jiraResult.data;

  console.log("Jira Issue:");
  console.log(jiraIssue);

  // ===============================
  // Branch Workflow
  // ===============================

  const pwdResult = await runCommand("echo %cd%", repository.repositoryPath);

  console.log("EXECUTING IN:");
  console.log(pwdResult.stdout);

  const branchResult = await branchWorkflow(jiraIssue, repository);

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

  const implementationPlanResult = await issueResolutionWorkflow(
    jiraIssue,
    repositoryContext,
  );

  if (!implementationPlanResult.success) {
    console.log(implementationPlanResult.error);
    return;
  }

  const implementationPlan = implementationPlanResult.data;

  console.log("Implementation Plan:");
  console.log(implementationPlan);

  // ===============================
  // Implementation Loop
  // ===============================

  const MAX_CYCLES = 3;

  let previousValidation: ValidationResult | undefined;

  for (let cycle = 1; cycle <= MAX_CYCLES; cycle++) {
    console.log(`\n========== IMPLEMENTATION CYCLE ${cycle} ==========\n`);

    // -------------------------------
    // Read Source Files
    // -------------------------------

    console.log("Reading Source Files...");

    const sourceFilesResult = await sourceFileWorkflow(
      implementationPlan,
      repository,
    );

    if (!sourceFilesResult.success) {
      console.log(sourceFilesResult.error);
      return;
    }

    const sourceFiles = sourceFilesResult.data;

    // -------------------------------
    // Generate Implementation
    // -------------------------------

    const implementationResult = await implementationWorkflow(
      jiraIssue,
      repositoryContext,
      sourceFiles,
      previousValidation,
    );

    if (!implementationResult.success) {
      console.log(implementationResult.error);
      return;
    }

    const implementation = implementationResult.data;

    console.log("Implementation Summary:");
    console.log(implementation.summary);

    console.log("Validation Command:");
    console.log(implementation.validationCommand);

    // -------------------------------
    // Write Files
    // -------------------------------

    const writeResult = await writeFilesWorkflow(
      implementation,
      repository,
    );

    if (!writeResult.success) {
      console.log(writeResult.error);
      return;
    }

    console.log("Source files updated successfully.");

    // -------------------------------
    // Validate Implementation
    // -------------------------------

    console.log("Running Validation...");

    const validationResult = await validationWorkflow(
      repository,
      implementation.validationCommand,
    );

    if (!validationResult.success) {
      console.log(validationResult.error);
      return;
    }

    previousValidation = validationResult.data;

    console.log(previousValidation);

    if (previousValidation.passed) {
      console.log("✅ Validation passed.");
      break;
    }

    console.log("❌ Validation failed.");
    console.log(previousValidation.output);

    if (cycle === MAX_CYCLES) {
      console.log("Maximum implementation attempts reached.");
    }
  }

  console.log("Orchestrator Finished");
}