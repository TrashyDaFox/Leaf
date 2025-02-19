import { world } from "@minecraft/server";
import { prismarineDb } from "../../lib/prismarinedb";
import { SegmentedStoragePrismarine } from "../../prismarineDbStorages/segmented";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import playerStorage from "../../api/playerStorage";
import moment from '../../lib/moment'
import { ActionForm, ModalForm } from "../../lib/form_func";
import { NUT_UI_ALT, NUT_UI_HEADER_BUTTON, NUT_UI_TAG, NUT_UI_THEMED, NUT_UI_RIGHT_HALF, NUT_UI_LEFT_HALF, NUT_UI_DISABLE_VERTICAL_SIZE_KEY } from "../preset_browser/nutUIConsts";
import { themes } from "../uiBuilder/cherryThemes";

let bansDB = prismarineDb.customStorage("Bans", SegmentedStoragePrismarine);

world.afterEvents.playerSpawn.subscribe(async e=>{
    if(!e.initialSpawn) return;
    let id = await playerStorage.getIDAsync(e.player);
    // world.sendMessage(`${id}`)
    let ban = bansDB.findFirst({type: "BAN", playerID: id})
    if(ban) {
        if(ban.data.permanent || Date.now() < ban.data.expirationDate) {
            e.player.runCommand(`kick "${e.player.name}" ${ban.data.reason ? ban.data.reason : "You are banned"}`)
        } else {
            bansDB.deleteDocumentByID(ban.id)
        }
    }
})
uiManager.addUI(versionData.uiNames.Basic.MuteModal, "aaaaa", (player, id, searchQuery = "") => {
    let modal = new ModalForm();
    let player2 = playerStorage.getPlayerByID(id)
    modal.title(`Ban ${player2.name}`);
    modal.textField("Reason", "Reason")
    modal.toggle("Permanent? (will override the sliders below)");
    modal.slider("Minutes", 0, 60, 5, 0)
    modal.slider("Hours", 0, 23, 1, 0)
    modal.slider("Days", 0, 29, 1, 0)
    modal.slider("Months", 0, 11, 1, 0)
    modal.slider("Years", 0, 5, 1, 0)
    modal.submitButton("Mute Player")
    modal.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Add, searchQuery);
        let expTime = Date.now();
        expTime += (1000 * 60) * response.formValues[2]
        expTime += (1000 * 60 * 60) * response.formValues[3]
        expTime += (1000 * 60 * 60 * 24) * response.formValues[4]
        expTime += (1000 * 60 * 60 * 24 * 30) * response.formValues[5]
        expTime += (1000 * 60 * 60 * 24 * 365) * response.formValues[6]
        bansDB.insertDocument({
            type: "MUTE",
            playerID: id,
            expirationDate: expTime,
            permanent: response.formValues[1],
            reason: response.formValues[0]
        })
        uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Root)
    })
})
uiManager.addUI(versionData.uiNames.Basic.BanModal, "aaaaa", (player, id, searchQuery = "") => {
    let modal = new ModalForm();
    let player2 = playerStorage.getPlayerByID(id)
    modal.title(`Ban ${player2.name}`);
    modal.textField("Reason", "Reason")
    modal.toggle("Permanent? (will override the sliders below)");
    modal.slider("Minutes", 0, 60, 5, 0)
    modal.slider("Hours", 0, 23, 1, 0)
    modal.slider("Days", 0, 29, 1, 0)
    modal.slider("Months", 0, 11, 1, 0)
    modal.slider("Years", 0, 5, 1, 0)
    modal.submitButton("Ban Player")
    modal.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Add, searchQuery);
        let expTime = Date.now();
        expTime += (1000 * 60) * response.formValues[2]
        expTime += (1000 * 60 * 60) * response.formValues[3]
        expTime += (1000 * 60 * 60 * 24) * response.formValues[4]
        expTime += (1000 * 60 * 60 * 24 * 30) * response.formValues[5]
        expTime += (1000 * 60 * 60 * 24 * 365) * response.formValues[6]
        bansDB.insertDocument({
            type: "BAN",
            playerID: id,
            expirationDate: expTime,
            permanent: response.formValues[1],
            reason: response.formValues[0]
        })
        try {
            player.runCommand(`kick "${player2.name}" ${response.formValues[0] ? response.formValues[0] : "You have been banned!"}`)
        } catch {}
        uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Root)
    })
})
uiManager.addUI(versionData.uiNames.ModerationHub.Mute.Add, "Add Mnute!!!!!!!!!!!!!!", async (player, searchQuery = "")=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[8][0]}§r§f§lMute a player`)
    form.button(`${NUT_UI_HEADER_BUTTON}§cGo Back\n§7Go back to main settings`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, versionData.uiNames.ModerationHub.Mute.Root)
    })
    form.button(`§6Search\n§7Search for players`, `textures/items/spyglass`, (player)=>{
        let modal = new ModalForm();
        modal.textField("Search Query", "Search for a player name", searchQuery);
        modal.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, versionData.uiNames.ModerationHub.Mute.Add, searchQuery);
            searchQuery = response.formValues[0]
            return uiManager.open(player, versionData.uiNames.ModerationHub.Mute.Add, searchQuery);
        })
    })
    let ids = playerStorage.searchPlayersByName(searchQuery);
    ids = ids.filter(_=>bansDB.findFirst({type:"MUTE",playerID: _}) ? false : true)
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
            uiManager.open(player, versionData.uiNames.Basic.MuteModal, id, searchQuery)
        })
    }
    form.show(player, false, (player, response)=>{

    })
})
uiManager.addUI(versionData.uiNames.ModerationHub.Bans.Add, "Add Banms!!!!!!!!!!!!!!", async (player, searchQuery = "")=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[8][0]}§r§f§lBan a player`)
    form.button(`${NUT_UI_HEADER_BUTTON}§cGo Back\n§7Go back to main settings`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Root)
    })
    form.button(`§6Search\n§7Search for players`, `textures/items/spyglass`, (player)=>{
        let modal = new ModalForm();
        modal.textField("Search Query", "Search for a player name", searchQuery);
        modal.show(player, false, (player, response)=>{
            if(response.canceled) return uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Add, searchQuery);
            searchQuery = response.formValues[0]
            return uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Add, searchQuery);
        })
    })
    let ids = playerStorage.searchPlayersByName(searchQuery);
    ids = ids.filter(_=>bansDB.findFirst({type:"BAN", playerID: _}) ? false : true)
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
            uiManager.open(player, versionData.uiNames.Basic.BanModal, id, searchQuery)
        })
    }
    form.show(player, false, (player, response)=>{

    })
})

