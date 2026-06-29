package com.pfpbot.database;

import com.pfpbot.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class Database {

    private static final Logger log = LoggerFactory.getLogger(Database.class);
    private static Database instance;
    private Connection connection;

    private Database() {
        try {
            new File(Config.getDbPath()).getParentFile().mkdirs();
            connection = DriverManager.getConnection("jdbc:sqlite:" + Config.getDbPath());
            init();
            log.info("Database connected at {}", Config.getDbPath());
        } catch (SQLException e) {
            throw new RuntimeException("Failed to connect to SQLite database.", e);
        }
    }

    public static Database get() {
        if (instance == null) instance = new Database();
        return instance;
    }

    private void init() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS guild_categories (
                    guild_id     TEXT    NOT NULL,
                    category     TEXT    NOT NULL,
                    channel_id   TEXT    NOT NULL,
                    enabled      INTEGER NOT NULL DEFAULT 1,
                    interval_sec INTEGER NOT NULL DEFAULT 45,
                    post_index   INTEGER NOT NULL DEFAULT 0,
                    PRIMARY KEY (guild_id, category)
                )
            """);
        }
    }


    public void upsertGuildCategory(String guildId, String channelId, String category, int intervalSec) {
        try (PreparedStatement ps = connection.prepareStatement("""
                INSERT INTO guild_categories (guild_id, category, channel_id, enabled, interval_sec, post_index)
                VALUES (?, ?, ?, 1, ?, 0)
                ON CONFLICT(guild_id, category) DO UPDATE SET
                    channel_id   = excluded.channel_id,
                    interval_sec = excluded.interval_sec,
                    enabled      = 1,
                    post_index   = 0
            """)) {
            ps.setString(1, guildId);
            ps.setString(2, category);
            ps.setString(3, channelId);
            ps.setInt(4, intervalSec);
            ps.executeUpdate();
        } catch (SQLException e) {
            log.error("Failed to upsert guild {} category {}", guildId, category, e);
        }
    }


    public GuildSettings getGuildCategory(String guildId, String category) {
        try (PreparedStatement ps = connection.prepareStatement(
                "SELECT * FROM guild_categories WHERE guild_id = ? AND category = ?")) {
            ps.setString(1, guildId);
            ps.setString(2, category);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return fromRow(rs);
        } catch (SQLException e) {
            log.error("Failed to fetch guild {} category {}", guildId, category, e);
        }
        return null;
    }


    public List<GuildSettings> getAllEnabled() {
        List<GuildSettings> list = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(
                "SELECT * FROM guild_categories WHERE enabled = 1")) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) list.add(fromRow(rs));
        } catch (SQLException e) {
            log.error("Failed to fetch all enabled entries", e);
        }
        return list;
    }


    public List<GuildSettings> getGuild(String guildId) {
        List<GuildSettings> list = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(
                "SELECT * FROM guild_categories WHERE guild_id = ?")) {
            ps.setString(1, guildId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) list.add(fromRow(rs));
        } catch (SQLException e) {
            log.error("Failed to fetch guild {}", guildId, e);
        }
        return list;
    }


    public void setEnabledAll(String guildId, boolean enabled) {
        try (PreparedStatement ps = connection.prepareStatement(
                "UPDATE guild_categories SET enabled = ? WHERE guild_id = ?")) {
            ps.setInt(1, enabled ? 1 : 0);
            ps.setString(2, guildId);
            ps.executeUpdate();
        } catch (SQLException e) {
            log.error("Failed to set enabled for guild {}", guildId, e);
        }
    }


    public void setPostIndex(String guildId, String category, int index) {
        try (PreparedStatement ps = connection.prepareStatement(
                "UPDATE guild_categories SET post_index = ? WHERE guild_id = ? AND category = ?")) {
            ps.setInt(1, index);
            ps.setString(2, guildId);
            ps.setString(3, category);
            ps.executeUpdate();
        } catch (SQLException e) {
            log.error("Failed to update post index for guild {} category {}", guildId, category, e);
        }
    }


    public void resetGuild(String guildId) {
        try (PreparedStatement ps = connection.prepareStatement(
                "DELETE FROM guild_categories WHERE guild_id = ?")) {
            ps.setString(1, guildId);
            ps.executeUpdate();
        } catch (SQLException e) {
            log.error("Failed to reset guild {}", guildId, e);
        }
    }


    private GuildSettings fromRow(ResultSet rs) throws SQLException {
        return new GuildSettings(
                rs.getString("guild_id"),
                rs.getString("category"),
                rs.getString("channel_id"),
                rs.getInt("enabled") == 1,
                rs.getInt("interval_sec"),
                rs.getInt("post_index")
        );
    }


    public record GuildSettings(
            String guildId,
            String category,
            String channelId,
            boolean enabled,
            int intervalSec,
            int postIndex
    ) {}
}
