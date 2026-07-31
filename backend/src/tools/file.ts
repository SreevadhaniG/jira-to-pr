import path from "path";
import { mkdir, readFile, writeFile } from "fs/promises";

export async function readFileContent(filePath: string): Promise<string> {
  return await readFile(filePath, "utf-8");
}

export async function writeFileContent(
  filePath: string,
  content: string,
): Promise<void> {
  // Ensure the parent directory exists
  await mkdir(path.dirname(filePath), {
    recursive: true,
  });

  await writeFile(filePath, content, "utf-8");
}
