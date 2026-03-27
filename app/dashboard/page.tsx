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
    categories.forEach((category) => {
      const categoryTransactions = transactions.filter(t => t.category === category);
      const amounts = categoryTransactions.map(t => t.amount);
      const dates = categoryTransactions.map(t => new Date(t.date).getTime());
      const regression = this.linearRegression(dates, amounts);
      model[category] = regression;
    });
    return model;
  }

  private linearRegression(x: number[], y: number[]): any {
    const n = x.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumXX += x[i] * x[i];
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  public predict(category: string, date: number): number {
    if (category in this.incomeModel) {
      const regression = this.incomeModel[category];
      return regression.slope * date + regression.intercept;
    } else if (category in this.expenseModel) {
      const regression = this.expenseModel[category];
      return regression.slope * date + regression.intercept;
    } else {
      return 0;
    }
  }
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const mlModel = new AdvancedMlModel(transactions);

  const predictCashFlow = (date: number) => {
    let totalIncome = 0;
    let totalExpense = 0;
    Object.keys(mlModel.incomeModel).forEach(category => {
      totalIncome += mlModel.predict(category, date);
    });
    Object.keys(mlModel.expenseModel).forEach(category => {
      totalExpense += mlModel.predict(category, date);
    });
    return totalIncome - totalExpense;
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <p>Predicted cash flow for next month: {predictCashFlow(new Date(Date.now() + 30 * 86400000).getTime())}</p>
    </div>
  );
}

export default App;