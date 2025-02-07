import { NextResponse } from "next/server";
import { LINKEDIN_SCRAPER_QUERIES } from "@/lib/Linkedin";
import { DB_LUMA_LINKEDIN_MUTATIONS } from "@/lib/Supabase";
import {
  combineGuestData,
  fetchAndStoreGuests,
  getStoredLinkedInData,
  getUsersToScrape,
  processScrapingResults,
  validateRequest,
} from "./helpers";

export const maxDuration = 60;
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    // Validate request
    const requestData = await validateRequest(request);
    if (requestData instanceof NextResponse) {
      return requestData;
    }
    const { eventId, ticketKey, authToken } = requestData;

    // Fetch and store initial guest data
    const guests = await fetchAndStoreGuests(authToken, eventId, ticketKey);
    const guestIds = guests.map((guest) => guest.api_id);

    // Get stored LinkedIn data
    const storedLinkedInUsers = await getStoredLinkedInData(guestIds);

    // Process users that need LinkedIn scraping
    const usersToScrape = getUsersToScrape(storedLinkedInUsers);
    console.log("Users to process:", usersToScrape.length);

    // Scrape LinkedIn profiles
    const scrapeResult = await LINKEDIN_SCRAPER_QUERIES.scrapeProfiles(
      usersToScrape.map((user) => user.linkedin_profile_url ?? "")
    );

    // Process and store scraping results
    const processedUsers = processScrapingResults(usersToScrape, scrapeResult);
    await DB_LUMA_LINKEDIN_MUTATIONS.upsertLumaLinkedinUsers(processedUsers);

    // Get final LinkedIn data
    const finalLinkedInUsers = await getStoredLinkedInData(guestIds);

    // Combine and return data
    const returnedUsers = combineGuestData(guests, finalLinkedInUsers);
    return NextResponse.json(returnedUsers);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
