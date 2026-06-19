import { exec } from "child_process";

export interface CommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

export function runCommand(
  command: string,
  cwd?: string,
): Promise<CommandResult> {
  return new Promise((resolve) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      console.log("COMMAND:", command);
      console.log("ERROR:", error);

      resolve({
        success: !error,
        stdout,
        stderr,
      });
    });
  });
}
