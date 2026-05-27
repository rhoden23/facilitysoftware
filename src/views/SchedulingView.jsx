import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Download, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { formatDateISO, timeToAmPm } from '../helpers/helpers';
import DailyRoster from '../components/Scheduling/DailyRoster';

const SchedulingView = ({ schedules, staff, dailyAssignments, onOpenScheduleModal, onDeleteSchedule, onSaveAssignment, currentUser }) => {
    // State to manage the currently displayed month
    const [currentMonthDate, setCurrentMonthDate] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1); // Start with the 1st of the current month
    });
    // Default to first half, or second half if today's date is > 15
    const [periodType, setPeriodType] = useState(() => {
        const today = new Date();
        return today.getDate() > 15 ? 'secondHalf' : 'firstHalf';
    });

    const validSchedules = Array.isArray(schedules) ? schedules : [];
    const validStaff = Array.isArray(staff) ? staff : [];
    const isAdmin = currentUser.role === 'Admin';

    // --- Time Calculation Helper --- (Moved BEFORE useMemo)
    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return 0;
        try {
            const baseDate = '1970-01-01T';
            const start = new Date(`${baseDate}${startTime}`);
            const end = new Date(`${baseDate}${endTime}`);
            if (isNaN(start) || isNaN(end)) return 0;
            let diffMillis = end - start;
            if (diffMillis < 0) { diffMillis += 24 * 60 * 60 * 1000; }
            return diffMillis / (1000 * 60 * 60);
        } catch (e) { console.error("Error calculating duration:", e); return 0; }
    };

    // --- Calculate Total Hours per Staff for the Period --- (Moved BEFORE useMemo)
    const calculateTotalHours = (staffId, periodStart, periodEnd) => {
        const startISO = formatDateISO(periodStart);
        const endISO = formatDateISO(periodEnd);

        const staffSchedules = validSchedules.filter(s =>
            s.staffId === staffId &&
            s.date >= startISO &&
            s.date <= endISO &&
            s.startTime
        );

        let totalHours = 0;
        staffSchedules.forEach(s => {
            let shiftEndTime;
            try {
                const shiftStartDate = new Date(`${s.date}T${s.startTime}`);
                if (isNaN(shiftStartDate.getTime())) throw new Error("Invalid start time");
                // Add 12 hours for end time calculation
                const shiftEndDate = new Date(shiftStartDate.getTime() + 12 * 60 * 60 * 1000);
                shiftEndTime = `${String(shiftEndDate.getHours()).padStart(2, '0')}:${String(shiftEndDate.getMinutes()).padStart(2, '0')}`;
            } catch (e) {
                console.error(`Could not parse start time for shift ${s.id}: ${s.startTime}`, e);
                shiftEndTime = null;
            }

            let shiftDuration = calculateDuration(s.startTime, shiftEndTime);
            const break1Duration = calculateDuration(s.break1Start, s.break1End);
            const break2Duration = calculateDuration(s.break2Start, s.break2End);

            totalHours += Math.max(0, (shiftDuration - break1Duration - break2Duration));
        });

        return totalHours.toFixed(2);
    };

    // Calculate start and end dates of the selected period based on currentMonthDate
    // FIX: Moved periodInfo definition before periodDays
    const periodInfo = useMemo(() => {
        const year = currentMonthDate.getFullYear();
        const month = currentMonthDate.getMonth(); // 0-indexed month
        let start, end, label;

        if (periodType === 'firstHalf') {
            start = new Date(year, month, 1);
            end = new Date(year, month, 15);
            label = `${start.toLocaleDateString('en-US', { month: 'short' })} 1-15, ${year}`;
        } else { // secondHalf
            start = new Date(year, month, 16);
            end = new Date(year, month + 1, 0); // Last day of current month
            label = `${start.toLocaleDateString('en-US', { month: 'short' })} 16-${end.getDate()}, ${year}`;
        }
        start.setHours(0, 0, 0, 0); // Ensure start is beginning of day
        end.setHours(23, 59, 59, 999); // Ensure end is end of day
        return { periodStartDate: start, periodEndDate: end, periodLabel: label };
    }, [currentMonthDate, periodType]); // Depend on currentMonthDate

    // Generate array of dates for the current period
    const periodDays = useMemo(() => {
        const days = [];
        let current = new Date(periodInfo.periodStartDate);
        // Loop corrected to include end date
        while (current.getTime() <= periodInfo.periodEndDate.getTime()) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    }, [periodInfo]); // Depend on periodInfo object

    // --- Navigation Functions ---
    const changePeriod = (direction) => { // direction is 'prev' or 'next'
        const currentType = periodType; // Capture current type before state update potentially changes it

        if (currentType === 'firstHalf') {
            if (direction === 'prev') {
                // Go to second half of previous month
                setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
                setPeriodType('secondHalf');
            } else { // next
                // Go to second half of current month (just change type)
                setPeriodType('secondHalf');
            }
        } else { // secondHalf
            if (direction === 'prev') {
                // Go to first half of current month (just change type)
                setPeriodType('firstHalf');
            } else { // next
                // Go to first half of next month
                setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
                setPeriodType('firstHalf');
            }
        }
    };

    // --- Export Function (Updated for Bi-Monthly) ---
    const handleExport = () => {
        const dataToExport = validStaff.map(s => {
            const staffSchedulesInPeriod = validSchedules.filter(sch =>
                sch.staffId === s.id &&
                sch.date >= formatDateISO(periodInfo.periodStartDate) && // Use periodInfo
                sch.date <= formatDateISO(periodInfo.periodEndDate) // Use periodInfo
            ).sort((a, b) => a.date.localeCompare(b.date));

            const dailySummaries = {};
            periodDays.forEach(day => {
                const dateStr = formatDateISO(day);
                const schedule = staffSchedulesInPeriod.find(sch => sch.date === dateStr);
                let summary = 'OFF';
                if (schedule && schedule.startTime) { // Check startTime existence
                    try {
                        const shiftStartDate = new Date(`${schedule.date}T${schedule.startTime}`);
                        const shiftEndDate = new Date(shiftStartDate.getTime() + 12 * 60 * 60 * 1000);
                        const shiftEndTime = `${String(shiftEndDate.getHours()).padStart(2, '0')}:${String(shiftEndDate.getMinutes()).padStart(2, '0')}`;
                        summary = `${timeToAmPm(schedule.startTime)}-${timeToAmPm(shiftEndTime)}`;
                    } catch {
                        summary = 'Invalid Time';
                    }
                    if (schedule.break1Start) summary += ` (B1: ${timeToAmPm(schedule.break1Start)}-${timeToAmPm(schedule.break1End)})`;
                    if (schedule.break2Start) summary += ` (B2: ${timeToAmPm(schedule.break2Start)}-${timeToAmPm(schedule.break2End)})`;
                }
                dailySummaries[`Day_${day.getDate()}`] = summary;
            });


            return {
                Staff: s.name,
                Period: periodInfo.periodLabel, // Use periodInfo
                TotalHours: calculateTotalHours(s.id, periodInfo.periodStartDate, periodInfo.periodEndDate), // Use periodInfo
                ...dailySummaries
            };
        });

        const filename = `schedule-${periodInfo.periodLabel.replace(/,/g, '').replace(/\s+/g, '-')}`;
        exportToCSV(dataToExport, filename);
    };


    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Staff Schedule</h2>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button onClick={handleExport} className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 shadow text-sm">
                        <Download className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Export Period</span>
                    </button>
                    <button onClick={() => changePeriod('prev')} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeft /></button>
                    <span className="font-semibold text-base sm:text-lg text-center">{periodInfo.periodLabel}</span> {/* Use periodInfo */}
                    <button onClick={() => changePeriod('next')} className="p-2 rounded-full hover:bg-gray-200"><ChevronRight /></button>
                </div>
            </div>
            {isAdmin && <DailyRoster weekStart={periodInfo.periodStartDate} staff={validStaff} onSave={onSaveAssignment} assignments={dailyAssignments} />} {/* Use periodInfo */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full min-w-[1200px]">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="w-40 p-2 border-r text-left font-semibold text-gray-700 sticky left-0 bg-gray-100 z-10">Staff</th>
                            {periodDays.map(day => (
                                <th key={day.toISOString()} className="min-w-[80px] p-2 border-r text-center font-semibold text-gray-700 text-xs">
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}<br />{day.getDate()}
                                </th>
                            ))}
                            <th className="w-24 p-2 border-l text-center font-semibold text-gray-700 sticky right-0 bg-gray-100 z-10">Total Hrs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validStaff.map(s => (
                            <tr key={s.id} className="border-t">
                                <td className={`w-40 p-2 border-r font-semibold sticky left-0 group-hover:bg-gray-50 z-10 ${s.id === currentUser.id ? 'bg-emerald-50' : 'bg-white'}`}>
                                    {s.name}{s.id === currentUser.id && <span className="text-xs text-emerald-600 ml-1">(You)</span>}
                                </td>
                                {periodDays.map(day => {
                                    const dateStr = formatDateISO(day);
                                    const schedule = validSchedules.find(sch => sch.staffId === s.id && sch.date === dateStr);
                                    const isCurrentUserRow = s.id === currentUser.id;

                                    return (
                                        <td key={day.toISOString()} className="min-w-[80px] h-24 p-1 border-r text-center align-top relative group text-xs">
                                            {schedule ? (
                                                <div className="bg-emerald-100 text-emerald-800 rounded-md p-1 h-full flex flex-col justify-between">
                                                    <div>
                                                        <p className="font-bold">
                                                            {timeToAmPm(schedule.startTime)} -
                                                            {schedule.startTime ? timeToAmPm(new Date(new Date(`1970-01-01T${schedule.startTime}`).getTime() + 12 * 60 * 60 * 1000).toTimeString().slice(0, 5)) : ''}
                                                        </p>
                                                        {schedule.break1Start && <p>B1: {timeToAmPm(schedule.break1Start)}-{timeToAmPm(schedule.break1End)}</p>}
                                                        {schedule.break2Start && <p>B2: {timeToAmPm(schedule.break2Start)}-{timeToAmPm(schedule.break2End)}</p>}
                                                    </div>
                                                    <div className="absolute top-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {(isAdmin || isCurrentUserRow) && (
                                                            <button onClick={() => onOpenScheduleModal(schedule)} className="p-1 rounded-full bg-emerald-500 text-white mr-0.5" title="Edit Shift"><Edit size={10} /></button>
                                                        )}
                                                        {isAdmin && (
                                                            <button onClick={() => onDeleteSchedule(schedule.id)} className="p-1 rounded-full bg-red-500 text-white" title="Delete Shift"><Trash2 size={10} /></button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                (isAdmin || isCurrentUserRow) && (
                                                    <button onClick={() => onOpenScheduleModal({ staffId: s.id, date: dateStr })} className="w-full h-full flex items-center justify-center text-gray-300 hover:text-emerald-500 transition-colors opacity-30 hover:opacity-100" title="Add Shift">
                                                        <PlusCircle size={14} />
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    );
                                })}
                                <td className="w-24 p-2 border-l text-center font-semibold sticky right-0 z-10 bg-gray-50">
                                    {calculateTotalHours(s.id, periodInfo.periodStartDate, periodInfo.periodEndDate)} {/* Use periodInfo */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchedulingView;