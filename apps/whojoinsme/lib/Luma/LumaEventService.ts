import {
  LumaEvent,
  GetLumaGuestsResponse,
  LumaGuest,
  GetLumaUserEventsResponse,
  LumaEventPageData,
  Period,
} from "./Types";
import { LUMA_API, DEFAULT_HEADERS } from "./Constants";

export class LumaEventService {
  constructor(private authToken: string) {}

  async getEvent(eventUrl: string): Promise<LumaEvent> {
    const res = await fetch(eventUrl, {
      headers: {
        Cookie: `luma.auth-session-key=${this.authToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Non-ok response: status ${res.status}`);
    }

    const rawPage = await res.text();
    const eventData = this.parseEventData(rawPage);
    return this.mapToLumaEvent(eventData);
  }

  async getGuests(
    eventId: string,
    ticketKey: string,
    paginationCursor?: string | null
  ): Promise<GetLumaGuestsResponse> {
    const url = this.buildGuestsUrl(eventId, ticketKey, paginationCursor);
    const res = await fetch(url, {
      headers: {
        ...DEFAULT_HEADERS,
        "x-luma-web-url": `${LUMA_API.WEB_URL}/event?tk=${ticketKey}`,
        Cookie: `luma.auth-session-key=${this.authToken}`,
      },
      referrer: LUMA_API.WEB_URL,
      referrerPolicy: "strict-origin-when-cross-origin",
      method: "GET",
      mode: "cors",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Non-ok response: status ${res.status}`);
    }

    return res.json();
  }

  async getAllGuests(eventId: string, ticketKey: string): Promise<LumaGuest[]> {
    let hasMore = true;
    let cursor: string | null = null;
    const guests: LumaGuest[] = [];
    while (hasMore) {
      const data = await this.getGuests(eventId, ticketKey, cursor);
      guests.push(...data.entries);
      cursor = data.next_cursor;
      hasMore = data.has_more;
    }
    return guests;
  }

  private parseEventData(rawPage: string): LumaEventPageData {
    const scriptMatch = rawPage.match(
      /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/
    );

    if (!scriptMatch) {
      throw new Error("Failed to find JSON script element in response");
    }

    return JSON.parse(scriptMatch[1]);
  }

  private mapToLumaEvent(content: LumaEventPageData): LumaEvent {
    const { data } = content.props.pageProps.initialData;
    const eventData = data.event;

    if (!data.api_id || !data.guest_data.ticket_key) {
      throw new Error("Failed to find eventId or ticketKey in response");
    }

    return {
      eventId: data.api_id,
      ticketKey: data.guest_data.ticket_key,
      eventName: eventData.name,
      coverImageUrl: eventData.cover_url,
    };
  }

  private buildGuestsUrl(
    eventId: string,
    ticketKey: string,
    paginationCursor?: string | null
  ): string {
    const baseUrl = `${LUMA_API.BASE_URL}/event/get-guest-list`;
    const params = new URLSearchParams({
      event_api_id: eventId,
      ticket_key: ticketKey,
      pagination_limit: "100",
    });

    if (paginationCursor) {
      params.append("pagination_cursor", paginationCursor);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  async getUserEvents(
    period: Period = "upcoming",
    limit: number = 25
  ): Promise<GetLumaUserEventsResponse> {
    const res = await fetch(
      `https://api.lu.ma/home/get-events?period=${period}&pagination_limit=${limit}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en",
          "content-type": "application/json",
          priority: "u=1, i",
          "x-luma-client-type": "luma-web",
          "x-luma-web-url": "https://lu.ma/home",
          Cookie: `luma.auth-session-key=${this.authToken}`,
        },
        referrer: "https://lu.ma/",
        referrerPolicy: "strict-origin-when-cross-origin",
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch user events: ${res.status}`);
    }

    return await res.json();
  }
}
