import { Player, system, world } from "@minecraft/server";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { ModalForm } from "../../lib/form_func";

world.beforeEvents.itemUse.subscribe(e=>{
    if(e.source.typeId != "minecraft:player") return; // if ur not a player fuck you

    if(!e.itemStack.typeId.startsWith('leaf:wand')) return; // also fuck you if ur not using a wand

    e.cancel = true;

    system.run(()=>{
        if(e.itemStack.getDynamicProperty('location')) {
            e.source.camera.fade({
                fadeColor: {
                    red: 1,
                    green: 1,
                    blue: 1
                },
                fadeTime: {
                    fadeInTime: 0.1,
                    fadeOutTime: 0.25,
                    holdTime: 0.2
                }
            })
            e.source.teleport(e.itemStack.getDynamicProperty('location'), {
                dimension: world.getDimension(e.itemStack.getDynamicProperty('dimension'))
            })

            e.source.success("Teleported")
            system.runTimeout(()=>{
                e.source.playSound("mob.endermen.portal", {
                    location: e.itemStack.getDynamicProperty('location')
                })
                e.source.playAnimation("")
            },2)
            return;
        }
        uiManager.open(e.source, versionData.uiNames.WandSetup)
    })
})

uiManager.addUI(versionData.uiNames.WandSetup, "a", (player)=>{
    let modalForm = new ModalForm();
    modalForm.title("Wand Setup")
    modalForm.textField("Wand Label", "Type a name for this wand", "")
    modalForm.show(player, false, (player, response)=>{
        // if(!(player instanceof Player)) return;
        if(response.canceled) {
            player.playSound("random.glass")
            return player.error("Cancelled")
        }
        let inventory = player.getComponent('inventory')
        let wand = inventory.container.getItem(player.selectedSlotIndex)
        if(!wand || !wand.typeId.startsWith('leaf:wand')) return;
        wand.setDynamicProperty('location', player.location)
        wand.setDynamicProperty('dimension', player.dimension.id)
        player.playSound("random.levelup")
        wand.nameTag = `§r§v${response.formValues[0]}`
        wand.setLore([`§r§a[ Click to teleport ]`])
        inventory.container.setItem(player.selectedSlotIndex, wand)
        player.success("Set up wand!")
    })
})