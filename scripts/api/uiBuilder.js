/*

 /\___/\
꒰ ˶• ༝ - ˶꒱
./づᡕᠵ᠊ᡃ࡚ࠢ࠘ ⸝່ࠡࠣ᠊߯᠆ࠣ࠘ᡁࠣ࠘᠊᠊°.~♡︎
"IM GONNA KILL YOU IF YOU BREAK THIS"
- Trashy

*/

import config from "../versionData";
import { ActionForm } from "../lib/form_func";
import { colors, prismarineDb } from "../lib/prismarinedb";
import actionParser from "./actionParser";
import normalForm from "./openers/normalForm";
import { system, ScriptEventSource, world } from '@minecraft/server';
import { array_move } from "./utils/array_move";
import modalForm from "./openers/modalForm";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import chestUIBuilder from "./chest/chestUIBuilder";
import common from "./chest/common";
import chestUIOpener from "./chest/chestUIOpener";
import icons from "./icons";
import pjXML from "../lib/pjxml";
import versionData from "../versionData";
import { dynamicToast } from "../lib/chatNotifs";
import sidebarEditor from "./sidebarEditor";
import eventsData from "../data/eventsData";
import { formatStr } from "./azaleaFormatting";
import { EventSerializer } from "./eventSerializerLeaf";
import scripting from "./scripting";
import { array, bool, boolean, number, object, string } from "../lib/yup.esm";

