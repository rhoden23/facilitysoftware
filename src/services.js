/**
 * AI Services — Gemini API integration for CareOps
 */
const KEY = typeof __GEMINI_API_KEY !== 'undefined' ? __GEMINI_API_KEY : null;

export async function callGeminiAPI(prompt) {
    if (!KEY) {
        return '[AI features require a Gemini API key. Configure it in Settings.]';
    }
    try {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=';
        const res = await fetch(url + KEY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
            }),
        });
        if (!res.ok) throw new Error('Gemini API error: ' + res.status);
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    } catch (err) {
        console.error('Gemini API failed:', err);
        return 'AI generation failed: ' + err.message;
    }
}