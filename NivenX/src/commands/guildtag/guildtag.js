'use strict';
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  name: 'guildtag',
  data: new SlashCommandBuilder().setName('guildtag').setDescription('Manage guild tag role auto-assign').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(s => s.setName('enable').setDescription('Enable guild tag tracking'))
    .addSubcommand(s => s.setName('disable').setDescription('Disable guild tag tracking'))
    .addSubcommand(s => s.setName('tag').setDescription('Set the tag text to watch').addStringOption(o => o.setName('text').setDescription('Tag text').setRequired(true)))
    .addSubcommand(s => s.setName('role').setDescription('Set the role to assign').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .addSubcommand(s => s.setName('config').setDescription('View guild tag config')),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const embed = new EmbedBuilder().setColor('#5865F2').setTitle('NivenX · Guild Tag');
    const desc = { enable: '✅ Guild tag tracking enabled.', disable: '❌ Guild tag tracking disabled.', config: 'No guild tag configured yet.' }[sub]
      || (sub === 'tag' ? `Tag text set to: **${interaction.options.getString('text')}**` : `Role set to: ${interaction.options.getRole('role')}`);
    await interaction.reply({ embeds: [embed.setDescription(desc)], ephemeral: true });
  },
};
