import config from "../../config";
import { ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Basic.NumberSelector, "Number Select", (player, callback, label = "Price", showCurrencySelector = false, min = 0, max = Infinity, negativesAllowed = false, defaultValue = undefined, defaultCurrency = undefined, error = "")=>{
    let modal = new ModalForm();
    modal.textField(`${label}${error ? `\n§c${error}` : ``}`, `Type a number`, defaultValue ? defaultValue.toString() : undefined)
    let vals1 = prismarineDb.economy.getCurrencies().map(_=>{
        return `${_.symbol} ${_.displayName}`
    })
    let vals2 = prismarineDb.economy.getCurrencies().map(_=>_.scoreboard);
    if(showCurrencySelector) {
        modal.dropdown(`Currency`, vals1.map(_=>{
            return {
                option: _,
                callback() {}
            }
        }))
    }
    modal.show(player, false, (player, response)=>{
        if(response.canceled) return callback(player, NaN, undefined)
        if(!/^\d+$/.test(response.formValues[0])) return uiManager.open(player, config.uiNames.Basic.NumberSelector, callback, label, showCurrencySelector, min, max, negativesAllowed, defaultValue, "Value is not a number")
        let num = parseInt(response.formValues[0]);
        if(num < min) return uiManager.open(player, config.uiNames.Basic.NumberSelector, callback, label, showCurrencySelector, min, max, negativesAllowed, defaultValue, "Value is too low")
        if(num > max) return uiManager.open(player, config.uiNames.Basic.NumberSelector, callback, label, showCurrencySelector, min, max, negativesAllowed, defaultValue, "Value is too high")
        callback(player, num, showCurrencySelector ? vals2[response.formValues[1]] : undefined);
    })
})