# Minecraft Status Discord Bot

A sleek, lightweight, and modern Discord bot that fetches and displays live Minecraft server status using Discord's new **Components V2 container builder**. The status updates in real-time every 5 seconds to show active player counts, server versions, plugin list, MOTD, and the server's icon directly inside Discord components.

---

## Features

- **Components V2 Design**: Crafted using Discord's premium layout containers (no standard embeds used).
- **Auto-Refresh**: Live-updates the status card every 5 seconds without spamming the chat.
- **Server Icon Attachment**: Auto-decodes base64 server icons returned by the API and renders them cleanly inside the General category.
- **MOTD Code Block**: Formats the MOTD in a clean, copyable code block under a separate section.
- **Zero Addons**: Written in pure JavaScript using Node's native HTTPS library to fetch server status.

---

## Directory Structure

```
dsc bot/
├── config.json              # Configuration file for Discord credentials
├── package.json             # Manifest with dependencies
├── README.md                # Documentation and setup instructions
├── LICENSE.md               # License terms
└── src/
    ├── index.js             # Client initialization and ready events
    ├── deploy.js            # Command deployment/registration
    ├── api.js               # Status API fetcher (native HTTPS)
    └── handlers/
        ├── interaction.js   # Main interaction and callback router
        ├── modal.js         # Modal builder for user input
        └── status.js        # Card builder and auto-update scheduler
```

---

## Local Configuration

The bot supports loading credentials from either `config.json` or system environment variables.

### Option A: Using `config.json`
1. Copy or rename `config.example.json` to `config.json`.
2. Open `config.json` and insert your credentials:
   ```json
   {
     "token": "YOUR_DISCORD_BOT_TOKEN",
     "clientId": "YOUR_CLIENT_ID"
   }
   ```

### Option B: Using Environment Variables
Alternatively, you can set the following environment variables on your system or hosting environment:
- `DISCORD_TOKEN`: Your Discord Bot Token.
- `DISCORD_CLIENT_ID`: Your Discord Bot Application Client ID.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the bot:
   ```bash
   npm start
   ```

---

## Pterodactyl Hosting Requirements

To run this bot directly on a Pterodactyl Panel:

1. **Egg Selection**: Use a standard **Node.js Egg** (Node.js version 18, 20, or 22+).
2. **File Upload**: 
   - Upload the entire folder content (`src/`, `config.json`, `package.json`, `package-lock.json`).
   - Do **NOT** upload `node_modules/` directly; let Pterodactyl install the packages for optimized performance.
3. **Startup Settings**:
   - Set the startup command to:
     ```bash
     node src/index.js
     ```
     or
     ```bash
     npm start
     ```
   - Ensure the entry point filename is matched to `src/index.js`.
4. **Installation**: If your Node.js egg does not automatically trigger package installation, run `npm install` using Pterodactyl's built-in web terminal console.

---

## Customization

- **Accent Colors**: To change the vertical container line color, modify `.setAccentColor(0x26272F)` inside `src/handlers/status.js` to any color hex value of your choice.
- **Update Interval**: The live refresh rate can be adjusted by changing the `5000` (in milliseconds) at the bottom of the `sendStatus` function in `src/handlers/status.js`.
- **Command Name**: The slash command name can be changed inside `src/deploy.js` under the `SlashCommandBuilder` configuration.
