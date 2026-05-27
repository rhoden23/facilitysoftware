import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import FormInput from '../Shared/FormInput';

const ApplicantModal = ({ onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        name: initialData?.name || '',
        phone: initialData?.phone || ''
        // Note: 'status' is managed in MarketingView, not here.
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    const isEditMode = !!formData.id;

    return (<Modal onClose={onClose} title={isEditMode ? "Edit Applicant" : "Add New Applicant"}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput id="name" label="Applicant Name" value={formData.name} onChange={handleChange} />
            <FormInput id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required={false} />
            <div className="flex justify-end pt-4">
                <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Save Applicant</button>
            </div>
        </form>
    </Modal>);
};

export default ApplicantModal;