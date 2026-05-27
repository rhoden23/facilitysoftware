import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

const AdmissionsView = ({}) => { // Removed props as they are not used here
    const formTemplates = {
        'LIC 601: Identification and Emergency Information': 'https://www.cdss.ca.gov/cdssweb/entres/forms/english/lic601.pdf',
        'LIC 602: Pre-Admission Appraisal': 'https://www.cdss.ca.gov/cdssweb/entres/forms/english/lic602a.pdf',
        'LIC 603: Residents Rights': 'https://www.cdss.ca.gov/cdssweb/entres/forms/english/lic603.pdf',
        'LIC 604: Admission Agreement': 'https://www.cdss.ca.gov/cdssweb/entres/forms/english/lic604a.pdf',
        'LIC 625: Appraisal/Needs and Services Plan': 'https://www.cdss.ca.gov/cdssweb/entres/forms/english/lic625.pdf',
        'LIC 627: Consent for Emergency Medical Treatment': 'https://www.cdss.ca.gov/cdssweb/entres/forms/english/lic627c.pdf',
        'LIC 9158: Telehealth Consent Form': 'https://www.cdss.ca.gov/cdssweb/entres/forms/english/lic9158.pdf'
        // Add more forms as needed
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Required Admission Forms (California)</h2>
            </div>
            {/* Added clarification about logging vs uploading */}
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-sm">
                <Info className="inline w-5 h-5 mr-2" />
                These links open official forms. Use the "Residents" section to log the reception or status of physical/digital documents for each resident. This system does not store the actual uploaded files.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formTemplates).map(([name, url]) => (
                    <div key={name} className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <p className="font-semibold text-gray-900">{name}</p>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors shadow text-sm">
                            <ExternalLink className="w-4 h-4 mr-2" /> Open Form
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdmissionsView;