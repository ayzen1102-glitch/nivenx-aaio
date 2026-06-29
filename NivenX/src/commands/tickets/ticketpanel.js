'use strict';
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
module.exports = {
  name: 'ticketpanel',
  data: new SlashCommandBuilder().setName('ticketpanel').setDescription('Send the ticket panel').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(o => o.setName('channel').setDescription('Channel to send panel').setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const embed = new EmbedBuilder().setColor('#5865F2').setTitle('🎫 NivenX Support').setDescription('Click the button below to open a support ticket.');
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('ticket_create').setLabel('Open Ticket').setStyle(ButtonStyle.Primary).setEmoji('🎫'));
    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Ticket panel sent to ${channel}`, ephemeral: true });
  },
};
