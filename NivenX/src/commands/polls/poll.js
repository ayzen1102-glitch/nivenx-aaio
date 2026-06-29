'use strict';
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
  name: 'poll',
  data: new SlashCommandBuilder().setName('poll').setDescription('Create a poll').addStringOption(o => o.setName('question').setDescription('Poll question').setRequired(true))
    .addStringOption(o => o.setName('option1').setDescription('Option 1').setRequired(true)).addStringOption(o => o.setName('option2').setDescription('Option 2').setRequired(true))
    .addStringOption(o => o.setName('option3').setDescription('Option 3')).addStringOption(o => o.setName('option4').setDescription('Option 4')),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const options = ['option1','option2','option3','option4'].map(k => interaction.options.getString(k)).filter(Boolean);
    const letters = ['🅰️','🅱️','🆎','🆑'];
    const desc = options.map((o, i) => `${letters[i]} **${o}**`).join('\n');
    const embed = new EmbedBuilder().setColor('#5865F2').setTitle(`📊 ${question}`).setDescription(desc).setFooter({ text: `Poll by ${interaction.user.tag}` }).setTimestamp();
    const rows = []; const row = new ActionRowBuilder();
    options.forEach((_, i) => row.addComponents(new ButtonBuilder().setCustomId(`poll_${i}`).setLabel(options[i]).setEmoji(letters[i]).setStyle(ButtonStyle.Primary)));
    rows.push(row);
    await interaction.reply({ embeds: [embed], components: rows });
  },
};
