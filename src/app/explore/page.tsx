"use client";

import { motion } from "framer-motion";
import DestinationCard from "../../components/DestinationCard";
import Footer from "../../components/Footer";

const destinations = [
  {
    id: 1,
    name: "Paris, France",
    code: "FR",
    image: "/images/paris.jpg",
    desc: "A romantic escape through art and architecture.",
    tags: ["Romantic", "Culture", "Luxury"],
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    code: "JP",
    image: "/images/kyoto.jpg",
    desc: "Peaceful temples and vibrant cherry blossoms.",
    tags: ["Tradition", "Nature", "Culture"],
  },
  {
    id: 3,
    name: "Bali, Indonesia",
    code: "ID",
    image: "/images/bali.jpg",
    desc: "Tropical paradise of beaches and temples.",
    tags: ["Beach", "Adventure", "Relax"],
  },
  {
    id: 4,
    name: "New York, USA",
    code: "US",
    image: "/images/newyork.jpg",
    desc: "The city that never sleeps.",
    tags: ["Urban", "Nightlife", "Shopping"],
  },
  {
    id: 5,
    name: "Santorini, Greece",
    code: "GR",
    image: "/images/santorini.jpg",
    desc: "Sunsets, white houses, and blue domes.",
    tags: ["Luxury", "Romantic", "Sea"],
  },
  {
    id: 6,
    name: "Swiss Alps, Switzerland",
    code: "CH",
    image: "/images/alps.jpg",
    desc: "Snow-capped peaks and scenic trails.",
    tags: ["Adventure", "Nature", "Hiking"],
  },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col pt-24">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore{" "}
              <span className="gradient-text">Destinations</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover the world&apos;s most beautiful places curated by fellow travelers.
            </p>
          </motion.div>

          {/* Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {destinations.map((dest, index) => (
              <DestinationCard
                key={dest.id}
                name={dest.name}
                code={dest.code}
                image={dest.image}
                desc={dest.desc}
                tags={dest.tags}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Load More CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-slate-600 mb-4">
              Can&apos;t find your dream destination?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary"
            >
              Request a Destination
            </motion.button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
