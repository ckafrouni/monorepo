import { env } from "@/lib/env";
import {
  LinkedinProfileScrapeFailure,
  LinkedinProfileScrapeSuccess,
} from "./Types";

const BATCH_SIZE = 25;
const URL = env.NEXT_PUBLIC_RAPIDAPI_URL;
const HEADERS = {
  "x-rapidapi-key": env.NEXT_PUBLIC_RAPIDAPI_KEY,
  "x-rapidapi-host": env.NEXT_PUBLIC_RAPIDAPI_HOST,
  "Content-Type": "application/json",
  "x-rapidapi-user": env.NEXT_PUBLIC_RAPIDAPI_USER,
};

const QUERIES = {
  scrapeBatch: async (links: string[]) => {
    const options = {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ links }),
    };

    const response = await fetch(URL, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();

    if (!responseData.success) {
      throw new Error("Failed to scrape LinkedIn profile");
    }

    const data = responseData.data as (
      | LinkedinProfileScrapeSuccess
      | LinkedinProfileScrapeFailure
    )[];

    const success = data.filter(
      (entry) => "data" in entry
    ) as LinkedinProfileScrapeSuccess[];
    const failure = data.filter(
      (entry) => "error" in entry
    ) as LinkedinProfileScrapeFailure[];

    return {
      success,
      failure,
    };
  },
  async scrapeProfiles(links: string[]) {
    links = links.filter((link) => link !== "");
    // Add https://www.linkedin.com/in/ to the beginning of each link if it's not already there
    links = links.map((link) =>
      link.startsWith("https://www.linkedin.com/")
        ? link
        : `https://www.linkedin.com/${link}`
    );

    const success = [] as LinkedinProfileScrapeSuccess[];
    const failure = [] as LinkedinProfileScrapeFailure[];

    for (let i = 0; i < links.length; i += BATCH_SIZE) {
      const batchLinks = links.slice(i, i + BATCH_SIZE);
      const { success: successBatch, failure: failureBatch } =
        await QUERIES.scrapeBatch(batchLinks);
      success.push(...successBatch);
      failure.push(...failureBatch);
    }

    return {
      success,
      failure,
    };
  },
};

export { QUERIES as LINKEDIN_SCRAPER_QUERIES };
