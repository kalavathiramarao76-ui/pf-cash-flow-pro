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
      // Update local storage with new recurring items
      localStorage.setItem(RECURRING_KEY, JSON.stringify(recurringItems));
    }
  }, [recurringItems, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddItem = () => {
    if (newItem.label && newItem.amount && newItem.type && newItem.frequency) {
      const newRecurringItem: RecurringItem = {
        id: Math.random().toString(36).substr(2, 9),
        label: newItem.label,
        amount: parseFloat(newItem.amount),
        type: newItem.type,
        frequency: newItem.frequency,
      };
      setRecurringItems([...recurringItems, newRecurringItem]);
      setNewItem({
        label: "",
        amount: "",
        type: "income",
        frequency: "monthly",
      });
      setShowAddForm(false);
    } else {
      setFormErrors({
        label: !newItem.label ? "Label is required" : "",
        amount: !newItem.amount ? "Amount is required" : "",
        type: !newItem.type ? "Type is required" : "",
        frequency: !newItem.frequency ? "Frequency is required" : "",
      });
    }
  };

  const handleRemoveItem = (id: string) => {
    setRecurringItems(recurringItems.filter((item) => item.id !== id));
  };

  const handleWhatIfScenario = () => {
    if (whatIfScenario.label && whatIfScenario.amount && whatIfScenario.type && whatIfScenario.frequency) {
      const newRecurringItem: RecurringItem = {
        id: Math.random().toString(36).substr(2, 9),
        label: whatIfScenario.label,
        amount: parseFloat(whatIfScenario.amount),
        type: whatIfScenario.type,
        frequency: whatIfScenario.frequency,
      };
      setWhatIfResults({
        data: [...whatIfResults.data, newRecurringItem],
      });
      setWhatIfScenario({
        label: "",
        amount: "",
        type: "income",
        frequency: "monthly",
      });
      setShowWhatIfForm(false);
    } else {
      setFormErrors({
        label: !whatIfScenario.label ? "Label is required" : "",
        amount: !whatIfScenario.amount ? "Amount is required" : "",
        type: !whatIfScenario.type ? "Type is required" : "",
        frequency: !whatIfScenario.frequency ? "Frequency is required" : "",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Automated Cash Flow Forecasting</h1>
      <div className="flex flex-wrap justify-center mb-4">
        <div className="w-full lg:w-1/2 xl:w-1/3 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
          <p className="text-xl font-bold mb-4">${currentBalance}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setHorizon(3)}
          >
            3 Months
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() => setHorizon(6)}
          >
            6 Months
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() => setHorizon(12)}
          >
            12 Months
          </button>
        </div>
        <div className="w-full lg:w-1/2 xl:w-1/3 p-6 bg-white rounded-lg shadow-md ml-4">
          <h2 className="text-2xl font-bold mb-2">Recurring Items</h2>
          <ul>
            {recurringItems.map((item) => (
              <li key={item.id} className="mb-2">
                <span className="font-bold">{item.label}</span> (${getMonthlyEquivalent(item)}) {item.type} - {item.frequency}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowAddForm(true)}
          >
            Add New Item
          </button>
          {showAddForm && (
            <div className="mt-4">
              <input
                type="text"
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                placeholder="Label"
                className="w-full p-2 mb-2 border border-gray-400 rounded"
              />
              <input
                type="number"
                value={newItem.amount}
                onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                placeholder="Amount"
                className="w-full p-2 mb-2 border border-gray-400 rounded"
              />
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value as "income" | "expense" })}
                className="w-full p-2 mb-2 border border-gray-400 rounded"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={newItem.frequency}
                onChange={(e) => setNewItem({ ...newItem, frequency: e.target.value as RecurringItem["frequency"] })}
                className="w-full p-2 mb-2 border border-gray-400 rounded"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddItem}
              >
                Add Item
              </button>
            </div>
          )}
        </div>
        <div className="w-full lg:w-1/2 xl:w-1/3 p-6 bg-white rounded-lg shadow-md ml-4">
          <h2 className="text-2xl font-bold mb-2">What-If Scenario</h2>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowWhatIfForm(true)}
          >
            Add Scenario
          </button>
          {showWhatIfForm && (
            <div className="mt-4">
              <input
                type="text"
                value={whatIfScenario.label}
                onChange={(e) => setWhatIfScenario({ ...whatIfScenario, label: e.target.value })}
                placeholder="Label"
                className="w-full p-2 mb-2 border border-gray-400 rounded"
              />
              <input
                type="number"
                value={whatIfScenario.amount}
                onChange={(e) => setWhatIfScenario({ ...whatIfScenario, amount: e.target.value })}
                placeholder="Amount"
                className="w-full p-2 mb-2 border border-gray-400 rounded"
              />
              <select
                value={whatIfScenario.type}
                onChange={(e) => setWhatIfScenario({ ...whatIfScenario, type: e.target.value as "income" | "expense" })}
                className="w-full p-2 mb-2 border border-gray-400 rounded"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={whatIfScenario.frequency}
                onChange={(e) => setWhatIfScenario({ ...whatIfScenario, frequency: e.target.value as RecurringItem["frequency"] })}
                className="w-full p-2 mb-2 border border-gray-400 rounded"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleWhatIfScenario}
              >
                Add Scenario
              </button>
            </div>
          )}
          <ul>
            {whatIfResults.data.map((item, index) => (
              <li key={index} className="mb-2">
                <span className="font-bold">{item.label}</span> (${getMonthlyEquivalent(item)}) {item.type} - {item.frequency}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <InteractiveLineChart
          data={recurringItems.map((item) => ({
            label: item.label,
            amount: getMonthlyEquivalent(item),
            type: item.type,
          }))}
        />
      </div>
    </div>
  );
}