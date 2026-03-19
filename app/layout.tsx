use client;

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '../hooks/useDarkMode';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useDarkMode();
  const router = useRouter();

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === 'true');
    }
  }, []);

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cash Flow Pro - Automated Cash Flow Forecasting</title>
        <meta name="description" content="Cash Flow Pro helps small businesses and freelancers predict and manage their cash flow with automated forecasting and alerts." />
        <meta name="keywords" content="cash flow forecasting, small business finance, cash flow management, financial planning tools, budgeting software" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:title" content="Cash Flow Pro - Automated Cash Flow Forecasting" />
        <meta property="og:description" content="Cash Flow Pro helps small businesses and freelancers predict and manage their cash flow with automated forecasting and alerts." />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cash Flow Pro - Automated Cash Flow Forecasting" />
        <meta name="twitter:description" content="Cash Flow Pro helps small businesses and freelancers predict and manage their cash flow with automated forecasting and alerts." />
        <meta name="twitter:image" content="/twitter-image.png" />
      </Head>
      <body className="font-sans text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
        <Header />
        <main className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}