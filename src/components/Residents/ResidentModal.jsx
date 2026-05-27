import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import FormInput from '../Shared/FormInput';
import FormSelect from '../Shared/FormSelect';
import { resizeImage } from '../../helpers/helpers';

const ResidentModal = ({ onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        name: initialData?.name || '',
        dob: initialData?.dob || '',
        room: initialData?.room || '',
        photoUrl: initialData?.photoUrl || '',
        emergencyContactName: initialData?.emergencyContactName || '',
        emergencyContactPhone: initialData?.emergencyContactPhone || '',
        familyEmail: initialData?.familyEmail || '',
        isAlw: initialData?.isAlw || false,
        allergies: initialData?.allergies || 'NKA',
        diet: initialData?.diet || 'Regular',
        pcpName: initialData?.pcpName || '',
        pcpPhone: initialData?.pcpPhone || '',
        careLevel: initialData?.careLevel || 'Minimal Assist',
        monthlyRate: initialData?.monthlyRate || 0 // Added monthlyRate
    });
    const [isUploading, setIsUploading] = useState(false);


    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            try {
                const resizedImage = await resizeImage(file, 200, 200, 0.7);
                setFormData(prev => ({ ...prev, photoUrl: resizedImage }));
            } catch (error) { console.error("Error resizing image:", error); }
            finally { setIsUploading(false); }
        }
    };

    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    const isEditMode = !!formData.id;

    return (<Modal onClose={onClose} title={isEditMode ? 'Edit Resident' : 'Add New Resident'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput id="name" label="Full Name" value={formData.name} onChange={handleChange} />
                <FormInput id="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} />
                <FormInput id="room" label="Room Number" type="text" value={formData.room} onChange={handleChange} />
                <FormSelect id="careLevel" label="Care Level" value={formData.careLevel} onChange={handleChange}><option>Minimal Assist</option><option>Moderate Assist</option><option>Maximum Assist</option><option>Memory Care</option></FormSelect>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resident Photo</label>
                <div className="mt-1 flex items-center gap-4">
                    <img src={formData.photoUrl || `https://placehold.co/80x80/E2E8F0/4A5568?text=Photo`} alt="Resident" className="w-20 h-20 rounded-full object-cover border" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={isUploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50" />
                    {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>
            </div>
            <FormInput id="allergies" label="Allergies" value={formData.allergies} onChange={handleChange} required={false} />
            <FormInput id="diet" label="Dietary Needs" value={formData.diet} onChange={handleChange} required={false} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput id="pcpName" label="Primary Physician Name" value={formData.pcpName} onChange={handleChange} required={false} />
                <FormInput id="pcpPhone" label="Physician Phone" type="tel" value={formData.pcpPhone} onChange={handleChange} required={false} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput id="emergencyContactName" label="Emergency Contact Name" value={formData.emergencyContactName} onChange={handleChange} />
                <FormInput id="emergencyContactPhone" label="Emergency Contact Phone" type="tel" value={formData.emergencyContactPhone} onChange={handleChange} />
            </div>
            <FormInput id="familyEmail" label="Family Contact Email" type="email" value={formData.familyEmail} onChange={handleChange} required={false} />
            {/* --- Added Monthly Rate Field --- */}
            <FormInput id="monthlyRate" label="Monthly Rate ($)" type="number" step="0.01" value={formData.monthlyRate} onChange={handleChange} required={false} />

            <div className="flex items-center">
                <input id="isAlw" type="checkbox" checked={formData.isAlw} onChange={handleChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                <label htmlFor="isAlw" className="ml-2 block text-sm text-gray-900">This resident is an ALW Participant.</label>
            </div>
            <div className="flex justify-end pt-4"><button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button><button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Save Resident</button></div>
        </form></Modal>);
};

export default ResidentModal;