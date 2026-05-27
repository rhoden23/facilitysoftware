
import React, { useState, useMemo } from 'react';
import { Timestamp } from 'firebase/firestore';
import StatCard from '../components/Dashboard/StatCard';
import { Users, Pill, AlertTriangle } from 'lucide-react';

const DataInsightsView = ({ residents, medLog, shiftLog }) => {
    const [timeframe, setTimeframe] = useState('Today'); // 'Today', '7 Days', '30 Days'
    const totalCapacity = 12; // Assuming a total capacity for the facility

    const { startDate, endDate } = useMemo(() => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        let daysToSubtract = 0;
        if (timeframe === '7 Days') daysToSubtract = 6;
        else if (timeframe === '30 Days') daysToSubtract = 29;

        start.setDate(start.getDate() - daysToSubtract);
        return { startDate: Timestamp.fromDate(start), endDate: Timestamp.fromDate(end) };
    }, [timeframe]);


    const occupancyRate = useMemo(() => {
        const validResidents = Array.isArray(residents) ? residents : [];
        // Make sure totalCapacity is not zero to avoid division by zero
        return totalCapacity > 0 ? ((validResidents.length / totalCapacity) * 100).toFixed(1) : 'N/A';
    }, [residents, totalCapacity]); // Added totalCapacity dependency

    const medAdherence = useMemo(() => {
        const validMedLog = Array.isArray(medLog) ? medLog : [];
        const logsInTimeframe = validMedLog.filter(log =>
            log.timestamp && log.timestamp >= startDate && log.timestamp <= endDate
        );
        const administered = logsInTimeframe.filter(log => log.status === 'administered').length;
        const total = logsInTimeframe.length;
        // Exclude PRN? Or only count scheduled meds? For now, using all logs in timeframe.
        return total > 0 ? ((administered / total) * 100).toFixed(1) : 'N/A';
    }, [medLog, startDate, endDate]);

    const incidentsInTimeframe = useMemo(() => {
        const validShiftLog = Array.isArray(shiftLog) ? shiftLog : [];
        return validShiftLog.filter(log =>
            log.category === 'Incident' &&
            log.timestamp && log.timestamp >= startDate && log.timestamp <= endDate
        ).sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)); // Sort newest first, safer access
    }, [shiftLog, startDate, endDate]);

    const timeframeButtons = ['Today', '7 Days', '30 Days'];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Data Insights</h2>
                {/* Timeframe Selection */}
                <div className="flex items-center space-x-2 bg-gray-200 p-1 rounded-lg">
                    {timeframeButtons.map(tf => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${timeframe === tf ? 'bg-white text-emerald-600 shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {tf === '7 Days' || tf === '30 Days' ? `Last ${tf}` : tf}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Occupancy Rate" value={`${occupancyRate}%`} icon={<Users className="w-8 h-8 text-indigo-500" />} color="border-indigo-500" />
                <StatCard title={`Med Adherence (${timeframe})`} value={`${medAdherence}%`} icon={<Pill className="w-8 h-8 text-teal-500" />} color="border-teal-500" />
                <StatCard title={`Incidents (${timeframe})`} value={incidentsInTimeframe.length} icon={<AlertTriangle className="w-8 h-8 text-amber-500" />} color="border-amber-500" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Incident Reports ({timeframe})</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto"> {/* Added scroll */}
                    {incidentsInTimeframe.length > 0 ? incidentsInTimeframe.map(log => (
                        <div key={log.id} className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                            <p className="text-xs text-gray-500">{log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</p>
                            <p className="text-gray-800 mt-1">{log.entry}</p>
                            <p className="text-xs text-gray-600 text-right mt-2">- {log.author}</p>
                        </div>
                    )) : <p className="text-gray-500">No incidents reported in this timeframe.</p>}
                </div>
            </div>
        </div>
    );
};

export default DataInsightsView;
