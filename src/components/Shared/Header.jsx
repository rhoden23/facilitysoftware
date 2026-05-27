import React from 'react';
import { LogOut } from 'lucide-react';

const Header = ({ staffName, onLogout }) => (
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {staffName || 'Staff'}</h1>
        <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 text-right">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <button onClick={onLogout} className="flex items-center text-sm text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100">
                <LogOut className="w-4 h-4 mr-1" /> Logout
            </button>
        </div>
    </div>
);

export default Header;