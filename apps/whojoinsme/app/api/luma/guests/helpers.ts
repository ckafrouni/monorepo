import { Json, Tables } from "@/database.types";
import { LinkedinProfileScrapeResult } from "@/lib/Linkedin";
import { LumaGuest } from "@/lib/Luma/Types";
import { NextResponse } from "next/server";
import { LumaEventService } from "@/lib/Luma/LumaEventService";
import {
  DB_LUMA_LINKEDIN_MUTATIONS,
  DB_LUMA_LINKEDIN_QUERIES,
} from "@/lib/Supabase";

// Request validation
export async function validateRequest(request: Request): Promise<
  | {
      eventId: string;
      ticketKey: string;
      authToken: string;
    }
  | NextResponse
> {
  const { eventId, ticketKey } = await request.json();
  const authToken = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");

  if (!eventId || !ticketKey) {
    return NextResponse.json(
      { error: "Event ID and ticket key are required" },
      { status: 400 }
    );
  }

  if (!authToken) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    );
  }

  return { eventId, ticketKey, authToken };
}

// Fetch and store initial guest data
export async function fetchAndStoreGuests(
  authToken: string,
  eventId: string,
  ticketKey: string
) {
  const guests = await new LumaEventService(authToken).getAllGuests(
    eventId,
    ticketKey
  );
  await DB_LUMA_LINKEDIN_MUTATIONS.upsertLumaUsers(guests);
  return guests;
}

// Get stored LinkedIn data
export async function getStoredLinkedInData(guestIds: string[]) {
  return await DB_LUMA_LINKEDIN_QUERIES.getLumaLinkedinUsersByLumaUserIds(
    guestIds
  );
}

// Filter users that need LinkedIn scraping
export function getUsersToScrape(users: Tables<"luma_linkedin_users">[]) {
  return users.filter(
    (user) =>
      !user.linkedin_json_data &&
      !user.scraped &&
      user.linkedin_profile_url &&
      !user.scraped_failed
  );
}

// Process LinkedIn scraping results
export function processScrapingResults(
  usersToScrape: Tables<"luma_linkedin_users">[],
  scrapeResult: LinkedinProfileScrapeResult
): Tables<"luma_linkedin_users">[] {
  const successfulUsers = usersToScrape
    .filter((user) =>
      scrapeResult.success.some((s) => s.entry === user.linkedin_profile_url)
    )
    .map((user) => ({
      ...user,
      linkedin_json_data: scrapeResult.success.find(
        (s) => s.entry === user.linkedin_profile_url
      )?.data as Json,
      scraped: true,
      updated_at: new Date().toISOString(),
    }));

  const failedUsers = usersToScrape
    .filter((user) =>
      scrapeResult.failure.some((f) => f.entry === user.linkedin_profile_url)
    )
    .map((user) => ({
      ...user,
      scraped: true,
      scraped_failed: true,
      updated_at: new Date().toISOString(),
    }));

  return [...successfulUsers, ...failedUsers];
}

// Combine guest data with LinkedIn data
export function combineGuestData(
  guests: LumaGuest[],
  linkedInUsers: Tables<"luma_linkedin_users">[]
) {
  return guests.map((guest) => ({
    ...guest,
    ...linkedInUsers.find(
      (user) => user.luma_linkedin_user_id === guest.api_id
    ),
  }));
}
