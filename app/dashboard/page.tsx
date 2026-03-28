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

  constructor(transactions: Transaction[]) {
    this.incomeModel = this.trainModel(CATEGORIES_INCOME, transactions.filter(t => t.type === 'income'));
    this.expenseModel = this.trainModel(CATEGORIES_EXPENSE, transactions.filter(t => t.type === 'expense'));
  }

  private trainModel(categories: string[], transactions: Transaction[]): any {
    const model: any = {};
    categories.forEach(category => {
      model[category] = transactions.filter(t => t.category === category).map(t => t.date);
    });
    return model;
  }

  predictFutureTransactions(transactions: Transaction[], days: number): Transaction[] {
    const futureTransactions: Transaction[] = [];
    const today = new Date();
    for (let i = 1; i <= days; i++) {
      const date = new Date(today.getTime() + i * 86400000);
      const dateStr = date.toISOString().split("T")[0];
      Object.keys(this.incomeModel).forEach(category => {
        if (this.incomeModel[category].includes(dateStr)) {
          futureTransactions.push({
            id: `predicted-${i}`,
            description: `Predicted Income - ${category}`,
            amount: 1000,
            type: 'income',
            category,
            date: dateStr,
            recurring: true,
          });
        }
      });
      Object.keys(this.expenseModel).forEach(category => {
        if (this.expenseModel[category].includes(dateStr)) {
          futureTransactions.push({
            id: `predicted-${i}`,
            description: `Predicted Expense - ${category}`,
            amount: 500,
            type: 'expense',
            category,
            date: dateStr,
            recurring: true,
          });
        }
      });
    }
    return futureTransactions;
  }
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());
  const [futureTransactions, setFutureTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const mlModel = new AdvancedMlModel(transactions);

  const handlePredictFutureTransactions = () => {
    const futureTransactions = mlModel.predictFutureTransactions(transactions, 30);
    setFutureTransactions(futureTransactions);
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <button onClick={handlePredictFutureTransactions}>Predict Future Transactions</button>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.description} - {transaction.amount} - {transaction.date}
          </li>
        ))}
      </ul>
      <h2>Future Transactions</h2>
      <ul>
        {futureTransactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.description} - {transaction.amount} - {transaction.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;