'use strict';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'container',
  data: new SlashCommandBuilder().setName('container').setDescription('Open the interactive Discord Components V2 container builder'),
  async execute(interaction) {
    const embed = new EmbedBuilder().setColor('#5865F2').setTitle('NivenX · Container Builder')
      .setDescription('The interactive container builder lets you build Discord Components V2 containers without coding.\n\nUse the buttons below to add components to your container.')
      .addFields({ name: 'Component Types', value: '• Text Display\n• Separator\n• Section & Thumbnail\n• Media Gallery\n• Button Row', inline: true }, { name: 'Options', value: '• 8 accent colors\n• Live preview\n• Send to any channel', inline: true });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
