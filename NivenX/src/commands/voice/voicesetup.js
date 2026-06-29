'use strict';
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  name: 'voicesetup',
  data: new SlashCommandBuilder().setName('voicesetup').setDescription('Set up Join-to-Create voice channels').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(o => o.setName('channel').setDescription('The voice channel to join to create').setRequired(true)),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel');
    await interaction.reply({ embeds: [new EmbedBuilder().setColor('#5865F2').setTitle('NivenX · Voice Setup').setDescription(`Join-to-Create set to **${ch.name}**\nJoin that channel to get your own temporary voice channel.`)], ephemeral: true });
  },
};
