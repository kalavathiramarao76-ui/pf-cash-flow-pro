"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Plus,
  Trash2,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Home,
  BarChart3,
  Tag,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

type TransactionType = "income" | "expense";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  recurring: boolean;
}

const CATEGORIES_INCOME = [
  "Freelance / Contract",
  "Product Sales",
  "Consulting",
  "Rental Income",
  "Investment",
  "Salary",
  "Other Income",
];

const CATEGORIES_EXPENSE = [
  "Rent / Office",
  "Software & Tools",
  "Marketing",
  "Payroll",
  "Utilities",
  "Travel",
  "Equipment",
  "Professional Services",
  "Other Expense",
];

const STORAGE_KEY = "cashflow_transactions";

function getStoredTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTransactions(transactions: Transaction[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

const SEED_TRANSACTIONS: Transaction[] = [
  { id: "s1", description: "Client — Acme Corp (Retainer)", amount: 4500, type: "income", category: "Freelance / Contract", date: new Date().toISOString().split("T")[0], recurring: true },
  { id: "s2", description: "Client — Nova Labs (Project)", amount: 2800, type: "income", category: "Consulting", date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0], recurring: false },
  { id: "s3", description: "Office Rent", amount: 1200, type: "expense", category: "Rent / Office", date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0], recurring: true },
  { id: "s4", description: "Adobe Creative Cloud", amount: 54.99, type: "expense", category: "Software & Tools", date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0], recurring: true },
  { id: "s5", description: "Google Ads Campaign", amount: 350, type: "expense", category: "Marketing", date: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0], recurring: false },
  { id: "s6", description: "Freelance — Design Project", amount: 1600, type: "income", category: "Freelance / Contract", date: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0], recurring: false },
];

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "income" as TransactionType,
    category: CATEGORIES_INCOME[0],
    date: new Date().toISOString().split("T")[0],
    recurring: false,
  });

  useEffect(() => {
    setMounted(true);
    const stored = getStoredTransactions();
    if (stored.length === 0) {
      saveTransactions(SEED_TRANSACTIONS);
      setTransactions(SEED_TRANSACTIONS);
    } else {
      setTransactions(stored);
    }
  }, []);

  const handleTypeChange = (type: TransactionType) => {
    setForm((prev) => ({
      ...prev,
      type,
      category: type === "income" ? CATEGORIES_INCOME[0] : CATEGORIES_EXPENSE[0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.description.trim() || isNaN(amount) || amount <= 0) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      description: form.description.trim(),
      amount,
      type: form.type,
      category: form.category,
      date: form.date,
      recurring: form.recurring,
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    setForm({
      description: "",
      amount: "",
      type: "income",
      category: CATEGORIES_INCOME[0],
      date: new Date().toISOString().split("T")[0],
      recurring: false,
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleExport = () => {
    const rows = [
      ["Date", "Description", "Category", "Type", "Amount", "Recurring"],
      ...transactions.map((t) => [
        t.date,
        t.description,
        t.category,
        t.type,
        t.amount.toFixed(2),
        t.recurring ? "Yes" : "No",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cashflow-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const netCashFlow = totalIncome - totalExpenses;

  const filtered = filterType === "all"
    ? transactions
    : transactions.filter((t) => t.type === filterType);

  const monthlyIncome = transactions
    .filter((t) => {
      const d = new Date(t.date);
      const now = new Date();
      return t.type === "income" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, t) => s + t.amount, 0);

  const monthlyExpenses = transactions
    .filter((t) => {
      const d = new Date(t.date);
      const now = new Date();
      return t.type === "expense" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, t) => s + t.amount, 0);

  // Build simple bar chart data from last 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.getMonth();
    const year = d.getFullYear();
    const income = transactions
      .filter((t) => {
        const td = new Date(t.date);
        return t.type === "income" && td.getMonth() === month && td.getFullYear() === year;
      })
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter((t) => {
        const td = new Date(t.date);
        return t.type === "expense" && td.getMonth() === month && td.getFullYear() === year;
      })
      .reduce((s, t) => s + t.amount, 0);
    return {
      label: d.toLocaleString("default", { month: "short" }),
      income,
      expense,
    };
  });

  const maxChartVal = Math.max(...chartData.flatMap((d) => [d.income, d.expense]), 1);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
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
              <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:block">Dashboard</span>
              </Link>
              <Link href="/forecasting" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:block">Forecasting</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:block">Export CSV</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Financial Dashboard</h1>
          <p className="text-slate-500 text-sm">Track your income, expenses, and overall cash position.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Net Cash Flow</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${netCashFlow >= 0 ? "bg-green-100" : "bg-rose-100"}`}>
                <DollarSign className={`w-4 h-4 ${netCashFlow >= 0 ? "text-green-600" : "text-rose-600"}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold ${netCashFlow >= 0 ? "text-green-600" : "text-rose-600"}`}>
              {netCashFlow < 0 ? "-" : ""}${Math.abs(netCashFlow).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">All time</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Income</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <ArrowUpCircle className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">This month: ${monthlyIncome.toFixed(2)}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Expenses</span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <ArrowDownCircle className="w-4 h-4 text-rose-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              ${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">This month: ${monthlyExpenses.toFixed(2)}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Transactions</span>
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Tag className="w-4 h-4 text-violet-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{transactions.length}</div>
            <p className="text-xs text-slate-400 mt-1">
              {transactions.filter((t) => t.recurring).length} recurring
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-slate-900">Income vs Expenses</h2>
              <p className="text-sm text-slate-500">Last 6 months comparison</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                <span className="text-slate-500">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-rose-400" />
                <span className="text-slate-500">Expenses</span>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-3 h-48">
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5 h-40">
                  <div
                    className="flex-1 bg-indigo-500 rounded-t-sm transition-all"
                    style={{ height: `${maxChartVal > 0 ? (d.income / maxChartVal) * 100 : 0}%`, minHeight: d.income > 0 ? "4px" : "0" }}
                    title={`Income: $${d.income.toFixed(2)}`}
                  />
                  <div
                    className="flex-1 bg-rose-400 rounded-t-sm transition-all"
                    style={{ height: `${maxChartVal > 0 ? (d.expense / maxChartVal) * 100 : 0}%`, minHeight: d.expense > 0 ? "4px" : "0" }}
                    title={`Expense: $${d.expense.toFixed(2)}`}
                  />
                </div>
                <span className="text-xs text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-100 gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">Transactions</h2>
              <p className="text-sm text-slate-500">{filtered.length} records</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
                {(["all", "income", "expense"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 font-medium capitalize transition-colors ${
                      filterType === t
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <DollarSign className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No transactions yet</p>
              <p className="text-sm text-slate-400 mt-1">Add your first transaction to get started.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Transaction
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Description</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Date</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Type</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Amount</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "income" ? "bg-green-100" : "bg-rose-100"}`}>
                            {tx.type === "income" ? (
                              <ArrowUpCircle className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <ArrowDownCircle className="w-3.5 h-3.5 text-rose-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{tx.description}</p>
                            {tx.recurring && (
                              <span className="text-xs text-indigo-500 font-medium">Recurring</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          <Tag className="w-3 h-3" />
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                          tx.type === "income"
                            ? "bg-green-50 text-green-700"
                            : "bg-rose-50 text-rose-700"
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold text-sm ${tx.type === "income" ? "text-green-600" : "text-rose-600"}`}>
                          {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Transaction Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add Transaction</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("income")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      form.type === "income"
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-green-300"
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("expense")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      form.type === "expense"
                        ? "bg-rose-500 border-rose-500 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-rose-300"
                    }`}
                  >
                    <ArrowDownCircle className="w-4 h-4" />
                    Expense
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="e.g. Client Invoice #42"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount ($)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  {(form.type === "income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Recurring Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, recurring: !p.recurring }))}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    form.recurring ? "bg-indigo-500" : "bg-slate-300"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.recurring ? "translate-x-4" : ""}`} />
                </button>
                <label className="text-sm text-slate-700 font-medium cursor-pointer" onClick={() => setForm((p) => ({ ...p, recurring: !p.recurring }))}>
                  Recurring transaction
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
