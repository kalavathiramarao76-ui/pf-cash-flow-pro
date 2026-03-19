"use client";

use client;

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { localStorage } from '../utils/localStorage';
import Link from 'next/link';

export default function PricingPage() {
  const router = useRouter();
  const [plan, setPlan] = useState('monthly');

  const pricingPlans = [
    {
      name: 'Starter',
      price: plan === 'monthly' ? 9.99 : 99.99,
      features: [
        'Automated cash flow forecasting',
        'Income and expense tracking',
        'Trend analysis and alerts',
      ],
    },
    {
      name: 'Pro',
      price: plan === 'monthly' ? 19.99 : 199.99,
      features: [
        'Automated cash flow forecasting',
        'Income and expense tracking',
        'Trend analysis and alerts',
        'Personalized financial recommendations',
        'Customizable budgeting templates',
      ],
    },
    {
      name: 'Business',
      price: plan === 'monthly' ? 29.99 : 299.99,
      features: [
        'Automated cash flow forecasting',
        'Income and expense tracking',
        'Trend analysis and alerts',
        'Personalized financial recommendations',
        'Customizable budgeting templates',
        'Exportable financial reports',
      ],
    },
  ];

  const handlePlanChange = (plan: string) => {
    setPlan(plan);
  };

  const handleSubscribe = (plan: string) => {
    localStorage.setItem('plan', plan);
    router.push('/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Pricing Plans</h1>
      <div className="flex flex-wrap justify-center mb-8">
        <button
          className={`${
            plan === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
          } py-2 px-4 rounded-lg mr-2 mb-2`}
          onClick={() => handlePlanChange('monthly')}
        >
          Monthly
        </button>
        <button
          className={`${
            plan === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
          } py-2 px-4 rounded-lg mb-2`}
          onClick={() => handlePlanChange('yearly')}
        >
          Yearly
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:p-8"
          >
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-xl font-bold mb-4">
              ${plan.price}
              {plan === 'monthly' ? '/month' : '/year'}
            </p>
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2">
                  <span>✦</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
              onClick={() => handleSubscribe(plan.name)}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}