'use strict';

const COLORS = {
    PRIMARY:  0x5865F2,
    SUCCESS:  0x57F287,
    WARNING:  0xFEE75C,
    ERROR:    0xED4245,
    NEUTRAL:  0x2B2D31,
};

const VERIFICATION_TYPES = {
    BUTTON:   'button',
    REACTION: 'reaction',
    CAPTCHA:  'captcha',
};

const PANEL_CUSTOM_IDS = {
    VERIFY_BUTTON: 'verification_verify',
    SETUP_CONFIRM: 'verification_setup_confirm',
    SETUP_CANCEL:  'verification_setup_cancel',
};

const DEFAULT_MESSAGES = {
    VERIFY_TITLE:   '✅ Verification',
    VERIFY_DESC:    'Click the button below to verify yourself and gain access to the server.',
    SUCCESS_TITLE:  '✅ Verified!',
    SUCCESS_DESC:   'You have been successfully verified and granted access to the server.',
    FAILED_TITLE:   '❌ Verification Failed',
    FAILED_DESC:    'Verification failed. Please try again or contact a staff member.',
};

module.exports = { COLORS, VERIFICATION_TYPES, PANEL_CUSTOM_IDS, DEFAULT_MESSAGES };
