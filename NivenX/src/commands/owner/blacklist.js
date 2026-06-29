const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags,
} = require("discord.js");

module.exports = {
    name: "blacklist",
    aliases: ["bl"],
    description: "Manage user blacklist",
    category: "owner",
    cooldown: 3,
    run: async (client, message, args, prefix) => {
        const sep = () => new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small);

        const reply = (content, color = 0x26272F) => message.channel.send({
            components: [
                new ContainerBuilder()
                    .setAccentColor(color)
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(content)),
            ],
            flags: MessageFlags.IsComponentsV2,
        });

        let accessList = await client.db.get(`blacklistaccess_${client.user.id}`) || [];

        if (!client.config.owner.includes(message.author.id) && !accessList.includes(message.author.id)) {
        }

        if (!args[0]) {
        }

        let db = await client.db.get(`blacklist_${client.user.id}`);
        if (!db) {
            await client.db.set(`blacklist_${client.user.id}`, []);
            db = [];
        }

        let bl = [...db];
        let opt = args[0].toLowerCase();

        let user =
            message.mentions.users.first() ||
            client.users.cache.get(args[1]) ||
            (args[1]?.match(/^\d+$/) ? { id: args[1] } : null);

        let reason = args.slice(2).join(" ") || "No Reason Provided";

        if (["add", "remove"].includes(opt)) {
            let targetId = user?.id;
            if (client.config.owner.includes(targetId)) {
                return message.channel.send({
                    files: [{
                        attachment: "https://cdn.discordapp.com/attachments/1127970897802833980/1438804935893450783/Doraemon_Achha_Laude_Memes.jpeg",
                    }],
                });
            }
        }

        if (opt === "add") {

            bl.push(user.id);
            await client.db.set(`blacklist_${client.user.id}`, bl);
            await client.db.set(`blreason_${user.id}`, reason);

        }

        if (opt === "remove") {

            bl = bl.filter(x => x !== user.id);
            await client.db.set(`blacklist_${client.user.id}`, bl);
            await client.db.delete(`blreason_${user.id}`);

        }

        if (opt === "update") {


            let ch = client.channels.cache.get(client.config.gban_channel_id);

            let old = await client.db.get(`blmsg_${client.user.id}`);
            if (old) {
                let msg = ch.messages.cache.get(old);
                if (msg) msg.delete().catch(() => {});
            }

            let sent = await ch.send({
                components: [
                    new ContainerBuilder()
                        .setAccentColor(0x26272F)
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent("## Blacklisted Users"))
                        .addSeparatorComponents(sep())
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent(list.join("\n")))
                        .addSeparatorComponents(sep())
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Total: ${list.length}`)),
                ],
                flags: MessageFlags.IsComponentsV2,
            });
            await client.db.set(`blmsg_${client.user.id}`, sent.id);

        }

        if (opt === "reset") {
            await client.db.set(`blacklist_${client.user.id}`, []);
        }
    },
};
