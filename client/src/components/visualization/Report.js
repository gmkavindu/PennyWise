import React, { useEffect, useState } from 'react';
import { fetchExpenses, fetchLastBudgetStatus, fetchSalary } from '../../services/api';
import { FaWallet, FaRegClock, FaRegCalendarAlt } from 'react-icons/fa';
import { GrMoney, GrStatusGoodSmall } from "react-icons/gr";
import { GiReceiveMoney } from "react-icons/gi";
import { TbPoint } from "react-icons/tb";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Report = ({ startDate }) => {
  const [reportData, setReportData] = useState({
    totalExpenses: 0,
    budgetUsage: {},
    salary: 0,
    statusMessage: 'Status not available',
    period: 'N/A',
    customPeriod: 'N/A',
    startDate: 'N/A',
    expirationDate: 'N/A'
  });

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'light');
  }, []);

  useEffect(() => {
    const fetchReportData = async () => {
      let expenses = [];
      let lastBudgetStatus = {};
      let salary = 0;

      try {
        expenses = await fetchExpenses();
        if (!expenses || expenses.length === 0) {
          throw new Error('No expenses fetched');
        }
      } catch (error) {
      }

      try {
        lastBudgetStatus = await fetchLastBudgetStatus();
      } catch (error) {
      }

      try {
        salary = await fetchSalary();
      } catch (error) {
      }

      const nullBudgetExpenses = expenses.filter(expense => expense.budget === null);
      const filteredExpenses = nullBudgetExpenses.filter(expense => new Date(expense.date) >= startDate);

      const budgetUsage = {};
      let totalExpenses = 0;

      filteredExpenses.forEach(expense => {
        totalExpenses += expense.amount;
        if (budgetUsage[expense.category]) {
          budgetUsage[expense.category] += expense.amount;
        } else {
          budgetUsage[expense.category] = expense.amount;
        }
      });

      setReportData(prevState => ({
        ...prevState,
        totalExpenses,
        budgetUsage,
        salary,
        lastSalary: lastBudgetStatus.salary || 0,
        statusMessage: lastBudgetStatus.statusMessage || 'Status not available',
        period: lastBudgetStatus.period || 'N/A',
        customPeriod: lastBudgetStatus.customPeriod !== undefined ? lastBudgetStatus.customPeriod : 'N/A',
        startDate: lastBudgetStatus.startDate || 'N/A',
        expirationDate: lastBudgetStatus.expirationDate || 'N/A'
      }));
    };

    fetchReportData();
  }, [startDate]);

  const formattedExpirationDate = formatDate(reportData.expirationDate);
  const formattedStartDate = formatDate(reportData.startDate);

  const periodMessage = reportData.period === 'custom' ? `Custom Period: ${reportData.customPeriod === '0' ? '0 days' : `${reportData.customPeriod} days`}` : `Standard Period: ${reportData.period}`;
  return (
    <div className={`mb-10 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="shadow-lg rounded-lg p-6 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 transition-transform transform-gpu hover:scale-105">
        <div className="bg-gray-200 p-4 rounded-lg dark:bg-gray-600 mb-5">
        {Object.keys(reportData.budgetUsage).length > 0 ? (
            <>
                <p className="font-bold mb-4 flex items-center">
                <GrMoney className="mr-2" /> Budget Usage by Category
                </p>
                {Object.keys(reportData.budgetUsage).map(category => (
                <p key={category} className="mb-2 flex items-center">
                    <TbPoint className="mr-2" />
                    {category}: Rs. {reportData.budgetUsage[category].toFixed(2)}
                </p>
                ))}
                <p className="font-semibold mt-4 flex items-center">
                <FaWallet className="mr-2" /> Total Expenses: Rs. {reportData.totalExpenses.toFixed(2)}
                </p>
            </>
            ) : (
                <div className={`py-4 text-${theme === 'dark' ? 'white' : 'gray-900'} text-center`}>
                No data available.
            </div>
            )}
        </div>

        
            <p className="mt-6 text-gray-700 dark:text-gray-300 mb-3">
              The following data belongs to your last reset budget time:
            </p>

            <div className="bg-gray-200 p-4 rounded-lg dark:bg-gray-600 mb-5">
            {(reportData.lastSalary > 0 || reportData.salary > 0) && (
              <>
              <p className="font-semibold flex items-center mb-3"><GiReceiveMoney className="mr-2" /> Salary: Rs. {reportData.lastSalary}</p>
              <p className="font-semibold flex items-center mb-3"><FaRegClock className="mr-2" /> Period: {periodMessage}</p>
              <p className="font-semibold flex items-center mb-3"><FaRegCalendarAlt className="mr-2" /> Start Date: {formattedStartDate}</p>
              <p className="font-semibold flex items-center mb-3"><FaRegCalendarAlt className="mr-2" /> Valid Date: {formattedExpirationDate}</p>
              </>
              
            )}
              
              <p className="font-semibold flex items-center mb-3">
                {reportData.statusMessage.includes('Remaining') ? <GrStatusGoodSmall className="mr-2 text-green-500" /> : <GrStatusGoodSmall className="mr-2 text-red-500" />}
                Status: {reportData.statusMessage}
              </p>
            </div>
      </div>
    </div>
  );
};

export default Report;
