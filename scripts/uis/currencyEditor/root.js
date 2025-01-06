import icons from "../../api/icons";
import config from "../../config";
import { ActionForm, prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.CurrencyEditor, "Currency Editor", (player)=>{
    let currencies = prismarineDb.economy.getCurrencies();
    let form = new ActionForm();
    form.button(`§aNew Currency\n§r§7Adds a new curnc`, `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, config.uiNames.CurrencyEditorAdd)        
    })
    for(const currency of currencies) {
        form.button(`§a(${currency.symbol}) §2${currency.scoreboard}\n§r§7${currency.displayName}`, icons.resolve("leaf/image-481"), (player)=>{
            uiManager.open(player, config.uiNames.CurrencyEditorAdd, currency.scoreboard);
        })
    }
    form.show(player, (player)=>{})
})