import { fetchFeed } from "../API/rssAPI";
import { readConfig } from "../config";
import { getUserByName, getUserById } from "../lib/db/queries/users";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
  const feedURL = "https://www.wagslane.dev/index.xml";
  const rssFeed = await fetchFeed(feedURL);
  console.log(JSON.stringify(rssFeed, null, 2));
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length < 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }

  const feedName: string = args[0];
  const url: string = args[1];
  const config = readConfig();
  const user = await getUserByName(config.currentUserName);
  if (!user) {
    throw new Error(`User ${config.currentUserName} does not exist`);
  }
  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error(`Failed to create feed ${feedName}`);
  }
  console.log(`Feed ${feedName} created successfully`);
  printFeed(feed, user);
}

export async function handlerListFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getFeeds();
  if (feeds.length === 0) {
    console.log(`No feeds found.`);
    return;
  }

  console.log(`Found %d feeds:\n`, feeds.length);
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }
    printFeed(feed, user);
    console.log("=========================================");
  }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
