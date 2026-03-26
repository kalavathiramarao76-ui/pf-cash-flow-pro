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

interface MlModel {
  income: { [key: string]: string[] };
  expense: { [key: string]: string[] };
}

class AdvancedMlModel {
  private incomeModel: any;
  private expenseModel: any;

  constructor() {
    this.incomeModel = this.trainModel(CATEGORIES_INCOME);
    this.expenseModel = this.trainModel(CATEGORIES_EXPENSE);
  }

  private trainModel(categories: string[]): any {
    const model: any = {};
    categories.forEach((category) => {
      model[category] = [];
    });
    return model;
  }

  public predict(description: string, type: TransactionType): string {
    if (type === "income") {
      const category = this.predictIncome(description);
      return category;
    } else {
      const category = this.predictExpense(description);
      return category;
    }
  }

  private predictIncome(description: string): string {
    const keywords: { [key: string]: string[] } = {
      "Freelance / Contract": ["client", "project", "freelance"],
      "Product Sales": ["product", "sale", "item"],
      "Consulting": ["consulting", "advice", "expert"],
      "Rental Income": ["rental", "property", "lease"],
      "Investment": ["investment", "stock", "bond"],
      "Salary": ["salary", "wage", "pay"],
      "Other Income": ["other", "income", "misc"],
    };
    let bestMatch: string | null = null;
    let bestMatchCount: number = 0;
    Object.keys(keywords).forEach((category) => {
      const keywordCount: number = keywords[category].filter((keyword) => description.toLowerCase().includes(keyword)).length;
      if (keywordCount > bestMatchCount) {
        bestMatch = category;
        bestMatchCount = keywordCount;
      }
    });
    return bestMatch || "Other Income";
  }

  private predictExpense(description: string): string {
    const keywords: { [key: string]: string[] } = {
      "Rent / Office": ["rent", "office", "lease"],
      "Software & Tools": ["software", "tool", "app"],
      "Marketing": ["marketing", "ad", "promotion"],
      "Payroll": ["payroll", "salary", "wage"],
      "Utilities": ["utility", "bill", "electricity"],
      "Travel": ["travel", "trip", "hotel"],
      "Equipment": ["equipment", "hardware", "machine"],
      "Professional Services": ["service", "consulting", "advice"],
      "Other Expense": ["other", "expense", "misc"],
    };
    let bestMatch: string | null = null;
    let bestMatchCount: number = 0;
    Object.keys(keywords).forEach((category) => {
      const keywordCount: number = keywords[category].filter((keyword) => description.toLowerCase().includes(keyword)).length;
      if (keywordCount > bestMatchCount) {
        bestMatch = category;
        bestMatchCount = keywordCount;
      }
    });
    return bestMatch || "Other Expense";
  }
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());
  const [newTransaction, setNewTransaction] = useState({ description: "", amount: 0, type: "income", category: "", date: "", recurring: false });
  const [mlModel, setMlModel] = useState(new AdvancedMlModel());

  useEffect(() => {
    if (transactions.length === 0) {
      setTransactions(SEED_TRANSACTIONS);
    }
  }, [transactions]);

  const handleAddTransaction = () => {
    const predictedCategory = mlModel.predict(newTransaction.description, newTransaction.type as TransactionType);
    setNewTransaction({ ...newTransaction, category: predictedCategory });
    setTransactions([...transactions, { ...newTransaction, id: Math.random().toString(36).substr(2, 9) }]);
    setNewTransaction({ description: "", amount: 0, type: "income", category: "", date: "", recurring: false });
    saveTransactions(transactions);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
    saveTransactions(transactions);
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
      <form>
        <label>
          Description:
          <input type="text" value={newTransaction.description} onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })} />
        </label>
        <label>
          Amount:
          <input type="number" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })} />
        </label>
        <label>
          Type:
          <select value={newTransaction.type} onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as TransactionType })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label>
          Date:
          <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} />
        </label>
        <label>
          Recurring:
          <input type="checkbox" checked={newTransaction.recurring} onChange={(e) => setNewTransaction({ ...newTransaction, recurring: e.target.checked })} />
        </label>
        <button type="button" onClick={handleAddTransaction}>
          <Plus />
        </button>
      </form>
    </div>
  );
}

export default App;