import configAPI from "../../api/config/configAPI";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import { insertBackButton } from "../sharedUtils/insertBackButton";
import { themes } from "../uiBuilder/cherryThemes";

uiManager.addUI(versionData.uiNames.ChatRanks.Main, "ytesss", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[25][0]}§rChatranks`)
    insertBackButton(form, "scriptevent leafgui:config_menu_start_page")
    form.button(`${configAPI.getProperty("UseNewRanks") ? `§aEnable Legacy Ranks (Not Recommended)` : `§cDisable Legacy Ranks`}\n§7Choose between leafs old ranks and new ones`, `textures/azalea_icons/other/light_energy`, (player)=>{
        configAPI.setProperty("UseNewRanks", !configAPI.getProperty("UseNewRanks"))
        uiManager.open(player, versionData.uiNames.ChatRanks.Main)
    })
    form.divider()
    // arrow_lower_step
    // arrow_raise_step
    if(configAPI.getProperty("UseNewRanks")) {
        if(!configAPI.getProperty("SingleRankMode")) {
            form.button(`${configAPI.getProperty("HighestPrioriyRankFirst") ? "§eHighest Priority First" : "§6Lowest Priority First"}\n§7${configAPI.getProperty("HighestPrioriyRankFirst") ? "Highest priority ranks will show first" : "Lowest priority ranks will show first"}`, configAPI.getProperty("HighestPrioriyRankFirst") ? `textures/azalea_icons/other/arrow_raise_step` : `textures/azalea_icons/other/arrow_lower_step`, (player)=>{
                configAPI.setProperty("HighestPrioriyRankFirst", !configAPI.getProperty("HighestPrioriyRankFirst"))
                uiManager.open(player, versionData.uiNames.ChatRanks.Main)
            })
        }
        // SingleRankMode
        form.button(`${configAPI.getProperty("SingleRankMode") ? `§cDisable Single Rank Mode` :`§aEnable Single Rank Mode`}\n§7Choose if only 1 rank shows at a time`, `textures/azalea_icons/other/lock_vertical`, (player)=>{
            configAPI.setProperty("SingleRankMode", !configAPI.getProperty("SingleRankMode"))
            uiManager.open(player, versionData.uiNames.ChatRanks.Main)
        })
    }
    form.button(`§eEdit Defaults\n§7Edit default ranks and colors`, `textures/azalea_icons/other/paint_can`, (player)=>{
        uiManager.open(player, versionData.uiNames.ChatRanks.Config)
    })
    if(configAPI.getProperty("UseNewRanks")) {
        form.button(`§dEdit Ranks\n§7Edit this servers ranks`, `textures/azalea_icons/other/properties`, (player)=>{
            uiManager.open(player, versionData.uiNames.ChatRanks.Ranks.Edit)
        })
    }
    form.show(player, false, (player, response)=>{

    })
})