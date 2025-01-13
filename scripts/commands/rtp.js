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

commandManager.addCommand("rtp", {description: "Teleport to a random location"}, ({msg, args})=>{
    if(!configAPI.getProperty("RTPEnabled")) {
        msg.sender.error("RTP is not enabled");
        return;
    }
    let rtpCost = configAPI.getProperty("RTPCost");
    let rtpCurrency = configAPI.getProperty("RTPCurrency");
    if(prismarineDb.economy.getMoney(msg.sender, rtpCurrency) < rtpCost) {
        msg.sender.error("You do not have enough " + rtpCurrency + " to use this command");
        return;
    }
    if(rtpCost > 0) {
        prismarineDb.economy.removeMoney(msg.sender, rtpCost, rtpCurrency);
    }
    let {x, z} = generateRandomLocation();
    let y = msg.sender.dimension.heightRange.max;
    let sender = msg.sender;
    if(!(sender instanceof Player)) return;
    sender.isValid()
    msg.sender.teleport({x, y, z});
    let interval = system.runInterval(()=>{
        let block = sender.dimension.getBlock({ x: x, y: 0, z: z })
        if(!block) return;
        for (let i = sender.dimension.heightRange.max - 2; i >= sender.dimension.heightRange.min; i--) {
            let block = sender.dimension.getBlock({x, y: i, z})

            if(block.typeId.includes('light_block')) continue;

            if(!block.isAir && !block.isLiquid && block.above(1).isAir && block.above(2).isAir) {
                x = block.center().x
                z = block.center().z
                y = block.center().y + 1
                break;
            }

            if(block.isLiquid && block.above(1).isAir && block.above(2).isAir) {
                let randomLocation = generateRandomLocation();
                x = randomLocation.x
                z = randomLocation.z
                y = sender.dimension.heightRange.max
                msg.sender.teleport({x, y, z});
                return;
            }
        }
        sender.addEffect("instant_health", TicksPerSecond * 10, {amplifier: 255})
        sender.addEffect("resistance", TicksPerSecond * 10, {amplifier: 255})
        sender.teleport({x, y, z});
        system.clearRun(interval);
        msg.sender.success("Teleported to " + x + ", " + z);    
    },1);
})