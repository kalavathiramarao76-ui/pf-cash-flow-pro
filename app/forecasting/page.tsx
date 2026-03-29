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

  const [chartData, setChartData] = useState([
    { month: 1, balance: 10000 },
    { month: 2, balance: 9500 },
    { month: 3, balance: 9000 },
    { month: 4, balance: 8500 },
    { month: 5, balance: 8000 },
    { month: 6, balance: 7500 },
  ]);

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
  };

  const handleDateRangeChange = (start: number, end: number) => {
    setDateRange({ start, end });
  };

  const handleWhatIfScenarioChange = (label: string, amount: string, type: string, frequency: string) => {
    setWhatIfScenario({ label, amount, type, frequency });
  };

  const handleWhatIfFormSubmit = () => {
    const newChartData = chartData.map((dataPoint) => {
      if (whatIfScenario.type === "income") {
        return { ...dataPoint, balance: dataPoint.balance + parseInt(whatIfScenario.amount) };
      } else {
        return { ...dataPoint, balance: dataPoint.balance - parseInt(whatIfScenario.amount) };
      }
    });
    setWhatIfResults({ data: newChartData });
  };

  return (
    <div>
      <h1>Automated Cash Flow Forecasting</h1>
      <div>
        <h2>Current Balance: ${currentBalance}</h2>
        <h2>Horizon: {horizon} months</h2>
        <h2>Safety Threshold: ${safetyThreshold}</h2>
      </div>
      <div>
        <h2>Recurring Items:</h2>
        <ul>
          {recurringItems.map((item) => (
            <li key={item.id}>
              {item.label} ({item.type}) - ${getMonthlyEquivalent(item)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Add New Recurring Item:</h2>
        {showAddForm ? (
          <form>
            <label>
              Label:
              <input type="text" value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} />
            </label>
            <label>
              Amount:
              <input type="number" value={newItem.amount} onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })} />
            </label>
            <label>
              Type:
              <select value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
            <label>
              Frequency:
              <select value={newItem.frequency} onChange={(e) => setNewItem({ ...newItem, frequency: e.target.value })}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </label>
            <button type="submit">Add</button>
          </form>
        ) : (
          <button onClick={() => setShowAddForm(true)}>Add New Recurring Item</button>
        )}
      </div>
      <div>
        <h2>What-If Scenario:</h2>
        {showWhatIfForm ? (
          <form>
            <label>
              Label:
              <input type="text" value={whatIfScenario.label} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, label: e.target.value })} />
            </label>
            <label>
              Amount:
              <input type="number" value={whatIfScenario.amount} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, amount: e.target.value })} />
            </label>
            <label>
              Type:
              <select value={whatIfScenario.type} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, type: e.target.value })}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
            <label>
              Frequency:
              <select value={whatIfScenario.frequency} onChange={(e) => setWhatIfScenario({ ...whatIfScenario, frequency: e.target.value })}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </label>
            <button type="submit" onClick={handleWhatIfFormSubmit}>Run Scenario</button>
          </form>
        ) : (
          <button onClick={() => setShowWhatIfForm(true)}>Run What-If Scenario</button>
        )}
      </div>
      <div>
        <h2>Forecast Chart:</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis dataKey="balance" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="balance" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h2>Interactive Line Chart:</h2>
        <InteractiveLineChart data={chartData} handleMonthSelect={handleMonthSelect} handleDateRangeChange={handleDateRangeChange} />
      </div>
      <div>
        <h2>Scenario Planning Tool:</h2>
        <ScenarioPlanningTool data={whatIfResults.data} />
      </div>
    </div>
  );
}