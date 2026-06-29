// Falcron | NivenX Project
// Author: itsfizys
/**
 * Returns a promise that resolves after `ms` milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export async function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

/**
 * Project: Falcron
 * Author: itsfizys (Aegis)
 * Organization: NivenX Project
 * GitHub: https://github.com/NivenXDevs
 * License: Custom
 *
 * © 2026 NivenX Project. All rights reserved.
 */