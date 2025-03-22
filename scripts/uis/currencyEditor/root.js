import icons from "../../api/icons";
import config from "../../versionData";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import { NUT_UI_TAG, NUT_UI_LEFT_HALF, NUT_UI_RIGHT_HALF, NUT_UI_DISABLE_VERTICAL_SIZE_KEY } from "../preset_browser/nutUIConsts";
import { world } from "@minecraft/server";
import { ActionForm } from "../../lib/form_func";
uiManager.addUI(config.uiNames.CurrencyEditor, "Currency Editor", (player)=>{
    let currencies = prismarineDb.economy.getCurrencies();
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rCurrency Editor`)
    form.button(`§aNew Currency\n§r§7Adds a new curnc`, `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, config.uiNames.CurrencyEditorAdd)        
    })
    let i = 0;
    for(const currency of currencies) {
        i++;
        // world.sendMessage(JSON.stringify(currency))
        form.button(`${i == currencies.length && currencies.length % 2 != 0 ? `` : i % 2 == 0 ? `${NUT_UI_LEFT_HALF}` : `${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}`}${currency.default ? "§c§h§e§1" : ""}§r${currency.symbol} §6${currency.scoreboard}\n§r§7${currency.displayName}`, null, (player)=>{
            uiManager.open(player, config.uiNames.CurrencyEditorAdd, currency.scoreboard);
        })
    }
    form.show(player, false, (player)=>{})
})