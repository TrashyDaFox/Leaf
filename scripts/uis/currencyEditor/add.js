import { world } from "@minecraft/server";
import emojis from "../../api/emojis";
import config from "../../versionData";
// import { ModalForm, prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import { prismarineDb } from "../../lib/prismarinedb";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { NUT_UI_MODAL, NUT_UI_TAG } from "../preset_browser/nutUIConsts";

uiManager.addUI(
    config.uiNames.CurrencyEditorAdd,
    "Add a currency",
    (player, currencyScoreboard = null, data = {}) => {
        let form2 = new ActionForm();
        if(!data.scoreboard) {
            if (currencyScoreboard) {
                data.symbol =
                    prismarineDb.economy.getCurrency(currencyScoreboard).symbol;
                data.displayName =
                    prismarineDb.economy.getCurrency(
                        currencyScoreboard
                    ).displayName;
                data.scoreboard =
                    prismarineDb.economy.getCurrency(currencyScoreboard).scoreboard;
            } else {
                data.symbol = emojis.coins;
                data.displayName = "Test Currency"
                data.scoreboard = "test"
            }
    
        }

        form2.title(`${NUT_UI_TAG}§r§fCurrency Setup`)
        form2.button(`§dSet settings\n§7Edit the basic settings of this curnc`, null, (player)=>{
            let form = new ModalForm();
            form.title(NUT_UI_MODAL + "Do a curnc");
            form.textField(
                "Scoreboard Objective",
                "adsdagdsgf",
                data.scoreboard ? data.scoreboard : undefined
            );
            form.textField(
                "Display Name",
                "adfgds",
                data.displayName ? data.displayName : undefined
            );
            form.show(player, false, function (player, response) {
                if(response.canceled) return uiManager.open(player, config.uiNames.CurrencyEditorAdd, currencyScoreboard, data)
                data.scoreboard = response.formValues[0]
                data.displayName = response.formValues[1]
                uiManager.open(player, config.uiNames.CurrencyEditorAdd, currencyScoreboard, data)
            })
        })
        form2.button(`§bSet Symbol\n§7Set this curnc's symbo0l (current: ${data.symbol})`, null, (player)=>{
            uiManager.open(player, config.uiNames.EmojiSelector, (emoji)=>{
                if(emoji != null) {
                    data.symbol = emojis[emoji]
                }
                uiManager.open(player, config.uiNames.CurrencyEditorAdd, currencyScoreboard, data)
            })
        })
        if(currencyScoreboard) {
            form2.button(`§cDelete\n§7Delete this curnc`, `textures/azalea_icons/Delete`, (player)=>{
                uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this curnc?", ()=>{
                    prismarineDb.economy.deleteCurrency(currencyScoreboard)
                    uiManager.open(player, config.uiNames.CurrencyEditor)
                }, ()=>{
                    uiManager.open(player, config.uiNames.CurrencyEditorAdd, currencyScoreboard, data)
                })
            })
        }
        form2.button(`${currencyScoreboard ? "Save" : "Create"}`, currencyScoreboard ? `textures/azalea_icons/Save` : `textures/azalea_icons/other/add`, (player)=>{
            if(currencyScoreboard) {
                prismarineDb.economy.editDisplayName(currencyScoreboard, data.displayName)
                prismarineDb.economy.editScoreboard(currencyScoreboard, data.scoreboard)
                prismarineDb.economy.editSymbol(currencyScoreboard, data.symbol)
            } else {
                prismarineDb.economy.addCurrency(data.scoreboard, data.symbol, data.displayName)
            }
            uiManager.open(player, config.uiNames.CurrencyEditor)
        })
        // let data = {};
        form2.show(player, false, (player, response)=>{

        })
        // prismarineDb.economy.addCurrency(scoreboard, symbol, displayName);
        // let form = new ModalForm();
        // form.title(NUT_UI_MODAL + "Do a curnc");
        // form.textField(
            // "Scoreboard Objective (Leave Blank To Delete)",
            // "adsdagdsgf",
        //     data.scoreboard ? data.scoreboard : undefined
        // );
        // let emojis1 = [];
        // let emojis2 = [];
        // for (const emoji in emojis) {
        //     emojis1.push(`${emojis[emoji]} :${emoji}:`);
        //     emojis2.push(emojis[emoji]);
        // }
        // form.dropdown(
        //     "Symbol",
        //     emojis1.map((_) => {
        //         return { option: _, callback() {} };
        //     }),
        //     data.symbol
        //         ? emojis2.indexOf(data.symbol) >= 0
        //             ? emojis2.indexOf(data.symbol)
        //             : 0
        //         : 0
        // );
        // form.textField(
        //     "Display Name",
        //     "adfgds",
        //     data.displayName ? data.displayName : undefined
        // );
        // form.show(player, false, function (player, response) {
        //     if (currencyScoreboard) {
        //         if (!response.formValues[0]) {
        //             uiManager.open(
        //                 player,
        //                 config.uiNames.Basic.Confirmation,
        //                 "Are you sure you want to delete this currency?",
        //                 () => {
        //                     prismarineDb.economy.deleteCurrency(
        //                         currencyScoreboard
        //                     );
        //                     uiManager.open(
        //                         player,
        //                         config.uiNames.CurrencyEditor
        //                     );
        //                 },
        //                 () => {
        //                     uiManager.open(
        //                         player,
        //                         config.uiNames.CurrencyEditorAdd,
        //                         currencyScoreboard
        //                     );
        //                 }
        //             );
        //             return;
        //         }
        //         prismarineDb.economy.editDisplayName(
        //             currencyScoreboard,
        //             response.formValues[2]
        //         );
        //         if (response.formValues[0] != currencyScoreboard)
        //             prismarineDb.economy.editScoreboard(
        //                 currencyScoreboard,
        //                 response.formValues[0]
        //             );
        //         prismarineDb.economy.editSymbol(
        //             currencyScoreboard,
        //             emojis2[response.formValues[1]]
        //         );
        //         uiManager.open(player, config.uiNames.CurrencyEditor);
        //         return;
        //     }
        //     // world.sendMessage(emojis2[this.get("symbol")])
        //     prismarineDb.economy.addCurrency(
        //         response.formValues[0],
        //         emojis2[response.formValues[1]],
        //         response.formValues[2]
        //     );
        //     uiManager.open(player, config.uiNames.CurrencyEditor);
        // });
    }
);
