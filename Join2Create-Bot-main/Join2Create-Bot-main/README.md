# AeroX | Join2Create

A Discord bot built with **discord.py** that lets users create and manage temporary voice channels in their server. All responses use Discord's **Components V2** — no legacy embeds.

**Developer:** itsfizys  
**Support Server:** [AeroX Development](https://discord.gg/aerox)

---

## Features

- Per-server configuration — settings in one server never affect another
- Automatically creates a temporary voice channel when a user joins the "Join to Create" channel
- Automatically deletes temporary channels when they become empty
- Persistent button interface — control your VC without typing commands
- Per-channel owner controls: lock, hide, rename, limit, bitrate, claim, transfer, permit/reject
- SQLite database via `aiosqlite` for persistent storage
- Cooldowns, permission checks, and guild-only enforcement on all commands
- All UI built with Components V2 — no legacy embeds

---

## Requirements

- Python 3.11+
- `discord-py >= 2.7.1`
- `aiosqlite >= 0.22.1`

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/AeroXDevs/VoiceMaster-Bot.git
cd VoiceMaster-Bot
```

### 2. Configure the bot

Open `config.py` and set your values:

```python
TOKEN         = "YOUR_BOT_TOKEN_HERE"
PREFIX        = "!"
DATABASE_PATH = "database/aerox.db"
```

`DATABASE_PATH` can also be set via the `DATABASE_PATH` environment variable — it takes priority over `config.py`.

### 3. Enable required Privileged Intents

In the [Discord Developer Portal](https://discord.com/developers/applications), enable:

- **Server Members Intent** — required to detect voice state changes
- **Message Content Intent** — required to process prefix commands

### 4. Run the bot

```bash
python aerox.py
```

---

## File Structure

```
aerox-voicemaster/
├── aerox.py              # Bot entry point — AeroxContext, Aerox bot class, startup
├── config.py             # Token, prefix, database path
├── emojis.py             # All emoji constants — customise button/UI emojis here
├── logger.py             # Colorful ANSI console logger
├── pyproject.toml        # Project metadata and dependencies
│
├── commands/
│   ├── voicemaster.py    # All Join2Create commands, listeners, and button interface
│   └── help.py           # Interactive help command (Components V2)
│
├── database/
│   ├── __init__.py       # SQLitePool wrapper — execute, fetchrow, fetch, fetchval
│   └── aerox.db          # SQLite database (auto-created on first run)
│
└── utilities/
    ├── __init__.py       # Utilities package init
    ├── checks.py         # guild_only, has_perms, bot_has_perms, cooldown
    ├── converters.py     # DiscordRole, DiscordMember converters
    └── decorators.py     # Custom command decorators
```

---

## Customising Emojis

All button and UI emojis are defined in `emojis.py`. You can swap any of them for custom Discord emojis or different Unicode characters without touching the command logic.

```python
LOCK       = "🔒"   # Lock button
UNLOCK     = "🔓"   # Unlock button
GHOST      = "👻"   # Hide button
REVEAL     = "👁️"   # Reveal button
CLAIM      = "🎤"   # Claim button
DISCONNECT = "🔌"   # Disconnect button
INFO       = "ℹ️"   # Info button
INCREASE   = "➕"   # Increase limit button
DECREASE   = "➖"   # Decrease limit button
```

To use a custom Discord emoji, replace the value with the emoji string in the format `<:name:id>` or `<a:name:id>` for animated.

---

## Commands

Default prefix: `!`  
The main command group is `join2create` — aliases: `j2c`, `vm`.

### General

| Command | Aliases | Description |
|---------|---------|-------------|
| `!help` | `!h`, `!cmds`, `!commands` | Show the interactive help panel |
| `!join2create` | `!j2c`, `!vm` | Show Join2Create info and popular commands |

### Setup

| Command | Description |
|---------|-------------|
| `!join2create setup` | Create the join channel and category |
| `!join2create sendinterface` | Send the persistent button control panel |
| `!join2create reset` | Reset all settings and delete temp channels |
| `!join2create category [category]` | Set the category for temporary voice channels |

### Channel Controls

| Command | Description |
|---------|-------------|
| `!join2create lock` | Lock your voice channel |
| `!join2create unlock` | Unlock your voice channel |
| `!join2create ghost` | Hide your voice channel from others |
| `!join2create unghost` | Reveal your voice channel |
| `!join2create claim` | Claim an inactive voice channel |
| `!join2create name <name>` | Rename your voice channel |
| `!join2create limit <number>` | Set user limit (0 = no limit, max 99) |
| `!join2create bitrate <kbps>` | Set bitrate (8–384 kbps) |
| `!join2create status [text]` | Set or clear a channel status |
| `!join2create configuration` | View current channel info |

### Member Management

| Command | Description |
|---------|-------------|
| `!join2create permit <member/role>` | Allow a member or role to join |
| `!join2create reject <member/role>` | Block a member or role from joining |
| `!join2create transfer <member>` | Transfer channel ownership |
| `!join2create disconnect <member>` | Disconnect a member from your channel |
| `!join2create role <role>` | Assign a role to channel members |

### Default Settings

Requires **Manage Guild** permission.

| Command | Description |
|---------|-------------|
| `!join2create default` | View current default settings |
| `!join2create default name <name>` | Set default channel name (`{user}` = display name) |
| `!join2create default limit <number>` | Set default user limit |
| `!join2create default bitrate <kbps>` | Set default bitrate |
| `!join2create default region [region]` | Set default voice region |

---

## Control Panel Buttons

After running `!join2create sendinterface`, users get a persistent button panel in the channel:

| Button | Action |
|--------|--------|
| 🔒 Lock | Lock the channel |
| 🔓 Unlock | Unlock the channel |
| 👻 Hide | Hide the channel |
| 👁 Reveal | Reveal the channel |
| 🎤 Claim | Claim an inactive channel |
| 🔌 Disconnect | Remove a member via dropdown |
| ℹ️ Info | View channel information |
| ➕ Increase | Increase user limit by 1 |
| ➖ Decrease | Decrease user limit by 1 |

---

## Required Bot Permissions

| Permission | Reason |
|-----------|--------|
| View Channels | Monitor voice events |
| Send Messages | Send command responses |
| Manage Channels | Create and delete temporary voice channels |
| Move Members | Move users into their new temp channel |
| Manage Roles | Assign permissions in temp channels |

---

## Support

Join the support server for help, bug reports, and updates:  
[discord.gg/aerox](https://discord.gg/aerox)
