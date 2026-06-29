'use strict';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'invites',
  data: new SlashCommandBuilder().setName('invites').setDescription('Check invite count').addUserOption(o => o.setName('user').setDescription('User to check (defaults to you)')),
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const invites = await interaction.guild.invites.fetch().catch(() => null);
    const count = invites ? [...invites.values()].filter(i => i.inviter?.id === target.id).reduce((a, i) => a + (i.uses || 0), 0) : 0;
    await interaction.reply({ embeds: [new EmbedBuilder().setColor('#5865F2').setTitle('NivenX · Invites').setDescription(`${target} has **${count}** invite${count !== 1 ? 's' : ''}`)] });
  },
};
