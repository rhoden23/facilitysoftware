import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const AIToolsView = ({ residents, callGeminiAPI }) => {
    const [trainingTopic, setTrainingTopic] = useState('');
    const [selectedResidentId, setSelectedResidentId] = useState('');
    const [customPrompt, setCustomPrompt] = useState('');
    const validResidents = Array.isArray(residents) ? residents : [];


    const handleGenerateTraining = () => {
        if (!trainingTopic.trim()) return;
        const prompt = `Act as a senior caregiver trainer for an RCFE in California. Create a concise, practical, and easy-to-understand training module on the topic: "${trainingTopic}". The module should be formatted for a quick pre-shift briefing. Include:
1.  **Key Objectives:** 2-3 bullet points on what staff will learn.
2.  **Core Principles:** 3-5 critical bullet points explaining the "how" and "why".
3.  **Practical Application:** A short scenario or example of how to apply this knowledge with a resident.
4.  **Red Flags:** 2-3 things to watch out for or report immediately.`;
        callGeminiAPI(prompt, `Training: ${trainingTopic}`);
    };

    const handleGenerateSuggestions = () => {
        if (!selectedResidentId) return;
        const resident = validResidents.find(r => r.id === selectedResidentId);
        if (!resident) return;

        const prompt = `Act as a recreational therapist and care coordinator for a senior resident. Based on the following profile, provide personalized suggestions to enhance their quality of life.

**Resident Profile:**
- **Name:** ${resident.name}
- **Care Level:** ${resident.careLevel}
- **Dietary Needs:** ${resident.diet}
- **Allergies:** ${resident.allergies}

**Generate Suggestions For:**
1.  **Engaging Activities:** Propose 2-3 specific activities tailored to their likely physical and cognitive abilities (based on care level). Explain why each is suitable.
2.  **Social Interaction:** Suggest one way to encourage more social engagement with other residents or staff.
3.  **Safety & Comfort:** Provide one practical tip to enhance their daily safety or comfort in the facility.

Format the response in a clear, easy-to-read manner.`;
        callGeminiAPI(prompt, `Care Suggestions for ${resident.name}`);
    };

    const handleCustomPrompt = () => {
        if (!customPrompt.trim()) return;
        callGeminiAPI(customPrompt, 'Custom Prompt Result');
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">AI Assistant Tools</h2>

            {/* Training Module Generator */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Training Module Generator</h3>
                <p className="text-gray-600 mb-4">Enter a topic to generate a quick training refresher for staff.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" value={trainingTopic} onChange={e => setTrainingTopic(e.target.value)} placeholder="e.g., Fall Prevention, Dementia Care Basics" className="flex-grow p-2 border rounded-md" />
                    <button onClick={handleGenerateTraining} className="flex items-center justify-center bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 shadow transition-colors"><Sparkles className="w-5 h-5 mr-2" /> Generate Training</button>
                </div>
            </div>

            {/* Care Plan Suggester */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personalized Care Suggester</h3>
                <p className="text-gray-600 mb-4">Select a resident to get AI-powered suggestions for activities and care.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <select value={selectedResidentId} onChange={e => setSelectedResidentId(e.target.value)} className="flex-grow p-2 border rounded-md">
                        <option value="">-- Select a Resident --</option>
                        {validResidents.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <button onClick={handleGenerateSuggestions} disabled={!selectedResidentId} className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow transition-colors disabled:bg-gray-400"><Sparkles className="w-5 h-5 mr-2" /> Get Suggestions</button>
                </div>
            </div>

            {/* Custom Prompt */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Custom Prompt</h3>
                <p className="text-gray-600 mb-4">Use this for anything else you need: drafting an email to a family, brainstorming event ideas, etc.</p>
                <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} rows="4" placeholder="Enter your question or request here..." className="w-full p-2 border rounded-md mb-2"></textarea>
                <button onClick={handleCustomPrompt} className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 shadow transition-colors"><Sparkles className="w-5 h-5 mr-2" /> Submit Prompt</button>
            </div>
        </div>
    );
};

export default AIToolsView;