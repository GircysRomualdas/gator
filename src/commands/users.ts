import { setUser } from "../config";

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw new Error(`usage: ${cmdName} <username>`);
  }

  const userName: string = args[0];
  setUser(userName);
  console.log(`Logged in as ${userName}`);
}
