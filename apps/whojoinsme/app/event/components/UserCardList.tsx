import { LumaGuest } from "@/lib/Luma";
import UserCard from "./UserCard";
import { Tables } from "@/database.types";

export default function UserCardList({
  guests,
}: {
  guests: (LumaGuest & Tables<"luma_linkedin_users">)[];
}) {
  // Sort guests to prioritize those with LinkedIn data
  const sortedGuests = [...guests].sort((a, b) => {
    if (a.linkedin_json_data && !b.linkedin_json_data) return -1;
    if (!a.linkedin_json_data && b.linkedin_json_data) return 1;
    return 0;
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedGuests.length > 0 &&
        sortedGuests.map((guest) => (
          <div key={guest.api_id}>
            <UserCard user={guest} />
          </div>
        ))}
    </div>
  );
}
