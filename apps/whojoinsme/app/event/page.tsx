"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { LumaEventApiService } from "@/lib/Api";
import UserCardList from "./components/UserCardList";
import TallyButton from "@/components/TallyButton";
import PremiumButton from "@/components/PremiumButton";
import Spinner from "@/components/Spinner";

function EventPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventUrl = searchParams.get("url");

  useEffect(() => {
    const authToken = localStorage.getItem("lumaAuthToken");
    if (!authToken) {
      router.push("/login");
      return;
    }

    if (!eventUrl) {
      router.push("/");
      return;
    }
  }, [eventUrl, router]);

  const authToken =
    typeof window !== "undefined"
      ? localStorage.getItem("lumaAuthToken")
      : null;

  const eventQuery = useQuery({
    queryKey: ["event", eventUrl, authToken],
    queryFn: async () => {
      const lumaApi = new LumaEventApiService(authToken!);
      return lumaApi.getEventByUrl(eventUrl!);
    },
    enabled: !!authToken && !!eventUrl,
  });

  const guestsQuery = useQuery({
    queryKey: [
      "guests",
      eventQuery.data?.eventId,
      eventQuery.data?.ticketKey,
      authToken,
    ],
    queryFn: async () => {
      const lumaApi = new LumaEventApiService(authToken!);
      const guests = await lumaApi.getEventGuests(
        eventQuery.data!.eventId,
        eventQuery.data!.ticketKey
      );
      return guests;
    },
    enabled: !!eventQuery.data?.eventId && !!eventQuery.data?.ticketKey,
  });

  if (eventQuery.error || guestsQuery.error) {
    return (
      <div className="min-h-dvh p-4">
        <div className="text-red-500">
          {((eventQuery.error || guestsQuery.error) as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <div className="sticky top-0 z-10">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
        <div className="relative px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm transition-colors hover:bg-white/20"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
            <div className="flex min-w-0 flex-1 flex-col">
              <h1 className="truncate text-xl font-medium">
                {eventQuery.data?.eventName}
              </h1>
              <p className="text-sm text-gray-400">
                {guestsQuery.data?.length || 0} Members
              </p>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      </div>

      {guestsQuery.isPending ? (
        <div className="mt-8 text-center">
          <Spinner message="Loading guests..." />
        </div>
      ) : (
        <UserCardList guests={guestsQuery.data || []} />
      )}
      <TallyButton />
      <PremiumButton />
    </div>
  );
}

export default function EventPage() {
  return (
    <Suspense fallback={<Spinner message="Loading event details..." />}>
      <EventPageContent />
    </Suspense>
  );
}
