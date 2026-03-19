'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: number;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
}

const Page = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    type: 'income',
    amount: 0,
    description: '',
  });

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const handleAddTransaction = () => {
    const newTransactions = [...transactions, newTransaction];
    setTransactions(newTransactions);
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
    setNewTransaction({
      date: '',
      type: 'income',
      amount: 0,
      description: '',
    });
  };

  const handleDeleteTransaction = (id: number) => {
    const newTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(newTransactions);
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
  };

  const handleUpdateTransaction = (id: number, updatedTransaction: Transaction) => {
    const newTransactions = transactions.map((transaction) =>
      transaction.id === id ? updatedTransaction : transaction
    );
    setTransactions(newTransactions);
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Automated Cash Flow Forecasting</h1>
      <p className="text-lg mb-4">
        Cash Flow Pro helps small businesses and freelancers predict and manage their cash flow with automated forecasting and alerts.
      </p>
      <div className="flex justify-between mb-4">
        <Link href="/tracking/income" className="btn btn-primary">
          <Calendar size={20} className="mr-2" />
          Track Income
        </Link>
        <Link href="/tracking/expenses" className="btn btn-primary">
          <Calendar size={20} className="mr-2" />
          Track Expenses
        </Link>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Transactions</h2>
        <table className="table-auto w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-2">{transaction.date}</td>
                <td className="px-4 py-2">{transaction.type}</td>
                <td className="px-4 py-2">{transaction.amount}</td>
                <td className="px-4 py-2">{transaction.description}</td>
                <td className="px-4 py-2">
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleUpdateTransaction(transaction.id, transaction)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Add New Transaction</h2>
        <form>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, date: e.target.value })
              }
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })
              }
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1" htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })
              }
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={newTransaction.description}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, description: e.target.value })
              }
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              handleAddTransaction();
            }}
          >
            <Plus size={20} className="mr-2" />
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;