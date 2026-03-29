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

  useEffect(() => {
    if (mounted) {
      // Load data from storage
    }
  }, [mounted]);

  const handleAddItem = () => {
    // Add new item to recurring items
  };

  const handleRemoveItem = (id: string) => {
    // Remove item from recurring items
  };

  const handleWhatIfScenario = () => {
    // Calculate what-if scenario results
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Automated Cash Flow Forecasting</h1>
      <div className="flex flex-wrap justify-center mb-4">
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
          <p className="text-xl">${currentBalance}</p>
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-2">Safety Threshold</h2>
          <p className="text-xl">${safetyThreshold}</p>
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-2">Horizon</h2>
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value as 3 | 6 | 12)}
            className="w-full p-2 border border-gray-400 rounded"
          >
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap justify-center mb-4">
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-2">Recurring Items</h2>
          <ul>
            {recurringItems.map((item) => (
              <li key={item.id} className="py-2 border-b border-gray-200">
                <span className="text-xl">{item.label}</span>
                <span className="text-lg ml-2">${getMonthlyEquivalent(item)}</span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {showAddForm ? (
            <form onSubmit={handleAddItem}>
              <input
                type="text"
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                placeholder="Label"
                className="w-full p-2 border border-gray-400 rounded mb-2"
              />
              <input
                type="number"
                value={newItem.amount}
                onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                placeholder="Amount"
                className="w-full p-2 border border-gray-400 rounded mb-2"
              />
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value as "income" | "expense" })}
                className="w-full p-2 border border-gray-400 rounded mb-2"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={newItem.frequency}
                onChange={(e) => setNewItem({ ...newItem, frequency: e.target.value as RecurringItem["frequency"] })}
                className="w-full p-2 border border-gray-400 rounded mb-2"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                Add Item
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Add New Item
            </button>
          )}
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-2">What-If Scenario</h2>
          {showWhatIfForm ? (
            <form onSubmit={handleWhatIfScenario}>
              <input
                type="text"
                value={whatIfScenario.label}
                onChange={(e) => setWhatIfScenario({ ...whatIfScenario, label: e.target.value })}
                placeholder="Label"
                className="w-full p-2 border border-gray-400 rounded mb-2"
              />
              <input
                type="number"
                value={whatIfScenario.amount}
                onChange={(e) => setWhatIfScenario({ ...whatIfScenario, amount: e.target.value })}
                placeholder="Amount"
                className="w-full p-2 border border-gray-400 rounded mb-2"
              />
              <select
                value={whatIfScenario.type}
                onChange={(e) => setWhatIfScenario({ ...whatIfScenario, type: e.target.value as "income" | "expense" })}
                className="w-full p-2 border border-gray-400 rounded mb-2"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={whatIfScenario.frequency}
                onChange={(e) => setWhatIfScenario({ ...whatIfScenario, frequency: e.target.value as RecurringItem["frequency"] })}
                className="w-full p-2 border border-gray-400 rounded mb-2"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                Run Scenario
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowWhatIfForm(true)}
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Run What-If Scenario
            </button>
          )}
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-2">Forecast</h2>
          <InteractiveLineChart
            data={whatIfResults.data}
            x_axis="month"
            y_axis="balance"
            title="Cash Flow Forecast"
          />
        </div>
      </div>
    </div>
  );
}