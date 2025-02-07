import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { ReactQueryProvider } from "./query-provider";

import "./globals.css";

const mPlusRounded1c = M_PLUS_Rounded_1c({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "whojoins.me",
  description: "See who joins your Luma events",
  openGraph: {
    type: "website",
    title: "whojoins.me",
    description: "See who joins your Luma events",
    siteName: "whojoins.me",
    images: [
      {
        url: "/favicons/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "whojoins.me logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "whojoins.me",
    description: "See who joins your Luma events",
    images: ["/favicons/android-chrome-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://tally.so/widgets/embed.js"></script>
      </head>
      <body className={mPlusRounded1c.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
