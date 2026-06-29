'use strict';

const https = require('https');

const LASTFM_API_KEY = process.env.LASTFM_API_KEY || '';
const BASE = 'https://ws.audioscrobbler.com/2.0/';

function get(params) {
    return new Promise((resolve, reject) => {
        const qs = new URLSearchParams({ ...params, api_key: LASTFM_API_KEY, format: 'json' }).toString();
        https.get(`${BASE}?${qs}`, { headers: { 'User-Agent': 'NivenX-Bot/1.0' } }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch { reject(new Error('Invalid JSON from Last.fm')); }
            });
        }).on('error', reject);
    });
}

class LastFM {
    /**
     * Get similar artists.
     * @param {string} artist
     * @param {number} [limit=10]
     */
    async getSimilarArtists(artist, limit = 10) {
        if (!LASTFM_API_KEY) return [];
        try {
            const data = await get({ method: 'artist.getsimilar', artist, limit });
            return data?.similarartists?.artist || [];
        } catch { return []; }
    }

    /**
     * Get similar tracks.
     * @param {string} track
     * @param {string} artist
     * @param {number} [limit=10]
     */
    async getSimilarTracks(track, artist, limit = 10) {
        if (!LASTFM_API_KEY) return [];
        try {
            const data = await get({ method: 'track.getsimilar', track, artist, limit });
            return data?.similartracks?.track || [];
        } catch { return []; }
    }

    /**
     * Get top tracks for an artist.
     * @param {string} artist
     * @param {number} [limit=10]
     */
    async getArtistTopTracks(artist, limit = 10) {
        if (!LASTFM_API_KEY) return [];
        try {
            const data = await get({ method: 'artist.gettoptracks', artist, limit });
            return data?.toptracks?.track || [];
        } catch { return []; }
    }

    /**
     * Search for a track.
     * @param {string} query
     * @param {number} [limit=5]
     */
    async searchTrack(query, limit = 5) {
        if (!LASTFM_API_KEY) return [];
        try {
            const data = await get({ method: 'track.search', track: query, limit });
            return data?.results?.trackmatches?.track || [];
        } catch { return []; }
    }
}

module.exports = new LastFM();
