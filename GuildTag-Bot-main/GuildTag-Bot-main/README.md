# AeroX GuildTag Bot

A Discord bot built with **discord.py 2.7.1** that monitors guild/clan tags in member usernames and automatically assigns roles and sends messages when users adopt a server's tag. All responses use Discord's **Components V2** (containers, separators, text displays).

**Developer:** itsfizys  
**Support Server:** [AeroX Development](https://discord.gg/aerox)

---

## Features

- Per-server (per-guild) configuration — settings in one server never affect another
- Monitors member username changes in real time via `on_member_update`
- Automatically assigns configured roles when a user adopts the guild tag
- Automatically removes roles when a user drops the guild tag
- Sends a customisable adoption message to a configured channel
- Message supports dynamic placeholders (`{user.mention}`, `{user.name}`, etc.)
- Fully Components V2 — no legacy embeds
- SQLite database with `aiosqlite` for persistent storage
- Cooldowns, permission checks, and guild-only enforcement on all commands

---

## Requirements

- Python 3.11 or higher
- `discord-py >= 2.7.1`
- `aiosqlite >= 0.22.1`

Install dependencies using `pip`:

```bash
pip install -r requirements.txt
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/AeroXDevs/GuildTag-Bot.git
cd GuildTag-Bot
```

### 2. Configure the bot

Open `config.py` and fill in your values:

```python
TOKEN = "YOUR_BOT_TOKEN_HERE"   # Your Discord bot token
PREFIX = "!"                     # Command prefix
DATABASE_PATH = "database/aerox.db"  # SQLite database path
```

You can also set `DATABASE_PATH` via the environment variable `DATABASE_PATH` — it takes priority over the value in `config.py`.

### 3. Create the database directory

```bash
mkdir -p database
```

The bot creates all required tables automatically on first startup.

### 4. Enable required Privileged Intents

In the [Discord Developer Portal](https://discord.com/developers/applications), navigate to your bot and enable:

- **Server Members Intent** — required to detect username changes
- **Message Content Intent** — required to process prefix commands

### 5. Run the bot

```bash
python aerox.py
```

---

## File Structure

```
aerox-guildtag/
├── aerox.py                  # Bot entry point — AeroxContext, Aerox bot class, on_message
├── config.py                 # Token, prefix, database path, embed colour
├── pyproject.toml            # Project metadata and dependencies
├── uv.lock                   # Locked dependency versions
│
├── commands/
│   ├── guildtag.py           # All guildtag commands and on_member_update listener
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

### `guild_tags`

Stores per-server configuration.

| Column       | Type    | Description                                 |
|--------------|---------|---------------------------------------------|
| `server_id`  | INTEGER | Primary key — Discord guild ID              |
| `enabled`    | INTEGER | `1` = system enabled, `0` = disabled        |
| `channel_id` | INTEGER | Channel to send adoption messages in        |
| `message`    | TEXT    | Adoption message template (supports vars)   |
| `roles`      | TEXT    | JSON-encoded list of role IDs to assign     |

### `guild_tag_users`

Tracks which users have adopted the guild tag.

| Column       | Type | Description                                    |
|--------------|------|------------------------------------------------|
| `server_id`  | INTEGER | Discord guild ID                            |
| `user_id`    | INTEGER | Discord user ID                             |
| `adopted_at` | TEXT    | ISO datetime of when the tag was adopted    |

Primary key is `(server_id, user_id)`.

---

## Commands

All commands require the server to be set up. Most management commands require the **Manage Guild** permission.

### General

| Command | Alias | Description |
|---------|-------|-------------|
| `!help` | `!h`, `!cmds`, `!commands` | Show all available commands |
| `!guildtag` | `!gt` | Show the current guild tag configuration |

### System Toggle

| Command | Permission | Description |
|---------|-----------|-------------|
| `!guildtag enable` | Manage Guild | Enable the guild tag system |
| `!guildtag disable` | Manage Guild | Disable the guild tag system |

### Tag Configuration

| Command | Permission | Description |
|---------|-----------|-------------|
| `!guildtag tag set <tag>` | Manage Guild | Set the guild tag the bot monitors |
| `!guildtag tag remove` | Manage Guild | Remove the configured guild tag |

### Channel Configuration

| Command | Permission | Description |
|---------|-----------|-------------|
| `!guildtag channel set <#channel>` | Manage Guild | Set the channel for adoption messages |
| `!guildtag channel remove` | Manage Guild | Remove the configured channel |

### Role Configuration

| Command | Alias | Permission | Description |
|---------|-------|-----------|-------------|
| `!guildtag role add <@role>` | | Manage Guild | Add a role assigned on tag adoption |
| `!guildtag role remove <@role>` | | Manage Guild | Remove a role from the reward list |
| `!guildtag role list` | | Manage Guild | List all configured reward roles |

### Message Configuration

| Command | Aliases | Permission | Description |
|---------|---------|-----------|-------------|
| `!guildtag message` | | Manage Guild | Show message command info and subcommands |
| `!guildtag message <text>` | | Manage Guild | Set the adoption message |
| `!guildtag message variables` | `vars`, `placeholders` | — | Show available message placeholders |
| `!guildtag message remove` | `delete`, `clear` | Manage Guild | Remove the current adoption message |

### User Management

| Command | Alias | Permission | Description |
|---------|-------|-----------|-------------|
| `!guildtag list` | | Manage Guild | List all users who have adopted the guild tag |
| `!guildtag config` | `settings`, `show` | Manage Guild | Show the full guild configuration |

---

## Message Placeholders

When setting a guild tag adoption message, you can use the following variables:

| Placeholder | Output |
|-------------|--------|
| `{user.mention}` | Mentions the user (e.g. `@Username`) |
| `{user.name}` | The user's display name |
| `{user.id}` | The user's Discord ID |
| `{server.name}` | The name of the server |

Example:
```
!guildtag message Hey {user.mention}, welcome to the [AX] family in {server.name}!
```

---

## Bot Mention

Mentioning the bot with no other content (`@AeroX Logger`) will trigger a welcome response showing the bot name, a greeting, the server prefix, and a link to the support server.

---

## Permissions

The bot requires the following Discord permissions to function correctly:

| Permission | Reason |
|-----------|--------|
| Read Messages / View Channels | Read commands and monitor members |
| Send Messages | Send adoption messages and command responses |
| Manage Roles | Assign and remove guild tag roles |
| Read Message History | Required for some channel operations |

---

## Error Handling

- **Missing permissions** — bot responds with a clear message if it or the user lacks permissions
- **Role hierarchy** — if a configured role is above the bot's highest role, it will report the issue instead of failing silently
- **Cooldowns** — all commands have a 3-second per-user cooldown by default
- **Guild only** — all commands are restricted to server channels (no DMs)

---

## Support

Join the support server for help, bug reports, and updates:  
[discord.gg/aerox](https://discord.gg/aerox)
