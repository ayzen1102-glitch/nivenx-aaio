'use strict';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { COLORS, DEFAULT_MESSAGES, PANEL_CUSTOM_IDS } = require('../constants');

/**
 * Build the verification panel embed.
 * @param {object} [options]
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {string} [options.color]
 * @returns {EmbedBuilder}
 */
function buildPanelEmbed(options = {}) {
    return new EmbedBuilder()
        .setColor(options.color || COLORS.PRIMARY)
        .setTitle(options.title || DEFAULT_MESSAGES.VERIFY_TITLE)
        .setDescription(options.description || DEFAULT_MESSAGES.VERIFY_DESC)
        .setTimestamp();
}

/**
 * Build the verification panel action row (button).
 * @param {object} [options]
 * @param {string} [options.label]
 * @param {string} [options.emoji]
 * @returns {ActionRowBuilder}
 */
function buildPanelRow(options = {}) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(PANEL_CUSTOM_IDS.VERIFY_BUTTON)
            .setLabel(options.label || 'Verify')
            .setStyle(ButtonStyle.Success)
            .setEmoji(options.emoji || '✅')
    );
}

/**
 * Build the full panel payload (embed + row).
 * @param {object} [options]
 * @returns {{ embeds: EmbedBuilder[], components: ActionRowBuilder[] }}
 */
function buildPanel(options = {}) {
    return {
        embeds: [buildPanelEmbed(options)],
        components: [buildPanelRow(options)],
    };
}

module.exports = { buildPanel, buildPanelEmbed, buildPanelRow };
