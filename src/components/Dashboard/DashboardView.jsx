
import React, { useMemo } from 'react';
import { Users, Stethoscope, Megaphone, Pill, UtensilsCrossed, Sparkles } from 'lucide-react';
import StatCard from './StatCard';

const DashboardView = ({ residents, staff, medications, medLog, referrals, shiftLog, callGeminiAPI }) => {

    const upcomingMedications = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const validMeds = Array.isArray(medications) ? medications : [];
        const validMedLog = Array.isArray(medLog) ? medLog : [];
        const validResidents = Array.isArray(residents) ? residents : [];

        return validMeds.filter(med =>
            !validMedLog.some(log =>
                log.medicationId === med.id &&
                log.timestamp &&
                new Date(log.timestamp.seconds * 1000).toISOString().split('T')[0] === todayStr
            )
        )
        .map(med => ({ ...med, residentName: validResidents.find(r => r.id === med.residentId)?.name || 'N/A' }))
        .sort((a,b) => (a.time || '').localeCompare(b.time || ''));
    }, [medications, medLog, residents]);

    const handleGenerateMenu = () => {
        const validResidents = Array.isArray(residents) ? residents : [];
        const uniqueDiets = [...new Set(validResidents.map(r => r.diet).filter(d => d && d.toLowerCase() !== 'regular'))];
        const dietPrompt = uniqueDiets.length > 0 ? `Please ensure the menu includes appealing options that cater to the following special dietary requirements: ${uniqueDiets.join(', ')}. Clearly label alternatives for these diets.` : `All meals should be generally healthy and suitable for a senior population.`;

        const prompt = `You are a nutritionist designing a balanced and appealing 7-day meal plan (Monday-Sunday) for a small residential care facility for the elderly. The meals should be flavorful, nutritious, and easy to chew.
Create a plan with Breakfast, Lunch, and Dinner for each day.
${dietPrompt}
Format the output clearly with days of the week as main headings.`;
        callGeminiAPI(prompt, 'Weekly Menu Suggestion');
    };

    const stats = {
        residents: Array.isArray(residents) ? residents.length : 0,
        staff: Array.isArray(staff) ? staff.length : 0,
        upcomingMeds: upcomingMedications.length,
        referrals: Array.isArray(referrals) ? referrals.length : 0
    };

    const statCards = [
        { title: 'Active Residents', value: stats.residents, icon: <Users className="w-8 h-8 text-emerald-500" />, color: 'border-emerald-500' },
        { title: 'Staff on Record', value: stats.staff, icon: <Stethoscope className="w-8 h-8 text-green-500" />, color: 'border-green-500' },
        { title: 'New Referrals', value: stats.referrals, icon: <Megaphone className="w-8 h-8 text-purple-500" />, color: 'border-purple-500' },
        { title: 'Upcoming Medications', value: stats.upcomingMeds, icon: <Pill className="w-8 h-8 text-red-500" />, color: 'border-red-500' },
    ];

    return (<div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{statCards.map(card => <StatCard key={card.title} {...card} />)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upcoming Meds */}
                <div className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Medications</h3><div className="space-y-3 max-h-80 overflow-y-auto">{upcomingMedications.length > 0 ? upcomingMedications.map(med => (<div key={med.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"><div><p className="font-semibold">{med.name} <span className="text-sm text-gray-500">({med.dosage})</span></p><p className="text-sm text-emerald-600">{med.residentName}</p></div><div className="text-lg font-bold text-red-500">{med.time || 'N/A'}</div></div>)) : <p className="text-gray-500">No upcoming medications for today.</p>}</div></div>
                {/* Recent Shift Logs */}
                <div className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Shift Log Entries</h3><div className="space-y-3 max-h-80 overflow-y-auto">{ (Array.isArray(shiftLog) ? shiftLog : []).slice(0, 3).length > 0 ? shiftLog.slice(0, 3).map(log => (<div key={log.id} className="p-3 border-l-4 border-emerald-300 bg-gray-50 rounded-r-lg"><p className="text-sm text-gray-800"><strong>{log.category}:</strong> {log.entry}</p><p className="text-xs text-gray-500 text-right mt-1">- {log.author} at {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString() : ''}</p></div>)) : <p className="text-gray-500">No recent log entries.</p>}</div></div>
            </div>
            {/* Meal Planner */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                <UtensilsCrossed className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Weekly Meal Planner</h3>
                <p className="text-gray-500 mb-4">Generate a new dietary-aware weekly menu for residents.</p>
                <button onClick={handleGenerateMenu} className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow transition-colors"><Sparkles className="w-5 h-5 mr-2" /> ✨ Generate Menu</button>
            </div>

        </div>
    </div>);
};

export default DashboardView;
