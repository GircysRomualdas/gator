import { db } from "..";
import { posts, feeds, feedFollows } from "../schema";
import { eq, desc, getTableColumns } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createPost(
  title: string,
  url: string,
  description: string,
  publishedAt: Date,
  feedId: string,
) {
  const result = await db
    .insert(posts)
    .values({
      title: title,
      url: url,
      description: description,
      publishedAt: publishedAt,
      feedId: feedId,
    })
    .returning();
  return firstOrUndefined(result);
}

export async function getPostsForUser(userId: string, limit: number) {
  const results = await db
    .select({
      ...getTableColumns(posts),
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return results;
}
