import path from "path";
import type { RepositoryContext } from "../types/repository.js";
import type { RepositoryAnalysis } from "../types/repositoryAnalysis.js";
import { pathExists } from "../tools/path.js";

export async function repositoryAnalysisWorkflow(
  repository: RepositoryContext,
): Promise<RepositoryAnalysis> {
  const eslintFiles = [
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.cjs",
    "eslint.config.mts",
    "eslint.config.ts",
    ".eslintrc.json",
    ".eslintrc.js",
  ];

  const eslintConfigFile = eslintFiles.find((file) =>
    pathExists(path.join(repository.repositoryPath, file)),
  );

  if (eslintConfigFile) {
    return {
      hasEslint: true,
      eslintConfigFile,
    };
  }

  return {
    hasEslint: false,
  };
}
