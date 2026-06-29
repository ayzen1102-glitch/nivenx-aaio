const https = require('https');
const Discord = require('discord.js');
const EmbedGenerator = require('../../Functions/embedGenerator');

/**
 * Fetch weather data using wttr.in (no external packages required).
 * @param {string} location
 * @returns {Promise<object>}
 */
function fetchWeather(location) {
    return new Promise((resolve, reject) => {
        const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;
        https.get(url, { headers: { 'User-Agent': 'NivenX-Discord-Bot/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch { reject(new Error('Invalid JSON from wttr.in')); }
            });
        }).on('error', reject);
    });
}

module.exports = {
    enabled: true,
    data: new Discord.SlashCommandBuilder()
        .setName('weather')
        .setDescription('Check the weather of a city or country.')
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName('location')
                .setDescription('The location to check the weather for.')
                .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const location = interaction.options.getString('location');
        await interaction.deferReply();

        let data;
        try {
            data = await fetchWeather(location);
        } catch (err) {
            return interaction.editReply({ content: `❌ Could not fetch weather for **${location}**. Please check the location name.` });
        }

        if (!data?.current_condition?.length) {
            return interaction.editReply({ content: `❌ No weather data found for **${location}**.` });
        }

        const current   = data.current_condition[0];
        const area      = data.nearest_area?.[0];
        const city      = area?.areaName?.[0]?.value || location;
        const country   = area?.country?.[0]?.value || '';
        const locationName = country ? `${city}, ${country}` : city;

        const tempC     = current.temp_C;
        const tempF     = current.temp_F;
        const feelsC    = current.FeelsLikeC;
        const feelsF    = current.FeelsLikeF;
        const desc      = current.weatherDesc?.[0]?.value || 'N/A';
        const humidity  = current.humidity;
        const windKm    = current.windspeedKmph;
        const windDir   = current.winddir16Point;
        const visibility = current.visibility;
        const uvIndex   = current.uvIndex;

        const tempNum = Number(tempF);
        let color = 0x2b9af3;
        if (!isNaN(tempNum)) {
            if (tempNum <= 32) color = 0x3aa6ff;
            else if (tempNum <= 50) color = 0x6bc6ff;
            else if (tempNum <= 68) color = 0x55d7a3;
            else if (tempNum <= 85) color = 0xffb86b;
            else color = 0xff6b6b;
        }

        const embed = EmbedGenerator.basicEmbed()
            .setTitle(`🌤️ Weather — ${locationName}`)
            .setDescription(`**${desc}**`)
            .setColor(color)
            .setTimestamp()
            .addFields(
                { name: '🌡️ Temperature', value: `${tempC}°C / ${tempF}°F`, inline: true },
                { name: '🤔 Feels Like',  value: `${feelsC}°C / ${feelsF}°F`, inline: true },
                { name: '💧 Humidity',    value: `${humidity}%`, inline: true },
                { name: '🌬️ Wind',        value: `${windKm} km/h ${windDir}`, inline: true },
                { name: '👁️ Visibility',  value: `${visibility} km`, inline: true },
                { name: '☀️ UV Index',    value: `${uvIndex}`, inline: true }
            )
            .setFooter({ text: 'Powered by wttr.in' });

        await interaction.editReply({ embeds: [embed] });
    },
};
