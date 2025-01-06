import configAPI from "../../api/config/configAPI";
import inviteManager from "../../api/inviteManager";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Clans.ViewInvites, "View Invites", (player)=>{
    if(!configAPI.getProperty("Clans")) return player.sendMessage("Clans are not enabled");
    let form = new ActionForm();
    form.button(`§cBack\n§7Go back`, `textures/blocks/barrier`, (player)=>{
        uiManager.open(player, config.uiNames.Clans.Root)
    })
    for(const invite2 of inviteManager.getInvitesToPlayerByCategory(player, "CLAN")) {
        let invite = inviteManager.getInvite(invite2);
        form.button(`§6Invite from ${invite.player.name}\n§7Click to accept`, null, (player)=>{
            inviteManager.acceptInvite(invite.code);
        })
    }
    form.show(player, false, (player, response)=>{

    })
})