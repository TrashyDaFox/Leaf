import configAPI from "../../api/config/configAPI";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";

uiManager.addUI(versionData.uiNames.ChatRanks.Main, "ytesss", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rChatranks`)
    form.button(`${configAPI.getProperty("UseNewRanks") ? `§aEnable Legacy Ranks (Not Recommended)` : `§cDisable Legacy Ranks`}\n§7Choose between leafs old ranks and new ones`, null, (player)=>{
        configAPI.setProperty("UseNewRanks", !configAPI.getProperty("UseNewRanks"))
        uiManager.open(player, versionData.uiNames.ChatRanks.Main)
    })
    if(configAPI.getProperty("UseNewRanks")) {
        // SingleRankMode
        form.button(`${configAPI.getProperty("SingleRankMode") ? `§cDisable Single Rank Mode` :`§aEnable Single Rank Mode`}\n§7Choose if only 1 rank shows at a time`, null, (player)=>{
            configAPI.setProperty("SingleRankMode", !configAPI.getProperty("SingleRankMode"))
            uiManager.open(player, versionData.uiNames.ChatRanks.Main)
        })
    }
    form.button(`§eEdit Defaults\n§7Edit default ranks and colors`, null, (player)=>{
        uiManager.open(player, versionData.uiNames.ChatRanks.Config)
    })
    if(configAPI.getProperty("UseNewRanks")) {
        form.button(`§dEdit Ranks\n§7Edit this servers ranks`, null, (player)=>{
            uiManager.open(player, versionData.uiNames.ChatRanks.Ranks.Edit)
        })
    }
    form.show(player, false, (player, response)=>{

    })
})