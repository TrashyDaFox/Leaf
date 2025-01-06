import sidebarEditor from "../../api/sidebarEditor";
import config from "../../config";
import uiManager from "../../uiManager";
import { ModalForm } from "../../lib/form_func";
import { world } from "@minecraft/server";
import { prismarineDb } from "../../lib/prismarinedb";
import { sidebarConfig } from "../../configs";
uiManager.addUI(config.uiNames.SidebarEditorSettings, "Sidebar editor root", (player)=>{
    let form = new ModalForm();
    form.toggle("Enabled", sidebarConfig.get("enabled") ? true : false);
    form.show(player, false, (player, response)=>{
        sidebarConfig.set("enabled", response.formValues[0]);
        if(!response.formValues[0]) {
            for(const player of world.getPlayers()) player.onScreenDisplay.setTitle("");
        }
        uiManager.open(player, config.uiNames.SidebarEditorRoot);
    })
})