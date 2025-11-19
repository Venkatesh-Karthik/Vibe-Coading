"use client";

import Image from "next/image";

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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Explore <span className="text-sky-600">Destinations</span>
        </h1>
        <p className="text-slate-600 mb-12">
          Discover the world’s most beautiful places curated by fellow travelers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="group relative bg-white/40 backdrop-blur-lg rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <Image
                src={dest.image}
                alt={dest.name}
                width={500}
                height={300}
                className="object-cover w-full h-64 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
              <div className="absolute bottom-5 left-0 right-0 px-6 text-left text-white">
                <h2 className="text-xl font-semibold mb-1">{dest.name}</h2>
                <p className="text-sm text-slate-200 mb-3">{dest.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {dest.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs hover:bg-white/30 transition"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
