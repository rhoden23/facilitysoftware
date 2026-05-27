import React from 'react';
import ApplicantCard from '../components/Marketing/ApplicantCard';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const MarketingView = ({
    applicants,
    referrals,
    onAddApplicant,
    onEditApplicant,
    onDeleteApplicant,
    onAddReferral,
    onEditReferral,
    onDeleteReferral,
    onUpdateStatus,
}) => {
    const stages = ['Inquiry', 'Tour Scheduled', 'Assessed', 'Admitted', 'Closed'];

    const renderApplicantColumn = (stage) => {
        const stageApplicants = applicants.filter(a => a.status === stage);
        return (
            <div key={stage} className="bg-gray-100 rounded-lg p-3 flex-1">
                <h3 className="font-bold text-gray-800 mb-3 text-center">{stage}</h3>
                <div className="space-y-3">
                    {stageApplicants.map(applicant => (
                        <ApplicantCard
                            key={applicant.id}
                            applicant={applicant}
                            stages={stages}
                            onUpdateStatus={onUpdateStatus}
                            onEdit={onEditApplicant}
                            onDelete={onDeleteApplicant}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Marketing & Admissions Pipeline</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={onAddApplicant} className="flex items-center bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 shadow">
                        <PlusCircle className="w-5 h-5 mr-2" /> Add Applicant
                    </button>
                    <button onClick={onAddReferral} className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 shadow">
                        <PlusCircle className="w-5 h-5 mr-2" /> Add Referral
                    </button>
                </div>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-4">
                {stages.map(renderApplicantColumn)}
            </div>

            {/* Referrals Section */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Referral Sources</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-3">Applicant Name</th>
                                <th className="p-3">Source</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.map(referral => (
                                <tr key={referral.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{referral.applicantName}</td>
                                    <td className="p-3">{referral.source}</td>
                                    <td className="p-3">{referral.status}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button onClick={() => onEditReferral(referral)} className="p-1 rounded-full text-emerald-600 hover:bg-emerald-100"><Edit size={16} /></button>
                                            <button onClick={() => onDeleteReferral(referral.id)} className="p-1 rounded-full text-red-600 hover:bg-red-100"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarketingView;