import { Effect, EffectType, Player, system, TicksPerSecond } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
import configAPI from "../api/config/configAPI";
import { prismarineDb } from "../lib/prismarinedb";

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomLocation() {
    let radius = configAPI.getProperty("RTPRadius");
    let x = randomNumber(-radius, radius);
    let z = randomNumber(-radius, radius);
    return {x, z};
}

function startRTP(player) {
    let msg = {sender: player}
    let loc1 = {
        x: msg.sender.location.x,
        y: msg.sender.location.y,
        z: msg.sender.location.z,
    }

    let {x, z} = generateRandomLocation();
    let y = msg.sender.dimension.heightRange.max;
    let sender = msg.sender;
    if(!(sender instanceof Player)) return;
    if(!sender.isValid) return;
    sender.camera.fade({
        fadeColor: {
            red: 0,
            green: 0,
            blue: 0
        },
        'fadeTime': {
            'fadeInTime': 0.1,
            'holdTime': 10,
            'fadeOutTime': 0
        }
    })
    msg.sender.teleport({x, y, z});

    sender.sendMessage(`§d§lWAITING §r§7>> §fFinding safe location`)
    let interval = system.runInterval(()=>{
        if(!sender.isValid) {
            system.clearRun(interval)
            return;
        }
        sender.camera.fade({
            fadeColor: {
                red: 0,
                green: 0,
                blue: 0
            },
            'fadeTime': {
                'fadeInTime': 0.4,
                'holdTime': 0.4,
                'fadeOutTime': 0.5
            }
        })
        try {
            let block = sender.dimension.getBlock({ x: x, y: 0, z: z })
            if(!block) return;
            let foundBlock = false;
            function reroll() {
                let randomLocation = generateRandomLocation();
                x = randomLocation.x
                z = randomLocation.z
                y = sender.dimension.heightRange.max
                msg.sender.teleport({x, y, z});
            }
            for (let i = sender.dimension.heightRange.max - 2; i >= sender.dimension.heightRange.min; i--) {
                let block = sender.dimension.getBlock({x, y: i, z})
    
                if(block.typeId.includes('light_block')) continue;
    
                if(block.isSolid) {
                    x = block.center().x
                    z = block.center().z
                    foundBlock = true;
                    y = block.center().y + 1
                    break;
                }

                if(block.isLiquid) {
                    return reroll();
                }
            }
            if(!foundBlock) {
                return reroll();
            }
            sender.addEffect("instant_health", TicksPerSecond * 10, {amplifier: 255})
            sender.addEffect("resistance", TicksPerSecond * 10, {amplifier: 255})
            sender.teleport({x, y, z});
            system.clearRun(interval);
            msg.sender.success("Teleported to " + x + ", " + z);    
            sender.camera.fade({
                fadeColor: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                'fadeTime': {
                    fadeInTime: 0,
                    holdTime: 0,
                    fadeOutTime: 0
                }
            })
        } catch {
            try {
                msg.sender.teleport(loc1)
                system.clearRun(interval);

            } catch {
                system.clearRun(interval);

            }

        }
    },3);
}

commandManager.addCommand("rtp", {description: "Teleport to a random location"}, ({msg, args})=>{
    if(!configAPI.getProperty("RTPEnabled")) {
        msg.sender.error("RTP is not enabled");
        return;
    }
    if(msg.sender.dimension.id != "minecraft:overworld") return msg.sender.error("You need to be in the overworld for this")
    let rtpCost = configAPI.getProperty("RTPCost");
    let rtpCurrency = configAPI.getProperty("RTPCurrency");
    if(prismarineDb.economy.getMoney(msg.sender, rtpCurrency) < rtpCost) {
        msg.sender.error("You do not have enough " + rtpCurrency + " to use this command");
        return;
    }
    if(rtpCost > 0) {
        prismarineDb.economy.removeMoney(msg.sender, rtpCost, rtpCurrency);
    }
    startRTP(msg.sender)
})