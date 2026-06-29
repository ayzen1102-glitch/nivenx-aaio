const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} = require('discord.js');
const { CLOSE_INQUIRY_BUTTON_ID, PANEL_COLOR } = require('../constants');

function buildTicketPayload(user) {
  const container = new ContainerBuilder()
    .setAccentColor(PANEL_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('# General Support Ticket'),
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        [
          `**Welcome** ${user}`,
          '**Category:** General Support',
          '',
          'Our support team will assist you shortly.',
        ].join('\n'),
      ),
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
    )
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(CLOSE_INQUIRY_BUTTON_ID)
          .setLabel('Close Inquiry')
          .setStyle(ButtonStyle.Danger),
      ),
    );

  return {
    components: [container],
    flags: MessageFlags.IsComponentsV2,
    allowedMentions: { users: [user.id], parse: [] },
  };
}

module.exports = {
  buildTicketPayload,
};
