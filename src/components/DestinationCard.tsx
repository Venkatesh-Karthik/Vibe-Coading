"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface DestinationCardProps {
  name: string;
  image: string;
  desc: string;
  tags: string[];
  index?: number;
}

export default function DestinationCard({
  name,
  image,
  desc,
  tags,
  index = 0,
}: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white/40 backdrop-blur-lg rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
    >
      <Image
        src={image}
        alt={name}
        width={500}
        height={300}
        className="object-cover w-full h-64 transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
      <div className="absolute bottom-5 left-0 right-0 px-6 text-left text-white">
        <h2 className="text-xl font-semibold mb-1">{name}</h2>
        <p className="text-sm text-slate-200 mb-3">{desc}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs hover:bg-white/30 transition"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
