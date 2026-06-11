import { existsSync } from "fs";

export function pathExists(path: string): boolean {
  return existsSync(path);
}
