'use strict';

/**
 * Safely destroy a music player, suppressing all errors.
 * @param {object} player - The music player instance
 * @returns {Promise<void>}
 */
async function safeDestroyPlayer(player) {
    if (!player) return;
    try { player.stop?.(); }        catch {}
    try { player.destroy?.(); }     catch {}
    try { await player.leave?.(); } catch {}
}

/**
 * Check if a member is in the same voice channel as the bot.
 * @param {import('discord.js').GuildMember} member
 * @param {object} player
 * @returns {boolean}
 */
function inSameVoice(member, player) {
    if (!member?.voice?.channel) return false;
    return member.voice.channel.id === (player?.voiceId || player?.voice?.id);
}

/**
 * Build a simple progress bar string.
 * @param {number} current - Current position in ms
 * @param {number} total   - Total duration in ms
 * @param {number} [length=20] - Bar length in chars
 * @returns {string}
 */
function progressBar(current, total, length = 20) {
    if (!total || total <= 0) return '▬'.repeat(length);
    const filled = Math.round((current / total) * length);
    return '▬'.repeat(Math.max(0, filled - 1)) + '🔘' + '▬'.repeat(Math.max(0, length - filled));
}

module.exports = { safeDestroyPlayer, inSameVoice, progressBar };
