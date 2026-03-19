"use client";

use client;

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LocalStorage } from '../utils/localStorage';
import ForecastingChart from '../components/ForecastingChart';
import ForecastingTable from '../components/ForecastingTable';

const ForecastingPage = () => {
  const pathname = usePathname();
  const [forecastingData, setForecastingData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchForecastingData = async () => {
      setLoading(true);
      const storedData = LocalStorage.get('forecastingData');
      if (storedData) {
        setForecastingData(storedData);
      } else {
        const data = await generateForecastingData();
        LocalStorage.set('forecastingData', data);
        setForecastingData(data);
      }
      setLoading(false);
    };
    fetchForecastingData();
  }, []);

  const generateForecastingData = async () => {
    // Generate forecasting data using machine learning algorithms or other methods
    // For demonstration purposes, we'll use a simple mock data
    const data = [
      { date: '2024-01-01', income: 1000, expenses: 500 },
      { date: '2024-02-01', income: 1200, expenses: 600 },
      { date: '2024-03-01', income: 1500, expenses: 700 },
    ];
    return data;
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <h1 className="text-3xl font-bold mb-4">Automated Cash Flow Forecasting</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <ForecastingChart data={forecastingData} />
          </div>
          <div className="w-full md:w-1/2">
            <ForecastingTable data={forecastingData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastingPage;