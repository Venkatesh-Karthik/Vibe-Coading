"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="feature-card group cursor-pointer"
    >
      {/* Icon Container */}
      <div className="relative mb-4 inline-flex">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
        <div className="relative p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed">
        {description}
      </p>

      {/* Hover indicator */}
      <div className="mt-4 flex items-center text-xs font-medium text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Learn more</span>
        <motion.span
          className="ml-1"
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
        >
          →
        </motion.span>
      </div>
    </motion.div>
  );
}
