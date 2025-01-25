import { HudElement, HudVisibility, system, world } from "@minecraft/server";
import blockDb from "../blockDb";
import config from "../config";
import { ModalForm } from "../lib/form_func";
import uiManager from "../uiManager";
import actionParser from "../api/actionParser";
import { prismarineDb } from "../lib/prismarinedb";
let inUI = new Map();
uiManager.addUI(config.uiNames.BlockEditor, "Block editor", (player, vec3)=>{
    let modalForm = new ModalForm();
    let blockData = blockDb.getBlockData(vec3);
    let defaultVal = undefined;
    if(blockData && blockData.action) {
        defaultVal = blockData.action;
    }
    modalForm.textField("On Interaction Action", "Example: /say hi", defaultVal);
    modalForm.submitButton("Edit");
    modalForm.show(player, false, (player, response)=>{
        blockDb.setBlockData(vec3, {action:response.formValues[0]});
    }).then(res=>{
        inUI.delete(player.id);

    })
})
let usingBlockEditor = new Map();
system.runInterval(()=>{
    for(const player of world.getPlayers()) {
        continue;
        if(player.hasTag("chunk-borders")) {
            let chunkX = Math.floor(player.location.x / 16) * 16;
            let chunkZ = Math.floor(player.location.z / 16) * 16;
            for(let i = player.dimension.heightRange.min;i < player.dimension.heightRange.max+1;i++) {
                player.spawnParticle(`leaf:border`, {x: chunkX, y: i, z: chunkZ})
                player.spawnParticle(`leaf:border`, {x: chunkX, y: i, z: chunkZ+16})
                player.spawnParticle(`leaf:border`, {x: chunkX+16, y: i, z: chunkZ})
                player.spawnParticle(`leaf:border`, {x: chunkX+16, y: i, z: chunkZ+16})
                if(i % 16 == 0 || i == player.dimension.heightRange.max - 1 || i == player.dimension.heightRange.min) {
                    for(let i2 = 0;i2 < 16;i2++) {
                        player.spawnParticle(`leaf:border`, {x: chunkX+i2, y: i, z: chunkZ})
                        player.spawnParticle(`leaf:border`, {x: chunkX, y: i, z: chunkZ+i2})
                        player.spawnParticle(`leaf:border`, {x: chunkX+16, y: i, z: chunkZ+i2})
                        player.spawnParticle(`leaf:border`, {x: chunkX+i2, y: i, z: chunkZ+16})
                    }
                }
            }
        }
        let inventory = player.getComponent('inventory');
        let item = inventory.container.getItem(player.selectedSlotIndex)
        if(item && item.typeId == 'leaf:block_editor') {
            usingBlockEditor.set(player.id, true)
            player.onScreenDisplay.setHudVisibility(HudVisibility.Hide, [HudElement.AirBubbles, HudElement.ItemText, HudElement.Hunger, HudElement.PaperDoll, HudElement.StatusEffects, HudElement.Armor, HudElement.Health])
            player.addTag("chunk-borders")
            let blocks = blockDb.getBlocks();
            let entities = player.dimension.getEntities({
                "location": player.location,
                closest: 32

            })
            if(entities && entities.length) {
                for(const entity of entities) {
                    if(entity.id == player.id) continue;
                    // world.sendMessage("a")
                    if(entity.getDynamicProperty("interact")) {
                        try {
                        // console.warn("a")
                        let location = entity.location
                        let block = {x: location.x, y: location.y, z: location.z};
                        // world.sendMessage(JSON.stringify(block))
                        player.spawnParticle(`leaf:border`, block)
                        player.spawnParticle(`leaf:border`, {...block, y: block.y+1})
                        player.spawnParticle(`leaf:border`, {...block, z: block.z+1})
                        player.spawnParticle(`leaf:border`, {...block, z: block.z+1, y: block.y+1})
                        player.spawnParticle(`leaf:border`, {...block, x: block.x+1})
                        player.spawnParticle(`leaf:border`, {...block, x: block.x+1, y: block.y+1})
                        player.spawnParticle(`leaf:border`, {...block, x: block.x+1, z: block.z+1})
                        player.spawnParticle(`leaf:border`, {...block, x: block.x+1, z: block.z+1, y: block.y+1})
                        player.spawnParticle(`leaf:border`, {...block, x: block.x+1, z: block.z+1, y: block.y+1})
                        player.spawnParticle(`leaf:border`, {...block, x: block.x+1, z: block.z+1, y: block.y+1})

                        } catch {}

                    }
                }
            }
            for(const block of blocks) {
                let blockData = blockDb.getBlockData(block);
                if(!blockData.action) continue;
                try {
                    player.spawnParticle(`leaf:border`, block)
                    player.spawnParticle(`leaf:border`, {...block, y: block.y+1})
                    player.spawnParticle(`leaf:border`, {...block, z: block.z+1})
                    player.spawnParticle(`leaf:border`, {...block, z: block.z+1, y: block.y+1})
                    player.spawnParticle(`leaf:border`, {...block, x: block.x+1})
                    player.spawnParticle(`leaf:border`, {...block, x: block.x+1, y: block.y+1})
                    player.spawnParticle(`leaf:border`, {...block, x: block.x+1, z: block.z+1})
                    player.spawnParticle(`leaf:border`, {...block, x: block.x+1, z: block.z+1, y: block.y+1})
                    player.spawnParticle(`leaf:border`, {...block, x: block.x+1, z: block.z+1, y: block.y+1})
                    player.spawnParticle(`leaf:border`, {...block, x: block.x+1, z: block.z+1, y: block.y+1})


                } catch {}
            }
            let blockFromView = player.getBlockFromViewDirection({
                maxDistance: 6
            });
            if(blockFromView && blockFromView.block) {
                let blockData = blockDb.getBlockData(blockFromView.block.location);
                if(blockData && blockData.action) {
                    player.onScreenDisplay.setActionBar(`${blockData.action}\nSneak and use the item to open chunk property editor\nUse this on an entity to open entity property editor`)
                } else {
                    player.onScreenDisplay.setActionBar("No Action\nSneak and use the item to open chunk property editor\nUse this on an entity to open entity property editor")
                }
            } else {
                player.onScreenDisplay.setActionBar("Sneak and use the item to open chunk property editor\nUse this on an entity to open entity property editor")
            }
        } else if(usingBlockEditor.has(player.id)) {
            player.removeTag("chunk-borders")
            usingBlockEditor.delete(player.id);
            player.onScreenDisplay.setActionBar("");
            player.onScreenDisplay.setHudVisibility(HudVisibility.Reset, [HudElement.AirBubbles, HudElement.ItemText, HudElement.Hunger, HudElement.PaperDoll, HudElement.StatusEffects, HudElement.Armor, HudElement.Health])
        }
    }
},10);
world.beforeEvents.itemUse.subscribe(e=>{
    if(e.itemStack.typeId == "leaf:wblock_editor" && e.source && e.source.typeId == "minecraft:player" && e.source.isSneaking) {
        world.sendMessage("Opening chunk editor!")
        return;
    }

    if(e.itemStack.typeId == "leaf:block_editor" && e.source) {
        let block = e.source.getBlockFromViewDirection({
            maxDistance: 6
        });
        let entity = e.source.getEntitiesFromViewDirection({
            maxDistance: 6
        })
        if(!block && !entity.length) e.source.error("Please use this on a block or entity, or sneak and use the item to open chunk property editor")
    }

});
world.beforeEvents.playerInteractWithEntity.subscribe(e=>{
    if(e.itemStack && e.itemStack.typeId == 'leaf:block_editor' && prismarineDb.permissions.hasPermission(e.player, "blockeditor.open") && !e.player.isSneaking) {
        system.run(()=>{
            uiManager.open(e.player, config.uiNames.EntityEditor, e.target)

        })
    }
})
world.beforeEvents.playerInteractWithBlock.subscribe(e=>{
    if(!e.isFirstEvent) return;
    if(e.itemStack && e.itemStack.typeId == 'leaf:block_editor' && !inUI.has(e.player.id) && prismarineDb.permissions.hasPermission(e.player, "blockeditor.open")) {
        if(e.player.isSneaking) return;
        inUI.set(e.player.id, true);
        system.run(()=>{
            uiManager.open(e.player, config.uiNames.BlockEditor, e.block.location);
        })
        return;
    }
    if(e.itemStack && e.itemStack.typeId == 'leaf:block_editor') return;
    let blockData = blockDb.getBlockData(e.block.location);
    let defaultVal = undefined;
    if(blockData && blockData.action) {
        defaultVal = blockData.action;
    }
    if(defaultVal) {
        e.cancel = true;
        system.run(()=>{
            actionParser.runAction(e.player, defaultVal)
        })
    }
})