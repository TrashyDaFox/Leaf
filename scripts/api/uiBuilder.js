import config from "../config";
import { ActionForm } from "../lib/form_func";
import { colors, prismarineDb } from "../lib/prismarinedb";
import actionParser from "./actionParser";
import normalForm from "./openers/normalForm";
import { system, ScriptEventSource } from '@minecraft/server';
import { array_move } from "./utils/array_move";
/*

 /\___/\
꒰ ˶• ༝ - ˶꒱
./づᡕᠵ᠊ᡃ࡚ࠢ࠘ ⸝່ࠡࠣ᠊߯᠆ࠣ࠘ᡁࠣ࠘᠊᠊°.~♡︎
"IM GONNA KILL YOU IF YOU BREAK THIS"
- Trashy

- i broke it, Claude 3.5 - 2025
*/

class UIBuilder {
    constructor() {
        this.initializeDatabases();
        this.initializeStates();
        this.setupScriptEventListener();
        this.migrateOldButtonActions();
        this.initializeVersionControl();
    }

    initializeDatabases() {
        this.db = prismarineDb.table(config.tableNames.uis);
        this.uiState = this.db.keyval("state");
        this.tabbedDB = prismarineDb.table("TabbedUI_DB");
        this.tagsDb = prismarineDb.table(`${config.tableNames.uis}~tags`);
    }

    createTabbedUI(title) {
        this.tabbedDB.insertDocument({
            type: "TAB_UI",
            title,
            tabs: [],
        })
    }
    getTabbedUIs() {
        return this.tabbedDB.findDocuments({type:"TAB_UI"})
    }
    addTab(id, tabTitle, tabUIScriptevent) {
        let tabUI = this.tabbedDB.getByID(id);
        if(!tabUI) return;
        tabUI.data.tabs.push({
            title: tabTitle,
            scriptevent: tabUIScriptevent
        })
        this.tabbedDB.overwriteDataByID(tabUI.id, tabUI.data);
    }
    deleteTabbedUI(id) {
        this.tabbedDB.deleteDocumentByID(id);
    }
    toggleState(state) {
        this.uiState.set(
            state,
            this.uiState.has(state) ? this.uiState.get(state) == 0 ? 1 : 0 : 1
        )
    }
    setState(state, value) {
        this.uiState.set(state, value == true ? 1 : 0);
    }
    getState(state) {
        return this.uiState.has(state) ? this.uiState.get(state) == 1 ? true : false : false;
    }

    initializeStates() {
        const defaultStates = [
            "ActionsV2Experiment",
            "UIStateEditor",
            "FormFolders",
            "UISearch",
            "UITags",
            "BuiltinTemplates",
            "PlayerContentManager",
            "SubUIs"
        ];
        defaultStates.forEach(state => this.setState(state, true));
    }

    setupScriptEventListener() {
        system.afterEvents.scriptEventReceive.subscribe(e => {
            if (e.sourceType === ScriptEventSource.Entity && e.id === config.scripteventNames.open) {
                const ui = this.db.findFirst({ scriptevent: e.message });
                ui && this.open(ui.id, e.sourceEntity);
            }
        });
    }

    migrateOldButtonActions() {
        for (const ui of this.db.data) {
            if (ui.data.type !== 0) continue;
            for (const button of ui.data.buttons) {
                if (!button.actions || !button.actions.length) {
                    button.actions = [button.action];
                    this.db.save();
                }
            }
        }
    }

    // Tag Management
    createTag(name, color) {
        if (!colors.getColorCodes().includes(color)) return false;
        if (this.tagsDb.findFirst({ name })) return false;
        
        this.tagsDb.insertDocument({ name, color });
        return true;
    }

    deleteTag(name) {
        const doc = this.tagsDb.findFirst({ name });
        doc && this.tagsDb.deleteDocumentByID(doc.id);
    }

    getTags() {
        return this.tagsDb.data.map(({ data: { name, color }}) => ({ name, color }));
    }

    // UI Management
    createUI(name, body = null, type = "normal", scriptevent, layout = 0) {
        const baseUI = {
            name,
            body,
            layout,
            type: type === "normal" ? 0 : -1,
            buttons: [],
            subuis: {},
            scriptevent
        };
        return this.db.insertDocument(baseUI);
    }

