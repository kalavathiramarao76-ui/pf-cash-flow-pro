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
      model[category] = transactions.filter(t => t.category === category).map(t => t.description);
    });
    return model;
  }

  public predictCategory(description: string, type: TransactionType): string {
    if (type === 'income') {
      for (const category in this.incomeModel) {
        if (this.incomeModel[category].some(d => d.includes(description))) {
          return category;
        }
      }
    } else {
      for (const category in this.expenseModel) {
        if (this.expenseModel[category].some(d => d.includes(description))) {
          return category;
        }
      }
    }
    return 'Other';
  }
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: '',
    description: '',
    amount: 0,
    type: 'income',
    category: '',
    date: '',
    recurring: false,
  });
  const [suggestedCategory, setSuggestedCategory] = useState<string>('');

  useEffect(() => {
    if (transactions.length > 0) {
      const model = new AdvancedMlModel(transactions);
      setSuggestedCategory(model.predictCategory(newTransaction.description, newTransaction.type));
    }
  }, [newTransaction.description, newTransaction.type, transactions]);

  const handleAddTransaction = () => {
    if (newTransaction.description && newTransaction.amount && newTransaction.type && newTransaction.category && newTransaction.date) {
      const newTransactions = [...transactions, newTransaction];
      setTransactions(newTransactions);
      saveTransactions(newTransactions);
      setNewTransaction({
        id: '',
        description: '',
        amount: 0,
        type: 'income',
        category: '',
        date: '',
        recurring: false,
      });
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  const handleUpdateTransaction = (id: string, updatedTransaction: Transaction) => {
    const newTransactions = transactions.map(t => t.id === id ? updatedTransaction : t);
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTransaction({ ...newTransaction, description: e.target.value });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewTransaction({ ...newTransaction, type: e.target.value as TransactionType });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewTransaction({ ...newTransaction, category: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTransaction({ ...newTransaction, date: e.target.value });
  };

  const handleRecurringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTransaction({ ...newTransaction, recurring: e.target.checked });
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <form>
        <label>
          Description:
          <input type="text" value={newTransaction.description} onChange={handleDescriptionChange} />
        </label>
        <label>
          Amount:
          <input type="number" value={newTransaction.amount} onChange={handleAmountChange} />
        </label>
        <label>
          Type:
          <select value={newTransaction.type} onChange={handleTypeChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label>
          Category:
          <select value={newTransaction.category} onChange={handleCategoryChange}>
            {newTransaction.type === 'income' ? CATEGORIES_INCOME.map(category => (
              <option key={category} value={category}>{category}</option>
            )) : CATEGORIES_EXPENSE.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {suggestedCategory && <p>Suggested category: {suggestedCategory}</p>}
        </label>
        <label>
          Date:
          <input type="date" value={newTransaction.date} onChange={handleDateChange} />
        </label>
        <label>
          Recurring:
          <input type="checkbox" checked={newTransaction.recurring} onChange={handleRecurringChange} />
        </label>
        <button type="button" onClick={handleAddTransaction}>Add Transaction</button>
      </form>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            <p>{transaction.description}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Type: {transaction.type}</p>
            <p>Category: {transaction.category}</p>
            <p>Date: {transaction.date}</p>
            <p>Recurring: {transaction.recurring ? 'Yes' : 'No'}</p>
            <button type="button" onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
            <button type="button" onClick={() => handleUpdateTransaction(transaction.id, { ...transaction, description: 'Updated description' })}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;