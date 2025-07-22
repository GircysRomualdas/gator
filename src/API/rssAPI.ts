import { XMLParser } from "fast-xml-parser";

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
