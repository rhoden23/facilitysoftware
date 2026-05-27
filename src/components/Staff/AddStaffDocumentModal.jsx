
import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import FormInput from '../Shared/FormInput';
import FormTextArea from '../Shared/FormTextArea';
import { Info } from 'lucide-react';

const AddStaffDocumentModal = ({ staffMember, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        documentType: '',
        date: new Date().toISOString().split('T')[0],
        expiryDate: '',
        notes: ''
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (
        <Modal onClose={onClose} title={`Log Document for ${staffMember.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput id="documentType" label="Document Type (e.g., I-9, W-4, CPR Cert, Background Check)" value={formData.documentType} onChange={handleChange} />
                <FormInput id="date" label="Document/Reception Date" type="date" value={formData.date} onChange={handleChange} />
                <FormInput id="expiryDate" label="Expiry Date (Optional)" type="date" value={formData.expiryDate} onChange={handleChange} required={false} />
                <FormTextArea id="notes" value={formData.notes} onChange={handleChange} placeholder="Add notes here (e.g., 'Stored in HR folder')" required={false}/>
                <div className="p-3 bg-emerald-50 text-emerald-800 text-sm rounded-md">
                    <Info className="inline w-5 h-5 mr-1" />
                    Record HR/compliance documents. Actual files are stored separately.
                </div>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Save Record</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddStaffDocumentModal;
