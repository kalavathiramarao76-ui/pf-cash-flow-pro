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
      model[category] = transactions.filter(t => t.category === category).map(t => t.amount);
    });
    return model;
  }

  predictFutureCashFlow(transactions: Transaction[], days: number): number {
    const futureCashFlow: number[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() + i * 86400000);
      const income = this.predictIncome(transactions, date);
      const expense = this.predictExpense(transactions, date);
      futureCashFlow.push(income - expense);
    }
    return futureCashFlow.reduce((a, b) => a + b, 0);
  }

  private predictIncome(transactions: Transaction[], date: Date): number {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const category = this.getCategory(incomeTransactions, date);
    if (category) {
      const amounts = this.incomeModel[category];
      if (amounts) {
        return amounts.reduce((a, b) => a + b, 0) / amounts.length;
      }
    }
    return 0;
  }

  private predictExpense(transactions: Transaction[], date: Date): number {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const category = this.getCategory(expenseTransactions, date);
    if (category) {
      const amounts = this.expenseModel[category];
      if (amounts) {
        return amounts.reduce((a, b) => a + b, 0) / amounts.length;
      }
    }
    return 0;
  }

  private getCategory(transactions: Transaction[], date: Date): string | null {
    const transaction = transactions.find(t => new Date(t.date).getTime() === date.getTime());
    if (transaction) {
      return transaction.category;
    }
    return null;
  }
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());
  const [futureCashFlow, setFutureCashFlow] = useState<number>(0);

  useEffect(() => {
    const mlModel = new AdvancedMlModel(transactions);
    const futureCashFlow = mlModel.predictFutureCashFlow(transactions, 30);
    setFutureCashFlow(futureCashFlow);
  }, [transactions]);

  const handleAddTransaction = (transaction: Transaction) => {
    const newTransactions = [...transactions, transaction];
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  const handleRemoveTransaction = (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <p>Future Cash Flow: {futureCashFlow}</p>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            <span>{transaction.description}</span>
            <span>{transaction.amount}</span>
            <span>{transaction.category}</span>
            <span>{transaction.date}</span>
            <button onClick={() => handleRemoveTransaction(transaction.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleAddTransaction({
        id: Math.random().toString(),
        description: 'New Transaction',
        amount: 100,
        type: 'income',
        category: 'Freelance / Contract',
        date: new Date().toISOString().split("T")[0],
        recurring: false,
      })}>Add Transaction</button>
    </div>
  );
}

export default App;