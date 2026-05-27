
import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import FormInput from '../Shared/FormInput';
import FormSelect from '../Shared/FormSelect';

const ScheduleModal = ({ onClose, onSave, staffList, initialData, currentUser }) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        staffId: initialData?.staffId || currentUser?.id || '', // Default to current user if adding own
        date: initialData?.date || '',
        startTime: initialData?.startTime || '08:00',
        break1Start: initialData?.break1Start || '',
        break1End: initialData?.break1End || '',
        break2Start: initialData?.break2Start || '',
        break2End: initialData?.break2End || ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    const staffMember = (Array.isArray(staffList) ? staffList : []).find(s => s.id === formData.staffId)?.name || 'Selected Staff';
    const isEditMode = !!formData.id;
    const isAdmin = currentUser.role === 'Admin';
    const canEditStaffField = isAdmin && !isEditMode;
    const canEditDateField = isAdmin && !isEditMode;

    return (
        <Modal onClose={onClose} title={`${isEditMode ? 'Edit' : 'Add'} 12-Hour Shift`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {canEditStaffField ? (
                    <FormSelect id="staffId" label="Staff Member" value={formData.staffId} onChange={handleChange}>
                        <option value="">-- Select Staff --</option>
                        {(Array.isArray(staffList) ? staffList : []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </FormSelect>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
                        <input type="text" value={staffMember} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" />
                        <input type="hidden" id="staffId" name="staffId" value={formData.staffId} />
                    </div>
                )}
                {canEditDateField ? (
                    <FormInput id="date" label="Date" type="date" value={formData.date} onChange={handleChange} />
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="text" value={formData.date ? new Date(formData.date + 'T00:00:00').toLocaleDateString('en-us',{ month:'long', day:'numeric', year: 'numeric' }) : 'N/A'} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" />
                        <input type="hidden" id="date" name="date" value={formData.date} />
                    </div>
                )}
                <FormInput id="startTime" label="Shift Start Time" type="time" value={formData.startTime} onChange={handleChange} />
                <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Breaks (Optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput id="break1Start" label="Break 1 Start" type="time" value={formData.break1Start} onChange={handleChange} required={false} />
                        <FormInput id="break1End" label="Break 1 End" type="time" value={formData.break1End} onChange={handleChange} required={false} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <FormInput id="break2Start" label="Break 2 Start" type="time" value={formData.break2Start} onChange={handleChange} required={false} />
                        <FormInput id="break2End" label="Break 2 End" type="time" value={formData.break2End} onChange={handleChange} required={false} />
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Save Shift</button>
                </div>
            </form>
        </Modal>
    );
};

export default ScheduleModal;
