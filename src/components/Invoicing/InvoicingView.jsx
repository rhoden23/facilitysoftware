import React, { useMemo } from 'react';
import { PlusCircle, Landmark, FileText, Send, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../helpers/helpers';

const InvoicingView = ({ invoices, residents, payments, onNewInvoice, onUpdateStatus, onDelete, onSetViewingInvoice, onSendInvoice, onAddPayment }) => {
    const validInvoices = Array.isArray(invoices) ? invoices : [];
    const validResidents = Array.isArray(residents) ? residents : [];
    const validPayments = Array.isArray(payments) ? payments : [];

    // Memoize payment calculations
    const invoicePaymentData = useMemo(() => {
        const paymentMap = new Map();
        validPayments.forEach(p => {
            const currentTotal = paymentMap.get(p.invoiceId) || 0;
            paymentMap.set(p.invoiceId, currentTotal + parseFloat(p.amount || 0));
        });
        return paymentMap;
    }, [validPayments]);

    const getInvoiceStatus = (inv, totalPaid) => {
        const totalAmount = parseFloat(inv.totalAmount || 0);
        // Check totalPaid against totalAmount with a small tolerance for floating point issues
        if (totalPaid >= totalAmount - 0.001) return { text: 'Paid', color: 'bg-green-100 text-green-800' };
        if (totalPaid > 0) return { text: 'Partial', color: 'bg-yellow-100 text-yellow-800' };
        if (inv.status === 'Sent') return { text: 'Sent', color: 'bg-emerald-100 text-emerald-800' };
        return { text: 'Draft', color: 'bg-gray-100 text-gray-800' };
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Client Invoicing</h2>
                <button onClick={onNewInvoice} className="flex items-center bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 shadow"><PlusCircle className="w-5 h-5 mr-2" /> New Invoice</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-3">Resident</th>
                            <th className="p-3">Issue Date</th>
                            <th className="p-3">Due Date</th>
                            <th className="p-3 text-right">Total</th>
                            <th className="p-3 text-right">Paid</th>
                            <th className="p-3 text-right">Balance</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validInvoices.map(inv => {
                            const totalAmount = parseFloat(inv.totalAmount || 0);
                            const totalPaid = invoicePaymentData.get(inv.id) || 0;
                            const balanceDue = totalAmount - totalPaid;
                            const status = getInvoiceStatus(inv, totalPaid);

                            return (
                                <tr key={inv.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{inv.residentName}</td>
                                    <td className="p-3">{inv.issueDate ? new Date(inv.issueDate + 'T00:00:00').toLocaleDateString() : 'N/A'}</td>
                                    <td className="p-3">{inv.dueDate ? new Date(inv.dueDate + 'T00:00:00').toLocaleDateString() : 'N/A'}</td>
                                    <td className="p-3 text-right font-mono">{formatCurrency(totalAmount)}</td>
                                    <td className="p-3 text-right font-mono text-green-600">{formatCurrency(totalPaid)}</td>
                                    <td className="p-3 text-right font-mono font-semibold">{formatCurrency(balanceDue)}</td>
                                    <td className="p-3 text-center"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>{status.text}</span></td>
                                    <td className="p-3">
                                        <div className="flex justify-center items-center space-x-1">
                                            <button onClick={() => onAddPayment(inv)} className="p-1 rounded text-green-600 hover:bg-green-100" title="Add Payment"><Landmark size={16} /></button>
                                            <button onClick={() => onSetViewingInvoice(inv)} className="p-1 rounded text-gray-600 hover:bg-gray-200" title="View"><FileText size={16} /></button>
                                            <button onClick={() => onSendInvoice(inv)} className="p-1 rounded text-emerald-600 hover:bg-emerald-100" title="Send"><Send size={16} /></button>
                                            <button onClick={() => onDelete(inv.id)} className="p-1 rounded-full text-red-600 hover:bg-red-100" title="Delete"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default InvoicingView;