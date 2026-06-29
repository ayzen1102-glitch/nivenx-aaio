/*
 * ============================================================
 *  AeroX Verifier Bot
 *  Made by: Ayle | All Rights Reserved © AeroX Development
 * ============================================================
 */

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  ThumbnailBuilder,
} = require('discord.js');

/**
 * Build the welcome DM sent when a user joins the server.
 *
 * @param {object} opts
 * @param {object} opts.config       - Guild config from the DB
 * @param {string} opts.guildId      - Discord guild snowflake
 * @param {string|null} opts.guildIconUrl - Guild icon URL (or null)
 */
function buildWelcomeDmPayload({ config, guildId, guildIconUrl }) {
  const youtubeUrl =
    config.youtubeCanonicalUrl ||
    (config.youtubeHandle ? `https://www.youtube.com/${config.youtubeHandle}` : null);

  const channelName =
    config.youtubeTitle ||
    config.referenceChannelData?.channel_name ||
    (config.youtubeHandle ?? '').replace(/^@/, '') ||
    'the channel';

  const panelChannelUrl = `https://discord.com/channels/${guildId}/${config.panelChannelId}`;

  const channelRef = youtubeUrl ? `[${channelName}](${youtubeUrl})` : channelName;
  const bodyText =
    `You can gain access to the source codes by verifying yourself. ` +
    `Simply send a screenshot of your ${channelRef} ` +
    `subscription in [#verify](${panelChannelUrl})`;

  const headerSection = new SectionBuilder().addTextDisplayComponents(
    new TextDisplayBuilder().setContent(`**Welcome to ${channelName}**`),
  );

  if (guildIconUrl) {
    headerSection.setThumbnailAccessory(
      new ThumbnailBuilder().setMedia({ url: guildIconUrl }),
    );
  }

  const container = new ContainerBuilder()
    .setAccentColor(0x181818)
    .addSectionComponents(headerSection)
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(bodyText),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('-# Thank you for joining!'),
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
    )
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Go To Channel')
          .setStyle(ButtonStyle.Link)
          .setURL(panelChannelUrl),
      ),
    );

  return {
    components: [container],
    flags: MessageFlags.IsComponentsV2,
  };
}

module.exports = { buildWelcomeDmPayload };
