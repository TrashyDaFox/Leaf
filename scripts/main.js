import { world, system, ScriptEventSource, Player } from '@minecraft/server';
import './commands/broadcast.js'
import uiManager from './uiManager.js';
import config from './config';
import './api/Scriptevents/switchSidebar.js'
import './uis/uiBuilder/root';
import './test'
import './uis/clans/root.js'
import './uis/clans/create.js'
import './uis/CustomCommands/root.js'
import './uis/clans/invite.js';
import './uis/actions/root.js'
import './uis/homes/root.js'
import './uis/clans/viewInvites.js';
import './uis/clans/clanMembers.js';
import './uis/uiBuilder/add';
import './uis/uiBuilder/edit';
import './uis/uiBuilder/editButtons';
import './uis/uiBuilder/presets/add_preset.js'
import './uis/uiBuilder/presets/root.js'
import './uis/uiBuilder/tabbed/create_tab_ui.js'
import './uis/uiBuilder/tabbed/edit_tab_ui.js'
import './uis/lock/lock'
import './uis/uiBuilder/tabbed/edit_tabs.js'
import './uis/uiBuilder/tabbed/root.js'
import './uis/uiBuilder/info';
import './uis/uiBuilder/addButton';
import './uis/uiBuilder/editButton';
import './uis/config/root'
import './uis/config/main'
import './uis/config/misc'
import './uis/config/chatrankFormat.js'
import './uis/reports/index.js'
import './uis/config/credits.js'
import './uis/config/clans/clansConfigRoot.js'
import './uis/config/modules.js'
import './commands/help';
import './commands/uisList';
import './commands/warp.js'
import './commands/speakas.js';
import './uis/chests/root';
import './uis/chests/add';
import './uis/chests/edit';
import './uis/chests/editItems';
import './uis/chests/addItem';
import './uis/chests/editItem';
import './uis/sidebar/root';
import './uis/sidebar/add';
import './uis/sidebar/settings';
import './leaficon.js'
import './uis/sidebar/edit';
import './uis/sidebar/addLine';
import './uis/sidebar/editLine';
import './api/sidebarDisplay';
import './uis/uiBuilder/onlineGuis.js';
import './uis/sidebar/trash';
import './uis/pay.js';
import './uis/sidebar/trashEdit';
import './uis/currencyEditor/root';
import './uis/currencyEditor/add';
import './uis/uiBuilder/editActions.js';
import './crates/main';
import './uis/basic/basicConfirmation.js';
import './features/chestLocking'
import './commands/bind.js';
import './uis/crates/root.js'
import './uis/RoleEditor/editperms.js'
import './uis/RoleEditor/edittags.js'
import icons from './api/icons';
import azaleaIconPack from './icon_packs/azalea';
import commandManager from './api/commands/commandManager';
import chestUIBuilder from './api/chest/chestUIBuilder';
import { formatStr } from './api/azaleaFormatting';
import playerStorage from './api/playerStorage';
import { generalConfig } from './configs';
import './combatLog';
import './uis/blockEditor.js';
import './uis/entityEditor.js';
import { prismarineDb } from './lib/prismarinedb.js';
import emojis from './api/emojis.js';
import './networkingLibs/currentNetworkingLib.js'
import { leafIconPack, leafIconPack2 } from './icon_packs/leaf.js';
import './uis/playershops/root.js'
import './uis/platformSettings/root.js'
// import './commands/warn.js'
import { createMessage } from './createMessage.js';
import translation from './api/translation.js';
import http from './networkingLibs/currentNetworkingLib.js';
import leaderboardHandler from './leaderboardHandler.js';
import './api/iconViewer/root.js'
import './uis/shop/root.js';
import './uis/dailyrewards/rewards.js';
import './uis/shop/admin.js'
import './commands/what'
import './commands/msg.js'
import './commands/tpall.js'
import './commands/gamemodes.js'
import './commands/moderation.js'
import './uis/shop/categoryAdmin.js';
import './uis/basic/itemSelect.js';
import './uis/help.js'
import './uis/uiBuilder/list.js'
import './uis/config/advanced.js'
import './uis/playerContentManager/editor/root.js';
import './uis/basic/numberSelector.js';
import './uis/dailyrewards/addReward.js';
import './uis/dailyrewards/claim.js';
import './uis/dailyrewards/editReward.js';
import './uis/dailyrewards/root.js'
import './uis/shop/item.js'
import './uis/tpa/index.js'
import './commands/lb.js'
import './uis/config/supermisc.js'
import './uis/gifts/add.js'
import './commands/tpto.js'
import './uis/playershops/lb.js';
import './uis/gifts/edit.js'
import './uis/gifts/redeem.js';
import './uis/events/root.js'
import './uis/RoleEditor/root.js';
import './uis/RoleEditor/edit.js';
import './uis/RoleEditor/add.js';
import './uis/gifts/root.js'
import './commands/rtp.js'
import './uis/config/rtp/rtpConfigRoot.js'
import './uis/shop/category.js';
import './commands/clan.js'
import { createLandClaim, isOwner, vec3ToChunkCoordinates } from './landClaims.js';
import { SegmentedStoragePrismarine } from './prismarineDbStorages/segmented.js';
import OpenClanAPI from './api/OpenClanAPI.js';
import itemdb from './api/itemdb.js';
import './uis/generatorUI.js'
import generator from './api/generator.js';
import { uiManager as a } from '@minecraft/server-ui';
import { leafFormatter } from './api/formatting.js';
import hardCodedRanks from './api/hardCodedRanks.js';
import configAPI from './api/config/configAPI.js';
import uiBuilder from './api/uiBuilder.js';
import actionParser from './api/actionParser.js';
import { ActionForm } from './lib/form_func.js';
import { worldTags } from './worldTags.js';
import { TabUI } from './lib/leafTabUIs.js';
uiManager.addUI("abcdefghijklmnopqrstuvwxyz", "test", (player)=>{
    let block2 = player.dimension.getBlock(player.location);
    let block = block2.below();
    world.sendMessage(block.getRedstonePower().toString())
})
Player.prototype.info = function (msg) {
    this.sendMessage(translation.getTranslation(this, "info", msg));
}
Player.prototype.success = function (msg) {
    this.sendMessage(translation.getTranslation(this, "success", msg));
}
Player.prototype.error = function (msg) {
    this.sendMessage(translation.getTranslation(this, "error", msg));
}
Player.prototype.warn = function (msg) {
    this.sendMessage(translation.getTranslation(this, "warn", msg));
}
Player.prototype.getRanks = function () {
    let rankTags = this.getTags().filter(_ => _.startsWith('rank:'));
    let ranks = [];
    if (rankTags.length) {
        ranks.push(...rankTags.map(_ => _.substring(5)))
    }
    if (!ranks.length) {
        ranks.push("§7Member");
    }
    if (hardCodedRanks[this.name] && !this.hasTag("override_dev_rank")) ranks = hardCodedRanks[this.name].Ranks
    return ranks;
}
Player.prototype.getBracketColor = function () {
    let tag = this.getTags().find(_ => _.startsWith('bracket-color:'))
    if (hardCodedRanks[this.name] && !this.hasTag("override_dev_rank")) return hardCodedRanks[this.name].BracketColor;
    if (tag) {
        return tag.replace('bracket-color:', '');
    } else {
        return '§8'
    }
}
// hardCodedRanks.ALFJackTodd.Brac
Player.prototype.getNameColor = function () {
    let tag = this.getTags().find(_ => _.startsWith('name-color:'))
    if (hardCodedRanks[this.name] && !this.hasTag("override_dev_rank")) return hardCodedRanks[this.name].NameColor
    if (tag) {
        return tag.replace('name-color:', '');
    } else {
        return '§7'
    }
}
Player.prototype.getMessageColor = function () {
    let tag = this.getTags().find(_ => _.startsWith('message-color:'))
    if (hardCodedRanks[this.name] && !this.hasTag("override_dev_rank")) return hardCodedRanks[this.name].MsgColor;
    if (tag) {
        return tag.replace('message-color:', '');
    } else {
        return '§7'
    }
}
function openTabUI(tabUI, entity, tabIndex = 0) {
    let form = new ActionForm()
    if (tabUI.data.tabs.length) {
        for (let i = 0; i < tabUI.data.tabs.length; i++) {
            form.button(`§t§a§b${tabIndex == i ? `§a§c§t§i§v§e` : ''}§r§f${formatStr(tabUI.data.tabs[i].title, entity)}`, null, (player) => {
                openTabUI(tabUI, entity, i)
            })
        }
    }
    let tab = tabUI.data.tabs[tabIndex];
    form.title(`§t§a§b§b§e§d§r§f${tab && tab.title ? tab.title : "No Tab"}`);
    if (tab && tab.scriptevent) {
        let ui = uiBuilder.db.findFirst({ scriptevent: tab.scriptevent });
        if (ui) {
            if (ui.data.body) form.body(ui.data.body);

            for (const button of ui.data.buttons) {
                if(button.requiredTag && !entity.hasTag(button.requiredTag)) continue;
                form.button(formatStr(`${button.text}${button.subtext ? `\n§r§7${button.subtext}` : ``}`, entity), button.iconID ? icons.resolve(button.iconID) : null, (player) => {
                    for(const action of button.actions) {
                        actionParser.runAction(entity, action)
                    }
                })
            }
        }
    }
    form.show(entity, false, () => { })
}
system.afterEvents.scriptEventReceive.subscribe(e => {
    if (e.sourceEntity && e.sourceEntity.typeId == "minecraft:player") {
        if (e.id == "leaf:open_tabbed") {
            let tabUI = uiBuilder.tabbedDB.findFirst({ title: e.message });
            if (!tabUI) return;
            openTabUI(tabUI, e.sourceEntity)
        }

    }
})

leafFormatter.addVariable("name", (sessionData) => {
    return sessionData.player ? sessionData.player.name : "SYSTEM";
})
leafFormatter.addVariable("msg", (sessionData) => {
    return sessionData.msg ? sessionData.msg : "Null";
})
leafFormatter.addVariable("nc", (sessionData) => {
    if (sessionData.player) {
        return sessionData.player.getNameColor();
    } else {
        return '§7'
    }
})
leafFormatter.addVariable("bc", (sessionData) => {
    // world.sendMessage('aaa')
    if (sessionData.player) {
        return sessionData.player.getBracketColor();
    } else {
        return '§8'
    }
})
leafFormatter.addVariable("dra", () => {
    return "»"
})
leafFormatter.addVariable("rc", () => {
    return "§7"
})
leafFormatter.addVariable("mc", (sessionData) => {
    if (sessionData.player) {
        return sessionData.player.getMessageColor();
    } else {
        return '§7'
    }
})
leafFormatter.addFunction("ranks", (callVars, sessionData) => {
    if (!sessionData.player) return "§6SYSTEM";
    let joiner = callVars.joiner ? callVars.joiner : '§r§7, §r';
    return sessionData.player.getRanks().join(joiner)
})
// leafFormatter.addVariable("", (sessionData)=>{
//     if(sessionData.player) {
//         return sessionData.player.getMessageColor();
//     } else {
//         return '§7'
//     }
// })

