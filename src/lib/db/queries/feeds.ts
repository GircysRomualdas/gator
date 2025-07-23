import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";
import { eq, sql } from "drizzle-orm";

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

export async function getFeedByUrl(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}

export async function markFeedFetched(id: string) {
  await db
    .update(feeds)
    .set({ lastFetchedAt: new Date(), updatedAt: new Date() })
    .where(eq(feeds.id, id));
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} IS NULL DESC`, feeds.lastFetchedAt)
    .limit(1);
  return firstOrUndefined(result);
}
