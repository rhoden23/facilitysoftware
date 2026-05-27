import React, { useMemo } from 'react';
import { DollarSign, PlusCircle, Sparkles } from 'lucide-react';
import { formatCurrency } from '../helpers/helpers';
import TransactionTable from '../components/Finances/TransactionTable';
import StatCard from '../components/Dashboard/StatCard';

const FinanceView = ({ transactions, onAddTransaction, onEditTransaction, onDeleteTransaction, callGeminiAPI }) => {
    const validTransactions = Array.isArray(transactions) ? transactions : [];
    const income = useMemo(() => validTransactions.filter(t => t.type === 'Income'), [validTransactions]);
    const expenses = useMemo(() => validTransactions.filter(t => t.type === 'Expense'), [validTransactions]);

    const totalIncome = useMemo(() => income.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0), [income]);
    const totalExpenses = useMemo(() => expenses.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0), [expenses]);
    const netProfit = totalIncome - totalExpenses;

    const handleAnalyzeExpenses = () => {
        if (expenses.length === 0) {
            callGeminiAPI("There are no expenses recorded to analyze.", "Expense Analysis");
            return;
        }

        const expenseList = expenses.map(e => `- ${e.category}: ${formatCurrency(e.amount)} (${e.description})`).join('\n');

        const prompt = `
            Act as a financial analyst for a small Residential Care Facility for the Elderly (RCFE).
            Based on the following list of expenses, provide a brief analysis.

            **Expense Report:**
            ${expenseList}

            **Your Analysis should include:**
            1.  **Top Spending Categories:** Identify the top 3 categories where the most money is being spent.
            2.  **Potential Savings:** Suggest one or two potential areas where costs could be reviewed or reduced without compromising care quality.
            3.  **Summary:** A brief, one-sentence summary of the overall spending pattern.

            Keep the tone professional and helpful.
        `;
        callGeminiAPI(prompt, "AI Expense Analysis");
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={handleAnalyzeExpenses} className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 shadow transition-colors"><Sparkles className="w-5 h-5 mr-2" /> ✨ Analyze Expenses</button>
                    <button onClick={onAddTransaction} className="flex items-center bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 shadow"><PlusCircle className="w-5 h-5 mr-2" />Add Transaction</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Income" value={formatCurrency(totalIncome)} icon={<DollarSign className="w-8 h-8 text-green-500" />} color="border-green-500" />
                <StatCard title="Total Expenses" value={formatCurrency(totalExpenses)} icon={<DollarSign className="w-8 h-8 text-red-500" />} color="border-red-500" />
                <StatCard title="Net Profit/Loss" value={formatCurrency(netProfit)} icon={<DollarSign className="w-8 h-8 text-emerald-500" />} color={netProfit >= 0 ? 'border-emerald-500' : 'border-red-500'} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TransactionTable title="Income" data={income} onEdit={onEditTransaction} onDelete={onDeleteTransaction} />
                <TransactionTable title="Expenses" data={expenses} onEdit={onEditTransaction} onDelete={onDeleteTransaction} />
            </div>
        </div>
    );
};

export default FinanceView;