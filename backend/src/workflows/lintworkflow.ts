import { runCommand } from "../tools/terminal.js";

export async function lintWorkflow() {
    console.log("Running lint workflow...");

    const result = await runCommand("node -v");
    console.log("Lint workflow result:");
    console.log(result);
}