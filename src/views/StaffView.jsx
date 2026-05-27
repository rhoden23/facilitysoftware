import React, { useState } from 'react';
import { UserPlus, Stethoscope, ChevronDown, ChevronUp, FilePlus, Trash2 } from 'lucide-react';

const StaffView = ({ staff, staffDocuments, onAddStaff, onAddDocument, onDeleteDocument, currentUser }) => {
    const [expandedStaffId, setExpandedStaffId] = useState(null);
    const validStaff = Array.isArray(staff) ? staff : [];
    const validStaffDocs = Array.isArray(staffDocuments) ? staffDocuments : [];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
                {currentUser.role === 'Admin' && (
                    <button onClick={onAddStaff} className="flex items-center bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 shadow">
                        <UserPlus className="w-5 h-5 mr-2" /> Add Staff
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {validStaff.map(s => (
                    <div key={s.id} className="p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-emerald-200 mx-auto flex items-center justify-center mb-3">
                                <Stethoscope className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{s.name}</h3>
                            <p className="text-gray-600 font-bold">{s.role}</p>
                            <p className="text-sm text-gray-500 mt-2">Contact: {s.phone || 'N/A'}</p>
                            <p className="text-sm text-gray-500 mt-1">Credentials: {s.credentials || 'N/A'}</p>
                            <p className={`text-sm mt-1 ${s.certExpiration && new Date(s.certExpiration) < new Date() ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                Expires: {s.certExpiration ? new Date(s.certExpiration + 'T00:00:00').toLocaleDateString() : 'N/A'} {/* Added T00:00:00 for timezone consistency */}
                            </p>
                        </div>
                        {/* Details Toggle Button */}
                        <button
                            onClick={() => setExpandedStaffId(expandedStaffId === s.id ? null : s.id)}
                            className="mt-3 text-sm text-emerald-600 hover:underline flex items-center justify-center"
                        >
                            {expandedStaffId === s.id ? 'Hide Details' : 'Show Details'}
                            {expandedStaffId === s.id ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </button>

                        {/* Collapsible Details Section */}
                        {expandedStaffId === s.id && (
                            <div className="mt-4 pt-4 border-t text-sm space-y-4">
                                {/* Staff Document Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-gray-700">Document Records</h4>
                                        <button onClick={() => onAddDocument(s)} className="text-xs flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-md hover:bg-gray-200">
                                            <FilePlus size={12} className="mr-1" /> Log Doc
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 italic mb-2">Log HR/compliance documents received. Actual files stored separately.</p>
                                    <div className="space-y-2 max-h-48 overflow-y-auto bg-white p-2 border rounded-md">
                                        {validStaffDocs.filter(doc => doc.staffId === s.id).length > 0 ? validStaffDocs.filter(doc => doc.staffId === s.id).map(doc => (
                                            <div key={doc.id} className="p-2 border-l-2 border-gray-400 bg-gray-50 rounded-r-md flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-xs">{doc.documentType}</p>
                                                    {/* Correct date formatting for staff docs */}
                                                    <p className="text-xs text-gray-500">
                                                        {doc.date ? new Date(doc.date + 'T00:00:00').toLocaleDateString() : 'N/A'}
                                                        {doc.expiryDate ? ` - Expires: ${new Date(doc.expiryDate + 'T00:00:00').toLocaleDateString()}` : ''}
                                                    </p>
                                                    {doc.notes && <p className="text-xs text-gray-500 mt-1">Note: {doc.notes}</p>}
                                                </div>
                                                <button onClick={() => onDeleteDocument(doc.id)} className="p-1 rounded-full text-red-600 hover:bg-red-100"><Trash2 size={14} /></button>
                                            </div>
                                        )) : <p className="text-gray-500 p-2 text-xs">No document records logged.</p>}
                                    </div>
                                </div>
                                {/* Add other details here if needed */}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffView;