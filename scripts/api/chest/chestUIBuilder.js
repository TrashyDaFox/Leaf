import config from "../../config";
import { prismarineDb } from "../../lib/prismarinedb";
import icons from "../icons";
import chestUIOpener from "./chestUIOpener";
import common from "./common";
import { system, ScriptEventSource } from '@minecraft/server';
class ChestUIBuilder {
    constructor() {
        this.db = prismarineDb.table("Chests");
        this.validRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        system.afterEvents.scriptEventReceive.subscribe(e=>{
            if(e.sourceType == ScriptEventSource.Entity && e.id == config.scripteventNames.open) {
                let ui = this.db.findFirst({scriptevent: e.message});
                if(ui) chestUIOpener.open(ui.data, e.sourceEntity)
            }
        })
    }
    createChestGUI(title, scriptevent, rows = 3) {
        if(!this.validRows.includes(rows)) throw new Error("Row count is not valid.");
        return this.db.insertDocument({
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
            title,
            advanced: true,
            scriptevent,
            rows,
            icons: []
        });
    }
    editTitle(id, title) {
        let doc = this.db.getByID(id);
        if(!doc) throw new Error("UI not found");
        doc.data.title = title;
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    editScriptevent(id, scriptevent) {
        let doc = this.db.getByID(id);
        if(!doc) throw new Error("UI not found");
        doc.data.scriptevent = scriptevent;
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    editRows(id, rows) {
        let doc = this.db.getByID(id);
        if(!this.validRows.includes(rows)) throw new Error("Invalid row count.");
        if(!doc) throw new Error("UI not found");
        doc.data.scriptevent = scriptevent;
        this.db.overwriteDataByID(doc.id, doc.data);
    }
    deleteChestGUI(id) {
        this.db.trashDocumentByID(id);
    }
    addIconToChestGUI(id, row, col, iconID, name, lore = [], itemStackAmount = 1, action) {
        let chest = this.db.getByID(id);
        if(!chest) throw new Error("Chest UI not found");
        if(chest.data.advanced) throw new Error("Chest GUI cant be in advanced mode");
        let slot = common.rowColToSlotId(row, col);
        if(!iconID) throw new Error("Icon needs to be defined");
        if(!icons.resolve(iconID)) {
            throw new Error("Icon ID not valid");
        }
        if(!name) throw new Error("Name needs to be defined");
        if(!action) throw new Error("Action needs to be defined");
        if(chest.data.icons.find(_=>_.slot == slot)) throw new Error("There is already an icon at this slot");
        chest.data.icons.push({
            slot,
            iconID,
            name,
            action,
            lore,
            amount: itemStackAmount
        })
        this.db.overwriteDataByID(chest.id, chest.data);
    }
    replaceIconInChestGUI(id, row, col, iconID, name, lore = [], itemStackAmount = 1, action, index = 0) {
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
        if(!action) throw new Error("Action needs to be defined");
        if(chest.data.icons.find((_,i)=>_.slot == slot && i != index)) throw new Error("There is already an icon at this slot");
        chest.data.icons[index] = ({
            slot,
            iconID,
            name,
            lore,
            action,
            amount: itemStackAmount
        })
        this.db.overwriteDataByID(chest.id, chest.data);
    }
    addIconToChestGUIAdvanced(id, code) {
        let chest = this.db.getByID(id);
        if(!chest.data.advanced) throw new Error("Chest GUI must be in advanced mode");
        chest.data.icons.push(code);
        this.db.overwriteDataByID(chest.id, chest.data);
    }
    replaceIconInChestGUIAdvanced(id, code, index = 0) {
        let chest = this.db.getByID(id);
        if(!chest.data.advanced) throw new Error("Chest GUI must be in advanced mode");
        chest.data.icons[index] = code;
        this.db.overwriteDataByID(chest.id, chest.data);
    }
}

export default new ChestUIBuilder();