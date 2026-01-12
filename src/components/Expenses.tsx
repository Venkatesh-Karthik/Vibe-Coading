"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useSupabaseAuth } from "../lib/auth";
import { calculateBalances, calculateSettlement, calculateCategoryTotals } from "../lib/helpers/expenses";
import type { Expense, ExpenseSplit, User } from "@/types/database";

type Participant = { user_id: string; display_name?: string | null; photo_url?: string | null };
type ExpenseWithSplits = Expense & {
  expense_splits: ExpenseSplit[];
};

export default function Expenses({ tripId }: { tripId: string }) {
  const { user } = useSupabaseAuth();

  // Participants (to know who can be included in splits)
  const [members, setMembers] = useState<Participant[]>([]);
  
  // Expenses list
  const [items, setItems] = useState<ExpenseWithSplits[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add expense form
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | ''>("");
  const [kind, setKind] = useState<Expense["category"]>("food");
  const [splitBetween, setSplitBetween] = useState<string[] | null>(null);

  // Load members (trip participants)
  useEffect(() => {
    loadMembers();
  }, [tripId]);

  // Load expenses
  useEffect(() => {
    loadExpenses();
    
    // Set up realtime subscription
    const channel = supabase
      .channel(`expenses-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `trip_id=eq.${tripId}`
        },
        () => {
          loadExpenses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId]);

  async function loadMembers() {
    try {
      // Get trip members
      const { data: tripMembers, error: membersError } = await supabase
        .from("trip_members")
        .select("user_id, users(id, name, photo)")
        .eq("trip_id", tripId);

      if (membersError) throw membersError;

      const participants: Participant[] = (tripMembers as any)
        ?.map((tm: any) => ({
          user_id: tm.user_id || "",
          display_name: tm.users?.name || null,
          photo_url: tm.users?.photo || null,
        }))
        .filter((p: Participant) => p.user_id) || [];

      setMembers(participants);
      
      if (splitBetween === null) {
        setSplitBetween(participants.map((m) => m.user_id));
      }
    } catch (err) {
      console.error("Error loading members:", err);
    }
  }

  async function loadExpenses() {
    try {
      setLoading(true);
      setError(null);

      const { data: expensesData, error: expensesError } = await supabase
        .from("expenses")
        .select(`
          *,
          expense_splits (*)
        `)
        .eq("trip_id", tripId)
        .order("created_at", { ascending: true });

      if (expensesError) throw expensesError;

      setItems((expensesData as ExpenseWithSplits[]) || []);
    } catch (err) {
      console.error("Error loading expenses:", err);
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  async function addExpense() {
    if (!user) return alert("Please login first.");
    const a = Number(amount);
    if (!title || !a || !splitBetween?.length) return alert("Fill all fields.");

    try {
      // Insert expense
      const { data: expense, error: expenseError } = await supabase
        .from("expenses")
        .insert({
          trip_id: tripId,
          title,
          amount: a,
          paid_by: user.id,
          category: kind,
          date: new Date().toISOString().split("T")[0],
        } as any)
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Insert splits
      const splits = splitBetween.map((userId) => ({
        expense_id: (expense as any).id,
        user_id: userId,
        share: a / splitBetween.length,
      }));

      const { error: splitsError } = await supabase
        .from("expense_splits")
        .insert(splits as any);

      if (splitsError) throw splitsError;

      // Reset form
      setTitle("");
      setAmount("");
      setKind("food");
      
      // Reload expenses
      await loadExpenses();
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Failed to add expense");
    }
  }

  // Totals by category (for pie chart)
  const totalsByKind = useMemo(() => {
    return calculateCategoryTotals(items);
  }, [items]);

  // Per-user balances = paid - owed
  const balances = useMemo(() => {
    const allSplits = items.flatMap((e) => e.expense_splits || []);
    return calculateBalances(items, allSplits, members.map((m) => m.user_id));
  }, [items, members]);

  const transfers = useMemo(() => calculateSettlement(balances), [balances]);

  const nameOf = (uid: string) =>
    members.find((m) => m.user_id === uid)?.display_name || uid.slice(0, 6);

  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (error) {
    return (
      <section className="rounded-2xl bg-white shadow p-4">
        <p className="text-rose-600">Error: {error}</p>
        <button
          onClick={loadExpenses}
          className="mt-2 px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white shadow p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Expenses</h3>
        <span className="text-xs text-slate-500">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Add form */}
      <div className="mt-4 grid md:grid-cols-[1fr,120px,140px] gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (e.g., Lunch, Taxi)"
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Amount"
          className="border rounded px-3 py-2"
        />
        <select
          value={kind || "food"}
          onChange={(e) => setKind(e.target.value as Expense["category"])}
          className="border rounded px-3 py-2"
        >
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="stay">Stay</option>
          <option value="entry">Entry</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Split between */}
      <div className="mt-3">
        <div className="text-xs font-medium mb-1">Split between:</div>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => {
            const checked = splitBetween?.includes(m.user_id) ?? false;
            return (
              <label
                key={m.user_id}
                className={`text-xs border rounded-full px-3 py-1 cursor-pointer select-none ${
                  checked ? "bg-blue-50 border-blue-300" : "bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  className="mr-2 align-middle"
                  checked={checked}
                  onChange={(e) => {
                    setSplitBetween((prev) => {
                      const set = new Set(prev ?? []);
                      if (e.target.checked) set.add(m.user_id);
                      else set.delete(m.user_id);
                      return Array.from(set);
                    });
                  }}
                />
                {m.display_name || m.user_id.slice(0, 6)}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <button
          onClick={addExpense}
          className="px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Add Expense
        </button>
      </div>

      {/* List + Chart */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">All expenses</h4>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-slate-600 text-sm">No expenses yet.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between border rounded px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{e.title}</div>
                    <div className="text-xs text-slate-600">
                      {e.category} • paid by {nameOf(e.paid_by || "")}
                    </div>
                  </div>
                  <div className="font-semibold">₹{e.amount}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-2">By category</h4>
          <div className="h-64 rounded border grid place-items-center">
            {totalsByKind.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={totalsByKind}
                    outerRadius={100}
                    label
                  >
                    {totalsByKind.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-500 text-sm">No data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Balances & Settle Up */}
      <div className="mt-6">
        <h4 className="font-medium mb-2">Balances</h4>
        {members.length === 0 ? (
          <p className="text-sm text-slate-600">No members yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2">
              {members.map((m) => (
                <li
                  key={m.user_id}
                  className="flex items-center justify-between border rounded px-3 py-2"
                >
                  <span>{m.display_name || m.user_id.slice(0, 6)}</span>
                  <span
                    className={`font-semibold ${
                      (balances[m.user_id] || 0) >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {(balances[m.user_id] || 0) >= 0 ? "+" : ""}
                    ₹{Math.abs(balances[m.user_id] || 0).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="rounded border p-3">
              <div className="font-medium mb-2">Settle Up (suggested)</div>
              {transfers.length ? (
                <ul className="space-y-1 text-sm">
                  {transfers.map((t, i) => (
                    <li key={i}>
                      <span className="font-medium">{nameOf(t.from)}</span>{" "}
                      → <span className="font-medium">{nameOf(t.to)}</span>{" "}
                      : ₹{t.amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-slate-600 text-sm">All settled 🎉</div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
