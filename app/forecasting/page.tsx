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
  const [formErrors, setFormErrors] = useState({
    label: "",
    amount: "",
    type: "",
    frequency: "",
  });

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
      for (const item of recurringItems) {
        if (item.type === "income") {
          income += getMonthlyEquivalent(item);
        } else {
          expenses += getMonthlyEquivalent(item);
        }
      }
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

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = {
      label: "",
      amount: "",
      type: "",
      frequency: "",
    };
    if (!newItem.label) {
      errors.label = "Label is required";
    }
    if (!newItem.amount || isNaN(parseInt(newItem.amount))) {
      errors.amount = "Amount must be a number";
    }
    if (!newItem.type) {
      errors.type = "Type is required";
    }
    if (!newItem.frequency) {
      errors.frequency = "Frequency is required";
    }
    if (Object.values(errors).some((error) => error !== "")) {
      setFormErrors(errors);
      return;
    }
    const item: RecurringItem = {
      id: Math.random().toString(36).substr(2, 9),
      label: newItem.label,
      amount: parseInt(newItem.amount),
      type: newItem.type,
      frequency: newItem.frequency,
    };
    setRecurringItems([...recurringItems, item]);
    setNewItem({
      label: "",
      amount: "",
      type: "income" as "income" | "expense",
      frequency: "monthly" as RecurringItem["frequency"],
    });
    setShowAddForm(false);
  };

  const handleRemoveItem = (id: string) => {
    setRecurringItems(recurringItems.filter((item) => item.id !== id));
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
        <select value={horizon} onChange={(event) => setHorizon(parseInt(event.target.value) as 3 | 6 | 12)}>
          <option value="3">3 months</option>
          <option value="6">6 months</option>
          <option value="12">12 months</option>
        </select>
      </div>
      <div>
        <label>Safety Threshold:</label>
        <input type="number" value={safetyThreshold} onChange={(event) => setSafetyThreshold(event.target.value)} />
      </div>
      <h2>Recurring Items</h2>
      <button onClick={() => setShowAddForm(true)}>Add Item</button>
      {showAddForm && (
        <form onSubmit={handleAddItem}>
          <label>Label:</label>
          <input type="text" value={newItem.label} onChange={(event) => setNewItem({ ...newItem, label: event.target.value })} />
          {formErrors.label && <div style={{ color: "red" }}>{formErrors.label}</div>}
          <label>Amount:</label>
          <input type="number" value={newItem.amount} onChange={(event) => setNewItem({ ...newItem, amount: event.target.value })} />
          {formErrors.amount && <div style={{ color: "red" }}>{formErrors.amount}</div>}
          <label>Type:</label>
          <select value={newItem.type} onChange={(event) => setNewItem({ ...newItem, type: event.target.value as "income" | "expense" })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {formErrors.type && <div style={{ color: "red" }}>{formErrors.type}</div>}
          <label>Frequency:</label>
          <select value={newItem.frequency} onChange={(event) => setNewItem({ ...newItem, frequency: event.target.value as RecurringItem["frequency"] })}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          {formErrors.frequency && <div style={{ color: "red" }}>{formErrors.frequency}</div>}
          <button type="submit">Add Item</button>
        </form>
      )}
      <ul>
        {recurringItems.map((item) => (
          <li key={item.id}>
            <span>
              {item.label} ({item.type}) - {item.amount} ({item.frequency})
            </span>
            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h2>Forecast</h2>
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