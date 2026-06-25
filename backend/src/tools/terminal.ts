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
    console.log("COMMAND:", command);
    console.log("REQUESTED CWD:", cwd);
    console.log("PROCESS CWD:", process.cwd());

    exec(command, { cwd }, (error, stdout, stderr) => {
      console.log("ERROR:", error);
      console.log("STDOUT:", stdout);
      console.log("STDERR:", stderr);

      resolve({
        success: !error,
        stdout,
        stderr,
      });
    });
  });
}
