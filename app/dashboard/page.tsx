'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ChartBar, AlertCircle } from 'lucide-react';
import Layout from '../Layout';

const DashboardPage = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);
  const [trend, setTrend] = useState('');

  useEffect(() => {
    const storedIncome = localStorage.getItem('income');
    const storedExpenses = localStorage.getItem('expenses');
    if (storedIncome && storedExpenses) {
      setIncome(parseInt(storedIncome));
      setExpenses(parseInt(storedExpenses));
      setCashFlow(parseInt(storedIncome) - parseInt(storedExpenses));
      if (parseInt(storedIncome) > parseInt(storedExpenses)) {
        setTrend('positive');
      } else if (parseInt(storedIncome) < parseInt(storedExpenses)) {
        setTrend('negative');
      } else {
        setTrend('neutral');
      }
    }
  }, []);

  const handleIncomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(parseInt(event.target.value));
    localStorage.setItem('income', event.target.value);
    setCashFlow(parseInt(event.target.value) - expenses);
    if (parseInt(event.target.value) > expenses) {
      setTrend('positive');
    } else if (parseInt(event.target.value) < expenses) {
      setTrend('negative');
    } else {
      setTrend('neutral');
    }
  };

  const handleExpensesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpenses(parseInt(event.target.value));
    localStorage.setItem('expenses', event.target.value);
    setCashFlow(income - parseInt(event.target.value));
    if (income > parseInt(event.target.value)) {
      setTrend('positive');
    } else if (income < parseInt(event.target.value)) {
      setTrend('negative');
    } else {
      setTrend('neutral');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
        <h1 className="text-3xl font-bold mb-4">Automated Cash Flow Forecasting</h1>
        <div className="flex flex-wrap -mx-4 mb-4">
          <div className="w-full md:w-1/2 xl:w-1/3 p-4">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-bold mb-2">Income</h2>
              <input
                type="number"
                value={income}
                onChange={handleIncomeChange}
                className="w-full p-2 border border-gray-400 rounded"
              />
              <p className="text-lg font-bold mt-2">
                ${income.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 p-4">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-bold mb-2">Expenses</h2>
              <input
                type="number"
                value={expenses}
                onChange={handleExpensesChange}
                className="w-full p-2 border border-gray-400 rounded"
              />
              <p className="text-lg font-bold mt-2">
                ${expenses.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 p-4">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-bold mb-2">Cash Flow</h2>
              <p className="text-lg font-bold">
                ${cashFlow.toLocaleString()}
                {trend === 'positive' ? (
                  <ArrowUp className="text-green-500" size={20} />
                ) : trend === 'negative' ? (
                  <ArrowDown className="text-red-500" size={20} />
                ) : (
                  <></>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-4 mb-4">
          <div className="w-full md:w-1/2 xl:w-1/2 p-4">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-bold mb-2">Income Chart</h2>
              <div className="h-64">
                <ChartBar size={64} className="text-gray-400" />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/2 p-4">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-bold mb-2">Expenses Chart</h2>
              <div className="h-64">
                <ChartBar size={64} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-4 mb-4">
          <div className="w-full md:w-1/2 xl:w-1/2 p-4">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-bold mb-2">Alerts</h2>
              <p className="text-lg font-bold">
                <AlertCircle size={20} className="text-orange-500" />
                You have 2 upcoming payments due this week.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/2 p-4">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-bold mb-2">Recommendations</h2>
              <p className="text-lg font-bold">
                Consider reducing expenses by 10% to improve cash flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;