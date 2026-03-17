import { system } from "@minecraft/server";
import {
    CommandPermissionLevel,
    CustomCommandParamType,
    world,
    Player,
    CustomCommandStatus,
} from "@minecraft/server";
import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
// import { transferPlayer } from "@minecraft/server-admin";
// meow
// let a = false;
// import * as diag from '@minecraft/diagnostics';
// diag.sentry.init({
//     dsn: "https://5732d97ad811d7a6d412be73c7b3f45f@o4509489467359232.ingest.us.sentry.io/4509489474437120"
// })
let events = {};
let stasherID = "leaf:item_stasher";
// if (system.beforeEvents.startup) {
// // // console.warn("A")
system.beforeEvents.startup.subscribe(async (init) => {
    init.blockComponentRegistry.registerCustomComponent("leaf:code_block", {
        onTick(arg0, arg1) {
            // return;
            try {
                let db = libPDB.positionalDb.getPosition(arg0.block.location);
                // if(db.has("code")) {
                //     let code = db.get("code")
                //     // // console.warn(arg0.block.location)
                //     // // console.warn(code)
                // }
                let redstone = arg0.block.getRedstonePower() || 0;
                if (redstone > 0) {
                    if (db.has("code")) {
                        let code = db.get("code");
                        let fn = new Function(
                            `return function({mc, ui, formatStr}) {\n${code}\n}`
                        )();
                        fn({ mc, ui, formatStr: formatting.formatStr });
                    }
                }
            } catch {}
        },
        onPlayerInteract(arg0, arg1) {
            if (!arg0.player) return;
            if (arg0.player.isSneaking) {
                let db = libPDB.positionalDb.getPosition(arg0.block.location);
                let bool = db.has("a") ? db.get("a") : false;
                db.set("a", !bool);
                arg0.player.success(
                    !bool
                        ? `Changed to single trigger mode`
                        : `Chagnged to multi trigger mode`
                );
                return;
            }
            if (arg0.player.getGameMode() != mc.GameMode.creative) return;
            if (
                !libPDB.prismarineDb.permissions.hasPermission(
                    arg0.player,
                    "codeblock"
                )
            )
                return;
            let ui2 = new ui.ModalFormData();
            let db = libPDB.positionalDb.getPosition(arg0.block.location);
            ui2.title("Code Editor")
                .textField("Code", "// Code goes here", {
                    defaultValue: db.has("code") ? db.get("code") : "",
                })
                .show(arg0.player)
                .then((res) => {
                    if (res.canceled) return;
                    db.set("code", res.formValues[0]);
                });
        },
    });
    // if (init.customCommandRegistry) {
    init.customCommandRegistry.registerEnum("leaf:femboy_type", ["uwu", "owo"]);
    init.customCommandRegistry.registerEnum("leaf:zone_action", ["create", "remove"]);
    init.customCommandRegistry.registerCommand({
        permissionLevel: CommandPermissionLevel.GameDirectors,
        description: "Create a zone",
        name: "leaf:createzone",
        mandatoryParameters: [
            {
                name: "name",
                type: CustomCommandParamType.String
            },
            {
                type: CustomCommandParamType.Location,
                name: "loc_start",
            },
            {
                type: CustomCommandParamType.Location,
                name: "loc_end",
            },
        ]
    }, (origin, name, loc_start, loc_end)=>{
        system.run(async ()=>{
            let zonesModule = await import("./api/zones");
            let status = zonesModule.default.addZone(name, Math.floor(loc_start.x), Math.floor(loc_start.y), Math.floor(loc_start.z), Math.floor(loc_end.x), Math.floor(loc_end.y), Math.floor(loc_end.z));
            if(origin.sourceEntity) origin.sourceEntity.sendMessage(status ? "§aCreated zone!" : "§cZone already exists")
        })
    })
    init.customCommandRegistry.registerCommand({
        permissionLevel: CommandPermissionLevel.GameDirectors,
        description: "Remove a zone",
        name: "leaf:removezone",
        mandatoryParameters: [
            {
                name: "name",
                type: CustomCommandParamType.String
            },
        ]
    }, (origin, name)=>{
        system.run(async ()=>{
            let zonesModule = await import("./api/zones");
            let status = zonesModule.default.removeZone(name);
            if(origin.sourceEntity) origin.sourceEntity.sendMessage(status ? "§aDeleted zone!" : "§cZone doesnt exist")
        })
    })
    init.customCommandRegistry.registerCommand({
        permissionLevel: CommandPermissionLevel.GameDirectors,
        description: "Disable a zone",
        name: "leaf:disablezone",
        mandatoryParameters: [
            {
                name: "name",
                type: CustomCommandParamType.String
            },
        ]
    }, (origin, name)=>{
        system.run(async ()=>{
            let zonesModule = await import("./api/zones");
            let status = zonesModule.default.disableZone(name);
            if(origin.sourceEntity) origin.sourceEntity.sendMessage(status ? "§aDeleted zone!" : "§cZone doesnt exist")
        })
    })
    init.customCommandRegistry.registerCommand({
        permissionLevel: CommandPermissionLevel.GameDirectors,
        description: "Enable a zone",
        name: "leaf:enablezone",
        mandatoryParameters: [
            {
                name: "name",
                type: CustomCommandParamType.String
            },
        ]
    }, (origin, name)=>{
        system.run(async ()=>{
            let zonesModule = await import("./api/zones");
            let status = zonesModule.default.enableZone(name);
            if(origin.sourceEntity) origin.sourceEntity.sendMessage(status ? "§aDeleted zone!" : "§cZone doesnt exist")
        })
    })

    init.customCommandRegistry.registerEnum("leaf:invite_type", [
        "send",
        "accept",
        "deny",
        "cancel"
    ]);

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:invitemgr",
            description: "Manage invites.",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.Enum,
                    name: "leaf:invite_type",
                },
                {
                    type: CustomCommandParamType.String,
                    name: "invite_name",
                },
                {
                    type: CustomCommandParamType.PlayerSelector,
                    name: "sender",
                },
                {
                    type: CustomCommandParamType.PlayerSelector,
                    name: "receiver",
                },
            ],
        },
        (origin, invite_type, invite_name, sender, receiver) => {
            uiBuilder.default.inviteCMD(
                origin,
                invite_type,
                invite_name,
                sender[0],
                receiver[0]
            );
        }
    );
    init.customCommandRegistry.registerEnum("leaf:channel_action_type", [
        "list",
        "info",
        "join"
    ]);
    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:channel",
            description: "Manage your current channel.",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.Enum,
                    name: "leaf:channel_action_type",
                }
            ],
            optionalParameters: [
                {
                    type: CustomCommandParamType.String,
                    name: "channel_name",
                }
            ]
        },
        (origin, channel_action_type, channel_name) => {
            uiBuilder.default.channelCmd(origin, channel_action_type, channel_name)
        }
    );


    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:tell_formatted",
            description: "Send a leaf formatted message to any user",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "player",
                    type: CustomCommandParamType.PlayerSelector,
                },
                {
                    name: "message",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, players, str) => {
            async function main() {
                const module = await import("./api/azaleaFormatting.js");
                for (const player of players)
                    player.sendMessage(
                        module
                            .formatStr(
                                str,
                                player,
                                {},
                                {
                                    player2:
                                        origin &&
                                        origin.sourceEntity &&
                                        origin.sourceEntity.typeId ==
                                            "minecraft:player"
                                            ? origin.sourceEntity
                                            : null,
                                }
                            )
                            .replaceAll("\\n", "\n")
                    );
            }
            main();
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:tell_formatted_channel",
            description: "Send a leaf formatted message to any channel",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "channel",
                    type: CustomCommandParamType.String,
                },
                {
                    name: "message",
                    type: CustomCommandParamType.String,
                },
            ],
            optionalParameters: [
                {
                    name: "origin_pos",
                    type: CustomCommandParamType.Location
                }
            ]
        },
        (origin, channel, str, origin_pos) => {
            async function main() {
                uiBuilder.default.broadcastToChannel(channel, str, [], origin && origin.sourceEntity && origin.sourceEntity.typeId == "minecraft:player" ? origin.sourceEntity : null, true, origin_pos)
            }
            main();
        }
    );


    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:on",
            description: "Listen for event",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.String,
                    name: "event_name",
                },
            ],
        },
        (origin, name) => {
            if (origin.sourceType != "Block") return;
            let res = events[name] ? events[name] : false;
            if (res) {
                events[name] = false;
                return {
                    status: CustomCommandStatus.Success,
                };
            } else {
                return {
                    status: CustomCommandStatus.Failure,
                };
            }
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:pers_point_set",
            description: "Persistently store a point",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.EntitySelector,
                    name: "entities",
                },
                {
                    type: CustomCommandParamType.Location,
                    name: "position",
                },
                {
                    type: CustomCommandParamType.String,
                    name: "name",
                },
            ],
        },
        (origin, entities, position, name) => {
            system.run(() => {
                for (const entity of entities) {
                    entity.setDynamicProperty(`perspointloc:${name}`, position);
                    entity.setDynamicProperty(
                        `perspointdim:${name}`,
                        entity.dimension.id
                    );
                }
            });
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:pers_point_del",
            description: "Persistently store a point",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.EntitySelector,
                    name: "entities",
                },
                {
                    type: CustomCommandParamType.String,
                    name: "name",
                },
            ],
        },
        (origin, entities, position, name) => {
            system.run(() => {
                for (const entity of entities) {
                    entity.setDynamicProperty(`perspointloc:${name}`, undefined);
                    entity.setDynamicProperty(
                        `perspointdim:${name}`,
                        undefined
                    );
                }
            });
        }
    );


    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:pers_point_tp",
            description: "Teleport to persistent point",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.EntitySelector,
                    name: "entities",
                },
                {
                    type: CustomCommandParamType.String,
                    name: "name",
                },
            ],
        },
        (origin, entities, name) => {
            system.run(() => {
                for (const entity of entities) {
                    if (entity.getDynamicProperty(`perspointloc:${name}`)) {
                        entity.teleport(
                            entity.getDynamicProperty(`perspointloc:${name}`),
                            {
                                dimension: world.getDimension(
                                    entity.getDynamicProperty(
                                        `perspointdim:${name}`
                                    )
                                ),
                            }
                        );
                    }
                }
            });
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:g_pers_point_set",
            description: "Persistently store a point",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.Location,
                    name: "position",
                },
                {
                    type: CustomCommandParamType.String,
                    name: "name",
                },
            ],
        },
        (origin, entities, position, name) => {
            system.run(() => {
                world.setDynamicProperty(`perspointloc:${name}`, position);
                world.setDynamicProperty(
                    `perspointdim:${name}`,
                    origin && origin.sourceEntity ? origin.sourceEntity.dimension.id : "minecraft:overworld"
                );
            });
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:g_pers_point_del",
            description: "Persistently store a point",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.EntitySelector,
                    name: "entities",
                },
                {
                    type: CustomCommandParamType.String,
                    name: "name",
                },
            ],
        },
        (origin, entities, position, name) => {
            system.run(() => {
                world.setDynamicProperty(`perspointloc:${name}`, undefined);
                world.setDynamicProperty(
                    `perspointdim:${name}`,
                    undefined
                );
            });
        }
    );


    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:g_pers_point_tp",
            description: "Teleport to persistent point",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.EntitySelector,
                    name: "entities",
                },
                {
                    type: CustomCommandParamType.String,
                    name: "name",
                },
            ],
        },
        (origin, entities, name) => {
            system.run(() => {
                for (const entity of entities) {
                    if (entity.getDynamicProperty(`perspointloc:${name}`)) {
                        entity.teleport(
                            world.getDynamicProperty(`perspointloc:${name}`),
                            {
                                dimension: world.getDimension(
                                    world.getDynamicProperty(
                                        `perspointdim:${name}`
                                    )
                                ),
                            }
                        );
                    }
                }
            });
        }
    );


    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:wtag_add",
            description: "Add world tag",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.String,
                    name: "tag",
                },
            ],
        },
        (origin, tag) => {
            worldTags.worldTags.addTag(tag);
            return {
                status: CustomCommandStatus.Success,
            };
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:wtag_remove",
            description: "Remove world tag",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.String,
                    name: "tag",
                },
            ],
        },
        (origin, tag) => {
            if (worldTags.worldTags.hasTag(tag)) {
                worldTags.worldTags.removeTag(tag);
                return {
                    status: CustomCommandStatus.Success,
                };
            } else {
                return {
                    status: CustomCommandStatus.Failure,
                };
            }
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:wtag_has",
            description:
                "Check if the world has tag, returns success status if true; failure status if not",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.String,
                    name: "tag",
                },
            ],
        },
        (origin, tag) => {
            if (worldTags.worldTags.hasTag(tag)) {
                return {
                    status: CustomCommandStatus.Success,
                };
            } else {
                return {
                    status: CustomCommandStatus.Failure,
                };
            }
        }
    );

    // init.customCommandRegistry.registerCommand(
    //     {
    //         name: "leaf:transferserver",
    //         description: "Transfer player to another server",
    //         permissionLevel: CommandPermissionLevel.GameDirectors,
    //         mandatoryParameters: [
    //             {
    //                 type: CustomCommandParamType.PlayerSelector,
    //                 name: "players",
    //             },
    //             {
    //                 type: CustomCommandParamType.String,
    //                 name: "host",
    //             },
    //             {
    //                 type: CustomCommandParamType.Integer,
    //                 name: "port",
    //             },
    //         ],
    //     },
    //     (origin, players, host, port) => {
    //         system.run(() => {
    //             for (const player of players) {
    //                 transferPlayer(player, { hostname: host, port });
    //             }
    //         });
    //     }
    // );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:trigger",
            description: "Trigger event",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.String,
                    name: "event_name",
                },
            ],
        },
        (origin, name) => {
            events[name] = true;
            return {
                status: CustomCommandStatus.Success,
                message: "Triggered!",
            };
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:sel2entity",
            description: "Internal command to translate entity selectors to entities array",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.EntitySelector,
                    name: "entities"
                },
                {
                    type: CustomCommandParamType.String,
                    name: "id",
                },
            ],
        },
        (origin, entities, id) => {
            if(origin.sourceType != mc.CustomCommandSource.Server) return {
                status: CustomCommandStatus.Failure,
                message: "no"
            };
            uiBuilder.default.selector2entities(entities, id)
            return {
                status: CustomCommandStatus.Success,
                message: "Triggered!",
            };
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:save_inv_player",
            description: "Save players inventory only for them",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "players",
                    type: CustomCommandParamType.PlayerSelector,
                },
                {
                    name: "inventory_name",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, players, inventory_name) => {
            (async ()=>{
                let itemdb = await import("./api/itemdb.js");

                // // console.warn(itemdb)
                system.run(() => {
                    let thing = async() =>{
                    for (const player of players) {
                        await itemdb.saveInventory(
                            player,
                            `PLAYER_${player.id}_${inventory_name}`
                        );
                    }

                    }
                    thing()
                });
    
            })()
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:del_inv_player",
            description: "Delete a players saved inventory",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "players",
                    type: CustomCommandParamType.PlayerSelector,
                },
                {
                    name: "inventory_name",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, players, inventory_name) => {
            (async ()=>{
                let itemdb = await import("./api/itemdb.js");

                system.run(async () => {
                    for (const player of players) {
                        await itemdb.deleteInventory(
                            player,
                            `PLAYER_${player.id}_${inventory_name}`
                        );
                        return;
                    }
                });
            })()
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:del_inv_global",
            description: "Delete a players saved inventory",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "inventory_name",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, inventory_name) => {
            (async ()=>{
                let itemdb = await import("./api/itemdb.js");
                system.run(async () => {
                    await itemdb.deleteInventory(
                        player,
                        `GLOBAL_${inventory_name}`
                    );
                    return;
                });
            })()
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:load_inv_player",
            description: "Load players inventory",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "players",
                    type: CustomCommandParamType.PlayerSelector,
                },
                {
                    name: "inventory_name",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, players, inventory_name) => {
            (async ()=>{
                let itemdb = await import("./api/itemdb.js");
                system.run(async () => {
                    for (const player of players) {
                        try {
                            await itemdb.loadInventory(
                                player,
                                `PLAYER_${player.id}_${inventory_name}`
                            );
        
                        } catch(e) {
                            let container = players[0].getComponent('inventory').container;
                            // if(!(container instanceof mc.Container)) return;
                            for(let i = 0;i < container.size;i++) {
                                container.setItem(i);
                            }
                        }
                    }
                });
            })()
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:save_inv_global",
            description: "Save players inventory to the global inventory stash",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "players",
                    type: CustomCommandParamType.PlayerSelector,
                },

                {
                    name: "inventory_name",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, players, inventory_name) => {
            (async ()=>{
                let itemdb = await import("./api/itemdb.js");
                system.run(async () => {
                    for (const player of players) {
                        await itemdb.saveInventory(
                            player,
                            `GLOBAL_${inventory_name}`
                        );
                        return;
                    }
                });
            })()
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:rename_entity",
            description: "Rename an entity",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.EntitySelector,
                    name: "entities",
                },
                {
                    type: CustomCommandParamType.String,
                    name: "name",
                },
            ],
        },
        (origin, entities, name) => {
            system.run(async () => {
                for (const entity of entities) {
                    entity.nameTag = name;
                }
            });
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:register_int_property",
            description: "Register an integer property",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "name",
                    type: CustomCommandParamType.String,
                },
                {
                    name: "default",
                    type: CustomCommandParamType.Integer,
                },
            ],
        },
        (origin, name, defaultValue) => {
            let newName = `CSTM_I:${name}`;
            config.default.registerProperty(
                newName,
                config.default.Types.Number,
                defaultValue
            );
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:set_int_property",
            description: "Set an integer property",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "name",
                    type: CustomCommandParamType.String,
                },
                {
                    name: "value",
                    type: CustomCommandParamType.Integer,
                },
            ],
        },
        (origin, name, value) => {
            let newName = `CSTM_I:${name}`;
            config.default.setProperty(newName, value);
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:run_until_chunk_loaded",
            description: "Yes",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "command",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, command) => {
            if (origin.sourceType != "Entity") return;
            if (origin.sourceEntity.typeId != "minecraft:player") return;
            let player = origin.sourceEntity;
            let iter_after = 0;
            let interval = system.runInterval(() => {
                if (!player.isValid) system.clearRun(interval);
                let block = player.dimension.getBlock({
                    x: player.location.x,
                    y: 0,
                    z: player.location.z,
                });
                if (block) {
                    iter_after++;
                    if (iter_after >= 3) {
                        system.clearRun(interval);
                    }
                }
                player.runCommand(command);
            });
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:run_when_chunk_loaded",
            description: "Yes",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "command",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, command) => {
            if (origin.sourceType != "Entity") return;
            if (origin.sourceEntity.typeId != "minecraft:player") return;
            let player = origin.sourceEntity;
            let iter_after = 0;
            let interval = system.runInterval(() => {
                if (!player.isValid) system.clearRun(interval);
                let block = player.dimension.getBlock({
                    x: player.location.x,
                    y: 0,
                    z: player.location.z,
                });
                if (block) {
                    iter_after++;
                    if (iter_after >= 0) {
                        player.runCommand(command);
                        system.clearRun(interval);
                    }
                }
            });
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:incr_int_property",
            description: "Increment an integer property",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "name",
                    type: CustomCommandParamType.String,
                },
                {
                    name: "value",
                    type: CustomCommandParamType.Integer,
                },
            ],
        },
        (origin, name, value) => {
            let newName = `CSTM_I:${name}`;
            let curr = config.default.getProperty(newName);
            if (typeof curr == "number") {
                config.default.setProperty(newName, curr + value);
            }
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:load_inv_global",
            description: "Load players inventory from global inventory stash",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "players",
                    type: CustomCommandParamType.PlayerSelector,
                },
                {
                    name: "inventory_name",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, players, inventory_name) => {
            system.run(async () => {
                for (const player of players) {
                    try {
                        await itemdb.loadInventory(
                            player,
                            `GLOBAL_${inventory_name}`
                        );
    
                    } catch {
                        let container = players[0].getComponent('inventory').container;
                        // if(!(container instanceof mc.Container)) return;
                        for(let i = 0;i < container.size;i++) {
                         
                            container.setItem(i);
                        }
                        const equipment = player.getComponent("equippable");
                        let equipmentSlots = [
                            mc.EquipmentSlot.Head,
                            mc.EquipmentSlot.Chest,
                            mc.EquipmentSlot.Legs,
                            mc.EquipmentSlot.Feet,
                            mc.EquipmentSlot.Offhand,
                        ]
                        for (let i = 0; i < 5; i++) {
                            equipment.setEquipment(equipmentSlots[i], null);
                        }
                    }

                }
            });
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:open",
            description: "Open UIs",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "players",
                    type: CustomCommandParamType.PlayerSelector,
                },
                {
                    name: "ui_scriptevent",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, players, scriptevent) => {
            system.run(() => {
                for (const player of players) {
                    player.runCommand(`scriptevent leaf:open_command_internal ${scriptevent}`);
                }
            });
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:render_as",
            description:
                "Render an action form as another player but open it on another",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    name: "render_as",
                    type: CustomCommandParamType.PlayerSelector,
                },
                {
                    name: "show_to",
                    type: CustomCommandParamType.PlayerSelector,
                },
                {
                    name: "ui_scriptevent",
                    type: CustomCommandParamType.String,
                },
            ],
        },
        (origin, render_as, show_to, scriptevent) => {
            system.run(async () => {
                if (!render_as || !render_as.length) return;

                for (const player of show_to) {
                    // // console.warn("TEST")
                    let ui = uiBuilder.default.db.findFirst({
                        type: 0,
                        scriptevent,
                    });
                    if (ui) {
                        normalForm.default.openActionForm2(
                            player,
                            render_as[0],
                            ui.data
                        );
                    }
                }
            });
        }
    );
    // uiB
    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:knockback",
            description: "Apply knockback to player(s)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.PlayerSelector,
                    name: "players",
                },
                {
                    type: CustomCommandParamType.Float,
                    name: "horizX",
                },
                {
                    type: CustomCommandParamType.Float,
                    name: "horizZ",
                },
                {
                    type: CustomCommandParamType.Float,
                    name: "verticalStrength",
                },
            ],
        },
        (origin, players, horizX, horizZ, verticalStrength) => {
            system.run(() => {
                for (const player of players) {
                    player.applyKnockback(
                        { x: horizX, z: horizZ },
                        verticalStrength
                    );
                }
            });
        }
    );

    init.customCommandRegistry.registerCommand(
        {
            name: "leaf:knockback2",
            description: "Apply knockback to player(s)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {
                    type: CustomCommandParamType.PlayerSelector,
                    name: "players",
                },
                {
                    type: CustomCommandParamType.Float,
                    name: "xStrength",
                },
                {
                    type: CustomCommandParamType.Float,
                    name: "zStrength",
                },
                {
                    type: CustomCommandParamType.Float,
                    name: "verticalStrength",
                },
            ],
        },
        (origin, players, xStrength, zStrength, verticalStrength) => {
            system.run(() => {
                for (const player of players) {
                    // if(!(player instanceof Player)) return;
                    player.applyKnockback(
                        { x: player.getViewDirection().x * xStrength, z: player.getViewDirection().z * zStrength },
                        verticalStrength
                    );
                }
            });
        }
    );


    // start this sh*t

    // init.customCommandRegistry.registerCommand()

    // init.customCommandRegistry.registerCommand({
    //     name: "leaf:weighted_rng",

    // })
    // }
    const formatting = await import("./api/azaleaFormatting.js");

    // config.default.registerProperty(
    //     "Activated",
    //     config.default.Types.Boolean,
    //     false
    // );
    // let config;
    // let worldTags;
    // let normalForm;
    // let itemdb;
    // let libPDB;
    // let uiBuilder;
    // system.runTimeout(async () => {
    let config = await import("./api/config/configAPI.js");
    let worldTags = await import("./worldTags.js");
    let normalForm = await import("./api/openers/normalForm.js");
    let itemdb = await import("./api/itemdb.js");
    let libPDB = await import("./lib/prismarinedb.js");
    let uiBuilder = await import("./api/uiBuilder.js");

    // let SegmentedStoragePrismarine = await import(
    //     "./prismarineDbStorages/segmented.js"
    // );

    // uiBuilder.scriptEnvTypes
    // let {fuck} = await import("./randomAssStorageDumps.js");
    // let inventories = libPDB.prismarineDb.customStorage(
    //     "Inventories",
    //     SegmentedStoragePrismarine.SegmentedStoragePrismarine
    // );
    // if (config.default.getProperty("Activated")) {
    //     setup();
    // }
});
// }
await system.waitTicks(0);

