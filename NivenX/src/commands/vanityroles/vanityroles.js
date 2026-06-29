'use strict';
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  name: 'vanityroles',
  data: new SlashCommandBuilder().setName('vanityroles').setDescription('Manage vanity status roles').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(s => s.setName('enable').setDescription('Enable vanity role tracking'))
    .addSubcommand(s => s.setName('disable').setDescription('Disable vanity role tracking'))
    .addSubcommand(s => s.setName('vanity').setDescription('Set the vanity text to watch').addStringOption(o => o.setName('text').setDescription('Vanity text').setRequired(true)))
    .addSubcommand(s => s.setName('role').setDescription('Set the role to assign').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .addSubcommand(s => s.setName('config').setDescription('View current vanity roles config')),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const embed = new EmbedBuilder().setColor('#5865F2').setTitle('NivenX · Vanity Roles');
    const desc = { enable: '✅ Vanity role tracking enabled.', disable: '❌ Vanity role tracking disabled.', config: 'No vanity roles configured yet.' }[sub]
      || (sub === 'vanity' ? `Vanity text set to: **${interaction.options.getString('text')}**` : `Role set to: ${interaction.options.getRole('role')}`);
    await interaction.reply({ embeds: [embed.setDescription(desc)], ephemeral: true });
  },
};
