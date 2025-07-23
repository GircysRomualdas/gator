import { XMLParser } from "fast-xml-parser";
import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { createPost } from "../lib/db/queries/posts";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    method: "GET",
    headers: {
      "User-Agent": "gator",
    },
  });
  if (!response.ok) {
    throw new Error(
      `failed to fetch feed: ${response.status} ${response.statusText}`,
    );
  }
  const responseText = await response.text();
  const parser = new XMLParser();
  const feed = parser.parse(responseText);
  return validateRSSFeed(feed);
}

function validateRSSFeed(feed: any): RSSFeed {
  if (!feed.rss || !feed.rss.channel) {
    throw new Error("Invalid RSS feed: feed channel is missing");
  }
  const channel = feed.rss.channel;
  if (!channel.title || !channel.link || !channel.description) {
    throw new Error(
      "Invalid RSS feed: feed channel title, link, or description is missing",
    );
  }
  let items: RSSItem[] = [];
  if (Array.isArray(channel.item)) {
    items = channel.item.filter((item: any) => {
      return item.title && item.link && item.description && item.pubDate;
    });
  }

  return {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: items,
    },
  };
}

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("No feed to scrape");
    return;
  }
  await markFeedFetched(feed.id);
  const fetchedFeed = await fetchFeed(feed.url);
  console.log("Fetched feed:");
  for (const item of fetchedFeed.channel.item) {
    try {
      const post = await createPost(
        item.title,
        item.link,
        item.description,
        parsePublishedDate(item.pubDate),
        feed.id,
      );
      if (post) {
        console.log(`Created post: ${post.title}`);
      }
    } catch (error) {
      console.log(`Post already exists or failed to create: ${item.title}`);
    }
  }
}

function parsePublishedDate(dateString: string): Date {
  const parsed = new Date(dateString);
  if (isNaN(parsed.getTime())) {
    console.warn(`Invalid date format: ${dateString}, using current time`);
    return new Date();
  }
  return parsed;
}
