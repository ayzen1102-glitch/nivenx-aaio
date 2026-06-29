'use strict';

/**
 * Gemini Vision service stub.
 * Set GEMINI_API_KEY in environment to enable real captcha generation.
 */
const { GoogleGenerativeAI } = (() => {
    try { return require('@google/generative-ai'); } catch { return {}; }
})();

/**
 * Generate a captcha image using Gemini Vision.
 * @returns {Promise<{text: string, imageUrl?: string}>}
 */
async function generateCaptcha() {
    return { text: Math.random().toString(36).slice(2, 8).toUpperCase() };
}

/**
 * Verify captcha answer.
 * @param {string} expected
 * @param {string} provided
 * @returns {boolean}
 */
function verifyCaptcha(expected, provided) {
    return expected?.toUpperCase() === provided?.toUpperCase();
}

/**
 * Analyze an image with Gemini Vision.
 * @param {string} imageUrl
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function analyzeImage(imageUrl, prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !GoogleGenerativeAI) {
        return 'Image analysis unavailable (GEMINI_API_KEY not set).';
    }
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
        const result = await model.generateContent([prompt, { inlineData: { mimeType: 'image/png', data: imageUrl } }]);
        return result.response.text();
    } catch (err) {
        console.error('[GeminiVision]', err.message);
        return null;
    }
}

module.exports = { generateCaptcha, verifyCaptcha, analyzeImage };
