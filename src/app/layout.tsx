import "../globals.css";
import type { Metadata } from "next";
import ClientProviders from "@/lib/ClientProviders";

export const metadata: Metadata = {
  title: "TripMosaic+ | Plan Perfect Group Trips",
  description: "A beautiful glassmorphism-styled group trip planner powered by Next.js, Firebase, and AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
