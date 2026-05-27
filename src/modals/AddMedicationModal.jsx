import React, { useState } from 'react';
import Modal from '../components/Shared/Modal';
import FormInput from '../components/Shared/FormInput';
import FormSelect from '../components/Shared/FormSelect';

const AddMedicationModal = ({ resident, staffList, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', dosage: '', time: '', assignedStaffId: '', frequency: 'Daily', customDays: [false, false, false, false, false, false, false] });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleDayChange = (index) => {
        const newDays = [...formData.customDays];
        newDays[index] = !newDays[index];
        setFormData({ ...formData, customDays: newDays });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal onClose={onClose} title={`Add Medication for ${resident.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput id="name" label="Medication Name" value={formData.name} onChange={handleChange} />
                <FormInput id="dosage" label="Dosage" value={formData.dosage} onChange={handleChange} />
                <FormInput id="time" label="Time (HH:MM)" type="time" value={formData.time} onChange={handleChange} required={false} />
                <FormSelect id="assignedStaffId" label="Assign Staff" value={formData.assignedStaffId} onChange={handleChange} required={false}>
                    <option value="">Unassigned</option>
                    {staffList.map(staff => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
                </FormSelect>
                <FormSelect id="frequency" label="Frequency" value={formData.frequency} onChange={handleChange}>
                    <option>Daily</option>
                    <option>PRN (As Needed)</option>
                    <option>Custom</option>
                </FormSelect>
                {formData.frequency === 'Custom' && (
                    <div className="flex space-x-2">
                        {weekDays.map((day, index) => (
                            <button key={day} type="button" onClick={() => handleDayChange(index)} className={`px-3 py-1 rounded-full text-sm ${formData.customDays[index] ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>{day}</button>
                        ))}
                    </div>
                )}
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Save Medication</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddMedicationModal;