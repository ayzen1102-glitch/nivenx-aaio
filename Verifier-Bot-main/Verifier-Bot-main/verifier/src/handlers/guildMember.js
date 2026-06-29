/*
 * ============================================================
 *  AeroX Verifier Bot
 *  Made by: Ayle | All Rights Reserved © AeroX Development
 * ============================================================
 */

const { getGuildConfig } = require('../store/configStore');
const { buildWelcomeDmPayload } = require('../ui/welcomeDm');

/**
 * Fired when a new member joins a guild.
 * Sends a welcome DM if the server has been set up with a panel channel.
 */
async function handleGuildMemberAdd(member) {
  try {
    if (!member.guild) return;

    const config = await getGuildConfig(member.guild.id);

    if (!config.panelChannelId) return;
    if (!config.referenceImageData && !config.youtubeHandle) return;

    const guildIconUrl =
      member.guild.iconURL({ size: 256, extension: 'png' }) ?? null;

    const payload = buildWelcomeDmPayload({
      config,
      guildId: member.guild.id,
      guildIconUrl,
    });

    const dmChannel = await member.createDM().catch(() => null);
    if (!dmChannel) return;

    await dmChannel.send(payload).catch(() => null);
  } catch {
    // DM failures are non-fatal — the user may have DMs disabled
  }
}

module.exports = { handleGuildMemberAdd };
