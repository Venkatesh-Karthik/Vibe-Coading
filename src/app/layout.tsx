import "../globals.css";
import type { Metadata } from "next";
import ClientProviders from "../lib/ClientProviders";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "TripMosaic+",
  description: "Plan. Travel. Relive. Group trips made simple.",
  keywords: ["travel", "trip planner", "group travel", "itinerary", "expenses", "memories"],
  authors: [{ name: "TripMosaic+ Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-slate-50">
        <ClientProviders>
          <Navbar />
          <main>{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
