import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import zones from "./zones";
import { formatStr } from "./azaleaFormatting";
import uiBuilder from "./uiBuilder";
import homes from "./homes";
import OpenClanAPI from "./OpenClanAPI";
import icons from "./icons";
import { prismarineDb } from "../lib/prismarinedb";
import actionParser from "./actionParser";
import uiManager from "../uiManager";
import playerStorage from "./playerStorage";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";

class Scripting {
    constructor() {
        this.scripts = [];
        this.hooks = [];
        this.hookedScripts = {};
        this.globals = {};
        this.#initializeHooks();
    }
    #initializeHooks() {
        mc.system.runInterval(() => {
            this.callHooks(null, "tick");
        }, 1);

        mc.world.beforeEvents.itemUse.subscribe((e) => {
            this.callHooks(e.source, `item-use`, e);
            this.callHooks(e.source, `item-use:${e.itemStack.typeId}`, e);
            this.callHooks(
                e.source,
                `item-use:${e.itemStack.typeId.replace("minecraft:", "")}`,
                e
            );
        });
    }
    callHooks(entityScope = null, name, ...args) {
        this.hooks.forEach((hook) => {
            if (hook.type != name) return;
            if (entityScope) {
                let zone = zones.getZoneAtVec3ExcludeLandClaims(
                    entityScope.location
                );
                if (hook.zoneLockdown) {
                    if (!zone) return;
                    if (zone.data.name !== hook.zoneLockdown) return;
                }
            }
            hook.callback(...args);
        });
    }
    hook(id) {
        return (type, callback, zoneLockdown = "") => {
            let uniqueID = `hook_${
                Date.now() * 1000 + Math.floor(Math.random() * 1000)
            }`;
            this.hooks.push({ id, type, callback, uniqueID, zoneLockdown });
            return uniqueID;
        };
    }
    setGlobal(id) {
        return (key, value, protected2) => {
            if (!this.globals[id]) this.globals[id] = {};
            this.globals[id][key] = {
                protected: protected2 ? protected2 : false,
                value,
            };
        };
    }
    deleteGlobal(id) {
        return (key) => {
            if (!this.globals[id]) this.globals[id] = {};
            try {
                delete this.globals[id][key];
            } catch {}
        };
    }
    getGlobal(id) {
        return (key, scriptID = id) => {
            if (!this.globals[scriptID]) this.globals[scriptID] = {};
            if (this.globals[scriptID][key]) {
                if (this.globals[scriptID][key].protected && scriptID != id)
                    return null;
                return this.globals[scriptID][key].value;
            } else {
                return null;
            }
        };
    }
    getGlobalPrivileged(scriptID, key) {
        if (!this.globals[scriptID]) this.globals[scriptID] = {};
        if (this.globals[scriptID][key]) {
            return this.globals[scriptID][key].value;
        } else {
            return null;
        }
    }
    hookExists(type) {
        return this.hooks.find((_) => _.type == type) ? true : false;
    }
    unhook(id) {
        return (uniqueID) => {
            this.hooks = this.hooks.filter((_) => {
                if (_.id != id) return true;
                return _.uniqueID != uniqueID;
            });
        };
    }
    reload(id) {
        return () => {
            if (!this.hookedScripts[id]) return;
            let scriptText = this.hookedScripts[id];
            this.unregisterScript(id);
            this.registerScript(id, scriptText);
        };
    }
    getActiveScriptIDs() {
        let ids = [];
        for (const key of Object.keys(this.hookedScripts)) {
            if (this.hookedScripts[key]) ids.push(key);
        }
        return ids;
    }

    callScriptHook(id) {
        return (entityScope = null, hookName, ...data) => {
            this.callHooks(entityScope, `${id}:${hookName}`, ...data);
        };
    }
    registerScript(id, script) {
        if (this.hookedScripts[id])
            return mc.world.sendMessage(
                `Script tried registering twice, cancelling`
            );
        try {
            let fn = new Function(
                `return function ({callScriptHook, SegmentedStoragePrismarine, setGlobal, getGlobal, deleteGlobal, playerStorage, uiManager, actionParser, prismarineDb, icons, uiBuilder, homes, OpenClanAPI, formatStr, unhook, hook, mc, ui, reload}){\n${script}\n}`
            )();
            fn({
                mc,
                ui,
                playerStorage,
                formatStr,
                actionParser,
                uiManager,
                uiBuilder,
                homes,
                OpenClanAPI,
                icons,
                prismarineDb,
                hook: this.hook(id),
                getGlobal: this.getGlobal(id),
                setGlobal: this.setGlobal(id),
                deleteGlobal: this.deleteGlobal(id),
                callScriptHook: this.callScriptHook(id),
                SegmentedStoragePrismarine,
                unhook: this.unhook(id),
                reload: this.reload(id),
            });
            this.hookedScripts[id] = script;
        } catch (e) {
            mc.world.sendMessage(
                `§cLeaf Scripting API > Failed to hook function §e${id}§r§c.`
            );
            mc.world.sendMessage(`${e} ${e.stack}`);
        }
    }
    unregisterScript(id) {
        if (this.globals[id]) delete this.globals[id];
        if (!this.hookedScripts[id]) return;
        this.hooks = this.hooks.filter((_) => _.id != id);
        delete this.hookedScripts[id];
    }
}

export default new Scripting();
