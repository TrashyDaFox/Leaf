import { prismarineDb } from "../lib/prismarinedb"
// import uiStorage from "../../uiStorage";
import { pluginsLoaded } from "../pluginStorage";
import { getPluginToggle } from "../pluginToggles";
import { world } from "@minecraft/server";
import uiManager from "../uiManager";
import versionData from "../versionData";
import { ActionForm } from "../lib/form_func";
import { NUT_UI_TAG, NUT_UI_THEMED } from "../uis/preset_browser/nutUIConsts";
import { themes } from "../uis/uiBuilder/cherryThemes";

export class ModuleToggler {
    constructor() {
        this.configEntry = {
            category: "root",
            data: {
                name: "§2Modules",
                subtext: "Enable/disable features",
                ui: "module_toggler",
                icon: "textures/ui/realms_slot_check"
            }
        }
        this.meow = 1;
        this.coreModule = true;
        this.id = "module_toggler"
    }
    load() {
        uiManager.addUI("modules", "yes", (player, moduleName = "root")=>{
            if(moduleName == "root") {
                let modules = Object.keys(pluginsLoaded).filter(_=>pluginsLoaded[_].parentModule ? false : true).sort((a,b)=>{
                    return (pluginsLoaded[b].coreModule ?? false) - (pluginsLoaded[a].coreModule ?? false)
                });
                let form = new ActionForm();
                form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[68][0]}§rModules`)
                form.button("§cBack\n§7Return to config", "textures/azalea_icons/2", (player)=>{
                    uiManager.open(player, versionData.uiNames.ConfigRoot)
                })
                for(const module of modules) {
                    let inst = pluginsLoaded[module];
                    let state = inst.coreModule ? "CORE" : getPluginToggle(inst) ? "ON" : "OFF";
                    form.button(`§${inst.coreModule ? "d" : getPluginToggle(inst) ? "a" : "c"}${inst.displayName ? inst.displayName : inst.id}${inst.coreModule ? " [CORE]" : ""}\n§r§7${state} - ${inst.id}`, inst.icon ? inst.icon : inst.configEntry && inst.configEntry.data && inst.configEntry.data.icon ? inst.configEntry.data.icon : "textures/azalea_icons/ExtIcon", (player)=>{
                        uiManager.open(player, "modules", module)
                    })
                }
                form.show(player, false, (player, response)=>{

                })
                return;
            }
            let instance = pluginsLoaded[moduleName];
            if(!instance) {
                player.error(`Module "${moduleName}" was not found.`);
                return uiManager.open(player, "modules");
            }
            let form = new ActionForm();
            let enabled = getPluginToggle(instance);
            form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[68][0]}§r${instance.displayName ? instance.displayName : instance.id}`)
            form.button("§cBack\n§7Return to modules", "textures/azalea_icons/2", (player)=>{
                uiManager.open(player, "modules")
            })
            form.label(`§7ID: §f${instance.id}\n§7State: §f${instance.coreModule ? "CORE" : enabled ? "ON" : "OFF"}${instance.description ? `\n§7${instance.description}` : ""}`)
            if(!instance.coreModule) {
                form.button(`${enabled ? "§cDisable" : "§aEnable"}\n§7${enabled ? "Turn this module off" : "Turn this module on"}`, enabled ? "textures/azalea_icons/Delete" : "textures/azalea_icons/other/checkmark", (player)=>{
                    this.setModuleEnabled(player, instance, !enabled)
                })
                if(enabled) {
                    form.button("§eReload\n§7Unload and load this module", "textures/azalea_icons/other/arrow_refresh", (player)=>{
                        try {
                            if(instance.unload) instance.unload();
                            instance.load();
                            instance.enabled = true;
                            world.setDynamicProperty(`pluginToggle:${instance.id}`, true)
                            prismarineDb.getEventHandler("PluginLoader").emit("PluginLoaded", {
                                pluginClass: instance
                            })
                            player.success(`Reloaded ${instance.displayName ? instance.displayName : instance.id}`);
                        } catch(e) {
                            this.reportModuleError(player, instance, e)
                        }
                        uiManager.open(player, "modules", instance.id)
                    })
                }
            }
            form.show(player, false, (player, response)=>{})
        })
        uiManager.addUI("module_toggler", {}, (player)=>{
            uiManager.open(player, "modules")
        })
    }
    reportModuleError(player, instance, error) {
        try {
            prismarineDb.getEventHandler("PluginLoader").emit("PluginFailed", {
                message: `${error}`,
                stack: error.stack,
                pluginClass: instance
            })
        } catch(e) {
            world.sendMessage(`§cMODULE ERROR §8§l>> §r§7An unknown module failed.`)
        }
        player.error(`Module "${instance.displayName ? instance.displayName : instance.id}" failed: ${error}`)
    }
    setModuleEnabled(player, instance, enabled) {
        try {
            if(enabled) {
                instance.load();
                instance.enabled = true;
                world.setDynamicProperty(`pluginToggle:${instance.id}`, true)
                prismarineDb.getEventHandler("PluginLoader").emit("PluginLoaded", {
                    pluginClass: instance
                })
                player.success(`Enabled ${instance.displayName ? instance.displayName : instance.id}`);
            } else {
                if(!instance.unload) {
                    player.error(`Module "${instance.id}" does not have an unload function. Restart the world to fully disable it.`)
                } else {
                    instance.unload();
                }
                instance.enabled = false;
                world.setDynamicProperty(`pluginToggle:${instance.id}`, false)
                player.success(`Disabled ${instance.displayName ? instance.displayName : instance.id}`);
            }
        } catch(e) {
            this.reportModuleError(player, instance, e)
        }
        uiManager.open(player, "modules", instance.id)
    }
}
