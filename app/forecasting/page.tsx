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
import { InteractiveLineChart } from "../components/InteractiveLineChart";
import { ScenarioPlanningTool } from "../components/ScenarioPlanningTool";

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
  });

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 0; i < horizon; i++) {
      const month = i + 1;
      const balance = parseInt(currentBalance);
      const income = recurringItems
        .filter((item) => item.type === "income")
        .reduce((acc, item) => acc + getMonthlyEquivalent(item), 0);
      const expenses = recurringItems
        .filter((item) => item.type === "expense")
        .reduce((acc, item) => acc + getMonthlyEquivalent(item), 0);
      const netCashFlow = income - expenses;
      const newBalance = balance + netCashFlow;
      data.push({
        month,
        balance: newBalance,
        income,
        expenses,
        netCashFlow,
      });
    }
    return data;
  }, [currentBalance, horizon, recurringItems]);

  const handleAddRecurringItem = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      label: newItem.label,
      amount: parseInt(newItem.amount),
      type: newItem.type,
      frequency: newItem.frequency,
    };
    setRecurringItems([...recurringItems, newItem]);
    setNewItem({
      label: "",
      amount: "",
      type: "income",
      frequency: "monthly",
    });
    setShowAddForm(false);
  };

  const handleRemoveRecurringItem = (id: string) => {
    setRecurringItems(recurringItems.filter((item) => item.id !== id));
  };

  const handleWhatIfScenario = () => {
    const scenarioItem = {
      id: Math.random().toString(36).substr(2, 9),
      label: whatIfScenario.label,
      amount: parseInt(whatIfScenario.amount),
      type: whatIfScenario.type,
      frequency: whatIfScenario.frequency,
    };
    const newRecurringItems = [...recurringItems, scenarioItem];
    const scenarioData = [];
    for (let i = 0; i < horizon; i++) {
      const month = i + 1;
      const balance = parseInt(currentBalance);
      const income = newRecurringItems
        .filter((item) => item.type === "income")
        .reduce((acc, item) => acc + getMonthlyEquivalent(item), 0);
      const expenses = newRecurringItems
        .filter((item) => item.type === "expense")
        .reduce((acc, item) => acc + getMonthlyEquivalent(item), 0);
      const netCashFlow = income - expenses;
      const newBalance = balance + netCashFlow;
      scenarioData.push({
        month,
        balance: newBalance,
        income,
        expenses,
        netCashFlow,
      });
    }
    setWhatIfResults({ data: scenarioData });
    setShowWhatIfForm(false);
  };

  useEffect(() => {
    const storedRecurringItems = localStorage.getItem(RECURRING_KEY);
    if (storedRecurringItems) {
      setRecurringItems(JSON.parse(storedRecurringItems));
    } else {
      setRecurringItems(DEFAULT_RECURRING);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RECURRING_KEY, JSON.stringify(recurringItems));
  }, [recurringItems]);

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
        <label>Horizon (months):</label>
        <select value={horizon} onChange={(e) => setHorizon(parseInt(e.target.value))}>
          <option value={3}>3 months</option>
          <option value={6}>6 months</option>
          <option value={12}>12 months</option>
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
        <h2>Recurring Items</h2>
        <button onClick={() => setShowAddForm(true)}>Add New Item</button>
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
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <label>Frequency:</label>
            <select
              value={newItem.frequency}
              onChange={(e) => setNewItem({ ...newItem, frequency: e.target.value })}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button onClick={handleAddRecurringItem}>Add Item</button>
          </div>
        )}
        <ul>
          {recurringItems.map((item) => (
            <li key={item.id}>
              <span>
                {item.label} ({item.type}) - {item.amount} ({item.frequency})
              </span>
              <button onClick={() => handleRemoveRecurringItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>What-If Scenario</h2>
        <button onClick={() => setShowWhatIfForm(true)}>Run Scenario</button>
        {showWhatIfForm && (
          <div>
            <label>Label:</label>
            <input
              type="text"
              value={whatIfScenario.label}
              onChange={(e) => setWhatIfScenario({ ...whatIfScenario, label: e.target.value })}
            />
            <label>Amount:</label>
            <input
              type="number"
              value={whatIfScenario.amount}
              onChange={(e) => setWhatIfScenario({ ...whatIfScenario, amount: e.target.value })}
            />
            <label>Type:</label>
            <select
              value={whatIfScenario.type}
              onChange={(e) => setWhatIfScenario({ ...whatIfScenario, type: e.target.value })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <label>Frequency:</label>
            <select
              value={whatIfScenario.frequency}
              onChange={(e) => setWhatIfScenario({ ...whatIfScenario, frequency: e.target.value })}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button onClick={handleWhatIfScenario}>Run Scenario</button>
          </div>
        )}
        {whatIfResults.data.length > 0 && (
          <div>
            <h3>Scenario Results</h3>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Balance</th>
                  <th>Income</th>
                  <th>Expenses</th>
                  <th>Net Cash Flow</th>
                </tr>
              </thead>
              <tbody>
                {whatIfResults.data.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{row.balance}</td>
                    <td>{row.income}</td>
                    <td>{row.expenses}</td>
                    <td>{row.netCashFlow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div>
        <h2>Cash Flow Forecast</h2>
        <InteractiveLineChart data={chartData} />
      </div>
      <div>
        <h2>Scenario Planning Tool</h2>
        <ScenarioPlanningTool recurringItems={recurringItems} />
      </div>
    </div>
  );
}