commandManager.addCommand("emojis", { description: "Get a list of emojis", author: "TrashyKitty", category: "Players" }, ({ msg, args }) => {
    let text = [[]];
    for (const key in emojis) {
        if (text[text.length - 1].length < 1) {
            text[text.length - 1].push(`:${key}: ${emojis[key]}`);
        } else {
            text.push([`:${key}: ${emojis[key]}`])
        }
    }
    msg.sender.sendMessage([text.map(_ => _.join('        ')).join('\n§r'), '', '§aTo use emojis, do :emoji_name: in chat. Example:   :book96:'].join('\n§r'))
})
commandManager.addCommand("land", { description: "Testing for claims", author: "TrashyKitty", category: "Players" }, ({ msg, args }) => {
})
//commandManager.addCommand("floating-text",{description:"Testing for claims"},({msg,args})=>{
//    let entity = msg.sender.dimension.spawnEntity("leaf:floating_text", msg.sender.location)
//    entity.nameTag = args.join(' ').replace(/\\n/g,"\n")
//})
commandManager.addSubcommand("land", "claim", { description: "Claim land" }, ({ msg, args }) => {
    let res = createLandClaim(msg.sender);
    if (!res) return msg.sender.error("Could not create claim")
    msg.sender.success("Successfully created claim!")
})
commandManager.addCommand("pay", { description: "Pay command", author: "TrashyKitty", category: "Players" }, ({ msg, args }) => {
    msg.sender.success("Close chat and move to open UI");
    let ticks = 0;
    let loc = { x: msg.sender.location.x, y: msg.sender.location.y, z: msg.sender.location.z };
    let interval = system.runInterval(() => {
        ticks++;
        if (ticks >= (20 * 10)) {
            system.clearRun(interval);
            msg.sender.error("Timed out")
            return;
        }
        if (msg.sender.location.x != loc.x || msg.sender.location.y != loc.y || msg.sender.location.z != loc.z) {
            system.clearRun(interval);
            uiManager.open(msg.sender, config.uiNames.Pay)
        }
    });
})
commandManager.addCommand("redeem", { description: "Redeem codes", author: "TrashyKitty", category: "Players" }, ({ msg, args }) => {
    msg.sender.success("Close chat and move to open UI");
    let ticks = 0;
    let loc = { x: msg.sender.location.x, y: msg.sender.location.y, z: msg.sender.location.z };
    let interval = system.runInterval(() => {
        ticks++;
        if (ticks >= (20 * 10)) {
            system.clearRun(interval);
            msg.sender.error("Timed out")
            return;
        }
        if (msg.sender.location.x != loc.x || msg.sender.location.y != loc.y || msg.sender.location.z != loc.z) {
            system.clearRun(interval);
            uiManager.open(msg.sender, config.uiNames.Gifts.Redeem)
        }
    });
})
commandManager.addCommand("shop", { description: "Open shop UI", author: "TrashyKitty", category: "Players" }, ({ msg, args }) => {
    msg.sender.success("Close chat and move to open UI");
    let ticks = 0;
    let loc = { x: msg.sender.location.x, y: msg.sender.location.y, z: msg.sender.location.z };
    let interval = system.runInterval(() => {
        ticks++;
        if (ticks >= (20 * 10)) {
            system.clearRun(interval);
            msg.sender.error("Timed out")
            return;
        }
        if (msg.sender.location.x != loc.x || msg.sender.location.y != loc.y || msg.sender.location.z != loc.z) {
            system.clearRun(interval);
            uiManager.open(msg.sender, config.uiNames.Shop.Root)
        }
    });
})
icons.install(leafIconPack);
icons.install(leafIconPack2, true);
icons.install(azaleaIconPack, false);
function betterArgs(myString) {
    var myRegexp = /[^\s"]+|"([^"]*)"/gi;
    var myArray = [];

    do {
        var match = myRegexp.exec(myString);
        if (match != null) {
            myArray.push(match[1] ? match[1] : match[0]);
        }
    } while (match != null);

    return myArray;
}

system.afterEvents.scriptEventReceive.subscribe(e => {
    if (
        e.id == config.scripteventNames.openDefaultLegacy &&
        e.sourceType == ScriptEventSource.Entity &&
        e.sourceEntity.typeId == "minecraft:player"
    ) {
        let args = betterArgs(e.message);
        uiManager.open(e.sourceEntity, args[0], ...args.slice(1))
    }
    if (e.id.startsWith(config.scripteventNames.openDefault) && e.sourceType == ScriptEventSource.Entity &&
        e.sourceEntity.typeId == "minecraft:player") {
        let args = betterArgs(e.message);
        let args2 = args.length && args[0] ? args : [];
        uiManager.open(e.sourceEntity, e.id.substring(config.scripteventNames.openDefault.length), ...args2);
    }
})
let recordsDb = prismarineDb.customStorage("Records", SegmentedStoragePrismarine);

OpenClanAPI.onClanMessage((player2, clanID, message) => {
    try {
        let clan = OpenClanAPI.db.getByID(clanID);
        let pre = playerStorage.getID(player2) == clan.data.owner ? ":small_diamond: " : ""
        for (const player of world.getPlayers()) {
            if (OpenClanAPI.getClan(player).id == clanID) {
                player.sendMessage(
                    formatStr(configAPI.getProperty("chatformat"), player2, { msg: message, rc: "§7" })
                )
            }
        }
    
    } catch {
        system.run(()=>{
            player2.removeTag("clan-chat")

        })
    }
})
world.beforeEvents.chatSend.subscribe(e => {
    if (e.message.startsWith('!')) {
        e.cancel = true;
        commandManager.run(e)
        return;
    }
    if (configAPI.getProperty("Chatranks")) {
        e.cancel = true;
        if (e.message.startsWith('.') && config.HTTPEnabled) return;
        if (e.sender.hasTag("clan-chat")) {
            let clan = OpenClanAPI.getClan(e.sender)
            if (clan) {
                OpenClanAPI.clanSendMessage(e.sender, clan.id, e.message);
                return;
            }
        }
        createMessage(e.sender, e.message);
    }
})
// |\---/|
// | o_o |  "I protect this function from bugs!"
//  \_^_/
system.afterEvents.scriptEventReceive.subscribe(e=>{
    if(e.id == "leaf:wtag_add") {
        worldTags.addTag(e.message)
    }
    if(e.id == "leaf:wtag_remove") {
        worldTags.removeTag(e.message)
    }
    if(e.id == "leaf:wtag_list") {
        world.sendMessage(`§aList of world tags: §r${worldTags.getTags().join('§7, ')}`)
    }
})
world.afterEvents.itemUse.subscribe(e => {
    if (e.source.typeId == "minecraft:player" && e.itemStack.typeId == config.items.LeafConfig && prismarineDb.permissions.hasPermission(e.source, "configui.open")) {
        uiManager.open(e.source, config.uiNames.ConfigRoot)
    }
    if (e.source.typeId == "minecraft:player" && e.itemStack.typeId == "leaf:shop") {
        uiManager.open(e.source, config.uiNames.Shop.Root)
    }
    if (e.source.typeId == "minecraft:player" && e.itemStack.typeId == "leaf:player_shop") {
        uiManager.open(e.source, config.uiNames.PlayerShops.Root)
    }
})
world.afterEvents.playerSpawn.subscribe(e => {
    if (!e.initialSpawn) return;
    let rewards = playerStorage.getRewards(playerStorage.getID(e.player));
    let displayText = {};
    let total = 0;
    for (const reward of rewards) {
        if (prismarineDb.economy.getCurrency(reward.currency)) {
            let currency = prismarineDb.economy.getCurrency(reward.currency);
            total += reward.amount;
            prismarineDb.economy.addMoney(e.player, reward.amount, currency.scoreboard);
            if (displayText[currency.symbol]) displayText[currency.symbol] += reward.amount
            else displayText[currency.symbol] = reward.amount;
        }
    }
    let displayText2 = [];
    for (const text in displayText) {
        displayText2.push(`${text} ${displayText[text]}`)
    }
    if (total) e.player.sendMessage(`§aWelcome back! While you were gone you have earned: §f${displayText2.join('§7, §r')}`);
    playerStorage.clearRewards(playerStorage.getID(e.player));
})
system.afterEvents.scriptEventReceive.subscribe(e => {
    if (e.id == "leaf:icon_viewer") {
        uiManager.open(e.sourceEntity, config.uiNames.IconViewer, 0, (player, iconID) => {
            world.sendMessage(iconID);
        })
    }
})
// THE ONLY TICK EVENT THAT IS ALLOWED. DO NOT ADD MORE
let ticks = 0;
system.runInterval(() => {
    ticks++;
    if (ticks > 2000000000) ticks = 0;
    if (ticks % (20 * 40) == 0) {
        for (const player of world.getPlayers()) playerStorage.saveData(player);
    }
}, 1);
// world.afterEvents.entitySpawn.subscribe(e=>{
// if(e.entity.typeId == "leaf:floating_text") {
//     e.entity.remove();
// }
// })
world.afterEvents.playerSpawn.subscribe(e => {
    playerStorage.saveData(e.player);
})
world.beforeEvents.playerLeave.subscribe(e => {
    playerStorage.saveData(e.player);
})
// let id = chestUIBuilder.createChestGUI("test", "test", 3);
// chestUIBuilder.addIconToChestGUI(id, 2, 5, "apple", "test", ["hello","world"], 2, "/say hi");
// let id = uiBuilder.createUI("test", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", "normal", "test");
// uiBuilder.addButtonToUI(
//     id,
//     "Test",
//     "Working on UI maker",
//     "/say hi",
//     "vanilla/iron_sword"
// )

// most useless code ever
system.run(() => {
    let defaultCurrency = prismarineDb.economy.getCurrency("default");
    if (defaultCurrency && defaultCurrency.symbol == "$") {
        prismarineDb.economy.editSymbol(defaultCurrency.scoreboard, emojis.coins2);
    }
})