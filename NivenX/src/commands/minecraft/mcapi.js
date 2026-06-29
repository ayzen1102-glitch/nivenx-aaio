const https = require('https');

/**
 * Fetches Minecraft server status from the mcsrvstat.us API (v3).
 * Uses only Node.js built-in https — no external dependencies.
 */
function fetchServerStatus(address) {
    return new Promise((resolve, reject) => {
        const url = `https://api.mcsrvstat.us/3/${encodeURIComponent(address)}`;

        https.get(url, { headers: { 'User-Agent': 'MCStatusBot/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch {
                    reject(new Error('Invalid JSON response from API'));
                }
            });
        }).on('error', reject);
    });
}

module.exports = { fetchServerStatus };
