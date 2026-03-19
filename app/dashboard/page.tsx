use client;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DashboardLayout from '../components/DashboardLayout';
import ForecastingCard from '../components/ForecastingCard';
import TrackingCard from '../components/TrackingCard';
import RecommendationsCard from '../components/RecommendationsCard';
import SettingsCard from '../components/SettingsCard';

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useLocalStorage('user', null);
  const [cashFlowData, setCashFlowData] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      const storedCashFlowData = localStorage.getItem('cashFlowData');
      if (storedCashFlowData) {
        setCashFlowData(JSON.parse(storedCashFlowData));
      }
    }
  }, [user, router]);

  const handleUpdateCashFlowData = (newData: any) => {
    setCashFlowData(newData);
    localStorage.setItem('cashFlowData', JSON.stringify(newData));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ForecastingCard
            cashFlowData={cashFlowData}
            onUpdate={handleUpdateCashFlowData}
          />
          <TrackingCard
            cashFlowData={cashFlowData}
            onUpdate={handleUpdateCashFlowData}
          />
          <RecommendationsCard
            cashFlowData={cashFlowData}
            onUpdate={handleUpdateCashFlowData}
          />
          <SettingsCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;