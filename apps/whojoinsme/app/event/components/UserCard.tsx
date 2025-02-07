import Image from "next/image";
import { Tables } from "@/database.types";
import { LumaGuest } from "@/lib/Luma";
import { BsLinkedin } from "react-icons/bs";
import { HiExternalLink } from "react-icons/hi";
import { RiMagicFill } from "react-icons/ri";
import { useState } from "react";

type LinkedInData = {
  profilePic?: string;
  about?: string;
  experiences?: Array<{
    title: string;
    subtitle: string;
  }>;
};

type AISummaryResponse = {
  text?: string;
  summary?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export default function UserCard({
  user,
}: {
  user: LumaGuest & Tables<"luma_linkedin_users">;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateAiSummary = async () => {
    if (!user.linkedin_json_data || isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/luma/guests/ai_summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinData: user.linkedin_json_data }),
      });

      if (!response.ok) throw new Error("Failed to generate summary");

      const fullResponse = await response.json();

      await fetch("/api/luma/guests/update_summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.luma_linkedin_user_id,
          aiResult: fullResponse,
        }),
      });

      // Extract summary from the full response and remove quotes
      const summaryText = (
        fullResponse.text ||
        fullResponse.summary ||
        fullResponse.choices?.[0]?.message?.content ||
        ""
      ).replace(/^['"']|['"']$/g, "");

      // Add generation date to the summary
      const currentDate = new Date().toLocaleDateString("en-GB");
      const summaryWithDate = `${summaryText} (~${currentDate})`;

      // Store the summary with date in the user's ai_summary field
      user.ai_summary = summaryWithDate;
      // Automatically expand the summary after generation
      setIsExpanded(true);
    } catch (error) {
      console.error("Error generating AI summary:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const lumaProfilePic = user.avatar_url;
  const linkedinProfilePic = (user.linkedin_json_data as LinkedInData)
    ?.profilePic;
  const UserAvatar = linkedinProfilePic ? (
    <Image
      src={linkedinProfilePic}
      width={56}
      height={56}
      alt={user.name}
      className="aspect-square h-auto w-full rounded-full object-cover"
    />
  ) : lumaProfilePic ? (
    <Image
      src={lumaProfilePic}
      width={56}
      height={56}
      alt={user.name}
      className="aspect-square h-auto w-full rounded-full object-cover"
    />
  ) : (
    <div className="aspect-square h-auto w-full rounded-full bg-gray-200 object-cover"></div>
  );

  return (
    <div key={user.luma_linkedin_user_id} className="px-4">
      <div className="flex gap-4">
        <div className="h-14 w-14 flex-shrink-0">{UserAvatar}</div>
        <div className="flex flex-grow flex-col">
          <div className="flex items-center gap-2">
            <span className="font-medium">{user.name}</span>
            {user.linkedin_handle && (
              <a
                href={`https://linkedin.com${user.linkedin_handle}`}
                target="_blank"
                title="View LinkedIn Profile"
              >
                <BsLinkedin className="h-4 w-4" />
              </a>
            )}
            {user.website && (
              <a href={user.website} target="_blank" title="Visit Website">
                <HiExternalLink className="h-4 w-4" />
              </a>
            )}
            {user.linkedin_json_data && (
              <button
                onClick={() => {
                  if (user.ai_summary) {
                    setIsExpanded(!isExpanded);
                  } else {
                    generateAiSummary();
                  }
                }}
                disabled={isGenerating}
                className="transition-opacity hover:opacity-80"
                title={
                  user.ai_summary
                    ? isExpanded
                      ? "Hide AI Summary"
                      : "View AI Summary"
                    : "Generate AI Summary"
                }
              >
                {isGenerating ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                ) : (
                  <RiMagicFill
                    className={`h-4 w-4 ${user.ai_summary ? "text-blue-500" : "text-gray-400"}`}
                  />
                )}
              </button>
            )}
          </div>
          {(user.linkedin_json_data as any)?.experiences?.[0] && (
            <div className="text-sm text-gray-400">
              {(user.linkedin_json_data as any).experiences[0].title} at{" "}
              {
                (user.linkedin_json_data as any).experiences[0].subtitle.split(
                  " · "
                )[0]
              }
            </div>
          )}
          {user.ai_summary && (
            <div className="mt-2">
              <div
                className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0"}`}
              >
                <div className="rounded-md bg-blue-50 p-2 text-sm text-gray-600">
                  {typeof user.ai_summary === "string"
                    ? user.ai_summary
                    : (user.ai_summary as AISummaryResponse).text ||
                      (user.ai_summary as AISummaryResponse).summary ||
                      (user.ai_summary as AISummaryResponse).choices?.[0]
                        ?.message?.content ||
                      ""}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
