import { Tables } from "@/database.types";
import type {
  LumaEvent,
  LumaGuest,
  GetLumaUserEventsResponse,
  Period,
} from "@/lib/Luma";

export class LumaEventApiService {
  private authToken: string;

  constructor(authToken: string) {
    this.authToken = authToken;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }
    return response.json();
  }

  async getEventByUrl(eventUrl: string): Promise<LumaEvent> {
    const response = await fetch(
      `/api/luma/events?url=${encodeURIComponent(eventUrl)}`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse<LumaEvent>(response);
  }

  async getEventGuests(eventId: string, ticketKey: string) {
    const response = await fetch(`/api/luma/guests`, {
      method: "POST",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId,
        ticketKey,
      }),
    });
    return this.handleResponse<(LumaGuest & Tables<"luma_linkedin_users">)[]>(
      response
    );
  }
  async getUserEvents(
    period: Period = "upcoming",
    limit: number = 25
  ): Promise<GetLumaUserEventsResponse> {
    const response = await fetch(
      `/api/luma/events?period=${period}&limit=${limit}`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse<GetLumaUserEventsResponse>(response);
  }
}
