import client from '../client';

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

// Machine learning model for transaction categorization
const mlModel = {
  income: {
    "Freelance / Contract": ["Client", "Freelance"],
    "Product Sales": ["Product", "Sales"],
    "Consulting": ["Consulting"],
    "Rental Income": ["Rental"],
    "Investment": ["Investment"],
    "Salary": ["Salary"],
    "Other Income": ["Other"],
  },
  expense: {
    "Rent / Office": ["Rent", "Office"],
    "Software & Tools": ["Software", "Tools"],
    "Marketing": ["Marketing"],
    "Payroll": ["Payroll"],
    "Utilities": ["Utilities"],
    "Travel": ["Travel"],
    "Equipment": ["Equipment"],
    "Professional Services": ["Professional Services"],
    "Other Expense": ["Other"],
  },
};

function categorizeTransaction(transaction: Transaction): string {
  const keywords = mlModel[transaction.type];
  for (const category in keywords) {
    if (keywords.hasOwnProperty(category)) {
      const keywordList = keywords[category];
      for (const keyword of keywordList) {
        if (transaction.description.toLowerCase().includes(keyword.toLowerCase())) {
          return category;
        }
      }
    }
  }
  return transaction.type === "income" ? "Other Income" : "Other Expense";
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());

  useEffect(() => {
    if (transactions.length === 0) {
      setTransactions(SEED_TRANSACTIONS);
    }
  }, [transactions]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const handleAddTransaction = (newTransaction: Transaction) => {
    newTransaction.category = categorizeTransaction(newTransaction);
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
            <th>Recurring</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.type}</td>
              <td>{transaction.category}</td>
              <td>{transaction.date}</td>
              <td>{transaction.recurring ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleDeleteTransaction(transaction.id)}>
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleAddTransaction({
        id: Math.random().toString(36).substr(2, 9),
        description: "New Transaction",
        amount: 0,
        type: "income",
        category: "",
        date: new Date().toISOString().split("T")[0],
        recurring: false,
      })}>
        <Plus />
      </button>
    </div>
  );
}

export default App;