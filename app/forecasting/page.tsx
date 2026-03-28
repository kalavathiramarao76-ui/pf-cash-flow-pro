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
      data.push({ month: i + 1, balance, income, expenses });
    }
    return data;
  }, [currentBalance, horizon, recurringItems]);

  const handleDrillDown = (month: number) => {
    setSelectedMonth(month);
    const monthData = forecastData.find((item) => item.month === month);
    if (monthData) {
      const incomeBreakdown = recurringItems
        .filter((item) => item.type === "income")
        .map((item) => ({ label: item.label, amount: getMonthlyEquivalent(item) }));
      const expensesBreakdown = recurringItems
        .filter((item) => item.type === "expense")
        .map((item) => ({ label: item.label, amount: getMonthlyEquivalent(item) }));
      const breakdownData = [...incomeBreakdown, ...expensesBreakdown];
      const chartData = breakdownData.map((item) => ({ label: item.label, amount: item.amount }));
      return (
        <div>
          <h2>Breakdown for Month {month}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    }
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <div>
        <label>Current Balance:</label>
        <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} />
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
        <input type="number" value={safetyThreshold} onChange={(e) => setSafetyThreshold(e.target.value)} />
      </div>
      <div>
        <h2>Recurring Items</h2>
        <button onClick={() => setShowAddForm(true)}>Add New Item</button>
        {showAddForm && (
          <div>
            <label>Label:</label>
            <input type="text" value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} />
            <label>Amount:</label>
            <input type="number" value={newItem.amount} onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })} />
            <label>Type:</label>
            <select value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value as "income" | "expense" })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <label>Frequency:</label>
            <select value={newItem.frequency} onChange={(e) => setNewItem({ ...newItem, frequency: e.target.value as RecurringItem["frequency"] })}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button onClick={() => setRecurringItems([...recurringItems, newItem])}>Add Item</button>
          </div>
        )}
        <ul>
          {recurringItems.map((item) => (
            <li key={item.id}>
              {item.label} ({item.type}) - {item.amount} ({item.frequency})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Forecast</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <Line type="monotone" dataKey="balance" stroke="#8884d8" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
        {selectedMonth && handleDrillDown(selectedMonth)}
      </div>
      <div>
        <h2>What-If Scenario</h2>
        <button onClick={() => setShowWhatIfForm(true)}>Run Scenario</button>
        {showWhatIfForm && (
          <div>
            <label>Label:</label>
            <input type="text" value={whatIfScenario.label} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, label: e.target.value })} />
            <label>Amount:</label>
            <input type="number" value={whatIfScenario.amount} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, amount: e.target.value })} />
            <label>Type:</label>
            <select value={whatIfScenario.type} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, type: e.target.value as "income" | "expense" })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <label>Frequency:</label>
            <select value={whatIfScenario.frequency} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, frequency: e.target.value as RecurringItem["frequency"] })}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button onClick={() => {
              const scenarioItem: RecurringItem = {
                id: "what-if",
                label: whatIfScenario.label,
                amount: parseInt(whatIfScenario.amount),
                type: whatIfScenario.type,
                frequency: whatIfScenario.frequency,
              };
              const scenarioData = forecastData.map((item) => ({ ...item }));
              scenarioData.forEach((item) => {
                if (scenarioItem.type === "income") {
                  item.balance += getMonthlyEquivalent(scenarioItem);
                } else {
                  item.balance -= getMonthlyEquivalent(scenarioItem);
                }
              });
              setWhatIfResults({ data: scenarioData, balance: scenarioData[scenarioData.length - 1].balance });
            }}>Run Scenario</button>
          </div>
        )}
        {whatIfResults.data.length > 0 && (
          <div>
            <h3>Scenario Results</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={whatIfResults.data}>
                <Line type="monotone" dataKey="balance" stroke="#8884d8" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
            <p>Final Balance: {whatIfResults.balance}</p>
          </div>
        )}
      </div>
    </div>
  );
}