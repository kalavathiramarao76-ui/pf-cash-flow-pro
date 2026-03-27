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

  predictCashFlow(transactions: Transaction[]): number {
    const predictedIncome = this.predictIncome(transactions.filter(t => t.type === 'income'));
    const predictedExpense = this.predictExpense(transactions.filter(t => t.type === 'expense'));
    return predictedIncome - predictedExpense;
  }

  private predictIncome(transactions: Transaction[]): number {
    const amounts: number[] = [];
    transactions.forEach(transaction => {
      const category = transaction.category;
      if (this.incomeModel[category]) {
        const averageAmount = this.incomeModel[category].reduce((a, b) => a + b, 0) / this.incomeModel[category].length;
        amounts.push(averageAmount);
      }
    });
    return amounts.reduce((a, b) => a + b, 0);
  }

  private predictExpense(transactions: Transaction[]): number {
    const amounts: number[] = [];
    transactions.forEach(transaction => {
      const category = transaction.category;
      if (this.expenseModel[category]) {
        const averageAmount = this.expenseModel[category].reduce((a, b) => a + b, 0) / this.expenseModel[category].length;
        amounts.push(averageAmount);
      }
    });
    return amounts.reduce((a, b) => a + b, 0);
  }
}

function App() {
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

  const handleRemoveTransaction = (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  const handlePredictCashFlow = () => {
    if (mlModel) {
      const predictedCashFlow = mlModel.predictCashFlow(transactions);
      console.log(`Predicted cash flow: ${predictedCashFlow}`);
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
            <button onClick={() => handleRemoveTransaction(transaction.id)}>Remove</button>
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
        <button onClick={(e) => {
          e.preventDefault();
          const description = (document.querySelector('input[type="text"]') as HTMLInputElement).value;
          const amount = parseFloat((document.querySelector('input[type="number"]') as HTMLInputElement).value);
          const type = (document.querySelector('select') as HTMLSelectElement).value;
          const category = (document.querySelectorAll('select')[1] as HTMLSelectElement).value;
          const transaction: Transaction = {
            id: Math.random().toString(),
            description,
            amount,
            type: type as TransactionType,
            category,
            date: new Date().toISOString().split("T")[0],
            recurring: false,
          };
          handleAddTransaction(transaction);
        }}>Add Transaction</button>
      </form>
    </div>
  );
}

export default App;