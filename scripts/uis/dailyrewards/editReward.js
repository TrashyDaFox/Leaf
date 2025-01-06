import dailyRewards from "../../api/dailyRewards";
import { array_move } from "../../api/utils/array_move";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";

//as
uiManager.addUI(config.uiNames.DailyRewards.EditReward, "Edit daily reward", (player, index, rewardsKey = "REWARDS")=>{
    let form = new ActionForm();
    let rewards = dailyRewards.getRewards(rewardsKey);
    let reward = rewards[index];
    let text = [];
    if(reward.type == "command") {
        text.push(`Reward Type: §eCommand`);
        text.push(`Claim Message: §e${reward.message}`);
        text.push(`Claim Command: §e${reward.command}`);
    } else {
        text.push(`Reward Type: §eCurrency`);
        let currency = prismarineDb.economy.getCurrency(reward.currency) ? prismarineDb.economy.getCurrency(reward.currency) : prismarineDb.economy.getCurrency('default');
        text.push(`Amount: ${currency.symbol} §e${reward.amount}`);
    }
    form.body(text.join('\n§r'))
    form.button(`§eEdit\n§7Edit this daily reward`, null, (player)=>{
        uiManager.open(player, config.uiNames.DailyRewards.AddReward, {}, index, rewardsKey);
    })
    form.button(`§cDelete\n§7Delete this daily reward`, null, (player)=>{
        uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this reward?", ()=>{
            rewards.splice(index, 1);
            dailyRewards.keyval.set(rewardsKey, rewards);
            uiManager.open(player, config.uiNames.DailyRewards.Root)
        }, ()=>{
            uiManager.open(player, config.uiNames.DailyRewards.EditReward, index, rewardsKey);
        })
    })
    if(index > 0) {
        form.button(`§dMove Up\n§7Make this reward go 1 day earlier`, null, (player)=>{
            array_move(rewards, index, index - 1);
            dailyRewards.keyval.set(rewardsKey, rewards);
            uiManager.open(player, config.uiNames.DailyRewards.Root, rewardsKey)
        })
    
    }
    if(index < rewards.length - 1) {
        form.button(`§dMove Down\n§7Make this reward go 1 day later`, null, (player)=>{
            array_move(rewards, index, index + 1);
            dailyRewards.keyval.set(rewardsKey, rewards);
            uiManager.open(player, config.uiNames.DailyRewards.Root, rewardsKey)
        })
    }
    form.show(player, false, (player, response)=>{

    })
})