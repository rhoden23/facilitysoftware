
import React, { useState } from 'react';
import FormInput from '../Shared/FormInput';
import FormSelect from '../Shared/FormSelect';

const LoginScreen = ({ staffList, onLogin, currentFacility }) => {
    const [selectedStaffId, setSelectedStaffId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const validStaff = Array.isArray(staffList) ? staffList : [];


    const handleLogin = () => {
        setError(''); // Clear previous error
        const staffMember = validStaff.find(s => s.id === selectedStaffId);
        // Basic password check (replace with secure authentication in production)
        if (staffMember && staffMember.password === password) {
            onLogin(staffMember);
        } else {
            setError('Invalid staff name or password. Please try again.');
        }
    };

    return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
            <div className="text-center">
                {/* Safely access facility name */}
                <h2 className="text-3xl font-bold text-gray-800">{currentFacility?.name || 'Facility Login'}</h2>
                <p className="mt-2 text-gray-500">Please select your name and enter your password.</p>
            </div>
            <div className="space-y-4">
                <FormSelect id="staff-login" label="Your Name" value={selectedStaffId} onChange={e => setSelectedStaffId(e.target.value)}>
                    <option value="">-- Select your name --</option>
                    {validStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </FormSelect>
                <FormInput id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button onClick={handleLogin} disabled={!selectedStaffId || !password} className="w-full px-4 py-3 font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed">Log In</button>
            </div>
        </div>
    </div>
)};

export default LoginScreen;
