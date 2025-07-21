import { setUser, readConfig } from "../config";
import {
  createUser,
  getUserByName,
  deleteAllUsers,
  getUsers,
} from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw new Error(`usage: ${cmdName} <username>`);
  }

  const userName: string = args[0];
  const user = await getUserByName(userName);
  if (!user) {
    throw new Error(`User ${userName} does not exist`);
  }
  setUser(user.name);
  console.log(`Logged in as ${user.name}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw new Error(`usage: ${cmdName} <username>`);
  }

  const userName: string = args[0];
  if (await getUserByName(userName)) {
    throw new Error(`User ${userName} already exists`);
  }
  const user = await createUser(userName);
  setUser(user.name);
  console.log(`Registered as ${user.name}`);
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  await deleteAllUsers();
  console.log("All users deleted");
}

export async function handlerListUsers(cmdName: string, ...args: string[]) {
  const users = await getUsers();
  const config = readConfig();

  for (const user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
}
