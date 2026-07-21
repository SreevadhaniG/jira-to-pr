import { readdir, readFile } from "fs/promises";
import path from "path";

import type { RepositoryFile } from "../types/repository.js";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  "target",
  "bin",
  "obj",
  ".idea",
  ".vscode",
]);

export async function getRepositoryFiles(
  repositoryPath: string,
  extensions: string[],
  specialFiles: string[],
): Promise<RepositoryFile[]> {
  const files: RepositoryFile[] = [];

  async function walk(currentPath: string): Promise<void> {
    const entries = await readdir(currentPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      const absolutePath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      const extension = path.extname(entry.name);

      const shouldInclude =
        extensions.includes(extension) || specialFiles.includes(entry.name);

      if (!shouldInclude) {
        continue;
      }

      try {
        const MAX_FILE_SIZE = 20_000;

        const content = (await readFile(absolutePath, "utf8")).slice(
          0,
          MAX_FILE_SIZE,
        );

        files.push({
          name: entry.name,
          relativePath: path.relative(repositoryPath, absolutePath),
          content,
        });
      } catch {
        // Ignore unreadable files
      }
    }
  }

  await walk(repositoryPath);

  return files;
}