    createSubUI(name, body = null, type = "normal", scriptevent, layout = 0) {
        const ui = this.createUI(name, body, type, scriptevent, layout);
        ui.data.type = this.convertTypeToSubUI(ui.data.type);
        return ui;
    }

    // Button Management
    addButtonToUI(id, text, subtext = null, action = "", iconID = "", requiredTag) {
        const doc = this.getByID(id);
        if (!doc || doc.data.type !== 0) return;

        const newButton = {
            text,
            subtext,
            action,
            actions: [action],
            iconID,
            requiredTag
        };

        doc.data.buttons.push(newButton);
        this.db.overwriteDataByID(id, doc.data);
        this._autoSaveVersion(id);
        return true;
    }

    addActiontoButton(index, id, action) {
        const doc = this.getByID(id);
        if (!doc) return;

        const button = doc.data.buttons[index];
        if (!button) return;

        if (!button.actions) {
            button.actions = [button.action, action];
        } else {
            button.actions.push(action);
        }
        
        this.db.overwriteDataByID(id, doc.data);
        this._autoSaveVersion(id);
        return true;
    }

    // Utility methods
    convertTypeToSubUI(number) {
        return number ^ (1 << 7);
    }

    // State Management
    toggleState(state) {
        const currentValue = this.getState(state);
        this.setState(state, !currentValue);
    }

    setState(state, value) {
        this.uiState.set(state, value ? 1 : 0);
    }

    getState(state) {
        return this.uiState.has(state) ? this.uiState.get(state) === 1 : false;
    }

    // Existing methods that work well as-is
    deleteUI(id) { this.db.trashDocumentByID(id); }
    getTrash() { return this.db.getTrashedDocuments(); }
    untrash(id) { return this.db.untrashDocumentByID(id); }
    getByID(id) { return this.db.getByID(id); }
    getUIs() { return this.db.findDocuments({type: 0}); }
    open(id, player) {
        const doc = this.getByID(id);
        if (doc && (doc.data.type === 0 || doc.data.type === 1)) {
            normalForm.open(player, doc.data);
        }
    }

    // UI Validation
    validateUI(uiData) {
        const required = ['name', 'type', 'buttons'];
        const missing = required.filter(field => !uiData.hasOwnProperty(field));
        
        if (missing.length) {
            return {
                valid: false,
                error: `Missing required fields: ${missing.join(', ')}`
            };
        }

        if (!Array.isArray(uiData.buttons)) {
            return {
                valid: false,
                error: 'Buttons must be an array'
            };
        }

        return { valid: true };
    }

    // UI Cloning
    cloneUI(id, newName = null) {
        const sourceUI = this.getByID(id);
        if (!sourceUI) return null;

        const clonedData = JSON.parse(JSON.stringify(sourceUI.data));
        clonedData.name = newName || `${clonedData.name} (Copy)`;
        
        // Generate new scriptevent if exists
        if (clonedData.scriptevent) {
            clonedData.scriptevent = `${clonedData.scriptevent}_copy_${Date.now()}`;
        }

        return this.db.insertDocument(clonedData);
    }

    // Backup & Restore
    createBackup() {
        const timestamp = new Date().toISOString();
        const backup = {
            timestamp,
            version: '1.0',
            data: {
                uis: this.db.data,
                tabbed: this.tabbedDB.data,
                tags: this.tagsDb.data,
                states: Array.from(this.uiState.entries())
            }
        };

        // Store in a backups table
        const backupsDb = prismarineDb.table('ui_backups');
        return backupsDb.insertDocument(backup);
    }

    restoreBackup(backupId) {
        const backupsDb = prismarineDb.table('ui_backups');
        const backup = backupsDb.getByID(backupId);
        if (!backup) return false;

        // Restore all data
        this.db.clear();
        this.tabbedDB.clear();
        this.tagsDb.clear();
        
        backup.data.uis.forEach(ui => this.db.insertDocument(ui.data));
        backup.data.tabbed.forEach(tab => this.tabbedDB.insertDocument(tab.data));
        backup.data.tags.forEach(tag => this.tagsDb.insertDocument(tag.data));
        backup.data.states.forEach(([key, value]) => this.uiState.set(key, value));

        return true;
    }

    // Export/Import
    exportUI(id) {
        const ui = this.getByID(id);
        if (!ui) return null;

        return {
            version: '1.0',
            timestamp: new Date().toISOString(),
            ui: ui.data,
            dependencies: this.getUIDependencies(id)
        };
    }

    importUI(exportedData) {
        if (!exportedData.version || !exportedData.ui) {
            return { success: false, error: 'Invalid export data' };
        }

        const validation = this.validateUI(exportedData.ui);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // Import dependencies first if any
        if (exportedData.dependencies) {
            for (const dep of exportedData.dependencies) {
                this.db.insertDocument(dep);
            }
        }

        const imported = this.db.insertDocument(exportedData.ui);
        return { success: true, id: imported.id };
    }

    // Get UI dependencies (like sub-UIs)
    getUIDependencies(id) {
        const ui = this.getByID(id);
        if (!ui) return [];

        const dependencies = [];
        
        // Check subuis
        if (ui.data.subuis) {
            Object.values(ui.data.subuis).forEach(subId => {
                const subUI = this.getByID(subId);
                if (subUI) dependencies.push(subUI.data);
            });
        }

        return dependencies;
    }

    // Batch update buttons
    batchUpdateButtons(id, updates) {
        const ui = this.getByID(id);
        if (!ui) return false;

        updates.forEach(update => {
            const { index, ...changes } = update;
            if (index >= 0 && index < ui.data.buttons.length) {
                ui.data.buttons[index] = {
                    ...ui.data.buttons[index],
                    ...changes
                };
            }
        });

        this.db.overwriteDataByID(id, ui.data);
        return true;
    }

    // Search functionality
    searchUIs(query, options = {}) {
        const {
            searchInBody = false,
            searchInButtons = false,
            tags = [],
            caseSensitive = false
        } = options;

        return this.db.data.filter(ui => {
            if (!caseSensitive) {
                query = query.toLowerCase();
            }

            const name = caseSensitive ? ui.data.name : ui.data.name.toLowerCase();
            if (name.includes(query)) return true;

            if (searchInBody && ui.data.body) {
                const body = caseSensitive ? ui.data.body : ui.data.body.toLowerCase();
                if (body.includes(query)) return true;
            }

            if (searchInButtons) {
                return ui.data.buttons.some(button => {
                    const text = caseSensitive ? button.text : button.text.toLowerCase();
                    return text.includes(query);
                });
            }

            if (tags.length && ui.data.tags) {
                return tags.some(tag => ui.data.tags.includes(tag));
            }

            return false;
        });
    }

    // Version Control System
    initializeVersionControl() {
        this.versionsDb = prismarineDb.table('ui_versions');
    }

    // Internal method to automatically save versions
    _autoSaveVersion(id) {
        const ui = this.getByID(id);
        if (!ui) return null;

        const newVersion = this.versionsDb.insertDocument({
            uiId: id,
            timestamp: Date.now(),
            data: JSON.parse(JSON.stringify(ui.data))
        });

        // Automatically cleanup old versions after saving a new one
        this.cleanupVersions(id);

        return newVersion;
    }

    // Get version history for a UI
    getVersions(id) {
        return this.versionsDb.findDocuments({ uiId: id })
            .sort((a, b) => b.data.timestamp - a.data.timestamp)
            .map(version => ({
                id: version.id,
                timestamp: new Date(version.data.timestamp),
                preview: {
                    name: version.data.data.name,
                    buttonCount: version.data.data.buttons.length
                }
            }));
    }

    // Restore a specific version
    restoreVersion(versionId) {
        const version = this.versionsDb.getByID(versionId);
        if (!version) return false;

        // Save current state before restoring
        this._autoSaveVersion(version.data.uiId);

        // Restore the old version
        this.db.overwriteDataByID(version.data.uiId, version.data.data);
        return true;
    }

    // Get a specific version's full data
    getVersion(versionId) {
        const version = this.versionsDb.getByID(versionId);
        if (!version) return null;
        
        return {
            timestamp: new Date(version.data.timestamp),
            data: version.data.data
        };
    }

    // Clean up old versions (keep last X versions)
    cleanupVersions(id, keepCount = 25) {
        const versions = this.versionsDb.findDocuments({ uiId: id })
            .sort((a, b) => b.data.timestamp - a.data.timestamp);

        if (versions.length <= keepCount) return;

        const versionsToDelete = versions.slice(keepCount);
        versionsToDelete.forEach(version => {
            this.versionsDb.deleteDocumentByID(version.id);
        });
    }
}

export default new UIBuilder();