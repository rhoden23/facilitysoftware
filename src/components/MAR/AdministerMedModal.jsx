
import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import FormSelect from '../Shared/FormSelect';

const AdministerMedModal = ({ data, staffList, onClose, onConfirm, onDelete, currentUser }) => {
    const { med, resident } = data;
    const [selectedStaffId, setSelectedStaffId] = useState(med.log?.staffId || '');
    const isEditMode = !!med.log;

    const handleConfirm = (status) => {
        if (selectedStaffId) {
            onConfirm({
                logId: med.log?.id || null,
                medicationId: med.id,
                residentId: resident.id,
                staffId: selectedStaffId,
                status,
            });
        } else {
            alert("Please select your name to confirm.");
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to revert this log entry? This action cannot be undone.")) {
            onDelete(med.log.id);
        }
    }

    return (
        <Modal onClose={onClose} title={`${isEditMode ? 'Edit' : 'Administer'} Medication`}>
            <div className="text-center space-y-2">
                <p className="text-lg">Administering:</p>
                <p className="font-bold text-xl my-2">{med.name} ({med.dosage})</p>
                <p className="text-lg">to</p>
                <p className="font-bold text-xl my-2">{resident.name}</p>
            </div>
            <div className="mt-4 pt-4 border-t">
                <FormSelect id="staff-select" label="Confirm Your Name" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)}>
                    <option value="">-- Select Staff --</option>
                    {(Array.isArray(staffList) ? staffList : []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </FormSelect>
            </div>
            <div className="flex flex-wrap justify-center pt-6 mt-4 gap-2">
                <button type="button" onClick={() => handleConfirm('administered')} disabled={!selectedStaffId} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">Taken</button>
                <button type="button" onClick={() => handleConfirm('refused')} disabled={!selectedStaffId} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed">Refused</button>
                <button type="button" onClick={() => handleConfirm('skipped')} disabled={!selectedStaffId} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">Skipped</button>
                <button type="button" onClick={onClose} className="px-4 py-2 bg-red-200 text-red-800 rounded-md hover:bg-red-300">Cancel</button>
            </div>
            {isEditMode && currentUser.role === 'Admin' && (
                <div className="mt-4 pt-4 border-t text-center">
                    <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">Revert to Due (Admin)</button>
                </div>
            )}
        </Modal>
    )
};

export default AdministerMedModal;
