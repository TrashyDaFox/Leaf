import configAPI from "../../api/config/configAPI";
import OpenClanAPI from "../../api/OpenClanAPI";
import playerStorage from "../../api/playerStorage";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Clans.ClanMembers, "Clan members", (player, clanID)=>{
    if(!configAPI.getProperty("Clans")) return player.sendMessage("Clans are not enabled");
    let clan = OpenClanAPI.db.getByID(clanID);
    if(clan) {
        let form = new ActionForm();
        form.button(`§cBack\n§7Go back`, `textures/blocks/barrier`, (player)=>{
            uiManager.open(player, config.uiNames.Clans.Root);
        })
        for(const member of OpenClanAPI.getClanMembers(clanID)) {
            let player = playerStorage.getPlayerByID(member)
            form.button(`${member == clan.data.owner ? "§6" : "§2"}${player.name}`, null, (player)=>{
                if(playerStorage.getID(player) == clan.data.owner) {
                    let form2 = new ActionForm();
                    form2.button(`§cKick\n§7Kick this member`, null, (player)=>{
                        OpenClanAPI.kickMemberFromClan(clanID, member);
                        uiManager.open(player, config.uiNames.Clans.ClanMembers, clanID);
                    })
                    form2.button(`§eTransfer Ownership\n§7Give ownership to this user`, null, (player)=>{
                        uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to transfer ownership to this player?", ()=>{
                            OpenClanAPI.transferOwnership(clan.id, playerStorage.getID(player), member);
                            uiManager.open(player, config.uiNames.Clans.ClanMembers, clanID);
                        }, ()=>{
                            uiManager.open(player, config.uiNames.Clans.ClanMembers, clanID);
                        })
                    })
                    form2.button(`§6Back\n§7Go back`, null, (player)=>{
                        uiManager.open(player, config.uiNames.Clans.ClanMembers, clanID);
                    })
                    form2.show(player, false, ()=>{})
                } else {
                    uiManager.open(player, config.uiNames.Clans.Root);
                }
            })
        }
        form.show(player, false, (player, response)=>{})
    }
})