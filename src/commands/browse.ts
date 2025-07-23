import { User } from "src/lib/db/schema";
import { getPostsForUser } from "../lib/db/queries/posts";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let limit: number = 2;
  if (args.length) {
    limit = parseInt(args[0]);
    if (isNaN(limit)) {
      throw new Error(`usage: ${cmdName} <limit>`);
    }
  }
  const posts = await getPostsForUser(user.id, limit);
  if (!posts.length) {
    console.log("No posts found");
    return;
  }
  console.log(`Found ${posts.length} posts for user ${user.name}`);
  for (let post of posts) {
    console.log(`${post.publishedAt} from ${post.feedName}`);
    console.log(`--- ${post.title} ---`);
    console.log(`    ${post.description}`);
    console.log(`Link: ${post.url}`);
    console.log(`=====================================`);
  }
}
