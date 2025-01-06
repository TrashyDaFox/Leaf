import { system, world } from "@minecraft/server";
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

world.beforeEvents.playerInteractWithBlock.subscribe(e=>{
    if(e.itemStack && e.itemStack.typeId == 'leaf:block_editor' && !inUI.has(e.player.id) && prismarineDb.permissions.hasPermission(e.player, "blockeditor.open")) {
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