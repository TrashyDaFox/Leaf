import { world } from "@minecraft/server";
import emojis from "../../api/emojis";
import config from "../../config";
import { ModalForm, prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.CurrencyEditorAdd, "Add a currency", (player, currencyScoreboard = null)=>{
    // prismarineDb.economy.addCurrency(scoreboard, symbol, displayName);
    let data = {};
    if(currencyScoreboard) {
        data.symbol = prismarineDb.economy.getCurrency(currencyScoreboard).symbol;
        data.displayName = prismarineDb.economy.getCurrency(currencyScoreboard).displayName;
        data.scoreboard = prismarineDb.economy.getCurrency(currencyScoreboard).scoreboard;
    }
    let form = new ModalForm();
    form.textField("scoreboard", "Scoreboard Objective", "adsdagdsgf", data.scoreboard ? data.scoreboard : undefined);
    let emojis1 = [];
    let emojis2 = [];
    for(const emoji in emojis) {
        emojis1.push(`${emojis[emoji]} :${emoji}:`)
        emojis2.push(emojis[emoji])
    }
    form.dropdown("symbol", "Symbol", emojis1, data.symbol ? emojis2.indexOf(data.symbol) >= 0 ? emojis2.indexOf(data.symbol) : 0 : 0);
    form.textField("display-name", "Display Name", "adfgds", data.displayName ? data.displayName : undefined);
    form.show(player, function(player) {
        if(currencyScoreboard) {
            if(!this.get("scoreboard")) {
                uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this currency?", ()=>{
                    prismarineDb.economy.deleteCurrency(currencyScoreboard);
                    uiManager.open(player, config.uiNames.CurrencyEditor)
                }, ()=>{
                    uiManager.open(player, config.uiNames.CurrencyEditorAdd, currencyScoreboard)
                })
                return;
            }
            prismarineDb.economy.editDisplayName(currencyScoreboard, this.get("display-name"))
            if(this.get("scoreboard") != currencyScoreboard) prismarineDb.economy.editScoreboard(currencyScoreboard, this.get("scoreboard"));
            prismarineDb.economy.editSymbol(currencyScoreboard, emojis2[this.get("symbol")]);
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