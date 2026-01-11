"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  CreditCard,
  Plus,
  DollarSign,
  Users,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface Expense {
  id: string;
  title: string;
  category: "Travel" | "Food" | "Stay" | "Activities";
  paidBy: string;
  amount: number;
  splitBetween: number;
  date: string;
}

interface Person {
  id: string;
  name: string;
  paid: number;
  owed: number;
}

interface Transfer {
  from: string;
  to: string;
  amount: number;
}

export default function CollaborativeExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "exp1",
      title: "Flight Tickets",
      category: "Travel",
      paidBy: "John",
      amount: 12000,
      splitBetween: 4,
      date: "Jan 10, 2026",
    },
    {
      id: "exp2",
      title: "Hotel Booking",
      category: "Stay",
      paidBy: "Sarah",
      amount: 8000,
      splitBetween: 4,
      date: "Jan 10, 2026",
    },
    {
      id: "exp3",
      title: "Dinner at Beach",
      category: "Food",
      paidBy: "Mike",
      amount: 2400,
      splitBetween: 4,
      date: "Jan 11, 2026",
    },
  ]);

  const [people] = useState<Person[]>([
    { id: "p1", name: "John", paid: 12000, owed: 5600 },
    { id: "p2", name: "Sarah", paid: 8000, owed: 5600 },
    { id: "p3", name: "Mike", paid: 2400, owed: 5600 },
    { id: "p4", name: "Emma", paid: 0, owed: 5600 },
  ]);

  const [transfers] = useState<Transfer[]>([
    { from: "Emma", to: "John", amount: 5600 },
    { from: "Mike", to: "John", amount: 800 },
    { from: "Sarah", to: "John", amount: 2400 },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const totalCost = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const numberOfPeople = people.length;
  const costPerPerson = totalCost / numberOfPeople;

  const getCategoryColor = (category: string) => {
    const colors = {
      Travel: "bg-sky-100 text-sky-700",
      Food: "bg-amber-100 text-amber-700",
      Stay: "bg-emerald-100 text-emerald-700",
      Activities: "bg-purple-100 text-purple-700",
    };
    return colors[category as keyof typeof colors] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 pt-24 px-4 pb-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Collaborative Expenses
          </h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Trip Cost</p>
              <p className="text-2xl font-bold text-slate-900">
                ₹{totalCost.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Number of People</p>
              <p className="text-2xl font-bold text-slate-900">{numberOfPeople}</p>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Cost Per Person</p>
              <p className="text-2xl font-bold text-slate-900">
                ₹{costPerPerson.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Two Column Layout */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Expenses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Expense History</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-sm font-semibold flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </motion.button>
          </div>

          {/* Add Expense Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-panel p-6 space-y-4"
            >
              <h3 className="font-bold text-slate-900">New Expense</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Expense title"
                  className="px-4 py-2 rounded-xl bg-white/60 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  className="px-4 py-2 rounded-xl bg-white/60 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                {["Travel", "Food", "Stay", "Activities"].map((cat) => (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${getCategoryColor(
                      cat
                    )} hover:opacity-80 transition-opacity`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold">
                  Add
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Expenses Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200/50">
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                      Expense
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                      Paid By
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                      Split
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-slate-600">
                      Amount
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-slate-600">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense, index) => (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-slate-200/30 hover:bg-white/40 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">
                              {expense.title}
                            </p>
                            <span
                              className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                expense.category
                              )}`}
                            >
                              {expense.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-700">
                        {expense.paidBy}
                      </td>
                      <td className="p-4 text-sm text-slate-700">
                        {expense.splitBetween} people
                      </td>
                      <td className="p-4 text-right">
                        <div>
                          <p className="font-bold text-slate-900">
                            ₹{expense.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            ₹{(expense.amount / expense.splitBetween).toFixed(0)}{" "}
                            each
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-right text-sm text-slate-600">
                        {expense.date}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right Panel - Balances & Settle Up */}
        <div className="lg:col-span-1 space-y-6">
          {/* Individual Balances */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h3 className="font-bold text-slate-900 mb-4">Individual Balances</h3>
            <div className="space-y-3">
              {people.map((person) => {
                const balance = person.paid - person.owed;
                return (
                  <div
                    key={person.id}
                    className="p-4 rounded-xl bg-white/60 space-y-2"
                  >
                    <p className="font-semibold text-slate-900">{person.name}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Paid:</span>
                      <span className="font-semibold text-emerald-600">
                        ₹{person.paid.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Owed:</span>
                      <span className="font-semibold text-slate-600">
                        ₹{person.owed.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200/50">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-700">Balance:</span>
                        <span
                          className={
                            balance >= 0 ? "text-emerald-600" : "text-rose-600"
                          }
                        >
                          {balance >= 0 ? "+" : ""}₹
                          {Math.abs(balance).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Settle Up */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6"
          >
            <h3 className="font-bold text-slate-900 mb-4">Settle Up</h3>
            <div className="space-y-3 mb-4">
              {transfers.map((transfer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-xl bg-white/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-slate-900">
                      {transfer.from}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-slate-900">
                      {transfer.to}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-600">
                    ₹{transfer.amount.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold"
            >
              Mark All as Settled
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