class UIBuilder {
    constructor() {
        this.validRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.internalUIs = [];
        this.leafEpoch = 1741909421689;
        this.db = prismarineDb.customStorage(config.tableNames.uis + "~new", SegmentedStoragePrismarine)
        this.initializeInvites();
        this.initializeDatabases();
        // this.initializeStates();
        this.setupScriptEventListener();
        this.addIdFieldToButtons();
        this.migrateOldButtonActions();
        this.migrateOldButtonActions220();
        this.initializeVersionControl();
        this.addExampleUI();
        this.migrateChestGUIs();
        this.createSnippetBook()
        this.initializeEvents();
        this.patternIDs = [
            {
                name: "NONE",
                texture: null,
                dispTexture: "textures/blocks/barrier"
            },
            {
                name: "SILVER",
                texture: "textures/blocks/glass_silver"
            },
            {
                name: "WHITE",
                texture: "textures/blocks/glass_white"
            },
            {
                name: "GRAY",
                texture: "textures/blocks/glass_gray"
            },
            {
                name: "LIME",
                texture: "textures/blocks/glass_lime"
            },
            {
                name: "GREEM",
                texture: "textures/blocks/glass_green"
            },
            {
                name: "BLACK",
                texture: "textures/blocks/glass_black"
            },
            {
                name: "CYAN",
                texture: "textures/blocks/glass_cyan"
            },
            {
                name: "MAGENTA",
                texture: "textures/blocks/glass_magenta"
            },
            {
                name: "BROWN",
                texture: "textures/blocks/glass_brown"
            },
            {
                name: "LIGHT_BLUE",
                texture: "textures/blocks/glass_light_blue"
            },
            {
                name: "LIGHT_BLUE",
                texture: "textures/blocks/glass_blue"
            },
            {
                name: "ORANGE",
                texture: "textures/blocks/glass_orange"
            },
            {
                name: "RED",
                texture: "textures/blocks/glass_red"
            },
            {
                name: "PINK",
                texture: "textures/blocks/glass_pink"
            },
            {
                name: "PURPLE",
                texture: "textures/blocks/glass_purple"
            }
        ]
        this.db.waitLoad().then(()=>{
            this.transitionSidebars();
            this.fixBtnIds()
            this.initializePluginSystem();
            this.initializeScripts();
        })
        this.schemas = new Map();
        this.ui_type_meta = new Map();
        this.registerSchema(0, object({
            type: number().required(),
            name: string().required(),
            buttons: array().of(object({
                type: string().optional().oneOf(["button", "header", "label", "divider"]),
                text: string().required(),
                subtext: string().optional(),
                action: string().optional(),
                actions: array().of(string().optional()),
                meta: string().optional(),
                sellButtonEnabled: boolean().optional(),
                buyButtonEnabled: boolean().optional(),
                buyButtonItem: string().matches(/^\d+:\d+$/).optional(),
                buyButtonPrice: number().optional(),
                buyButtonScoreboard: string().optional(),
                sellButtonItemCount: number().optional(),
                sellButtonItem: string().optional(),
                sellButtonPrice: number().optional(),
                sellButtonScoreboard: number().optional()
            })).required(),
            cancel: string().optional(),
            scriptevent: string().required(),
            body: string().optional(),
            scriptDeps: array().of(string()).optional(),
            clog_allow: boolean().optional(),
            layout: number().optional().min(0).max(5),
            theme: number().optional()
        }))
        this.registerMeta(0, {
            name: "Action Form",
            handleWarnings: (data)=> {
                let logs = [];
                if(this.db.findFirst({scriptevent: data.scriptevent})) {
                    logs.push(`§eClashing Action Form scriptevent§7: §f${data.scriptevent}`)
                }
                return logs;
            }
        })
    }
    registerMeta(type, meta) {
        this.ui_type_meta.set(type, meta)
    }
    initializeScripts() {
        for(const doc of this.db.findDocuments({type: 8})) {
            if(doc.data.disabled) continue;
            try {
                scripting.registerScript(doc.data.uniqueID, this.base64Decode(doc.data.code))
            } catch {}
        }
    }
    initializePluginSystem() {
        let event = new EventSerializer("key");
        // system.runInterval(()=>{
        //     event.send("key2", {message: "MEOW MRRP"})
        // }, 20)
    }
    registerSchema(type, schema) {
        this.schemas.set(type, schema)
    }
    execEvent(eventType, options) {
        for(const event of this.db.findDocuments({type: 10, eventType})) {
            let newTempOpts = {};
            for(const opt of eventsData[eventType].initOptions) {
                if(opt.type == "condition") {
                    newTempOpts[opt.name] = normalForm.playerIsAllowed(opt.player == "player1" ? options.player1 : options.player2, event.data.opts[opt.name])
                } else {
                    newTempOpts[opt.name] = event.data.opts[opt.name]
                }
            }
            let run = eventsData[eventType].runWhen ? eventsData[eventType].runWhen(newTempOpts, options) : true;
            if(run) {
                eventsData[eventType].run(event.data.opts, event.data.actions, options, event)
            }
        }
    }
    initializeInvites() {
        this.invites = {};
    }
    inviteCMD(origin, invite_type, invite_name, sender, receiver) {
        system.run(()=>{
            let doc = this.db.findFirst({identifier: invite_name, type: 11})
            if(!doc) return;
            let key = `${invite_name}_${sender.id}_${receiver.id}`;
            if(invite_type == "deny") {
                if(this.invites[key]) {
                    for(const action of doc.data.denyActions) {
                        actionParser.runAction(this.invites[key].receiver, formatStr(action, this.invites[key].receiver, {}, {
                            player2: this.invites[key].sender
                        }))
                    }
                    delete this.invites[key]
                }
            }
            if(invite_type == "accept") {
                if(this.invites[key]) {
                    for(const action of doc.data.acceptActions) {
                        actionParser.runAction(this.invites[key].receiver, formatStr(action, this.invites[key].receiver, {}, {
                            player2: this.invites[key].sender
                        }))
                    }
                    delete this.invites[key]
                }
            }

            if(invite_type == "send") {
                this.invites[key] = {
                    sender,
                    receiver,
                    invite_name
                }
                if(this.invites[key]) {
                    for(const action of doc.data.sendActions) {
                        actionParser.runAction(this.invites[key].receiver, formatStr(action, this.invites[key].receiver, {}, {
                            player2: this.invites[key].sender
                        }))
                    }
                }
                system.runTimeout(()=>{
                    if(this.invites[key]) {
                        for(const action of doc.data.expireActions) {
                            actionParser.runAction(this.invites[key].receiver, formatStr(action, this.invites[key].receiver, {}, {
                                player2: this.invites[key].sender
                            }))
                        }
                        delete this.invites[key]
                    }
                },doc.data.expirationTime)
            }
        })
    }
    createNewInvite(identifier, expirationTime = 20 * 60) {
        if(this.db.findFirst({type: 11, identifier})) return;
        return this.db.insertDocument({
            type: 11,
            identifier,
            expirationTime,
            denyActions: [],
            expireActions: [],
            sendActions: [],
            acceptActions: []
        })
    }
    initializeEvents() {
        for(let i = 0;i < eventsData.length;i++) {
            let event = eventsData[i]
            event.setup((opts)=>{
                this.execEvent(i, opts)
            })
        }
    }
    transitionSidebars() {
        sidebarEditor.db.waitLoad().then(()=>{
            let sidebars = sidebarEditor.db.findDocuments({_type: "SIDEBAR"})
            console.warn(sidebars.length)
            let i = 0;
            for(const sidebar of sidebars) {
                if(sidebar.data.transition1) continue;
                // if(this.db.findFirst({transitionedFrom: sidebar.id})) continue;
                i++;
                // _type: "SIDEBAR",
                // _name: name, 
                // developer chats
                // remember the lag? from azalea and how its rep got ruined
                // yeah, how could i forget?
                // thats why i rewrote it
                // lines: [] 
    
                this.db.insertDocument({
                    type: 7,
                    name: sidebar.data._name,
                    lines: sidebar.data.lines,
                    transitioned: true,
                    transitionedFrom: sidebar.id,
                    isDefaultSidebar: i == 1 ? true : false
                })
                sidebar.data.transition1 = true;
                sidebarEditor.db.overwriteDataByID(sidebar.id, sidebar.data)
            }
    
        })
    }
    base64Decode(input) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let output = '';
        let buffer = '';
        
