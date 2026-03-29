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
    const xs: number[][] = [];
    const ys: number[][] = [];

    transactions.forEach(t => {
      const categoryIndex = categories.indexOf(t.category);
      const amount = t.amount;
      xs.push([amount]);
      ys.push([categoryIndex]);
    });

    const xTensor = tf.tensor2d(xs, [xs.length, 1]);
    const yTensor = tf.tensor2d(ys, [ys.length, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [1] }));
    model.add(tf.layers.dense({ units: categories.length, activation: 'softmax' }));
    model.compile({ optimizer: tf.optimizers.adam(), loss: 'meanSquaredError' });

    model.fit(xTensor, yTensor, { epochs: 100 });

    return model;
  }

  predict(transaction: Transaction): string {
    const amount = transaction.amount;
    const xTensor = tf.tensor2d([[amount]], [1, 1]);

    if (transaction.type === 'income') {
      const prediction = this.incomeModel.predict(xTensor);
      const categoryIndex = prediction.argMax(1).dataSync()[0];
      return CATEGORIES_INCOME[categoryIndex];
    } else {
      const prediction = this.expenseModel.predict(xTensor);
      const categoryIndex = prediction.argMax(1).dataSync()[0];
      return CATEGORIES_EXPENSE[categoryIndex];
    }
  }
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const mlModel = new AdvancedMlModel(transactions);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const handleRemoveTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handlePredictCategory = (transaction: Transaction) => {
    const predictedCategory = mlModel.predict(transaction);
    console.log(`Predicted category: ${predictedCategory}`);
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            <span>{t.description}</span>
            <span>{t.amount}</span>
            <span>{t.category}</span>
            <button onClick={() => handleRemoveTransaction(t.id)}>Remove</button>
            <button onClick={() => handlePredictCategory(t)}>Predict Category</button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleAddTransaction({ id: 'new', description: 'New transaction', amount: 100, type: 'income', category: 'Freelance / Contract', date: new Date().toISOString().split("T")[0], recurring: true })}>Add Transaction</button>
    </div>
  );
}

export default App;