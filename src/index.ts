import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handlerLogin, handlerRegister, handlerReset } from "./commands/users";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);

  try {
    const args = process.argv.slice(2);
    if (!args.length) {
      throw new Error("No command provided");
    }
    const cmdName = args[0];
    await runCommand(registry, cmdName, ...args.slice(1));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
}

main();
