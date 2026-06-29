package com.pfpbot.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.yaml.snakeyaml.Yaml;

import java.io.File;
import java.io.FileInputStream;
import java.util.Map;

public class Config {

    private static final Logger log = LoggerFactory.getLogger(Config.class);

    private static final String token;
    private static final String prefix;
    private static final String dbPath;

    static {
        Map<String, Object> yml = loadYml();

        token  = get(yml, "token",   "BOT_TOKEN",  null);
        prefix = get(yml, "prefix",  "BOT_PREFIX", "!");
        dbPath = get(yml, "db_path", "DB_PATH",    "data/bot.db");
    }

    private static Map<String, Object> loadYml() {
        File f = new File("config.yml");
        if (!f.exists()) return Map.of();
        try (FileInputStream in = new FileInputStream(f)) {
            Yaml yaml = new Yaml();
            Map<String, Object> map = yaml.load(in);
            log.info("Loaded config.yml");
            return map != null ? map : Map.of();
        } catch (Exception e) {
            log.warn("Failed to read config.yml — falling back to environment variables.", e);
            return Map.of();
        }
    }

    private static String get(Map<String, Object> yml, String ymlKey, String envKey, String defaultValue) {
        Object ymlVal = yml.get(ymlKey);
        if (ymlVal != null && !ymlVal.toString().isBlank()) return ymlVal.toString().trim();
        String envVal = System.getenv(envKey);
        if (envVal != null && !envVal.isBlank()) return envVal.trim();
        return defaultValue;
    }

    public static String getToken() {
        if (token == null || token.isBlank())
            throw new IllegalStateException("Bot token not set. Add it to config.yml or set BOT_TOKEN env var.");
        return token;
    }

    public static String getPrefix() { return prefix; }
    public static String getDbPath() { return dbPath; }
}
