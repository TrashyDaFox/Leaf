import { world } from "@minecraft/server";
import playerStorage from "../../api/playerStorage";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_DISABLE_VERTICAL_SIZE_KEY, NUT_UI_HEADER_BUTTON, NUT_UI_LEFT_HALF, NUT_UI_RIGHT_HALF, NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";

uiManager.addUI(versionData.uiNames.Basic.PlayerSelector, "A", async (player, searchQuery = "", callback = ()=>{}, filters = [], title = "Select a player")=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§r§f§l${title}`)
    form.button(`${NUT_UI_HEADER_BUTTON}§cGo Back\n§7Go back to main settings`, `textures/azalea_icons/2`, (player)=>{
        callback(null)
    })
    form.button(`§6Search\n§7Search for players`, `textures/items/spyglass`, (player)=>{
        let modal = new ModalForm();
        modal.textField("Search Query", "Search for a player name", searchQuery);
        modal.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, versionData.uiNames.Basic.PlayerSelector, searchQuery, callback, filters, title);
            searchQuery = response.formValues[0]
            return uiManager.open(player, versionData.uiNames.Basic.PlayerSelector, searchQuery, callback, filters, title);
        })
    })
    let ids = playerStorage.searchPlayersByName(searchQuery);
    // ids = ids.filter(_=>bansDB.findFirst({type:"MUTE",playerID: _}) ? false : true)
    for(const filter of filters) {
        ids = ids.filter(filter)
    }
    let ids_sliced = ids.slice(0, 20);
    let ids_online = [];
    for(const player of world.getPlayers()) {
        let id = await playerStorage.getIDAsync(player)
        if(ids_sliced.includes(id)) ids_online.push(id)
    }
    let i = 0;
    for(const id of ids_sliced) {
        i++;
        let player = playerStorage.getPlayerByID(id);
        form.button(`${i == ids_sliced.length && ids_sliced.length % 2 != 0 ? `` : i % 2 != 0 ? `${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}` : `${NUT_UI_LEFT_HALF}`}§r${ids_online.includes(id) ? "§a" : "§v"}${player.name}\n§r§7${ids_online.includes(id) ? "Online Player" : "Offline Player"}`, null, (player)=>{
            callback(id)
        })
    }
    form.show(player, false, (player, response)=>{

    })
})