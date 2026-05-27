import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../helpers/helpers';

const TransactionTable = ({ title, data, onEdit, onDelete }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left">
                <thead className="sticky top-0 bg-gray-50 z-10">
                    <tr className="border-b"><th className="p-3">Date</th><th className="p-3">Description</th><th className="p-3">Category</th><th className="p-3 text-right">Amount</th><th className="p-3 text-center">Actions</th></tr>
                </thead>
                <tbody>
                    {(Array.isArray(data) ? data : []).map(t => (
                        <tr key={t.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm">{t.timestamp ? new Date(t.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                            <td className="p-3 font-medium">{t.description}</td>
                            <td className="p-3 text-sm">{t.category}</td>
                            <td className={`p-3 text-right font-mono ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(t.amount)}</td>
                            <td className="p-3 text-center">
                                <div className="flex justify-center space-x-2">
                                    <button onClick={() => onEdit(t)} className="p-1 rounded-full text-emerald-600 hover:bg-emerald-100"><Edit size={16} /></button>
                                    <button onClick={() => onDelete(t.id)} className="p-1 rounded-full text-red-600 hover:bg-red-100"><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default TransactionTable;