import { fetchFeed } from "../API/rssAPI";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
  const feedURL = "https://www.wagslane.dev/index.xml";
  const rssFeed = await fetchFeed(feedURL);
  console.log(JSON.stringify(rssFeed, null, 2));
}
