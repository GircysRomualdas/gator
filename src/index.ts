import { readConfig, setUser } from "./config";
import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handlerLogin } from "./commands/users";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);

  try {
    const args = process.argv.slice(2);
    if (!args.length) {
      throw new Error("No command provided");
    }
    const cmdName = args[0];
    runCommand(registry, cmdName, ...args.slice(1));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
