import { system, world } from "@minecraft/server";
import { setScore } from "./api/formatting/scores";

function dynTag(entity, bool, tag) {
    if(bool && !entity.hasTag(tag)) entity.addTag(tag)
    if(!bool && entity.hasTag(tag)) entity.removeTag(tag)
}

system.runInterval(()=>{
    for(const player of world.getPlayers()) {
        dynTag(player, player.isFalling, "isFalling")
        dynTag(player, player.isClimbing, "isClimbing")
        dynTag(player, player.isFlying, "isFlying")
        dynTag(player, player.isGliding, "isGliding")
        dynTag(player, player.isInWater, "isInWater")
        dynTag(player, player.isJumping, "isJumping")
        dynTag(player, player.isOnGround, "isOnGround")
        dynTag(player, player.isSneaking, "isSneaking")
        dynTag(player, player.isSprinting, "isSprinting")
        dynTag(player, player.isSwimming, "isSwimming")
        dynTag(player, player.isSleeping, "isSleeping")
        dynTag(player, player.isEmoting, "isEmoting")
        let health = player.getComponent('health')
        setScore("health", player, Math.floor(health.currentValue))
        setScore("x", player, Math.floor(player.location.x))
        setScore("y", player, Math.floor(player.location.y))
        setScore("z", player, Math.floor(player.location.z))
        setScore("selectedSlot", player, Math.floor(player.selectedSlotIndex))
        setScore("level", player, Math.floor(player.level))
        setScore("xpEarnedCurrentLevel", player, Math.floor(player.xpEarnedAtCurrentLevel))
        setScore("totalXpNeededForNextLevel", player, Math.floor(player.totalXpNeededForNextLevel))
    }
},1);

world.beforeEvents.playerBreakBlock.subscribe(e=>{
    if(e.player.hasTag("disable:break") || e.player.hasTag(`disable:blockbreak:${e.block.typeId.replace('minecraft:', '')}`)) e.cancel = true;
})

world.beforeEvents.playerPlaceBlock.subscribe(e=>{
    if(e.player.hasTag("disable:place") || e.player.hasTag(`disable:blockplace:${e.block.typeId.replace('minecraft:', '')}`)) e.cancel = true;
})

world.beforeEvents.playerInteractWithBlock.subscribe(e=>{
    let isGriefableBlock = e.block.hasTag('text_sign') || e.block.hasTag('log') || e.block.hasTag('trapdoors') || e.block.typeId.includes('comparator') || e.block.typeId.includes('repeater')
    if(e.player.hasTag('disable:grief') && isGriefableBlock) {
        e.cancel = true;
        return;
    }
    if(e.player.hasTag('disable:blockinteract')) {
        e.cancel = true;
        return;
    }
    if(e.player.hasTag(`disable:blockinteract:${e.block.typeId.replace('minecraft:', '')}`)) {
        e.cancel = true;
        return;
    }
})

world.beforeEvents.playerInteractWithEntity.subscribe(e=>{
    if(e.player.hasTag(`disable:grief`) && e.target.typeId == "minecraft:armor_stand") {
        e.cancel = true;
        return;
    }
    if(e.player.hasTag(`disable:entityinteract`) || e.player.hasTag(`disable:entityinteract:${e.target.typeId.replace('minecraft:', '')}`)) {
        e.cancel = true;
        return;
    }
})

world.afterEvents.playerSpawn.subscribe(async (e)=>{
    if(e.initialSpawn) e.player.addTag("playerInitialSpawn")
    e.player.addTag("playerSpawn")
    await system.waitTicks(1);
    if(e.player.hasTag("playerInitialSpawn")) e.player.removeTag("playerInitialSpawn")
    e.player.removeTag("playerSpawn")
})