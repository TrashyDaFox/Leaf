import { EntityDamageCause, system, world } from "@minecraft/server";
import actionParser from "../api/actionParser";

let eventsRan = {};

export default [
    {
        icon: "textures/azalea_icons/other/skull",
        name: "Death",
        type: 0,
        initOptions: [
            {
                name: "playerFilter",
                display: "Player Filter",
                type: "condition",
                player: "player1",
            },
        ],
        run: (opts, actions, { player1 }) => {
            for (const action of actions) {
                if (action.type == 0) {
                    actionParser.runAction(player1, action.value);
                }
            }
        },
        setup: (run) => {
            world.afterEvents.entityDie.subscribe((e) => {
                if (e.deadEntity == "minecraft:player") {
                    run({ player1: e.deadEntity });
                }
            });
        },
        runWhen: (opts) => opts.playerFilter == true,
        actionTypes: [
            {
                type: 0,
                name: "Command",
                inputMethod: "string",
                player: "player1",
            },
        ],
    },
    {
        name: "Kill",
        icon: "textures/azalea_icons/other/sword",
        type: 0,
        initOptions: [
            {
                name: "playerKilledFilter",
                display: "Player Killed Filter",
                type: "condition",
                player: "player1",
            },
            {
                name: "killerFilter",
                display: "Killer Filter",
                type: "condition",
                player: "player2",
            },
            {
                name: "combination",
                display: "Condition combination requirement: AND / OR",
                type: "toggle",
            },
        ],
        run(opts, actions, { player1, player2 }) {
            for (const action of actions) {
                if (action.type == 0) {
                    actionParser.runAction(player1, action.value);
                } else if (action.type == 1) {
                    actionParser.runAction(player2, action.value);
                }
            }
        },
        setup(run) {
            world.afterEvents.entityDie.subscribe((e) => {
                if (e.deadEntity.typeId != "minecraft:player") return;
                let damagingEntity = e.damageSource.damagingEntity;
                if (e.damageSource.damagingProjectile) {
                    let projectile =
                        e.damageSource.damagingProjectile.getComponent(
                            "projectile"
                        );
                    damagingEntity = projectile.owner;
                }
                if (
                    !damagingEntity ||
                    damagingEntity.typeId != "minecraft:player"
                )
                    return;
                run({
                    player1: e.deadEntity,
                    player2: damagingEntity,
                });
            });
        },
        runWhen: (opts) =>
            opts.combination
                ? opts.playerKilledFilter == true || opts.killerFilter == true
                : opts.playerKilledFilter == true && opts.killerFilter == true,
        actionTypes: [
            {
                type: 0,
                name: "Command (dead player)",
                inputMethod: "string",
                player: "player1",
            },
            {
                type: 1,
                name: "Command (killer)",
                inputMethod: "string",
                player: "player2",
            },
        ],
    },
    {
        name: "Player Join",
        type: 0,
        icon: "textures/azalea_icons/other/character_add",
        initOptions: [
            {
                name: "playerFilter",
                type: "condition",
                player: "player1",
                display: "Player Filter",
            },
        ],
        run: (opts, actions, { player1 }) => {
            for (const action of actions) {
                if (action.type == 0) {
                    actionParser.runAction(player1, action.value);
                }
            }
        },
        runWhen: (opts) => opts.playerFilter == true,
        setup: (run) => {
            world.afterEvents.playerSpawn.subscribe((e) => {
                if (!e.initialSpawn) return;
                run({ player1: e.player });
            });
        },
        actionTypes: [
            {
                type: 0,
                name: "Command",
                inputMethod: "string",
                player: "player1",
            },
        ],
    },
    {
        type: 1,
        name: "Manual Trigger",
        icon: "textures/azalea_icons/other/interact",
        initOptions: [
            {
                name: "manualTriggerName",
                type: "string",
                display: "MEOW MEOW MEOW",
            },
        ],
        run: (opts, actions, { player1 }) => {
            for (const action of actions) {
                if (action.type == 0) {
                    actionParser.runAction(player1, action.value);
                }
            }
        },
        setup: (run) => {
            system.afterEvents.scriptEventReceive.subscribe((e) => {
                if (e.id == "leaf:trigger_manual_events") {
                    if (e.sourceEntity) {
                        run({ player1: e.sourceEntity });
                    }
                }
            });
        },
        actionTypes: [
            {
                type: 0,
                name: "Command",
                inputMethod: "string",
            },
        ],
    },
    {
        type: 1,
        name: "Tick Event (Player Loop)",
        icon: "textures/azalea_icons/other/hourglass",
        setup: (run) => {
            system.runInterval(() => {
                for (const player of world.getPlayers()) {
                    run({ player1: player });
                }
            });
        },
        runWhen: (opts) => opts.playerFilter == true,
        run(opts, actions, { player1 }) {
            for (const action of actions) {
                if (action.type == 0) {
                    actionParser.runAction(player1, action.value);
                }
            }
        },
        initOptions: [
            {
                type: "condition",
                name: "playerFilter",
                display: "Player Filter",
                player: "player1",
            },
        ],
        actionTypes: [
            {
                type: 0,
                name: "Command",
                inputMethod: "string",
            },
        ],
    },
    {
        name: "Initialize",
        type: 1,
        icon: "textures/azalea_icons/other/glow",
        setup(run) {
            system.runInterval(() => {
                run();
            }, 2);
        },
        run(opts, actions, opts2, event) {
            if (eventsRan[event.updatedAt]) return;
            for (const action of actions) {
                if (action.type == 0) {
                    world.getDimension("overworld").runCommand(action.value);
                }
            }
            eventsRan[event.updatedAt] = true;
        },
        actionTypes: [
            {
                type: 0,
                name: "Command",
                inputMethod: "string",
            },
        ],
        initOptions: [
            {
                type: "toggle",
                name: "disabled",
                display: "Disabled",
            },
        ],
        runWhen: (opts) => !opts.disabled,
    },
];
