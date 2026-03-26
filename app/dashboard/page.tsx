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

  public categorizeTransaction(transaction: Transaction): string {
    const keywords = transaction.description.toLowerCase().split(" ");
    let category = "";

    if (transaction.type === "income") {
      for (const keyword of keywords) {
        for (const incomeCategory in this.incomeModel) {
          if (incomeCategory.toLowerCase().includes(keyword)) {
            category = incomeCategory;
            break;
          }
        }
      }
    } else {
      for (const keyword of keywords) {
        for (const expenseCategory in this.expenseModel) {
          if (expenseCategory.toLowerCase().includes(keyword)) {
            category = expenseCategory;
            break;
          }
        }
      }
    }

    return category;
  }
}

const mlModel = new AdvancedMlModel();

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());

  useEffect(() => {
    if (transactions.length === 0) {
      setTransactions(SEED_TRANSACTIONS);
    }
  }, [transactions]);

  const handleAddTransaction = (transaction: Transaction) => {
    const newTransactions = [...transactions, transaction];
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  const handleDeleteTransaction = (id: string) => {
    const newTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  const handleCategorizeTransaction = (transaction: Transaction) => {
    const category = mlModel.categorizeTransaction(transaction);
    const newTransactions = transactions.map((t) => {
      if (t.id === transaction.id) {
        return { ...t, category };
      }
      return t;
    });
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
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
                <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
                <button onClick={() => handleCategorizeTransaction(transaction)}>Categorize</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleAddTransaction({
        id: Math.random().toString(),
        description: "New Transaction",
        amount: 0,
        type: "income",
        category: "",
        date: new Date().toISOString().split("T")[0],
        recurring: false,
      })}>Add Transaction</button>
    </div>
  );
}

export default App;