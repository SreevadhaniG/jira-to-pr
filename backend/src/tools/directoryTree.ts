import { readdir } from "fs/promises";
import path from "path";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".idea",
  ".vscode",
]);

export async function getDirectoryTree(
  repositoryPath: string,
  maxDepth = 3,
): Promise<string> {
  async function walk(
    currentPath: string,
    depth: number,
    indent: string,
  ): Promise<string[]> {
    if (depth > maxDepth) {
      return [];
    }

    const entries = await readdir(currentPath, {
      withFileTypes: true,
    });

    const sortedEntries = entries.sort((a, b) => a.name.localeCompare(b.name));

    const lines: string[] = [];

    for (const entry of sortedEntries) {
      if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      lines.push(`${indent}${entry.name}`);

      if (entry.isDirectory()) {
        const children = await walk(
          path.join(currentPath, entry.name),
          depth + 1,
          `${indent}  `,
        );

        lines.push(...children);
      }
    }

    return lines;
  }

  const tree = await walk(repositoryPath, 0, "");

  return tree.join("\n");
}
