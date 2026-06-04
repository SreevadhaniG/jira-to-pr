import { runCommand } from "./tools/terminal.js";

async function main() {
  try {
    const output = await runCommand("node -v");

    console.log("Output:");
    console.log(output);
  } catch (error) {
    console.error("Error:");
    console.error(error);
  }
}

main();