import { scrapeFeeds } from "../API/rssAPI";
import { readConfig } from "../config";
import { getUserByName, getUserById } from "../lib/db/queries/users";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { Feed, User } from "src/lib/db/schema";
import { createFeedFollow } from "../lib/db/queries/feedFollows";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeBetweenRequests: number = parseDuration(args[0]);
  console.log(`Collecting feeds every ${args[0]}`);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

function handleError(err: unknown) {
  console.error("An error occurred:", err);
}

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    throw new Error(`Invalid duration format: ${durationStr}`);
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error(`Unsupported time unit: ${unit}`);
  }
}

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length < 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }

  const feedName: string = args[0];
  const url: string = args[1];
  if (!isValidUrl(url)) {
    throw new Error(
      "Feed URL must start with http:// or https:// and be a valid URL.",
    );
  }

  const config = readConfig();
  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error(`Failed to create feed ${feedName}`);
  }
  console.log(`Feed ${feedName} created successfully`);
  printFeed(feed, user);

  const feedFollow = await createFeedFollow(user.id, feed.id);
  if (!feedFollow) {
    throw new Error(`failed to follow feed: ${feed.name}`);
  }
  console.log(
    `Feed ${feedFollow.feedName} followed by user ${feedFollow.userName}`,
  );
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
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
