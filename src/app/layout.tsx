import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../lib/Navbar";
import ClientProviders from "../lib/ClientProviders";

// Page metadata for SEO and sharing
export const metadata: Metadata = {
  title: "TripMosaic+",
  description: "Plan. Travel. Relive. — Curate trips, split expenses, and relive memories together.",
  keywords: ["Travel Planner", "Trip Organizer", "Expense Splitter", "TripMosaic+"],
  authors: [{ name: "B Venkatesh Karthik" }],
  openGraph: {
    title: "TripMosaic+",
    description: "Your collaborative trip planner and memory wall.",
    url: "http://localhost:3000",
    siteName: "TripMosaic+",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <ClientProviders>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
