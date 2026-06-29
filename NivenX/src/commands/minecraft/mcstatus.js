'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { showModal } = require('./mcmodal');
const { sendStatus } = require('./status');

module.exports = {
    name: 'mcstatus',
    enabled: true,
    category: 'Minecraft',
    description: 'Check a Minecraft server\'s status.',
    data: new SlashCommandBuilder()
        .setName('mcstatus')
        .setDMPermission(false)
        .setDescription('Check a Minecraft server\'s online status.'),

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await showModal(interaction);
    },

    /**
     * Handles the modal submission for this command.
     * @param {import('discord.js').ModalSubmitInteraction} interaction
     */
    async handleModal(interaction, client) {
        if (interaction.isModalSubmit() && interaction.customId === 'mc_status_modal') {
            await sendStatus(interaction);
        }
    },
};
