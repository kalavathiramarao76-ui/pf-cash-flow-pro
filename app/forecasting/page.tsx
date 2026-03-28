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
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter } from "victory";

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
      data.push({
        month: i + 1,
        balance,
        income,
        expenses,
      });
    }
    return data;
  }, [currentBalance, horizon, recurringItems]);

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
  };

  const handleDateRangeChange = (start: number, end: number) => {
    setDateRange({ start, end });
  };

  const handleWhatIfScenarioChange = (scenario: any) => {
    setWhatIfScenario(scenario);
  };

  const handleWhatIfFormSubmit = (event: any) => {
    event.preventDefault();
    const scenario = whatIfScenario;
    const data = forecastData.map((point) => ({ ...point }));
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
      if (scenario.type === "income") {
        income += getMonthlyEquivalent(scenario);
      } else {
        expenses += getMonthlyEquivalent(scenario);
      }
      balance += income - expenses;
      data[i].balance = balance;
      data[i].income = income;
      data[i].expenses = expenses;
    }
    setWhatIfResults({ data, balance });
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <div>
        <label>Current Balance:</label>
        <input type="number" value={currentBalance} onChange={(event) => setCurrentBalance(event.target.value)} />
      </div>
      <div>
        <label>Horizon:</label>
        <select value={horizon} onChange={(event) => setHorizon(event.target.value as 3 | 6 | 12)}>
          <option value={3}>3 months</option>
          <option value={6}>6 months</option>
          <option value={12}>12 months</option>
        </select>
      </div>
      <div>
        <label>Recurring Items:</label>
        <ul>
          {recurringItems.map((item) => (
            <li key={item.id}>
              {item.label} ({item.type}) - {item.amount} ({item.frequency})
            </li>
          ))}
        </ul>
        <button onClick={() => setShowAddForm(true)}>Add New Item</button>
        {showAddForm && (
          <form onSubmit={(event) => {
            event.preventDefault();
            const newItem = {
              id: Math.random().toString(36).substr(2, 9),
              label: event.target.label.value,
              amount: parseInt(event.target.amount.value),
              type: event.target.type.value as "income" | "expense",
              frequency: event.target.frequency.value as RecurringItem["frequency"],
            };
            setRecurringItems([...recurringItems, newItem]);
            setShowAddForm(false);
          }}>
            <label>Label:</label>
            <input type="text" name="label" />
            <label>Amount:</label>
            <input type="number" name="amount" />
            <label>Type:</label>
            <select name="type">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <label>Frequency:</label>
            <select name="frequency">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button type="submit">Add</button>
          </form>
        )}
      </div>
      <div>
        <label>Safety Threshold:</label>
        <input type="number" value={safetyThreshold} onChange={(event) => setSafetyThreshold(event.target.value)} />
      </div>
      <div>
        <h2>Forecast</h2>
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
        <button onClick={() => handleMonthSelect(1)}>Select Month 1</button>
        <button onClick={() => handleDateRangeChange(1, 3)}>Select Date Range 1-3</button>
      </div>
      <div>
        <h2>What-If Scenario</h2>
        <form onSubmit={handleWhatIfFormSubmit}>
          <label>Label:</label>
          <input type="text" value={whatIfScenario.label} onChange={(event) => handleWhatIfScenarioChange({ ...whatIfScenario, label: event.target.value })} />
          <label>Amount:</label>
          <input type="number" value={whatIfScenario.amount} onChange={(event) => handleWhatIfScenarioChange({ ...whatIfScenario, amount: event.target.value })} />
          <label>Type:</label>
          <select value={whatIfScenario.type} onChange={(event) => handleWhatIfScenarioChange({ ...whatIfScenario, type: event.target.value as "income" | "expense" })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <label>Frequency:</label>
          <select value={whatIfScenario.frequency} onChange={(event) => handleWhatIfScenarioChange({ ...whatIfScenario, frequency: event.target.value as RecurringItem["frequency"] })}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button type="submit">Run Scenario</button>
        </form>
        {whatIfResults.data.length > 0 && (
          <div>
            <h3>Results</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={whatIfResults.data}>
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
          </div>
        )}
      </div>
    </div>
  );
}