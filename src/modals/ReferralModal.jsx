import React, { useState } from 'react';
import Modal from '../components/Shared/Modal';
import FormInput from '../components/Shared/FormInput';
import FormSelect from '../components/Shared/FormSelect';

const ReferralModal = ({ onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        applicantName: initialData?.applicantName || '',
        source: initialData?.source || '',
        status: initialData?.status || 'Pending'
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    const isEditMode = !!formData.id;

    return (<Modal onClose={onClose} title={isEditMode ? "Edit Referral" : "Add New Referral"}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput id="applicantName" label="Applicant Name" value={formData.applicantName} onChange={handleChange} />
            <FormInput id="source" label="Referral Source (e.g., Hospital, Doctor, Website)" value={formData.source} onChange={handleChange} />
            <FormSelect id="status" label="Status" value={formData.status} onChange={handleChange}>
                <option>Pending</option><option>Contacted</option><option>Tour Scheduled</option><option>Closed</option>
            </FormSelect>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">Save Referral</button>
            </div>
        </form>
    </Modal>);
};

export default ReferralModal;