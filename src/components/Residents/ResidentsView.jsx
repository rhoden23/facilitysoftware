import React, { useState } from 'react';
import { UserPlus, Edit, ChevronDown, ChevronUp, Trash2, FilePlus } from 'lucide-react';
import { formatCurrency } from '../../helpers/helpers';

const ResidentsView = ({ residents, shiftLog, alwRecords, documents, onAddResident, onEditResident, onAddMedication, onDeleteMedication, medications, staff, onAddAlwRecord, onDeleteAlwRecord, onAddDocument, onDeleteDocument, currentUser }) => { // Added currentUser
    const [expandedResident, setExpandedResident] = useState(null);
    const validResidents = Array.isArray(residents) ? residents : [];
    const validMeds = Array.isArray(medications) ? medications : [];
    const validDocs = Array.isArray(documents) ? documents : [];
    const validAlw = Array.isArray(alwRecords) ? alwRecords : [];
    const validLog = Array.isArray(shiftLog) ? shiftLog : [];
    const isAdmin = currentUser.role === 'Admin'; // Check if admin

    return (<div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Resident Management</h2>
            {/* --- Conditional Add Button --- */}
            {isAdmin && (
                <button onClick={onAddResident} className="flex items-center bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 shadow">
                    <UserPlus className="w-5 h-5 mr-2" /> Add Resident
                </button>
            )}
        </div>
        <div className="space-y-4">{validResidents.map(r => (<div key={r.id} className="p-4 border rounded-lg shadow-sm bg-gray-50"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><h3 className="text-xl font-semibold text-gray-900">{r.name}</h3>{r.isAlw && <span className="text-xs font-bold bg-purple-200 text-purple-800 px-2 py-1 rounded-full">ALW</span>}</div><div className="flex items-center space-x-2"><span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">Room {r.room}</span>
            {/* --- Conditional Edit Button --- */}
            {isAdmin && (
                <button onClick={() => onEditResident(r)} className="p-1 rounded-full hover:bg-gray-200" title="Edit Resident">
                    <Edit size={16} className="text-emerald-600" />
                </button>
            )}
            <button onClick={() => setExpandedResident(expandedResident === r.id ? null : r.id)} className="p-1 rounded-full hover:bg-gray-200">{expandedResident === r.id ? <ChevronUp /> : <ChevronDown />}</button></div></div>
            {expandedResident === r.id && (<div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="space-y-2">
                    <p><strong>DOB:</strong> {r.dob}</p><p><strong>Care Level:</strong> {r.careLevel}</p><p><strong>Allergies:</strong> {r.allergies}</p><p><strong>Dietary Needs:</strong> {r.diet}</p><p><strong>Family Email:</strong> {r.familyEmail}</p>
                </div>
                <div className="space-y-2">
                    <p><strong>Emergency Contact:</strong> {r.emergencyContactName} ({r.emergencyContactPhone})</p><p><strong>Primary Physician:</strong> {r.pcpName} ({r.pcpPhone})</p>
                    <p><strong>Monthly Rate:</strong> {formatCurrency(r.monthlyRate)}</p> {/* Display new rate */}
                </div>
                <div className="md:col-span-2 space-y-2">
                    <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">Medications</h4>
                    <ul className="space-y-2 pl-2">{validMeds.filter(m => m.residentId === r.id).map(med => (<li key={med.id} className="flex justify-between items-center"><span>{med.name} ({med.dosage}) - {med.time || 'PRN'} <span className="text-xs italic">({med.assignedStaffName || 'Unassigned'})</span></span>
                        {/* --- Conditional Delete Med Button --- */}
                        {isAdmin && <button onClick={() => onDeleteMedication(med.id)} className="p-1 rounded-full text-red-600 hover:bg-red-100" title="Delete Medication"><Trash2 size={14} /></button>}
                    </li>))}</ul>
                    {/* --- Conditional Add Med Button --- */}
                    {isAdmin && <button onClick={() => onAddMedication(r)} className="text-emerald-500 hover:underline mt-2">+ Add Medication</button>}
                </div>
                <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between items-center border-b pb-1">
                        <h4 className="font-semibold text-gray-700">Document Records</h4>
                        <button onClick={() => onAddDocument(r)} className="text-sm flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200"><FilePlus size={14} className="mr-2" /> Record Document Reception</button>
                    </div>
                    <p className="text-xs text-gray-500 italic">Log the reception/status of admission forms or other important documents. Actual files are not uploaded here.</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-white p-2 border rounded-md">
                        {validDocs.filter(doc => doc.residentId === r.id).length > 0 ? validDocs.filter(doc => doc.residentId === r.id).map(doc => (
                            <div key={doc.id} className="p-2 border-l-2 border-gray-400 bg-gray-50 rounded-r-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{doc.documentType}</p>
                                    <p className="text-xs text-gray-500">{doc.date ? new Date(doc.date + 'T00:00:00').toLocaleDateString() : 'N/A'} - {doc.notes}</p>
                                </div>
                                {/* --- Conditional Delete Doc Button --- */}
                                {isAdmin && <button onClick={() => onDeleteDocument(doc.id)} className="p-1 rounded-full text-red-600 hover:bg-red-100" title="Delete Document Record"><Trash2 size={14} /></button>}
                            </div>
                        )) : <p className="text-gray-500 p-2">No document records logged for this resident.</p>}
                    </div>
                </div>
                {r.isAlw && <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between items-center border-b pb-1">
                        <h4 className="font-semibold text-gray-700">ALW Electronic Records</h4>
                        {/* --- Conditional Add ALW Button --- */}
                        {isAdmin && <button onClick={() => onAddAlwRecord(r)} className="text-sm flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-md hover:bg-purple-200"><PlusCircle size={14} className="mr-2" /> Add ALW Record</button>}
                    </div>
                    <p className="text-xs text-gray-500 italic">Log ALW-specific documents. Actual files are handled separately.</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-white p-2 border rounded-md">
                        {validAlw.filter(rec => rec.residentId === r.id).length > 0 ? validAlw.filter(rec => rec.residentId === r.id).map(rec => (
                            <div key={rec.id} className="p-2 border-l-2 border-purple-400 bg-purple-50 rounded-r-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{rec.documentType}</p>
                                    <p className="text-xs text-gray-500">{rec.date ? new Date(rec.date + 'T00:00:00').toLocaleDateString() : 'N/A'} - {rec.notes}</p>
                                </div>
                                {/* --- Conditional Delete ALW Button --- */}
                                {isAdmin && <button onClick={() => onDeleteAlwRecord(rec.id)} className="p-1 rounded-full text-red-600 hover:bg-red-100" title="Delete ALW Record"><Trash2 size={14} /></button>}
                            </div>
                        )) : <p className="text-gray-500 p-2">No ALW records logged for this resident.</p>}
                    </div>
                </div>}
                <div className="md:col-span-2 space-y-2">
                    <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">Progress Notes</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-white p-2 border rounded-md">
                        {validLog.filter(log => log.residentId === r.id).length > 0 ? validLog.filter(log => log.residentId === r.id).map(log => (
                            <div key={log.id} className="p-2 border-l-2 border-emerald-400 bg-emerald-50 rounded-r-md">
                                <p className="text-xs text-gray-500">{log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : ''} - {log.author}</p>
                                <p className="text-gray-800">{log.entry}</p>
                            </div>
                        )) : <p className="text-gray-500 p-2">No progress notes for this resident.</p>}
                    </div>
                </div>
            </div>)}
        </div>))}</div></div>);
};

export default ResidentsView;