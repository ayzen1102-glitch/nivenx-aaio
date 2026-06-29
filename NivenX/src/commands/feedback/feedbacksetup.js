'use strict';
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  name: 'feedbacksetup',
  data: new SlashCommandBuilder().setName('feedbacksetup').setDescription('Set up the feedback channel').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(o => o.setName('channel').setDescription('Channel for feedback').setRequired(true)),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel');
    await interaction.reply({ embeds: [new EmbedBuilder().setColor('#5865F2').setTitle('NivenX · Feedback Setup').setDescription(`Feedback channel set to ${ch}`)], ephemeral: true });
  },
};
