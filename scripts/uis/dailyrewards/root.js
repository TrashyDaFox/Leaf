import dailyRewards from "../../api/dailyRewards";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.DailyRewards.Root, "Yes", (player, rewardsKey = "REWARDS")=>{
    let form = new ActionForm();
    form.button(`§aAdd Reward\n§7Add a reward`, icons.resolve(`leaf/image-625`), (player)=>{
        uiManager.open(player, config.uiNames.DailyRewards.AddReward, {}, -1, rewardsKey);
    })
    let rewards = dailyRewards.getRewards(rewardsKey);
    for(let i = 0;i < rewards.length;i++) {
        let reward = rewards[i];
        form.button(`§bDay ${i+1}\n§7Reward Type: ${reward.type}`, icons.resolve(`leaf/image-625`), (player)=>{
            uiManager.open(player, config.uiNames.DailyRewards.EditReward, i, rewardsKey);
        });
    }
    form.show(player, false, (player, response)=>{})
})