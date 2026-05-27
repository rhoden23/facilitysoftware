import React from 'react';
import { Clock } from 'lucide-react';

const MedChip = ({ med, resident, onClick, currentUser }) => {
    const statusStyles = {
        due: 'bg-red-100 text-red-800 hover:bg-red-200',
        administered: 'bg-green-100 text-green-800', // Default cursor if not admin
        refused: 'bg-yellow-100 text-yellow-800', // Default cursor if not admin
        skipped: 'bg-gray-200 text-gray-700', // Default cursor if not admin
    };

    // Clickable if Admin OR if status is 'due'
    const isClickable = currentUser.role === 'Admin' || med.status === 'due';
    // Add hover effect only if clickable and not 'due' (due already has hover)
    const hoverClass = isClickable && med.status !== 'due' ? 'hover:bg-opacity-80' : '';
    const cursorClass = isClickable ? 'cursor-pointer' : 'cursor-default';
    const administeredTime = med.log?.timestamp ? new Date(med.log.timestamp.seconds * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : null;


    return (
        <div onClick={isClickable ? onClick : undefined} className={`p-2 rounded-lg text-xs w-full text-left transition-colors ${statusStyles[med.status]} ${cursorClass} ${hoverClass}`}>
            <p className="font-bold">{med.name} <span className="font-normal">{med.dosage}</span></p>
            {/* Show Time Administered */}
            {med.status === 'administered' && <p className="text-xs flex items-center"><Clock size={12} className="inline mr-1" />{administeredTime} ({med.adminBy})</p>}
            {med.status === 'refused' && <p className="text-xs">Refused</p>}
            {med.status === 'skipped' && <p className="text-xs">Skipped</p>}
        </div>
    );
};

export default MedChip;