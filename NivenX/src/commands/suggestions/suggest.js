'use strict';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'suggest',
  data: new SlashCommandBuilder().setName('suggest').setDescription('Submit a suggestion').addStringOption(o => o.setName('idea').setDescription('Your suggestion').setRequired(true)),
  async execute(interaction) {
    const idea = interaction.options.getString('idea');
    const embed = new EmbedBuilder().setColor('#5865F2').setTitle('💡 New Suggestion').setDescription(idea).addFields({ name: 'Submitted by', value: `${interaction.user}` }).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
