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

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({ start: 1, end: 6 });

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
    setSelectedMonth(month);
  };

  const handleResetDrillDown = () => {
    setSelectedMonth(null);
  };

  const drillDownData = useMemo(() => {
    if (selectedMonth === null) return null;
    const data = forecastData.find((item) => item.month === selectedMonth);
    if (!data) return null;
    const incomeBreakdown: { label: string; amount: number }[] = [];
    const expensesBreakdown: { label: string; amount: number }[] = [];
    recurringItems.forEach((item) => {
      if (item.type === "income") {
        incomeBreakdown.push({ label: item.label, amount: getMonthlyEquivalent(item) });
      } else {
        expensesBreakdown.push({ label: item.label, amount: getMonthlyEquivalent(item) });
      }
    });
    return { incomeBreakdown, expensesBreakdown };
  }, [selectedMonth, forecastData, recurringItems]);

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
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
          {forecastData.map((entry, index) => (
            <ReferenceLine key={index} x={entry.month} stroke="red" />
          ))}
          <Brush dataKey="month" height={30} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      {drillDownData && (
        <div>
          <h2>Drill Down: Month {selectedMonth}</h2>
          <h3>Income Breakdown:</h3>
          <ul>
            {drillDownData.incomeBreakdown.map((item) => (
              <li key={item.label}>
                {item.label}: ${item.amount}
              </li>
            ))}
          </ul>
          <h3>Expenses Breakdown:</h3>
          <ul>
            {drillDownData.expensesBreakdown.map((item) => (
              <li key={item.label}>
                {item.label}: ${item.amount}
              </li>
            ))}
          </ul>
          <button onClick={handleResetDrillDown}>Reset Drill Down</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Balance</th>
            <th>Income</th>
            <th>Expenses</th>
            <th>Drill Down</th>
          </tr>
        </thead>
        <tbody>
          {forecastData.map((entry) => (
            <tr key={entry.month}>
              <td>{entry.month}</td>
              <td>${entry.balance}</td>
              <td>${entry.income}</td>
              <td>${entry.expenses}</td>
              <td>
                <button onClick={() => handleDrillDown(entry.month)}>Drill Down</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}