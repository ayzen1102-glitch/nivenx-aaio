'use strict';

const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require('discord.js');

function pickUnique(arr, count) {
    const pool = [...arr];
    const winners = [];
    while (winners.length < count && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        winners.push(pool.splice(idx, 1)[0]);
    }
    return winners;
}

/**
 * End a giveaway: pick winners, update the message, store result.
 * @param {import('discord.js').Client} client
 * @param {object} giveaway
 */
async function endGiveaway(client, giveaway) {
    if (!giveaway || giveaway.ended) return;

    giveaway.ended = true;
    giveaway.endedAt = Date.now();

    const participants = giveaway.participants || [];
    const winnerCount  = giveaway.winnerCount  || 1;
    const winners      = pickUnique(participants, winnerCount);

    giveaway.winners = winners;

    // Persist updated giveaway
    try {
        if (client.db?.giveaways?.set) {
            client.db.giveaways.set(giveaway.messageId, giveaway);
        }
    } catch {}

    // Try to fetch & update the giveaway message
    try {
        const guild   = await client.guilds.fetch(giveaway.guildId).catch(() => null);
        if (!guild) return;
        const channel = await guild.channels.fetch(giveaway.channelId).catch(() => null);
        if (!channel) return;
        const msg     = await channel.messages.fetch(giveaway.messageId).catch(() => null);
        if (!msg) return;

        const winnerMentions = winners.length > 0
            ? winners.map(id => `<@${id}>`).join(', ')
            : 'No valid participants';

        const resultContainer = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `## 🎉 Giveaway Ended!\n**Prize:** ${giveaway.prize}\n**Winner(s):** ${winnerMentions}\n-# Hosted by <@${giveaway.hostId}>`
                )
            );

        await msg.edit({
            components: [resultContainer],
            flags: MessageFlags.IsComponentsV2,
        }).catch(() => {});

        if (winners.length > 0) {
            await channel.send({
                content: `🎊 Congratulations ${winnerMentions}! You won **${giveaway.prize}**!`,
                allowedMentions: { users: winners },
            }).catch(() => {});
        } else {
            await channel.send({
                content: `😔 No one participated in the **${giveaway.prize}** giveaway.`,
            }).catch(() => {});
        }
    } catch (err) {
        console.error('[GiveawayManager] endGiveaway error:', err);
    }
}

/**
 * Reroll a winner from an ended giveaway.
 * @param {import('discord.js').Client} client
 * @param {object} giveaway
 * @param {import('discord.js').TextChannel} channel
 * @returns {Promise<boolean>}
 */
async function rerollGiveaway(client, giveaway, channel) {
    if (!giveaway || !giveaway.ended) return false;

    const participants = giveaway.participants || [];
    const winner = pickUnique(participants, 1);
    if (winner.length === 0) return false;

    giveaway.winners = winner;

    try {
        if (client.db?.giveaways?.set) {
            client.db.giveaways.set(giveaway.messageId, giveaway);
        }
    } catch {}

    try {
        await channel.send({
            content: `🎲 **Reroll!** The new winner of **${giveaway.prize}** is <@${winner[0]}>! Congratulations!`,
            allowedMentions: { users: winner },
        }).catch(() => {});
        return true;
    } catch {
        return false;
    }
}

/**
 * Tick all active giveaways — call this on an interval.
 * @param {import('discord.js').Client} client
 */
async function tickGiveaways(client) {
    try {
        if (!client.db?.giveaways) return;
        const all = client.db.giveaways.all ? client.db.giveaways.all() : [];
        const now = Date.now();
        for (const item of all) {
            const gwy = item.value ?? item;
            if (gwy && !gwy.ended && gwy.endTime && gwy.endTime <= now) {
                await endGiveaway(client, gwy).catch(() => {});
            }
        }
    } catch {}
}

module.exports = { endGiveaway, rerollGiveaway, tickGiveaways, pickUnique };
