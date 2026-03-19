"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Home,
  BarChart3,
  Plus,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

interface RecurringItem {
  id: string;
  label: string;
  amount: number;
  type: "income" | "expense";
  frequency: "monthly" | "quarterly" | "yearly";
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  recurring: boolean;
}

const STORAGE_KEY = "cashflow_transactions";
const RECURRING_KEY = "cashflow_recurring_items";

const DEFAULT_RECURRING: RecurringItem[] = [
  { id: "r1", label: "Freelance Retainer", amount: 4500, type: "income", frequency: "monthly" },
  { id: "r2", label: "Office Rent", amount: 1200, type: "expense", frequency: "monthly" },
  { id: "r3", label: "Software Subscriptions", amount: 200, type: "expense", frequency: "monthly" },
  { id: "r4", label: "Annual Tax Payment", amount: 4000, type: "expense", frequency: "yearly" },
];

function getMonthlyEquivalent(item: RecurringItem): number {
  switch (item.frequency) {
    case "monthly": return item.amount;
    case "quarterly": return item.amount / 3;
    case "yearly": return item.amount / 12;
    default: return item.amount;
  }
}

export default function ForecastingPage() {
  const [mounted, setMounted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState("10000");
  const [horizon, setHorizon] = useState<3 | 6 | 12>(6);
  const [recurringItems, setRecurringItems] = useState<RecurringItem[]>([]);
  const [safetyThreshold, setSafetyThreshold] = useState("2000");

  const [newItem, setNewItem] = useState({
    label: "",
    amount: "",
    type: "income" as "income" | "expense",
    frequency: "monthly" as RecurringItem["frequency"],
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load recurring items
    try {
      const stored = localStorage.getItem(RECURRING_KEY);
      if (stored) {
        setRecurringItems(JSON.parse(stored));
      } else {
        setRecurringItems(DEFAULT_RECURRING);
        localStorage.setItem(RECURRING_KEY, JSON.stringify(DEFAULT_RECURRING));
      }
    } catch {
      setRecurringItems(DEFAULT_RECURRING);
    }

    // Try to derive current balance from stored transactions
    try {
      const txData = localStorage.getItem(STORAGE_KEY);
      if (txData) {
        const txs: Transaction[] = JSON.parse(txData);
        const income = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const expenses = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        const derived = income - expenses;
        if (derived > 0) setCurrentBalance(derived.toFixed(2));
      }
    } catch {
      // keep default
    }
  }, []);

  const saveRecurring = (items: RecurringItem[]) => {
    setRecurringItems(items);
    if (typeof window !== "undefined") {
      localStorage.setItem(RECURRING_KEY, JSON.stringify(items));
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newItem.amount);
    if (!newItem.label.trim() || isNaN(amount) || amount <= 0) return;

    const item: RecurringItem = {
      id: Date.now().toString(),
      label: newItem.label.trim(),
      amount,
      type: newItem.type,
      frequency: newItem.frequency,
    };
    saveRecurring([...recurringItems, item]);
    setNewItem({ label: "", amount: "", type: "income", frequency: "monthly" });
    setShowAddForm(false);
  };

  const handleRemoveItem = (id: string) => {
    saveRecurring(recurringItems.filter((i) => i.id !== id));
  };

  const monthlyIncome = useMemo(
    () => recurringItems.filter((i) => i.type === "income").reduce((s, i) => s + getMonthlyEquivalent(i), 0),
    [recurringItems]
  );

  const monthlyExpenses = useMemo(
    () => recurringItems.filter((i) => i.type === "expense").reduce((s, i) => s + getMonthlyEquivalent(i), 0),
    [recurringItems]
  );

  const monthlyNet = monthlyIncome - monthlyExpenses;

  const forecastData = useMemo(() => {
    const balance = parseFloat(currentBalance) || 0;
    const safety = parseFloat(safetyThreshold) || 0;
    const months = [];

    for (let m = 1; m <= horizon; m++) {
      const d = new Date();
      d.setMonth(d.getMonth() + m);

      // For quarterly/yearly items, add them only in the relevant months
      let monthIncome = 0;
      let monthExpense = 0;

      recurringItems.forEach((item) => {
        const monthly = getMonthlyEquivalent(item);
        if (item.type === "income") monthIncome += monthly;
        else monthExpense += monthly;
      });

      const projectedBalance = balance + monthlyNet * m;
      const monthBalance = balance + monthlyNet * (m - 1) + (monthIncome - monthExpense);

      months.push({
        month: d.toLocaleString("default", { month: "short", year: "2-digit" }),
        income: monthIncome,
        expense: monthExpense,
        net: monthIncome - monthExpense,
        balance: projectedBalance,
        belowThreshold: projectedBalance < safety,
      });
    }

    return months;
  }, [currentBalance, horizon, recurringItems, safetyThreshold, monthlyNet]);

  const minBalance = Math.min(...forecastData.map((d) => d.balance));
  const maxBalance = Math.max(...forecastData.map((d) => d.balance), parseFloat(currentBalance) || 0);
  const balanceRange = maxBalance - minBalance || 1;

  const finalBalance = forecastData[forecastData.length - 1]?.balance ?? 0;
  const belowThresholdMonths = forecastData.filter((d) => d.belowThreshold).length;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading forecasting...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 hidden sm:block">Cash Flow Pro</span>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                <Home className="w-4 h-4" />
                <span className="hidden sm:block">Home</span>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:block">Dashboard</span>
              </Link>
              <Link href="/forecasting" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:block">Forecasting</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Cash Flow Forecast</h1>
          <p className="text-slate-500 text-sm">Project your balance based on recurring income and expenses.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel — Inputs */}
          <div className="lg:col-span-1 space-y-4">
            {/* Config Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-500" />
                Forecast Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Current Balance ($)
                  </label>
                  <input
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                    placeholder="10000"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Safety Threshold ($)
                  </label>
                  <input
                    type="number"
                    value={safetyThreshold}
                    onChange={(e) => setSafetyThreshold(e.target.value)}
                    placeholder="2000"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-400 mt-1">Alert when balance falls below this amount.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Forecast Horizon
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([3, 6, 12] as const).map((h) => (
                      <button
                        key={h}
                        onClick={() => setHorizon(h)}
                        className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                          horizon === h
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                        }`}
                      >
                        {h}mo
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-4">Monthly Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ArrowUpCircle className="w-4 h-4 text-green-500" />
                    Avg Monthly Income
                  </div>
                  <span className="font-semibold text-green-600 text-sm">
                    +${monthlyIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ArrowDownCircle className="w-4 h-4 text-rose-500" />
                    Avg Monthly Expenses
                  </div>
                  <span className="font-semibold text-rose-600 text-sm">
                    -${monthlyExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Net Monthly Flow</span>
                  <span className={`font-bold text-sm ${monthlyNet >= 0 ? "text-indigo-600" : "text-rose-600"}`}>
                    {monthlyNet >= 0 ? "+" : ""}${monthlyNet.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Forecast Insights */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" />
                Insights
              </h2>
              <div className="space-y-3">
                <div className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
                  finalBalance >= parseFloat(safetyThreshold || "0")
                    ? "bg-green-50 text-green-800"
                    : "bg-rose-50 text-rose-800"
                }`}>
                  {finalBalance >= parseFloat(safetyThreshold || "0") ? (
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <span>
                    Projected {horizon}-month balance:{" "}
                    <strong>${finalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </span>
                </div>

                {belowThresholdMonths > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl text-sm text-amber-800">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Balance drops below safety threshold in{" "}
                      <strong>{belowThresholdMonths} month{belowThresholdMonths > 1 ? "s" : ""}</strong>.
                    </span>
                  </div>
                )}

                {monthlyNet > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-indigo-50 rounded-xl text-sm text-indigo-800">
                    <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      At this rate, you&apos;ll grow your balance by{" "}
                      <strong>${(monthlyNet * horizon).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>{" "}
                      over {horizon} months.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel — Chart + Table */}
          <div className="lg:col-span-2 space-y-6">
            {/* Projected Balance Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-slate-900">Projected Balance</h2>
                  <p className="text-sm text-slate-500">Next {horizon} months forecast</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                    <span className="text-slate-500">Balance</span>
                  </div>
                  {parseFloat(safetyThreshold) > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-1 bg-rose-400 border-t-2 border-dashed border-rose-400" />
                      <span className="text-slate-500">Safety floor</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Y-axis labels + bars */}
              <div className="relative">
                <div className="flex items-end gap-2 h-52 relative">
                  {/* Safety threshold line */}
                  {parseFloat(safetyThreshold) > 0 && balanceRange > 0 && (
                    <div
                      className="absolute left-0 right-0 border-t-2 border-dashed border-rose-400 pointer-events-none"
                      style={{
                        bottom: `${Math.max(0, Math.min(100, ((parseFloat(safetyThreshold) - minBalance) / balanceRange) * 100))}%`,
                      }}
                    />
                  )}

                  {forecastData.map((d, i) => {
                    const heightPct = balanceRange > 0
                      ? Math.max(5, ((d.balance - minBalance) / balanceRange) * 100)
                      : 50;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 left-1/2 -translate-x-1/2">
                          <div className="font-semibold">{d.month}</div>
                          <div className="text-slate-300">Balance: ${d.balance.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                          <div className="text-green-400">+${d.income.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                          <div className="text-rose-400">-${d.expense.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                        </div>

                        <div className="w-full h-44 flex items-end">
                          <div
                            className={`w-full rounded-t-lg transition-all ${
                              d.belowThreshold
                                ? "bg-gradient-to-t from-rose-500 to-rose-400"
                                : "bg-gradient-to-t from-indigo-600 to-indigo-400"
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{d.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Month-by-Month Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Month-by-Month Breakdown</h2>
                <p className="text-sm text-slate-500">Detailed forecast for each period</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Month</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Income</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Expenses</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Net</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {forecastData.map((d, i) => (
                      <tr key={i} className={`hover:bg-slate-50 transition-colors ${d.belowThreshold ? "bg-rose-50/50" : ""}`}>
                        <td className="px-6 py-3 font-medium text-slate-800">
                          <div className="flex items-center gap-2">
                            {d.belowThreshold && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                            {d.month}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-green-600 font-medium">
                          +${d.income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right text-rose-600 font-medium">
                          -${d.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${d.net >= 0 ? "text-indigo-600" : "text-rose-600"}`}>
                          {d.net >= 0 ? "+" : ""}${d.net.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-6 py-3 text-right font-bold ${d.belowThreshold ? "text-rose-600" : "text-slate-900"}`}>
                          ${d.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recurring Items Manager */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="font-semibold text-slate-900">Recurring Items</h2>
                  <p className="text-sm text-slate-500">Configure recurring income and expenses for forecasting</p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="divide-y divide-slate-50">
                {recurringItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    <TrendingUp className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="font-medium">No recurring items</p>
                    <p className="text-sm text-slate-400 mt-1">Add your first recurring income or expense.</p>
                  </div>
                ) : (
                  recurringItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === "income" ? "bg-green-100" : "bg-rose-100"}`}>
                          {item.type === "income" ? (
                            <ArrowUpCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDownCircle className="w-4 h-4 text-rose-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{item.label}</p>
                          <p className="text-xs text-slate-400 capitalize">{item.frequency}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-sm font-bold ${item.type === "income" ? "text-green-600" : "text-rose-600"}`}>
                            {item.type === "income" ? "+" : "-"}${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-slate-400">
                            ~${getMonthlyEquivalent(item).toFixed(0)}/mo
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Recurring Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add Recurring Item</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewItem((p) => ({ ...p, type: "income" }))}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      newItem.type === "income"
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-green-300"
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItem((p) => ({ ...p, type: "expense" }))}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      newItem.type === "expense"
                        ? "bg-rose-500 border-rose-500 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-rose-300"
                    }`}
                  >
                    <ArrowDownCircle className="w-4 h-4" />
                    Expense
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Label</label>
                <input
                  type="text"
                  value={newItem.label}
                  onChange={(e) => setNewItem((p) => ({ ...p, label: e.target.value }))}
                  placeholder="e.g. Monthly Retainer"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount ($)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={newItem.amount}
                  onChange={(e) => setNewItem((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Frequency</label>
                <select
                  value={newItem.frequency}
                  onChange={(e) => setNewItem((p) => ({ ...p, frequency: e.target.value as RecurringItem["frequency"] }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
