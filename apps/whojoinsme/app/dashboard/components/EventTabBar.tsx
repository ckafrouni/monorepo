import { Period } from "@/lib/Luma/Types";

export default function EventTabBar({
  activeTab,
  numberOfEvents,
  updateTab,
}: {
  activeTab: Period;
  numberOfEvents: number;
  updateTab: (tab: Period) => void;
}) {
  return (
    <div className="sticky top-0 z-10">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      <div className="relative px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => updateTab("upcoming")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              activeTab === "upcoming"
                ? "bg-white text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => updateTab("past")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              activeTab === "past"
                ? "bg-white text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Past Events
          </button>
          <p className="ml-auto text-sm text-gray-400">
            {numberOfEvents} Events
          </p>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
    </div>
  );
}
