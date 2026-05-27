
import React, { useState } from 'react';
import FormInput from '../components/Shared/FormInput';

const SetupScreen = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        facilityName: '',
        facilityAddress: '', // Added
        facilityPhone: '', // Added
        role: 'Admin',
        phone: '',
        password: ''
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome to RCFE-MS!</h2>
                    <p className="mt-2 text-gray-500">{onCancel ? "Let's set up your new facility and its administrator." : "Let's set up your first facility and administrator account."}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput id="facilityName" label="Facility Name" value={formData.facilityName} onChange={handleChange} />
                    <FormInput id="facilityAddress" label="Facility Address" value={formData.facilityAddress} onChange={handleChange} required={false} />
                    <FormInput id="facilityPhone" label="Facility Phone" type="tel" value={formData.facilityPhone} onChange={handleChange} required={false} />
                    <hr/>
                    <FormInput id="name" label="Your Full Name (Admin)" value={formData.name} onChange={handleChange} />
                    <FormInput id="phone" label="Your Phone Number" type="tel" value={formData.phone} onChange={handleChange} required={false}/>
                    <FormInput id="password" label="Create a Password" type="password" value={formData.password} onChange={handleChange} />
                    <p className="text-sm text-gray-500 bg-emerald-50 p-3 rounded-md">This first account will have <strong className="font-semibold">Admin</strong> privileges.</p>
                    <div className="flex flex-col sm:flex-row-reverse gap-2">
                        <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">Create Account & Facility</button>
                        {onCancel && <button type="button" onClick={onCancel} className="w-full sm:w-auto px-4 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetupScreen;
