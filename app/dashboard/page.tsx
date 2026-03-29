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

import * as tf from '@tensorflow/tfjs';

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
  private incomeModel: tf.Sequential;
  private expenseModel: tf.Sequential;

  constructor(transactions: Transaction[]) {
    this.incomeModel = this.trainModel(CATEGORIES_INCOME, transactions.filter(t => t.type === 'income'));
    this.expenseModel = this.trainModel(CATEGORIES_EXPENSE, transactions.filter(t => t.type === 'expense'));
  }

  private trainModel(categories: string[], transactions: Transaction[]): tf.Sequential {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [1] }));
    model.add(tf.layers.dense({ units: categories.length, activation: 'softmax' }));
    model.compile({ optimizer: tf.optimizers.adam(), loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

    const xs = transactions.map(t => [t.amount]);
    const ys = transactions.map(t => categories.indexOf(t.category));

    const xsTensor = tf.tensor2d(xs, [xs.length, 1]);
    const ysTensor = tf.tensor2d(ys.map(y => {
      const arr = new Array(categories.length).fill(0);
      arr[y] = 1;
      return arr;
    }), [ys.length, categories.length]);

    model.fit(xsTensor, ysTensor, { epochs: 100 });

    return model;
  }

  public categorize(transaction: Transaction): string {
    const xsTensor = tf.tensor2d([[transaction.amount]], [1, 1]);
    const prediction = this[transaction.type === 'income' ? 'incomeModel' : 'expenseModel'].predict(xsTensor);
    const categoryIndex = prediction.argMax(1).dataSync()[0];
    return transaction.type === 'income' ? CATEGORIES_INCOME[categoryIndex] : CATEGORIES_EXPENSE[categoryIndex];
  }
}

function App() {
  const [transactions, setTransactions] = useState(getStoredTransactions());

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const mlModel = new AdvancedMlModel(transactions);

  const handleAddTransaction = (transaction: Transaction) => {
    const categorizedTransaction = { ...transaction, category: mlModel.categorize(transaction) };
    setTransactions([...transactions, categorizedTransaction]);
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <button onClick={() => handleAddTransaction({ id: Date.now().toString(), description: 'New Transaction', amount: 100, type: 'income', date: new Date().toISOString().split("T")[0], recurring: false })}>
        Add Transaction
      </button>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.description} - {transaction.amount} - {transaction.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;