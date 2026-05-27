import React, { useState } from 'react';
import Modal from '../components/Shared/Modal';
import FormInput from '../components/Shared/FormInput';
import FormSelect from '../components/Shared/FormSelect';
import { formatDateISO, formatCurrency } from '../helpers/helpers';

const AddPaymentModal = ({ onClose, onSave, invoice }) => {
    const [formData, setFormData] = useState({
        amount: '',
        date: formatDateISO(new Date()), // Default to today
        method: 'Check',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            amount: parseFloat(formData.amount || 0), // Ensure amount is a number
            invoiceId: invoice.id,
            residentId: invoice.residentId,
        });
    };

    return (
        <Modal onClose={onClose} title={`Add Payment for ${invoice.residentName}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-gray-100 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Invoice Total</p>
                    <p className="text-2xl font-bold">{formatCurrency(invoice.totalAmount)}</p>
                    {/* We need payment data here to show balance... or pass it in */}
                    {/* For simplicity, just show total for now */}
                </div>
                <FormInput
                    id="amount"
                    label="Payment Amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required={true}
                />
                <FormInput
                    id="date"
                    label="Payment Date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required={true}
                />
                <FormSelect id="method" label="Payment Method" value={formData.method} onChange={handleChange}>
                    <option>Check</option>
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>Other</option>
                </FormSelect>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save Payment</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddPaymentModal;
