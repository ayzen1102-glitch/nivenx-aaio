package com.pfpbot.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class SetupSessionManager {

    private static final Map<String, Session> sessions = new ConcurrentHashMap<>();

    public static Session getOrCreate(String guildId, String userId) {
        return sessions.computeIfAbsent(key(guildId, userId), k -> new Session());
    }

    public static Session get(String guildId, String userId) {
        return sessions.get(key(guildId, userId));
    }

    public static void remove(String guildId, String userId) {
        sessions.remove(key(guildId, userId));
    }

    private static String key(String guildId, String userId) {
        return guildId + ":" + userId;
    }

    public static class Session {
        private String femaleChannelId;
        private String maleChannelId;
        private String animeChannelId;
        private int intervalSeconds = 45;

        public String getFemaleChannelId() { return femaleChannelId; }
        public String getMaleChannelId()   { return maleChannelId; }
        public String getAnimeChannelId()  { return animeChannelId; }
        public int    getIntervalSeconds() { return intervalSeconds; }

        public void setFemaleChannelId(String id) { this.femaleChannelId = id; }
        public void setMaleChannelId(String id)   { this.maleChannelId = id; }
        public void setAnimeChannelId(String id)  { this.animeChannelId = id; }
        public void setIntervalSeconds(int s)      { this.intervalSeconds = s; }

        public boolean hasAnyChannel() {
            return femaleChannelId != null || maleChannelId != null || animeChannelId != null;
        }
    }
}
