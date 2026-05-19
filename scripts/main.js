import { Player, system, world, World } from "@minecraft/server";
import { prismarineDb } from "./lib/prismarinedb";
import { pluginsLoaded } from "./pluginStorage";
import { getPluginToggle } from "./pluginToggles";
import { leafIconPack, leafIconPack2 } from "./icon_packs/leaf";
import icons from "./api/icons";
import { ErrorHandlerModule } from "./modules_v2/errorHandler";
import { ErrorTestingModule } from "./modules_v2/errorTesting";
import './legacyLoader'
import { ModuleToggler } from "./modules_v2/pluginToggler";
import { Clock } from "./modules_v2/clock";
import uiManager from "./uiManager";
// import { ChatHandler } from "./modules_v2/chat";
import { ConfigModule } from "./modules_v2/config/config";
import { ChatModule } from "./modules_v2/chathandler/ChatHandlerModule";
import { ChatRanksModule } from "./modules_v2/chatranks/ChatRanksModule";
// import('./testymeow4')
// import './testymeow'
Player.prototype.error = function(message) {
    this.sendMessage(`§c§lERROR §8>> §r§7${message}`)
}
World.prototype.moduleError = function(message) {
    this.sendMessage(`§cMODULE ERROR §8§l>> §r§7${message}`)
}

// Config should ALWAYS be the first one to load, while error handling should always be the second
let plugins = [
    ConfigModule,
    ErrorHandlerModule,
    ErrorTestingModule,
    Clock,
    ModuleToggler,
    ChatModule,
    ChatRanksModule
]

try {
    icons.install(leafIconPack)
    icons.install(leafIconPack2)
} catch(e) {
    world.sendMessage(e)
}
function handleError(instance, error, rawPluginClass) {
    if (instance.id === "config") {
        world.moduleError("Config UI failed to load. Please report this immediately.");
        world.moduleError(`${error}`);
        world.moduleError(`${error.stack}`);
        return true; // Stop further loading
    }

    pluginsLoaded[instance.id] = instance;
    try {
        prismarineDb.getEventHandler("PluginLoader").emit("PluginFailed", {
            message: `${error}`,
            stack: error.stack,
            pluginClass: instance
        });
    } catch (e) {
        world.sendMessage("§cMODULE ERROR §8§l>> §r§7Some unknown module did a huge meanie and tried breaking the addon :(");
    }
    world.sendMessage(`§cMODULE ERROR §8§l>> §r§7Module "${instance.displayName ?? rawPluginClass.name}" failed to load.`);
    return false;
}
let safemode = world.getDynamicProperty('safemode') ? true : false;
system.afterEvents.scriptEventReceive.subscribe(e=>{
    if(e.id == "leaf:safemode") {
        if(!safemode) {
            for(const plugin of Object.values(pluginsLoaded)) {
                if(plugin.coreModule || !plugin.enabled) continue;
                plugin.unload();
            }
            world.setDynamicProperty('safemode', true)
            safemode = true;
        } else {
            for(const plugin of Object.values(pluginsLoaded)) {
                if(plugin.coreModule || plugin.enabled) continue;
                try {
                    plugin.load();
                    plugin.enabled = true;
                } catch {}
            }
            world.setDynamicProperty('safemode', false)
            safemode = false;
        }
    }
})
function loadPlugins() {
    for (const Plugin of plugins) {
        const instance = new Plugin();

        // Early return if instance has no ID
        if (!instance.id) {
            world.moduleError(`Plugin ${Plugin.name} does not have an ID. Not loading`);
            continue;
        }

        let unloadFn = instance.unload ? instance.unload : ()=>{}
        let loadFn = instance.load ? instance.load : ()=>{}
        let loadHooks = [];
        let unloadHooks = [];
        instance.load = function(...args) {
            for(const hook of loadHooks) hook();
            loadFn.apply(instance, ...args);
        }
        instance.unload = function (...args) {
            for(const hook of unloadHooks) hook();            
            unloadFn.apply(instance, ...args);
        }
        loadHooks.push(()=>{
            try {
                for(const plugin of Object.values(pluginsLoaded)) {
                    if(plugin.parentModule && plugin.parentModule == instance.id && !plugin.enabled) plugin.load();
                }
    
            } catch {}
        })
        unloadHooks.push(()=>{
            for(const plugin of Object.values(pluginsLoaded)) {
                if(plugin.parentModule && plugin.parentModule == instance.id) plugin.unload();
            }
        })
        loadHooks.push(()=>{
            instance.enabled = true;
        })

        unloadHooks.push(()=>{
            instance.enabled = false;
        })

        if(instance.uis) {
            loadHooks.push(()=>{
                for(const ui of instance.uis) {
                    uiManager.addUI(ui.name, ui.data ? ui.data : {}, (...args)=>{
                        if(ui.requiredPermission && !prismarineDb.permissions.hasPermission(args[0], ui.requiredPermission)) {
                            return args[0].error("You do not have permission to open this UI")
                        }
                        ui.open(...args)
                    })
                }
            })

            unloadHooks.push(()=>{
                for(const ui of instance.uis) {
                    uiManager.removeUI(ui.name)
                }
            })
        }

        if(instance.customLoadHooks) {
            for(const hook of instance.customLoadHooks) {
                loadHooks.push(hook)
            }
        }

        if(instance.customUnloadHooks) {
            for(const hook of instance.customUnloadHooks) {
                unloadHooks.push(hook)
            }
        }

        if(instance.tickIntervals) {
            let intervals = [];
            loadHooks.push(()=>{
                intervals = [];
                for(const tickInterval of instance.tickIntervals) {
                    intervals.push(system.runInterval(tickInterval.fn, tickInterval.timeout ?? 1))
                }
            })
            unloadHooks.push(()=>{
                for(const interval of intervals) {
                    system.clearRun(interval)
                }
            })
        }

        instance.enabled = false;
        let stop = false;
        pluginsLoaded[instance.id] = instance;
        try {
            // Check if the plugin is enabled before loading
            if (getPluginToggle(instance) || instance.coreModule) {
                if(!safemode || (safemode && instance.coreModule)) {
                    instance.load();
                    instance.enabled = true;
                    // pluginsLoaded[instance.id] = instance;
                    prismarineDb.getEventHandler("PluginLoader").emit("PluginLoaded", {
                        pluginClass: instance
                    });
                }
            }

        } catch (error) {
            stop = handleError(instance, error, Plugin);
        }

        if (stop) return world.moduleError(`Plugin '${instance.displayName ? instance.displayName : instance.id}' caused a halt!`); // Stop loading further plugins if needed
    }
}

loadPlugins();