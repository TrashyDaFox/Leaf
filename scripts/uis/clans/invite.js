import { world } from "@minecraft/server";
import config from "../../config";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import OpenClanAPI from "../../api/OpenClanAPI";
import configAPI from "../../api/config/configAPI";

uiManager.addUI(config.uiNames.Clans.Invite, "Clan Invite", (player, clanID)=>{
    if(!configAPI.getProperty("Clans")) return player.sendMessage("Clans are not enabled");
    let modal = new ModalForm();
    let players = world.getPlayers();
    modal.dropdown("Player", players.map(_=>{
        return {
            option: _.name,
            callback() {}
        }
    }));
    modal.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, config.uiNames.Clans.Root);
        OpenClanAPI.invitePlayerToClan(player, players[response.formValues[0]], clanID);
        uiManager.open(player, config.uiNames.Clans.Root)
    })
})