let NUT_UI_TAG = "§f§0§0";
let NUT_UI_LEFT_HALF = "§p§1§2";
let NUT_UI_RIGHT_HALF = "§p§2§2";
let NUT_UI_LEFT_THIRD = "§p§2§2§p§2§1";
let NUT_UI_MIDDLE_THIRD = "§p§2§1§p§1§2";
let NUT_UI_RIGHT_THIRD = "§p§1§1§p§1§2";
let NUT_UI_THEMED = "§t§h§e§m§0§1";
let NUT_UI_PAPERDOLL = "§p§l§0§1";
let NUT_UI_OCEAN = "§o§c§e§a§n";
let NUT_UI_HEADER_BUTTON = "§p§4§0";
let NUT_UI_ALT = "§a§l§t§b§t§n";
let NUT_UI_DISABLE_VERTICAL_SIZE_KEY = "§p§0§0";

export function showSetupUI(player, backCmd = null) {
    let form = new ui.ActionFormData();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}§l§f§3§0§r§fWelcome to Leaf Essentials!`);
    form.label('textures/leaf_dyn_images/ppballs2.png')
    form.divider();
    form.label(`To get started, make sure you do §e/tag @s add admin`);
    form.label(`Documentation can be found at §ahttps://leaf.trashdev.org`);
    form.label(`Addon made with §v<3 §r§fby §vTrashyDaFox`);
    form.divider();
    form.header(`§v§lWhats new?`)
    form.label(`§7Version: §bv3.007`)
    form.label([
        `§r§b- §fHeavily optimized UIs on lower end devices`,
        `§r§b- §fAdded polls`,
        `§r§b- §fImproved some back buttons`,
        `§r§b- §fAdded subfolders to UI builder`,
        `§r§b- §fAdded some new perms into roles`,
        `§r§b- §fAdded §e/leaf:knockback2 §fcommand`,
        `§r§b- §fFixed some bugs within leaderboards`,
    ].join('\n§r'))
    if(!backCmd) {
        form.button(
            `§aAccept & Close\n§7[ Click to close ]`,
            `textures/azalea_icons/other/script_text`
        );
    }
    form.label(
        `§7§oNOTE: The only official sources of leaf essentials are curseforge, mcpedl and mcbetools (https://mcbetools.com). Any others are likely fake!`
    );
    function yes(res) {
        if(backCmd) {
            player.runCommand(backCmd)
            return;
        }
        // if (res.canceled) return form.show(player).then(yes);
        // if (res.selection == 0) {
        player.success("Thank you for using leaf!");
        player.playSound("random.levelup");
        // config.default.setProperty("Activated2", true);
        // }
    }
    form.show(player).then(yes);
}
system.afterEvents.scriptEventReceive.subscribe(e=>{
    if(e.id == "leaf:setup_ui") {
        showSetupUI(e.sourceEntity, e.message ? e.message : null)
    }
})
// config.default.registerProperty(
//     "Activated2",
//     config.default.Types.Boolean,
//     false
// );

