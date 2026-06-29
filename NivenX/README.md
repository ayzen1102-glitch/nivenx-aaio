# NivenX — All-In-One Discord Bot

> **NivenX Project** — A single, unified Discord bot combining the features of 15+ individual bots into one powerful, all-in-one solution built on discord.js v14.

---

## Overview

NivenX is an all-in-one Discord bot that merges the full feature sets of the following original bots into a single, unified codebase:

| Original Bot | Features Included |
|---|---|
| AeroX Security Bot | Antinuke, Antiraid, Automod, Whitelist |
| Guardian Moderation Bot | Moderation suite, Giveaways, Reminders, Logging |
| Appy Bot | Applications, Tickets, Polls, Giveaways |
| Falcron | Invite tracking, Giveaways, Polls, Greet messages |
| Feedback Bot | Star-rating feedback system (1–5), Screenshots |
| Suggestions Bot | Suggestion system with voting and moderation |
| TicketBot | Support ticket panel, transcripts, staff controls |
| ModMail Bot | DM-based modmail for user-staff communication |
| Verifier Bot | YouTube subscription verifier via Gemini AI vision |
| Status Bot | Live Minecraft server status (auto-refresh) |
| MC-AFK Bot | Minecraft AFK controller via Discord |
| Groove Music | Music playback with Lavalink, filters, sharding |
| Join2Create | Temporary voice channel creation |
| VanityRoles | Vanity status role auto-assign |
| GuildTag | Guild tag role auto-assign |
| Container Builder | Interactive Discord Components V2 builder |

---

## Features

### Security & Protection
- **Antinuke** — Monitors audit logs in real time; instantly bans users performing restricted actions. Auto-recovers deleted channels/roles.
  - Protects: channel/role create/delete/update, webhook create, mass bans/kicks, bot additions, guild updates
  - Whitelist system for trusted users; owner always protected
- **Antiraid** — Detects and responds to mass join events; auto-lockdown with configurable thresholds
- **Automod** — Custom automod rules, link filtering, spam detection, channel/role whitelists

### Moderation
- `ban`, `unban`, `kick`, `mute`, `unmute`, `timeout`, `warn`, `purge`, `lock`, `unlock`, `hide`, `role`
- Infraction tracking with MongoDB persistence
- Temporary bans with auto-unban
- Mod log channel with rich audit entries

### Community & Engagement
- **Applications** — Create and manage multi-question application forms; export applicants
- **Feedback** — Star rating (1–5) with screenshot support and per-guild channel config
- **Suggestions** — Suggestion panel with upvote/downvote, moderation, vote threshold
- **Polls** — Instant polls with button-based voting and up to 4 options
- **Giveaways** — Create, end, and reroll giveaways with entry management

### Tickets & Support
- **Ticket Panel** — Send a ticket panel to a channel; users click to open private ticket channels
- **ModMail** — DM-based modmail system; users DM the bot to contact staff
- Ticket closing, transcripts, blacklist

### Invite Tracking
- `/invites` — Check invite count for any user
- Automatic join/leave tracking
- Leaderboard support

### Music (requires Lavalink)
- Play, pause, resume, skip, stop, queue, nowplaying
- Loop (track/queue), shuffle, volume, seek, rewind, forward
- Audio filters (bassboost, nightcore, vaporwave, 8D, etc.)
- Grab (save track to DMs), lyrics, mood, similar tracks

### Minecraft
- **Server Status** — Live Minecraft server status with auto-refresh every 5 seconds
- **AFK Bot** — Join any Minecraft server via Discord commands; auto-jump, chat relay, auto-reconnect
- Microsoft OAuth for premium accounts

### Verification
- `/setup`, `/panel` — Configure YouTube subscription verification
- Gemini AI vision compares user screenshots to reference screenshots
- Auto-role assignment on successful verification

### Voice Channels
- **Join-to-Create** — Users join a designated channel to get their own temp voice channel
- Lock, unlock, rename, limit, transfer ownership

### Vanity Roles & Guild Tags
- **VanityRoles** — Monitor member custom statuses; auto-assign roles for vanity text
- **GuildTag** — Monitor member usernames; auto-assign roles for guild tags

### Container Builder
- Interactive Discord Components V2 builder — no code required
- 5 component types, 8 accent colors, live preview, send to any channel

### Utility
- `ping`, `serverinfo`, `userinfo`, `avatar`, `banner`, `botinfo`, `stats`, `uptime`
- `afk`, `calc`, `translate`, `weather`, `roleinfo`, `permissions`
- `reminder`, `report`

---

## Setup

