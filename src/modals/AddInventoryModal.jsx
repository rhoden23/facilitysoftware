
import React, { useState } from 'react';
import Modal from '../components/Shared/Modal';
import FormInput from '../components/Shared/FormInput';
import FormSelect from '../components/Shared/FormSelect';

const AddInventoryModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({ category: 'Groceries', name: '', quantity: '1', status: 'Needed' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <Modal onClose={onClose} title="Add Inventory Item">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormSelect id="category" label="Category" value={formData.category} onChange={handleChange}>
                    <option>Groceries</option>
                    <option>Medical Supplies</option>
                    <option>Household Supplies</option>
                    <option>Office Supplies</option>
                    <option>Other</option>
                </FormSelect>
                <FormInput id="name" label="Item Name" value={formData.name} onChange={handleChange} />
                <FormInput id="quantity" label="Quantity (e.g., 1 box, 5 lbs)" type="text" value={formData.quantity} onChange={handleChange} />
                <FormSelect id="status" label="Initial Status" value={formData.status} onChange={handleChange}>
                    <option>Needed</option>
                    <option>Stocked</option>
                </FormSelect>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Save Item</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddInventoryModal;
