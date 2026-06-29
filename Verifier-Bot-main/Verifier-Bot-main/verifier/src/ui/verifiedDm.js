const {
  ContainerBuilder,
  MessageFlags,
  TextDisplayBuilder,
} = require('discord.js');

/**
 * Build the DM sent to a user after they pass verification.
 *
 * @param {object} opts
 * @param {string} opts.roleName    - Name of the role that was assigned
 * @param {string} opts.channelName - YouTube channel name/title
 */
function buildVerifiedDmPayload({ roleName, channelName }) {
  const container = new ContainerBuilder()
    .setAccentColor(0x57f287)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `🎉 You have been verified and received the **${roleName}** role.\n` +
        `-# Thanks for subscribing to **${channelName}**.`,
      ),
    );

  return {
    components: [container],
    flags: MessageFlags.IsComponentsV2,
  };
}

module.exports = { buildVerifiedDmPayload };