### Requirements
- Node.js 20+
- A Discord bot token — [Discord Developer Portal](https://discord.com/developers/applications)
- MongoDB (optional, for moderation/tickets/giveaways/invites)
- Lavalink server (optional, for music features)
- Gemini API key (optional, for YouTube verifier)

### Installation

```bash
# 1. Enter the NivenX folder
cd NivenX

# 2. Install dependencies
npm install

# 3. Copy the env example and fill in your values
cp .env.example .env

# Edit .env with your credentials
nano .env   # or open in your editor
```

### Configuration

Edit **`.env`**:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
MONGODB_URL=mongodb://localhost:27017/nivenx
GUILD_ID=your_guild_id_for_dev  # optional
GEMINI_API_KEY=your_key         # for YouTube verifier
```

Edit **`src/config.json`**:

```json
{
  "prefix": "!",
  "owners": ["your_discord_user_id"],
  "supportServer": "https://discord.gg/nivenx"
}
```

Enable/disable feature groups in `src/config.json` under `features`:

```json
"features": {
  "antinuke": true,
  "music": false,
  "verification": false
}
```

### Running

```bash
# Standard startup
npm start

# With sharding (for large bots, 1000+ guilds)
npm run start:cluster

# Development with auto-restart
npm run dev
```

---

## Slash Command Registration

Slash commands register automatically on startup:
- Set `GUILD_ID` in `.env` to register instantly to one server (development)
- Leave `GUILD_ID` empty to register globally (takes up to 1 hour)

---

## Project Structure

```
NivenX/
├── src/
│   ├── index.js              # Main entry point
│   ├── cluster.js            # Sharding entry point
│   ├── config.json           # Bot configuration
│   ├── commands/
│   │   ├── antinuke/         # Antinuke protection
│   │   ├── antiraid/         # Antiraid protection
│   │   ├── automod/          # Automoderation
│   │   ├── applications/     # Application forms
│   │   ├── builder/          # Components V2 builder
│   │   ├── feedback/         # Feedback system
│   │   ├── giveaways/        # Giveaway management
│   │   ├── guildtag/         # Guild tag role assign
│   │   ├── info/             # Information commands
│   │   ├── invites/          # Invite tracking
│   │   ├── logging/          # Mod logging
│   │   ├── minecraft/        # Minecraft utilities
│   │   ├── moderation/       # Moderation commands
│   │   ├── modmail/          # ModMail system
│   │   ├── music/            # Music commands
│   │   ├── owner/            # Bot owner commands
│   │   ├── polls/            # Poll system
│   │   ├── suggestions/      # Suggestion system
│   │   ├── tickets/          # Ticket system
│   │   ├── utility/          # General utility
│   │   ├── vanityroles/      # Vanity status roles
│   │   ├── verification/     # YouTube verifier
│   │   └── voice/            # Temp voice channels
│   ├── events/               # Discord event handlers
│   ├── handlers/
│   │   ├── commandHandler.js # Command loader
│   │   └── eventHandler.js   # Event loader
│   ├── database/
│   │   ├── lmdb/             # LMDB fast cache (security)
│   │   ├── nivenx.db         # SQLite database
│   │   └── schemas/          # Mongoose schemas
│   ├── Functions/            # Helper functions (mod log, embeds)
│   ├── Schemas/              # Mongoose schema shortcuts
│   ├── services/             # External service integrations
│   └── utils/
│       └── logger.js         # Unified logger
├── package.json
├── .env.example
└── README.md
```

---

## Commands Reference

### Security
| Command | Description |
|---|---|
| `/antinuke` | Configure antinuke protection |
| `/whitelist` | Whitelist trusted users from antinuke |
| `/antiraid` | Configure antiraid settings |
| `/automod` | Configure automod rules |

### Moderation
| Command | Description |
|---|---|
| `/ban` | Ban a member |
| `/unban` | Unban a user |
| `/kick` | Kick a member |
| `/mute` / `/unmute` | Mute/unmute a member |
| `/purge` | Bulk delete messages |
| `/lock` / `/unlock` | Lock/unlock a channel |
| `/warn` | Warn a member |
| `/timeout` | Timeout a member |

### Community
| Command | Description |
|---|---|
| `/suggest` | Submit a suggestion |
| `/feedback` | Submit feedback with rating |
| `/poll` | Create a poll |
| `/apply` | Apply for a position |
| `/invites` | Check invite count |

### Tickets & Support
| Command | Description |
|---|---|
| `/ticketpanel` | Send the ticket panel |
| `/ticketclose` | Close current ticket |

### Music
| Command | Description |
|---|---|
| `/play` | Play a song |
| `/skip` | Skip current song |
| `/queue` | View the queue |
| `/stop` | Stop and clear queue |
| `/volume` | Set volume (0–100) |
| `/filter` | Apply audio filter |
| `/lyrics` | Get song lyrics |

### Minecraft
| Command | Description |
|---|---|
| `/mcstatus` | Get Minecraft server status |
| `/afkstart` | Start AFK on a Minecraft server |
| `/afkstop` | Stop Minecraft AFK bot |

### Utility
| Command | Description |
|---|---|
| `/ping` | Check bot latency |
| `/userinfo` | View user information |
| `/serverinfo` | View server information |
| `/avatar` | Get user avatar |
| `/botinfo` | View bot statistics |
| `/afk` | Set AFK status |

---

## Credits

NivenX combines code and features from the following open-source projects, all originally created under **NivenX Project** (formerly AeroX Development):

- **NivenX Security Bot** — satyansh_32 (base), itsfizys (updated)
- **Guardian Moderation** — NivenX Project
- **Appy Bot** — aliyie (Ayl)
- **Falcron** — itsfizys (Aegis)
- **Feedback Bot** — warrior
- **Suggestions Bot** — ayliee
- **TicketBot** — bre4d777 (OpenUwU)
- **ModMail Bot** — AshhLattee
- **Verifier Bot** — Ayle
- **Groove Music** — not.blaxe (original), NivenX Project (open-sourced)
- **Join2Create / VanityRoles / GuildTag / Container Builder** — itsfizys

---

## Support

Join the support server: [discord.gg/nivenx](https://discord.gg/nivenx)

---

## License

MIT — See individual command files for original license headers.
