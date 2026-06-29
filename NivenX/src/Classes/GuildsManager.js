'use strict';

/**
 * Stub GuildsManager — wraps guild database documents.
 * Real implementation would extend from a database ODM.
 */
class GuildsManager {
    constructor(data = {}) {
        this.logs = data.logs || { enabled: false, moderator: null };
        this.prefix = data.prefix || null;
        this.language = data.language || 'en';
        Object.assign(this, data);
    }
}

module.exports = { GuildsManager };
