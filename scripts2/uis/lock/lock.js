import { world } from "@minecraft/server";
import config from "../../versionData";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Lock, "defc", (player, selectedSlot)=>{
    let modalForm = new ModalForm();
    modalForm.title("Edit Lock")
    modalForm.dropdown("Mode", [
        {
            option: "Only you",
            callback() {}
        },
        {
            option: "Password",
            callback() {}
        }
    ])
    modalForm.textField("Password", "Passcode (if mode is set to password)")
    modalForm.submitButton("Create/Update Lock")
    modalForm.show(player, false, (player, response)=>{
        let inventory = player.getComponent("inventory");
        let item = inventory.container.getItem(selectedSlot)
        item.setLore([
            "§r§eHow to use: §7Put into a chest to lock it",
            "",
            `§r§eLock Owner: §7${player.name}`,
            `§r§eLock Mode: ${response.formValues[0] == 0 ? "§7Only lock owner" : `§7Password (${response.formValues[1]})`}`
        ])
        item.nameTag = `§r§6${player.name}'s Lock`
        item.setDynamicProperty("password", response.formValues[1])
        item.setDynamicProperty("mode", response.formValues[0])
        item.setDynamicProperty("owner", player.id)
        item.setDynamicProperty("id", Math.floor(Date.now()/1000))
        inventory.container.setItem(selectedSlot, item)
    })
})

world.afterEvents.itemUse.subscribe(e=>{
    if(e.itemStack.typeId == 'leaf:lock' && e.source.typeId === "minecraft:player") {
        uiManager.open(e.source, config.uiNames.Lock, e.source.selectedSlotIndex)
    }
})