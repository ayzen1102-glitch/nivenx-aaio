'use strict';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'apply',
  data: new SlashCommandBuilder()
    .setName('apply')
    .setDescription('Apply for a position in this server')
    .addStringOption(o => o.setName('form').setDescription('Application form name').setRequired(true)),
  async execute(interaction) {
    await interaction.reply({ embeds: [new EmbedBuilder().setColor('#5865F2').setTitle('NivenX · Apply').setDescription(`Starting application for **${interaction.options.getString('form')}**...\n\nPlease answer the questions in your DMs.`)], ephemeral: true });
  },
};
