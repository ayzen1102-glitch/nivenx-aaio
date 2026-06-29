'use strict';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { COLORS, DEFAULT_MESSAGES, PANEL_CUSTOM_IDS } = require('../constants');

function buildPanelEmbed(options = {}) {
    return new EmbedBuilder()
        .setColor(options.color || COLORS.PRIMARY)
        .setTitle(options.title || DEFAULT_MESSAGES.VERIFY_TITLE)
        .setDescription(options.description || DEFAULT_MESSAGES.VERIFY_DESC)
        .setTimestamp();
}

function buildPanelRow(options = {}) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(PANEL_CUSTOM_IDS.VERIFY_BUTTON)
            .setLabel(options.label || 'Verify')
            .setStyle(ButtonStyle.Success)
            .setEmoji(options.emoji || '✅')
    );
}

function buildPanel(options = {}) {
    return {
        embeds: [buildPanelEmbed(options)],
        components: [buildPanelRow(options)],
    };
}

module.exports = { buildPanel, buildPanelEmbed, buildPanelRow };
