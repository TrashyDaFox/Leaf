import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { themes } from "../uiBuilder/cherryThemes";
import { NUT_UI_OCEAN, NUT_UI_THEMED, NUT_UI_TAG, NUT_UI_HEADER_BUTTON, NUT_UI_PAPERDOLL } from "./nutUIConsts";

uiManager.addUI(versionData.uiNames.PresetBrowser.Root, "", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[5][0]}§rPreset Browser`)
    form.button(`${NUT_UI_HEADER_BUTTON}§r§c§lGo Back\n§r§7Click this button to go back to main settings`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, versionData.uiNames.ConfigMain)
    })
    form.show(player, false, ()=>{})
})