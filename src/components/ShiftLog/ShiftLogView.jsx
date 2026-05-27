import React, { useState } from 'react';
import { Download, AlertTriangle } from 'lucide-react';
import { exportToCSV } from '../../helpers/helpers';

const ShiftLogView = ({ logs, residents, onAddLog, currentStaffName }) => {
    const [entry, setEntry] = useState('');
    const [category, setCategory] = useState('General Note');
    const [priority, setPriority] = useState('Normal');
    const [residentId, setResidentId] = useState('');
    const validLogs = Array.isArray(logs) ? logs : [];
    const validResidents = Array.isArray(residents) ? residents : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (entry.trim()) {
            onAddLog({ entry, category, priority, residentId, author: currentStaffName });
            setEntry(''); setCategory('General Note'); setPriority('Normal'); setResidentId('');
        }
    };

    const handleExport = () => {
        const dataToExport = validLogs.map(log => ({
            Date: log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleDateString() : 'N/A',
            Time: log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString() : 'N/A',
            Category: log.category,
            Priority: log.priority,
            Resident: validResidents.find(r => r.id === log.residentId)?.name || 'N/A',
            Entry: log.entry,
            Author: log.author,
        }));
        exportToCSV(dataToExport, 'shift-log');
    };

    const categoryStyles = {
        'Resident Care': 'border-emerald-500', 'Facility': 'border-green-500', 'Appointment': 'border-purple-500', 'Incident': 'border-red-500', 'General Note': 'border-gray-400'
    };

    return (<div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Shift Log</h2>
            <button onClick={handleExport} className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 shadow text-sm"><Download className="w-4 h-4 mr-2" />Export to CSV</button>
        </div>
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-4"><textarea value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="Add a new log entry..." className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" rows="3"></textarea><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded-md"><option>General Note</option><option>Resident Care</option><option>Facility</option><option>Appointment</option><option>Incident</option></select><select value={priority} onChange={e => setPriority(e.target.value)} className="w-full p-2 border rounded-md"><option>Normal</option><option>High Priority</option></select><select value={residentId} onChange={e => setResidentId(e.target.value)} className="w-full p-2 border rounded-md"><option value="">N/A (Facility Note)</option>{validResidents.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div><button type="submit" className="mt-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">Add Entry</button></form><div className="space-y-4 max-h-[60vh] overflow-y-auto">{validLogs.map(log => (<div key={log.id} className={`p-4 bg-white border-l-4 rounded-r-lg shadow-sm ${categoryStyles[log.category] || 'border-gray-400'}`}>{log.priority === 'High Priority' && <div className="font-bold text-red-600 flex items-center mb-2"><AlertTriangle className="w-4 h-4 mr-2" />HIGH PRIORITY</div>}<div className="flex justify-between items-start"><p className="text-gray-800 flex-1 pr-4"><strong>{log.category}{log.residentId ? ` (${validResidents.find(r => r.id === log.residentId)?.name || ''})` : ''}: </strong>{log.entry}</p><div className="text-right text-xs text-gray-500"><p>{log.author}</p><p>{log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : ''}</p></div></div></div>))}</div></div>);
};

export default ShiftLogView;