import React from 'react';
import { Users, Pill, ClipboardList, UserPlus, LogIn, Hospital, Stethoscope, BookUser, Sparkles, CalendarClock, Download, ChevronDown, ChevronLeft, ChevronRight, PlusCircle, Trash2, Mail, Info, Megaphone, AlertTriangle, ChevronUp, ExternalLink, UtensilsCrossed, BrainCircuit, Edit, DollarSign, ShoppingCart, Archive, FileText, LogOut, Send, Upload, Copy, CalendarDays, Wrench, BarChart2, FilePlus, Clock, Briefcase, Landmark } from 'lucide-react';

const Sidebar = ({ view, setView, currentUser, facilityName, onSwitchFacility }) => {
    const allNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Hospital className="w-5 h-5" />, roles: ['Admin', 'Staff'] },
        { id: 'data_insights', label: 'Data Insights', icon: <BarChart2 className="w-5 h-5" />, roles: ['Admin'] },
        { id: 'marketing', label: 'Marketing', icon: <Megaphone className="w-5 h-5" />, roles: ['Admin'] },
        { id: 'admissions', label: 'Admissions Forms', icon: <BookUser className="w-5 h-5" />, roles: ['Admin'] }, // Admin only
        { id: 'scheduling', label: 'Scheduling', icon: <CalendarClock className="w-5 h-5" />, roles: ['Admin', 'Staff'] },
        { id: 'residents', label: 'Residents', icon: <Users className="w-5 h-5" />, roles: ['Admin', 'Staff'] },
        { id: 'mar', label: 'MAR (Med Log)', icon: <Pill className="w-5 h-5" />, roles: ['Admin', 'Staff'] },
        { id: 'staff', label: 'Staff', icon: <Stethoscope className="w-5 h-5" />, roles: ['Admin'] },
        { id: 'shift_log', label: 'Shift Log', icon: <ClipboardList className="w-5 h-5" />, roles: ['Admin', 'Staff'] },
        { id: 'finances', label: 'Finances', icon: <DollarSign className="w-5 h-5" />, roles: ['Admin'] },
        { id: 'invoicing', label: 'Invoicing', icon: <FileText className="w-5 h-5" />, roles: ['Admin'] },
        { id: 'inventory', label: 'Inventory', icon: <ShoppingCart className="w-5 h-5" />, roles: ['Admin', 'Staff'] },
        { id: 'ai_tools', label: 'AI Tools', icon: <BrainCircuit className="w-5 h-5" />, roles: ['Admin', 'Staff'] },
    ];

    const navItems = currentUser && currentUser.role ? allNavItems.filter(item => item.roles.includes(currentUser.role)) : [];


    return (
        <nav className="w-16 md:w-64 bg-white shadow-lg flex flex-col">
            <div className="flex items-center justify-center md:justify-start p-4 border-b">
                <LogIn className="w-8 h-8 text-emerald-600" />
                <div className="hidden md:block ml-3">
                    <h1 className="text-xl font-bold text-gray-800">CareOps</h1>
                    <p className="text-sm text-gray-500">{facilityName || 'No Facility'}</p>
                </div>
            </div>
            <ul className="flex-1 mt-6">{navItems.map(item => (<li key={item.id} className="px-4 mb-2"><button onClick={() => setView(item.id)} className={`w-full flex items-center justify-center md:justify-start p-3 rounded-lg transition-colors duration-200 ${view === item.id ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>{item.icon}<span className="hidden md:inline ml-4 font-medium">{item.label}</span></button></li>))}</ul>
            {facilityName && (
                <div className="p-4 border-t">
                    <button onClick={onSwitchFacility} className="w-full flex items-center justify-center md:justify-start p-3 rounded-lg text-sm text-gray-600 hover:bg-gray-200">
                        <Wrench className="w-4 h-4" />
                        <span className="hidden md:inline ml-4 font-medium">Switch Facility</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Sidebar;