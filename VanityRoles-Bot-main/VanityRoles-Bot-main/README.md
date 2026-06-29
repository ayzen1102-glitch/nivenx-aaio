# AeroX VanityRoles Bot

A Discord bot built with **discord.py** that monitors member custom statuses for a configured vanity text and automatically assigns roles and sends a message when a user adds it to their status. All responses use Discord's **Components V2** (containers, separators, text displays).

**Developer:** itsfizys  
**Support Server:** [AeroX Development](https://discord.gg/aerox)

---

## Features

- Per-server (per-guild) configuration — settings in one server never affect another
- Monitors member custom status changes in real time via `on_presence_update`
- Prompts for vanity text via message collector when enabling the system
- Automatically assigns configured roles when a user adds the vanity to their status
- Automatically removes roles when a user removes the vanity from their status
- Sends a customisable adoption message to a configured channel
- Message supports dynamic placeholders (`{user.mention}`, `{user.name}`, etc.)
- Case-insensitive vanity matching
- Fully Components V2 — no legacy embeds
- SQLite database with `aiosqlite` for persistent storage
- Cooldowns, permission checks, and guild-only enforcement on all commands

---

## Requirements

- Python 3.11 or higher
- `discord-py` (latest from git)
- `aiosqlite >= 0.22.1`
- `pytz >= 2024.1`

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/AeroXDevs/VanityRoles-Bot.git
cd VanityRoles-Bot
```

### 2. Configure the bot

Set the `DISCORD_TOKEN` environment variable (or secret) to your bot token.

Optionally configure in `config.py`:

```python
PREFIX = "!"                          # Command prefix
DATABASE_PATH = "database/aerox.db"  # SQLite database path
```

`DATABASE_PATH` can also be set via the `DATABASE_PATH` environment variable.

### 3. Enable required Privileged Intents

In the [Discord Developer Portal](https://discord.com/developers/applications), navigate to your bot and enable all three:

- **Presence Intent** — required to detect custom status changes
- **Server Members Intent** — required to read member data
- **Message Content Intent** — required to process prefix commands

### 4. Run the bot

```bash
python aerox.py
```

The bot creates all required database tables automatically on first startup.

---

## File Structure

```
aerox-vanityroles/
├── aerox.py                  # Bot entry point — AeroxContext, Aerox bot class, on_message
├── config.py                 # Token, prefix, database path
├── requirements.txt          # Python dependencies
│
├── commands/
│   ├── vanityroles.py        # All vanityroles commands and on_presence_update listener
│   └── help.py               # Custom help command (Components V2)
│
├── database/
│   ├── __init__.py           # SQLitePool wrapper (aiosqlite) — create_pool, execute, fetchrow, fetch
│   └── aerox.db              # SQLite database file (auto-created on first run)
│
└── utilities/
    ├── __init__.py           # Utilities package init
    ├── checks.py             # guild_only, has_perms, bot_has_perms, cooldown, role_priv
    ├── converters.py         # DiscordRole converter
    └── decorators.py         # Custom command decorators
```

---

## Database Schema

### `vanity_config`

Stores per-server configuration.

| Column       | Type    | Description                                      |
|--------------|---------|--------------------------------------------------|
| `server_id`  | INTEGER | Primary key — Discord guild ID                   |
| `enabled`    | INTEGER | `1` = system enabled, `0` = disabled             |
| `vanity`     | TEXT    | The vanity text monitored in member statuses     |
| `channel_id` | INTEGER | Channel to send adoption messages in             |
| `message`    | TEXT    | Adoption message template (supports placeholders)|
| `roles`      | TEXT    | JSON-encoded list of role IDs to assign          |

### `vanity_users`

Tracks which users currently have the vanity in their status.

| Column       | Type    | Description                                    |
|--------------|---------|------------------------------------------------|
| `server_id`  | INTEGER | Discord guild ID                               |
| `user_id`    | INTEGER | Discord user ID                                |
| `adopted_at` | TEXT    | ISO datetime of when the vanity was adopted    |

Primary key is `(server_id, user_id)`.

---

## Commands

All commands use the prefix `!`. The main command is `vanityroles` (alias: `vr`).  
Most management commands require the **Manage Guild** permission.

### General

| Command | Alias | Description |
|---------|-------|-------------|
| `!help` | `!h`, `!cmds`, `!commands` | Show all available commands |
| `!vanityroles` | `!vr` | Show the current vanity roles configuration |

### System Toggle

| Command | Permission | Description |
|---------|-----------|-------------|
| `!vanityroles enable` | Manage Guild | Enable the system — prompts for vanity text via message collector |
| `!vanityroles disable` | Manage Guild | Disable the vanity roles system |

### Vanity Text Configuration

| Command | Permission | Description |
|---------|-----------|-------------|
| `!vanityroles vanity set <text>` | Manage Guild | Update the monitored vanity text |
| `!vanityroles vanity remove` | Manage Guild | Remove the configured vanity text |

### Channel Configuration

| Command | Permission | Description |
|---------|-----------|-------------|
| `!vanityroles channel set <#channel>` | Manage Guild | Set the channel for adoption messages |
| `!vanityroles channel remove` | Manage Guild | Remove the configured channel |

### Role Configuration

| Command | Permission | Description |
|---------|-----------|-------------|
| `!vanityroles role add <@role>` | Manage Guild | Add a role assigned on vanity adoption |
| `!vanityroles role remove <@role>` | Manage Guild | Remove a role from the reward list |
| `!vanityroles role list` | Manage Guild | List all configured reward roles |

### Message Configuration

| Command | Aliases | Permission | Description |
|---------|---------|-----------|-------------|
| `!vanityroles message` | | Manage Guild | Show message command info and subcommands |
| `!vanityroles message <text>` | | Manage Guild | Set the adoption message |
| `!vanityroles message variables` | `vars`, `placeholders` | — | Show available message placeholders |
| `!vanityroles message remove` | `delete`, `clear` | Manage Guild | Remove the current adoption message |

### User Management

| Command | Aliases | Permission | Description |
|---------|---------|-----------|-------------|
| `!vanityroles list` | | — | List all users who currently have the vanity in their status |
| `!vanityroles config` | `settings`, `show` | Manage Guild | Show the full guild configuration |

---

## Message Placeholders

When setting a vanity adoption message, you can use the following variables:

| Placeholder | Output |
|-------------|--------|
| `{user.mention}` | Mentions the user (e.g. `@Username`) |
| `{user.name}` | The user's display name |
| `{user.id}` | The user's Discord ID |
| `{server.name}` | The name of the server |

Example:
```
!vanityroles message Hey {user.mention}, thanks for repping {server.name} in your status!
```

---

## How It Works

1. Run `!vanityroles enable` — the bot asks you to type the vanity text (e.g. `.gg/myserver`) and enables the system
2. Configure a reward role with `!vanityroles role add @Role`
3. Optionally set a channel and message with `!vanityroles channel set` and `!vanityroles message`
4. When any member adds the vanity text to their Discord custom status, the bot detects it via `on_presence_update`, assigns the roles, and sends the adoption message
5. When the member removes it from their status, the roles are automatically taken back

> Vanity matching is **case-insensitive** — `[AX]`, `[ax]`, and `[Ax]` all match.

---

## Bot Mention

Mentioning the bot with no other content will trigger a welcome response showing the bot name, a greeting, the server prefix, and a link to the support server.

---

## Permissions

The bot requires the following Discord permissions to function correctly:

| Permission | Reason |
|-----------|--------|
| Read Messages / View Channels | Read commands and monitor members |
| Send Messages | Send adoption messages and command responses |
| Manage Roles | Assign and remove vanity reward roles |
| Read Message History | Required for some channel operations |

---

## Error Handling

- **Missing permissions** — bot responds with a clear message if it or the user lacks permissions
- **Role hierarchy** — if a configured role is above the bot's highest role, it will report the issue instead of failing silently
- **Cooldowns** — all commands have a 3-second per-user cooldown by default
- **Guild only** — all commands are restricted to server channels (no DMs)
- **Invisible status** — users in invisible mode will not trigger presence updates (Discord limitation)

---

## Support

Join the support server for help, bug reports, and updates:  
[discord.gg/aerox](https://discord.gg/aerox)
