
import React, { useState } from 'react';
import Modal from '../components/Shared/Modal';
import FormInput from '../components/Shared/FormInput';
import FormTextArea from '../components/Shared/FormTextArea';
import { Info } from 'lucide-react';

const AddDocumentModal = ({ resident, onClose, onSave }) => {
    const [formData, setFormData] = useState({ documentType: '', date: new Date().toISOString().split('T')[0], notes: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (<Modal onClose={onClose} title={`Log Document for ${resident.name}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput id="documentType" label="Document Type (e.g., Admission Agreement, POLST)" value={formData.documentType} onChange={handleChange} />
            <FormInput id="date" label="Document/Reception Date" type="date" value={formData.date} onChange={handleChange} />
            <FormTextArea id="notes" value={formData.notes} onChange={handleChange} placeholder="Add notes here (e.g., 'Stored in resident\'s file cabinet')" required={false}/>
            <div className="p-3 bg-emerald-50 text-emerald-800 text-sm rounded-md">
                <Info className="inline w-5 h-5 mr-1" />
                This only creates a record that a document was received. Please manage the actual file separately.
            </div>
            <div className="flex justify-end pt-4"><button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button><button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Save Record</button></div>
        </form>
    </Modal>);
};

export default AddDocumentModal;
