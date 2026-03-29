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

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <h1 className="text-3xl font-bold mb-4">Automated Cash Flow Forecasting</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-bold mb-2">Current Balance</h2>
          <p className="text-lg">${currentBalance}</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-bold mb-2">Horizon</h2>
          <select
            className="w-full p-2 pl-10 text-lg text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
            value={horizon}
            onChange={(e) => setHorizon(parseInt(e.target.value) as 3 | 6 | 12)}
          >
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
          </select>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-bold mb-2">Safety Threshold</h2>
          <input
            type="number"
            className="w-full p-2 pl-10 text-lg text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
            value={safetyThreshold}
            onChange={(e) => setSafetyThreshold(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Recurring Items</h2>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowAddForm(true)}
        >
          Add New Item
        </button>
        {showAddForm && (
          <div className="bg-white p-4 rounded shadow-md mt-4">
            <h3 className="text-lg font-bold mb-2">Add New Recurring Item</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="label">
                  Label
                </label>
                <input
                  type="text"
                  className="w-full p-2 pl-10 text-lg text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  id="label"
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                />
                {formErrors.label && <p className="text-red-500 text-xs italic">{formErrors.label}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full p-2 pl-10 text-lg text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  id="amount"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                />
                {formErrors.amount && <p className="text-red-500 text-xs italic">{formErrors.amount}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                  Type
                </label>
                <select
                  className="w-full p-2 pl-10 text-lg text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  id="type"
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value as "income" | "expense" })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                {formErrors.type && <p className="text-red-500 text-xs italic">{formErrors.type}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="frequency">
                  Frequency
                </label>
                <select
                  className="w-full p-2 pl-10 text-lg text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  id="frequency"
                  value={newItem.frequency}
                  onChange={(e) => setNewItem({ ...newItem, frequency: e.target.value as RecurringItem["frequency"] })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                {formErrors.frequency && <p className="text-red-500 text-xs italic">{formErrors.frequency}</p>}
              </div>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Add Item
              </button>
            </form>
          </div>
        )}
        <ul className="mt-4">
          {recurringItems.map((item) => (
            <li key={item.id} className="bg-white p-4 rounded shadow-md mb-2">
              <h3 className="text-lg font-bold mb-2">{item.label}</h3>
              <p className="text-lg">Amount: ${item.amount}</p>
              <p className="text-lg">Type: {item.type}</p>
              <p className="text-lg">Frequency: {item.frequency}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">What-If Scenario</h2>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowWhatIfForm(true)}
        >
          Run Scenario
        </button>
        {showWhatIfForm && (
          <div className="bg-white p-4 rounded shadow-md mt-4">
            <h3 className="text-lg font-bold mb-2">What-If Scenario</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="label">
                  Label
                </label>
                <input
                  type="text"
                  className="w-full p-2 pl-10 text-lg text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  id="label"
                  value={whatIfScenario.label}
                  onChange={(e) => setWhatIfScenario({ ...whatIfScenario, label: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full p-2 pl-10 text-lg text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  id="amount"
                  value={whatIfScenario.amount}
                  onChange={(e) => setWhatIfScenario({ ...whatIfScenario, amount: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                  Type
                </label>
                <select
                  className="w-full p-2 pl-10 text-lg text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  id="type"
                  value={whatIfScenario.type}
                  onChange={(e) => setWhatIfScenario({ ...whatIfScenario, type: e.target.value as "income" | "expense" })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="frequency">
                  Frequency
                </label>
                <select
                  className="w-full p-2 pl-10 text-lg text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  id="frequency"
                  value={whatIfScenario.frequency}
                  onChange={(e) => setWhatIfScenario({ ...whatIfScenario, frequency: e.target.value as RecurringItem["frequency"] })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Run Scenario
              </button>
            </form>
          </div>
        )}
        {whatIfResults.data.length > 0 && (
          <div className="bg-white p-4 rounded shadow-md mt-4">
            <h3 className="text-lg font-bold mb-2">Scenario Results</h3>
            <ul>
              {whatIfResults.data.map((result, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded shadow-md mb-2">
                  <h4 className="text-lg font-bold mb-2">Month {index + 1}</h4>
                  <p className="text-lg">Balance: ${result.balance}</p>
                  <p className="text-lg">Income: ${result.income}</p>
                  <p className="text-lg">Expenses: ${result.expenses}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}