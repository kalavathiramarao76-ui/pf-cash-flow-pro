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
    model.add(tf.layers.embedding({ inputDim: categories.length, outputDim: 10, inputLength: 1 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: categories.length, activation: 'softmax' }));
    model.compile({ optimizer: tf.optimizers.adam(), loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

    const descriptions = transactions.map(t => t.description);
    const labels = transactions.map(t => categories.indexOf(t.category));

    const xs = tf.tensor1d(descriptions.map(d => categories.indexOf(d)), 'int32');
    const ys = tf.tensor1d(labels, 'int32');

    model.fit(xs, ys, { epochs: 100 });

    return model;
  }

  public categorize(description: string, type: TransactionType): string {
    const categories = type === 'income' ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;
    const xs = tf.tensor1d([categories.indexOf(description)], 'int32');
    const prediction = this.incomeModel.predict(xs);
    const categoryIndex = prediction.argMax(1).dataSync()[0];
    return categories[categoryIndex];
  }
}

function App() {
  const [transactions, setTransactions] = useState(getStoredTransactions());
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState(0);
  const [newType, setNewType] = useState('income' as TransactionType);
  const [newCategory, setNewCategory] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newRecurring, setNewRecurring] = useState(false);

  const mlModel = new AdvancedMlModel(transactions);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: newDescription,
      amount: newAmount,
      type: newType,
      category: newCategory || mlModel.categorize(newDescription, newType),
      date: newDate,
      recurring: newRecurring,
    };
    setTransactions([...transactions, newTransaction]);
    setNewDescription('');
    setNewAmount(0);
    setNewType('income');
    setNewCategory('');
    setNewDate('');
    setNewRecurring(false);
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <form>
        <label>
          Description:
          <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
        </label>
        <br />
        <label>
          Amount:
          <input type="number" value={newAmount} onChange={(e) => setNewAmount(Number(e.target.value))} />
        </label>
        <br />
        <label>
          Type:
          <select value={newType} onChange={(e) => setNewType(e.target.value as TransactionType)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <br />
        <label>
          Category:
          <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        </label>
        <br />
        <label>
          Date:
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
        </label>
        <br />
        <label>
          Recurring:
          <input type="checkbox" checked={newRecurring} onChange={(e) => setNewRecurring(e.target.checked)} />
        </label>
        <br />
        <button type="button" onClick={handleAddTransaction}>Add Transaction</button>
      </form>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.description} - {transaction.amount} - {transaction.type} - {transaction.category} - {transaction.date} - {transaction.recurring ? 'Recurring' : 'Non-Recurring'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;