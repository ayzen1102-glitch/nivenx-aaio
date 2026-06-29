/*
 * ============================================================
 *  AeroX Verifier Bot — Integrity Guard
 *  Made by: Ayle | All Rights Reserved © AeroX Development
 * ============================================================
 *
 * WARNING: Modifying this file or credits.js will break the bot.
 * ============================================================
 */

const crypto = require('crypto');
const { AUTHOR_CREDITS } = require('./credits');

// SHA-256 of the exact AUTHOR_CREDITS string — do not change.
const EXPECTED_HASH = 'fbd6ab75789f940e13c3044f314c85ed9fe425acb9118a137126da5edb7d277f';

// ANSI lavender color (RGB 179, 147, 250)
const LAV  = '\x1b[38;2;179;147;250m';
const BOLD = '\x1b[1m';
const RST  = '\x1b[0m';

function checkIntegrity() {
  const actual = crypto.createHash('sha256').update(AUTHOR_CREDITS, 'utf8').digest('hex');

  if (actual === EXPECTED_HASH) return; // all good

  console.error('');
  console.error(`${LAV}${BOLD}╔══════════════════════════════════════════════════════════╗${RST}`);
  console.error(`${LAV}${BOLD}║         AeroX Verifier — INTEGRITY VIOLATION             ║${RST}`);
  console.error(`${LAV}${BOLD}╠══════════════════════════════════════════════════════════╣${RST}`);
  console.error(`${LAV}${BOLD}║                                                          ║${RST}`);
  console.error(`${LAV}${BOLD}║  The Bot's Credits Have Been Tampered With.              ║${RST}`);
  console.error(`${LAV}${BOLD}║  Restore The Original Credits of The Author              ║${RST}`);
  console.error(`${LAV}${BOLD}║  To Start The Bot.                                       ║${RST}`);
  console.error(`${LAV}${BOLD}║                                                          ║${RST}`);
  console.error(`${LAV}${BOLD}║  Author : Ayle                                           ║${RST}`);
  console.error(`${LAV}${BOLD}║  Project: AeroX Development                              ║${RST}`);
  console.error(`${LAV}${BOLD}║  Support: https://discord.gg/aerox                       ║${RST}`);
  console.error(`${LAV}${BOLD}║                                                          ║${RST}`);
  console.error(`${LAV}${BOLD}╚══════════════════════════════════════════════════════════╝${RST}`);
  console.error('');

  process.exit(1);
}

module.exports = { checkIntegrity };
