'use strict';

const c = {
  reset:  '\x1b[0m',
  bright: '\x1b[1m',
  dim:    '\x1b[2m',
  cyan:   '\x1b[36m',
  blue:   '\x1b[34m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  gray:   '\x1b[90m',
  white:  '\x1b[97m',
};

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

const logger = {
  info:    (tag, msg) => console.log(`${c.gray}[${timestamp()}]${c.reset} ${c.cyan}[${tag}]${c.reset} ${msg}`),
  success: (tag, msg) => console.log(`${c.gray}[${timestamp()}]${c.reset} ${c.green}[${tag}]${c.reset} ${msg}`),
  warn:    (tag, msg) => console.warn(`${c.gray}[${timestamp()}]${c.reset} ${c.yellow}[${tag}]${c.reset} ${msg}`),
  error:   (tag, msg) => console.error(`${c.gray}[${timestamp()}]${c.reset} ${c.red}[${tag}]${c.reset} ${msg}`),
};

module.exports = { logger };
