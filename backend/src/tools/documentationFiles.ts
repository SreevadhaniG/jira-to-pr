import { getRepositoryFiles } from "./repositoryFiles.js";

export async function getDocumentationFiles(repositoryPath: string) {
  return getRepositoryFiles(
    repositoryPath,
    [".md", ".rst", ".txt"],
    [
      "README",
      "README.md",
      "README.rst",
      "README.txt",
      "CONTRIBUTING",
      "CHANGELOG",
      "LICENSE",
    ],
  );
}
