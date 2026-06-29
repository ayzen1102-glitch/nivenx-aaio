const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    name: "purgebots",
    aliases: ["pb"],
    category: "mod",
    cat: "admin",

    run: async (client, message) => {
        const reply = (content, color = 0x26272F) => ({
            components: [
                new ContainerBuilder()
                    .setAccentColor(color)
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(content)),
            ],
            flags: MessageFlags.IsComponentsV2,
        });

        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        }

        if (!message.guild.members.me.permissions.has([
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.ReadMessageHistory,
        ])) {
        }

        const messages = await message.channel.messages.fetch({ limit: 100 });
        const botMessages = messages.filter(m => m.author.bot);

        if (!botMessages.size) {
        }

        const deleted = await message.channel.bulkDelete(botMessages, true).catch(() => null);
        if (!deleted || !deleted.size) {
        }

        const msg = await message.channel.send({
            components: [
                new ContainerBuilder()
                    .setAccentColor(0x57F287)
            ],
            flags: MessageFlags.IsComponentsV2,
        });

        setTimeout(() => msg.delete().catch(() => {}), 3000);
    },
};
