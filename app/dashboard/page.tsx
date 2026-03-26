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

  public predict(transaction: Transaction): string {
    if (transaction.type === "income") {
      const category = this.incomeModel[transaction.category];
      if (category) {
        return `Predicted income category: ${category}`;
      }
    } else {
      const category = this.expenseModel[transaction.category];
      if (category) {
        return `Predicted expense category: ${category}`;
      }
    }
    return "Unable to predict category";
  }
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: "",
    description: "",
    amount: 0,
    type: "income",
    category: "",
    date: "",
    recurring: false,
  });
  const [mlModel, setMlModel] = useState<AdvancedMlModel>(new AdvancedMlModel());

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const handleAddTransaction = () => {
    setTransactions([...transactions, newTransaction]);
    setNewTransaction({
      id: "",
      description: "",
      amount: 0,
      type: "income",
      category: "",
      date: "",
      recurring: false,
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const handlePredictCategory = (transaction: Transaction) => {
    const prediction = mlModel.predict(transaction);
    console.log(prediction);
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
                <button onClick={() => handlePredictCategory(transaction)}>
                  Predict Category
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form>
        <label>
          Description:
          <input
            type="text"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
          />
        </label>
        <label>
          Type:
          <select
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as TransactionType })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label>
          Category:
          <select
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
          >
            {newTransaction.type === "income" ? (
              CATEGORIES_INCOME.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            ) : (
              CATEGORIES_EXPENSE.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            )}
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
          />
        </label>
        <label>
          Recurring:
          <input
            type="checkbox"
            checked={newTransaction.recurring}
            onChange={(e) => setNewTransaction({ ...newTransaction, recurring: e.target.checked })}
          />
        </label>
        <button type="button" onClick={handleAddTransaction}>
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default App;