'use strict';

/**
 * NivenX — Combined Emoji Config
 * Merged from all source bots:
 *   AeroX-Security-Bot, Appy-Bot, Falcron, Feedback-Bot,
 *   Groove-Music, Guardian-Moderation-Bot, TicketBot
 *
 * Usage:
 *   const emojis = require('../lib/emojis');
 *   emojis.core.tick          // single lookup
 *   emojis.music.play         // category lookup
 *   emojis.get('music', 'play')  // helper method
 */

const emojis = {

  // ─────────────────────────────────────────────────────────────
  // CORE / GENERAL  (from AeroX-Security-Bot)
  // ─────────────────────────────────────────────────────────────
  core: {
    tick:       '<:ratio_tick:1487894048781111347>',
    cross:      '<:ratio_cross:1487894053080010803>',
    arrow:      '<:ratio_arrow:1487894061594443788>',
    dot:        '<:ratioDeveloper:1487894058226683965>',
    enabled:    '<:ratio_enabled:1487894068594737163>',
    disabled:   '<:ratio_disabled:1487894072717742151>',
    error:      '<a:ratio_error:1488048323062534225>',
    loading:    '<a:loading:1488048325361139802>',
    tick2:      '<:ratio_tick2:1488048329463169106>',
    enabled2:   '<:ratio_enabled2:1488048333221265418>',
    disabled2:  '<:ratio_disabled2:1488048337562107934>',
    back:       '<:ratio_back:1488048344633839617>',
    inviteBtn:  '<:inviteBtn:1461812701973053480>',
    supportBtn: '<:supportBtn:1461812634167808091>',
    wl:         '<:ratioDeveloper:1487894058226683965>',
  },

  // ─────────────────────────────────────────────────────────────
  // SECURITY / ANTINUKE  (from AeroX-Security-Bot)
  // ─────────────────────────────────────────────────────────────
  security: {
    antinuke:  '<:alerta:1487894082310246521>',
    automod:   '<:automod:1488048340729073796>',
    tick2:     '<:ratio_tick2:1488048329463169106>',
    enabled2:  '<:ratio_enabled2:1488048333221265418>',
    disabled2: '<:ratio_disabled2:1488048337562107934>',
  },

  // ─────────────────────────────────────────────────────────────
  // MODERATION / TICKETS  (from TicketBot + Guardian)
  // ─────────────────────────────────────────────────────────────
  moderation: {
    lock:       '<:lock:1451623768316317758>',
    unlock:     '<:unlock:1451623734690447471>',
    trash:      '<:trash:1451623739069300876>',
    ticket:     '<:ticket:1451623743318134932>',
    starFill:   '<:starFill:1451623747642589284>',
    starEmpty:  '<:starEmpty:1451623752122241176>',
    settings:   '<:settings:1451623755490267158>',
    remove:     '<:remove:1451623759457812543>',
    logs:       '<:logs:1451623763732070470>',
    dashboard:  '<:dashboard:1451623775144640728>',
    cross:      '<:close:1451623779062124735>',
    check:      '<:check:1451623783197704262>',
    add:        '<:add:1451623786683039866>',
    moderation: '<:moderation:1493486297094946846>',
  },

  // ─────────────────────────────────────────────────────────────
  // APPLICATIONS / APPY  (from Appy-Bot)
  // ─────────────────────────────────────────────────────────────
  applications: {
    mail:         '<:mail:1494293298846760961>',
    automod:      '<:automod:1488048340729073796>',
    gift:         '<:gift:1494293300503384066>',
    setting:      '<:setting:1494293302948921424>',
    earth:        '<:earth:1494293304349818882>',
    success:      '✅',
    error:        '❌',
    warning:      '⚠️',
    ticket:       '🎫',
    celebration:  '🎉',
    participants: '👥',
    trash:        '🗑️',
    pending:      '🟡',
    noEntry:      '🚫',
    lock:         '🔒',
    unlock:       '🔓',
  },

  // ─────────────────────────────────────────────────────────────
  // MUSIC / GROOVE  (from Groove-Music)
  // ─────────────────────────────────────────────────────────────
  music: {
    check:      '<:icon_24:1490275246471905382>',
    cross:      '<:icon_1:1490275254940209312>',
    info:       '<:icon_2:1490275264263880734>',
    warn:       '<:icon_3:1490275275030794250>',
    dot:        '<:7135graydot:1490275283368935496>',
    load:       '<a:laoding:1490275292701392996>',
    pause:      '<:icon_4:1490275301132079205>',
    play:       '<:icon_5:1490275309075959899>',
    stop:       '<:icon_6:1490275316596342824>',
    voldown:    '<:icon_8:1490275325022572545>',
    volup:      '<:icon_7:1490275333868486676>',
    skip:       '<:icon_9:1490275342714277939>',
    previous:   '<:icon_10:1490275350612283425>',
    like:       '<:icon_11:1490275358443044924>',
    shuffle:    '<:icon_12:1490275368840462376>',
    loop:       '<:icon_13:1490275377094987857>',
    dance:      '<:1419280007758479450:1490275386238697566>',
    youtube:    '<:912969youtubelogo:1490275400860045507>',
    spotify:    '<:Spotify_Primary_Logo_RGB_Green:1490275409458237440>',
    ytmusic:    '<:8066youtubemusic:1490275418224332840>',
    applemusic: '<:3265applemusic:1490275427040890960>',
    deezer:     '<:43884deezer:1490275434406088723>',
    jiosaavn:   '<:R_:1490275443935416372>',
    gaana:      '<:gaana:1490275592875278488>',
    soundcloud: '<:soundcloudroundcoloricon:1490275601171484732>',
    wickarrow:  '<:1462006066182357111:1490275452655374438>',
    gwy:        '<:icon_17:1490275459831697419>',
    blank:      '<:1462306951990874194:1490275469223002302>',
    arrowright: '<:1462460806309482588:1490275478832021768>',
    hastag:     '<:icon_15:1490275488436981930>',
    owner:      '<:icon_14:1490275497735753819>',
    add:        '<:icon_16:1490275506128420987>',
    duration:   '<:icon_18:1490275514982600745>',
    dnd:        '<:4431dndblank:1490275523522461737>',
    idle:       '<:11458idle:1490275532640620584>',
    streaming:  '<:2558streaming:1490275540689621144>',
    admin:      '<:icon_20:1490275548990279790>',
    manager:    '<:icon_19:1490275557374431312>',
    developer:  '<:icon_21:1490275566220218419>',
    staff:      '<:icon_22:1490275574793371813>',
    vip:        '<:icon_23:1490275583865913346>',
  },

  // ─────────────────────────────────────────────────────────────
  // INVITES / FALCRON  (from Falcron)
  // ─────────────────────────────────────────────────────────────
  invites: {
    home:             '<:home:1493486220242583664>',
    news:             '<:news:1493486229189300365>',
    arrow:            '<:arrow:1493486239934976162>',
    invite:           '<:invite:1493486250651287572>',
    msg:              '<:msg:1493486259320913941>',
    giveaway:         '<:giveaway:1493486267860648086>',
    greet:            '<:greet:1493486278660853850>',
    timer:            '<:timer:1493486287649374318>',
    moderation:       '<:moderation:1493486297094946846>',
    poll:             '<:poll:1493486307052355724>',
    utility:          '<:utility:1493486316388876340>',
    contact:          '<:contact:1493486325448314890>',
    tick:             '<:tick:1493486333954625547>',
    shard_online:     '<:online:1493486342821249164>',
    timer_clock:      '<a:TimeClock:1493486355701960764>',
    timer_animated:   '<a:timer_animated:1493486365076230284>',
    timer_ringing:    '<a:ringing_clock:1493486379227680928>',
    timer_alarm:      '<a:alarm_clock:1493486394901925938>',
    timer_roll:       '<a:roll:1493486406906150913>',
    timer_play_pause: '<a:play_pause:1493486418968973422>',
    giveaway_gift:    '<a:Gift:1493486427776876575>',
    giveaway_dot:     '<:dot:1493486437276979282>',
    giveaway_react:   '<:Gway:1493486446055653456>',
    invites:          '<:invites:1493486455186788352>',
    lb_back:          '<:lb_back:1493486464271519857>',
    lb_prev:          '<:lb_prev:1493486472911781991>',
    lb_stop:          '<:lb_stop:1493486481971347477>',
    lb_next:          '<:lb_next:1493486490641109013>',
    lb_forward:       '<:lb_forward:1493486500200054784>',
    chart:            '📊',
    scroll:           '📜',
    members:          '👥',
    gem:              '💎',
    folder:           '📁',
    calendar:         '📆',
  },

  // ─────────────────────────────────────────────────────────────
  // FEEDBACK  (from Feedback-Bot)
  // ─────────────────────────────────────────────────────────────
  feedback: {
    star:       '<:starwars:1489193140551417919>',
    star_empty: '<:starwars:1489193140551417919>',
    feedback:   '<:edit:1489193145026478140>',
    success:    '<:check:1489193148369600582>',
    error:      '<:cross:1489193152391675997>',
    warning:    '<:warning:1489193156795826216>',
    info:       '<:info:1489193160075903018>',
    setup:      '<:fix:1489193163942920384>',
    review:     '<:love:1489193168271314944>',
    user:       '<:requester:1489193172465746022>',
    date:       '<:activity:1489193176819433592>',
    rating:     '<:starwars:1489193140551417919>',
    bot:        '<:home:1489193180808216698>',
    heart:      '<:heart:1489193184188960808>',
    fire:       '<:cutefire:1489193187724623993>',
    sparkle:    '<:sparkles:1489196698633900113>',
    check:      '<:check:1489193148369600582>',
    admin:      '👑',
    source:     '📦',
    arrow:      '➜',
    ping:       '🏓',
  },

  // ─────────────────────────────────────────────────────────────
  // INFO / GUARDIAN  (from Guardian-Moderation-Bot Config)
  // ─────────────────────────────────────────────────────────────
  info: {
    github:             '💻',
    blurple_discord_at: '👤',
    blurple_bot:        '🤖',
    blurple_invite:     '🔗',
    blurple_employee:   '👨‍💻',
    blurple_members:    '👥',
    blurple_chat:       '💬',
    nodejs:             '🟢',
    discord_js:         '🟦',
    blurple_lock:       '🔐',
    blurple_link:       '🔗',
    statistics:         '📊',
    useful_links:       '🔗',
    administrator:      '🛡️',
    backup:             '💾',
    information:        'ℹ️',
    moderator:          '🔨',
    public:             '🌐',
    utility:            '🛠️',
  },

  // ─────────────────────────────────────────────────────────────
  // HELPER METHODS
  // ─────────────────────────────────────────────────────────────

  /**
   * Get an emoji by category and key.
   * @param {string} category  e.g. 'music', 'moderation'
   * @param {string} name      key within the category
   * @param {string} fallback  returned if not found
   */
  get(category, name, fallback = '') {
    if (this[category] && this[category][name] !== undefined) {
      return this[category][name];
    }
    return fallback;
  },

  /**
   * Search all categories for a key name.
   * Returns the first match found.
   */
  find(name, fallback = '') {
    const skip = new Set(['get', 'find', 'list']);
    for (const cat of Object.keys(this)) {
      if (skip.has(cat)) continue;
      if (typeof this[cat] === 'object' && this[cat][name] !== undefined) {
        return this[cat][name];
      }
    }
    return fallback;
  },

  /**
   * List all category names.
   */
  list() {
    const skip = new Set(['get', 'find', 'list']);
    return Object.keys(this).filter(k => !skip.has(k));
  },
};

module.exports = emojis;
