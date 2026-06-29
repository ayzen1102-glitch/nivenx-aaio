<div align="center">

# PfpAutoposter

A lightweight, open source Discord bot that automatically posts profile pictures to configured channels on a set interval.
Built with Java + JDA 6, SQLite, and Gradle.

</div>

---

## Overview

PfpAutoposter is a fully self-hostable, open source Discord bot built for communities that want a continuous stream of profile picture content. It supports both **slash commands** and **prefix commands** (default: `!`) through a unified hybrid command system. Persistent configuration is stored in a **SQLite** database and every setting is configurable per-server through the setup command.

---

## Features

### Auto-Posting
Automatic, scheduled image posting to any channel.

- Posts images from three bundled category libraries — **anime**, **female**, and **male**
- Configurable posting interval per server
- Per-guild, per-category channel configuration
- Seamlessly resumes after restart with no data loss

### Commands
A clean command set for full control over the bot.

- Interactive setup wizard for category, channel, and interval configuration
- Enable and disable posting at any time without losing configuration
- Full reset to wipe all server data and start fresh
- Latency ping and command listing

### UI
Modern Discord interface using the latest component features.

- Components V2 UI with styled container layouts
- All commands available as both slash commands and prefix commands

---

## Commands

| Command | Description |
|---------|-------------|
| `/setup` | Interactive setup — configure category, channel, and interval |
| `/enable` | Re-enable auto-posting for this server |
| `/disable` | Pause auto-posting without losing configuration |
| `/reset` | Remove all configuration for this server |
| `/help` | List all available commands |
| `/ping` | Show bot latency |

All commands also work with the `!` prefix (e.g. `!setup`, `!help`).

---

## Setup

**Requirements:** Java 17+, a Discord bot token with **Message Content** and **Server Members** intents enabled

```bash
# 1. Clone the repository
git clone https://github.com/itsfizys/PfpAutoposter.git
cd PfpAutoposter

# 2. Edit the config
# Fill in your bot token in main-source/config.yml

# 3. Build the JAR
cd raw-source
./gradlew shadowJar
# Output: main-source/autoposter.jar

# 4. Run the bot
cd ../main-source
java -jar autoposter.jar
```

---

## Running the Pre-built JAR

```bash
cd main-source
java -jar autoposter.jar
```

`config.yml` and `data/` must be in the same directory as the JAR. The database is created automatically on first start.

---

## Configuration

All configuration lives in `main-source/config.yml`.

| Key | Description |
|-----|-------------|
| `token` | Discord bot token from the Developer Portal |
| `prefix` | Text command prefix (default: `!`) |
| `db_path` | Path to the SQLite database file (default: `data/bot.db`) |

The bot also reads `BOT_TOKEN`, `PREFIX`, and `DB_PATH` environment variables as fallbacks if `config.yml` values are absent.

---

## Deployment (Pterodactyl)

1. Upload `autoposter.jar`, `config.yml`, and the `data/` folder to your server
2. Fill in your token in `config.yml`
3. Set the startup command to: `java -jar autoposter.jar`
4. Start the server — the database is created inside `data/` automatically

---

## Project Structure

```
raw-source/
├── build.gradle.kts                  Build configuration
├── settings.gradle.kts
├── gradlew
└── src/main/
    ├── java/com/pfpbot/
    │   ├── Bot.java                  Entry point — initializes JDA, DB, and scheduler
    │   ├── autoposter/               Auto-posting scheduler
    │   ├── commands/                 Command framework and implementations
    │   │   └── impl/                 setup, enable, disable, reset, help, ping
    │   ├── config/                   Config loader (YAML + env var fallback)
    │   ├── database/                 SQLite via JDBC
    │   ├── listeners/                Slash, prefix, and component listeners
    │   └── util/                     ImageLoader, SetupSessionManager
    └── resources/
        └── assets/                   Bundled image URL libraries
            ├── anime.json
            ├── female.json
            └── male.json

main-source/
├── autoposter.jar                    Pre-built fat JAR
├── config.yml                        Bot configuration
└── data/                             Runtime data (SQLite database)
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Java 17 |
| Discord API | JDA 6.4.2 |
| Database | SQLite via `sqlite-jdbc 3.47.1.0` |
| Config Parsing | SnakeYAML 2.2 |
| Serialization | Gson 2.11.0 |
| Logging | Logback Classic 1.5.6 |
| Build Tool | Gradle with Shadow plugin 8.3.1 |

---

## Dependencies

All dependencies are managed by Gradle and bundled into the fat JAR at build time. No separate installs required at runtime.

| Dependency | Version | Purpose |
|------------|---------|---------|
| `net.dv8tion:JDA` | 6.4.2 | Discord API wrapper |
| `org.xerial:sqlite-jdbc` | 3.47.1.0 | SQLite database driver |
| `com.google.code.gson:gson` | 2.11.0 | JSON parsing for image libraries |
| `ch.qos.logback:logback-classic` | 1.5.6 | Structured logging |
| `org.yaml:snakeyaml` | 2.2 | YAML config file parsing |

---

## Credits

**Developer** — [itsfizys](https://github.com/itsfizys) (Aegis)  
**Organisation** — [AeroX Development](https://github.com/AeroXDevs)

---

## Support

Join the AeroX Development Discord server for help, updates, and community support.

**[discord.gg/aerox](https://discord.gg/aerox)**

---

<div align="center">

© 2026 itsfizys (Aegis) — AeroX Development. All rights reserved.  
See [LICENSE](./LICENSE) for usage terms.

</div>