// config.default.registerProperty(
//     "ConfigAPI:ExperimentalEnums",
//     config.default.Types.Boolean,
//     false
// );
// config.default.registerProperty(
//     "ConfigAPI:EnableDevTools",
//     config.default.Types.Boolean,
//     false
// );
// config.default.registerProperty(
//     "Leaf:GenericRulebookUI",
//     config.default.Types.Boolean,
//     false
// )
// config.default.registerProperty(
//     "Leaf:GenericRulebookUILines",
//     config.default.Types.List,
//     [],
//     {
//         editor: "leafgui/generic_string_list_editor"
//     }
// );

// config.default.db.waitLoad().then(() => {
    // system.runTimeout(() => {
        // if (
            // world.getPlayers().length > 0 &&
            // (!config.default.getProperty("Activated2"))
        // ) {
            // showSetupUI(world.getPlayers()[0]);
        // }
    // }, 100);

    // world.afterEvents.playerSpawn.subscribe((e) => {
        // if (config.default.getProperty("Activated2")) return;
        // if(e.player.playerPermissionLevel < 2) return;
        // showSetupUI(e.player);
    // });
// });

function setup() {}
//aaaaaaaa
//aaaa
await system.waitTicks(0)
// system.runTimeout(()=>{
await import("./main.js");
// },10)
// test