import configAPI from "../../api/config/configAPI";
import OpenClanAPI from "../../api/OpenClanAPI";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Clans.Create, "Create a clan", (player, defaultValue = null, error = null)=>{
    if(!configAPI.getProperty("Clans")) return player.sendMessage("Clans are not enabled");
    if(configAPI.getProperty("clans:enable_pay_to_create")) {
        let amount = prismarineDb.economy.getMoney(player, configAPI.getProperty("clans:clan_price_currency"));
        if(amount < configAPI.getProperty("clans:clan_price")) {
            let actionForm = new ActionForm();
            actionForm.title("Error");
            let currency = configAPI.getProperty("clans:clan_price_currency");
            let requiredAmount = configAPI.getProperty("clans:clan_price")
            actionForm.body(`You dont have enough money to create a clan. You require §e${prismarineDb.economy.getCurrency(currency).symbol} ${requiredAmount}`);
            actionForm.button(`§cBack\n§7Go back to main clans page`, `textures/blocks/barrier`, (player)=>{
                uiManager.open(player, config.uiNames.Clans.Root);
            });
            actionForm.show(player, false, (player, response)=>{

            });
            return;
        }
    }
    let modal = new ModalForm();
    modal.textField(`${error ? `§c${error}\n\n` : ``}Name (a-z A-Z 0-9)`, "leaf")
    modal.show(player, false, (player, response)=>{
        if(response.canceled) return;
        try {
            let clan = OpenClanAPI.createClan(player, response.formValues[0]);
            uiManager.open(player, config.uiNames.Clans.Root);
        } catch(e) {
            uiManager.open(player, config.uiNames.Clans.Create, response.formValues[0], e)
        }
    })
})