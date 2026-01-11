"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, TrendingUp, DollarSign, PieChart } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Footer from "@/components/Footer";
import { mockExpenses, getTripById, mockUsers } from "@/utils/mockData";

const categoryColors: Record<string, string> = {
  travel: "#3b82f6",
  stay: "#10b981",
  food: "#f59e0b",
  activities: "#8b5cf6",
  shopping: "#ec4899",
  other: "#6b7280",
};

export default function BudgetPage() {
  const params = useParams<{ id: string }>();
  const tripId = params?.id;
  const trip = tripId ? getTripById(tripId) : null;

  const [expenses] = useState(mockExpenses);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel p-8">
          <p className="text-slate-600">Trip not found</p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = trip.budget;
  const remaining = totalBudget - totalSpent;
  const percentSpent = Math.min((totalSpent / totalBudget) * 100, 100);

  // Group by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Calculate who owes whom
  const balances: Record<string, number> = {};
  expenses.forEach((expense) => {
    const perPerson = expense.amount / expense.splitBetween.length;
    // Person who paid is owed
    balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
    // People who share the expense owe
    expense.splitBetween.forEach((person) => {
      balances[person] = (balances[person] || 0) - perPerson;
    });
  });

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="gradient-text">Budget Manager</span>
                </h1>
                <p className="text-slate-600">Track expenses and settle up</p>
              </div>
              <Link href={`/trip/${tripId}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-sm"
                >
                  Back to Trip
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Budget Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Budget Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-sky-500" />
                Budget Overview
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Total Budget</span>
                    <span className="text-lg font-bold text-slate-900">₹{totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Total Spent</span>
                    <span className="text-lg font-bold text-emerald-600">₹{totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm text-slate-600">Remaining</span>
                    <span className={`text-lg font-bold ${remaining >= 0 ? "text-sky-600" : "text-red-600"}`}>
                      ₹{remaining.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-4 bg-white/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentSpent}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${
                        percentSpent > 90 ? "bg-red-500" : percentSpent > 70 ? "bg-amber-500" : "bg-gradient-to-r from-sky-500 to-emerald-500"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 text-center">
                    {percentSpent.toFixed(1)}% of budget used
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-sky-500" />
                Spending by Category
              </h2>

              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.name.toLowerCase()] || "#6b7280"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {chartData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[entry.name.toLowerCase()] }}
                    />
                    <span className="text-slate-700">{entry.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Add Expense Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full glass-panel p-6 flex items-center justify-center gap-3 hover:bg-white/60 transition mb-8"
          >
            <Plus className="h-5 w-5 text-sky-500" />
            <span className="font-medium text-slate-700">Add New Expense</span>
          </motion.button>

          {/* Expenses List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>

            <div className="space-y-3">
              {expenses.map((expense, index) => {
                const paidByUser = mockUsers.find(u => u.id === expense.paidBy);
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/60 hover:bg-white/80 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-slate-900">{expense.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-slate-700 capitalize">
                          {expense.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{expense.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                        <span>Paid by: {paidByUser?.name || "Unknown"}</span>
                        <span>•</span>
                        <span>{expense.date}</span>
                        <span>•</span>
                        <span>Split among {expense.splitBetween.length} people</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-slate-900">
                        ₹{expense.amount.toLocaleString()}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-xs px-2 py-1 rounded bg-white/60 hover:bg-white/80 text-slate-700"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-xs px-2 py-1 rounded hover:bg-red-50 text-red-600"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Balance Settlement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-panel p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-500" />
              Settlement Summary
            </h2>

            <div className="space-y-3">
              {Object.entries(balances).map(([userId, balance]) => {
                const user = mockUsers.find(u => u.id === userId);
                if (Math.abs(balance) < 1) return null;
                
                return (
                  <div
                    key={userId}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-200 to-emerald-200 flex items-center justify-center text-sm font-bold text-slate-700">
                        {user?.name[0] || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user?.name || "User"}</div>
                        <div className="text-xs text-slate-600">
                          {balance > 0 ? "Gets back" : "Owes"}
                        </div>
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${balance > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {balance > 0 ? "+" : ""}₹{Math.abs(balance).toFixed(0)}
                    </div>
                  </div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 btn-primary"
            >
              Settle Up
            </motion.button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
