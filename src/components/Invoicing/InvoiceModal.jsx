import React, { useState, useMemo, useEffect } from 'react';
import Modal from '../Shared/Modal';
import FormSelect from '../Shared/FormSelect';
import FormInput from '../Shared/FormInput';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../helpers/helpers';

const InvoiceModal = ({ onClose, residents, onSave }) => {
    const [residentId, setResidentId] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState([{ description: 'Monthly Board & Care', amount: '' }]);
    const validResidents = Array.isArray(residents) ? residents : [];

    // Auto-populate amount if resident is selected and has a rate
    useEffect(() => {
        if (residentId) {
            const resident = validResidents.find(r => r.id === residentId);
            if (resident && resident.monthlyRate && items.length === 1 && items[0].description === 'Monthly Board & Care') {
                setItems([{ description: 'Monthly Board & Care', amount: resident.monthlyRate }]);
            }
        }
    }, [residentId, validResidents]); // Removed 'items' dependency to prevent loop


    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { description: '', amount: '' }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const totalAmount = useMemo(() => items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0), [items]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const residentName = validResidents.find(r => r.id === residentId)?.name || 'N/A';
        onSave({ residentId, residentName, issueDate, dueDate, items, totalAmount, status: 'Draft' });
    };

    return (<Modal onClose={onClose} title="Create New Invoice"><form onSubmit={handleSubmit} className="space-y-4">
        <FormSelect id="residentId" label="Resident" value={residentId} onChange={e => setResidentId(e.target.value)}> <option value="">-- Select Resident --</option>{validResidents.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</FormSelect>
        <div className="grid grid-cols-2 gap-4"><FormInput id="issueDate" label="Issue Date" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} /><FormInput id="dueDate" label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
        <h4 className="font-semibold pt-2 border-t">Invoice Items</h4>
        {items.map((item, index) => (<div key={index} className="flex items-end gap-2"><div className="flex-grow"><FormInput id={`desc-${index}`} label={`Item ${index + 1} Description`} value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} /></div><div className="w-28"><FormInput id={`amount-${index}`} label="Amount" type="number" step="0.01" value={item.amount} onChange={e => handleItemChange(index, 'amount', e.target.value)} /></div><button type="button" onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full mb-1" title="Remove Item"><Trash2 size={16} /></button></div>))}
        <button type="button" onClick={addItem} className="text-sm text-emerald-600 hover:underline">+ Add Line Item</button>
        <div className="text-right font-bold text-xl pt-4 border-t">Total: {formatCurrency(totalAmount)}</div>
        <div className="flex justify-end pt-4"><button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button><button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Save Invoice</button></div>
    </form></Modal>);
};

export default InvoiceModal;