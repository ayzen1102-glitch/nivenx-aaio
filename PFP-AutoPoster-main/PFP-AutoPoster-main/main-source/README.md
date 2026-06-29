# main-source

This folder contains everything needed to run PfpAutoposter. No build tools or source code required.

---

## Contents

```
main-source/
├── autoposter.jar    The pre-built fat JAR — run this
├── config.yml        Bot configuration (fill in your token before starting)
└── data/             Runtime data folder — the SQLite database is created here automatically
```

---

## Requirements

- Java 17+
- A Discord bot token with **Message Content** and **Server Members** intents enabled

---

## Configuration

Edit `config.yml` before starting the bot:

```yaml
token: "YOUR_BOT_TOKEN_HERE"
prefix: "!"
db_path: "data/bot.db"
```

| Key | Description |
|-----|-------------|
| `token` | Your Discord bot token from the Developer Portal |
| `prefix` | Text command prefix (default: `!`) |
| `db_path` | Path to the SQLite database (default: `data/bot.db`) |

The bot also accepts `BOT_TOKEN`, `PREFIX`, and `DB_PATH` as environment variables — these take priority over `config.yml` if set.

---

## Running the Bot

From inside this folder:

```bash
java -jar autoposter.jar
```

The `data/` folder and database are created automatically on first start.

---

## Deployment (Pterodactyl)

1. Upload `autoposter.jar`, `config.yml`, and the `data/` folder to your server
2. Fill in your token in `config.yml`
3. Set the startup command to:
   ```
   java -jar autoposter.jar
   ```
4. Start the server — the database is created inside `data/` automatically

---

## Updating the JAR

To rebuild with the latest source changes, run from `raw-source/`:

```bash
./gradlew shadowJar
```

The new JAR is placed here automatically, replacing the old one.
