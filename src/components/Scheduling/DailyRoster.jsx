
import React from 'react';
import FormSelect from '../Shared/FormSelect';
import { formatDateISO } from '../../helpers/helpers';

const DailyRoster = ({ weekStart, staff, onSave, assignments }) => {
    const validStaff = Array.isArray(staff) ? staff : [];
    const validAssignments = Array.isArray(assignments) ? assignments : [];

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
    });

    const getAssignmentForDay = (date) => {
        const dateStr = formatDateISO(date);
        return validAssignments.find(a => a.date === dateStr) || { day1: '', day2: '', night: '' };
    };

    const handleAssignmentChange = (date, shift, staffId) => {
        const dateStr = formatDateISO(date);
        const existingAssignment = getAssignmentForDay(date);
        const dataToSave = {
            id: validAssignments.find(a => a.date === dateStr)?.id || null,
            date: dateStr,
            day1: existingAssignment.day1,
            day2: existingAssignment.day2,
            night: existingAssignment.night,
            [shift]: staffId,
        };
        onSave(dataToSave);
    };

    return (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Daily Staff Assignments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
                {weekDays.map(day => (
                    <div key={day.toISOString()} className="space-y-2">
                        <h4 className="font-semibold text-center text-gray-800 bg-gray-200 rounded-t-md py-1">{day.toLocaleDateString('en-US', { weekday: 'short' })}</h4>
                        <div className="p-2 space-y-2 bg-white rounded-b-md border">
                            <FormSelect id={`assign-day1-${day.toISOString()}`} label="Day 1" value={getAssignmentForDay(day).day1} onChange={(e) => handleAssignmentChange(day, 'day1', e.target.value)} required={false}><option value="">-</option>{validStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</FormSelect>
                            <FormSelect id={`assign-day2-${day.toISOString()}`} label="Day 2" value={getAssignmentForDay(day).day2} onChange={(e) => handleAssignmentChange(day, 'day2', e.target.value)} required={false}><option value="">-</option>{validStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</FormSelect>
                            <FormSelect id={`assign-night-${day.toISOString()}`} label="Night" value={getAssignmentForDay(day).night} onChange={(e) => handleAssignmentChange(day, 'night', e.target.value)} required={false}><option value="">-</option>{validStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</FormSelect>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyRoster;
