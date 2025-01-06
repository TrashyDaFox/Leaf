import { Direction, ItemStack, ScriptEventSource, system, world } from "@minecraft/server";
import { positionalDb, prismarineDb } from "../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../prismarineDbStorages/segmented";
import { ActionForm } from "../lib/form_func";
import icons from "./icons";
import playerStorage from "./playerStorage";
function directionAndVec3(dir, vec3) {
    if(dir == Direction.Up) {
        return {x: vec3.x, y: vec3.y + 1, z: vec3.z}
    } else if(dir == Direction.Down) {
        return {x: vec3.x, y: vec3.y - 1, z: vec3.z}
    } else if(dir == Direction.East) {
        return {x: vec3.x + 1, y: vec3.y, z: vec3.z}
    } else if(dir == Direction.West) {
        return {x: vec3.x - 1, y: vec3.y, z: vec3.z}
    } else if(dir == Direction.South) {
        return {x: vec3.x, y: vec3.y, z: vec3.z + 1}
    } else if(dir == Direction.North) {
        return {x: vec3.x, y: vec3.y, z: vec3.z - 1}
    } else {
        return {x: vec3.x, y: vec3.y, z: vec3.z}
    }
}
let blockMap = new Map();
system.runInterval(()=>{
    blockMap.clear();
},30);
class GeneratorAPI {
    constructor() {
        this.db = prismarineDb.customStorage("Generator", SegmentedStoragePrismarine);
        this.keyval = this.db.keyval("Gens");
        // this.db.clear();
        this.#initialize();
        system.afterEvents.scriptEventReceive.subscribe(e=>{
            if(e.id == "leaf:give_gen" && e.sourceType == ScriptEventSource.Entity) {
                let doc = this.db.findFirst({type:"GENERATOR",scriptevent:e.message});
                if(doc) {
                    e.sourceEntity.getComponent('inventory').container.addItem(this.getGeneratorItem(doc.id));
                }
            }
        })
        // system.runInterval(()=>{
        //     let entities = world.getDimension('overworld').getEntities({tags:["leaf:entity_clear"]});
        //     for(const entity of entities) {
        //         try {
        //             let despawnAt = entity.getDynamicProperty('despawn_at');
        //             if(Date.now() >= despawnAt) {
        //                 entity.remove();
        //             }
        //         } catch {}
        //     }
        // }, 20 * 10);
        // system.runInterval(()=>{
        //     let entities = world.getDimension('overworld').getEntities({tags:["generator_text"]});
        //     for(const entity of entities) {
        //         let tag = entity.getTags().find(_=>_.startsWith('generator_text:'));
        //         if(tag) {
        //             let uniqueId = tag.substring('generator_text:'.length);
        //             let vec3 = this.keyval.get(uniqueId);
        //             if(vec3) {
        //                 let pos = 
        //             }
        //         }
        //     }
        // },50);
        // world.beforeEvents.entityRemove.subscribe(e=>{
        //     if(e.removedEntity.typeId ==)
        // })
    }
    addGenerator(name, block, respawnTime, scriptevent) {
        return this.db.insertDocument({
            type: "GENERATOR",
            name,
            block,
            respawnTime,
            scriptevent,
            upgrades: []
        })
    }
    addGeneratorUpgrade(id, respawnTime, currency, price) {
        let doc = this.db.getByID(id);
        if(!doc) return;
        doc.data.upgrades.push({respawnTime, currency, price});
        this.db.overwriteDataByID(doc.id, doc.data)
    }
    getGenerators() {
        return this.db.findDocuments({type:"GENERATOR"})
    }
    placeGenerator(player, id, vec3_2, level = -1) {
        let doc = this.db.getByID(id);
        if(!doc) return;
        let vec3 = {x:Math.floor(vec3_2.x),y:Math.floor(vec3_2.y),z:Math.floor(vec3_2.z)}
        let pos = positionalDb.getPosition(vec3);
        let unique = Date.now().toString();
        pos.set("Generator", {id:doc.id, level: level, owner: playerStorage.getID(player), uniqueID:unique});
        let entity = world.getDimension('overworld').spawnEntity('leaf:floating_text', {x:vec3_2.x,y:vec3_2.y+1.75,z:vec3_2.z});
        entity.addTag("generator_text");
        entity.addTag(`generator_text:${unique}`);
        entity.nameTag = [`§b${doc.data.name}`,`Cooldown: §aReady`,`Cooldown Level: §a1§7/§b${doc.data.upgrades.length+1}`].join('\n§r');
        this.keyval.set(unique, vec3);
    }
    getGeneratorItem(genID, level = -1) {
        let doc = this.db.getByID(genID);
        if(!doc) return;
        let item = new ItemStack("leaf:generator");
        item.nameTag = `§r§l§a${doc.data.name}`;
        item.setLore([`§r§7Use on block to place`,` §r§5`]);
        item.setDynamicProperty(`GenID`, doc.id);
        if(level > -1) item.setDynamicProperty(`GenLevel`, level);
        return item;
    }
    #initialize() {
        world.beforeEvents.playerBreakBlock.subscribe(e=>{
            let pos = positionalDb.getPosition(e.block.location);
            if(pos.has("Generator") && this.db.getByID(pos.get("Generator").id)) {
                let doc = this.db.getByID(pos.get("Generator").id);
                let genData = pos.get("Generator");
                let genData2 = this.db.getByID(pos.get("Generator").id)
                if(e.block.permutation.matches("minecraft:bedrock")) {
                    e.cancel = true;
                    return;
                }
                system.run(()=>{
                    e.block.setType("minecraft:bedrock")
                    let tickDelay = genData.level >= 0 ? genData2.data.upgrades[genData.level].respawnTime * 20 : 20 * doc.data.respawnTime;                
                    let center = e.block.center();
                    let entity;
                    let entities = world.getDimension('overworld').getEntities({type:"leaf:floating_text",tags:[`generator_text:${genData.uniqueID}`]})
                    if(entities && entities.length) entity = entities[0];
                    if(!entity && genData.uniqueID) {
                        entity = world.getDimension('overworld').spawnEntity('leaf:floating_text', {x:center.x,y:center.y+1.75,z:center.z});
                        entity.addTag("generator_text");
                        entity.addTag(`generator_text:${genData.uniqueID}`);
                    }
                    let ticks = 0;
                    e.player.dimension.spawnParticle("leaf:magic", center)
                    let owner = playerStorage.getPlayerByID(genData.owner);
                    
                    // the source of the worlds problems frfr
                    let run = system.runInterval(()=>{
                        ticks++;
                        if(entity) {
                            entity.nameTag = [`§b${doc.data.name}`,`Cooldown: §c${Math.floor((tickDelay - ticks) / 20)}s`, `Cooldown Level: §a${genData.level+2}§7/§b${doc.data.upgrades.length+1}`].join('\n§r')
                        }
                        if(ticks % 20 == 0 && tickDelay - 15 >= ticks) {
                            e.player.dimension.spawnParticle("leaf:magic", center)
                        }
                        if(ticks >= tickDelay) {
                            system.clearRun(run)
                            e.block.setType(doc.data.block);
                            e.block.dimension.playSound("note.pling", center)
                            if(entity) {
                                entity.nameTag = [`§b${doc.data.name}`,`Cooldown: §aReady`,`Cooldown Level: §a${genData.level+2}§7/§b${doc.data.upgrades.length+1}`].join('\n§r')
                            }
                        }
    
                    }, 1);
    
                })

            }
        })
        world.afterEvents.playerInteractWithBlock.subscribe(e=>{
            let pos = positionalDb.getPosition(e.block.location);
            if(pos.has("Generator") && this.db.getByID(pos.get("Generator").id)) {
                if(blockMap.has(e.player.id)) return;
                blockMap.set(e.player.id, true);
                if(e.block.permutation.matches('minecraft:bedrock')) {
                    e.player.playSound("random.glass");
                    e.player.error(`You cant manage generators while they are on cooldown.`)
                    return;
                }
                let genData = pos.get("Generator");
                let genData2 = this.db.getByID(pos.get("Generator").id)
                let actionForm = new ActionForm();
                if(playerStorage.getID(e.player) == genData.owner || prismarineDb.permissions.hasPermission(e.player, "generator.manage")) {
                    actionForm.button(`§cToggle on/off\n§7Currently on`, icons.resolve("leaf/image-0910"), (player)=>{

                    });
    
                }
                if(playerStorage.getID(e.player) != genData.owner && !prismarineDb.permissions.hasPermission(e.player, "generator.manage")) {
                    actionForm.title(playerStorage.getID(e.player) != genData.owner && !prismarineDb.permissions.hasPermission(e.player, "generator.manage") ? "You do not own this generator" : "You hit max upgrades");
                    actionForm.button(`§cClose`, `textures/blocks/barrier`)
                } else if(genData.level >= genData2.data.upgrades.length - 1) {
                    actionForm.title(playerStorage.getID(e.player) != genData.owner && !prismarineDb.permissions.hasPermission(e.player, "generator.manage") ? "You do not own this generator" : "You hit max upgrades");
                    actionForm.button(`§cClose`, `textures/blocks/barrier`)
                } else {
                    actionForm.title(genData2.data.name);
                    let nextUpgrade = genData2.data.upgrades[genData.level + 1];
                    let currency = prismarineDb.economy.getCurrency(nextUpgrade.currency) ? prismarineDb.economy.getCurrency(nextUpgrade.currency) : prismarineDb.economy.getCurrency("default");
                    actionForm.button(`§6Upgrade (${nextUpgrade.respawnTime}s)\n§r§7${currency.symbol} ${nextUpgrade.price}`, icons.resolve("leaf/image-752"), (player)=>{
                        if(playerStorage.getID(e.player) == genData.owner) {
                            let money = prismarineDb.economy.getMoney(e.player, currency.scoreboard);
                            if(money >= nextUpgrade.price) {
                                prismarineDb.economy.removeMoney(e.player, nextUpgrade.price, currency.scoreboard);
                                genData.level++;
                                pos.set("Generator", genData)
                                e.player.playSound("random.levelup")
                                e.player.dimension.spawnParticle("azalea:absorbw", e.block.center())
                                e.player.sendMessage(`§aUpgraded generator to §eLevel ${genData.level + 2}`);
                            } else {
                                e.player.playSound("random.glass")
                            }
    
                        }
                    })
                    
                }
                if(playerStorage.getID(e.player) == genData.owner || prismarineDb.permissions.hasPermission(e.player, "generator.manage")) {
                    actionForm.button(`§eMove\n§7Move this generator`, icons.resolve("leaf/image-1289"), (player)=>{
                        if(pos.has("Generator")) {
                            let item = this.getGeneratorItem(genData2.id, genData.level);
                            player.getComponent('inventory').container.addItem(item);
                            player.dimension.setBlockType(e.block.location, 'minecraft:air')
                            pos.delete("Generator");
                            player.playSound("random.break");
                            let entities = world.getDimension('overworld').getEntities({type:'leaf:floating_text',tags:[`generator_text:${genData.uniqueID}`]})
                            for(const entity of entities) {
                                entity.remove();
                            }
                        }
                    })
                }
                actionForm.show(e.player, false, ()=>{})
            }
        })
        world.beforeEvents.itemUseOn.subscribe(e=>{
            system.run(()=>{
                console.warn("A")
                if(e.itemStack && e.itemStack.typeId == "leaf:generator") {
                    let newLoc = directionAndVec3(e.blockFace, e.block.center());
                    if(e.itemStack.getDynamicProperty(`GenID`)) {
                        if(blockMap.has(e.source.id)) return;
                        blockMap.set(e.source.id, true)
                        let doc = this.db.getByID(e.itemStack.getDynamicProperty(`GenID`))
                        e.source.dimension.getBlock(newLoc).setType(doc.data.block)
                        this.placeGenerator(e.source, doc.id, newLoc, e.itemStack.getDynamicProperty('GenLevel') ? e.itemStack.getDynamicProperty('GenLevel') : -1)
                        let inv = e.source.getComponent('inventory');
                        inv.container.setItem(e.source.selectedSlotIndex);
                        e.source.dimension.spawnParticle("azalea:fallingchant1", e.source.dimension.getBlock(newLoc).center())
                        e.source.dimension.spawnParticle("azalea:fallingchant2", e.source.dimension.getBlock(newLoc).center())
                        e.source.dimension.spawnParticle("azalea:fallingchant1", e.source.dimension.getBlock(newLoc).center())
                        e.source.dimension.spawnParticle("azalea:fallingchant2", e.source.dimension.getBlock(newLoc).center())
                        e.source.dimension.spawnParticle("azalea:green", e.source.dimension.getBlock(newLoc).center())
                        e.source.dimension.spawnParticle("azalea:vortex", e.source.dimension.getBlock(newLoc).center())
                        e.source.dimension.spawnParticle("leaf:leaf", e.source.dimension.getBlock(newLoc).center())
                        e.source.sendMessage(`§aYou have placed a §e${doc.data.name}§r§a!`)
                        e.source.dimension.playSound("block.end_portal.spawn", e.source.dimension.getBlock(newLoc).center())

                    }
                    return;
                }
            })
        })
    }
}

export default new GeneratorAPI();