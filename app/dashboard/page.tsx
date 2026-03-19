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

function categorizeTransaction(description: string, type: TransactionType): string {
  const keywordsIncome = {
    "Freelance / Contract": ["Client", "Freelance"],
    "Product Sales": ["Product", "Sales"],
    "Consulting": ["Consulting"],
    "Rental Income": ["Rental"],
    "Investment": ["Investment"],
    "Salary": ["Salary"],
    "Other Income": ["Other"],
  };

  const keywordsExpense = {
    "Rent / Office": ["Rent", "Office"],
    "Software & Tools": ["Software", "Tools"],
    "Marketing": ["Marketing"],
    "Payroll": ["Payroll"],
    "Utilities": ["Utilities"],
    "Travel": ["Travel"],
    "Equipment": ["Equipment"],
    "Professional Services": ["Professional"],
    "Other Expense": ["Other"],
  };

  const keywords = type === "income" ? keywordsIncome : keywordsExpense;

  for (const category in keywords) {
    for (const keyword of keywords[category]) {
      if (description.toLowerCase().includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  return type === "income" ? CATEGORIES_INCOME[0] : CATEGORIES_EXPENSE[0];
}

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
  });

  useEffect(() => {
    const storedTransactions = getStoredTransactions();
    if (storedTransactions.length > 0) {
      setTransactions(storedTransactions);
    } else {
      setTransactions(SEED_TRANSACTIONS);
      saveTransactions(SEED_TRANSACTIONS);
    }
    setMounted(true);
  }, []);

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      category: categorizeTransaction(form.description, form.type),
      date: form.date,
      recurring: false,
    };

    setTransactions([...transactions, newTransaction]);
    saveTransactions([...transactions, newTransaction]);
    setForm({
      description: "",
      amount: "",
      type: "income",
      category: CATEGORIES_INCOME[0],
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const newTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  const handleFilterChange = (type: "all" | TransactionType) => {
    setFilterType(type);
  };

  const filteredTransactions = filterType === "all" ? transactions : transactions.filter((transaction) => transaction.type === filterType);

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <button onClick={() => setShowForm(!showForm)}>Add Transaction</button>
      {showForm && (
        <form>
          <label>
            Description:
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label>
            Amount:
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </label>
          <label>
            Type:
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label>
            Date:
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <button type="button" onClick={handleAddTransaction}>
            Add
          </button>
        </form>
      )}
      <button onClick={() => handleFilterChange("all")}>All</button>
      <button onClick={() => handleFilterChange("income")}>Income</button>
      <button onClick={() => handleFilterChange("expense")}>Expense</button>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
            <th>Recurring</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.type}</td>
              <td>{transaction.category}</td>
              <td>{transaction.date}</td>
              <td>{transaction.recurring ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}