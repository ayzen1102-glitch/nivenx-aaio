const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags,
    PermissionFlagsBits,
    ChannelType,
} = require("discord.js");

module.exports = {
    name: "unhideall",
    aliases: [],
    description: "Unhide all text channels for @everyone",
    category: "moderation",
    cooldown: 10,
    run: async (client, message) => {
        const reply = (content, color = 0x26272F) => ({
            components: [
                new ContainerBuilder()
                    .setAccentColor(color)
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(content)),
            ],
            flags: MessageFlags.IsComponentsV2,
        });

        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
        }


        const channels = message.guild.channels.cache.filter(
            c => c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice
        );

        let success = 0;
        let failed = 0;

        for (const [, channel] of channels) {
            try {
                await channel.permissionOverwrites.edit(message.guild.roles.everyone, { ViewChannel: null });
                success++;
            } catch {
                failed++;
            }
        }

    },
};
