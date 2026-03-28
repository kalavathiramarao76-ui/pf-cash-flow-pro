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

  predictCashFlow(transactions: Transaction[], days: number): number {
    const predictedIncome: number[] = [];
    const predictedExpense: number[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() + i * 86400000);
      const incomeTransactions = transactions.filter(t => t.type === 'income' && t.recurring);
      const expenseTransactions = transactions.filter(t => t.type === 'expense' && t.recurring);
      let predictedIncomeAmount = 0;
      incomeTransactions.forEach(transaction => {
        if (new Date(transaction.date).getDate() === date.getDate()) {
          predictedIncomeAmount += transaction.amount;
        }
      });
      predictedIncome.push(predictedIncomeAmount);
      let predictedExpenseAmount = 0;
      expenseTransactions.forEach(transaction => {
        if (new Date(transaction.date).getDate() === date.getDate()) {
          predictedExpenseAmount += transaction.amount;
        }
      });
      predictedExpense.push(predictedExpenseAmount);
    }
    const predictedCashFlow = predictedIncome.reduce((a, b) => a + b, 0) - predictedExpense.reduce((a, b) => a + b, 0);
    return predictedCashFlow;
  }
}

function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());
  const [mlModel, setMlModel] = useState<AdvancedMlModel | null>(null);

  useEffect(() => {
    if (transactions.length > 0) {
      const model = new AdvancedMlModel(transactions);
      setMlModel(model);
    }
  }, [transactions]);

  const handleAddTransaction = (transaction: Transaction) => {
    const newTransactions = [...transactions, transaction];
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  const handleDeleteTransaction = (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  const handlePredictCashFlow = () => {
    if (mlModel) {
      const predictedCashFlow = mlModel.predictCashFlow(transactions, 30);
      console.log(`Predicted cash flow for the next 30 days: ${predictedCashFlow}`);
    }
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <button onClick={handlePredictCashFlow}>Predict Cash Flow</button>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            <span>{transaction.description}</span>
            <span>{transaction.amount}</span>
            <span>{transaction.category}</span>
            <span>{transaction.date}</span>
            <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form>
        <input type="text" placeholder="Description" />
        <input type="number" placeholder="Amount" />
        <select>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select>
          {CATEGORIES_INCOME.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
          {CATEGORIES_EXPENSE.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input type="date" placeholder="Date" />
        <button type="submit" onClick={(e) => {
          e.preventDefault();
          const transaction: Transaction = {
            id: Math.random().toString(),
            description: (document.querySelector('input[type="text"]') as HTMLInputElement).value,
            amount: parseFloat((document.querySelector('input[type="number"]') as HTMLInputElement).value),
            type: (document.querySelector('select') as HTMLSelectElement).value as TransactionType,
            category: (document.querySelectorAll('select')[1] as HTMLSelectElement).value,
            date: (document.querySelector('input[type="date"]') as HTMLInputElement).value,
            recurring: false,
          };
          handleAddTransaction(transaction);
        }}>Add Transaction</button>
      </form>
    </div>
  );
}

export default DashboardPage;