        // Remove padding from the Base64 string
        input = input.replace(/=+$/, '');
        
        // Process each Base64 character
        for (let i = 0; i < input.length; i++) {
            let char = input.charAt(i);
            let base64Index = chars.indexOf(char);
    
            // Convert the Base64 character to 6 bits and append to buffer
            if (base64Index !== -1) {
                buffer += base64Index.toString(2).padStart(6, '0');
            }
        }
    
        // Convert the bits back to characters (8 bits per character)
        while (buffer.length >= 8) {
            let byte = parseInt(buffer.slice(0, 8), 2);
            output += String.fromCharCode(byte);
            buffer = buffer.slice(8); // Remove the first 8 bits processed
        }
    
        return output;
    }
    
    base64Encode(input) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let output = '';
        let buffer = '';
        
        for (let i = 0; i < input.length; i++) {
            // Get the ASCII value of the character at position i
            let byte = input.charCodeAt(i);
            
            // Append the 8-bit byte to the buffer (in binary format)
            buffer += byte.toString(2).padStart(8, '0');
            
            // If we have enough bits to form a Base64 value (6 bits)
            while (buffer.length >= 6) {
                let base64Index = parseInt(buffer.slice(0, 6), 2);
                output += chars[base64Index];
                buffer = buffer.slice(6); // Remove the first 6 bits processed
            }
        }
        
        // If there are any leftover bits in the buffer, pad with 0s
        if (buffer.length > 0) {
            buffer = buffer.padEnd(6, '0');
            let base64Index = parseInt(buffer, 2);
            output += chars[base64Index];
        }
    
        // Add padding ('=') to make the length of the string a multiple of 4
        while (output.length % 4 !== 0) {
            output += '=';
        }
    
        return output;
    }
    createWarp(name, loc, rot) {
        this.db.insertDocument({
            type: 12,
            name,
            loc,
            rot,
            requiredTag: ""
        })
    }
    createSidebar(name) {
        if(this.db.findFirst({type: 7, name})) return;
        this.db.insertDocument({
            type: 7,
            name: name,
            lines: [],
            transitioned: false,
            isDefaultSidebar: !this.db.findFirst({isDefaultSidebar: true}) ? true : false
        })
    }
    migrateOldButtonActions220() {
        // for(const doc of this.db.data) {
        //     doc.data.actionsv2 = doc.data.actions.map(_=>{
        //         return {
        //             action: _,
        //         }
        //     })
        // }
    }
    migrateChestGUIs() {
        // return;
        this.db.waitLoad().then(()=>{
            if(this.getState("ChestMigrationV1")) return;

            let docs = this.db.findDocuments({type: 4});
    
            for(const doc of docs) {
                this.db.deleteDocumentByID(doc.id)
            }
    
            for(const data of chestUIBuilder.db.data) {
                this.db.insertDocument({
                    type: 4,
                    ...data.data
                })
            }
    
            this.setState("ChestMigrationV1", true)
        })

    }
    createChestGUI(title, scriptevent, rows = 3) {
        if(!this.validRows.includes(rows)) throw new Error("Row count is not valid.");
        return this.db.insertDocument({
            type: 4,
            title,
            advanced: false,
            scriptevent,
            rows,
            icons: []
        }); 
    }
    createAdvancedChestGUI(title, scriptevent, rows = 3) {
        if(!this.validRows.includes(rows)) throw new Error("Row count is not valid.");
        return this.db.insertDocument({
            type: 4,
            title,
            advanced: true,
            scriptevent,
            rows,
            icons: []
        });
    }
    addIconToChestGUI(id, row, col, iconID, name, lore = [], itemStackAmount = 1, action, extraData = {}) {
        let chest = this.db.getByID(id);
        if(!chest) throw new Error("Chest UI not found");
        if(chest.data.advanced) throw new Error("Chest GUI cant be in advanced mode");
        let slot = common.rowColToSlotId(row, col);
        if(!iconID) throw new Error("Icon needs to be defined");
        if(!icons.resolve(iconID)) {
            throw new Error("Icon ID not valid");
        }
        if(!name) throw new Error("Name needs to be defined");
        if(!action && !extraData.buyButtonEnabled && !extraData.sellButtonEnabled) throw new Error("Action needs to be defined");
        if(chest.data.icons.find(_=>_.slot == slot)) throw new Error("There is already an icon at this slot");
        chest.data.icons.push({
            slot,
            iconID,
            name,
            action,
            actions: [action],
            lore,
            amount: itemStackAmount,
            ...extraData
        })
        this.db.overwriteDataByID(chest.id, chest.data);
    }
    replaceIconInChestGUI(id, row, col, iconID, name, lore = [], itemStackAmount = 1, action, index = 0, extraData = {}) {
        let chest = this.db.getByID(id);
        if(!chest) throw new Error("Chest UI not found");
        if(chest.data.advanced) throw new Error("Chest GUI cant be in advanced mode");
        let slot = common.rowColToSlotId(row, col);
        if(!iconID) throw new Error("Icon needs to be defined");
        if(!icons.resolve(iconID)) {
            throw new Error("Icon ID not valid");
        }
        if(index >= chest.data.icons.length || index < 0) throw new Error("Item out of range");
        if(!name) throw new Error("Name needs to be defined");
        if(!action && !extraData.buyButtonEnabled && !extraData.sellButtonEnabled) throw new Error("Action needs to be defined");
        if(chest.data.icons.find((_,i)=>_.slot == slot && i != index)) throw new Error("There is already an icon at this slot");
        chest.data.icons[index] = ({
            slot,
            iconID,
            name,
            lore,
            action,
            actions: chest.data.icons[index].actions ? chest.data.icons[index].actions : [action],
            amount: itemStackAmount,
            ...extraData
        })
        this.db.overwriteDataByID(chest.id, chest.data);
    }
    addIconToChestGUIAdvanced(id, code) {
        let chest = this.db.getByID(id);
        if(!chest.data.advanced) throw new Error("Chest GUI must be in advanced mode");
        chest.data.icons.push(code);
        this.db.overwriteDataByID(chest.id, chest.data);
    }
    setPatternSlot(id, slot, colID) {
        let chest = this.db.getByID(id);
        if(chest.data.type != 4) return;
        if(!chest.data.patterns) chest.data.patterns = [];
        let index = chest.data.patterns.findIndex(_=>_[0] == slot)
        if(index > -1) {
            if(colID == 0) {
                chest.data.patterns.splice(index, 1)
                return;
            }
            chest.data.patterns[index] = [slot, colID]
        } else {
            if(colID != 0) chest.data.patterns.push([slot, colID])
        }
        this.db.overwriteDataByID(chest.id, chest.data)
    }
    replaceIconInChestGUIAdvanced(id, code, index = 0) {
        let chest = this.db.getByID(id);
        if(!chest.data.advanced) throw new Error("Chest GUI must be in advanced mode");
        chest.data.icons[index] = code;
        this.db.overwriteDataByID(chest.id, chest.data);
    }
    addExampleUI(){
        return;
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
            if(ui.data.type == 3) {
                for(let i = 0; i < ui.data.controls.length; i++){
                    ui.data.controls[i].id = i
                }
                ui.data.lastID = ui.data.controls.length - 1
                if(!ui.data.scriptevent) ui.data.scriptevent = "n/a"
                let index = this.db.data.findIndex(doc => doc.id == ui.id);
                this.db.data[index] = ui;
                this.db.save();
            }
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

    async initializeDatabases() {
        this.db1 = prismarineDb.table(config.tableNames.uis);
        system.run(()=>{

            let flag = world.getDynamicProperty("TRANSITIONSHIT")
            if(!flag) {
                for(const doc of this.db1.data) {
                    this.db.data.push(doc);
                    this.db.save();
                }
                world.setDynamicProperty("TRANSITIONSHIT", true)

            }
        })
        this.uiState = await this.db.keyval("state");
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
        this.db.waitLoad().then(res=>{
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
        })
    }

    setupScriptEventListener() {
        system.afterEvents.scriptEventReceive.subscribe(e => {
            if (e.sourceType === ScriptEventSource.Entity && e.id === config.scripteventNames.open) {
                let a = e.message.replace(/\[.*?\]/g, "").trim()
                let test2 = a == "default_sidebar" ? this.db.findFirst({isDefaultSidebar: true}) : this.db.findFirst({ name: a, type: 7 })
                if(test2) {
                    for(const tag of e.sourceEntity.getTags()) {
                        if(tag.startsWith('sidebar:')) {
                            e.sourceEntity.removeTag(tag)
                        }
                    }
                    e.sourceEntity.addTag(`sidebar:${test2.data.name}`)
                    return;
                }
                let internal = this.internalUIs.find(_=>_.scriptevent == e.message.replace(/\[.*?\]/g, "").trim())
                let test = this.db.findFirst({ scriptevent: e.message.replace(/\[.*?\]/g, "").trim(), internal: true })
                const ui = internal ? {data: internal} : test ? test : this.db.findFirst({ scriptevent: e.message.replace(/\[.*?\]/g, "").trim() });
                if(ui && ui.data.locked) return;
                let args = [];
                let argsRaw = [...e.message.matchAll(/\[(.*?)\]/g)].map(_=> _[1])
                for(const arg of argsRaw) {
                    args.push(arg)
                }
                ui && this.open(ui, e.sourceEntity, ...args);
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
            switch(ui.data.type) {
                case 0:
                    for (const button of ui.data.buttons) {
                        if(!button.iconOverrides) {
                            button.iconOverrides = [];
                        }
                        if(!button.displayOverrides) {
                            button.displayOverrides = [];
                        }
                        if (!button.actions || !button.actions.length) {
                            button.actions = [button.action];
                            this.db.save();
                        }
                    }
                    break;
                case 4:
                    for(const icon of ui.data.icons) {
                        if(!icon.actions || !icon.actions.length) {
                            icon.actions = [icon.action];
                            this.db.save();
                        }
                    }
                    break;
            }
        }
    }
    addIconOverride(id, btnID, iconID, condition, index = -1) {
        let doc = this.db.getByID(id);
        if(!doc) return;
        let index2 = doc.data.buttons.findIndex(button => button.id == btnID);
        if(index2 == -1) return;
        if(index == -1) {
            doc.data.buttons[index2].iconOverrides.push({condition, iconID})
        } else {
            doc.data.buttons[index2].iconOverrides[index].iconID = iconID;
            doc.data.buttons[index2].iconOverrides[index].condition = condition;
        }
        this.db.overwriteDataByID(id, doc.data);
        this.db.save();
    }
    migrateOldActionsFormat() {
        for(const ui of this.db.data) {
            if(ui.data.type !== 0) continue;
            for(const button of ui.data.buttons) {
                for(let i = 0;i < button.actions.length;i++) {
                    if(typeof button.actions[i] !== "string") continue;
                    let newData = {
                        action: button.actions[i],
                        id: Date.now(),
                        condition: ""
                    }
                    button.actions[i] = newData;
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
    createSnippetBook() {
        this.db.waitLoad().then(()=>{
            let ui = this.db.findFirst({type: 5});
            // this.db.deleteDocumentByID(ui.id)
            if(ui) return;
            const baseUI = {
                name: "Snippet Book",
                body: "Welcome to snippet book!",
                layout: 4,
                type: 5,
                buttons: [],
                subuis: {}
            };
            this.db.insertDocument(baseUI)
        })
    }
    getSnippetBook() {
        return this.db.findFirst({type: 5})
    }
    // UI Management
    createUI(name, body = null, type = "normal", scriptevent, layout = 0, extra = {}) {
        const baseUI = {
            name,
            body,
            layout,
            type: type === "normal" ? 0 : -1,
            buttons: [],
            subuis: {},
            scriptevent,
            ...extra
        };
        return this.db.insertDocument(baseUI);
    }

    createToast(name, scriptevent, hideTitleInNotification = false) {
        const baseUI = {
            type: 6,
            name,
            body: "",
            icon: "",
            scriptevent,
            hideTitleInNotification
        }
        this.db.insertDocument(baseUI)
    }

    createModalUI(name, scriptevent) {
        const baseUI = {
            name,
            scriptevent,
            type: 3,
            controls: []
        };
        return this.db.insertDocument(baseUI);
    }

    createSubUI(name, body = null, type = "normal", scriptevent, layout = 0) {
        const ui = this.createUI(name, body, type, scriptevent, layout);
        ui.data.type = this.convertTypeToSubUI(ui.data.type);
        return ui;
    }
    moveButtonInUI(id, direction, index){
        const doc = this.getByID(id);
        if(!doc) return;
        let newIndex = direction == "up" ? index - 1 < 0 ? 0 : index - 1 : index + 1 >= doc.data.buttons.length ? doc.data.buttons.length - 1 : index + 1
        array_move(doc.data.buttons, index, newIndex);
        this.db.overwriteDataByID(id, doc.data);
        return newIndex;
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
    editConditionalAction(id, btnID, bool) {
        let doc = this.db.getByID(id);
        if(!doc) return;
        let index = doc.data.buttons.findIndex(button => button.id == btnID);
        if(index == -1) return;
        doc.data.buttons[index].conditionalActions = bool;
        console.warn(JSON.stringify(doc.data))
        this.db.overwriteDataByID(id, doc.data);
        this.db.save();

    }
    // Button Management
    addButtonToUI(id, text, subtext = null, action = "", iconID = "", requiredTag, extra = {}) {
        const doc = this.getByID(id);
        if (!doc) return;

        const newButton = {
            text,
            subtext,
            action,
            actions: [action],
            iconID,
            iconOverrides: [],
            requiredTag,
            ...extra,
            // id: doc.data.lastID != null ? doc.data.lastID + 1 : 0,
            id: Date.now() - this.leafEpoch,
        };

        // doc.data.lastID = newButton.id;

        doc.data.buttons.push(newButton);
        this.db.overwriteDataByID(id, doc.data);
        // this._autoSaveVersion(id);
        return true;
    }

    addActiontoButton(index, id, action) {
        const doc = this.getByID(id);
        if (!doc) return;

        if(doc.data.type === 0) {
            const button = doc.data.buttons[index];
            if (!button) return;

            if (!button.actions) {
                button.actions = [button.action, action];
            } else {
                button.actions.push(action);
            }
        } else if(doc.data.type == 4) {
            const icon = doc.data.icons[index];
            if(!icon) return;
            if(!icon.actions) {
                icon.actions = [icon.action, action];
            } else {
                icon.actions.push(action);
            }

        }
        this.db.overwriteDataByID(id, doc.data);
        // this._autoSaveVersion(id);
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
    open(doc, player, ...args) {
        if (doc && (doc.data.type === 0 || doc.data.type === 1)) {
            normalForm.open(player, doc.data, ...args);
        }
        if(doc && doc.data.type == 3) {
            modalForm.open(player, doc, ...args)
        }
        if(doc && doc.data.type == 4) {
            chestUIOpener.open(doc.data, player, ...args);
        }
        if(doc && doc.data.type == 6) {
            let extraVars = {};
            for(let i = 0;i < args.length;i++) {
                extraVars[`$${i+1}`] = args[i]
            }
            player.sendMessage(dynamicToast(doc.data.hideTitleInNotification ? "" : doc.data.name, formatStr(doc.data.body ? doc.data.body : "", player, extraVars), doc.data.icon ? icons.resolve(doc.data.icon) : null))
        }
    }
    
    createCommand(label, commandName, description = "", category = "", requiredTag = "") {
        if(this.db.findFirst({command: commandName})) return;
        return this.db.insertDocument({
            type: 9,
            name: label,
            command: commandName,
            description,
            category,
            requiredTag,
            actions: [], // lets hope this does not end up like azalea
            subcommands: []
        })
    }

    createSubcommand(parent, commandName, description, requiredTag) {
        let doc = this.db.findFirst({command: parent});
        if(!doc) return;
        if(doc.data.subcommands.find(_=>_.name == commandName)) return;
        doc.data.subcommands.push({
            name: commandName,
            description,
            requiredTag,
            actions: []
        })
        this.db.overwriteDataByID(doc.id, doc.data);
    }

    getCommandActions(commandName, subcommand = "") {
        let doc = this.db.findFirst({command: commandName});
        if(!doc) return [];
        if(!subcommand) return doc.data.actions;
        let subcommand2 = doc.data.subcommands.find(_=>_.name == commandName)
        return subcommand2 ? subcommand2.actions : doc.data.actions;
    }

    getSubcommandIndex(commandName, subcommand = "") {
        let doc = this.db.findFirst({command: commandName});
        if(!doc) return -1;
        if(!subcommand) return -1;
        let subcommand2 = doc.data.subcommands.findIndex(_=>_.name == commandName)
        return subcommand2;
    }

    addCommandAction(commandName, command, formatted = true, subcommnand = "") {
        let doc = this.db.findFirst({command: commandName});
        if(!doc) return;
        let index = this.getSubcommandIndex(command, subcommnand)
        if(index > -1) {
            doc.data.subcommands[index].actions.push({type: "command", command, formatted})
        } else {
            doc.data.actions.push({type: "command", command, formatted})
        }
        this.db.overwriteDataByID(doc.id, doc.data);
    }

    addConditionalBreak(commandName, command, condition, subcommnand = "") {
        let doc = this.db.findFirst({command: commandName});
        if(!doc) return;
        let index = this.getSubcommandIndex(command, subcommnand)
        if(index > -1) {
            doc.data.subcommands[index].actions.push({type: "command", command, condition})
        } else {
            doc.data.actions.push({type: "command", command, condition})
        }
        this.db.overwriteDataByID(doc.id, doc.data);
    }

    createScript(uniqueID) {
        // if(env < 0 || env >= scriptEnvTypes.length) return false;
        this.db.insertDocument({
            type: 8,
            uniqueID,
            code: this.base64Encode(`// Put your code here`)
        })
        return true;
    }
    getAllUIs2() {
        let uis = [];
        for(const ui of this.db.data) {
            if([0,3,4].includes(ui.data.type)) uis.push(ui)
        }
        return uis;
    }

    getAllUIs() {
        let uis = [];
        for(const ui of this.db.data) {
            if([0,3,4,6,7,8,9,10,11,12].includes(ui.data.type)) uis.push(ui)
        }
        return uis;
    }
    deleteChestGUI(id) {
        this.db.trashDocumentByID(id);
    }
    // UI Validation
    validateUI(uiData) {
        const required = [uiData.type == 4 ? 'title' : 'name', 'type', uiData.type == 4 ? 'icons' : uiData.type == 3 ? 'controls' : 'buttons'];
        const missing = required.filter(field => !uiData.hasOwnProperty(field));
        
        if (missing.length) {
            return {
                valid: false,
                error: `Missing required fields: ${missing.join(', ')}`
            };
        }

        if (!Array.isArray(uiData[uiData.type == 3 ? 'controls' : uiData.type == 4 ? 'icons' : 'buttons'])) {
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
    mixArrays(arr1, arr2) {
        // Create a map to store objects by their ID
        const idMap = new Map();
    
        // Add all objects from arr1 into the map (original array)
        arr1.forEach(obj => {
            idMap.set(obj.id, obj);
        });
    
        // Iterate through arr2 and update the map, overriding any duplicate IDs
        arr2.forEach(obj => {
            idMap.set(obj.id, obj);  // This will overwrite if the id already exists
        });
    
        // Convert the map back to an array
        return Array.from(idMap.values());
    }
    addInternalUI(doc) {
        if(this.db.findFirst({scriptevent: doc.scriptevent, internalID: versionData.versionInfo.versionInternalID})) return;
        let doc2 = this.db.findFirst({scriptevent: doc.scriptevent, internal: true}); 
        let data = {
            ...doc,
            original: doc,
            internal: true,
            internalID: versionData.versionInfo.versionInternalID
        }
        if(doc2) {
            // if(doc.type == 0) {
            //     data.buttons = this.mixArrays(doc.buttons, doc2.data.buttons)
            // }
            // data.theme = doc2.data.theme ? doc2.data.theme : 0;
            this.db.overwriteDataByID(doc2.id, data)

        } else {
            this.db.insertDocument(data)

        }
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

        // Import dependencies first if anys
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
        if(ui.data.type != 0) return []
        const dependencies = [];

        for(const button of ui.data.buttons) {
            let reqUI = null;
            for(const action of button.actions) {
                if(action.replace('/', '').startsWith(`scriptevent ${config.scripteventNames.open} `)) {
                    reqUI = action.replace('/', '').replace(`scriptevent ${config.scripteventNames.open} `, '');
                    break;
                }
            }
            if(reqUI && reqUI != ui.data.scriptevent) {
                const reqUI2 = this.db.findFirst({scriptevent: reqUI});
                if(reqUI2) dependencies.push(reqUI2.data);
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
    fixBtnIds() {
        for(const doc of this.db.findDocuments({type: 0})) {
            try {
                let usedIDs = [];
                let allIDs = doc.data.buttons.map(_=>_.id)
                allIDs.sort((a,b)=>b - a)
                let pp = 10;
                for(const button of doc.data.buttons) {
                    if(usedIDs.includes(button.id)) {
                        button.id = allIDs[0] + pp;
                        pp += 10;
                    }
                    usedIDs.push(button.id)
                }
            } catch {}
        }
        this.db.save();

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
        // const ui = this.getByID(id);
        // if (!ui) return null;

        // const newVersion = this.versionsDb.insertDocument({
        //     uiId: id,
        //     timestamp: Date.now(),
        //     data: JSON.parse(JSON.stringify(ui.data))
        // });

        // // Automatically cleanup old versions after saving a new one
        // this.cleanupVersions(id);

        // return newVersion;
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
        // this._autoSaveVersion(version.data.uiId);

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

    addButtonGroupToUI(id, buttonRow = false) {
        const doc = this.getByID(id);
        if (!doc) return;

        const newGroup = {
            type: "group",
            buttons: [],
            buttonRow: buttonRow,
            id: doc.data.lastID != null ? doc.data.lastID + 1 : 0
        };

        doc.data.lastID = newGroup.id;
        doc.data.buttons.push(newGroup);
        this.db.overwriteDataByID(id, doc.data);
        return true;
    }

    addButtonToGroup(id, groupIndex, buttonData) {
        const doc = this.getByID(id);
        if (!doc) {
            console.warn(`No document found with ID ${id}`);
            return;
        }

        // Debug log the buttons array
        console.warn(`Total buttons: ${doc.data.buttons.length}`);
        console.warn(`Attempting to add to group at index ${groupIndex}`);

        const group = doc.data.buttons[groupIndex];
        if (!group || group.type !== "group") {
            console.warn(`Invalid group at index ${groupIndex}. Found: ${JSON.stringify(group)}`);
            return;
        }

        // Initialize buttons array if it doesn't exist
        if (!group.buttons) {
            group.buttons = [];
        }

        // Create new button with proper ID
        const newButton = {
            ...buttonData,
            id: doc.data.lastID + 1,
            actions: buttonData.action ? [buttonData.action] : buttonData.actions || []
        };

        doc.data.lastID = newButton.id;
        group.buttons.push(newButton);
        
        // Debug log
        console.warn(`Added button to group ${groupIndex}, now has ${group.buttons.length} buttons`);
        
        this.db.overwriteDataByID(id, doc.data);
        this.db.save(); // Force save to ensure changes persist
        return true;
    }

    addControllerToUI(id, namespace, name) {
        let ui = this.db.getByID(id);
        if(!ui) return;
        if(!ui.data.controllers) ui.data.controllers = [];
        ui.data.controllers.push({
            namespace,
            name,
            code: `<controller>\n\n</controller>`
        })
        this.db.overwriteDataByID(ui.id, ui.data)
    }

    getButtonFlags(id) {
        let ui = this.db.getByID(id);
        if(!ui) return;
        if(!ui.data.controllers) ui.data.controllers = [];
        let names = [];
        for(const controller of ui.data.controllers) {
            try {
                let xml = pjXML.parse(controller.code);
                let things = xml.selectAll('controller/button_flag')
                for(const thing of things) {
                    let name = thing.select('name').text();
                    names.push(`${controller.namespace}:${name}`)
                }
            } catch {}
        }
        return names;
    }

    moveButtonInGroup(id, groupIndex, buttonIndex, direction) {
        const doc = this.getByID(id);
        if (!doc) return;

        const group = doc.data.buttons[groupIndex];
        if (!group || group.type !== "group") return;

        const newIndex = direction === "left" || direction === "up" ? 
            buttonIndex - 1 : buttonIndex + 1;
        
        if (newIndex < 0 || newIndex >= group.buttons.length) return;

        // Swap buttons
        const temp = group.buttons[buttonIndex];
        group.buttons[buttonIndex] = group.buttons[newIndex];
        group.buttons[newIndex] = temp;

        this.db.overwriteDataByID(id, doc.data);
        return newIndex;
    }

    setFolder(id, name) {
        let ui = this.db.getByID(id);
        if(!ui) return;
        let folder = this.db.findFirst({type: 2, name})
        if(!folder) return;
        ui.data.folder = folder.id;
        this.db.overwriteDataByID(ui.id, ui.data)
    }

    createFolder(name) {
        let doc = this.db.findFirst({name, type: 2})
        if(doc) return doc.id;
        return this.db.insertDocument({
            type: 2,
            name,
            color: ""
        })
    }
}

export let scriptEnvTypes = ["ChestUI", "ActionUI", "ActionUI/Button", "ModalUI", "ModalUI/Control"]

export default new UIBuilder();