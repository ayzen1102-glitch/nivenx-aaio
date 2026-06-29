'use strict';

const store = new Map();

/**
 * Get guild configuration.
 * @param {string} guildId
 * @returns {object}
 */
function getGuildConfig(guildId) {
    return store.get(guildId) || {};
}

/**
 * Set guild configuration.
 * @param {string} guildId
 * @param {object} config
 */
function setGuildConfig(guildId, config) {
    const current = store.get(guildId) || {};
    store.set(guildId, { ...current, ...config });
}

/**
 * Delete guild configuration.
 * @param {string} guildId
 */
function deleteGuildConfig(guildId) {
    store.delete(guildId);
}

/**
 * Check if a guild has a configuration.
 * @param {string} guildId
 * @returns {boolean}
 */
function hasGuildConfig(guildId) {
    return store.has(guildId);
}

module.exports = { getGuildConfig, setGuildConfig, deleteGuildConfig, hasGuildConfig };
