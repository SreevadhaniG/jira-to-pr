import { runCommand } from "../tools/terminal.js";
import type { TerminalAction } from "../types/terminalAction.js";

export async function executeTerminalActions(
  actions: TerminalAction[],
  cwd?: string,
): Promise<void> {
  for (const action of actions) {
    console.log(`Running: ${action.command}`);

    const result = await runCommand(action.command, cwd);

    if (!result.success) {
      throw new Error(
        [
          `Failed to execute terminal action.`,
          `Command: ${action.command}`,
          result.stderr,
        ].join("\n"),
      );
    }

    console.log(`✓ ${action.command}`);
  }
}
