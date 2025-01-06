import config from "../config";
import { ActionForm } from "../lib/form_func";
import { colors, prismarineDb } from "../lib/prismarinedb";
import actionParser from "./actionParser";
import normalForm from "./openers/normalForm";
import { system, ScriptEventSource } from '@minecraft/server';
import { array_move } from "./utils/array_move";

class UIBuilder {
    constructor() {
        this.db = prismarineDb.table(config.tableNames.uis);
        this.uiState = this.db.keyval("state");
        this.tabbedDB = prismarineDb.table("TabbedUI_DB")
        this.setState("ActionsV2Experiment", true);
        this.setState("UIStateEditor", true);
        this.setState("FormFolders", true);
        this.setState("UISearch", true);
        this.setState("UITags", true);
        this.setState("BuiltinTemplates", true);
        this.setState("PlayerContentManager", true);
        this.setState("SubUIs", true);
        system.afterEvents.scriptEventReceive.subscribe(e=>{
            if(e.sourceType == ScriptEventSource.Entity && e.id == config.scripteventNames.open) {
                let ui = this.db.findFirst({scriptevent: e.message});
                if(ui) {
                    this.open(ui.id, e.sourceEntity);
                }
            }
        })
        this.tagsDb = prismarineDb.table(`${config.tableNames.uis}~tags`)
    }
    createTag(name, color) {
        if(colors.getColorCodes().includes(color)) {
            if(this.tagsDb.findFirst({name})) return false;
            this.tagsDb.insertDocument({
                name,
                color
            })
            return true;
        }
    }
    deleteTag(name) {
        let doc = this.tagsDb.findFirst({name});
        if(doc) this.tagsDb.deleteDocumentByID(doc.id)
    }
    getTags() {
        return this.tagsDb.data.filter(_=>{
            return {
                name: _.data.name,
                color: _.data.color
            }
        })
    }
    deleteUI(id) {
        this.db.trashDocumentByID(id);
    }
    getTrash() {
        return this.db.getTrashedDocuments()
    }
    untrash(id) {
        return this.db.untrashDocumentByID(id);
    }
    getByID(id) {
        return this.db.getByID(id);
    }
    createUI(name, body = null, type = "normal", scriptevent, layout = 0) {
        return this.db.insertDocument({
            name,
            body,
            layout,
            type: type == "normal" ? 0 : -1,
            buttons: [],
            subuis: {},
            scriptevent
        })
    }
    convertTypeToSubUI(number) {
        const bitPosition = 7;
        const mask = 1 << bitPosition;
        return number ^ mask;
    }
    createSubUI(name, body = null, type = "normal", scriptevent, layout = 0) {
        return this.db.insertDocument({
            name,
            body,
            layout,
            type: this.convertTypeToSubUI(type == "normal" ? 0 : -1),
            buttons: [],
            subuis: {},
            scriptevent,
        })
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
    addButtonToUI(id, text, subtext = null, action = "", iconID = "", requiredTag) {
        let doc = this.getByID(id);
        if(!doc) return;
        if(doc.data.type != 0) return;
        doc.data.buttons.push({
            text,
            subtext,
            actions: [action],
            iconID,
            requiredTag
        });
        this.db.overwriteDataByID(id, doc.data);
    }
    addActiontoButton(index, id, action) {
        let doc = this.getByID(id)
        if(!doc) return;
        let button = doc.data.buttons[index]
        if(!button) return;
        if(!button.actions) return button.actions = [button.action, action], this.db.overwriteDataByID(id, doc.data);
        if(button.actions) button.actions.push(action);
        this.db.overwriteDataByID(id, doc.data)
    }
    removeActionFromButton(index, id, actionIndex) {
        let doc = this.getByID(id)
        if(!doc) return;
        let button = doc.data.buttons[index]
        if(!button) return;
        button.actions.splice(actionIndex, 1)
        this.db.overwriteDataByID(id, doc.data)
    }
    open(id, player) {
        let doc = this.getByID(id);
        if(!doc) return;
        if(doc.data.type == 0 || doc.data.type == 1) return normalForm.open(player, doc.data);
    }
    getUIs() {
        return this.db.findDocuments({type:0});
    }
    moveButtonInUI(id, type = "up", index = 0) {
        let doc = this.getByID(id);
        if(!doc) return;
        if(doc.data.type != 0) return;
        if(index >= doc.data.buttons.length) return;
        if(index < 0) return;
        if(type == "up" && index - 1 < 0) return;
        if(type == "down" && index + 1 >= doc.data.buttons.length) return;
        array_move(doc.data.buttons, index, type == "up" ? index - 1 : index + 1);
        this.db.overwriteDataByID(id, doc.data);
    }
}
export default new UIBuilder();