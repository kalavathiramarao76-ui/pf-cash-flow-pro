import client;
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Home,
  BarChart3,
  Plus,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  Brush,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface RecurringItem {
  id: string;
  label: string;
  amount: number;
  type: "income" | "expense";
  frequency: "monthly" | "quarterly" | "yearly";
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  recurring: boolean;
}

const STORAGE_KEY = "cashflow_transactions";
const RECURRING_KEY = "cashflow_recurring_items";

const DEFAULT_RECURRING: RecurringItem[] = [
  { id: "r1", label: "Freelance Retainer", amount: 4500, type: "income", frequency: "monthly" },
  { id: "r2", label: "Office Rent", amount: 1200, type: "expense", frequency: "monthly" },
  { id: "r3", label: "Software Subscriptions", amount: 200, type: "expense", frequency: "monthly" },
  { id: "r4", label: "Annual Tax Payment", amount: 4000, type: "expense", frequency: "yearly" },
];

function getMonthlyEquivalent(item: RecurringItem): number {
  switch (item.frequency) {
    case "monthly": return item.amount;
    case "quarterly": return item.amount / 3;
    case "yearly": return item.amount / 12;
    default: return item.amount;
  }
}

export default function ForecastingPage() {
  const [mounted, setMounted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState("10000");
  const [horizon, setHorizon] = useState<3 | 6 | 12>(6);
  const [recurringItems, setRecurringItems] = useState<RecurringItem[]>([]);
  const [safetyThreshold, setSafetyThreshold] = useState("2000");

  const [newItem, setNewItem] = useState({
    label: "",
    amount: "",
    type: "income" as "income" | "expense",
    frequency: "monthly" as RecurringItem["frequency"],
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const forecastData = useMemo(() => {
    const data: { month: number; balance: number; income: number; expenses: number }[] = [];
    let balance = parseInt(currentBalance);
    for (let i = 0; i < horizon; i++) {
      let income = 0;
      let expenses = 0;
      recurringItems.forEach((item) => {
        if (item.type === "income") {
          income += getMonthlyEquivalent(item);
        } else {
          expenses += getMonthlyEquivalent(item);
        }
      });
      balance += income - expenses;
      data.push({ month: i + 1, balance, income, expenses });
    }
    return data;
  }, [currentBalance, horizon, recurringItems]);

  const handleDrillDown = (month: number) => {
    const monthData = forecastData.find((data) => data.month === month);
    if (monthData) {
      const incomeDetails = recurringItems
        .filter((item) => item.type === "income")
        .map((item) => ({ label: item.label, amount: getMonthlyEquivalent(item) }));
      const expenseDetails = recurringItems
        .filter((item) => item.type === "expense")
        .map((item) => ({ label: item.label, amount: getMonthlyEquivalent(item) }));
      console.log(`Drill down for month ${month}:`, {
        income: monthData.income,
        expenses: monthData.expenses,
        incomeDetails,
        expenseDetails,
      });
    }
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <div>
        <label>Current Balance:</label>
        <input
          type="number"
          value={currentBalance}
          onChange={(e) => setCurrentBalance(e.target.value)}
        />
      </div>
      <div>
        <label>Horizon:</label>
        <select value={horizon} onChange={(e) => setHorizon(parseInt(e.target.value) as 3 | 6 | 12)}>
          <option value="3">3 months</option>
          <option value="6">6 months</option>
          <option value="12">12 months</option>
        </select>
      </div>
      <div>
        <label>Safety Threshold:</label>
        <input
          type="number"
          value={safetyThreshold}
          onChange={(e) => setSafetyThreshold(e.target.value)}
        />
      </div>
      <div>
        <button onClick={() => setShowAddForm(!showAddForm)}>Add Recurring Item</button>
        {showAddForm && (
          <div>
            <label>Label:</label>
            <input
              type="text"
              value={newItem.label}
              onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
            />
            <label>Amount:</label>
            <input
              type="number"
              value={newItem.amount}
              onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
            />
            <label>Type:</label>
            <select
              value={newItem.type}
              onChange={(e) =>
                setNewItem({ ...newItem, type: e.target.value as "income" | "expense" })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <label>Frequency:</label>
            <select
              value={newItem.frequency}
              onChange={(e) =>
                setNewItem({ ...newItem, frequency: e.target.value as RecurringItem["frequency"] })
              }
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              onClick={() => {
                setRecurringItems([...recurringItems, { ...newItem, id: `r${recurringItems.length + 1}` }]);
                setNewItem({
                  label: "",
                  amount: "",
                  type: "income" as "income" | "expense",
                  frequency: "monthly" as RecurringItem["frequency"],
                });
              }}
            >
              Add
            </button>
          </div>
        )}
      </div>
      <div>
        <h2>Recurring Items:</h2>
        <ul>
          {recurringItems.map((item) => (
            <li key={item.id}>
              {item.label} ({item.type}) - {item.amount} ({item.frequency})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Forecast:</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="income" stroke="#82ca9d" />
            <Line type="monotone" dataKey="expenses" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        <ul>
          {forecastData.map((data) => (
            <li key={data.month}>
              Month {data.month}: Balance - {data.balance}, Income - {data.income}, Expenses - {data.expenses}
              <button onClick={() => handleDrillDown(data.month)}>Drill Down</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}