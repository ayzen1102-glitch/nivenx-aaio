'use strict';

const { EmbedBuilder } = require('discord.js');
const { fetchServerStatus } = require('./mcapi');

/**
 * Handles mc_status_modal submission — fetches server status and replies.
 * @param {import('discord.js').ModalSubmitInteraction} interaction
 */
async function sendStatus(interaction) {
    const serverAddress = interaction.fields.getTextInputValue('server_ip').trim();

    await interaction.deferReply({ ephemeral: false });

    let status;
    try {
        status = await fetchServerStatus(serverAddress);
    } catch (err) {
        return interaction.editReply({ content: `❌ Failed to reach **${serverAddress}**: ${err.message}` });
    }

    if (!status || !status.online) {
        const embed = new EmbedBuilder()
            .setColor(0xed4245)
            .setTitle(`⛏️ Minecraft Server — ${serverAddress}`)
            .setDescription('🔴 **Server is OFFLINE** or unreachable.')
            .setTimestamp()
            .setFooter({ text: 'Powered by mcsrvstat.us' });
        return interaction.editReply({ embeds: [embed] });
    }

    const motd = (status.motd?.clean?.join('\n') || status.motd?.raw?.join('\n') || 'No MOTD').slice(0, 512);
    const players = status.players
        ? `${status.players.online}/${status.players.max}`
        : 'Unknown';
    const version = status.version || 'Unknown';
    const software = status.software || '';
    const plugins  = status.plugins?.length  ? `${status.plugins.length} plugins`  : null;
    const mods     = status.mods?.length     ? `${status.mods.length} mods`        : null;

    const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle(`⛏️ Minecraft Server — ${serverAddress}`)
        .setDescription(`🟢 **Server is ONLINE**\n\n${motd}`)
        .addFields(
            { name: '👥 Players',  value: players,  inline: true },
            { name: '🔖 Version',  value: version,  inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Powered by mcsrvstat.us' });

    if (software) embed.addFields({ name: '🖥️ Software', value: software, inline: true });
    if (plugins)  embed.addFields({ name: '🔌 Plugins',  value: plugins,  inline: true });
    if (mods)     embed.addFields({ name: '⚙️ Mods',     value: mods,     inline: true });

    if (status.icon) {
        const base64 = status.icon.replace(/^data:image\/\w+;base64,/, '');
        const buf = Buffer.from(base64, 'base64');
        const { AttachmentBuilder } = require('discord.js');
        const attachment = new AttachmentBuilder(buf, { name: 'server-icon.png' });
        embed.setThumbnail('attachment://server-icon.png');
        return interaction.editReply({ embeds: [embed], files: [attachment] });
    }

    return interaction.editReply({ embeds: [embed] });
}

module.exports = { sendStatus };
