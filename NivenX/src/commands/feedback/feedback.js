'use strict';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'feedback',
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Submit feedback')
    .addIntegerOption(o => o.setName('rating').setDescription('Rating from 1-5').setMinValue(1).setMaxValue(5).setRequired(true))
    .addStringOption(o => o.setName('message').setDescription('Your feedback message').setRequired(true)),
  async execute(interaction) {
    const rating = interaction.options.getInteger('rating');
    const message = interaction.options.getString('message');
    const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    const embed = new EmbedBuilder().setColor('#5865F2').setTitle('NivenX · Feedback Received').addFields({ name: 'Rating', value: stars, inline: true }, { name: 'From', value: `${interaction.user}`, inline: true }, { name: 'Message', value: message });
    await interaction.reply({ embeds: [embed] });
  },
};
