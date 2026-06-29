'use strict';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'application',
  data: new SlashCommandBuilder()
    .setName('application')
    .setDescription('Manage server applications')
    .addSubcommand(s => s.setName('create').setDescription('Create an application form').addStringOption(o => o.setName('name').setDescription('Application name').setRequired(true)))
    .addSubcommand(s => s.setName('list').setDescription('List all application forms'))
    .addSubcommand(s => s.setName('delete').setDescription('Delete an application form').addStringOption(o => o.setName('name').setDescription('Application name').setRequired(true))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const embed = new EmbedBuilder().setColor('#5865F2').setTitle('NivenX · Applications');
    if (sub === 'list') embed.setDescription('No application forms configured yet.\nUse `/application create` to get started.');
    else if (sub === 'create') embed.setDescription(`Application form **${interaction.options.getString('name')}** created.`);
    else if (sub === 'delete') embed.setDescription(`Application form **${interaction.options.getString('name')}** deleted.`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
