import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerListUsers,
} from "./commands/users";
import { handlerAggregate, handlerAddFeed } from "./commands/aggregate";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerListUsers);
  registerCommand(registry, "agg", handlerAggregate);
  registerCommand(registry, "addfeed", handlerAddFeed);

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
