import { system } from '@minecraft/server'
import { CommandPermissionLevel, CustomCommandParamType, world, Player, CustomCommandStatus } from "@minecraft/server"
import * as mc from '@minecraft/server'
import * as ui from '@minecraft/server-ui'
import { transferPlayer } from "@minecraft/server-admin"
let events = {};
let stasherID = "leaf:item_stasher";
if (system.beforeEvents.startup) {
    // console.warn("A")
    system.beforeEvents.startup.subscribe(async init => {
        init.blockComponentRegistry.registerCustomComponent('leaf:code_block', {
            onTick(arg0, arg1) {
                let redstone = arg0.block.getRedstonePower() || 0
                if(redstone > 0) {
                    let db = libPDB.positionalDb.getPosition(arg0.block.location)
                    if(db.has("code")) {
                        let code = db.get("code")
                        let fn = new Function(`return function({mc, ui}) {\n${code}\n}`)()
                        fn({mc, ui});
                    }
                }
            },
            onPlayerInteract(arg0, arg1) {
                if(!arg0.player) return;
                if(arg0.player.getGameMode() != mc.GameMode.creative) return;
                if(!arg0.player.isOp() && !libPDB.prismarineDb.permissions.hasPermission(arg0.player, "codeblock")) return;
                let ui2 = new ui.ModalFormData();
                let db = libPDB.positionalDb.getPosition(arg0.block.location)
                ui2.title("Code Editor").textField("Code", "// Code goes here", {defaultValue: db.has('code') ? db.get('code') : ''}).show(arg0.player).then(res=>{
                    if(res.canceled) return;
                    db.set('code', res.formValues[0])
                })
            }
        })
        if (init.customCommandRegistry) {

            init.customCommandRegistry.registerEnum('leaf:femboy_type', ['uwu', 'owo'])

            init.customCommandRegistry.registerEnum('leaf:invite_type', ['send', 'accept', 'deny'])

            init.customCommandRegistry.registerCommand({
                name: "leaf:invitemgr",
                description: "Manage invites.",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.Enum,
                        name: "leaf:invite_type"
                    },
                    {
                        type: CustomCommandParamType.String,
                        name: "invite_name"
                    },
                    {
                        type: CustomCommandParamType.PlayerSelector,
                        name: "sender"
                    },
                    {
                        type: CustomCommandParamType.PlayerSelector,
                        name: "receiver"
                    },
                ]
            }, (origin, invite_type, invite_name, sender, receiver) => {
                uiBuilder.default.inviteCMD(origin, invite_type, invite_name, sender, receiver)
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:femboy",
                description: "UwU",
                permissionLevel: CommandPermissionLevel.Any,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.Enum,
                        name: "leaf:femboy_type"
                    }
                ]
            }, (origin) => {
                if (origin.sourceType == "Entity") {
                    origin.sourceEntity.sendMessage("MEOWWW")
                }
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:tell_formatted",
                description: "Send a leaf formatted message to any user",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [{ name: "player", type: CustomCommandParamType.PlayerSelector }, { name: "message", type: CustomCommandParamType.String }]
            }, (origin, players, str) => {
                async function main() {
                    const module = await import("./api/azaleaFormatting.js")
                    for (const player of players)
                        player.sendMessage(module.formatStr(str, player, {}, { player2: origin && origin.sourceEntity && origin.sourceEntity.typeId == "minecraft:player" ? origin.sourceEntity : null }))
                }
                main()
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:on",
                description: "Listen for event",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.String,
                        name: "event_name"
                    }
                ]
            }, (origin, name) => {
                if (origin.sourceType != "Block") return;
                let res = events[name] ? events[name] : false;
                if (res) {
                    events[name] = false;
                    return {
                        status: CustomCommandStatus.Success
                    }
                } else {
                    return {
                        status: CustomCommandStatus.Failure
                    }
                }
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:pers_point_set",
                description: "Persistently store a point",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.EntitySelector,
                        name: "entities"
                    },
                    {
                        type: CustomCommandParamType.Location,
                        name: "position"
                    },
                    {
                        type: CustomCommandParamType.String,
                        name: "name"
                    }
                ]
            }, (origin, entities, position, name) => {
                system.run(() => {
                    for (const entity of entities) {
                        entity.setDynamicProperty(`perspointloc:${name}`, position)
                        entity.setDynamicProperty(`perspointdim:${name}`, entity.dimension.id)
                    }
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:pers_point_tp",
                description: "Teleport to persistent point",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.EntitySelector,
                        name: "entities"
                    },
                    {
                        type: CustomCommandParamType.String,
                        name: "name"
                    }
                ]
            }, (origin, entities, name) => {
                system.run(() => {
                    for (const entity of entities) {
                        if (entity.getDynamicProperty(`perspointloc:${name}`)) {
                            entity.teleport(entity.getDynamicProperty(`perspointloc:${name}`), {
                                dimension: world.getDimension(entity.getDynamicProperty(`perspointdim:${name}`))
                            })
                        }
                    }
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:wtag_add",
                description: "Add world tag",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.String,
                        name: "tag"
                    }
                ]
            }, (origin, tag) => {
                worldTags.worldTags.addTag(tag)
                return {
                    status: CustomCommandStatus.Success
                }
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:wtag_remove",
                description: "Remove world tag",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.String,
                        name: "tag"
                    }
                ]
            }, (origin, tag) => {
                if (worldTags.worldTags.hasTag(tag)) {
                    worldTags.worldTags.removeTag(tag)
                    return {
                        status: CustomCommandStatus.Success
                    }
                } else {
                    return {
                        status: CustomCommandStatus.Failure
                    }
                }
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:wtag_has",
                description: "Check if the world has tag, returns success status if true; failure status if not",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.String,
                        name: "tag"
                    }
                ]
            }, (origin, tag) => {
                if (worldTags.worldTags.hasTag(tag)) {
                    return {
                        status: CustomCommandStatus.Success
                    }
                } else {
                    return {
                        status: CustomCommandStatus.Failure
                    }
                }
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:transferserver",
                description: "Transfer player to another server",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.PlayerSelector,
                        name: "players"
                    },
                    {
                        type: CustomCommandParamType.String,
                        name: "host"
                    },
                    {
                        type: CustomCommandParamType.Integer,
                        name: "port"
                    }
                ]
            }, (origin, players, host, port) => {
                system.run(() => {
                    for (const player of players) {
                        transferPlayer(player, host, port)
                    }
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:trigger",
                description: "Trigger event",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.String,
                        name: "event_name"
                    }
                ]
            }, (origin, name) => {
                events[name] = true;
                return {
                    status: CustomCommandStatus.Success,
                    message: "Triggered!"
                }
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:save_inv_player",
                description: "Save players inventory only for them",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "players",
                        type: CustomCommandParamType.PlayerSelector
                    },
                    {
                        name: "inventory_name",
                        type: CustomCommandParamType.String
                    }
                ]
            }, (origin, players, inventory_name) => {
                system.run(async () => {
                    for (const player of players) {
                        await itemdb.saveInventory(player, `PLAYER_${player.id}_${inventory_name}`)
                        return;
                    }
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:del_inv_player",
                description: "Delete a players saved inventory",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "players",
                        type: CustomCommandParamType.PlayerSelector
                    },
                    {
                        name: "inventory_name",
                        type: CustomCommandParamType.String
                    }
                ]
            }, (origin, players, inventory_name) => {
                system.run(async () => {
                    for (const player of players) {
                        await itemdb.deleteInventory(player, `PLAYER_${player.id}_${inventory_name}`)
                        return;
                    }
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:del_inv_global",
                description: "Delete a players saved inventory",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "inventory_name",
                        type: CustomCommandParamType.String
                    }
                ]
            }, (origin, inventory_name) => {
                system.run(async () => {
                    await itemdb.deleteInventory(player, `GLOBAL_${inventory_name}`)
                    return;
                })
            })


            init.customCommandRegistry.registerCommand({
                name: "leaf:load_inv_player",
                description: "Load players inventory",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "players",
                        type: CustomCommandParamType.PlayerSelector
                    },
                    {
                        name: "inventory_name",
                        type: CustomCommandParamType.String
                    }
                ]
            }, (origin, players, inventory_name) => {
                system.run(async () => {
                    for (const player of players) {
                        await itemdb.loadInventory(player, `PLAYER_${player.id}_${inventory_name}`)
                    }
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:save_inv_global",
                description: "Save players inventory to the global inventory stash",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "inventory_name",
                        type: CustomCommandParamType.String
                    }
                ]
            }, (origin, players, inventory_name) => {
                system.run(async () => {
                    for (const player of players) {
                        await itemdb.saveInventory(player, `GLOBAL_${inventory_name}`)
                        return;
                    }
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:rename_entity",
                description: "Rename an entity",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.EntitySelector,
                        name: "entities"
                    },
                    {
                        type: CustomCommandParamType.String,
                        name: "name"
                    }
                ]
            }, (origin, entities, name) => {
                system.run(async () => {
                    for (const entity of entities) {
                        entity.nameTag = name;
                    }
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:register_int_property",
                description: "Register an integer property",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "name",
                        type: CustomCommandParamType.String
                    },
                    {
                        name: "default",
                        type: CustomCommandParamType.Integer
                    }
                ]
            }, (origin, name, defaultValue) => {
                let newName = `CSTM_I:${name}`;
                config.default.registerProperty(newName, config.default.Types.Number, defaultValue)
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:set_int_property",
                description: "Set an integer property",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "name",
                        type: CustomCommandParamType.String
                    },
                    {
                        name: "value",
                        type: CustomCommandParamType.Integer
                    }
                ]
            }, (origin, name, value) => {
                let newName = `CSTM_I:${name}`;
                config.default.setProperty(newName, value)
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:run_until_chunk_loaded",
                description: "Yes",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "command",
                        type: CustomCommandParamType.String
                    }
                ]
            }, (origin, command) => {
                if (origin.sourceType != "Entity") return;
                if (origin.sourceEntity.typeId != "minecraft:player") return;
                let player = origin.sourceEntity
                let iter_after = 0;
                let interval = system.runInterval(() => {
                    if (!player.isValid) system.clearRun(interval)
                    let block = player.dimension.getBlock({ x: player.location.x, y: 0, z: player.location.z })
                    if (block) {
                        iter_after++;
                        if (iter_after >= 3) {
                            system.clearRun(interval)
                        }
                    }
                    player.runCommand(command)
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:run_when_chunk_loaded",
                description: "Yes",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "command",
                        type: CustomCommandParamType.String
                    }
                ]
            }, (origin, command) => {
                if (origin.sourceType != "Entity") return;
                if (origin.sourceEntity.typeId != "minecraft:player") return;
                let player = origin.sourceEntity
                let iter_after = 0;
                let interval = system.runInterval(() => {
                    if (!player.isValid) system.clearRun(interval)
                    let block = player.dimension.getBlock({ x: player.location.x, y: 0, z: player.location.z })
                    if (block) {
                        iter_after++;
                        if (iter_after >= 0) {
                            player.runCommand(command)
                            system.clearRun(interval)
                        }
                    }
                })
            })


            init.customCommandRegistry.registerCommand({
                name: "leaf:incr_int_property",
                description: "Increment an integer property",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "name",
                        type: CustomCommandParamType.String
                    },
                    {
                        name: "value",
                        type: CustomCommandParamType.Integer
                    }
                ]
            }, (origin, name, value) => {
                let newName = `CSTM_I:${name}`;
                let curr = config.default.getProperty(newName)
                if (typeof curr == "number") {
                    config.default.setProperty(newName, curr + value)
                }
            })


            init.customCommandRegistry.registerCommand({
                name: "leaf:load_inv_global",
                description: "Load players inventory from global inventory stash",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "players",
                        type: CustomCommandParamType.PlayerSelector
                    },
                    {
                        name: "inventory_name",
                        type: CustomCommandParamType.String
                    }
                ]
            }, (origin, players, inventory_name) => {
                system.run(async () => {
                    for (const player of players) {
                        await itemdb.loadInventory(player, `GLOBAL_${inventory_name}`)
                    }
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:open",
                description: "Open custom UIs",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        name: "players",
                        type: CustomCommandParamType.PlayerSelector
                    },
                    {
                        name: "ui_scriptevent",
                        "type": CustomCommandParamType.String
                    }
                ],
            }, (origin, players, scriptevent) => {
                system.run(() => {
                    for (const player of players) {
                        player.runCommand(`scriptevent leaf:open ${scriptevent}`)
                    }
                })
            })

            init.customCommandRegistry.registerCommand({
                name: "leaf:knockback",
                description: "Apply knockback to player(s)",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {
                        type: CustomCommandParamType.PlayerSelector,
                        name: "players"
                    },
                    {
                        type: CustomCommandParamType.Float,
                        name: "horizX"
                    },
                    {
                        type: CustomCommandParamType.Float,
                        name: "horizZ"
                    },
                    {
                        type: CustomCommandParamType.Float,
                        name: "verticalStrength"
                    }
                ]
            }, (origin, players, horizX, horizZ, verticalStrength) => {
                system.run(() => {
                    for (const player of players) {
                        player.applyKnockback({ x: horizX, z: horizZ }, verticalStrength)
                    }
                })
            })

        }
        let config = await import("./api/config/configAPI.js")
        let worldTags = await import("./worldTags.js")
        let itemdb = await import("./api/itemdb.js")
        let libPDB = await import("./lib/prismarinedb.js")
        let SegmentedStoragePrismarine = await import("./prismarineDbStorages/segmented.js")
        let uiBuilder = await import("./api/uiBuilder.js")
        let inventories = libPDB.prismarineDb.customStorage("Inventories", SegmentedStoragePrismarine.SegmentedStoragePrismarine)
})
}
await system.waitTicks(0)
import("./main.js")
