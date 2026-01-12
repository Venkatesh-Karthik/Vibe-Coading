"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  Check,
  X,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Types
interface Expense {
  id: string;
  title: string;
  category: "Transport" | "Accommodation" | "Food" | "Activities" | "Shopping" | "Other";
  paidBy: string;
  amount: number;
  splitAmong: string[];
  date: string;
  settled: boolean;
}

interface Traveler {
  id: string;
  name: string;
}

// Mock data
const mockTravelers: Traveler[] = [
  { id: "user-1", name: "John Doe" },
  { id: "user-2", name: "Sarah Smith" },
  { id: "user-3", name: "Mike Johnson" },
  { id: "user-4", name: "Emma Wilson" },
];

const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    title: "Flight Tickets",
    category: "Transport",
    paidBy: "user-1",
    amount: 24000,
    splitAmong: ["user-1", "user-2", "user-3", "user-4"],
    date: "2024-03-10",
    settled: false,
  },
  {
    id: "exp-2",
    title: "Hotel Booking (3 nights)",
    category: "Accommodation",
    paidBy: "user-2",
    amount: 18000,
    splitAmong: ["user-1", "user-2", "user-3", "user-4"],
    date: "2024-03-15",
    settled: false,
  },
  {
    id: "exp-3",
    title: "Dinner at Beach Shack",
    category: "Food",
    paidBy: "user-3",
    amount: 3200,
    splitAmong: ["user-1", "user-2", "user-3", "user-4"],
    date: "2024-03-15",
    settled: true,
  },
  {
    id: "exp-4",
    title: "Water Sports Package",
    category: "Activities",
    paidBy: "user-1",
    amount: 8000,
    splitAmong: ["user-1", "user-2", "user-3"],
    date: "2024-03-16",
    settled: false,
  },
  {
    id: "exp-5",
    title: "Souvenirs & Gifts",
    category: "Shopping",
    paidBy: "user-4",
    amount: 2500,
    splitAmong: ["user-4"],
    date: "2024-03-17",
    settled: true,
  },
];

const categoryColors: Record<Expense["category"], string> = {
  Transport: "#0ea5e9",
  Accommodation: "#8b5cf6",
  Food: "#f59e0b",
  Activities: "#10b981",
  Shopping: "#ec4899",
  Other: "#6b7280",
};

