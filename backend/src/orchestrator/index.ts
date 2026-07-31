import { repositoryResolutionWorkflow } from "../workflows/repositoryResolutionWorkflow.js";
import { cloneRepositoryWorkflow } from "../workflows/cloneRepositoryWorkflow.js";
import { repositoryContextWorkflow } from "../workflows/repositoryContextWorkflow.js";
import { jiraWorkflow } from "../workflows/jiraWorkflow.js";
import { branchWorkflow } from "../workflows/branchWorkflow.js";
import { issueResolutionWorkflow } from "../workflows/issueResoulutionWorkflow.js";
import { sourceFileWorkflow } from "../workflows/sourceFileWorkflow.js";
import { implementationWorkflow } from "../workflows/implementationWorkflow.js";
import { writeFilesWorkflow } from "../workflows/writeFilesWorkflow.js";
import { validationWorkflow } from "../workflows/validationWorkflow.js";
import { publishWorkflow } from "../workflows/publishWorkflow.js";
import { terminalActionWorkflow } from "../workflows/terminalActionWorkflow.js";

import { runCommand } from "../tools/terminal.js";

import type { ValidationResult } from "../types/validation.js";
import type { CodeGenerationResult } from "../types/codeGeneration.js";

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

//===============================
// Orchestrator
//===============================

export async function startOrchestrator() {
  console.log("Orchestrator Started");

  const repositoryUrl = process.env.TEST_REPOSITORY_URL;

  if (!repositoryUrl) {
    console.log("TEST_REPOSITORY_URL is not configured.");
    return;
  }

  const rl = createInterface({
    input,
    output,
  });

  // ===============================
  // Repository Resolution Workflow
  // ===============================

  console.log("Preparing Repository...");

  const repositoryResult = await repositoryResolutionWorkflow(repositoryUrl);

  if (!repositoryResult.success) {
    console.log(repositoryResult.error);
    rl.close();
    return;
  }

  const repository = repositoryResult.data;

  console.log("Repository Info:");
  console.log(repository);

  // ===============================
  // Clone Repository Workflow
  // ===============================

  if (!repository.exists) {
    console.log("Repository not found locally.");
    console.log("Cloning repository...");

    const cloneResult = await cloneRepositoryWorkflow(repository);

    if (!cloneResult.success) {
      console.log(cloneResult.error);
      rl.close();
      return;
    }
  } else {
    console.log("Repository already exists.");
  }

  // ===============================
  // Repository Context Workflow
  // ===============================

  console.log("Building Repository Context...");

  const repositoryContextResult = await repositoryContextWorkflow(repository);

  if (!repositoryContextResult.success) {
    console.log(repositoryContextResult.error);
    rl.close();
    return;
  }

  const repositoryContext = repositoryContextResult.data;

  console.log("Repository Context:");
  console.log(repositoryContext);

  // ===============================
  // Jira Workflow
  // ===============================

  const jiraIssueKey = await rl.question("\nEnter Jira Issue Key: ");

  console.log("Fetching Jira Issue...");

  const jiraResult = await jiraWorkflow(jiraIssueKey.trim());

  if (!jiraResult.success) {
    console.log(jiraResult.error);
    rl.close();
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

  let implementation: CodeGenerationResult | undefined;

  let implementationValidated = false;

  for (let cycle = 1; cycle <= MAX_CYCLES; cycle++) {
    console.log("\n======================================");
    console.log(`Implementation Cycle ${cycle}`);
    console.log("======================================");

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

    // -------------------------------
    // Write Files
    // -------------------------------

    const writeResult = await writeFilesWorkflow(implementation, repository);

    if (!writeResult.success) {
      console.log(writeResult.error);
      return;
    }

    console.log("Source files updated successfully.");

    // -------------------------------
    // Validate Implementation
    // -------------------------------

    console.log("Running Validation...");

    console.log("Verification Commands:");
    implementation.verificationCommands.forEach((command, index) => {
      console.log(`${index + 1}. ${command}`);
    });

    const validationResult = await validationWorkflow(
      repository,
      implementation.verificationCommands,
    );

    if (!validationResult.success) {
      console.log(validationResult.error);
      return;
    }

    previousValidation = validationResult.data;

    if (previousValidation.passed) {
      console.log("Validation passed.");
      implementationValidated = true;
      break;
    }

    console.log("Validation failed.");
    console.log(`Command: ${previousValidation.command}`);
    console.log(previousValidation.output);

    const terminalActionsExecuted = await terminalActionWorkflow(
      previousValidation,
      repository,
    );

    if (terminalActionsExecuted) {
      console.log("Re-running validation...");
      continue;
    }

    if (cycle === MAX_CYCLES) {
      console.log("\nMaximum implementation attempts reached.");
      console.log("Last validation output:");
      console.log(`Command: ${previousValidation.command}`);
      console.log(previousValidation.output);
    }
  }

  // ===============================
  // Publishing
  // ===============================

  if (!implementationValidated) {
    console.log("\nImplementation could not be validated.");
    console.log("Publishing skipped.");
    console.log("Orchestrator Finished");
    return;
  }

  console.log("\n======================================");
  console.log("Implementation Complete");
  console.log("======================================");

  console.log("Summary:");
  console.log(implementation?.summary);

  console.log("\nModified Files:");
  implementation?.files.forEach((file) => {
    console.log(`- ${file.relativePath}`);
  });

  console.log("\nBranch:");
  console.log(branchResult.data);

  const answer = await rl.question(
    "\nWould you like to publish the changes? (y/n): ",
  );

  rl.close();

  const publishApproved = answer.trim().toLowerCase() === "y";

  if (!publishApproved) {
    console.log("\nPublishing cancelled by user.");
    console.log("Orchestrator Finished");
    return;
  }

  console.log("\nPublishing changes...");

  const publishResult = await publishWorkflow(repository);

  if (!publishResult.success) {
    console.log(publishResult.error);
    return;
  }

  console.log("\nPull Request:");
  console.log(publishResult.data);

  console.log("\nOrchestrator Finished");
}
