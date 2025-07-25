import {
  createFeedFollow,
  getFeedFollowsForUser,
  deleteFeedFollow,
} from "../lib/db/queries/feedFollows";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { readConfig } from "../config";
import { User } from "src/lib/db/schema";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (!args.length) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url: string = args[0];
  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`feed not found: ${url}`);
  }
  const config = readConfig();
  const feedFollows = await createFeedFollow(user.id, feed.id);
  if (!feedFollows) {
    throw new Error(`failed to follow feed: ${feed.name}`);
  }
  console.log(`Feed ${feed.name} followed by user ${user.name}`);
}

export async function handlerFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const feedFollows = await getFeedFollowsForUser(user.id);
  console.log(`Feed follows for user ${user.name}:`);
  for (const feedFollow of feedFollows) {
    console.log(`followed feed ${feedFollow.feedName}`);
  }
}

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (!args.length) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url: string = args[0];
  let feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`Feed not found for url: ${url}`);
  }

  const result = await deleteFeedFollow(feed.id, user.id);
  if (!result) {
    throw new Error(`Failed to unfollow feed: ${url}`);
  }

  console.log(`%s unfollowed successfully!`, feed.name);
}
