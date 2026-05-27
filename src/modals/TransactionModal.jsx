
import React, { useState } from 'react';
import Modal from '../components/Shared/Modal';
import FormInput from '../components/Shared/FormInput';
import FormSelect from '../components/Shared/FormSelect';

const TransactionModal = ({ onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        type: initialData?.type || 'Income',
        description: initialData?.description || '',
        category: initialData?.category || '',
        amount: initialData?.amount || ''
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    const isEditMode = !!formData.id;

    return (
        <Modal onClose={onClose} title={`${isEditMode ? 'Edit' : 'Add'} Financial Transaction`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormSelect id="type" label="Type" value={formData.type} onChange={handleChange}>
                    <option>Income</option>
                    <option>Expense</option>
                </FormSelect>
                <FormInput id="description" label="Description" value={formData.description} onChange={handleChange} />
                <FormInput id="category" label="Category (e.g., Rent, Utilities, Food)" value={formData.category} onChange={handleChange} />
                <FormInput id="amount" label="Amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} />
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Save Transaction</button>
                </div>
            </form>
        </Modal>
    );
};

export default TransactionModal;
