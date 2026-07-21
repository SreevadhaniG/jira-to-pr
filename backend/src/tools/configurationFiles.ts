import { getRepositoryFiles } from "./repositoryFiles.js";

export async function getConfigurationFiles(repositoryPath: string) {
  return getRepositoryFiles(
    repositoryPath,
    [
      ".json",
      ".yaml",
      ".yml",
      ".toml",
      ".xml",
      ".gradle",
      ".kts",
      ".properties",
      ".ini",
      ".cfg",
    ],
    ["Dockerfile", "Makefile", "Gemfile", "Procfile", "go.mod"],
  );
}
