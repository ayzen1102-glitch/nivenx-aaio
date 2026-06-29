'use strict';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'ticketclose',
  data: new SlashCommandBuilder().setName('ticketclose').setDescription('Close the current ticket'),
  async execute(interaction) {
    await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setTitle('🔒 Ticket Closing').setDescription('This ticket will be closed in 5 seconds.')], ephemeral: false });
    setTimeout(() => interaction.channel?.delete().catch(() => {}), 5000);
  },
};
