"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueries } from "@tanstack/react-query";

import { LumaEventApiService } from "@/lib/Api";
import { Period } from "@/lib/Luma/Types";
import EventCard from "./components/EventCard";
import EventTabBar from "./components/EventTabBar";
import TallyButton from "@/components/TallyButton";
import PremiumButton from "@/components/PremiumButton";
import Spinner from "@/components/Spinner";

function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Period>(
    (searchParams.get("tab") as Period) || "upcoming"
  );

  useEffect(() => {
    const authToken = localStorage.getItem("lumaAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, [router]);

  let authToken;
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("lumaAuthToken");
  }

  const [upcomingEventsQuery, pastEventsQuery] = useQueries({
    queries: [
      {
        queryKey: ["events", "upcoming", authToken],
        queryFn: async () => {
          const lumaApi = new LumaEventApiService(authToken!);
          const data = await lumaApi.getUserEvents("upcoming", 25);
          return data.entries;
        },
        enabled: !!authToken,
      },
      {
        queryKey: ["events", "past", authToken],
        queryFn: async () => {
          const lumaApi = new LumaEventApiService(authToken!);
          const data = await lumaApi.getUserEvents("past", 25);
          return data.entries;
        },
        enabled: !!authToken,
      },
    ],
  });

  const events =
    activeTab === "upcoming"
      ? (upcomingEventsQuery.data ?? [])
      : (pastEventsQuery.data ?? []);

  const isLoading = upcomingEventsQuery.isPending || pastEventsQuery.isPending;
  const error = upcomingEventsQuery.error || pastEventsQuery.error;

  const updateTab = (tab: Period) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-dvh">
      <EventTabBar
        activeTab={activeTab}
        numberOfEvents={events.length}
        updateTab={updateTab}
      />

      <div className="p-4">
        {isLoading ? (
          <div className="mb-8 text-center">
            <Spinner size="lg" message="Loading events..." />
          </div>
        ) : (
          <div className="p-4">
            {error && (
              <div className="mb-8 text-red-500">
                {(error as Error).message}
              </div>
            )}

            {events.length > 0 && (
              <div className="grid gap-6">
                {events.map((event, index) => (
                  <EventCard key={event.api_id} event={event} index={index} />
                ))}
              </div>
            )}

            {events.length === 0 && !error && (
              <div className="mt-8 text-center text-gray-500">
                No {activeTab === "upcoming" ? "upcoming" : "past"} events found
              </div>
            )}
          </div>
        )}
      </div>
      <TallyButton />
      <PremiumButton />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Spinner message="Loading content..." />}>
      <DashboardPage />
    </Suspense>
  );
}
