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

  const [whatIfScenario, setWhatIfScenario] = useState({
    label: "",
    amount: "",
    type: "income" as "income" | "expense",
    frequency: "monthly" as RecurringItem["frequency"],
  });
  const [showWhatIfForm, setShowWhatIfForm] = useState(false);
  const [whatIfResults, setWhatIfResults] = useState({
    data: [],
    balance: 0,
  });

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

  const whatIfForecastData = useMemo(() => {
    if (!whatIfScenario.label || !whatIfScenario.amount) return [];
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
      if (whatIfScenario.type === "income") {
        income += getMonthlyEquivalent({ ...whatIfScenario, id: "what-if" });
      } else {
        expenses += getMonthlyEquivalent({ ...whatIfScenario, id: "what-if" });
      }
      balance += income - expenses;
      data.push({ month: i + 1, balance, income, expenses });
    }
    return data;
  }, [currentBalance, horizon, recurringItems, whatIfScenario]);

  const handleWhatIfSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWhatIfResults({
      data: whatIfForecastData,
      balance: whatIfForecastData[whatIfForecastData.length - 1].balance,
    });
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <button onClick={() => setShowWhatIfForm(!showWhatIfForm)}>What-If Scenario</button>
      {showWhatIfForm && (
        <form onSubmit={handleWhatIfSubmit}>
          <label>
            Label:
            <input type="text" value={whatIfScenario.label} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, label: e.target.value })} />
          </label>
          <label>
            Amount:
            <input type="number" value={whatIfScenario.amount} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, amount: e.target.valueAsNumber })} />
          </label>
          <label>
            Type:
            <select value={whatIfScenario.type} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, type: e.target.value as "income" | "expense" })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label>
            Frequency:
            <select value={whatIfScenario.frequency} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, frequency: e.target.value as RecurringItem["frequency"] })}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>
          <button type="submit">Run Scenario</button>
        </form>
      )}
      {whatIfResults.data.length > 0 && (
        <div>
          <h2>What-If Scenario Results</h2>
          <p>Final Balance: {whatIfResults.balance}</p>
          <LineChart width={500} height={300} data={whatIfResults.data}>
            <Line type="monotone" dataKey="balance" stroke="#8884d8" />
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid stroke="#ccc" />
            <Tooltip />
            <Legend />
          </LineChart>
        </div>
      )}
      <LineChart width={500} height={300} data={forecastData}>
        <Line type="monotone" dataKey="balance" stroke="#8884d8" />
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid stroke="#ccc" />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
}