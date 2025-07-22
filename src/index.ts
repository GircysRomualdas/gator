import {
  CommandsRegistry,
  registerCommand,
  runCommand,
  middlewareLoggedIn,
} from "./commands/commands";
import {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerListUsers,
} from "./commands/users";
import {
  handlerAggregate,
  handlerAddFeed,
  handlerListFeeds,
} from "./commands/aggregate";
import {
  handlerFollow,
  handlerFollowing,
  handlerUnfollow,
} from "./commands/follow";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerListUsers);
  registerCommand(registry, "agg", handlerAggregate);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerListFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));

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
