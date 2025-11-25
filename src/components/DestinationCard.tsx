"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface DestinationCardProps {
  name: string;
  code: string;
  image: string;
  desc: string;
  tags: string[];
  delay?: number;
}

export default function DestinationCard({
  name,
  code,
  image,
  desc,
  tags,
  delay = 0,
}: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="group relative glass-panel overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
        
        {/* Country Code Badge */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
          {code}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        {/* Destination Name */}
        <h3 className="text-xl font-bold mb-1 group-hover:text-sky-300 transition-colors">
          {name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-white/80 mb-3 line-clamp-2">
          {desc}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + i * 0.1 }}
              className="pill text-white"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/30 transition-colors pointer-events-none" />
    </motion.div>
  );
}
