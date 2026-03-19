'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: 'Automated Cash Flow Forecasting',
    description: 'Predict and manage your cash flow with automated forecasting and alerts.',
  },
  {
    title: 'Income and Expense Tracking',
    description: 'Track your income and expenses to identify trends and make informed financial decisions.',
  },
  {
    title: 'Trend Analysis and Alerts',
    description: 'Stay on top of your finances with trend analysis and alerts to help you make informed decisions.',
  },
  {
    title: 'Personalized Financial Recommendations',
    description: 'Get personalized recommendations for improving your cash flow and reducing financial stress.',
  },
  {
    title: 'Customizable Budgeting Templates',
    description: 'Create a budget that works for you with customizable budgeting templates.',
  },
  {
    title: 'Exportable Financial Reports',
    description: 'Export your financial reports to easily share with your team or accountant.',
  },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: 9.99,
    features: ['Automated Cash Flow Forecasting', 'Income and Expense Tracking'],
  },
  {
    name: 'Premium',
    price: 19.99,
    features: [
      'Automated Cash Flow Forecasting',
      'Income and Expense Tracking',
      'Trend Analysis and Alerts',
      'Personalized Financial Recommendations',
    ],
  },
  {
    name: 'Enterprise',
    price: 49.99,
    features: [
      'Automated Cash Flow Forecasting',
      'Income and Expense Tracking',
      'Trend Analysis and Alerts',
      'Personalized Financial Recommendations',
      'Customizable Budgeting Templates',
      'Exportable Financial Reports',
    ],
  },
];

const faqs = [
  {
    question: 'What is Cash Flow Pro?',
    answer: 'Cash Flow Pro is a financial management tool that helps small businesses and freelancers predict and manage their cash flow with automated forecasting and alerts.',
  },
  {
    question: 'How does Cash Flow Pro work?',
    answer: 'Cash Flow Pro uses machine learning algorithms to analyze your financial data and provide personalized recommendations for improving your cash flow and reducing financial stress.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, your data is secure with Cash Flow Pro. We use industry-standard encryption and secure servers to protect your financial information.',
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState('features');

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 md:p-6 lg:p-8 rounded-lg mb-8">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4">
          Cash Flow Pro
        </h1>
        <p className="text-lg md:text-2xl lg:text-3xl mb-4">
          Predict and manage your cash flow with automated forecasting and alerts.
        </p>
        <Link
          href="/dashboard"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Get Started
          <AiOutlineArrowRight className="ml-2" />
        </Link>
      </header>
      <main>
        <section id="features" className="mb-8">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg"
              >
                <h3 className="text-lg md:text-2xl lg:text-3xl font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-lg lg:text-2xl mb-4">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section id="pricing" className="mb-8">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4">
            Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg"
              >
                <h3 className="text-lg md:text-2xl lg:text-3xl font-bold mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm md:text-lg lg:text-2xl mb-2">
                  ${plan.price}/month
                </p>
                <ul className="list-disc pl-4 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm md:text-lg lg:text-2xl mb-2">
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Sign Up
                  <AiOutlineArrowRight className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </section>
        <section id="faq" className="mb-8">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4">
            FAQ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg"
              >
                <h3 className="text-lg md:text-2xl lg:text-3xl font-bold mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm md:text-lg lg:text-2xl mb-4">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-gray-200 p-4 md:p-6 lg:p-8 rounded-lg mb-8">
        <p className="text-sm md:text-lg lg:text-2xl mb-4">
          &copy; 2024 Cash Flow Pro. All rights reserved.
        </p>
        <ul className="list-none mb-4">
          <li className="inline-block mr-4">
            <Link href="/dashboard" className="text-sm md:text-lg lg:text-2xl">
              Dashboard
            </Link>
          </li>
          <li className="inline-block mr-4">
            <Link href="/forecasting" className="text-sm md:text-lg lg:text-2xl">
              Forecasting
            </Link>
          </li>
          <li className="inline-block mr-4">
            <Link href="/tracking" className="text-sm md:text-lg lg:text-2xl">
              Tracking
            </Link>
          </li>
          <li className="inline-block mr-4">
            <Link href="/recommendations" className="text-sm md:text-lg lg:text-2xl">
              Recommendations
            </Link>
          </li>
          <li className="inline-block mr-4">
            <Link href="/settings" className="text-sm md:text-lg lg:text-2xl">
              Settings
            </Link>
          </li>
          <li className="inline-block mr-4">
            <Link href="/pricing" className="text-sm md:text-lg lg:text-2xl">
              Pricing
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}