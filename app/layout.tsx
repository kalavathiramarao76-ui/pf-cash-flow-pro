import { useState, useEffect } from 'react';
import { FiAlertCircle, FiBarChart, FiDollarSign, FiSettings } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import Nav from './nav';
import Footer from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [cashFlowData, setCashFlowData] = useState(() => {
    const storedData = localStorage.getItem('cashFlowData');
    return storedData ? JSON.parse(storedData) : {};
  });

  useEffect(() => {
    localStorage.setItem('cashFlowData', JSON.stringify(cashFlowData));
  }, [cashFlowData]);

  return (
    <>
      <Head>
        <title>Automated Cash Flow Forecasting | Cash Flow Pro</title>
        <meta name="description" content="Predict and manage your cash flow with automated forecasting and alerts." />
        <meta name="keywords" content="cash flow forecasting, automated forecasting, financial management" />
      </Head>
      <Nav />
      <main className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Automated Cash Flow Forecasting</h1>
          <p className="text-lg">Predict and manage your cash flow with automated forecasting and alerts.</p>
        </header>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul>
            <li className="flex items-center mb-4">
              <FiDollarSign size={24} className="mr-4" />
              <span>Track income and expenses</span>
            </li>
            <li className="flex items-center mb-4">
              <FiBarChart size={24} className="mr-4" />
              <span>Identify trends and make informed financial decisions</span>
            </li>
            <li className="flex items-center mb-4">
              <FiAlertCircle size={24} className="mr-4" />
              <span>Receive personalized recommendations for improving cash flow and reducing financial stress</span>
            </li>
            <li className="flex items-center mb-4">
              <FiSettings size={24} className="mr-4" />
              <span>Customize your forecasting and alert settings</span>
            </li>
          </ul>
        </section>
        {children}
      </main>
      <Footer />
    </>
  );
}