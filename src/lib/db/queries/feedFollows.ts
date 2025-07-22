import { db } from "..";
import { feedFollows, users, feeds } from "../schema";
import { eq, and } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ userId: userId, feedId: feedId })
    .returning();

  const results = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return firstOrUndefined(results);
}

export async function getFeedFollowsForUser(userId: string) {
  const results = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));

  return results;
}

export async function deleteFeedFollow(feedId: string, userId: string) {
  const [result] = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.feedId, feedId), eq(feedFollows.userId, userId)))
    .returning();

  return result;
}
