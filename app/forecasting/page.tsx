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

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
  };

  const handleDateRangeChange = (start: number, end: number) => {
    setDateRange({ start, end });
  };

  const handleWhatIfScenarioChange = (label: string, amount: string, type: "income" | "expense", frequency: RecurringItem["frequency"]) => {
    setWhatIfScenario({ label, amount, type, frequency });
  };

  const handleWhatIfFormSubmit = () => {
    const whatIfData = forecastData.map((item) => {
      const monthlyEquivalent = getMonthlyEquivalent({ label: whatIfScenario.label, amount: parseInt(whatIfScenario.amount), type: whatIfScenario.type, frequency: whatIfScenario.frequency });
      if (whatIfScenario.type === "income") {
        item.income += monthlyEquivalent;
      } else {
        item.expenses += monthlyEquivalent;
      }
      return item;
    });
    setWhatIfResults({ data: whatIfData, balance: whatIfData.reduce((acc, item) => acc + item.balance, 0) });
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={forecastData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="balance" stroke="#8884d8" />
          <Line type="monotone" dataKey="income" stroke="#82ca9d" />
          <Line type="monotone" dataKey="expenses" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <div>
        <button onClick={() => handleMonthSelect(1)}>Select Month 1</button>
        <button onClick={() => handleMonthSelect(2)}>Select Month 2</button>
        <button onClick={() => handleMonthSelect(3)}>Select Month 3</button>
      </div>
      <div>
        <input type="number" value={dateRange.start} onChange={(e) => handleDateRangeChange(parseInt(e.target.value), dateRange.end)} />
        <input type="number" value={dateRange.end} onChange={(e) => handleDateRangeChange(dateRange.start, parseInt(e.target.value))} />
      </div>
      <div>
        <input type="text" value={whatIfScenario.label} onChange={(e) => handleWhatIfScenarioChange(e.target.value, whatIfScenario.amount, whatIfScenario.type, whatIfScenario.frequency)} />
        <input type="number" value={whatIfScenario.amount} onChange={(e) => handleWhatIfScenarioChange(whatIfScenario.label, e.target.value, whatIfScenario.type, whatIfScenario.frequency)} />
        <select value={whatIfScenario.type} onChange={(e) => handleWhatIfScenarioChange(whatIfScenario.label, whatIfScenario.amount, e.target.value as "income" | "expense", whatIfScenario.frequency)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={whatIfScenario.frequency} onChange={(e) => handleWhatIfScenarioChange(whatIfScenario.label, whatIfScenario.amount, whatIfScenario.type, e.target.value as RecurringItem["frequency"])}>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button onClick={handleWhatIfFormSubmit}>Run What-If Scenario</button>
      </div>
      {whatIfResults.data.length > 0 && (
        <div>
          <h2>What-If Scenario Results</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={whatIfResults.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="balance" stroke="#8884d8" />
              <Line type="monotone" dataKey="income" stroke="#82ca9d" />
              <Line type="monotone" dataKey="expenses" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}