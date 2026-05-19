import { system, world } from "@minecraft/server";
import { functionStore, prismarineDb } from "../../lib/prismarinedb";
import category from "./category";
import { ActionFormData } from "@minecraft/server-ui";
import { pluginsLoaded } from "../../pluginStorage";
import { getPluginToggle } from "../../pluginToggles";
// import config from "../../config";
import configAPI from "../../api/config/configAPI";
import uiManager from "../../uiManager";

export class ConfigModule {
    constructor() {
        this.displayName = "Config";
        this.id = "config";
        this.icon = "textures/items/config_ui"
        this.enabledByDefault = true;
        this.coreModule = true; // This makes it so this module cant be disabled. Config UI is required for leaf essentials
        this.enabled = false;
        this.configUILoaded = false;
    }
    registerIntoConfigUI(instance) {
        if(instance.configEntry) {
            let pageData = category;
            let pages = instance.configEntry.category.split('.');
            for(const pageName of pages) {
                if(pageData[pageName]) pageData = pageData[pageName];
            }
            if(!pageData.uis) pageData.uis = [];
            pageData.uis.push({pluginID: instance.id, ...instance.configEntry.data})
        }
    }
    load() {
        this.enabled = true; // PrismarineDB's event handler has no off() function so this will have to do for now
        let reservedProperties = ["icon", "name", "subtext", "uis", "requiredPermission"]
        if(!this.configUILoaded) {
            for(const key of Object.keys(pluginsLoaded)) {
                this.registerIntoConfigUI(pluginsLoaded[key])
            }
            this.configUILoaded = true;
        }
        prismarineDb.getEventHandler("PluginLoader").on("PluginLoaded", data=>{
            if(data.pluginClass) this.registerIntoConfigUI(data.pluginClass)
        })
        uiManager.addUI("config", {description: "Main config UI"}, (player, page = "root")=>{
            let pageData = category;
            let pages = page.split('.');
            if(pages.length && pages[0]) {
                for(const pageName of pages) {
                    if(pageData[pageName]) pageData = pageData[pageName];
                    else {
                        let errorForm = new ActionFormData();
                        errorForm.title("Config Error")
                        errorForm.body(`You are trying to access a page of config ui that does not exist (${page})`)
                        errorForm.button("Go to root page")
                        errorForm.show(player).then(res=>{
                            if(res.canceled) return;
                            uiManager.open(player, "config", "root")
                        })
                        return;
                    }
                }
    
            }
            let form = new ActionFormData();
            let buttons = []
            if(pages.length > 1) {
                buttons.push({type:"back"})
                form.button("§cBack\n§7Click to view previous UI", `textures/items/door_wood`)
            }
            form.title(pageData.name ?? "Unknown")
            if(pageData.body) form.body(pageData.body)
            if(pageData.uis) {
                for(const ui of pageData.uis) {
                    if(ui.pluginID && pluginsLoaded[ui.pluginID] && !getPluginToggle(pluginsLoaded[ui.pluginID])) continue;
                    if(ui.requiredPermission && !prismarineDb.permissions.hasPermission(player, ui.requiredPermission)) continue;
                    if(ui.conditional && !ui.conditional(player)) continue;
                    buttons.push({type:"external_ui", ui: ui.ui})
                    form.button(`${ui.name}${ui.subtext ? `\n§r§7${typeof ui.subtext === "function" ? ui.subtext() : ui.subtext}` : ``}`, ui.icon ?? null)
                }
            }
            for(const key of Object.keys(pageData)) {
                if(reservedProperties.includes(key)) continue;
                if(pageData[key].requiresDevModeEnabled && !configAPI.getProperty("DevMode")) continue;
                if(pageData[key].requiredPermission && !prismarineDb.permissions.hasPermission(player, pageData[key].requiredPermission)) continue;
                if(pageData[key].uis && pageData[key].uis.every(ui=>{
                    if(ui.pluginID && pluginsLoaded[ui.pluginID] && !getPluginToggle(pluginsLoaded[ui.pluginID])) return true;
                    if(ui.conditional && !ui.conditional(player)) return true;
                    if(ui.requiredPermission && !prismarineDb.permissions.hasPermission(player, ui.requiredPermission)) return true;

                    return false;
                })) continue;
                if(!pageData[key].uis || !pageData[key].uis.length) continue;

                buttons.push({type:"category", page: ([...page.split('.'), key]).join('.')})
                form.button(`${pageData[key].name}${pageData[key].subtext ? `\n§r§7${typeof pageData[key].subtext === "function" ? pageData[key].subtext() : pageData[key].subtext}` : ""}`, pageData[key].icon ?? null)
            }
            if(!buttons.length) {
                buttons.push({type:"back"})
                form.button("§cBack\n§7Click to view previous UI", `textures/items/door_wood`)
            }
            form.show(player).then(res=>{
                if(res.canceled) {
                    if(page == "root") return;
                    if(page != "root") {
                        page = page.split('.').slice(0,-1).join('.');
                        if(!page.length) page = "root"
                        uiManager.open(player, "config", page)
                        return;
                    }
                }
                if(buttons[res.selection].type == "category") {
                    uiManager.open(player, "config", buttons[res.selection].page)
                } else if(buttons[res.selection].type == "external_ui") {
                    uiManager.open(player, buttons[res.selection].ui)
                } else if(buttons[res.selection].type == "back") {
                    page = page.split('.').slice(0,-1).join('.');
                    if(!page.length) page = "root"
                    uiManager.open(player, "config", page)
                }
            })
        })
        world.beforeEvents.itemUse.subscribe(this.itemUse)
    }
    itemUse(e) {
        // system.run(()=>{
        //     if(e.itemStack.typeId == "leaf:config_ui" && e.source.typeId == "minecraft:player") {
        //         if(!prismarineDb.permissions.hasPermission(e.source, "config.open")) return e.source.error("You do not have permissions to open Config UI.")
        //         uiManager.open("config", e.source, "root")
        //     }
        // })
    }
    unload() {
        this.enabled = false;
        uiManager.removeUI("config")
        world.beforeEvents.itemUse.unsubscribe(this.itemUse)
    }
}
