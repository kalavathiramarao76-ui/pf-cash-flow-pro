'use client';

import { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const ForecastingPage = () => {
  const [income, setIncome] = useState<number[]>([]);
  const [expenses, setExpenses] = useState<number[]>([]);
  const [forecast, setForecast] = useState<number[]>([]);

  useEffect(() => {
    const storedIncome = localStorage.getItem('income');
    const storedExpenses = localStorage.getItem('expenses');
    if (storedIncome && storedExpenses) {
      setIncome(JSON.parse(storedIncome));
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  const calculateForecast = () => {
    const forecastData: number[] = [];
    for (let i = 0; i < 12; i++) {
      const monthIncome = income[i] || 0;
      const monthExpenses = expenses[i] || 0;
      forecastData.push(monthIncome - monthExpenses);
    }
    setForecast(forecastData);
  };

  const handleIncomeChange = (index: number, value: number) => {
    const newIncome = [...income];
    newIncome[index] = value;
    setIncome(newIncome);
    localStorage.setItem('income', JSON.stringify(newIncome));
  };

  const handleExpensesChange = (index: number, value: number) => {
    const newExpenses = [...expenses];
    newExpenses[index] = value;
    setExpenses(newExpenses);
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Automated Cash Flow Forecasting</h1>
      <p className="text-lg mb-4">
        Cash Flow Pro helps small businesses and freelancers predict and manage their cash flow with automated forecasting and alerts.
      </p>
      <div className="flex flex-wrap justify-center mb-4">
        <Link href="/forecasting" className="btn btn-primary mr-2">
          <DollarSign size={20} className="mr-2" />
          Forecasting
        </Link>
        <Link href="/trends" className="btn btn-secondary mr-2">
          <TrendingUp size={20} className="mr-2" />
          Trends
        </Link>
        <Link href="/calendar" className="btn btn-secondary">
          <Calendar size={20} className="mr-2" />
          Calendar
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Income</h2>
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>Month {index + 1}</span>
                <input
                  type="number"
                  value={income[index] || 0}
                  onChange={(e) => handleIncomeChange(index, parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
            ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Expenses</h2>
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>Month {index + 1}</span>
                <input
                  type="number"
                  value={expenses[index] || 0}
                  onChange={(e) => handleExpensesChange(index, parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
            ))}
        </div>
      </div>
      <button className="btn btn-primary" onClick={calculateForecast}>
        Calculate Forecast
      </button>
      {forecast.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Forecast</h2>
          {forecast.map((value, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span>Month {index + 1}</span>
              <span>${value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForecastingPage;