/*

 /\___/\
꒰ ˶• ༝ - ˶꒱
./づᡕᠵ᠊ᡃ࡚ࠢ࠘ ⸝່ࠡࠣ᠊߯᠆ࠣ࠘ᡁࠣ࠘᠊᠊°.~♡︎
"IM GONNA KILL YOU IF YOU BREAK THIS"
- Trashy

*/

import config from "../config";
import { ActionForm } from "../lib/form_func";
import { colors, prismarineDb } from "../lib/prismarinedb";
import actionParser from "./actionParser";
import normalForm from "./openers/normalForm";
import { system, ScriptEventSource, world } from '@minecraft/server';
import { array_move } from "./utils/array_move";
// yo what should we add uwu
// button categories
// tf would that even be useful for
// a ui that u can click on and it opens a sub ui kinda thing
// just open another ui from a button. why do you think i havent added that yet?
// yeah but its cool :(
// more bloat tho
// more coool tho and u add useless ass features like advanced chest ui
// advanced chest uis are not useless. u shouldve said ui folders or something
// ui folders are cool but i dont think i should add that
// i think i should add a ui that u can click on and it opens a sub ui kinda thing
// we need something new unique to leaf. rn its just ui builder, thats what everyone knows me for.
// idk anything that has not been done yet unless it is to do with ui builder
// whats something you cant make with commands kinda like uis
// hmm....
// message forms, forms forms forms
// most things that require a db
// an actually good kill system?
// SHUT
// give me good ideas
// voting system
// so kinda like polls from azalea? its kinda useless tbh
// someone suggested it for blo \ssom
// better warps?
// how would that work
// like more customization for waprs yk uwu
// how in the actually flippity dippity skibidi toilet ohio shit do u do that
// warp perms
// warp cooldown
// warp pussy pics
// these have all been done before
// in azalea yeah
// anywaays
// WE NEED IDEAS
// GET IDEAING
// ping everyone and force them to give us ideas or not skibidi
// https://discord.com/channels/922867041029984316/1323705508217098281
// add something from here
// oh
// pick something istg
// anticheat
// try coding an anticheat
// its hard
// fuck you
// im not doing that shit 😭
//ik
// im not either
//trading
//player warps
// idk
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// MORE IDEAS
// add pussy pics
// actually good ideas
// finish coding language
// i dont wana
// bitch
// lets do something else
// like make an acuaaalaly good ui for tpa
// go fuck yourself
// add withdraw command ui fucking idk
// add my ass cheeks - alr send a pic i'll add it to icon viewer
// im looking at channel btw
// add leaf:rng and it should save the rng to a random score for like the person who ran it or something
// example like leafrng:shittyscore 10 50
// so
// like /scoreboard players random
// is that a fucking thing
// yes 
// i never knew that 😭
// custom json ui builder
// nicknames
// roles
// proximity chat
// inventory see
// friends menu
// players ui (do leaf actions to players)
// idek
// where did u go
class UIBuilder {
    constructor() {
        this.initializeDatabases();
        this.initializeStates();
        this.setupScriptEventListener();
        this.addIdFieldToButtons();
        this.migrateOldButtonActions();
        this.initializeVersionControl();
        this.addExampleUI();
    }

    addExampleUI(){
        if(this.db.findFirst({scriptevent: "example-ui"})) return;
        if(this.getState("ExampleUI1")) return;
        this.setState("ExampleUI1", true);
        this.importUI({
            "version": "1.0",
            "timestamp": "2025-01-17T00:09:41.354Z",
            "ui": {
              "name": "Example UI",
              "body": "Welcome to leaf essentials UI builder!",
              "layout": 0,
              "type": 0,
              "buttons": [
                {
                  "text": "§bLight Blue",
                  "subtext": "I like this color",
                  "action": "/say I picked light blue!",
                  "actions": [
                    "/say I picked light blue!"
                  ],
                  "iconID": "leaf/image-0917",
                  "requiredTag": "",
                  "id": 0
                },
                {
                  "text": "§dPink",
                  "subtext": "Best color ever",
                  "action": "/say I love pink!",
                  "actions": [
                    "/say I love pink!"
                  ],
                  "iconID": "leaf/image-0955",
                  "requiredTag": "",
                  "id": 1
                },
                {
                  "text": "§cExplode",
                  "subtext": "Summon a TNT!",
                  "action": "/summon tnt",
                  "actions": [
                    "/summon tnt"
                  ],
                  "iconID": "leaf/image-083",
                  "requiredTag": "",
                  "id": 2
                },
                {
                  "text": "§6Fire",
                  "subtext": "Summon fire!",
                  "action": "particle azalea:redflame ~ ~ ~",
                  "actions": [
                    "particle minecraft:mobflame_single ~ ~ ~",
                    "particle minecraft:large_explosion ~ ~ ~",
                    "/setblock ~ ~ ~ fire",
                    "/playsound mob.blaze.shoot @s"
                  ],
                  "iconID": "leaf/image-550",
                  "requiredTag": "",
                  "id": 3
                }
              ],
              "subuis": {},
              "scriptevent": "example-ui",
              "lastID": 3
            },
            "dependencies": []
          })
    }

    addIdFieldToButtons(){
        for(const ui of this.db.data){
            if(ui.data.type !== 0) continue;
            for(let i = 0; i < ui.data.buttons.length; i++){
                ui.data.buttons[i].id = i
            }
            ui.data.lastID = ui.data.buttons.length - 1
            let index = this.db.data.findIndex(doc => doc.id == ui.id);
            this.db.data[index] = ui;
            this.db.save();
            // this.db.overwriteDataByID(ui.id, ui.data);
        }
    }

    setPinned(id, value){
        if(typeof value !== "boolean") return;
        const ui = this.getByID(id);
        if(!ui) return;
        ui.data.pinned = value;
        this.db.overwriteDataByID(id, ui.data);
    }

    lockUI(id) {
        const ui = this.getByID(id);
        if(!ui) return;
        ui.data.locked = true;
        this.db.overwriteDataByID(id, ui.data);
    }

    unlockUI(id) {
        const ui = this.getByID(id);
        if(!ui) return;
        ui.data.locked = false;
        this.db.overwriteDataByID(id, ui.data);
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
                if(ui && ui.data.locked) return;
                ui && this.open(ui.id, e.sourceEntity);
            }
        });

        system.runInterval(()=>{
                for(const ui of this.db.data){
                    if(!ui.data.scriptevent) continue;
                    if(!ui.data.useTagOpener) continue;
                    for(const player of world.getPlayers()){
                    if(player.hasTag(ui.data.scriptevent)){
                        player.removeTag(ui.data.scriptevent);
                        if(ui && ui.data.locked) return;
                        this.open(ui.id, player);
                    }
                }
            }
        }, 4)
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

    toggleUseTagOpener(id){
        const ui = this.getByID(id);
        if(!ui) return;
        ui.data.useTagOpener = ui.data.useTagOpener ? false : true;
        this.db.overwriteDataByID(id, ui.data);
        return true;
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

    createModalUI(name, scriptevent) {
        const baseUI = {
            name,
            type: 3,
            controls: []
        };
        return this.db.insertDocument(baseUI);
    }

wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww

    createSubUI(name, body = null, type = "normal", scriptevent, layout = 0) {
        const ui = this.createUI(name, body, type, scriptevent, layout);
        ui.data.type = this.convertTypeToSubUI(ui.data.type);
        return ui;
    }
    moveButtonInUI(id, direction, index){
        const doc = this.getByID(id);
        if(!doc) return;
        array_move(doc.data.buttons, index, direction == "up" ? index - 1 < 0 ? 0 : index - 1 : index + 1 >= doc.data.buttons.length ? doc.data.buttons.length - 1 : index + 1);
        this.db.overwriteDataByID(id, doc.data);
    }
    editButtonMeta(id, btnID, meta) {
        let doc = this.db.getByID(id);
        if(!doc) return;
        let index = doc.data.buttons.findIndex(button => button.id == btnID);
        if(index == -1) return;
        doc.data.buttons[index].meta = meta;
        this.db.overwriteDataByID(id, doc.data);
        this.db.save();
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
            requiredTag,
            id: doc.data.lastID ? doc.data.lastID + 1 : 0
        };

        doc.data.lastID = newButton.id;

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
    getModalUIs() { return this.db.findDocuments({type: 3}); }
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
        let containsConflictingNames = false;
        if (exportedData.dependencies) {
            for (const dep of exportedData.dependencies) {
                let newScripteventName = dep.scriptevent;
                if(this.db.findFirst({scriptevent: newScripteventName})) {
                    containsConflictingNames = true;
                    let i = 2;
                    while(this.db.findFirst({scriptevent: `${newScripteventName}~${i}`})){
                        i++;
                    }
                    newScripteventName = `${newScripteventName}~${i}`;
                }
                dep.scriptevent = newScripteventName;
                this.db.insertDocument(dep);
            }
        }
        // Section Symbol: §
        let newScripteventName = exportedData.ui.scriptevent;
        if(this.db.findFirst({scriptevent: newScripteventName})) {
            let i = 2;
            while(this.db.findFirst({scriptevent: `${newScripteventName}~${i}`})){
                i++;
            }
            newScripteventName = `${newScripteventName}~${i}`;
        }
        exportedData.ui.scriptevent = newScripteventName;
        const imported = this.db.insertDocument(exportedData.ui);
        return { success: true, id: imported.id, containsConflictingNames: containsConflictingNames };
    }

    // Get UI dependencies (like sub-UIs)
    getUIDependencies(id) {
        const ui = this.getByID(id);
        if (!ui) return [];

        const dependencies = [];

        for(const button of ui.data.buttons) {
            let reqUI = null;
            for(const action of button.actions) {
                if(action.replace('/', '').startsWith(`scriptevent ${config.scripteventNames.open} `)) {
                    reqUI = action.replace('/', '').replace(`scriptevent ${config.scripteventNames.open} `, '');
                    break;
                }
            }
            if(reqUI) {
                const reqUI = this.db.findFirst({scriptevent: reqUI});
                if(reqUI) dependencies.push(reqUI.data);
            }
        }
        
        // Check subuis
        if (ui.data.subuis) {
            Object.values(ui.data.subuis).forEach(subId => {
                const subUI = this.getByID(subId);
                if (subUI) dependencies.push(subUI.data);
            });
        }

        return dependencies;
    }
    duplicateUI(id){
        const ui = this.getByID(id);
        if(!ui) return;
        let data = JSON.parse(JSON.stringify(ui.data));
        let i = 2;
        while(this.db.findFirst({scriptevent: `${data.scriptevent}~${i}`})){
            i++;
        }
        data.scriptevent = `${data.scriptevent}~${i}`;
        return this.db.insertDocument(data);
    }
    // superscript 2: ²ww
    // circle symbol: ⚫
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