'use strict';

const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  Options,
} = require('discord.js');
const { readdirSync, existsSync, mkdirSync } = require('fs');
const path = require('path');

process.on('unhandledRejection', () => {});
process.on('uncaughtException',  () => {});

const c = {
  reset:  '\x1b[0m',
  bright: '\x1b[1m',
  dim:    '\x1b[2m',
  cyan:   '\x1b[36m',
  blue:   '\x1b[34m',
  purple: '\x1b[35m',
  pink:   '\x1b[95m',
  white:  '\x1b[97m',
  gray:   '\x1b[90m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
};

const banner = `
${c.cyan}${c.bright}  ███╗   ██╗██╗██╗   ██╗███████╗███╗   ██╗██╗  ██╗
  ████╗  ██║██║██║   ██║██╔════╝████╗  ██║╚██╗██╔╝
  ██╔██╗ ██║██║██║   ██║█████╗  ██╔██╗ ██║ ╚███╔╝ 
  ██║╚██╗██║██║╚██╗ ██╔╝██╔══╝  ██║╚██╗██║ ██╔██╗ 
  ██║ ╚████║██║ ╚████╔╝ ███████╗██║ ╚████║██╔╝ ██╗
  ╚═╝  ╚═══╝╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝${c.reset}
${c.blue}${c.bright}  ─────────────────────────────────────────────────${c.reset}
${c.gray}  All-In-One Discord Bot · NivenX Project${c.reset}
`;

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let shardConfig   = {};
let ClusterClient = null;
try {
  const sharding = require('discord-hybrid-sharding');
  const info     = sharding.getInfo();
  if (info?.SHARD_LIST) {
    shardConfig   = { shards: info.SHARD_LIST, shardCount: info.TOTAL_SHARDS };
    ClusterClient = sharding.ClusterClient;
  }
} catch {}

const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],
  allowedMentions: {
    repliedUser: false,
    parse: ['users', 'roles'],
  },
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    MessageManager:            100,
    PresenceManager:            0,
    VoiceStateManager:        200,
    ReactionManager:            0,
    GuildStickerManager:        0,
    GuildScheduledEventManager: 0,
    AutoModerationRuleManager:  0,
  }),
  sweepers: {
    ...Options.DefaultSweeperSettings,
    messages: { interval: 600, lifetime: 900 },
    users: {
      interval: 7200,
      filter: () => (user) => user.bot && user.id !== client.user?.id,
    },
  },
  rest: { retries: 3, timeout: 8_000, offset: 0 },
  ...shardConfig,
});

if (ClusterClient) client.cluster = new ClusterClient(client);

client.config   = config;
client.commands = new Collection();
client.cools    = new Collection();

const token    = process.env.DISCORD_TOKEN || config.token;
const mongoURL = process.env.MONGODB_URL   || config.mongo;

if (!token) {
  console.error(`${c.red}${c.bright}[FATAL] DISCORD_TOKEN is not set. Set it in your .env file.${c.reset}`);
  process.exit(1);
}

try {
  const { Database } = require('quickmongo');
  client.db = new Database(mongoURL);
  client.db.connect().then(() => {
    console.log(`${c.green}  ✅ MongoDB connected${c.reset}`);
  }).catch(() => {
    console.warn(`${c.yellow}  ⚠️  MongoDB not connected — some features may be unavailable${c.reset}`);
  });
} catch {
  console.warn(`${c.yellow}  ⚠️  quickmongo not installed — MongoDB features unavailable${c.reset}`);
}

try {
  const { open } = require('lmdb');
  const lmdbPath = path.join(__dirname, 'database', 'lmdb');
  if (!existsSync(lmdbPath)) mkdirSync(lmdbPath, { recursive: true });
  const lmdb = open({ path: lmdbPath, compression: true, mapSize: 1024 * 1024 * 512 });
  client.lmdb          = lmdb;
  client.lmdbGet       = (key)        => lmdb.get(key);
  client.lmdbSet       = (key, value) => lmdb.put(key, value);
  client.lmdbDel       = (key)        => lmdb.remove(key);
  client.isWhitelisted = (guildId, userId) => {
    const wl = lmdb.get(`whitelist_${guildId}`) || [];
    return wl.includes(userId);
  };
  client.isAntinukeEnabled = (guildId) => lmdb.get(`antinuke_${guildId}`) === 'enabled';
  console.log(`${c.green}  ✅ LMDB cache initialised${c.reset}`);
} catch {
  console.warn(`${c.yellow}  ⚠️  lmdb not installed — security caching unavailable${c.reset}`);
}

try {
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'database', 'nivenx.db');
  client.sqlite = new Database(dbPath);
  client.sqlite.pragma('journal_mode = WAL');
  console.log(`${c.green}  ✅ SQLite database ready${c.reset}`);
} catch {
  console.warn(`${c.yellow}  ⚠️  better-sqlite3 not installed — SQLite features unavailable${c.reset}`);
}

client.setMaxListeners(30);

const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents }   = require('./handlers/eventHandler');

let cmdCount = 0;
let evtCount = 0;

(async () => {
  try {
    cmdCount = await loadCommands(client);
    evtCount = await loadEvents(client);
  } catch (err) {
    console.error(`${c.red}  Handler load error: ${err.message}${c.reset}`);
  }

  client.once('clientReady', () => {
    console.log(banner);
    console.log(`${c.cyan}${c.bright}  Commands  ${c.white}✅  ${c.gray}(${cmdCount} loaded)${c.reset}`);
    console.log(`${c.cyan}${c.bright}  Events    ${c.white}✅  ${c.gray}(${evtCount} loaded)${c.reset}`);
    console.log(`${c.blue}${c.bright}  ─────────────────────────────────────────${c.reset}`);
    console.log(`${c.pink}${c.bright}  ${client.user.tag}  ${c.gray}[ping: ${client.ws.ping}ms | guilds: ${client.guilds.cache.size}]${c.reset}`);
    console.log(`${c.blue}${c.bright}  ─────────────────────────────────────────${c.reset}\n`);
  });

  await client.login(token);
})();

require('http')
  .createServer((_, res) => res.end('NivenX Online'))
  .listen(process.env.PORT || 3000, '127.0.0.1');

module.exports = client;
