import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
  const result = await db
    .insert(feeds)
    .values({ name: name, url: url, userId: userId })
    .returning();
  return firstOrUndefined(result);
}

export async function getFeeds() {
  const results = await db.select().from(feeds);
  return results;
}
