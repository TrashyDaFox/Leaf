import { world } from "@minecraft/server";
import emojis from "../../api/emojis";
import config from "../../versionData";
// import { ModalForm, prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import { prismarineDb } from "../../lib/prismarinedb";
import { ModalForm } from "../../lib/form_func";

uiManager.addUI(config.uiNames.CurrencyEditorAdd, "Add a currency", (player, currencyScoreboard = null)=>{
    // prismarineDb.economy.addCurrency(scoreboard, symbol, displayName);
    let data = {};
    if(currencyScoreboard) {
        data.symbol = prismarineDb.economy.getCurrency(currencyScoreboard).symbol;
        data.displayName = prismarineDb.economy.getCurrency(currencyScoreboard).displayName;
        data.scoreboard = prismarineDb.economy.getCurrency(currencyScoreboard).scoreboard;
    }
    let form = new ModalForm();
    form.textField("Scoreboard Objective (Leave Blank To Delete)", "adsdagdsgf", data.scoreboard ? data.scoreboard : undefined);
    let emojis1 = [];
    let emojis2 = [];
    for(const emoji in emojis) {
        emojis1.push(`${emojis[emoji]} :${emoji}:`)
        emojis2.push(emojis[emoji])
    }
    form.dropdown("Symbol", emojis1.map(_=>{return {option: _, callback() {}}}), data.symbol ? emojis2.indexOf(data.symbol) >= 0 ? emojis2.indexOf(data.symbol) : 0 : 0);
    form.textField("Display Name", "adfgds", data.displayName ? data.displayName : undefined);
    form.show(player, false, function(player, response) {
        if(currencyScoreboard) {
            if(!response.formValues[0]) {
                uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this currency?", ()=>{
                    prismarineDb.economy.deleteCurrency(currencyScoreboard);
                    uiManager.open(player, config.uiNames.CurrencyEditor)
                }, ()=>{
                    uiManager.open(player, config.uiNames.CurrencyEditorAdd, currencyScoreboard)
                })
                return;
            }
            prismarineDb.economy.editDisplayName(currencyScoreboard, response.formValues[2])
            if(this.get("scoreboard") != currencyScoreboard) prismarineDb.economy.editScoreboard(currencyScoreboard, response.formValues[0]);
            prismarineDb.economy.editSymbol(currencyScoreboard, emojis2[response.formValues[1]]);
            uiManager.open(player, config.uiNames.CurrencyEditor)
            return;
        }
        // world.sendMessage(emojis2[this.get("symbol")])
        prismarineDb.economy.addCurrency(
            this.get("scoreboard"),
            emojis2[this.get("symbol")],
            this.get("display-name")
        )
        uiManager.open(player, config.uiNames.CurrencyEditor)
    })
})