export default function ExpensesDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    category: "Food" as Expense["category"],
    paidBy: "user-1",
    amount: "",
    splitAmong: mockTravelers.map((t) => t.id),
    date: new Date().toISOString().split("T")[0],
  });

  const totalBudget = 100000;

  // Calculations
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = ((totalSpent / totalBudget) * 100).toFixed(1);

  // Filtered expenses
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Category breakdown
  const categoryData = useMemo(() => {
    const breakdown: Record<string, number> = {};
    expenses.forEach((exp) => {
      breakdown[exp.category] = (breakdown[exp.category] || 0) + exp.amount;
    });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  // Balance calculations
  const balances = useMemo(() => {
    const balanceMap: Record<
      string,
      { paid: number; owed: number; net: number }
    > = {};

    mockTravelers.forEach((t) => {
      balanceMap[t.id] = { paid: 0, owed: 0, net: 0 };
    });

    expenses.forEach((exp) => {
      balanceMap[exp.paidBy].paid += exp.amount;

      const perPerson = exp.amount / exp.splitAmong.length;
      exp.splitAmong.forEach((userId) => {
        balanceMap[userId].owed += perPerson;
      });
    });

    mockTravelers.forEach((t) => {
      balanceMap[t.id].net = balanceMap[t.id].paid - balanceMap[t.id].owed;
    });

    return balanceMap;
  }, [expenses]);

  // Settlement suggestions
  const settlements = useMemo(() => {
    const owes: { userId: string; amount: number }[] = [];
    const owed: { userId: string; amount: number }[] = [];

    Object.entries(balances).forEach(([userId, balance]) => {
      if (balance.net < -0.01) {
        owes.push({ userId, amount: -balance.net });
      } else if (balance.net > 0.01) {
        owed.push({ userId, amount: balance.net });
      }
    });

    const suggestions: { from: string; to: string; amount: number }[] = [];
    let i = 0;
    let j = 0;

    while (i < owes.length && j < owed.length) {
      const payer = owes[i];
      const receiver = owed[j];
      const amount = Math.min(payer.amount, receiver.amount);

      suggestions.push({
        from: payer.userId,
        to: receiver.userId,
        amount,
      });

      payer.amount -= amount;
      receiver.amount -= amount;

      if (payer.amount < 0.01) i++;
      if (receiver.amount < 0.01) j++;
    }

    return suggestions;
  }, [balances]);

  // Add expense
  const addExpense = () => {
    if (!newExpense.title || !newExpense.amount) {
      alert("Please fill in title and amount");
      return;
    }

    const expense: Expense = {
      id: `exp-${Date.now()}`,
      title: newExpense.title,
      category: newExpense.category,
      paidBy: newExpense.paidBy,
      amount: parseFloat(newExpense.amount),
      splitAmong: newExpense.splitAmong,
      date: newExpense.date,
      settled: false,
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      title: "",
      category: "Food",
      paidBy: "user-1",
      amount: "",
      splitAmong: mockTravelers.map((t) => t.id),
      date: new Date().toISOString().split("T")[0],
    });
    setShowAddModal(false);
  };

  const toggleSettled = (expenseId: string) => {
    setExpenses(
      expenses.map((exp) =>
        exp.id === expenseId ? { ...exp, settled: !exp.settled } : exp
      )
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/organizer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Organizer
            </motion.button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="gradient-text">Expense Tracker</span>
              </h1>
              <p className="text-slate-600 mt-2">
                Track shared expenses and settle balances
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Export CSV - Coming Soon!")}
                className="btn-secondary flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Export PDF - Coming Soon!")}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                PDF
              </motion.button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-sky-100">
                <TrendingUp className="h-6 w-6 text-sky-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">
                Total Budget
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ₹{totalBudget.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-amber-100">
                <TrendingDown className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">
                Total Spent
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ₹{totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {spentPercentage}% of budget
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-3 rounded-xl ${
                  remaining >= 0 ? "bg-emerald-100" : "bg-red-100"
                }`}
              >
                <Wallet
                  className={`h-6 w-6 ${
                    remaining >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-slate-600">
                {remaining >= 0 ? "Remaining" : "Over Budget"}
              </span>
            </div>
            <div
              className={`text-3xl font-bold ${
                remaining >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              ₹{Math.abs(remaining).toLocaleString()}
            </div>
          </motion.div>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Left - Expenses Table */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Expenses</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </motion.button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white"
                >
                  <option>All</option>
                  <option>Transport</option>
                  <option>Accommodation</option>
                  <option>Food</option>
                  <option>Activities</option>
                  <option>Shopping</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Paid By
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Split
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-slate-100 hover:bg-white/60"
                    >
                      <td className="py-3 px-4 text-sm text-slate-900">
                        {expense.title}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: `${categoryColors[expense.category]}20`,
                            color: categoryColors[expense.category],
                          }}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700">
                        {
                          mockTravelers.find((t) => t.id === expense.paidBy)
                            ?.name
                        }
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-900">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {expense.splitAmong.length} people
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleSettled(expense.id)}
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            expense.settled
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {expense.settled ? "Settled" : "Pending"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right - Insights */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <div className="glass-panel p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Category Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {categoryData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          categoryColors[entry.name as Expense["category"]]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Balances */}
            <div className="glass-panel p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Balances</h3>
              <div className="space-y-3">
                {mockTravelers.map((traveler) => {
                  const balance = balances[traveler.id];
                  return (
                    <div
                      key={traveler.id}
                      className="p-3 rounded-xl bg-white/60"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900">
                          {traveler.name}
                        </span>
                        <span
                          className={`font-bold ${
                            balance.net > 0
                              ? "text-emerald-600"
                              : balance.net < 0
                              ? "text-red-600"
                              : "text-slate-600"
                          }`}
                        >
                          {balance.net > 0 ? "+" : ""}₹
                          {Math.abs(balance.net).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Paid: ₹{balance.paid.toFixed(0)}</span>
                        <span>Owed: ₹{balance.owed.toFixed(0)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settlement Suggestions */}
            <div className="glass-panel p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Settlement Suggestions
              </h3>
              {settlements.length === 0 ? (
                <div className="text-center py-6">
                  <Check className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">All settled!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {settlements.map((settlement, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-white/60 flex items-center gap-2"
                    >
                      <span className="text-sm text-slate-700">
                        {mockTravelers.find((t) => t.id === settlement.from)?.name}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="text-sm text-slate-700">
                        {mockTravelers.find((t) => t.id === settlement.to)?.name}
                      </span>
                      <span className="ml-auto font-semibold text-slate-900">
                        ₹{settlement.amount.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Add Expense
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newExpense.title}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, title: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="e.g., Flight Tickets"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        category: e.target.value as Expense["category"],
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  >
                    <option>Transport</option>
                    <option>Accommodation</option>
                    <option>Food</option>
                    <option>Activities</option>
                    <option>Shopping</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Paid By *
                  </label>
                  <select
                    value={newExpense.paidBy}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, paidBy: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  >
                    {mockTravelers.map((traveler) => (
                      <option key={traveler.id} value={traveler.id}>
                        {traveler.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Split Among *
                  </label>
                  <div className="space-y-2">
                    {mockTravelers.map((traveler) => (
                      <label
                        key={traveler.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={newExpense.splitAmong.includes(traveler.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewExpense({
                                ...newExpense,
                                splitAmong: [
                                  ...newExpense.splitAmong,
                                  traveler.id,
                                ],
                              });
                            } else {
                              setNewExpense({
                                ...newExpense,
                                splitAmong: newExpense.splitAmong.filter(
                                  (id) => id !== traveler.id
                                ),
                              });
                            }
                          }}
                          className="rounded border-slate-300"
                        />
                        <span className="text-sm text-slate-700">
                          {traveler.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button onClick={addExpense} className="flex-1 btn-primary">
                  Add Expense
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
