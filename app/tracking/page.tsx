"use client";

use client;

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getStoredValue, setStoredValue } from '../utils/storage';
import { Transaction } from '../types/transaction';
import TransactionTable from '../components/TransactionTable';
import AddTransactionForm from '../components/AddTransactionForm';

const TrackingPage = () => {
  const pathname = usePathname();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    const storedTransactions = getStoredValue('transactions');
    if (storedTransactions) {
      setTransactions(storedTransactions);
      calculateTotals(storedTransactions);
    }
  }, []);

  const calculateTotals = (transactions: Transaction[]) => {
    const income = transactions.reduce((acc, curr) => acc + (curr.type === 'income' ? curr.amount : 0), 0);
    const expenses = transactions.reduce((acc, curr) => acc + (curr.type === 'expense' ? curr.amount : 0), 0);
    setIncome(income);
    setExpenses(expenses);
  };

  const handleAddTransaction = (transaction: Transaction) => {
    const newTransactions = [...transactions, transaction];
    setTransactions(newTransactions);
    setStoredValue('transactions', newTransactions);
    calculateTotals(newTransactions);
  };

  const handleDeleteTransaction = (id: number) => {
    const newTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(newTransactions);
    setStoredValue('transactions', newTransactions);
    calculateTotals(newTransactions);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-3xl font-bold mb-4">Tracking</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <div className="text-lg font-bold mb-2 sm:mb-0">Income: ${income.toFixed(2)}</div>
        <div className="text-lg font-bold mb-2 sm:mb-0">Expenses: ${expenses.toFixed(2)}</div>
      </div>
      <AddTransactionForm onAddTransaction={handleAddTransaction} />
      <TransactionTable transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
    </div>
  );
};

export default TrackingPage;