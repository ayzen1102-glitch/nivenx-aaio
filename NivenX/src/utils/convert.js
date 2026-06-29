'use strict';

/**
 * Convert milliseconds to a human-readable duration string.
 * e.g. 75000 → "1:15"
 * @param {number} ms
 * @returns {string}
 */
function convertTime(ms) {
    if (!ms || isNaN(ms)) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const hours   = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Convert milliseconds to a verbose string like "1 hour 15 minutes".
 * @param {number} ms
 * @returns {string}
 */
function convertTimeVerbose(ms) {
    if (!ms || isNaN(ms)) return '0 seconds';
    const totalSec = Math.floor(ms / 1000);
    const hours   = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    const parts = [];
    if (hours)   parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (seconds) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
    return parts.join(' ') || '0 seconds';
}

/**
 * Format a number with thousands separators.
 * @param {number} n
 * @returns {string}
 */
function formatNumber(n) {
    return Number(n).toLocaleString('en-US');
}

module.exports = { convertTime, convertTimeVerbose, formatNumber };
