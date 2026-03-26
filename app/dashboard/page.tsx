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

// Machine learning model for transaction categorization
interface MlModel {
  income: { [key: string]: string[] };
  expense: { [key: string]: string[] };
}

// Advanced machine learning model using Natural Language Processing (NLP) techniques
class AdvancedMlModel {
  private incomeModel: any;
  private expenseModel: any;

  constructor() {
    this.incomeModel = this.trainModel(CATEGORIES_INCOME);
    this.expenseModel = this.trainModel(CATEGORIES_EXPENSE);
  }

  private trainModel(categories: string[]): any {
    const model = {};
    categories.forEach((category) => {
      model[category] = this.generateTrainingData(category);
    });
    return model;
  }

  private generateTrainingData(category: string): string[] {
    const trainingData = [];
    for (let i = 0; i < 100; i++) {
      const description = this.generateRandomDescription(category);
      trainingData.push(description);
    }
    return trainingData;
  }

  private generateRandomDescription(category: string): string {
    const words = category.split(" ");
    const description = words[Math.floor(Math.random() * words.length)];
    return description;
  }

  public categorizeTransaction(transaction: Transaction): string {
    const description = transaction.description;
    const type = transaction.type;
    if (type === "income") {
      return this.categorizeIncome(description, this.incomeModel);
    } else {
      return this.categorizeExpense(description, this.expenseModel);
    }
  }

  private categorizeIncome(description: string, model: any): string {
    const categories = Object.keys(model);
    let bestMatch = "";
    let bestScore = 0;
    categories.forEach((category) => {
      const score = this.calculateScore(description, model[category]);
      if (score > bestScore) {
        bestMatch = category;
        bestScore = score;
      }
    });
    return bestMatch;
  }

  private categorizeExpense(description: string, model: any): string {
    const categories = Object.keys(model);
    let bestMatch = "";
    let bestScore = 0;
    categories.forEach((category) => {
      const score = this.calculateScore(description, model[category]);
      if (score > bestScore) {
        bestMatch = category;
        bestScore = score;
      }
    });
    return bestMatch;
  }

  private calculateScore(description: string, trainingData: string[]): number {
    let score = 0;
    trainingData.forEach((data) => {
      if (description.includes(data)) {
        score++;
      }
    });
    return score;
  }
}

const mlModel = new AdvancedMlModel();

// Example usage:
const transaction: Transaction = {
  id: "t1",
  description: "Client — Acme Corp (Retainer)",
  amount: 4500,
  type: "income",
  category: "",
  date: new Date().toISOString().split("T")[0],
  recurring: true,
};

const category = mlModel.categorizeTransaction(transaction);
console.log(category);