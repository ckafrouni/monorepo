"use client";

import { useState } from "react";

interface PremiumButtonProps {
  className?: string;
}

export default function PremiumButton({ className = "" }: PremiumButtonProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const featureDescriptions = {
    "Data Coverage": "Enriches data for attendees that haven't linked socials.",
    "Event Intel": "View other events' attendee data without joining.",
    "CRM Sync": "Push LinkedIn insights to Salesforce, HubSpot etc.",
    "Smart Search":
      'Example: "Find Senior Engineers with 3ys Rust Experience, based in Berlin"',
    "Auto Tags":
      "Label attendees by categories such as gender, industry, seniority etc.",
    "Profile Refresh": "One-click update of attendees' latest data.",
    "API Access": "Integrate attendee data via REST API.",
    "Export Data": "Download advanced attendee data in CSV/JSON formats.",
  };

  const handleTooltipClick = (feature: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveTooltip(activeTooltip === feature ? null : feature);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className={`fixed bottom-6 right-4 rounded-full bg-yellow-500 p-2 text-white shadow-lg transition-transform hover:scale-105 hover:bg-yellow-600 active:scale-95 ${className}`}
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </button>

      {isPopupOpen && (
        <div className="fixed bottom-20 right-6 w-80 rounded-lg bg-white p-6 shadow-xl">
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Upgrade to Premium
          </h3>
          <div className="mb-4">
            <div className="mb-2 text-2xl font-bold text-gray-900">
              €9
              <span className="text-base font-normal text-gray-600">
                /month
              </span>
            </div>
          </div>
          <ul className="mb-6 space-y-2 text-sm text-gray-600">
            {Object.entries(featureDescriptions).map(
              ([feature, description]) => (
                <li
                  key={feature}
                  className="group relative flex items-center gap-2"
                >
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex flex-1 items-center gap-2">
                    <span>{feature}</span>
                    <button
                      onClick={(e) => handleTooltipClick(feature, e)}
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      i
                    </button>
                    {activeTooltip === feature && (
                      <div className="absolute left-0 top-6 z-10 w-64 rounded-lg border border-gray-200 bg-white p-2 text-sm shadow-lg">
                        {description}
                      </div>
                    )}
                  </div>
                </li>
              )
            )}
          </ul>
          <button
            onClick={() => {
              window.location.href =
                "https://buy.stripe.com/9AQ28y1zVfNLgiQ000";
            }}
            className="w-full rounded-lg bg-yellow-500 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-yellow-600"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
}
