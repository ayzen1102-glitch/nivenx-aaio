# raw-source

This folder contains the full source code and build tooling for PfpAutoposter.

---

## Contents

```
raw-source/
├── build.gradle.kts        Build configuration and dependencies
├── settings.gradle.kts     Gradle project settings
├── gradlew                 Gradle wrapper script (use this to build)
├── gradle/                 Gradle wrapper binaries
└── src/main/
    ├── java/com/pfpbot/
    │   ├── Bot.java                  Entry point — starts JDA, DB, and scheduler
    │   ├── autoposter/               Auto-posting scheduler logic
    │   ├── commands/                 Command framework + all command implementations
    │   │   └── impl/                 setup, enable, disable, reset, help, ping
    │   ├── config/                   Config loader (YAML + env var fallback)
    │   ├── database/                 SQLite database via JDBC
    │   ├── listeners/                Slash, prefix, and component event listeners
    │   └── util/                     ImageLoader, SetupSessionManager
    └── resources/
        ├── logback.xml               Logging configuration
        └── assets/                   Bundled image URL libraries
            ├── anime.json
            ├── female.json
            └── male.json
```

---

## Requirements

- Java 17+
- No other tools needed — Gradle is bundled via the wrapper

---

## Building the JAR

Run from inside this folder:

```bash
./gradlew shadowJar
```

The built JAR is output directly to `../main-source/autoposter.jar`, ready to run.

---

## Running from Source (without building)

```bash
./gradlew run
```

> **Note:** When running from source, the working directory is `raw-source/`, so `config.yml` and `data/` must also be present here, or you must set the `BOT_TOKEN`, `PREFIX`, and `DB_PATH` environment variables.

---

## Tech Stack

- **Java 17**
- **JDA 6.4.2** — Discord API wrapper
- **SQLite + JDBC** — persistent storage
- **SnakeYAML 2.2** — YAML config parsing
- **Logback** — structured logging
- **Gradle + Shadow plugin** — build and fat JAR packaging
