# whojoins.me

## Project Overview

Whojoins.me is a Next.js application that helps analyze Luma event attendees by integrating LinkedIn profile data. The main goal is to analyze Luma event attendees and get insights about event's participants.

## Features

- 🔐 Secure authentication with Luma
- 📊 View and analyze event attendees
- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Built with Next.js 15 and React 19

## Architecture

WHOJOINSME/
├── .git/
├── .husky/
├── .next/
├── .vscode/
├── app/
│ ├── api/
│ ├── dashboard/
│ │ ├── components/
│ │ │ ├── EventCard.tsx
│ │ │ ├── EventTabBar.tsx
│ │ │ └── page.tsx
│ │ └── event/
│ │ ├── components/
│ │ │ ├── UserCard.tsx
│ │ │ ├── UserCardList.tsx
│ │ │ └── page.tsx
│ └── login/
│ └── page.tsx
├── components/
│ ├── animated/
│ ├── icons/
│ ├── Input.tsx
│ ├── Logo.tsx
│ ├── SearchBar.tsx
│ └── TallyButton.tsx
├── lib/
│ ├── Api/
│ │ ├── index.ts
│ │ ├── LumaAuthApiService.ts
│ │ └── LumaEventApiService.ts
│ ├── Linkedin/
│ │ ├── index.ts
│ │ ├── LinkedinScraperService.ts
│ │ └── Types.ts
│ ├── Luma/
│ │ ├── Constants.ts
│ │ ├── index.ts
│ │ ├── LumaAuthService.ts
│ │ ├── LumaEventService.ts
│ │ └── Types.ts
│ └── Supabase/
│ ├── index.ts
│ ├── SupabaseBaseService.ts
│ ├── SupabaseLumaService.ts
│ └── SupabaseUsersService.ts
├── node_modules/
├── public/
│ └── favicons/
├── favicon.ico
├── globals.css
├── layout.tsx
├── query-provider.tsx
├── .env
├── .gitignore
├── .prettierrc
├── database.types.ts
├── eslint.config.mjs
├── instructions.md
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
...

## Core Components

1. **Frontend Layer**

   - Next.js 15 application with React 19
   - TailwindCSS for styling
   - React Query for data fetching

2. **Backend Services**
   - Supabase for data storage
   - Luma API integration
   - LinkedIn scraping service

## Database Schema

Key tables in Supabase:

```30:59:database.types.ts
      guests: {
        Row: {
          created_at: string;
          has_search_result: boolean;
          id: string;
          linkedin_data: Json | null;
          linkedin_is_private: boolean | null;
          luma_guest_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          has_search_result?: boolean;
          id?: string;
          linkedin_data?: Json | null;
          linkedin_is_private?: boolean | null;
          luma_guest_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          has_search_result?: boolean;
          id?: string;
          linkedin_data?: Json | null;
          linkedin_is_private?: boolean | null;
          luma_guest_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
```

## Implementation Steps

### 1. Event Participant Flow

### a. Fetch Event Guests

The event page fetches guests using:

```43:58:app/event/page.tsx
  const guestsQuery = useQuery({
    queryKey: [
      "guests",
      eventQuery.data?.eventId,
      eventQuery.data?.ticketKey,
      authToken,
    ],
    queryFn: async () => {
      const lumaApi = new LumaEventApiService(authToken!);
      return lumaApi.getEventGuests(
        eventQuery.data!.eventId,
        eventQuery.data!.ticketKey
      );
    },
    enabled: !!eventQuery.data?.eventId && !!eventQuery.data?.ticketKey,
  });
```

#### b. Display Guest Cards

Guest information is rendered using:

```4:49:app/event/components/UserCard.tsx
export default function UserCard({ user }: { user: LumaGuest }) {
  const UserAvatar = user.avatar_url ? (
    <Image
      src={user.avatar_url}
      width={56}
      height={56}
      alt={user.name}
      className="aspect-square h-auto w-full rounded-full object-cover"
    />
  ) : (
    <div className="aspect-square h-auto w-full rounded-full bg-gray-200 object-cover"></div>
  );

  return (
    <div key={user.api_id} className="px-4">
      <div className="flex gap-4">
        <div className="h-14 w-14">{UserAvatar}</div>
        <div className="flex flex-col">
          <div className="font-medium">{user.name}</div>
          <div className="flex gap-3">
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Website
              </a>
            )}
            {user.linkedin_handle && (
              <a
                href={`https://linkedin.com${user.linkedin_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2. LinkedIn Integration

#### a. LinkedIn Scraper Service

The LinkedIn scraper handles profile data collection:

```56:79:lib/Linkedin/LinkedinScraperService.ts
  async scrapeProfiles(links: string[]) {
    links = links.filter((link) => link !== "");
    // Add https://www.linkedin.com/in/ to the beginning of each link if it's not already there
    links = links.map((link) =>
      link.startsWith("https://www.linkedin.com/")
        ? link
        : `https://www.linkedin.com/${link}`
    );

    const success = [] as LinkedinProfileScrapeSuccess[];
    const failure = [] as LinkedinProfileScrapeFailure[];

    for (let i = 0; i < links.length; i += BATCH_SIZE) {
      const batchLinks = links.slice(i, i + BATCH_SIZE);
      const result = await QUERIES.scrapeBatch(batchLinks);
      success.push(...result.success);
      failure.push(...result.failure);
    }

    return {
      success,
      failure,
    };
  },
```

#### b. LinkedIn Data Types

Important LinkedIn data structures:

```6:42:lib/Linkedin/Types.ts
export type LinkedinProfileScrapeSuccess = {
  entry: string;
  data: {
    urn: string;
    about: string;
    promos: any[];
    skills: LinkedinSkill[];
    courses: any[];
    patents: any[];
    updates: any[];
    fullName: string;
    headline: string;
    lastName: string;
    projects: any[];
    firstName: string;
    followers: number;
    languages: any[];
    educations: LinkedinEducation[];
    highlights: any[];
    testScores: any[];
    connections: number;
    experiences: LinkedinExperience[];
    publications: any[];
    emailRequired: boolean;
    organizations: any[];
    verifications: any[];
    openConnection: boolean;
    honorsAndAwards: any[];
    volunteerCauses: any[];
    publicIdentifier: string;
    addressWithCountry: string;
    volunteerAndAwards: LinkedinVolunteerAward[];
    addressWithoutCountry: string;
    licenseAndCertificates: LinkedinCertificate[];
    profilePicAllDimensions: any[];
  };
};
```

### 3. Implementation Tasks

1. **Update UserCard Component**

   - Modify to display LinkedIn data
   - Add LinkedIn profile section
   - Include professional summary

2. **Add LinkedIn Data Fetching**

   - Implement LinkedIn profile caching
   - Add error handling for rate limits
   - Handle private profiles

3. **Database Updates**
   - Store LinkedIn profile data
   - Link Luma users with LinkedIn profiles
   - Implement data refresh mechanism
