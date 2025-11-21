"use client";

import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";

const destinations = [
  {
    id: 1,
    name: "Paris, France 🇫🇷",
    image: "/images/paris.jpg",
    desc: "A romantic escape through art and architecture.",
    tags: ["Romantic", "Culture", "Luxury"],
  },
  {
    id: 2,
    name: "Kyoto, Japan 🇯🇵",
    image: "/images/kyoto.jpg",
    desc: "Peaceful temples and vibrant cherry blossoms.",
    tags: ["Tradition", "Nature", "Culture"],
  },
  {
    id: 3,
    name: "Bali, Indonesia 🇮🇩",
    image: "/images/bali.jpg",
    desc: "Tropical paradise of beaches and temples.",
    tags: ["Beach", "Adventure", "Relax"],
  },
  {
    id: 4,
    name: "New York, USA 🇺🇸",
    image: "/images/newyork.jpg",
    desc: "The city that never sleeps.",
    tags: ["Urban", "Nightlife", "Shopping"],
  },
  {
    id: 5,
    name: "Santorini, Greece 🇬🇷",
    image: "/images/santorini.jpg",
    desc: "Sunsets, white houses, and blue domes.",
    tags: ["Luxury", "Romantic", "Sea"],
  },
  {
    id: 6,
    name: "Swiss Alps, Switzerland 🇨🇭",
    image: "/images/alps.jpg",
    desc: "Snow-capped peaks and scenic trails.",
    tags: ["Adventure", "Nature", "Hiking"],
  },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">Destinations</span>
          </h1>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
            Discover the world's most beautiful places curated by fellow travelers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {destinations.map((dest, idx) => (
              <DestinationCard
                key={dest.id}
                name={dest.name}
                image={dest.image}
                desc={dest.desc}
                tags={dest.tags}
                index={idx}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
