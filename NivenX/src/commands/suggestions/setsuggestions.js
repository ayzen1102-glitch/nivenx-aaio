'use strict';
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  name: 'setsuggestions',
  data: new SlashCommandBuilder().setName('setsuggestions').setDescription('Set the suggestions channel').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(o => o.setName('channel').setDescription('Suggestions channel').setRequired(true)),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel');
    await interaction.reply({ embeds: [new EmbedBuilder().setColor('#5865F2').setTitle('NivenX · Suggestions').setDescription(`Suggestions channel set to ${ch}`)], ephemeral: true });
  },
};
