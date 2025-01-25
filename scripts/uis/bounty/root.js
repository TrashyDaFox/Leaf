import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Bounty.Root, "Bounties root", (player)=>{
    let form = new ActionForm();
    form.title("Bounties");
    form.button("Create a bounty", null, (player)=>{
        uiManager.open(player, config.uiNames.Bounty.Create)
    })
})