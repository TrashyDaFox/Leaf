import { system, world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";
import { pluginsLoaded } from "../pluginStorage";
import { getPluginToggle } from "../pluginToggles";
import uiManager from "../uiManager";
import versionData from "../versionData";
import { ActionForm } from "../lib/form_func";
import {
    NUT_UI_HEADER_BUTTON,
    NUT_UI_TAG,
    NUT_UI_THEMED,
} from "../uis/preset_browser/nutUIConsts";
import { themes } from "../uis/uiBuilder/cherryThemes";

const MANIFEST_INFO = {
    name: "Leaf Essentials - v4.3",
    minEngineVersion: "1.21.100",
    packVersion: "1.0.175",
    moduleVersion: "1.0.175",
    dependencies: [
        {
            name: "@minecraft/server",
            version: "2.8.0-beta",
            runtimeCheck: () => !!world && !!system,
            note: "Script runtime API",
        },
        {
            name: "@minecraft/server-ui",
            version: "2.1.0-beta",
            runtimeCheck: () => !!ActionForm,
            note: "Form UI API",
        },
        {
            name: "LeafRP",
            version: "1.0.436",
            manual: true,
            note: "Resource pack dependency declared in manifest",
        },
    ],
};

function getModuleName(plugin) {
    return plugin.displayName || plugin.name || plugin.id || "Unknown";
}

function getModuleState(plugin) {
    if (plugin.coreModule) return "CORE";
    if (plugin.enabled) return "ON";
    if (getPluginToggle(plugin)) return "READY";
    return "OFF";
}

function trimList(items, limit) {
    if (items.length <= limit) return items;
    return [...items.slice(0, limit), `and ${items.length - limit} more`];
}

export class PackHealthModule {
    constructor() {
        this.displayName = "Pack Health";
        this.id = "pack_health";
        this.enabledByDefault = true;
        this.coreModule = true;
        this.enabled = false;
        this.loadedEvents = [];
        this.failedEvents = [];
        this.configEntry = {
            category: "root",
            data: {
                name: "§aPack Health",
                subtext: () => this.getConfigSubtext(),
                icon: "textures/azalea_icons/server",
                ui: versionData.uiNames.PackHealth.Root,
                requiredPermission: "config.open",
            },
        };
        this.uis = [
            {
                name: versionData.uiNames.PackHealth.Root,
                data: {},
                requiredPermission: "config.open",
                open: (player) => this.openRoot(player),
            },
            {
                name: versionData.uiNames.PackHealth.ReloadGuidance,
                data: {},
                requiredPermission: "config.open",
                open: (player) => this.openReloadGuidance(player),
            },
        ];
    }

    load() {
        this.enabled = true;
        const eventHandler = prismarineDb.getEventHandler("PluginLoader");
        eventHandler.on("PluginLoaded", (data) => {
            this.loadedEvents.push({
                id: data.pluginClass ? data.pluginClass.id : "unknown",
                name: data.pluginClass ? getModuleName(data.pluginClass) : "Unknown",
                tick: system.currentTick,
            });
            if (this.loadedEvents.length > 20) this.loadedEvents.shift();
        });
        eventHandler.on("PluginFailed", (data) => {
            this.failedEvents.push({
                id: data.pluginClass ? data.pluginClass.id : "unknown",
                name: data.pluginClass ? getModuleName(data.pluginClass) : "Unknown",
                message: `${data.message}`,
                stack: data.stack,
                tick: system.currentTick,
            });
            if (this.failedEvents.length > 20) this.failedEvents.shift();
        });
    }

    unload() {
        world.sendMessage("§cMODULE ERROR §8§l>> §r§7Pack Health is a core module and cannot be unloaded.");
    }

    getFailedEvents() {
        const failures = [...this.failedEvents];
        const errorHandler = pluginsLoaded.error_handler;
        if (errorHandler && Array.isArray(errorHandler.failedPlugins)) {
            for (const fail of errorHandler.failedPlugins) {
                const plugin = fail.pluginClass;
                failures.push({
                    id: plugin ? plugin.id : "unknown",
                    name: plugin ? getModuleName(plugin) : "Unknown",
                    message: `${fail.message}`,
                    stack: fail.stack,
                    tick: undefined,
                });
            }
        }
        const seen = new Set();
        return failures.filter((failure) => {
            const key = `${failure.id}:${failure.message}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    getConfigSubtext() {
        const failures = this.getFailedEvents().length;
        if (failures) return `${failures} runtime warning${failures === 1 ? "" : "s"}`;
        return "Versions, modules, dependencies";
    }

    getDependencyRows() {
        return MANIFEST_INFO.dependencies.map((dependency) => {
            if (dependency.manual) {
                return {
                    ...dependency,
                    status: "MANUAL",
                    ok: true,
                };
            }
            const ok = dependency.runtimeCheck();
            return {
                ...dependency,
                status: ok ? "OK" : "MISSING",
                ok,
            };
        });
    }

    openRoot(player) {
        const modules = Object.values(pluginsLoaded).sort((a, b) =>
            getModuleName(a).localeCompare(getModuleName(b))
        );
        const enabledModules = modules.filter((plugin) => plugin.enabled || plugin.coreModule);
        const disabledModules = modules.filter((plugin) => !plugin.enabled && !plugin.coreModule);
        const dependencyRows = this.getDependencyRows();
        const missingDependencies = dependencyRows.filter((dependency) => !dependency.ok);
        const failures = this.getFailedEvents();
        const safeMode = world.getDynamicProperty("safemode") ? "ON" : "OFF";
        const latestVersion = versionData.versionInfo.versionData.get(
            versionData.versionInfo.versionInternalID
        );

        const form = new ActionForm();
        form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[68][0]}§rPack Health`);
        form.label(
            [
                `§aLoaded Leaf Version: §f${versionData.versionInfo.versionName} §7(${latestVersion ? latestVersion.versionName : "current"}, internal ${versionData.versionInfo.versionInternalID})`,
                `§aManifest: §f${MANIFEST_INFO.name}`,
                `§7Pack Version: §f${MANIFEST_INFO.packVersion}`,
                `§7Module Version: §f${MANIFEST_INFO.moduleVersion}`,
                `§7Min Engine: §f${MANIFEST_INFO.minEngineVersion}`,
                `§7Runtime Tick: §f${system.currentTick}`,
                `§7Safe Mode: §f${safeMode}`,
            ].join("\n")
        );
        form.divider();
        form.label(
            [
                `§bModules: §f${enabledModules.length}/${modules.length} loaded or core`,
                `§7Enabled/Core: §f${trimList(enabledModules.map((plugin) => `${getModuleName(plugin)} [${getModuleState(plugin)}]`), 8).join("§7, §f") || "None"}`,
                `§7Disabled: §f${disabledModules.length}`,
            ].join("\n")
        );
        form.divider();
        form.label(
            missingDependencies.length
                ? [
                      "§cMissing Dependencies:",
                      ...missingDependencies.map(
                          (dependency) =>
                              `§7- §f${dependency.name} §7${dependency.version}: §c${dependency.note}`
                      ),
                  ].join("\n")
                : [
                      "§aMissing Dependencies: §fNone detected by script",
                      ...dependencyRows.map(
                          (dependency) =>
                              `§7- §f${dependency.name} §7${dependency.version}: §${dependency.status === "MANUAL" ? "e" : "a"}${dependency.status} §8- §7${dependency.note}`
                      ),
                  ].join("\n")
        );
        form.divider();
        form.label(
            [
                failures.length
                    ? `§cRuntime Warnings: §f${failures.length} plugin failure${failures.length === 1 ? "" : "s"} recorded`
                    : "§aRuntime Warnings: §fNo plugin failures recorded this session",
                "§eBuild Notes: §fRollup may still print existing warnings for circular dependencies, eval usage, and unused external imports. Those warnings are non-fatal when the build exits successfully.",
            ].join("\n")
        );
        if (failures.length) {
            form.label(
                trimList(
                    failures.map(
                        (failure) =>
                            `§c${failure.name}: §7${failure.message}${failure.tick ? ` §8(tick ${failure.tick})` : ""}`
                    ),
                    5
                ).join("\n")
            );
        }
        form.button(
            `${NUT_UI_HEADER_BUTTON}§cBack\n§7Return to admin menu`,
            "textures/azalea_icons/2",
            (player) => {
                player.runCommand("scriptevent leaf:open adm/main_menu");
            }
        );
        form.button("§aConfig\n§7Open Leaf config", "textures/items/config_ui", (player) => {
            uiManager.open(player, versionData.uiNames.ConfigRoot);
        });
        form.button("§qPlugins\n§7Open module manager", "textures/azalea_icons/ExtIcon", (player) => {
            uiManager.open(player, "modules");
        });
        form.button("§cError Logs\n§7Open runtime error log", "textures/azalea_icons/other/warning", (player) => {
            uiManager.open(player, "error_logs");
        });
        form.button("§eReload Guidance\n§7How to apply pack changes", "textures/azalea_icons/other/arrow_refresh", (player) => {
            uiManager.open(player, versionData.uiNames.PackHealth.ReloadGuidance);
        });
        form.button("§bRefresh\n§7Reload health status", "textures/azalea_icons/other/arrow_refresh", (player) => {
            uiManager.open(player, versionData.uiNames.PackHealth.Root);
        });
        form.show(player, false, () => {});
    }

    openReloadGuidance(player) {
        const form = new ActionForm();
        form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[68][0]}§rReload Guidance`);
        form.label(
            [
                "§eCode or manifest changes:",
                "§7Fully restart the world, server, or Realm. Bedrock reloads scripts, but it may not pick up newly created files reliably.",
                "",
                "§eDev pack updates:",
                "§7Close and reopen the world after syncing development packs. Re-apply packs if the world keeps an older cached copy.",
                "",
                "§eModule changes:",
                "§7Use Plugins for non-core module reloads. Restart the world for core modules or manifest/dependency changes.",
                "",
                "§eIf the pack acts broken:",
                "§7Open Pack Health again, check Error Logs, then check the Bedrock content log for load-time errors.",
            ].join("\n")
        );
        form.button(
            `${NUT_UI_HEADER_BUTTON}§cBack\n§7Return to Pack Health`,
            "textures/azalea_icons/2",
            (player) => {
                uiManager.open(player, versionData.uiNames.PackHealth.Root);
            }
        );
        form.button("§aConfig\n§7Open Leaf config", "textures/items/config_ui", (player) => {
            uiManager.open(player, versionData.uiNames.ConfigRoot);
        });
        form.button("§qPlugins\n§7Open module manager", "textures/azalea_icons/ExtIcon", (player) => {
            uiManager.open(player, "modules");
        });
        form.show(player, false, () => {});
    }
}
