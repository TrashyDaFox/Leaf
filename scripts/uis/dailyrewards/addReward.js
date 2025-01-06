import dailyRewards from "../../api/dailyRewards";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.DailyRewards.AddReward, "Edit Reward", (player, data = {}, index = -1, rewardsKey = "REWARDS")=>{
    let rewards = dailyRewards.getRewards(rewardsKey);
    if(index >= 0) {
        data = rewards[index];
    }
    if(!data.type) {
        let form = new ActionForm();
        form.button(`§nCommand Reward\n§7Run a command`, icons.resolve(`leaf/image-626`), (player)=>{
            data.type = "command";
            uiManager.open(player, config.uiNames.DailyRewards.AddReward, data, index, rewardsKey);
        })
        form.button(`§eCurrency Reward\n§7Give money to player`, icons.resolve(`leaf/image-479`), (player)=>{
            data.type = "currency";
            uiManager.open(player, config.uiNames.DailyRewards.AddReward, data, index, rewardsKey);
        })
        form.show(player, false, (player, response)=>{})
    } else {
        if(data.type == "command") {
            let modal = new ModalForm();
            modal.textField("Command§c*", "/give @s apple 64",  data.command ? data.command : undefined);
            modal.textField("Message on claim§c*", "You have received 64 apples!", data.message ? data.message : undefined);
            modal.show(player, false, (player, response)=>{
                if(response.canceled) return;
                if(!response.formValues[0] || !response.formValues[1]) uiManager.open(player, config.uiNames.DailyRewards.AddReward, data, index, rewardsKey);
                if(index >= 0) {
                    rewards[index].command = response.formValues[0];
                    rewards[index].message = response.formValues[1];
                    dailyRewards.keyval.set(rewardsKey, rewards);
                    uiManager.open(player, config.uiNames.DailyRewards.Root, rewardsKey);
                } else {
                    dailyRewards.createReward(rewardsKey, data.type, {command:response.formValues[0],message:response.formValues[1]});
                    uiManager.open(player, config.uiNames.DailyRewards.Root, rewardsKey);
                }
            })
        } else {
            //uiManager.addUI(config.uiNames.Basic.NumberSelector, "Number Select", (player, callback, label = "Price", showCurrencySelector = false, min = 0, max = Infinity, negativesAllowed = false, defaultValue = undefined, defaultCurrency = undefined, error = "")=>{
            uiManager.open(player, config.uiNames.Basic.NumberSelector, (player, num, currency)=>{
                if(!isNaN(num)) {
                    if(index >= 0) {
                        rewards[index].amount = num;
                        rewards[index].currency = currency;
                        dailyRewards.keyval.set(rewardsKey, rewards);
                        uiManager.open(player, config.uiNames.DailyRewards.Root, rewardsKey);
                    } else {
                        dailyRewards.createReward(rewardsKey, data.type, {currency:currency,amount:num})
                        uiManager.open(player, config.uiNames.DailyRewards.Root, rewardsKey);
                    }
                }
            }, "Reward Amount", true, 0, Infinity, false, data.amount ? data.amount : undefined, data.currency ? data.currency : undefined);
        }
    }
})