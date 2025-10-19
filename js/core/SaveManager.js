/**
 * FazendaRPG - Save Manager
 * Handles saving and loading game data with automatic backups and fallbacks
 * @version 0.0.2
 */

import { safeJSONParse, safeJSONStringify, downloadFile, loadFile } from '../utils/helpers.js';

export default class SaveManager {
    constructor() {
        this.saveKey = 'fazendarpg_save';
        this.backupKey = 'fazendarpg_save_backup';
        this.autoSaveInterval = 60000; // 60 seconds
        this.autoSaveTimer = null;
        this.lastSaveTime = 0;
    }

    /**
     * Initialize auto-save system
     */
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }

        this.autoSaveTimer = setInterval(() => {
            this.autoSave();
        }, this.autoSaveInterval);

        console.log('💾 Auto-save enabled (every 60s)');
    }

    /**
     * Stop auto-save system
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
            console.log('💾 Auto-save disabled');
        }
    }

    /**
     * Auto-save (called by interval)
     */
    autoSave() {
        const event = new CustomEvent('save:auto');
        window.dispatchEvent(event);
    }

    /**
     * Save game data to localStorage
     * @param {Object} data - Game data to save
     * @returns {boolean} Success
     */
    save(data) {
        if (!data || typeof data !== 'object') {
            console.error('❌ Invalid save data');
            return false;
        }

        try {
            // Add metadata
            const saveData = {
                ...data,
                savedAt: Date.now(),
                version: '0.0.2'
            };

            const jsonData = safeJSONStringify(saveData);

            // Create backup of current save
            const currentSave = localStorage.getItem(this.saveKey);
            if (currentSave) {
                localStorage.setItem(this.backupKey, currentSave);
            }

            // Save new data
            localStorage.setItem(this.saveKey, jsonData);
            this.lastSaveTime = Date.now();

            console.log('✅ Game saved successfully');

            // Dispatch save event
            window.dispatchEvent(new CustomEvent('save:complete', {
                detail: { timestamp: this.lastSaveTime }
            }));

            return true;
        } catch (error) {
            console.error('❌ Failed to save game:', error);

            // Check if quota exceeded
            if (error.name === 'QuotaExceededError') {
                console.error('💾 Storage quota exceeded!');
                this.handleQuotaExceeded();
            }

            return false;
        }
    }

    /**
     * Load game data from localStorage
     * @returns {Object|null} Loaded data or null
     */
    load() {
        try {
            const jsonData = localStorage.getItem(this.saveKey);

            if (!jsonData) {
                console.log('📭 No save data found');
                return null;
            }

            const data = safeJSONParse(jsonData);

            if (!data) {
                console.warn('⚠️ Corrupted save data, trying backup...');
                return this.loadBackup();
            }

            // Validate save data
            if (!this.validateSaveData(data)) {
                console.warn('⚠️ Invalid save data, trying backup...');
                return this.loadBackup();
            }

            console.log('✅ Game loaded successfully');
            return data;
        } catch (error) {
            console.error('❌ Failed to load game:', error);
            return this.loadBackup();
        }
    }

    /**
     * Load backup save data
     * @returns {Object|null} Backup data or null
     */
    loadBackup() {
        try {
            const jsonData = localStorage.getItem(this.backupKey);

            if (!jsonData) {
                console.log('📭 No backup data found');
                return null;
            }

            const data = safeJSONParse(jsonData);

            if (!data || !this.validateSaveData(data)) {
                console.error('❌ Backup data is also invalid');
                return null;
            }

            console.log('✅ Backup loaded successfully');

            // Restore backup as main save
            localStorage.setItem(this.saveKey, jsonData);

            return data;
        } catch (error) {
            console.error('❌ Failed to load backup:', error);
            return null;
        }
    }

    /**
     * Validate save data structure
     * @param {Object} data - Data to validate
     * @returns {boolean} True if valid
     */
    validateSaveData(data) {
        if (!data || typeof data !== 'object') return false;

        // Check required properties
        const requiredProps = ['player', 'savedAt', 'version'];

        for (const prop of requiredProps) {
            if (!(prop in data)) {
                console.warn(`⚠️ Missing required property: ${prop}`);
                return false;
            }
        }

        // Validate player data
        if (!data.player || typeof data.player !== 'object') {
            console.warn('⚠️ Invalid player data');
            return false;
        }

        return true;
    }

    /**
     * Check if save data exists
     * @returns {boolean} True if save exists
     */
    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    /**
     * Delete save data
     * @param {boolean} includeBackup - Also delete backup
     * @returns {boolean} Success
     */
    deleteSave(includeBackup = false) {
        try {
            localStorage.removeItem(this.saveKey);

            if (includeBackup) {
                localStorage.removeItem(this.backupKey);
            }

            console.log('🗑️ Save data deleted');

            // Dispatch delete event
            window.dispatchEvent(new CustomEvent('save:deleted'));

            return true;
        } catch (error) {
            console.error('❌ Failed to delete save:', error);
            return false;
        }
    }

    /**
     * Export save data to file
     * @param {Object} data - Data to export
     * @returns {boolean} Success
     */
    exportSave(data) {
        try {
            const saveData = {
                ...data,
                exportedAt: Date.now(),
                version: '0.0.2'
            };

            const jsonData = JSON.stringify(saveData, null, 2);
            const filename = `fazendarpg_save_${Date.now()}.json`;

            downloadFile(jsonData, filename, 'application/json');

            console.log('📦 Save exported successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to export save:', error);
            return false;
        }
    }

    /**
     * Import save data from file
     * @returns {Promise<Object|null>} Imported data or null
     */
    async importSave() {
        try {
            const fileContent = await loadFile('.json');
            const data = safeJSONParse(fileContent);

            if (!data) {
                throw new Error('Invalid JSON file');
            }

            if (!this.validateSaveData(data)) {
                throw new Error('Invalid save file format');
            }

            console.log('📥 Save imported successfully');
            return data;
        } catch (error) {
            console.error('❌ Failed to import save:', error);
            return null;
        }
    }

    /**
     * Handle storage quota exceeded
     */
    handleQuotaExceeded() {
        console.warn('⚠️ Attempting to free up storage space...');

        try {
            // Remove old backups
            localStorage.removeItem(this.backupKey);

            // Try to save again
            console.log('🔄 Retrying save after cleanup...');
        } catch (error) {
            console.error('❌ Failed to free up space:', error);

            // Notify user
            window.dispatchEvent(new CustomEvent('save:quotaExceeded'));
        }
    }

    /**
     * Get save data size in bytes
     * @returns {number} Size in bytes
     */
    getSaveSize() {
        const save = localStorage.getItem(this.saveKey);
        return save ? new Blob([save]).size : 0;
    }

    /**
     * Get save data info
     * @returns {Object|null} Save info or null
     */
    getSaveInfo() {
        const jsonData = localStorage.getItem(this.saveKey);
        if (!jsonData) return null;

        const data = safeJSONParse(jsonData);
        if (!data) return null;

        return {
            savedAt: data.savedAt,
            version: data.version,
            playerName: data.player?.name || 'Unknown',
            playerLevel: data.player?.level || 1,
            size: this.getSaveSize()
        };
    }

    /**
     * Get time since last save
     * @returns {number} Seconds since last save
     */
    getTimeSinceLastSave() {
        if (!this.lastSaveTime) {
            const info = this.getSaveInfo();
            if (info) {
                this.lastSaveTime = info.savedAt;
            }
        }

        if (!this.lastSaveTime) return 0;

        return Math.floor((Date.now() - this.lastSaveTime) / 1000);
    }

    /**
     * Clear all save data (including backups and settings)
     */
    clearAll() {
        try {
            // Get all keys
            const keys = Object.keys(localStorage);

            // Remove all FazendaRPG related keys
            keys.forEach(key => {
                if (key.startsWith('fazenda')) {
                    localStorage.removeItem(key);
                }
            });

            console.log('🗑️ All save data cleared');

            // Dispatch event
            window.dispatchEvent(new CustomEvent('save:cleared'));

            return true;
        } catch (error) {
            console.error('❌ Failed to clear data:', error);
            return false;
        }
    }

    /**
     * Get storage usage info
     * @returns {Object} Storage info
     */
    getStorageInfo() {
        let totalSize = 0;
        const items = {};

        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const size = new Blob([localStorage.getItem(key)]).size;
                totalSize += size;
                if (key.startsWith('fazenda')) {
                    items[key] = size;
                }
            }
        }

        return {
            totalSize,
            items,
            available: 5 * 1024 * 1024 - totalSize // Assume 5MB limit
        };
    }

    /**
     * Create a save snapshot
     * @param {Object} data - Data to snapshot
     * @param {string} name - Snapshot name
     * @returns {boolean} Success
     */
    createSnapshot(data, name = 'manual') {
        try {
            const snapshotKey = `${this.saveKey}_snapshot_${name}_${Date.now()}`;
            const jsonData = safeJSONStringify(data);

            localStorage.setItem(snapshotKey, jsonData);

            console.log(`📸 Snapshot created: ${name}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to create snapshot:', error);
            return false;
        }
    }

    /**
     * List all snapshots
     * @returns {Array} List of snapshots
     */
    listSnapshots() {
        const snapshots = [];
        const prefix = `${this.saveKey}_snapshot_`;

        for (let key in localStorage) {
            if (key.startsWith(prefix)) {
                const data = safeJSONParse(localStorage.getItem(key));
                if (data) {
                    snapshots.push({
                        key,
                        name: key.replace(prefix, '').split('_')[0],
                        timestamp: parseInt(key.split('_').pop()),
                        playerName: data.player?.name || 'Unknown',
                        playerLevel: data.player?.level || 1
                    });
                }
            }
        }

        return snapshots.sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * Delete a snapshot
     * @param {string} key - Snapshot key
     * @returns {boolean} Success
     */
    deleteSnapshot(key) {
        try {
            localStorage.removeItem(key);
            console.log('🗑️ Snapshot deleted');
            return true;
        } catch (error) {
            console.error('❌ Failed to delete snapshot:', error);
            return false;
        }
    }
}
