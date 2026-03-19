use client;

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { localStorage } from '../utils/localStorage';

const SettingsPage = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');
  const [budgetTemplate, setBudgetTemplate] = useState(() => localStorage.getItem('budgetTemplate') || 'default');

  const handleDarkModeChange = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', String(!darkMode));
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
    localStorage.setItem('currency', event.target.value);
  };

  const handleBudgetTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBudgetTemplate(event.target.value);
    localStorage.setItem('budgetTemplate', event.target.value);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="flex flex-col mb-4">
        <label className="text-lg font-medium mb-2" htmlFor="dark-mode">Dark Mode</label>
        <input
          id="dark-mode"
          type="checkbox"
          checked={darkMode}
          onChange={handleDarkModeChange}
          className="rounded-lg border-gray-300"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-lg font-medium mb-2" htmlFor="currency">Currency</label>
        <select
          id="currency"
          value={currency}
          onChange={handleCurrencyChange}
          className="rounded-lg border-gray-300 p-2"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-lg font-medium mb-2" htmlFor="budget-template">Budget Template</label>
        <select
          id="budget-template"
          value={budgetTemplate}
          onChange={handleBudgetTemplateChange}
          className="rounded-lg border-gray-300 p-2"
        >
          <option value="default">Default</option>
          <option value="simple">Simple</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        onClick={() => router.push('/dashboard')}
      >
        Save Changes
      </button>
    </div>
  );
};

export default SettingsPage;