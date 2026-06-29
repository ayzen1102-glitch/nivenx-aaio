const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js');

const sep = () => new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small);
const c   = (text) => ({ components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(text))], flags: MessageFlags.IsComponentsV2 });

module.exports = {
    name: "extraowner",
    aliases: ["extraowners", "addowner"],
    description: "Manage extra owners for antinuke access",
    category: "antinuke",
    cooldown: 3,
    run: async (client, message, args, prefix) => {
        if (message.author.id !== message.guild.ownerId && !client.config.owner.includes(message.author.id)) {
        }

        let a = await client.db.get(`ownerPermit1_${message.guild.id}`);
        let b = await client.db.get(`ownerPermit2_${message.guild.id}`);

        if (!args[0]) {
            return message.channel.send({
                components: [
                    new ContainerBuilder()
                        .setAccentColor(0x26272F)
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent('## Extra Owner'))
                        .addSeparatorComponents(sep())
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
                        )),
                ],
                flags: MessageFlags.IsComponentsV2,
            });
        }

        let opt = args[0].toLowerCase();

        if (opt === "show") {
            let ans = "";
            if (a != null) ans += `\n<@${a}>`;
            if (b != null) ans += `\n<@${b}>`;

            if (ans === "") {
            }

            return message.channel.send({
                components: [
                    new ContainerBuilder()
                        .setAccentColor(0x26272F)
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## Extra Owners`))
                        .addSeparatorComponents(sep())
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent(ans.trim())),
                ],
                flags: MessageFlags.IsComponentsV2,
            });
        }

        let user = message.guild.members.cache.get(args[1]) || message.mentions.members.first();
        if (!user) {
        }

        if (opt === "add") {
            if (a === user.id || b === user.id) {
            }

            if (a == null) {
                await client.db.set(`ownerPermit1_${message.guild.id}`, user.id);
            } else if (b == null) {
                await client.db.set(`ownerPermit2_${message.guild.id}`, user.id);
            } else {
            }

        }

        if (opt === "remove") {
            if (user.id === a) {
                await client.db.delete(`ownerPermit1_${message.guild.id}`);
            } else if (user.id === b) {
                await client.db.delete(`ownerPermit2_${message.guild.id}`);
            } else {
            }

        }
    }
};