uiManager.addUI(versionData.uiNames.ModerationHub.Bans.Root, "Banms", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[8][0]}§r§f§lBans`)
    form.button(`${NUT_UI_HEADER_BUTTON}§cGo Back\n§7Go back to main settings`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, versionData.uiNames.ModerationHub.Root)
    })
    form.button(`§aAdd Ban\n§7Ban a player`, `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Add)
    })
    let sortedData = bansDB.findDocuments({type:"BAN"}).sort((a,b)=>b.createdAt - a.createdAt)
    for(const ban of sortedData) {
        if(Date.now() >= ban.data.expirationDate && !ban.data.permanent) {
            bansDB.deleteDocumentByID(ban.id)
            continue;
        }
        let player2 = playerStorage.getPlayerByID(ban.data.playerID)
        let text = ban.data.permanent ? "Permanent Ban" : `Expires ${moment(ban.data.expirationDate).fromNow()}`
        form.button(`§c${player2.name}\n§7${text}`, null, (player)=>{
            uiManager.open(player, versionData.uiNames.Basic.Confirmation, `Are you sure you want to unban ${player2.name}?`, ()=>{
                bansDB.deleteDocumentByID(ban.id)
                uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Root)
            }, ()=>{
                uiManager.open(player, versionData.uiNames.ModerationHub.Bans.Root)
            })
        })
    }
    form.show(player, false, (player, response)=>{

    })
})

export function isMuted(player) {
    let id = playerStorage.getID(player);
    // world.sendMessage(`${id}`)
    let ban = bansDB.findFirst({type: "MUTE", playerID: id})
    if(ban) {
        if(ban.data.permanent || Date.now() < ban.data.expirationDate) {
            return true;
        } else {
            bansDB.deleteDocumentByID(ban.id)
            return false;
        }
    }
    return false;
}

uiManager.addUI(versionData.uiNames.ModerationHub.Mute.Root, "Mnutes!", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[8][0]}§r§f§lMute`)
    form.button(`${NUT_UI_HEADER_BUTTON}§cGo Back\n§7Go back to main settings`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, versionData.uiNames.ModerationHub.Root)
    })
    form.button(`§aAdd Mute\n§7Mute a player`, `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, versionData.uiNames.ModerationHub.Mute.Add)
    })
    let sortedData = bansDB.findDocuments({type:"MUTE"}).sort((a,b)=>b.createdAt - a.createdAt)
    for(const ban of sortedData) {
        if(Date.now() >= ban.data.expirationDate && !ban.data.permanent) {
            bansDB.deleteDocumentByID(ban.id)
            continue;
        }
        let player2 = playerStorage.getPlayerByID(ban.data.playerID)
        let text = ban.data.permanent ? "Permanent Mute" : `Expires ${moment(ban.data.expirationDate).fromNow()}`
        form.button(`§c${player2.name}\n§7${text}`, null, (player)=>{
            uiManager.open(player, versionData.uiNames.Basic.Confirmation, `Are you sure you want to unmute ${player2.name}?`, ()=>{
                bansDB.deleteDocumentByID(ban.id)
                uiManager.open(player, versionData.uiNames.ModerationHub.Mute.Root)
            }, ()=>{
                uiManager.open(player, versionData.uiNames.ModerationHub.Mute.Root)
            })
        })
    }
    form.show(player, false, (player, response)=>{

    })
})