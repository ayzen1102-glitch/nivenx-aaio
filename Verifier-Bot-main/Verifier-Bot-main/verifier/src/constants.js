const path = require('node:path');

const DATA_DIR = path.join(process.cwd(), 'data');

module.exports = {
  CLIENT_ID: process.env.CLIENT_ID,
  TOKEN: process.env.DISCORD_TOKEN,
  CLOSE_INQUIRY_BUTTON_ID: 'support-inquiry:close',
  CONFIG_PATH: path.join(DATA_DIR, 'config.json'),
  CONTACT_SUPPORT_BUTTON_ID: 'support-inquiry:open',
  DATA_DIR,
  MAX_SCREENSHOT_BYTES: 10 * 1024 * 1024,
  PANEL_COLOR: 0x181818,
  SCREENSHOT_UPLOAD_ID: 'youtube-screenshot',
  VERIFY_BUTTON_ID: 'yt-subscribe-verify:start',
  VERIFY_MODAL_ID: 'yt-subscribe-verify:upload',
};
