import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import FormInput from '../Shared/FormInput';
import FormSelect from '../Shared/FormSelect';

const AddStaffModal = ({ onClose, onSave, currentUser }) => {
    const [formData, setFormData] = useState({ name: '', role: 'Staff', phone: '', password: '', credentials: '', certExpiration: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (<Modal onClose={onClose} title="Add New Staff Member"><form onSubmit={handleSubmit} className="space-y-4">
        <FormInput id="name" label="Full Name" value={formData.name} onChange={handleChange} />
        {currentUser?.role === 'Admin' && (
            <FormSelect id="role" label="Role" value={formData.role} onChange={handleChange}>
                <option>Staff</option>
                <option>Admin</option>
            </FormSelect>
        )}
        <FormInput id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required={false} />
        <FormInput id="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
        <FormInput id="credentials" label="Credentials (e.g., CNA, LVN)" value={formData.credentials} onChange={handleChange} required={false} />
        <FormInput id="certExpiration" label="Certification Expiration" type="date" value={formData.certExpiration} onChange={handleChange} required={false} />
        <div className="flex justify-end pt-4"><button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button><button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Save Staff</button></div></form></Modal>);
};

export default AddStaffModal;