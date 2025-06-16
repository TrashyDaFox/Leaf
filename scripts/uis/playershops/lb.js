import config from "../../versionData";
import uiManager from "../../uiManager";
import { ActionForm } from "../../lib/form_func";
import { NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import { shopStats } from "../shop/category";
import { themes } from "../uiBuilder/cherryThemes";

uiManager.addUI(config.uiNames.PlayerShops.Leaderboard, "yes", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[25][0]}§rPlayer Shop Leaderboards`)
    form.button(`§aSort by most sales\n§7Show shops with the most sales`, null, (player)=>{

    })
    form.button(`§bSort by money made\n§7Show shops with the most money made`, null, (player)=>{

    })
    form.show(player, false, (player, response)=>{

    })
})
