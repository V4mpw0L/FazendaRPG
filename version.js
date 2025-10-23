/**
 * FazendaRPG - Centralized Version Management
 * Single source of truth for version across the entire project
 *
 * HOW TO UPDATE VERSION:
 * 1. Change VERSION constant below
 * 2. Run: node update-version.js (if available)
 * 3. Or manually import in files that need version
 *
 * @file version.js
 * @version 0.0.13
 */

/**
 * Current version of FazendaRPG
 * @constant {string}
 */
export const VERSION = "0.0.13";

/**
 * Version parts for programmatic access
 * @constant {Object}
 */
export const VERSION_PARTS = {
  major: 0,
  minor: 0,
  patch: 13,
};

/**
 * Build metadata
 * @constant {Object}
 */
export const BUILD_INFO = {
  version: VERSION,
  buildDate: "2024",
  codename: "NotificationFix",
  description: "Sistema de notificações corrigido - notifica apenas com app fechado",
};

/**
 * Get full version string with metadata
 * @returns {string} Full version string
 */
export function getVersionString() {
  return `FazendaRPG v${VERSION}`;
}

/**
 * Get detailed version info
 * @returns {Object} Detailed version information
 */
export function getVersionInfo() {
  return {
    version: VERSION,
    major: VERSION_PARTS.major,
    minor: VERSION_PARTS.minor,
    patch: VERSION_PARTS.patch,
    ...BUILD_INFO,
  };
}

/**
 * Get cache name for Service Worker (with version)
 * @returns {string} Cache name
 */
export function getCacheName() {
  return `fazendarpg-v${VERSION}`;
}

/**
 * Compare versions
 * @param {string} version1 - First version (e.g., "0.0.11")
 * @param {string} version2 - Second version (e.g., "0.0.12")
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export function compareVersions(version1, version2) {
  const v1Parts = version1.split(".").map(Number);
  const v2Parts = version2.split(".").map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1 = v1Parts[i] || 0;
    const v2 = v2Parts[i] || 0;

    if (v1 < v2) return -1;
    if (v1 > v2) return 1;
  }

  return 0;
}

/**
 * Check if version is compatible with current version
 * @param {string} checkVersion - Version to check
 * @returns {boolean} True if compatible (same major.minor)
 */
export function isVersionCompatible(checkVersion) {
  const current = `${VERSION_PARTS.major}.${VERSION_PARTS.minor}`;
  const check = checkVersion.split(".").slice(0, 2).join(".");
  return current === check;
}

/**
 * Log version info to console
 */
export function logVersion() {
  console.log(`🌾 ${getVersionString()}`);
  console.log(`📦 Build: ${BUILD_INFO.codename}`);
  console.log(`📅 Date: ${BUILD_INFO.buildDate}`);
  console.log(`ℹ️  ${BUILD_INFO.description}`);
}

// Default export
export default {
  VERSION,
  VERSION_PARTS,
  BUILD_INFO,
  getVersionString,
  getVersionInfo,
  getCacheName,
  compareVersions,
  isVersionCompatible,
  logVersion,
};
