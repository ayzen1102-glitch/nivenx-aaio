'use strict';

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
  name: 'emojis',
  data: new SlashCommandBuilder()
    .setName('emojis')
    .setDescription('Displays comprehensive emoji statistics and showcases all server emojis.')
    .setDefaultMemberPermissions(PermissionFlagsBits.EVERYONE)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('Filter emojis by type')
        .addChoices(
          { name: 'Animated Only', value: 'animated' },
          { name: 'Static Only', value: 'static' },
          { name: 'All Emojis', value: 'all' }
        )
    ),

  async execute(interaction, client) {
    const type = interaction.options.getString('type') || 'all';
    const emojis = interaction.guild.emojis.cache;
    const animatedEmojis = emojis.filter((e) => e.animated);
    const staticEmojis = emojis.filter((e) => !e.animated);

    let displayEmojis, typeName, emojiIcon;
    switch (type) {
      case 'animated':
        displayEmojis = animatedEmojis;
        typeName = 'Animated';
        emojiIcon = '🎬';
        break;
      case 'static':
        displayEmojis = staticEmojis;
        typeName = 'Static';
        emojiIcon = '🖼️';
        break;
      default:
        displayEmojis = emojis;
        typeName = 'All';
        emojiIcon = '🎯';
    }

    const premiumTierMap = { TIER_1: 100, TIER_2: 150, TIER_3: 250 };
    const totalSlots = premiumTierMap[interaction.guild.premiumTier] ?? 50;
    const usedSlots = emojis.size;
    const availableSlots = totalSlots - usedSlots;
    const usagePercentage = Math.round((usedSlots / totalSlots) * 100);

    const emojiList =
      displayEmojis.size > 0
        ? displayEmojis.map((e) => `${e} \`:${e.name}:\``).join(' ')
        : `*No ${typeName.toLowerCase()} emojis found*`;

    let embed;
    try {
      embed = new EmbedGenerator.basicEmbed();
    } catch {
      const { EmbedBuilder } = require('discord.js');
      embed = new EmbedBuilder();
    }

    embed
      .setTitle(`${emojiIcon} ${interaction.guild.name} Emoji Collection`)
      .setDescription(`**${typeName} Emojis**\n\n${emojiList.slice(0, 3900)}`)
      .setColor('#FF6B9D')
      .setThumbnail(interaction.guild.iconURL({ size: 256 }))
      .addFields(
        {
          name: '📊 Emoji Statistics',
          value:
            `🎬 **Animated:** ${animatedEmojis.size}\n` +
            `🖼️ **Static:** ${staticEmojis.size}\n` +
            `🎯 **Total:** ${emojis.size}`,
          inline: true,
        },
        {
          name: '💾 Server Limits',
          value:
            `📦 **Used:** ${usedSlots}/${totalSlots}\n` +
            `✨ **Available:** ${availableSlots}\n` +
            `📈 **Usage:** ${usagePercentage}%`,
          inline: true,
        },
        {
          name: '⭐ Boost Tier',
          value: `${interaction.guild.premiumTier !== 'NONE' ? `Level ${interaction.guild.premiumTier.slice(-1)}` : 'No Boost'} • ${totalSlots} slots`,
          inline: false,
        }
      )
      .setFooter({
        text: `Requested by ${interaction.user.tag} • Use /emojiinfo for details`,
        iconURL: interaction.user.displayAvatarURL({ size: 256 }),
      })
      .setTimestamp();

    if (displayEmojis.size > 50) {
      embed.addFields({
        name: '💡 Tip',
        value: `Showing ${displayEmojis.size} emojis. Use the type filter to narrow results.`,
        inline: false,
      });
    }

    return interaction.reply({ embeds: [embed] });
  },
};
