'use strict';

const store = new Map();

function getGuildConfig(guildId) {
    return store.get(guildId) || {};
}

function setGuildConfig(guildId, config) {
    const current = store.get(guildId) || {};
    store.set(guildId, { ...current, ...config });
}

function deleteGuildConfig(guildId) {
    store.delete(guildId);
}

function hasGuildConfig(guildId) {
    return store.has(guildId);
}

module.exports = { getGuildConfig, setGuildConfig, deleteGuildConfig, hasGuildConfig };
