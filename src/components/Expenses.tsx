"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "../lib/auth-context";

type Participant = { user_id: string; display_name?: string | null; photo_url?: string | null };
type Expense = {
  id: string;
  title: string;
  amount: number;
  kind: "stay" | "food" | "travel" | "entry" | "other";
  paid_by: string;
  split_between: string[];
  created_at?: Timestamp | Date | null;
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function settle(balances: Record<string, number>) {
  const creditors: [uid: string, amt: number][] = [];
  const debtors: [uid: string, amt: number][] = [];
  for (const [u, v] of Object.entries(balances)) {
    if (v > 0.009) creditors.push([u, v]);
    else if (v < -0.009) debtors.push([u, v]);
  }
  creditors.sort((a, b) => b[1] - a[1]);
  debtors.sort((a, b) => a[1] - b[1]);
  const transfers: { from: string; to: string; amount: number }[] = [];
  let i = 0,
    j = 0;
  while (i < creditors.length && j < debtors.length) {
    const [cu, cv] = creditors[i];
    const [du, dv] = debtors[j];
    const pay = Math.min(cv, -dv);
    transfers.push({ from: du, to: cu, amount: round2(pay) });
    creditors[i][1] = round2(cv - pay);
    debtors[j][1] = round2(dv + pay);
    if (creditors[i][1] <= 0.009) i++;
    if (debtors[j][1] >= -0.009) j++;
  }
  return transfers;
}

export default function Expenses({ tripId }: { tripId: string }) {
  const { user } = useAuth();

  // Participants (to know who can be included in splits)
  const [members, setMembers] = useState<Participant[]>([]);
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "participants", tripId, "users"));
    const unsub = onSnapshot(q, (snap) => {
      setMembers(snap.docs.map((d) => d.data() as Participant));
    });
    return () => unsub();
  }, [tripId]);

  // Expenses list
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "expenses", tripId, "items"),
      orderBy("created_at", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Expense, "id">) })) as Expense[]
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [tripId]);

  // Add expense form
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | ''>("");
  const [kind, setKind] = useState<Expense["kind"]>("food");
  const [splitBetween, setSplitBetween] = useState<string[] | null>(null);

  useEffect(() => {
    if (members.length && splitBetween === null) {
      setSplitBetween(members.map((m) => m.user_id));
    }
  }, [members, splitBetween]);

  async function addExpense() {
    if (!user) return alert("Please login first.");
    if (!db) return alert("Firebase not configured.");
    const a = Number(amount);
    if (!title || !a || !splitBetween?.length) return alert("Fill all fields.");
    await addDoc(collection(db, "expenses", tripId, "items"), {
      title,
      amount: a,
      kind,
      paid_by: user.uid,
      split_between: splitBetween,
      created_at: serverTimestamp(),
    });
    setTitle("");
    setAmount("");
    setKind("food");
  }

  // Totals by category (for pie chart)
  const totalsByKind = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of items) {
      map[e.kind] = (map[e.kind] || 0) + Number(e.amount || 0);
    }
    return Object.entries(map).map(([name, value]) => ({ name, value: round2(value) }));
  }, [items]);

  // Per-user balances = paid - owed
  const balances = useMemo(() => {
    const bal: Record<string, number> = {};
    for (const m of members) bal[m.user_id] = 0;

    for (const e of items) {
      const amt = Number(e.amount || 0);
      const split = e.split_between?.length ? e.split_between : members.map((m) => m.user_id);
      const perHead = split.length ? amt / split.length : 0;
      if (e.paid_by) bal[e.paid_by] = round2((bal[e.paid_by] || 0) + amt);
      for (const u of split) {
        bal[u] = round2((bal[u] || 0) - perHead);
      }
    }
    return bal;
  }, [items, members]);

  const transfers = useMemo(() => settle(balances), [balances]);

  const nameOf = (uid: string) =>
    members.find((m) => m.user_id === uid)?.display_name || uid.slice(0, 6);

  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (!db) {
    return (
      <section className="rounded-2xl bg-white shadow p-4">
        <p className="text-slate-600">Firebase not configured. Please check environment variables.</p>
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
          value={kind}
          onChange={(e) => setKind(e.target.value as Expense["kind"])}
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
          className="px-4 py-2 rounded bg-slate-900 text-white"
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
                      {e.kind} • paid by {nameOf(e.paid_by)}
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
