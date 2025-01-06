import { world } from "@minecraft/server";
import config from "../config";
import uiManager from "../uiManager";
import { ModalForm } from "../lib/form_func";
import { prismarineDb } from "../lib/prismarinedb";

uiManager.addUI(config.uiNames.Pay, "Pay UI", (player, error=null)=>{
    let modalForm = new ModalForm();
    modalForm.title(error ? `§c${error}` : "Pay");
    let playerList = world.getPlayers();
    let playerListDisplay = playerList.map(_=>_.name);
    modalForm.dropdown("Currency", prismarineDb.economy.getCurrencies().map(_=>{
        return {option:`${_.symbol} ${_.displayName}`,callback(){}}
    }))
    modalForm.dropdown("Player", playerListDisplay.map(_=>{
        return {
            option: _,
            callback() {}
        }
    }))
    modalForm.textField("Amount", "Example: 1000", undefined)
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return;
        if(!response.formValues[2] || !/^\d+$/.test(response.formValues[2])) return uiManager.open(player, config.uiNames.Pay, "Amount must be a positive number")
        let currency = prismarineDb.economy.getCurrencies()[response.formValues[0]].scoreboard;
        let amount = parseInt(response.formValues[2]);
        if(prismarineDb.economy.getMoney(player, currency) < amount) return uiManager.open(player, config.uiNames.Pay, "You dont have enough")
        uiManager.open(player, config.uiNames.Basic.Confirmation, `Are you sure you want to give §a${prismarineDb.economy.getCurrency(currency).symbol} ${response.formValues[2]} §rto §b${playerListDisplay[response.formValues[1]]}§r?`, ()=>{
            prismarineDb.economy.removeMoney(player, amount, currency);
            prismarineDb.economy.addMoney(playerList[response.formValues[1]], amount, currency)
        }, ()=>{
            return uiManager.open(player, config.uiNames.Pay, "Player cancelled")
        })
    })
})