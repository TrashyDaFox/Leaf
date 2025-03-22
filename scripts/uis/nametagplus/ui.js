import { system, world } from "@minecraft/server";
import configAPI from "../../api/config/configAPI";
import { formatStr } from "../../api/azaleaFormatting";
import uiManager from "../../uiManager";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";

configAPI.registerProperty("NametagPlusEnabled", configAPI.Types.Boolean, false)
configAPI.registerProperty("NametagPlusFormat", configAPI.Types.String, "<name>")

system.runInterval(()=>{
    for(const player of world.getPlayers()) {
        if(configAPI.getProperty("NametagPlusEnabled")) {
            player.nameTag = formatStr(configAPI.getProperty("NametagPlusFormat").replaceAll('<name_tag>', '<name>'), player).replaceAll('\\n', '\n')
        } else {
            player.nameTag = player.name;
        }
    }
})

uiManager.addUI("nametags_plus_config", "config", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rNametags+`)
    form.button(`${configAPI.getProperty("NametagPlusEnabled") ? "§cDisable" : "§aEnable"}\n§7[ Click to Toggle ]`, null, (player)=>{
        if(configAPI.getProperty("NametagPlusEnabled")) {
            configAPI.setProperty("NametagPlusEnabled", false)
        } else {
            configAPI.setProperty("NametagPlusEnabled", true)
        }
        uiManager.open(player, "nametags_plus_config")
    })
    form.button(`§bSet Format\n§7[ Click to Edit ]`, null, (player)=>{
        let modal = new ModalForm();
        modal.title("Code Editor")
        modal.textField("Format", "Format", configAPI.getProperty("NametagPlusFormat"))
        modal.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, "nametags_plus_config");
            configAPI.setProperty("NametagPlusFormat", response.formValues[0])
            return uiManager.open(player, "nametags_plus_config");
        })
    })
    form.show(player, false, (player, response)=>{

    })
})