"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, MapPin, CreditCard, Users, Camera } from "lucide-react";

export type TabType = "overview" | "planner" | "expenses" | "members" | "memories";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "overview" as TabType, label: "Overview", icon: LayoutDashboard },
  { id: "planner" as TabType, label: "Planner", icon: MapPin },
  { id: "expenses" as TabType, label: "Expenses", icon: CreditCard },
  { id: "members" as TabType, label: "Members", icon: Users },
  { id: "memories" as TabType, label: "Memories", icon: Camera },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass-panel p-2 mb-6 overflow-x-auto"
    >
      <div className="flex gap-2 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
