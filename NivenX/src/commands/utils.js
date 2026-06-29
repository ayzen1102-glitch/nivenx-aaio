'use strict';

/**
 * Extract user ID from a modmail thread name or topic.
 * Thread names are expected to follow the pattern: "username-userid" or contain the user ID.
 * @param {import('discord.js').ThreadChannel} thread
 * @returns {Promise<string|null>}
 */
async function getUserIdFromThread(thread) {
    if (!thread) return null;

    // Check thread name for a snowflake ID (17-19 digits)
    const nameMatch = thread.name?.match(/(\d{17,19})/);
    if (nameMatch) return nameMatch[1];

    // Check thread topic/parent message for user ID
    if (thread.parent) {
        try {
            const starterMsg = await thread.fetchStarterMessage().catch(() => null);
            if (starterMsg) {
                const topicMatch = starterMsg.content?.match(/(\d{17,19})/);
                if (topicMatch) return topicMatch[1];
                // Check embeds
                for (const embed of starterMsg.embeds) {
                    const embedText = [embed.title, embed.description, ...embed.fields.map(f => f.value)].join(' ');
                    const embedMatch = embedText.match(/(\d{17,19})/);
                    if (embedMatch) return embedMatch[1];
                }
            }
        } catch {}
    }

    return null;
}

module.exports = { getUserIdFromThread };
