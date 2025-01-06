import icons from "../../api/icons";
import config from "../../config";
import { ChestFormData } from "../../lib/chestUI";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.DailyRewards.Rewards, "Rewards", (player)=>{
    let chest = new ChestFormData('RW');
    chest.button(4, `§6§lDaily Rewards`, [`§7Claim your daily rewards`], icons.resolve(`leaf/image-626`), 1, false, ()=>{

    })
    chest.show(player).then(res=>{

    })
})