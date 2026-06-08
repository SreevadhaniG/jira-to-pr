import { readFile } from "fs/promises";

export async function readFileContent(
  filePath: string
): Promise<string> {
  return await readFile(filePath, "utf-8");
}