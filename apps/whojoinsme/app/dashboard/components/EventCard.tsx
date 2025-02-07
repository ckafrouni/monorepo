import Image from "next/image";
import { LumaUserEvent } from "@/lib/Luma";
import { IoIosGlobe } from "react-icons/io";

export default function EventCard({
  event,
  index,
}: {
  event: LumaUserEvent;
  index: number;
}) {
  const canViewGuests =
    event.role?.approval_status === "approved" && event.event.show_guest_list;
  const lumaUrl = `https://lu.ma/${event.event.url}`;
  const guestListUrl = `/event?url=${encodeURIComponent(lumaUrl)}`;

  const truncateTitle = (title: string, maxLength: number = 35) => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  const formattedDate = new Date(event.event.start_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const getGuestListStatus = () => {
    const isPast = new Date(event.event.end_at) < new Date();
    if (event.role?.approval_status === "waitlist") {
      return isPast ? "You were on the waitlist" : "You're on the waitlist";
    }
    if (!event.event.show_guest_list) {
      return isPast ? "Guest list was hidden" : "Guest list is hidden";
    }
    return null;
  };

  return (
    <div
      className={`rounded-xl bg-[#585858] p-4 ${
        canViewGuests ? "opacity-100" : "opacity-50"
      }`}
    >
      <div
        className={`relative flex gap-4 ${
          canViewGuests ? "cursor-pointer hover:opacity-90" : ""
        }`}
        onClick={
          canViewGuests
            ? () => (window.location.href = guestListUrl)
            : undefined
        }
      >
        {event.event.cover_url && (
          <div className="h-32 w-32 flex-shrink-0">
            <Image
              src={event.event.cover_url}
              alt={event.event.name}
              width={128}
              height={128}
              priority={index < 3}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        )}
        <div className="relative flex flex-grow flex-col justify-between">
          <div>
            <h2 className="pr-6 text-xl font-medium" title={event.event.name}>
              {truncateTitle(event.event.name)}
            </h2>
            <p className="mt-1 text-sm text-gray-300">{formattedDate}</p>
          </div>
          {!canViewGuests && (
            <p className="mt-2 text-sm text-gray-400">{getGuestListStatus()}</p>
          )}
          <a
            href={lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-0 top-1 p-1 text-gray-400 transition-colors hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <IoIosGlobe />
          </a>
        </div>
      </div>
    </div>
  );
}
