import dailyRewards from "../../api/dailyRewards";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import moment from '../../lib/moment';
uiManager.addUI(config.uiNames.DailyRewards.Claim, "Claim Reward", (player)=>{
    let form = new ActionForm();
    form.title("Daily Rewards")
    if(dailyRewards.hasReward(player)) {
        form.body("You can claim a reward!");
        form.button("§eClaim\n§7Claim the reward", icons.resolve("Packs/Asteroid/winPING"), (player)=>{
            dailyRewards.claimDailyReward(player);
            uiManager.open(player, config.uiNames.DailyRewards.Claim);
        })
    } else {
        form.body(`You can claim another reward §e${moment(Date.now() + dailyRewards.millisecondsUntilNextDay()).fromNow()}`);
        form.button(`§cBack\n§7Go back`, `textures/blocks/barrier`, (player)=>{

        })
    }
    form.show(player, false, ()=>{})
});
uiManager.addUI(config.uiNames.DailyRewards.ClaimWeekly, "Claim Reward", (player)=>{
    let form = new ActionForm();
    form.title("Weekly Rewards")
    if(dailyRewards.hasRewardWeekly(player)) {
        form.body("You can claim a reward!");
        form.button("§eClaim\n§7Claim the reward", icons.resolve("Packs/Asteroid/winPING"), (player)=>{
            dailyRewards.claimWeeklyReward(player);
            uiManager.open(player, config.uiNames.DailyRewards.ClaimWeekly);
        })
    } else {
        form.body(`You can claim another reward §e${moment(Date.now() + dailyRewards.millisecondsUntilNextWeek()).fromNow()}`);
        form.button(`§cBack\n§7Go back`, `textures/blocks/barrier`, (player)=>{

        })
    }
    form.show(player, false, ()=>{})
});
uiManager.addUI(config.uiNames.DailyRewards.ClaimMonthly, "Claim Reward", (player)=>{
    let form = new ActionForm();
    form.title("Monthly Rewards")
    if(dailyRewards.hasRewardMonthly(player)) {
        form.body("You can claim a reward!");
        form.button("§eClaim\n§7Claim the reward", icons.resolve("Packs/Asteroid/winPING"), (player)=>{
            dailyRewards.claimMonthlyReward(player);
            uiManager.open(player, config.uiNames.DailyRewards.ClaimMonthly);
        })
    } else {
        form.body(`You can claim another reward §e${moment(Date.now() + dailyRewards.millisecondsUntilNextMonth()).fromNow()}`);
        form.button(`§cBack\n§7Go back`, `textures/blocks/barrier`, (player)=>{

        })
    }
    form.show(player, false, ()=>{})
});