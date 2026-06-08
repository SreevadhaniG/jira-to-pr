import { readFile } from "fs/promises";
import { writeFile } from "fs/promises";

export async function readFileContent(
  filePath: string
): Promise<string> {
  return await readFile(filePath, "utf-8");
}

export async function writeFileContent(
  filePath: string,
  content: string
): Promise<void> {
  await writeFile(filePath, content, "utf-8");
}