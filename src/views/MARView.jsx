import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { formatDateISO } from '../helpers/helpers';
import MedChip from '../components/MAR/MedChip';
import AdministerMedModal from '../components/MAR/AdministerMedModal';

const MARView = ({ medications, residents, staff, medLog, onSaveLog, onDeleteLog, currentUser }) => {
    const [administerModalData, setAdministerModalData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); // State for the currently viewed date
    const [exportTimeframe, setExportTimeframe] = useState('Today'); // State for export range

    // Format today's date for the max attribute of the date input
    const todayISO = formatDateISO(new Date());

    const selectedDateStr = formatDateISO(selectedDate); // Use helper

    // Update state when date input changes
    const handleDateChange = (event) => {
        const dateValue = event.target.value;
        if (dateValue) {
            // Ensure the date is treated as local timezone by adding time component
            const localDate = new Date(dateValue + 'T00:00:00');
            // Prevent selecting future dates relative to today
            if (localDate.getTime() > new Date().setHours(23, 59, 59, 999)) {
                setSelectedDate(new Date()); // Reset to today if future date selected
            } else {
                setSelectedDate(localDate);
            }
        } else {
            setSelectedDate(new Date()); // Fallback to today if input is cleared
        }
    };


    const timeSlots = {
        "Morning": { start: 6, end: 10 },
        "Noon": { start: 11, end: 13 },
        "Evening": { start: 16, end: 18 },
        "Bedtime": { start: 20, end: 22 },
        "PRN": { start: -1, end: -1 } // Special case
    };

    const getMedTimeSlot = (medTime) => {
        if (!medTime) return "PRN";
        try { // Add try...catch for safety
            const hour = parseInt(medTime.split(':')[0], 10);
            if (isNaN(hour)) return "PRN"; // Handle invalid time format
            for (const slot in timeSlots) {
                if (slot === "PRN") continue;
                if (hour >= timeSlots[slot].start && hour <= timeSlots[slot].end) {
                    return slot;
                }
            }
        } catch (e) {
            console.error("Error parsing med time:", medTime, e);
        }
        return "PRN";
    };

    // Updated: groupedMeds now filters based on selectedDateStr
    const groupedMeds = useMemo(() => {
        const grid = {};
        const validResidents = Array.isArray(residents) ? residents : [];
        const validMeds = Array.isArray(medications) ? medications : [];
        const validMedLog = Array.isArray(medLog) ? medLog : [];
        const validStaff = Array.isArray(staff) ? staff : [];

        validResidents.forEach(resident => {
            grid[resident.id] = { resident, slots: {} };
            Object.keys(timeSlots).forEach(slot => { grid[resident.id].slots[slot] = []; });

            validMeds
                .filter(med => med.residentId === resident.id)
                .forEach(med => {
                    const slot = getMedTimeSlot(med.time);
                    // Find the log entry specifically for the selectedDateStr
                    const logEntryForDate = validMedLog.find(l =>
                        l.medicationId === med.id &&
                        l.timestamp &&
                        formatDateISO(new Date(l.timestamp.seconds * 1000)) === selectedDateStr
                    );
                    const staffMember = validStaff.find(s => s.id === logEntryForDate?.staffId);
                    const initials = staffMember ? (staffMember.name || '').split(' ').map(n => n[0]).join('') : '';

                    grid[resident.id].slots[slot].push({ ...med, log: logEntryForDate, status: logEntryForDate?.status || 'due', adminBy: initials });
                });
        });
        return Object.values(grid);
    }, [residents, medications, medLog, selectedDateStr, staff]);

    const handleExportMar = () => {
        const validResidents = Array.isArray(residents) ? residents : [];
        const validMeds = Array.isArray(medications) ? medications : [];
        const validStaff = Array.isArray(staff) ? staff : [];
        const validMedLog = Array.isArray(medLog) ? medLog : [];

        const now = new Date();
        const endDate = new Date(now); // Today
        endDate.setHours(23, 59, 59, 999); // End of today

        const startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0); // Start of today

        let daysToSubtract = 0;
        switch (exportTimeframe) {
            case 'Last 7 Days': daysToSubtract = 6; break;
            case 'Last 15 Days': daysToSubtract = 14; break;
            case 'Last 30 Days': daysToSubtract = 29; break;
            case 'Today':
            default: daysToSubtract = 0; break;
        }
        startDate.setDate(startDate.getDate() - daysToSubtract);

        const startTimestamp = Timestamp.fromDate(startDate);
        const endTimestamp = Timestamp.fromDate(endDate);


        const filteredLogs = validMedLog.filter(log =>
            log.timestamp && log.timestamp >= startTimestamp && log.timestamp <= endTimestamp
        );

        const dataToExport = filteredLogs.map(log => {
            const medication = validMeds.find(m => m.id === log.medicationId);
            const resident = validResidents.find(r => r.id === log.residentId);
            const staffMember = validStaff.find(s => s.id === log.staffId);
            return {
                Date: log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleDateString() : 'N/A',
                Time: log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'N/A',
                Resident: resident ? resident.name : 'Unknown',
                Medication: medication ? medication.name : 'Unknown',
                Dosage: medication ? medication.dosage : 'N/A',
                ScheduledTime: medication ? (medication.time || 'PRN') : 'N/A',
                Status: log.status,
                AdministeredBy: staffMember ? staffMember.name : (log.administeredBy || 'N/A'),
            };
        });

        // Sort data for better readability
        dataToExport.sort((a, b) => {
            // Create comparable numbers from date strings
            const dateNumA = a.Date !== 'N/A' ? new Date(a.Date).getTime() : 0;
            const dateNumB = b.Date !== 'N/A' ? new Date(b.Date).getTime() : 0;
            if (dateNumA !== dateNumB) return dateNumA - dateNumB; // Sort by date first

            // Convert time string "HH:MM AM/PM" to comparable number
            const timeToNum = (timeStr) => {
                if (timeStr === 'N/A') return 0;
                const parts = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i); // More robust regex
                if (!parts) return 0; // Handle parsing errors
                let hours = parseInt(parts[1], 10);
                const minutes = parseInt(parts[2], 10);
                const modifier = parts[3].toUpperCase();

                if (hours === 12) hours = 0; // Handle midnight/noon correctly
                if (modifier === 'PM') hours += 12;
                return hours * 60 + minutes;
            };
            const timeA = timeToNum(a.Time);
            const timeB = timeToNum(b.Time);
            if (timeA !== timeB) return timeA - timeB; // Sort by time second

            return a.Resident.localeCompare(b.Resident); // Then by resident
        });



        const timeframeLabel = exportTimeframe.replace(/\s+/g, '-'); // e.g., Last-7-Days
        const filename = `mar-log-${timeframeLabel}-${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`;
        exportToCSV(dataToExport, filename);
    };

    // Close modal locally after saving
    const handleConfirmAdminister = (logData) => {
        if (administerModalData) { onSaveLog(logData); setAdministerModalData(null); }
    };

    // Close modal after deleting
    const handleDeleteWrapper = (logId) => { onDeleteLog(logId); setAdministerModalData(null); }

    return (<>
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                {/* MAR Date Picker Header */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="mar-date-picker" className="text-sm font-medium text-gray-700">View Date:</label>
                    <input
                        type="date"
                        id="mar-date-picker"
                        value={selectedDateStr}
                        onChange={handleDateChange}
                        max={todayISO} // Prevent selecting future dates
                        className="p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                {/* Export Section */}
                <div className="flex items-center gap-2">
                    <label htmlFor="mar-export-timeframe" className="text-sm font-medium text-gray-700">Export:</label>
                    <select id="mar-export-timeframe" value={exportTimeframe} onChange={(e) => setExportTimeframe(e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                        <option>Today</option> <option>Last 7 Days</option> <option>Last 15 Days</option> <option>Last 30 Days</option>
                    </select>
                    <button onClick={handleExportMar} className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 shadow text-sm">
                        <Download className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 w-48 text-left sticky left-0 bg-gray-100 z-10">Resident</th>
                            {Object.keys(timeSlots).map(slot => (<th key={slot} className="border p-2 text-center min-w-[120px]">{slot}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {groupedMeds.map(({ resident, slots }) => (
                            <tr key={resident.id}>
                                <td className="border p-2 align-top sticky left-0 bg-white z-10">
                                    <div className="flex items-center gap-3">
                                        <img src={resident.photoUrl || `https://placehold.co/48x48/E2E8F0/4A5568?text=${(resident.name || '').split(' ').map(n => n[0]).join('')}`} alt={resident.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
                                        <div>
                                            <p className="font-bold text-sm sm:text-base">{resident.name}</p>
                                            <p className="text-xs text-gray-500">Room: {resident.room}</p>
                                        </div>
                                    </div>
                                </td>
                                {Object.entries(slots).map(([slot, meds]) => (
                                    <td key={slot} className="border p-2 align-top text-center">
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {meds.map(med => (<MedChip key={med.id} med={med} resident={resident} currentUser={currentUser} onClick={() => setAdministerModalData({ med, resident })} />))}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        {administerModalData && <AdministerMedModal data={administerModalData} staffList={staff} onClose={() => setAdministerModalData(null)} onConfirm={handleConfirmAdminister} onDelete={handleDeleteWrapper} currentUser={currentUser} />}
    </>);
};

export default MARView;