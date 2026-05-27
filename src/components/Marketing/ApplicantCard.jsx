import React, { useState } from 'react';
import { ChevronDown, Edit, Trash2 } from 'lucide-react';

const ApplicantCard = ({ applicant, stages, onUpdateStatus, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white p-3 rounded-md shadow-sm border group relative">
            <p className="font-semibold text-gray-900">{applicant.name}</p>
            <p className="text-sm text-gray-600">{applicant.phone}</p>
            <div className="relative mt-2">
                <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
                    Move to... <ChevronDown className="w-4 h-4" />
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                        {stages.filter(s => s !== applicant.status).map(stage => (
                            <a key={stage} href="#" onClick={(e) => { e.preventDefault(); onUpdateStatus(applicant.id, stage); setIsOpen(false); }}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">{stage}</a>
                        ))}
                    </div>
                )}
            </div>
            {/* Edit/Delete Buttons - visible on hover */}
            <div className="absolute top-1 right-1 flex opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(applicant)} className="p-1 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200" aria-label="Edit applicant">
                    <Edit size={14} />
                </button>
                <button onClick={() => onDelete(applicant.id)} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 ml-1" aria-label="Delete applicant">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

export default ApplicantCard;