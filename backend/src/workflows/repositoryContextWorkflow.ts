import { getDirectoryTree } from "../tools/directoryTree.js";
import { getConfigurationFiles } from "../tools/configurationFiles.js";
import { getDocumentationFiles } from "../tools/documentationFiles.js";

import type {
  RepositoryContext,
  RepositoryMetadata,
} from "../types/repository.js";

import type { WorkflowResult } from "../types/workflow.js";

export async function repositoryContextWorkflow(
  repository: RepositoryContext,
): Promise<WorkflowResult<RepositoryMetadata>> {

  try {
    const directoryTree = await getDirectoryTree(
      repository.repositoryPath,
    );

    const configurationFiles =
      await getConfigurationFiles(
        repository.repositoryPath,
      );

    const documentationFiles =
      await getDocumentationFiles(
        repository.repositoryPath,
      );

    return {
      success: true,
      data: {
        directoryTree,
        configurationFiles,
        documentationFiles,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to build repository context.",
    };
  }
}