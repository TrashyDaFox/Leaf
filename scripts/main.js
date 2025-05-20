/*
          ／＞-🌱-フ
　　　　　 | 　_　 _ l
　 　　　 ／` ミ＿xノ
　　 　 /　　　 　 |
　　　 /　 ヽ　　 ﾉ
　／￣|　　 |　 |   |
　| (￣ヽ＿_ヽ__) _)
　＼二つ

i call him plant kitty

leaf mascot real?

"happy trans day!"
- TrashyKitty; March 31, 2025
*/
// import * as bindings from '@minecraft/server-editor-bindings';

import { world, system, ScriptEventSource, Player, Block } from '@minecraft/server';
import * as mc from '@minecraft/server'

import { CommandHandler } from './api/commandHandler.js';
import { transferPlayer } from "@minecraft/server-admin";
import './uis/auctionhouse/index.js';
import './uis/chatranks/index.js'
import './uis/nametagplus/ui.js';
import './uis/zones/index.js';
import './uis/landclaims/index.js'
import './uis/basic/playerSelector.js'
import './features/clog.js'
import './uis/warps/index.js'
import './commands/broadcast.js'
import uiManager from './uiManager.js';
import './uis/uiBuilder/editIconOverrides.js'
import config from './versionData.js';
import './api/Scriptevents/switchSidebar.js'
import './uis/uiBuilder/root';
import './test'
import './uis/clans/root.js'
import './uis/clans/create.js'
import './uis/moderation_hub/index'
import './uis/CustomCommands/root.js'
import './uis/bounty/index.js'
import './uis/mcbetools_auth.js'
import './uis/preset_browser/index.js'
import './commands/pwarp.js'
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
// import './crates/main';
import './uis/basic/basicConfirmation.js';
import './features/chestLocking'
import './commands/bind.js';
import './uis/crates/root.js'
import './features/crates.js'
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
import { colors, prismarineDb } from './lib/prismarinedb.js';
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
import './uis/leaderboards/index.js'
import './uis/RoleEditor/add.js';
import './uis/gifts/root.js'
import './commands/rtp.js'
import './uis/config/rtp/rtpConfigRoot.js'
import './uis/shop/category.js';
import './commands/clan.js'
import './features/graves.js'
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
import { ActionForm, ModalForm } from './lib/form_func.js';
import { worldTags } from './worldTags.js';
import { TabUI } from './lib/leafTabUIs.js';
import beforeChat from './beforeChat.js';
import './uis/modal-form-editor/index.js'
import './uis/chests/root';
import { blockIcons, itemIcons } from './icon_packs/vanilla.js';
import './features/afk'
import './pdbScriptevents.js'
import normalForm from './api/openers/normalForm.js';
import pjXML from './lib/pjxml.js';
import { dynamicToast } from './lib/chatNotifs.js';
import auctionhouse from './api/AH/auctionhouse.js';
import './bcd.js'
import scripting from './api/scripting.js';
import { rpgiabIconPack } from './icon_packs/rpgiab.js';
// uiBuilder.importUI()
// world.sendMessage("AAAAAAAAAAAAA")

try { system.events.beforeWatchdogTerminate.subscribe(e => e.cancel = true); }
catch (err) { system.beforeEvents.watchdogTerminate.subscribe(e => { system.run(() => { e.cancel = true; console.warn(`${e.terminateReason}`); }); }); }
// uiManager.addUI("terst", "tesrt", (player)=>{
//   let inventory = player.getComponent('inventory')
//   player.sendMessage(`${inventory.container.firstEmptySlot()}`);
// })
let tprSystem = {"version":"1.0","timestamp":1745017254488,"exportSource":"folder","data":{"type":11,"identifier":"TPA","expirationTime":1200,"denyActions":["/scriptevent leaf:open leaf/tpr-deny [Successfully Denied Request]","/execute as \"<name2>\" run scriptevent leaf:open leaf/tpr-deny [<name> denied your request]"],"expireActions":["/scriptevent leaf:open leaf/tpr-expired [Your request from <name2> expired]","/execute as \"<name2>\" run scriptevent leaf:open leaf/tpr-expired [Your request to <name> expired]"],"sendActions":["/scriptevent leaf:open leaf/tpr-sent [<name2> requested to teleport to you]","execute as \"<name2>\" run scriptevent leaf:open leaf/tpr-sent [Sent teleport request to <name>]"],"acceptActions":["/scriptevent leaf:open leaf/tpr-accept [Teleporting <name2> to you]","/execute as \"<name2>\" run scriptevent leaf:open leaf/tpr-accept [Teleporting to <name>]","/tp \"<name2>\" @s"],"folder":1744569745652674},"dependencies":[{"type":11,"identifier":"TPAHERE","expirationTime":1200,"denyActions":["/scriptevent leaf:open leaf/tpr-deny [Successfully Denied Request]","/execute as \"<name2>\" run scriptevent leaf:open leaf/tpr-deny [<name> denied your request]"],"expireActions":["/scriptevent leaf:open leaf/tpr-expired [Your request from <name2> expired]","/execute as \"<name2>\" run scriptevent leaf:open leaf/tpr-expired [Your request to <name> expired]"],"sendActions":["/scriptevent leaf:open leaf/tpr-sent [<name2> requested you to teleport to them]","/execute as \"<name2>\" run scriptevent leaf:open leaf/tpr-sent [Sent teleport request to <name>]"],"acceptActions":["/scriptevent leaf:open leaf/tpr-accept [Teleporting to <name2>]","/execute as \"<name2>\" run scriptevent leaf:open leaf/tpr-accept [Teleporting <name> to you]","/tp @s \"<name2>\""],"folder":1744569745652674},{"name":"Teleport Requests","body":"","layout":4,"type":0,"buttons":[{"text":"§bSend Request","subtext":"Send request to teleport to someone","action":"/scriptevent leafgui:invite TPA \"/scriptevent leaf:open leaf/tpr\"","actions":["/scriptevent leafgui:invite TPA \"/scriptevent leaf:open leaf/tpr\""],"iconID":"^textures/azalea_icons/send_req","iconOverrides":[],"requiredTag":"","disabled":false,"id":2665792997,"meta":""},{"text":"§bSend Request (here)","subtext":"Send request to someone to teleport to you","action":"/scriptevent leafgui:invite TPA \"/scriptevent leaf:open leaf/tpr\"","actions":["/scriptevent leafgui:invite TPAHERE \"/scriptevent leaf:open leaf/tpr\""],"iconID":"^textures/azalea_icons/send_req","iconOverrides":[],"requiredTag":"","disabled":false,"id":2666703244,"displayOverrides":[],"sellButtonEnabled":false,"buyButtonEnabled":false,"nutUIHalf":0,"nutUINoSizeKey":false,"nutUIAlt":false,"nutUIColorCondition":"","nutUIHeaderButton":false,"meta":""},{"text":"§b<name2>","subtext":"Click to teleport <name2> to you","action":"a","actions":["a"],"iconID":"^textures/azalea_icons/incoming_req","iconOverrides":[],"requiredTag":"","disabled":false,"id":2666703234,"meta":"#INVITES TPA","displayOverrides":[],"sellButtonEnabled":false,"buyButtonEnabled":false,"nutUIHalf":0,"nutUINoSizeKey":false,"nutUIAlt":false,"nutUIColorCondition":"","nutUIHeaderButton":false},{"text":"§b<name2>","subtext":"Click to teleport to <name2>","action":"a","actions":["a"],"iconID":"^textures/azalea_icons/incoming_req","iconOverrides":[],"requiredTag":"","disabled":false,"id":2666703254,"displayOverrides":[],"sellButtonEnabled":false,"buyButtonEnabled":false,"nutUIHalf":0,"nutUINoSizeKey":false,"nutUIAlt":false,"nutUIColorCondition":"","nutUIHeaderButton":false,"meta":"#INVITES TPAHERE"},{"text":"§cRequest to <name>","subtext":"Click to cancel","action":"a","actions":["a"],"iconID":"^textures/azalea_icons/outgoing_req","iconOverrides":[],"requiredTag":"","disabled":false,"id":2666703264,"meta":"#INVITES TPAHERE out","displayOverrides":[],"sellButtonEnabled":false,"buyButtonEnabled":false,"nutUIHalf":0,"nutUINoSizeKey":false,"nutUIAlt":false,"nutUIColorCondition":"","nutUIHeaderButton":false},{"text":"§cRequest to <name>","subtext":"Click to cancel","action":"a","actions":["a"],"iconID":"^textures/azalea_icons/outgoing_req","iconOverrides":[],"requiredTag":"","disabled":false,"id":2666703274,"meta":"#INVITES TPA out","displayOverrides":[],"sellButtonEnabled":false,"buyButtonEnabled":false,"nutUIHalf":0,"nutUINoSizeKey":false,"nutUIAlt":false,"nutUIColorCondition":"","nutUIHeaderButton":false}],"subuis":{},"scriptevent":"leaf/tpr","cancel":"","folder":1744569745652674,"theme":5},{"type":6,"name":"Denied TPR","body":"§b§lTeleport Requests\n§r§f<$1>","icon":"^textures/azalea_icons/deny","scriptevent":"leaf/tpr-deny","hideTitleInNotification":true,"folder":1744569745652674},{"type":6,"name":"Accepted TPR","body":"§r§b§lTeleport Requests\n§r§f<$1>","icon":"^textures/azalea_icons/accept","scriptevent":"leaf/tpr-accept","folder":1744569745652674,"hideTitleInNotification":true},{"type":6,"name":"Expired TPR","body":"§b§lTeleport Requests\n§r§f<$1>","icon":"vanilla_items/clock_item","scriptevent":"leaf/tpr-expired","folder":1744569745652674,"hideTitleInNotification":true},{"type":6,"name":"Sent TPR (self)","body":"§r§b§lTeleport Requests\n§r§f<$1>","icon":"^textures/azalea_icons/incoming_req","scriptevent":"leaf/tpr-sent","hideTitleInNotification":true,"folder":1744569745652674}]};
let a = world.getDynamicProperty("AOP_1x")
if(!a) {
  let folderID = uiBuilder.createFolder("Leaf")
  for(const ui of [...tprSystem.dependencies, tprSystem.data]) {
    uiBuilder.db.insertDocument({
      ...ui,
      folder: folderID
    })
  }
  world.setDynamicProperty("AOP_1x", true)
}
uiBuilder.addInternalUI({
  "name": "Navigator",
  "body": "",
  "layout": 4,
  "type": 0,
  "buttons": [
    {
      "text": "§eConfig UI",
      "subtext": "Open leaf's configurator",
      "action": "/scriptevent leafgui:config_menu_main_page",
      "actions": [
        "/scriptevent leafgui:config_menu_start_page"
      ],
      "iconID": "^textures/azalea_icons/Settings",
      "iconOverrides": [],
      "requiredTag": "admin",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": true,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "id": 1
    },
    {
      "text": "§aHomes",
      "subtext": "[ Click to Open ]",
      "action": "/scriptevent leafgui:homes",
      "actions": [
        "/scriptevent leafgui:homes"
      ],
      "iconID": "leaf/image-1169",
      "iconOverrides": [],
      "requiredTag": "$cfg/Homes",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false,
      "id": 0
    },
    {
      "text": "§6Auction House",
      "subtext": "[ Click to Open ]",
      "action": "/scriptevent leafgui:ah_root",
      "actions": [
        "/scriptevent leafgui:ah_root"
      ],
      "iconID": "leaf/image-068",
      "iconOverrides": [],
      "requiredTag": "$cfg/AuctionHouse",
      "disabled": false,
      "id": 2
    },
    {
      "text": "§ePlayer Shops",
      "subtext": "[ Click to Open ]",
      "action": "/scriptevent leafgui:player_shop_root",
      "actions": [
        "/scriptevent leafgui:player_shop_root"
      ],
      "iconID": "leaf/image-0876",
      "iconOverrides": [],
      "requiredTag": "$cfg/PlayerShops",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false,
      "id": 3
    },
    {
      "text": "§dServer Shop",
      "subtext": "[ Click to Open ]",
      "action": "/scriptevent leafgui:shop_main",
      "actions": [
        "/scriptevent leafgui:shop_main"
      ],
      "iconID": "leaf/image-1202",
      "iconOverrides": [],
      "requiredTag": "$cfg/Shops",
      "disabled": false,
      "id": 4
    },
    {
      "text": "§aTransfer Money",
      "subtext": "[ Click to Open ]",
      "action": "/scriptevent leafgui:pay",
      "actions": [
        "/scriptevent leafgui:pay"
      ],
      "iconID": "leaf/image-481",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": false,
      "id": 6
    },
    {
      "text": "§bClans",
      "subtext": "[ Click to Open ]",
      "action": "/scriptevent leafgui:clans_root",
      "actions": [
        "/scriptevent leafgui:clans_root"
      ],
      "iconID": "leaf/image-0911",
      "iconOverrides": [],
      "requiredTag": "$cfg/Clans",
      "disabled": false,
      "id": 7
    },
    {
      "text": "§aLand Claims",
      "subtext": "Manage your land claims",
      "action": "/scriptevent leafgui:land_claims",
      "actions": [
        "/scriptevent leafgui:land_claims"
      ],
      "iconID": "Packs/Asteroid/global",
      "iconOverrides": [],
      "requiredTag": "$cfg/LandClaims",
      "disabled": false,
      "id": 167761812
    },
    {
      "text": "§cRedeem Gift Code",
      "subtext": "[ Click to Open ]",
      "action": "/scriptevent leafgui:redeem_gift_code",
      "actions": [
        "/scriptevent leafgui:redeem_gift_code"
      ],
      "iconID": "leaf/image-0909",
      "iconOverrides": [],
      "requiredTag": "$cfg/Gifts",
      "disabled": false,
      "id": 5,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§dTeleport §uRequests",
      "subtext": "[ Click to Open ]",
      "action": "scriptevent leaf:open leaf/tpr",
      "actions": [
        "scriptevent leaf:open leaf/tpr"
      ],
      "iconID": "vanilla_items/ender_eye",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": false,
      "id": 3108410572
    }
  ],
  "subuis": {},
  "scriptevent": "leaf/nav",
  "cancel": "",
  "theme": 25,
  "lastID": 7,
  "paperdoll": true,
  "pinned": true,
  "folder": 1741898363581751,
  "original": {
    "name": "Navigator",
    "body": "",
    "layout": 4,
    "type": 0,
    "buttons": [
      {
        "text": "§eConfig UI",
        "subtext": "Open leaf's configurator",
        "action": "/scriptevent leafgui:config_menu_main_page",
        "actions": [
          "/scriptevent leafgui:config_menu_start_page"
        ],
        "iconID": "^textures/azalea_icons/Settings",
        "iconOverrides": [],
        "requiredTag": "admin",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": true,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "id": 1
      },
      {
        "text": "§aHomes",
        "subtext": "[ Click to Open ]",
        "action": "/scriptevent leafgui:homes",
        "actions": [
          "/scriptevent leafgui:homes"
        ],
        "iconID": "leaf/image-1169",
        "iconOverrides": [],
        "requiredTag": "$cfg/Homes",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "disabled": false,
        "id": 0
      },
      {
        "text": "§6Auction House",
        "subtext": "[ Click to Open ]",
        "action": "/scriptevent leafgui:ah_root",
        "actions": [
          "/scriptevent leafgui:ah_root"
        ],
        "iconID": "leaf/image-068",
        "iconOverrides": [],
        "requiredTag": "$cfg/AuctionHouse",
        "disabled": false,
        "id": 2
      },
      {
        "text": "§ePlayer Shops",
        "subtext": "[ Click to Open ]",
        "action": "/scriptevent leafgui:player_shop_root",
        "actions": [
          "/scriptevent leafgui:player_shop_root"
        ],
        "iconID": "leaf/image-0876",
        "iconOverrides": [],
        "requiredTag": "$cfg/PlayerShops",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "disabled": false,
        "id": 3
      },
      {
        "text": "§dServer Shop",
        "subtext": "[ Click to Open ]",
        "action": "/scriptevent leafgui:shop_main",
        "actions": [
          "/scriptevent leafgui:shop_main"
        ],
        "iconID": "leaf/image-1202",
        "iconOverrides": [],
        "requiredTag": "$cfg/Shops",
        "disabled": false,
        "id": 4
      },
      {
        "text": "§aTransfer Money",
        "subtext": "[ Click to Open ]",
        "action": "/scriptevent leafgui:pay",
        "actions": [
          "/scriptevent leafgui:pay"
        ],
        "iconID": "leaf/image-481",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": false,
        "id": 6
      },
      {
        "text": "§bClans",
        "subtext": "[ Click to Open ]",
        "action": "/scriptevent leafgui:clans_root",
        "actions": [
          "/scriptevent leafgui:clans_root"
        ],
        "iconID": "leaf/image-0911",
        "iconOverrides": [],
        "requiredTag": "$cfg/Clans",
        "disabled": false,
        "id": 7
      },
      {
        "text": "§aLand Claims",
        "subtext": "Manage your land claims",
        "action": "/scriptevent leafgui:land_claims",
        "actions": [
          "/scriptevent leafgui:land_claims"
        ],
        "iconID": "Packs/Asteroid/global",
        "iconOverrides": [],
        "requiredTag": "$cfg/LandClaims",
        "disabled": false,
        "id": 167761812
      },
      {
        "text": "§cRedeem Gift Code",
        "subtext": "[ Click to Open ]",
        "action": "/scriptevent leafgui:redeem_gift_code",
        "actions": [
          "/scriptevent leafgui:redeem_gift_code"
        ],
        "iconID": "leaf/image-0909",
        "iconOverrides": [],
        "requiredTag": "$cfg/Gifts",
        "disabled": false,
        "id": 5,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      }
    ],
    "subuis": {},
    "scriptevent": "leaf/nav",
    "cancel": "",
    "theme": 8,
    "lastID": 7,
    "paperdoll": true,
    "pinned": true,
    "folder": 1741898363581751
  },
  "internal": true,
  "internalID": 7
})
uiBuilder.addInternalUI({
  "name": "Config UI / Misc",
  "body": "",
  "layout": 4,
  "type": 0,
  "buttons": [
    {
      "text": "§cDev Settings",
      "subtext": "uwu kawaii settings please dont touch :trans:",
      "action": "/scriptevent leafgui:dev",
      "actions": [
        "/scriptevent leafgui:dev"
      ],
      "iconID": "^textures/azalea_icons/DevSettings",
      "iconOverrides": [],
      "requiredTag": "$cfg/DevMode",
      "id": 5,
      "displayOverrides": [],
      "nutUIHeaderButton": true,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "sellButtonScoreboard": "money",
      "buyButtonEnabled": false,
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "buyButtonItem": ""
    },
    {
      "text": " ",
      "subtext": null,
      "action": "",
      "actions": [
        ""
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "",
      "type": "group",
      "buttons": [
        {
          "text": "Main Settings",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/main",
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$thiseq/nutui/main",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 1,
          "actions": [
            "/scriptevent leaf:open nutui/main"
          ]
        },
        {
          "text": "Misc Settings",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/misc",
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$thiseq/nutui/misc",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 2,
          "actions": [
            "/scriptevent leaf:open nutui/misc"
          ]
        },
        {
          "text": "Info & Support",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/credits",
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$thiseq/nutui/credits",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 3,
          "actions": [
            "/scriptevent leaf:open nutui/credits"
          ]
        }
      ],
      "buttonRow": true,
      "id": 28
    },
    {
      "text": "CherryCloud",
      "subtext": "",
      "action": "/scriptevent leaf:open nutui/cc",
      "actions": [
        "/scriptevent leaf:open nutui/cc"
      ],
      "iconID": "^textures/azalea_icons/CherryCloud",
      "iconOverrides": [],
      "requiredTag": "$NETLIB_SETUP",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "$thiseq/nutui/cc",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "id": 32
    },
    {
      "text": "§eLeaderboards",
      "subtext": "Configure this servers leaderboards",
      "action": "/scriptevent leafgui:leaderboards_root",
      "actions": [
        "/scriptevent leafgui:leaderboards_root"
      ],
      "iconID": "leaf/image-625",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 11,
      "disabled": false
    },
    {
      "text": "§dClans",
      "subtext": "Configure & Manage Clans",
      "action": "/scriptevent leafgui:clans_admin",
      "actions": [
        "/scriptevent leafgui:clans_config"
      ],
      "iconID": "leaf/image-1073",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 12,
      "disabled": false
    },
    {
      "text": "§dAuction §qHouse",
      "subtext": "Configure Auction House",
      "action": "/say nuhuh",
      "actions": [
        "/scriptevent leafgui:ah_settings"
      ],
      "iconID": "leaf/image-0909",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": false,
      "id": 29,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§eNametags§6+",
      "subtext": "Better player nametags",
      "action": "/scriptevent leafgui:nametags_plus_config",
      "actions": [
        "/scriptevent leafgui:nametags_plus_config"
      ],
      "iconID": "leaf/image-1015",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": false,
      "id": 31
    },
    {
      "text": "§bRandom §eTP",
      "subtext": "Configure random teleport",
      "action": "/scriptevent leafgui:rtp_config",
      "actions": [
        "/scriptevent leafgui:rtp_config"
      ],
      "iconID": "leaf/image-480",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": false,
      "id": 22,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§aSnippet §bBook",
      "subtext": "Store & Reuse parts of your UIs",
      "action": "/scriptevent leafgui:snippet_book",
      "actions": [
        "/scriptevent leafgui:snippet_book"
      ],
      "iconID": "leaf/image-0876",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 13,
      "disabled": false
    },
    {
      "text": "§6Role §vEditor",
      "subtext": "Edit player permissions",
      "action": "/scriptevent leafgui:role_editor",
      "actions": [
        "/scriptevent leafgui:role_editor"
      ],
      "iconID": "leaf/image-068",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 14,
      "disabled": true,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "buyButtonEnabled": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false
    },
    {
      "text": "§nMines §sConfig",
      "subtext": "Coming soon",
      "action": "/scriptevent leafgui:mines",
      "actions": [
        "/scriptevent leafgui:mines"
      ],
      "iconID": "leaf/image-0866",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 16,
      "disabled": true,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§6Homes §3Config",
      "subtext": "Configure homes",
      "action": "/scriptevent leafgui:homes_config",
      "actions": [
        "/scriptevent leafgui:homes_config"
      ],
      "iconID": "leaf/image-1169",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 17,
      "disabled": true,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "buyButtonEnabled": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false
    },
    {
      "text": "§bBattle §uPass",
      "subtext": "I did NOT want to add this",
      "action": "/scriptevent leafgui:battle_pass",
      "actions": [
        "/scriptevent leafgui:battle_pass"
      ],
      "iconID": "leaf/image-1334",
      "iconOverrides": [],
      "requiredTag": "$cfg/BattlePass",
      "id": 18,
      "disabled": false,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§ePlayer §aSettings",
      "subtext": "Coming soon",
      "action": "/scriptevent leafgui:player_settings",
      "actions": [
        "/scriptevent leafgui:player_settings"
      ],
      "iconID": "leaf/image-1106",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 19,
      "disabled": true,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§bCombat §9Log",
      "subtext": "Configure combat log",
      "action": "/scriptevent leafgui:combat_log",
      "actions": [
        "/scriptevent leafgui:combat_log"
      ],
      "iconID": "leaf/image-1295",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 20,
      "disabled": false,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§dCustom §5Enchants",
      "subtext": "im starting an onlyfans",
      "action": "/scriptevent leafgui:custom_enchants",
      "actions": [
        "/scriptevent leafgui:custom_enchants"
      ],
      "iconID": "leaf/image-1299",
      "iconOverrides": [],
      "requiredTag": "$cfg/CustomEnchants",
      "id": 21,
      "disabled": false,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§eBack to old design",
      "subtext": "Click to go back to old config UI design",
      "action": "/tag @s add old-config",
      "actions": [
        "/tag @s add old-config",
        "/scriptevent leafgui:config_menu_start_page"
      ],
      "iconID": "leaf/image-1135",
      "iconOverrides": [],
      "requiredTag": "!$cfg/DisableOldDesignButton",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": true,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "id": 23
    },
    {
      "text": "§pGenerators",
      "subtext": "Manage Generators",
      "action": "/scriptevent leafgui:edit_generators",
      "actions": [
        "/scriptevent leafgui:edit_generators"
      ],
      "iconID": "leaf/image-045",
      "iconOverrides": [],
      "requiredTag": "$cfg/Generators",
      "disabled": false,
      "id": 25
    },
    {
      "text": "§ePlatform §cSettings",
      "subtext": "Platform-based tags",
      "action": "/scriptevent leafgui:platformsettings",
      "actions": [
        "/scriptevent leafgui:platformsettings"
      ],
      "iconID": "leaf/image-0873",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": false,
      "id": 24,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§cGifts",
      "subtext": "Configure gift codes",
      "action": "/scriptevent leafgui:edit_gift_codes",
      "actions": [
        "/scriptevent leafgui:edit_gift_codes"
      ],
      "iconID": "leaf/image-0965",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": false,
      "id": 30
    },
    {
      "text": "§cChat §6Format",
      "subtext": "Very advanced feature",
      "action": "/scriptevent leafgui:chatformat_config",
      "actions": [
        "/scriptevent leafgui:chatformat_config"
      ],
      "iconID": "^textures/azalea_icons/Chat",
      "iconOverrides": [],
      "requiredTag": "$cfg/Chatranks",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false,
      "id": 26
    },
    {
      "text": "§cReset Chat Format",
      "subtext": "Resets the chat format",
      "action": "/scriptevent leaf:reset_crf",
      "actions": [
        "/scriptevent leaf:reset_crf",
        "/scriptevent leafgui:misc_config"
      ],
      "iconID": "^textures/azalea_icons/resetchatrankformat",
      "iconOverrides": [],
      "requiredTag": "$cfg/Chatranks",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false,
      "id": 27
    }
  ],
  "subuis": {},
  "scriptevent": "nutui/misc",
  "lastID": 32,
  "theme": 25,
  "pinned": true,
  "pin": null,
  "pinSetBy": null,
  "paperdoll": false,
  "accessToken": "f81f78ca-c286-44b7-aa03-84d8da759004                                                                                                                                                                               ",
  "folder": 1741898363581751,
  "original": {
    "name": "Config UI / Misc",
    "body": "",
    "layout": 4,
    "type": 0,
    "buttons": [
      {
        "text": "§cDev Settings",
        "subtext": "uwu kawaii settings please dont touch :trans:",
        "action": "/scriptevent leafgui:dev",
        "actions": [
          "/scriptevent leafgui:dev"
        ],
        "iconID": "^textures/azalea_icons/DevSettings",
        "iconOverrides": [],
        "requiredTag": "$cfg/DevMode",
        "id": 5,
        "displayOverrides": [],
        "nutUIHeaderButton": true,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "sellButtonScoreboard": "money",
        "buyButtonEnabled": false,
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "buyButtonItem": ""
      },
      {
        "text": " ",
        "subtext": null,
        "action": "",
        "actions": [
          ""
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "type": "group",
        "buttons": [
          {
            "text": "Main Settings",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/main",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/main",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 1,
            "actions": [
              "/scriptevent leaf:open nutui/main"
            ]
          },
          {
            "text": "Misc Settings",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/misc",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/misc",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 2,
            "actions": [
              "/scriptevent leaf:open nutui/misc"
            ]
          },
          {
            "text": "Info & Support",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/credits",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/credits",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 3,
            "actions": [
              "/scriptevent leaf:open nutui/credits"
            ]
          }
        ],
        "buttonRow": true,
        "id": 28
      },
      {
        "text": "CherryCloud",
        "subtext": "",
        "action": "/scriptevent leaf:open nutui/cc",
        "actions": [
          "/scriptevent leaf:open nutui/cc"
        ],
        "iconID": "^textures/azalea_icons/CherryCloud",
        "iconOverrides": [],
        "requiredTag": "$NETLIB_SETUP",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "$thiseq/nutui/cc",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "id": 32
      },
      {
        "text": "§eLeaderboards",
        "subtext": "Configure this servers leaderboards",
        "action": "/scriptevent leafgui:leaderboards_root",
        "actions": [
          "/scriptevent leafgui:leaderboards_root"
        ],
        "iconID": "leaf/image-625",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 11,
        "disabled": false
      },
      {
        "text": "§dClans",
        "subtext": "Configure & Manage Clans",
        "action": "/scriptevent leafgui:clans_admin",
        "actions": [
          "/scriptevent leafgui:clans_config"
        ],
        "iconID": "leaf/image-1073",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 12,
        "disabled": false
      },
      {
        "text": "§dAuction §qHouse",
        "subtext": "Configure Auction House",
        "action": "/say nuhuh",
        "actions": [
          "/scriptevent leafgui:ah_settings"
        ],
        "iconID": "leaf/image-0909",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": false,
        "id": 29,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§eNametags§6+",
        "subtext": "Better player nametags",
        "action": "/scriptevent leafgui:nametags_plus_config",
        "actions": [
          "/scriptevent leafgui:nametags_plus_config"
        ],
        "iconID": "leaf/image-1015",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": false,
        "id": 31
      },
      {
        "text": "§bRandom §eTP",
        "subtext": "Configure random teleport",
        "action": "/scriptevent leafgui:rtp_config",
        "actions": [
          "/scriptevent leafgui:rtp_config"
        ],
        "iconID": "leaf/image-480",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": false,
        "id": 22,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§aSnippet §bBook",
        "subtext": "Store & Reuse parts of your UIs",
        "action": "/scriptevent leafgui:snippet_book",
        "actions": [
          "/scriptevent leafgui:snippet_book"
        ],
        "iconID": "leaf/image-0876",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 13,
        "disabled": false
      },
      {
        "text": "§6Role §vEditor",
        "subtext": "Edit player permissions",
        "action": "/scriptevent leafgui:role_editor",
        "actions": [
          "/scriptevent leafgui:role_editor"
        ],
        "iconID": "leaf/image-068",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 14,
        "disabled": true,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "buyButtonEnabled": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false
      },
      {
        "text": "§nMines §sConfig",
        "subtext": "Coming soon",
        "action": "/scriptevent leafgui:mines",
        "actions": [
          "/scriptevent leafgui:mines"
        ],
        "iconID": "leaf/image-0866",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 16,
        "disabled": true,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§6Homes §3Config",
        "subtext": "Configure homes",
        "action": "/scriptevent leafgui:homes_config",
        "actions": [
          "/scriptevent leafgui:homes_config"
        ],
        "iconID": "leaf/image-1169",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 17,
        "disabled": true,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "buyButtonEnabled": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false
      },
      {
        "text": "§bBattle §uPass",
        "subtext": "I did NOT want to add this",
        "action": "/scriptevent leafgui:battle_pass",
        "actions": [
          "/scriptevent leafgui:battle_pass"
        ],
        "iconID": "leaf/image-1334",
        "iconOverrides": [],
        "requiredTag": "$cfg/BattlePass",
        "id": 18,
        "disabled": false,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§ePlayer §aSettings",
        "subtext": "Coming soon",
        "action": "/scriptevent leafgui:player_settings",
        "actions": [
          "/scriptevent leafgui:player_settings"
        ],
        "iconID": "leaf/image-1106",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 19,
        "disabled": true,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§bCombat §9Log",
        "subtext": "Configure combat log",
        "action": "/scriptevent leafgui:combat_log",
        "actions": [
          "/scriptevent leafgui:combat_log"
        ],
        "iconID": "leaf/image-1295",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 20,
        "disabled": false,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§dCustom §5Enchants",
        "subtext": "im starting an onlyfans",
        "action": "/scriptevent leafgui:custom_enchants",
        "actions": [
          "/scriptevent leafgui:custom_enchants"
        ],
        "iconID": "leaf/image-1299",
        "iconOverrides": [],
        "requiredTag": "$cfg/CustomEnchants",
        "id": 21,
        "disabled": false,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§eBack to old design",
        "subtext": "Click to go back to old config UI design",
        "action": "/tag @s add old-config",
        "actions": [
          "/tag @s add old-config",
          "/scriptevent leafgui:config_menu_start_page"
        ],
        "iconID": "leaf/image-1135",
        "iconOverrides": [],
        "requiredTag": "!$cfg/DisableOldDesignButton",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": true,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "id": 23
      },
      {
        "text": "§pGenerators",
        "subtext": "Manage Generators",
        "action": "/scriptevent leafgui:edit_generators",
        "actions": [
          "/scriptevent leafgui:edit_generators"
        ],
        "iconID": "leaf/image-045",
        "iconOverrides": [],
        "requiredTag": "$cfg/Generators",
        "disabled": false,
        "id": 25
      },
      {
        "text": "§ePlatform §cSettings",
        "subtext": "Platform-based tags",
        "action": "/scriptevent leafgui:platformsettings",
        "actions": [
          "/scriptevent leafgui:platformsettings"
        ],
        "iconID": "leaf/image-0873",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": false,
        "id": 24,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§cGifts",
        "subtext": "Configure gift codes",
        "action": "/scriptevent leafgui:edit_gift_codes",
        "actions": [
          "/scriptevent leafgui:edit_gift_codes"
        ],
        "iconID": "leaf/image-0965",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": false,
        "id": 30
      },
      {
        "text": "§cChat §6Format",
        "subtext": "Very advanced feature",
        "action": "/scriptevent leafgui:chatformat_config",
        "actions": [
          "/scriptevent leafgui:chatformat_config"
        ],
        "iconID": "^textures/azalea_icons/Chat",
        "iconOverrides": [],
        "requiredTag": "$cfg/Chatranks",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "disabled": false,
        "id": 26
      },
      {
        "text": "§cReset Chat Format",
        "subtext": "Resets the chat format",
        "action": "/scriptevent leaf:reset_crf",
        "actions": [
          "/scriptevent leaf:reset_crf",
          "/scriptevent leafgui:misc_config"
        ],
        "iconID": "^textures/azalea_icons/resetchatrankformat",
        "iconOverrides": [],
        "requiredTag": "$cfg/Chatranks",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "disabled": false,
        "id": 27
      }
    ],
    "subuis": {},
    "scriptevent": "nutui/misc",
    "lastID": 32,
    "theme": 15,
    "pinned": true,
    "pin": null,
    "pinSetBy": null,
    "paperdoll": true,
    "accessToken": "f81f78ca-c286-44b7-aa03-84d8da759004                                                                                                                                                                               ",
    "folder": 1741898363581751
  },
  "internal": true,
  "internalID": 7
})
uiBuilder.addInternalUI({
  "name": "Config UI / Main",
  "body": "",
  "layout": 4,
  "type": 0,
  "buttons": [
    {
      "text": "§cDev Settings",
      "subtext": "uwu kawaii settings please dont touch :trans:",
      "action": "/scriptevent leafgui:dev",
      "actions": [
        "/scriptevent leafgui:dev"
      ],
      "iconID": "^textures/azalea_icons/DevSettings",
      "iconOverrides": [],
      "requiredTag": "$cfg/DevMode",
      "id": 5,
      "displayOverrides": [],
      "nutUIHeaderButton": true,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "sellButtonScoreboard": "money",
      "buyButtonEnabled": false,
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "buyButtonItem": ""
    },
    {
      "text": " ",
      "subtext": null,
      "action": "",
      "actions": [
        ""
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "",
      "type": "group",
      "buttons": [
        {
          "text": "Main Settings",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/main",
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$thiseq/nutui/main",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 1,
          "actions": [
            "/scriptevent leaf:open nutui/main"
          ]
        },
        {
          "text": "Misc Settings",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/misc",
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$thiseq/nutui/misc",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 2,
          "actions": [
            "/scriptevent leaf:open nutui/misc"
          ]
        },
        {
          "text": "Info & Support",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/credits",
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$thiseq/nutui/credits",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 3,
          "actions": [
            "/scriptevent leaf:open nutui/credits"
          ]
        }
      ],
      "buttonRow": true,
      "id": 22
    },
    {
      "text": "CherryCloud",
      "subtext": "",
      "action": "/scriptevent leaf:open nutui/cc",
      "actions": [
        "/scriptevent leaf:open nutui/cc"
      ],
      "iconID": "^textures/azalea_icons/CherryCloud",
      "iconOverrides": [],
      "requiredTag": "$NETLIB_SETUP",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "$thiseq/nutui/cc",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "id": 26
    },
    {
      "text": "§m§0§1§r§aPreset §bBrowser",
      "subtext": "Presets made by the leaf community!",
      "action": "/scriptevent leafgui:preset_browser",
      "actions": [
        "/scriptevent leafgui:preset_browser"
      ],
      "iconID": "Packs/Asteroid/global",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 12,
      "disabled": false,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§aFeatures & Experiments",
      "subtext": "Toggle parts of leaf",
      "action": "/scriptevent leafgui:modules_config",
      "actions": [
        "/scriptevent leafgui:modules_config"
      ],
      "iconID": "Packs/Asteroid/change",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 4,
      "displayOverrides": [],
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "sellButtonScoreboard": "money",
      "buyButtonEnabled": false,
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "buyButtonItem": "",
      "nutUIAlt": false
    },
    {
      "text": "{{gay \"Customizer\"}}",
      "subtext": "Customize leaf",
      "action": "/scriptevent leafgui:ui_builder_main_page",
      "actions": [
        "/scriptevent leafgui:ui_builder_main_page"
      ],
      "iconID": "^textures/azalea_icons/RainbowPaintBrush",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 2,
      "displayOverrides": [],
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "sellButtonScoreboard": "money",
      "buyButtonEnabled": false,
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "buyButtonItem": "",
      "nutUIAlt": false,
      "meta": "",
      "nutUIColorCondition": ""
    },
    {
      "text": "§eHelp Center",
      "subtext": "Open help page",
      "action": "/scriptevent leafgui:uihelp",
      "actions": [
        "/scriptevent leafgui:uihelp"
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "false",
      "id": 8,
      "displayOverrides": [],
      "nutUIHeaderButton": false,
      "nutUIHalf": 2,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false,
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "sellButtonScoreboard": "money",
      "buyButtonEnabled": false,
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "buyButtonItem": "",
      "nutUIColorCondition": ""
    },
    {
      "text": "§cModeration §dHub",
      "subtext": "Reports, Bans & More!",
      "action": "/scriptevent leafgui:moderation_hub",
      "actions": [
        "/scriptevent leafgui:moderation_hub"
      ],
      "iconID": "leaf/image-1191",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": false,
      "id": 15
    },
    {
      "text": "§qSidebar Editor",
      "subtext": "Make Custom Sidebars Easily",
      "action": "scriptevent leafgui:sidebar_editor_root",
      "actions": [
        "scriptevent leafgui:sidebar_editor_root"
      ],
      "iconID": "leaf/image-521",
      "iconOverrides": [],
      "requiredTag": "false",
      "id": 7,
      "displayOverrides": [
        {
          "condition": "$cfg/RefreshedSidebar",
          "text": "§uSidebar §dV2",
          "subtext": "The new and improved sidebar editor!",
          "iconID": "leaf/image-521"
        }
      ],
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "sellButtonScoreboard": "money",
      "buyButtonEnabled": false,
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "buyButtonItem": "",
      "nutUIAlt": false,
      "nutUIColorCondition": "",
      "disabled": false
    },
    {
      "text": "§aEconomy §2Settings",
      "subtext": "Manage currencies and more",
      "action": "/scriptevent leaf:open nutui/economy",
      "actions": [
        "/scriptevent leafgui:currency_editor"
      ],
      "iconID": "leaf/image-481",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 14,
      "disabled": false
    },
    {
      "text": "§vEvents",
      "subtext": "Do things when things happen",
      "action": "/scriptevent leafgui:actions",
      "actions": [
        "/scriptevent leafgui:events_editor_root"
      ],
      "iconID": "Packs/Asteroid/slash",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 13,
      "disabled": false,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§eBack to old design",
      "subtext": "Click to go back to old config UI design",
      "action": "/tag @s add old-config",
      "actions": [
        "/tag @s add old-config",
        "/scriptevent leafgui:config_menu_start_page"
      ],
      "iconID": "leaf/image-1135",
      "iconOverrides": [],
      "requiredTag": "!$cfg/DisableOldDesignButton",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": true,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "id": 16
    },
    {
      "text": "§aSkills",
      "subtext": "Coming soon",
      "action": "/scriptevent leafgui:skills",
      "actions": [
        "/scriptevent leafgui:skills"
      ],
      "iconID": "leaf/image-0973",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": true,
      "id": 18,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§eZones §6Config",
      "subtext": "Manage zones",
      "action": "/scriptevent leafgui:zones",
      "actions": [
        "/scriptevent leafgui:zones"
      ],
      "iconID": "leaf/image-1190",
      "iconOverrides": [],
      "requiredTag": "$cfg/Zones",
      "disabled": false,
      "id": 19,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "text": "§bRoquefort",
      "subtext": "Roquefort!",
      "action": "/scriptevent leaf:open leaf/roquefort",
      "actions": [
        "/scriptevent leaf:open leaf/roquefort"
      ],
      "iconID": "leaf/roquefort-hd",
      "iconOverrides": [],
      "requiredTag": "asdasdasd",
      "id": 24,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false
    },
    {
      "text": "§eLand Claims",
      "subtext": "Configure land claims",
      "action": "/scriptevent leafgui:land_claims",
      "actions": [
        "/scriptevent leafgui:land_claims_config"
      ],
      "iconID": "leaf/image-0961",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": false,
      "id": 27,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "buyButtonEnabled": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false
    },
    {
      "text": "§bAutomated Messages",
      "subtext": "Send randomized automated messages",
      "action": "/scriptevent leafgui:automized_messages",
      "actions": [
        "/scriptevent leafgui:automized_messages"
      ],
      "iconID": "leaf/image-482",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": true,
      "id": 28,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "buyButtonEnabled": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false
    },
    {
      "text": "§fChat Ranks",
      "subtext": "Manage chat rank config",
      "action": "/scriptevent leafgui:chat_modules",
      "actions": [
        "/scriptevent leafgui:chatranks_config"
      ],
      "iconID": "leaf/image-477",
      "iconOverrides": [],
      "requiredTag": "$cfg/Chatranks",
      "disabled": false,
      "id": 29,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "buyButtonEnabled": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false
    },
    {
      "text": "§cTrading Settings",
      "subtext": "Configure Trade UI",
      "action": "/scriptevent leafgui:trades",
      "actions": [
        "/scriptevent leafgui:trades"
      ],
      "iconID": "leaf/image-772",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": true,
      "id": 30,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "buyButtonEnabled": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false
    },
    {
      "text": "§cBackpack §6Settings",
      "subtext": "Configure backpack",
      "action": "/scriptevent leafgui:backpack_settings",
      "actions": [
        "/scriptevent leafgui:backpack_settings"
      ],
      "iconID": "leaf/image-517",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": true,
      "id": 31,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "buyButtonEnabled": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false
    },
    {
      "text": "§cPlots",
      "subtext": "Configure plots system",
      "action": "/scriptevent leafgui:plots",
      "actions": [
        "/scriptevent leafgui:plots"
      ],
      "iconID": "leaf/image-613",
      "iconOverrides": [],
      "requiredTag": "",
      "disabled": true,
      "id": 32,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "buyButtonEnabled": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false
    },
    {
      "text": "pfffffff",
      "subtext": "",
      "action": "/kill",
      "actions": [
        "/kill",
        "/summon tnt"
      ],
      "iconID": "leaf/image-085",
      "iconOverrides": [],
      "requiredTag": "ASDDDDD:3",
      "disabled": false,
      "id": 115003427,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "buyButtonEnabled": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false
    },
    {
      "text": "§pLeaf Plugins",
      "subtext": "View Leaf Plugins",
      "action": "/say run",
      "actions": [
        "/say run"
      ],
      "iconID": "leaf/image-011",
      "iconOverrides": [],
      "requiredTag": "",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "buyButtonEnabled": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false,
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "id": 1309056132
    }
  ],
  "subuis": {},
  "scriptevent": "nutui/main",
  "lastID": 32,
  "theme": 25,
  "pinned": true,
  "paperdoll": false,
  "pin": null,
  "pinSetBy": null,
  "cancel": "",
  "folder": 1741898363581751,
  "original": {
    "name": "Config UI / Main",
    "body": "",
    "layout": 4,
    "type": 0,
    "buttons": [
      {
        "text": "§cDev Settings",
        "subtext": "uwu kawaii settings please dont touch :trans:",
        "action": "/scriptevent leafgui:dev",
        "actions": [
          "/scriptevent leafgui:dev"
        ],
        "iconID": "^textures/azalea_icons/DevSettings",
        "iconOverrides": [],
        "requiredTag": "$cfg/DevMode",
        "id": 5,
        "displayOverrides": [],
        "nutUIHeaderButton": true,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "sellButtonScoreboard": "money",
        "buyButtonEnabled": false,
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "buyButtonItem": ""
      },
      {
        "text": " ",
        "subtext": null,
        "action": "",
        "actions": [
          ""
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "type": "group",
        "buttons": [
          {
            "text": "Main Settings",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/main",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/main",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 1,
            "actions": [
              "/scriptevent leaf:open nutui/main"
            ]
          },
          {
            "text": "Misc Settings",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/misc",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/misc",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 2,
            "actions": [
              "/scriptevent leaf:open nutui/misc"
            ]
          },
          {
            "text": "Info & Support",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/credits",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/credits",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 3,
            "actions": [
              "/scriptevent leaf:open nutui/credits"
            ]
          }
        ],
        "buttonRow": true,
        "id": 22
      },
      {
        "text": "CherryCloud",
        "subtext": "",
        "action": "/scriptevent leaf:open nutui/cc",
        "actions": [
          "/scriptevent leaf:open nutui/cc"
        ],
        "iconID": "^textures/azalea_icons/CherryCloud",
        "iconOverrides": [],
        "requiredTag": "$NETLIB_SETUP",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "$thiseq/nutui/cc",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "id": 26
      },
      {
        "text": "§m§0§1§r§aPreset §bBrowser",
        "subtext": "Presets made by the leaf community!",
        "action": "/scriptevent leafgui:preset_browser",
        "actions": [
          "/scriptevent leafgui:preset_browser"
        ],
        "iconID": "Packs/Asteroid/global",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 12,
        "disabled": false,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§aFeatures & Experiments",
        "subtext": "Toggle parts of leaf",
        "action": "/scriptevent leafgui:modules_config",
        "actions": [
          "/scriptevent leafgui:modules_config"
        ],
        "iconID": "Packs/Asteroid/change",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 4,
        "displayOverrides": [],
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "sellButtonScoreboard": "money",
        "buyButtonEnabled": false,
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "buyButtonItem": "",
        "nutUIAlt": false
      },
      {
        "text": "{{gay \"Customizer\"}}",
        "subtext": "Customize leaf",
        "action": "/scriptevent leafgui:ui_builder_main_page",
        "actions": [
          "/scriptevent leafgui:ui_builder_main_page"
        ],
        "iconID": "^textures/azalea_icons/RainbowPaintBrush",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 2,
        "displayOverrides": [],
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "sellButtonScoreboard": "money",
        "buyButtonEnabled": false,
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "buyButtonItem": "",
        "nutUIAlt": false,
        "meta": "",
        "nutUIColorCondition": ""
      },
      {
        "text": "§eHelp Center",
        "subtext": "Open help page",
        "action": "/scriptevent leafgui:uihelp",
        "actions": [
          "/scriptevent leafgui:uihelp"
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "false",
        "id": 8,
        "displayOverrides": [],
        "nutUIHeaderButton": false,
        "nutUIHalf": 2,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "disabled": false,
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "sellButtonScoreboard": "money",
        "buyButtonEnabled": false,
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "buyButtonItem": "",
        "nutUIColorCondition": ""
      },
      {
        "text": "§cModeration §dHub",
        "subtext": "Reports, Bans & More!",
        "action": "/scriptevent leafgui:moderation_hub",
        "actions": [
          "/scriptevent leafgui:moderation_hub"
        ],
        "iconID": "leaf/image-1191",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": false,
        "id": 15
      },
      {
        "text": "§qSidebar Editor",
        "subtext": "Make Custom Sidebars Easily",
        "action": "scriptevent leafgui:sidebar_editor_root",
        "actions": [
          "scriptevent leafgui:sidebar_editor_root"
        ],
        "iconID": "leaf/image-521",
        "iconOverrides": [],
        "requiredTag": "false",
        "id": 7,
        "displayOverrides": [
          {
            "condition": "$cfg/RefreshedSidebar",
            "text": "§uSidebar §dV2",
            "subtext": "The new and improved sidebar editor!",
            "iconID": "leaf/image-521"
          }
        ],
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "sellButtonScoreboard": "money",
        "buyButtonEnabled": false,
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "buyButtonItem": "",
        "nutUIAlt": false,
        "nutUIColorCondition": "",
        "disabled": false
      },
      {
        "text": "§aEconomy §2Settings",
        "subtext": "Manage currencies and more",
        "action": "/scriptevent leaf:open nutui/economy",
        "actions": [
          "/scriptevent leafgui:currency_editor"
        ],
        "iconID": "leaf/image-481",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 14,
        "disabled": false
      },
      {
        "text": "§vEvents",
        "subtext": "Do things when things happen",
        "action": "/scriptevent leafgui:actions",
        "actions": [
          "/scriptevent leafgui:events_editor_root"
        ],
        "iconID": "Packs/Asteroid/slash",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 13,
        "disabled": false,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§eBack to old design",
        "subtext": "Click to go back to old config UI design",
        "action": "/tag @s add old-config",
        "actions": [
          "/tag @s add old-config",
          "/scriptevent leafgui:config_menu_start_page"
        ],
        "iconID": "leaf/image-1135",
        "iconOverrides": [],
        "requiredTag": "!$cfg/DisableOldDesignButton",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": true,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "id": 16
      },
      {
        "text": "§aSkills",
        "subtext": "Coming soon",
        "action": "/scriptevent leafgui:skills",
        "actions": [
          "/scriptevent leafgui:skills"
        ],
        "iconID": "leaf/image-0973",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": true,
        "id": 18,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§eZones §6Config",
        "subtext": "Manage zones",
        "action": "/scriptevent leafgui:zones",
        "actions": [
          "/scriptevent leafgui:zones"
        ],
        "iconID": "leaf/image-1190",
        "iconOverrides": [],
        "requiredTag": "$cfg/Zones",
        "disabled": false,
        "id": 19,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "text": "§bRoquefort",
        "subtext": "Roquefort!",
        "action": "/scriptevent leaf:open leaf/roquefort",
        "actions": [
          "/scriptevent leaf:open leaf/roquefort"
        ],
        "iconID": "leaf/roquefort-hd",
        "iconOverrides": [],
        "requiredTag": "asdasdasd",
        "id": 24,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "disabled": false
      },
      {
        "text": "§eLand Claims",
        "subtext": "Configure land claims",
        "action": "/scriptevent leafgui:land_claims",
        "actions": [
          "/scriptevent leafgui:land_claims_config"
        ],
        "iconID": "leaf/image-0961",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": false,
        "id": 27,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "buyButtonEnabled": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false
      },
      {
        "text": "§bAutomated Messages",
        "subtext": "Send randomized automated messages",
        "action": "/scriptevent leafgui:automized_messages",
        "actions": [
          "/scriptevent leafgui:automized_messages"
        ],
        "iconID": "leaf/image-482",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": true,
        "id": 28,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "buyButtonEnabled": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false
      },
      {
        "text": "§fChat Ranks",
        "subtext": "Manage chat rank config",
        "action": "/scriptevent leafgui:chat_modules",
        "actions": [
          "/scriptevent leafgui:chatranks_config"
        ],
        "iconID": "leaf/image-477",
        "iconOverrides": [],
        "requiredTag": "$cfg/Chatranks",
        "disabled": false,
        "id": 29,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "buyButtonEnabled": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false
      },
      {
        "text": "§cTrading Settings",
        "subtext": "Configure Trade UI",
        "action": "/scriptevent leafgui:trades",
        "actions": [
          "/scriptevent leafgui:trades"
        ],
        "iconID": "leaf/image-772",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": true,
        "id": 30,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "buyButtonEnabled": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false
      },
      {
        "text": "§cBackpack §6Settings",
        "subtext": "Configure backpack",
        "action": "/scriptevent leafgui:backpack_settings",
        "actions": [
          "/scriptevent leafgui:backpack_settings"
        ],
        "iconID": "leaf/image-517",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": true,
        "id": 31,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "buyButtonEnabled": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false
      },
      {
        "text": "§cPlots",
        "subtext": "Configure plots system",
        "action": "/scriptevent leafgui:plots",
        "actions": [
          "/scriptevent leafgui:plots"
        ],
        "iconID": "leaf/image-613",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": true,
        "id": 32,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "buyButtonEnabled": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false
      },
      {
        "text": "pfffffff",
        "subtext": "",
        "action": "/kill",
        "actions": [
          "/kill",
          "/summon tnt"
        ],
        "iconID": "leaf/image-085",
        "iconOverrides": [],
        "requiredTag": "ASDDDDD:3",
        "disabled": false,
        "id": 115003427,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "buyButtonEnabled": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false
      }
    ],
    "subuis": {},
    "scriptevent": "nutui/main",
    "lastID": 32,
    "theme": 12,
    "pinned": true,
    "paperdoll": true,
    "pin": null,
    "pinSetBy": null,
    "cancel": "",
    "folder": 1741898363581751,
    "original": {
      "name": "Config UI / Main",
      "body": "",
      "layout": 4,
      "type": 0,
      "buttons": [
        {
          "text": "§cDev Settings",
          "subtext": "uwu kawaii settings please dont touch :trans:",
          "action": "/scriptevent leafgui:dev",
          "actions": [
            "/scriptevent leafgui:dev"
          ],
          "iconID": "^textures/azalea_icons/DevSettings",
          "iconOverrides": [],
          "requiredTag": "$cfg/DevMode",
          "id": 5,
          "displayOverrides": [],
          "nutUIHeaderButton": true,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "sellButtonScoreboard": "money",
          "buyButtonEnabled": false,
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "buyButtonItem": ""
        },
        {
          "text": " ",
          "subtext": null,
          "action": "",
          "actions": [
            ""
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "type": "group",
          "buttons": [
            {
              "text": "Main Settings",
              "subtext": "",
              "action": "/scriptevent leaf:open nutui/main",
              "requiredTag": "",
              "displayOverrides": [],
              "nutUIColorCondition": "$thiseq/nutui/main",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false,
              "id": 1,
              "actions": [
                "/scriptevent leaf:open nutui/main"
              ]
            },
            {
              "text": "Misc Settings",
              "subtext": "",
              "action": "/scriptevent leaf:open nutui/misc",
              "requiredTag": "",
              "displayOverrides": [],
              "nutUIColorCondition": "$thiseq/nutui/misc",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false,
              "id": 2,
              "actions": [
                "/scriptevent leaf:open nutui/misc"
              ]
            },
            {
              "text": "Info & Support",
              "subtext": "",
              "action": "/scriptevent leaf:open nutui/credits",
              "requiredTag": "",
              "displayOverrides": [],
              "nutUIColorCondition": "$thiseq/nutui/credits",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false,
              "id": 3,
              "actions": [
                "/scriptevent leaf:open nutui/credits"
              ]
            }
          ],
          "buttonRow": true,
          "id": 22
        },
        {
          "text": "CherryCloud",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/cc",
          "actions": [
            "/scriptevent leaf:open nutui/cc"
          ],
          "iconID": "^textures/azalea_icons/CherryCloud",
          "iconOverrides": [],
          "requiredTag": "$NETLIB_SETUP",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$thiseq/nutui/cc",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "id": 26
        },
        {
          "text": "§m§0§1§r§aPreset §bBrowser",
          "subtext": "Presets made by the leaf community!",
          "action": "/scriptevent leafgui:preset_browser",
          "actions": [
            "/scriptevent leafgui:preset_browser"
          ],
          "iconID": "Packs/Asteroid/global",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 12,
          "disabled": false,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false
        },
        {
          "text": "§aFeatures & Experiments",
          "subtext": "Toggle parts of leaf",
          "action": "/scriptevent leafgui:modules_config",
          "actions": [
            "/scriptevent leafgui:modules_config"
          ],
          "iconID": "Packs/Asteroid/change",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 4,
          "displayOverrides": [],
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "sellButtonScoreboard": "money",
          "buyButtonEnabled": false,
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "buyButtonItem": "",
          "nutUIAlt": false
        },
        {
          "text": "§dGUIs",
          "subtext": "Edit your GUIs",
          "action": "/scriptevent leafgui:ui_builder_main_page",
          "actions": [
            "/scriptevent leafgui:ui_builder_main_page"
          ],
          "iconID": "Packs/Asteroid/ui",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 2,
          "displayOverrides": [],
          "nutUIHeaderButton": false,
          "nutUIHalf": 1,
          "nutUINoSizeKey": true,
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "sellButtonScoreboard": "money",
          "buyButtonEnabled": false,
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "buyButtonItem": "",
          "nutUIAlt": false,
          "meta": ""
        },
        {
          "text": "§eGet Help",
          "subtext": "",
          "action": "/scriptevent leafgui:uihelp",
          "actions": [
            "/scriptevent leafgui:uihelp"
          ],
          "iconID": "leaf/image-853",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 8,
          "displayOverrides": [],
          "nutUIHeaderButton": false,
          "nutUIHalf": 2,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "sellButtonScoreboard": "money",
          "buyButtonEnabled": false,
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "buyButtonItem": "",
          "nutUIColorCondition": ""
        },
        {
          "text": "§cModeration §dHub",
          "subtext": "Reports, Bans & More!",
          "action": "/scriptevent leafgui:moderation_hub",
          "actions": [
            "/scriptevent leafgui:moderation_hub"
          ],
          "iconID": "leaf/image-1191",
          "iconOverrides": [],
          "requiredTag": "",
          "disabled": false,
          "id": 15
        },
        {
          "text": "§qSidebar Editor",
          "subtext": "Make Custom Sidebars Easily",
          "action": "scriptevent leafgui:sidebar_editor_root",
          "actions": [
            "scriptevent leafgui:sidebar_editor_root"
          ],
          "iconID": "leaf/image-521",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 7,
          "displayOverrides": [
            {
              "condition": "$cfg/RefreshedSidebar",
              "text": "§uSidebar §dV2",
              "subtext": "The new and improved sidebar editor!",
              "iconID": "leaf/image-521"
            }
          ],
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "sellButtonScoreboard": "money",
          "buyButtonEnabled": false,
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "buyButtonItem": "",
          "nutUIAlt": false,
          "nutUIColorCondition": "",
          "disabled": false
        },
        {
          "text": "§aEconomy §2Settings",
          "subtext": "Manage currencies and more",
          "action": "/scriptevent leaf:open nutui/economy",
          "actions": [
            "/scriptevent leafgui:currency_editor"
          ],
          "iconID": "leaf/image-481",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 14,
          "disabled": false
        },
        {
          "text": "§vEvents",
          "subtext": "Do things when things happen",
          "action": "/scriptevent leafgui:actions",
          "actions": [
            "/scriptevent leafgui:events_editor_root"
          ],
          "iconID": "Packs/Asteroid/slash",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 13,
          "disabled": false,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false
        },
        {
          "text": "§eBack to old design",
          "subtext": "Click to go back to old config UI design",
          "action": "/tag @s add old-config",
          "actions": [
            "/tag @s add old-config",
            "/scriptevent leafgui:config_menu_start_page"
          ],
          "iconID": "leaf/image-1135",
          "iconOverrides": [],
          "requiredTag": "!$cfg/DisableOldDesignButton",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "",
          "nutUIHeaderButton": true,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "id": 16
        },
        {
          "text": "§aSkills",
          "subtext": "Coming soon",
          "action": "/scriptevent leafgui:skills",
          "actions": [
            "/scriptevent leafgui:skills"
          ],
          "iconID": "leaf/image-0973",
          "iconOverrides": [],
          "requiredTag": "",
          "disabled": true,
          "id": 18,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false
        },
        {
          "text": "§eZones §6Config",
          "subtext": "Manage zones",
          "action": "/scriptevent leafgui:zones",
          "actions": [
            "/scriptevent leafgui:zones"
          ],
          "iconID": "leaf/image-1190",
          "iconOverrides": [],
          "requiredTag": "$cfg/Zones",
          "disabled": false,
          "id": 19,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false
        },
        {
          "text": "§bRoquefort",
          "subtext": "Roquefort!",
          "action": "/scriptevent leaf:open leaf/roquefort",
          "actions": [
            "/scriptevent leaf:open leaf/roquefort"
          ],
          "iconID": "leaf/roquefort-hd",
          "iconOverrides": [],
          "requiredTag": "asdasdasd",
          "id": 24,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "§eLand Claims",
          "subtext": "Configure land claims",
          "action": "/scriptevent leafgui:land_claims",
          "actions": [
            "/scriptevent leafgui:land_claims_config"
          ],
          "iconID": "leaf/image-0961",
          "iconOverrides": [],
          "requiredTag": "",
          "disabled": false,
          "id": 27,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "buyButtonEnabled": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false
        },
        {
          "text": "§bAutomated Messages",
          "subtext": "Send randomized automated messages",
          "action": "/scriptevent leafgui:automized_messages",
          "actions": [
            "/scriptevent leafgui:automized_messages"
          ],
          "iconID": "leaf/image-482",
          "iconOverrides": [],
          "requiredTag": "",
          "disabled": true,
          "id": 28,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "buyButtonEnabled": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false
        },
        {
          "text": "§fChat Modules",
          "subtext": "Manage chat modules",
          "action": "/scriptevent leafgui:chat_modules",
          "actions": [
            "/scriptevent leafgui:chat_modules"
          ],
          "iconID": "leaf/image-477",
          "iconOverrides": [],
          "requiredTag": "",
          "disabled": true,
          "id": 29,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "buyButtonEnabled": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false
        },
        {
          "text": "§cTrading Settings",
          "subtext": "Configure Trade UI",
          "action": "/scriptevent leafgui:trades",
          "actions": [
            "/scriptevent leafgui:trades"
          ],
          "iconID": "leaf/image-772",
          "iconOverrides": [],
          "requiredTag": "",
          "disabled": true,
          "id": 30,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "buyButtonEnabled": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false
        },
        {
          "text": "§cBackpack §6Settings",
          "subtext": "Configure backpack",
          "action": "/scriptevent leafgui:backpack_settings",
          "actions": [
            "/scriptevent leafgui:backpack_settings"
          ],
          "iconID": "leaf/image-517",
          "iconOverrides": [],
          "requiredTag": "",
          "disabled": true,
          "id": 31,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "buyButtonEnabled": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false
        },
        {
          "text": "§cPlots",
          "subtext": "Configure plots system",
          "action": "/scriptevent leafgui:plots",
          "actions": [
            "/scriptevent leafgui:plots"
          ],
          "iconID": "leaf/image-613",
          "iconOverrides": [],
          "requiredTag": "",
          "disabled": true,
          "id": 32,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "buyButtonEnabled": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false
        },
        {
          "text": "pfffffff",
          "subtext": "",
          "action": "/kill",
          "actions": [
            "/kill",
            "/summon tnt"
          ],
          "iconID": "leaf/image-085",
          "iconOverrides": [],
          "requiredTag": "ASDDDDD:3",
          "disabled": false,
          "id": 115003427,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "buyButtonEnabled": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false
        }
      ],
      "subuis": {},
      "scriptevent": "nutui/main",
      "lastID": 32,
      "theme": 15,
      "pinned": true,
      "paperdoll": true,
      "pin": null,
      "pinSetBy": null,
      "cancel": "",
      "folder": 1741898363581751
    },
    "internal": true,
    "internalID": 4
  },
  "internal": true,
  "internalID": 7
})
uiBuilder.addInternalUI({
  "name": "Config UI / Support & Info",
  "body": "",
  "layout": 4,
  "type": 0,
  "buttons": [
    {
      "text": "§cDev Settings",
      "subtext": "uwu kawaii settings please dont touch :trans:",
      "action": "/scriptevent leafgui:dev",
      "actions": [
        "/scriptevent leafgui:dev"
      ],
      "iconID": "^textures/azalea_icons/DevSettings",
      "iconOverrides": [],
      "requiredTag": "$cfg/DevMode",
      "id": 5,
      "displayOverrides": [],
      "nutUIHeaderButton": true,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "sellButtonScoreboard": "money",
      "buyButtonEnabled": false,
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "buyButtonItem": ""
    },
    {
      "text": " ",
      "subtext": null,
      "action": "",
      "actions": [
        ""
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "",
      "type": "group",
      "buttons": [
        {
          "text": "Main Settings",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/main",
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$thiseq/nutui/main",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 1,
          "actions": [
            "/scriptevent leaf:open nutui/main"
          ]
        },
        {
          "text": "Misc Settings",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/misc",
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$thiseq/nutui/misc",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 2,
          "actions": [
            "/scriptevent leaf:open nutui/misc"
          ]
        },
        {
          "text": "Info & Support",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/credits",
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$thiseq/nutui/credits",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 3,
          "actions": [
            "/scriptevent leaf:open nutui/credits"
          ]
        }
      ],
      "buttonRow": true,
      "id": 21
    },
    {
      "text": "CherryCloud",
      "subtext": "",
      "action": "/scriptevent leaf:open nutui/cc",
      "actions": [
        "/scriptevent leaf:open nutui/cc"
      ],
      "iconID": "^textures/azalea_icons/CherryCloud",
      "iconOverrides": [],
      "requiredTag": "$NETLIB_SETUP",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "$thiseq/nutui/cc",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "id": 22
    },
    {
      "text": "§aGuides",
      "subtext": "View guides on how to use leaf",
      "action": "/scriptevent leafgui:guides",
      "actions": [
        "/scriptevent leafgui:help_ui"
      ],
      "iconID": "leaf/image-0875",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 17,
      "disabled": false
    },
    {
      "text": "§6Changelogs",
      "subtext": "View changelogs for this update",
      "action": "/scriptevent leafgui:changelogs",
      "actions": [
        "/scriptevent leafgui:help_ui 292949402-icantfindaname"
      ],
      "iconID": "leaf/image-068",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 18,
      "disabled": false
    },
    {
      "text": "§bCredits",
      "subtext": "People who have helped with leaf",
      "action": "/scriptevent leafgui:credits",
      "actions": [
        "/scriptevent leafgui:credits"
      ],
      "iconID": "^textures/minidevs/TrashyKittyFem",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 19,
      "disabled": false
    },
    {
      "text": "§eBack to old design",
      "subtext": "Click to go back to old config UI design",
      "action": "/tag @s add old-config",
      "actions": [
        "/tag @s add old-config",
        "/scriptevent leafgui:config_menu_start_page"
      ],
      "iconID": "leaf/image-1135",
      "iconOverrides": [],
      "requiredTag": "!$cfg/DisableOldDesignButton",
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": true,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "id": 20
    }
  ],
  "subuis": {},
  "scriptevent": "nutui/credits",
  "lastID": 22,
  "theme": 25,
  "pinned": true,
  "pin": null,
  "pinSetBy": null,
  "paperdoll": false,
  "folder": 1741898363581751,
  "original": {
    "name": "Config UI / Support & Info",
    "body": "",
    "layout": 4,
    "type": 0,
    "buttons": [
      {
        "text": "§cDev Settings",
        "subtext": "uwu kawaii settings please dont touch :trans:",
        "action": "/scriptevent leafgui:dev",
        "actions": [
          "/scriptevent leafgui:dev"
        ],
        "iconID": "^textures/azalea_icons/DevSettings",
        "iconOverrides": [],
        "requiredTag": "$cfg/DevMode",
        "id": 5,
        "displayOverrides": [],
        "nutUIHeaderButton": true,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "sellButtonScoreboard": "money",
        "buyButtonEnabled": false,
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "buyButtonItem": ""
      },
      {
        "text": " ",
        "subtext": null,
        "action": "",
        "actions": [
          ""
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "type": "group",
        "buttons": [
          {
            "text": "Main Settings",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/main",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/main",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 1,
            "actions": [
              "/scriptevent leaf:open nutui/main"
            ]
          },
          {
            "text": "Misc Settings",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/misc",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/misc",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 2,
            "actions": [
              "/scriptevent leaf:open nutui/misc"
            ]
          },
          {
            "text": "Info & Support",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/credits",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/credits",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 3,
            "actions": [
              "/scriptevent leaf:open nutui/credits"
            ]
          }
        ],
        "buttonRow": true,
        "id": 21
      },
      {
        "text": "CherryCloud",
        "subtext": "",
        "action": "/scriptevent leaf:open nutui/cc",
        "actions": [
          "/scriptevent leaf:open nutui/cc"
        ],
        "iconID": "^textures/azalea_icons/CherryCloud",
        "iconOverrides": [],
        "requiredTag": "$NETLIB_SETUP",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "$thiseq/nutui/cc",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "id": 22
      },
      {
        "text": "§aGuides",
        "subtext": "View guides on how to use leaf",
        "action": "/scriptevent leafgui:guides",
        "actions": [
          "/scriptevent leafgui:help_ui"
        ],
        "iconID": "leaf/image-0875",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 17,
        "disabled": false
      },
      {
        "text": "§6Changelogs",
        "subtext": "View changelogs for this update",
        "action": "/scriptevent leafgui:changelogs",
        "actions": [
          "/scriptevent leafgui:help_ui 292949402-icantfindaname"
        ],
        "iconID": "leaf/image-068",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 18,
        "disabled": false
      },
      {
        "text": "§bCredits",
        "subtext": "People who have helped with leaf",
        "action": "/scriptevent leafgui:credits",
        "actions": [
          "/scriptevent leafgui:credits"
        ],
        "iconID": "^textures/minidevs/TrashyKittyFem",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 19,
        "disabled": false
      },
      {
        "text": "§eBack to old design",
        "subtext": "Click to go back to old config UI design",
        "action": "/tag @s add old-config",
        "actions": [
          "/tag @s add old-config",
          "/scriptevent leafgui:config_menu_start_page"
        ],
        "iconID": "leaf/image-1135",
        "iconOverrides": [],
        "requiredTag": "!$cfg/DisableOldDesignButton",
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": true,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "id": 20
      }
    ],
    "subuis": {},
    "scriptevent": "nutui/credits",
    "lastID": 22,
    "theme": 15,
    "pinned": true,
    "pin": null,
    "pinSetBy": null,
    "paperdoll": true,
    "folder": 1741898363581751
  },
  "internal": true,
  "internalID": 7
})
uiBuilder.addInternalUI({
  "name": "Features",
  "body": "",
  "layout": 4,
  "type": 0,
  "buttons": [
    {
      "text": "§l§cGo Back",
      "subtext": "Go back to main settings.",
      "action": "/scriptevent leaf:open nutui/main",
      "actions": [
        "/scriptevent leaf:open nutui/main"
      ],
      "iconID": "^textures/azalea_icons/2",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 0,
      "displayOverrides": [],
      "nutUIColorCondition": "",
      "nutUIHeaderButton": true,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false
    },
    {
      "text": "§bFeatures",
      "subtext": "Main features of leaf",
      "action": "/scriptevent leaf:open <this>",
      "actions": [
        "/scriptevent leaf:open nutui/features"
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 1,
      "displayOverrides": [],
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "disabled": false
    },
    {
      "text": "Chatranks",
      "subtext": "OFF",
      "action": "/scriptevent leaf:set_bool_property Chatranks false",
      "actions": [
        "/scriptevent leaf:set_bool_property Chatranks false",
        "/scriptevent leaf:open nutui/features"
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 2,
      "displayOverrides": [],
      "nutUIColorCondition": "!$cfg/Chatranks",
      "nutUIHeaderButton": false,
      "nutUIHalf": 1,
      "nutUINoSizeKey": true,
      "nutUIAlt": false,
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "sellButtonScoreboard": "money",
      "buyButtonEnabled": false,
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "buyButtonItem": ""
    },
    {
      "text": "Chatranks",
      "subtext": "ON",
      "action": "/scriptevent leaf:set_bool_property Chatranks true",
      "actions": [
        "/scriptevent leaf:set_bool_property Chatranks true",
        "/scriptevent leaf:open nutui/features"
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 3,
      "displayOverrides": [],
      "nutUIColorCondition": "$cfg/Chatranks",
      "nutUIHeaderButton": false,
      "nutUIHalf": 2,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false,
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "sellButtonScoreboard": "money",
      "buyButtonEnabled": false,
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "buyButtonItem": ""
    },
    {
      "text": "Clans",
      "subtext": "OFF",
      "action": "/scriptevent leaf:set_bool_property Clans false",
      "actions": [
        "/scriptevent leaf:set_bool_property Clans false",
        "/scriptevent leaf:open nutui/features"
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 4,
      "displayOverrides": [],
      "nutUIColorCondition": "!$cfg/Clans",
      "nutUIHeaderButton": false,
      "nutUIHalf": 1,
      "nutUINoSizeKey": true,
      "nutUIAlt": false,
      "disabled": false
    },
    {
      "text": "Clans",
      "subtext": "ON",
      "action": "/scriptevent leaf:set_bool_property Clans true",
      "actions": [
        "/scriptevent leaf:set_bool_property Clans true",
        "/scriptevent leaf:open nutui/features"
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 5,
      "displayOverrides": [],
      "nutUIColorCondition": "$cfg/Clans",
      "nutUIHeaderButton": false,
      "nutUIHalf": 2,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false
    },
    {
      "text": "Land Claims",
      "subtext": "OFF",
      "action": "/scriptevent leaf:set_bool_property LandClaims false",
      "actions": [
        "/scriptevent leaf:set_bool_property LandClaims false",
        "/scriptevent leaf:open nutui/features"
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 6,
      "displayOverrides": [],
      "nutUIColorCondition": "!$cfg/LandClaims",
      "nutUIHeaderButton": false,
      "nutUIHalf": 1,
      "nutUINoSizeKey": true,
      "nutUIAlt": false,
      "disabled": false
    },
    {
      "text": "Land Claims",
      "subtext": "ON",
      "action": "/scriptevent leaf:set_bool_property LandClaims true",
      "actions": [
        "/scriptevent leaf:set_bool_property LandClaims true",
        "/scriptevent leaf:open nutui/features"
      ],
      "iconID": "",
      "iconOverrides": [],
      "requiredTag": "",
      "id": 7,
      "displayOverrides": [],
      "nutUIColorCondition": "$cfg/LandClaims",
      "nutUIHeaderButton": false,
      "nutUIHalf": 2,
      "nutUINoSizeKey": false,
      "nutUIAlt": false,
      "disabled": false
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "Pwarps",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property Pwarps false",
          "actions": [
            "/scriptevent leaf:set_bool_property Pwarps false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/Pwarps",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Pwarps",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property Pwarps true",
          "actions": [
            "/scriptevent leaf:set_bool_property Pwarps true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$cfg/Pwarps",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 15
        }
      ],
      "buttonRow": true,
      "id": 13
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "Sidebar",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property Pwarps false",
          "actions": [
            "/scriptevent leaf:set_bool_property Sidebar false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/Sidebar",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Sidebar",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property Pwarps true",
          "actions": [
            "/scriptevent leaf:set_bool_property Sidebar true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "nutUIColorCondition": "$cfg/Sidebar",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "id": 15,
          "sellButtonEnabled": false,
          "buyButtonEnabled": false
        }
      ],
      "buttonRow": true,
      "id": 26
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "Shops",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property Shops false",
          "actions": [
            "/scriptevent leaf:set_bool_property Shops false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/Shops",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Shops",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property Shops true",
          "actions": [
            "/scriptevent leaf:set_bool_property Shops true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/Shops",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 36
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "PlayerShops",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property PlayerShops false",
          "actions": [
            "/scriptevent leaf:set_bool_property PlayerShops false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/PlayerShops",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "PlayerShops",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property PlayerShops true",
          "actions": [
            "/scriptevent leaf:set_bool_property PlayerShops true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/PlayerShops",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 46
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "AFK System",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property PlayerShops false",
          "actions": [
            "/scriptevent leaf:set_bool_property AFKSystem false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/AFKSystem",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "AFK System",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property PlayerShops true",
          "actions": [
            "/scriptevent leaf:set_bool_property AFKSystem true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/AFKSystem",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 56
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "Homes",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property AFKSystem false",
          "actions": [
            "/scriptevent leaf:set_bool_property Homes false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/Homes",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Homes",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property AFKSystem true",
          "actions": [
            "/scriptevent leaf:set_bool_property Homes true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/Homes",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 66
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "Auction House",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property Homes false",
          "actions": [
            "/scriptevent leaf:set_bool_property AuctionHouse false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/AuctionHouse",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Auction House",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property Homes true",
          "actions": [
            "/scriptevent leaf:set_bool_property AuctionHouse true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/AuctionHouse",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 76
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "Gifts",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property AuctionHouse false",
          "actions": [
            "/scriptevent leaf:set_bool_property Gifts false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/Gifts",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Gifts",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property AuctionHouse true",
          "actions": [
            "/scriptevent leaf:set_bool_property Gifts true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/Gifts",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 86
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "Zones",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property Gifts false",
          "actions": [
            "/scriptevent leaf:set_bool_property Zones false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/Zones",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Zones",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property Gifts true",
          "actions": [
            "/scriptevent leaf:set_bool_property Zones true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/Zones",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 96
    },
    {
      "text": "§aExperiments",
      "subtext": "Experimental features",
      "action": "/scriptevent leaf:open nutui/features",
      "actions": [
        "/scriptevent leaf:open nutui/features"
      ],
      "iconOverrides": [],
      "requiredTag": "",
      "id": 16,
      "disabled": false
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "Generators",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property Generators false",
          "actions": [
            "/scriptevent leaf:set_bool_property Generators false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/Generators",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Generators",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property PlayerShops true",
          "actions": [
            "/scriptevent leaf:set_bool_property Generators true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/Generators",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 106
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "Clans Admin",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property Generators false",
          "actions": [
            "/scriptevent leaf:set_bool_property ClansAdmin false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/ClansAdmin",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Clans Admin",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property Generators true",
          "actions": [
            "/scriptevent leaf:set_bool_property ClansAdmin true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/ClansAdmin",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 116
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "Refreshed Sidebar",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property ClansAdmin false",
          "actions": [
            "/scriptevent leaf:set_bool_property RefreshedSidebar false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/RefreshedSidebar",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Refreshed Sidebar",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property ClansAdmin true",
          "actions": [
            "/scriptevent leaf:set_bool_property RefreshedSidebar true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/RefreshedSidebar",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 126
    },
    {
      "text": "§bDeveloper",
      "subtext": "Developers only :3",
      "action": "/scriptevent leaf:open nutui/features",
      "actions": [
        "/scriptevent leaf:open nutui/features"
      ],
      "iconOverrides": [],
      "requiredTag": "",
      "id": 136,
      "disabled": false,
      "displayOverrides": [],
      "sellButtonEnabled": false,
      "sellButtonItem": "minecraft:coal",
      "sellButtonItemCount": 4,
      "sellButtonPrice": 20,
      "buyButtonEnabled": false,
      "buyButtonItem": "",
      "buyButtonPrice": 20,
      "buyButtonScoreboard": "money",
      "nutUIColorCondition": "",
      "nutUIHeaderButton": false,
      "nutUIHalf": 0,
      "nutUINoSizeKey": false,
      "nutUIAlt": false
    },
    {
      "type": "group",
      "buttons": [
        {
          "text": "DevMode",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property RefreshedSidebar false",
          "actions": [
            "/scriptevent leaf:set_bool_property DevMode false",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "!$cfg/DevMode",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "DevMode",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property RefreshedSidebar true",
          "actions": [
            "/scriptevent leaf:set_bool_property DevMode true",
            "/scriptevent leaf:open nutui/features"
          ],
          "requiredTag": "",
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "$cfg/DevMode",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        }
      ],
      "buttonRow": true,
      "id": 146
    }
  ],
  "subuis": {},
  "scriptevent": "nutui/features",
  "lastID": 16,
  "theme": 25,
  "pinned": true,
  "cancel": "",
  "simplify": false,
  "paperdoll": false,
  "pin": null,
  "pinSetBy": null,
  "folder": 1741898363581751,
  "original": {
    "name": "Features",
    "body": "",
    "layout": 4,
    "type": 0,
    "buttons": [
      {
        "text": "§l§cGo Back",
        "subtext": "Go back to main settings.",
        "action": "/scriptevent leaf:open nutui/main",
        "actions": [
          "/scriptevent leaf:open nutui/main"
        ],
        "iconID": "^textures/azalea_icons/2",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 0,
        "displayOverrides": [],
        "nutUIColorCondition": "",
        "nutUIHeaderButton": true,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "disabled": false
      },
      {
        "text": "§bFeatures",
        "subtext": "Main features of leaf",
        "action": "/scriptevent leaf:open <this>",
        "actions": [
          "/scriptevent leaf:open nutui/features"
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 1,
        "displayOverrides": [],
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "disabled": false
      },
      {
        "text": "Chatranks",
        "subtext": "OFF",
        "action": "/scriptevent leaf:set_bool_property Chatranks false",
        "actions": [
          "/scriptevent leaf:set_bool_property Chatranks false",
          "/scriptevent leaf:open nutui/features"
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 2,
        "displayOverrides": [],
        "nutUIColorCondition": "!$cfg/Chatranks",
        "nutUIHeaderButton": false,
        "nutUIHalf": 1,
        "nutUINoSizeKey": true,
        "nutUIAlt": false,
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "sellButtonScoreboard": "money",
        "buyButtonEnabled": false,
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "buyButtonItem": ""
      },
      {
        "text": "Chatranks",
        "subtext": "ON",
        "action": "/scriptevent leaf:set_bool_property Chatranks true",
        "actions": [
          "/scriptevent leaf:set_bool_property Chatranks true",
          "/scriptevent leaf:open nutui/features"
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 3,
        "displayOverrides": [],
        "nutUIColorCondition": "$cfg/Chatranks",
        "nutUIHeaderButton": false,
        "nutUIHalf": 2,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "disabled": false,
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "sellButtonScoreboard": "money",
        "buyButtonEnabled": false,
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "buyButtonItem": ""
      },
      {
        "text": "Clans",
        "subtext": "OFF",
        "action": "/scriptevent leaf:set_bool_property Clans false",
        "actions": [
          "/scriptevent leaf:set_bool_property Clans false",
          "/scriptevent leaf:open nutui/features"
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 4,
        "displayOverrides": [],
        "nutUIColorCondition": "!$cfg/Clans",
        "nutUIHeaderButton": false,
        "nutUIHalf": 1,
        "nutUINoSizeKey": true,
        "nutUIAlt": false,
        "disabled": false
      },
      {
        "text": "Clans",
        "subtext": "ON",
        "action": "/scriptevent leaf:set_bool_property Clans true",
        "actions": [
          "/scriptevent leaf:set_bool_property Clans true",
          "/scriptevent leaf:open nutui/features"
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 5,
        "displayOverrides": [],
        "nutUIColorCondition": "$cfg/Clans",
        "nutUIHeaderButton": false,
        "nutUIHalf": 2,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "disabled": false
      },
      {
        "text": "Land Claims",
        "subtext": "OFF",
        "action": "/scriptevent leaf:set_bool_property LandClaims false",
        "actions": [
          "/scriptevent leaf:set_bool_property LandClaims false",
          "/scriptevent leaf:open nutui/features"
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 6,
        "displayOverrides": [],
        "nutUIColorCondition": "!$cfg/LandClaims",
        "nutUIHeaderButton": false,
        "nutUIHalf": 1,
        "nutUINoSizeKey": true,
        "nutUIAlt": false,
        "disabled": false
      },
      {
        "text": "Land Claims",
        "subtext": "ON",
        "action": "/scriptevent leaf:set_bool_property LandClaims true",
        "actions": [
          "/scriptevent leaf:set_bool_property LandClaims true",
          "/scriptevent leaf:open nutui/features"
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 7,
        "displayOverrides": [],
        "nutUIColorCondition": "$cfg/LandClaims",
        "nutUIHeaderButton": false,
        "nutUIHalf": 2,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "disabled": false
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "Pwarps",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property Pwarps false",
            "actions": [
              "/scriptevent leaf:set_bool_property Pwarps false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/Pwarps",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Pwarps",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property Pwarps true",
            "actions": [
              "/scriptevent leaf:set_bool_property Pwarps true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$cfg/Pwarps",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 15
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "Sidebar",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property Pwarps false",
            "actions": [
              "/scriptevent leaf:set_bool_property Sidebar false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/Sidebar",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Sidebar",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property Pwarps true",
            "actions": [
              "/scriptevent leaf:set_bool_property Sidebar true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$cfg/Sidebar",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 15,
            "sellButtonEnabled": false,
            "buyButtonEnabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "Shops",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property Shops false",
            "actions": [
              "/scriptevent leaf:set_bool_property Shops false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/Shops",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Shops",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property Shops true",
            "actions": [
              "/scriptevent leaf:set_bool_property Shops true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/Shops",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "PlayerShops",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property PlayerShops false",
            "actions": [
              "/scriptevent leaf:set_bool_property PlayerShops false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/PlayerShops",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "PlayerShops",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property PlayerShops true",
            "actions": [
              "/scriptevent leaf:set_bool_property PlayerShops true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/PlayerShops",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "AFK System",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property PlayerShops false",
            "actions": [
              "/scriptevent leaf:set_bool_property AFKSystem false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/AFKSystem",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "AFK System",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property PlayerShops true",
            "actions": [
              "/scriptevent leaf:set_bool_property AFKSystem true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/AFKSystem",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "Homes",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property AFKSystem false",
            "actions": [
              "/scriptevent leaf:set_bool_property Homes false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/Homes",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Homes",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property AFKSystem true",
            "actions": [
              "/scriptevent leaf:set_bool_property Homes true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/Homes",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "Auction House",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property Homes false",
            "actions": [
              "/scriptevent leaf:set_bool_property AuctionHouse false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/AuctionHouse",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Auction House",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property Homes true",
            "actions": [
              "/scriptevent leaf:set_bool_property AuctionHouse true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/AuctionHouse",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "Gifts",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property AuctionHouse false",
            "actions": [
              "/scriptevent leaf:set_bool_property Gifts false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/Gifts",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Gifts",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property AuctionHouse true",
            "actions": [
              "/scriptevent leaf:set_bool_property Gifts true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/Gifts",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "Zones",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property Gifts false",
            "actions": [
              "/scriptevent leaf:set_bool_property Zones false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/Zones",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Zones",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property Gifts true",
            "actions": [
              "/scriptevent leaf:set_bool_property Zones true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/Zones",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "text": "§aExperiments",
        "subtext": "Experimental features",
        "action": "/scriptevent leaf:open nutui/features",
        "actions": [
          "/scriptevent leaf:open nutui/features"
        ],
        "iconOverrides": [],
        "requiredTag": "",
        "id": 16,
        "disabled": false
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "Generators",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property Generators false",
            "actions": [
              "/scriptevent leaf:set_bool_property Generators false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/Generators",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Generators",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property PlayerShops true",
            "actions": [
              "/scriptevent leaf:set_bool_property Generators true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/Generators",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "Clans Admin",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property Generators false",
            "actions": [
              "/scriptevent leaf:set_bool_property ClansAdmin false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/ClansAdmin",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Clans Admin",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property Generators true",
            "actions": [
              "/scriptevent leaf:set_bool_property ClansAdmin true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/ClansAdmin",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "Refreshed Sidebar",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property ClansAdmin false",
            "actions": [
              "/scriptevent leaf:set_bool_property RefreshedSidebar false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/RefreshedSidebar",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Refreshed Sidebar",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property ClansAdmin true",
            "actions": [
              "/scriptevent leaf:set_bool_property RefreshedSidebar true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/RefreshedSidebar",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      },
      {
        "text": "§bDeveloper",
        "subtext": "Developers only :3",
        "action": "/scriptevent leaf:open nutui/features",
        "actions": [
          "/scriptevent leaf:open nutui/features"
        ],
        "iconOverrides": [],
        "requiredTag": "",
        "id": 16,
        "disabled": false,
        "displayOverrides": [],
        "sellButtonEnabled": false,
        "sellButtonItem": "minecraft:coal",
        "sellButtonItemCount": 4,
        "sellButtonPrice": 20,
        "buyButtonEnabled": false,
        "buyButtonItem": "",
        "buyButtonPrice": 20,
        "buyButtonScoreboard": "money",
        "nutUIColorCondition": "",
        "nutUIHeaderButton": false,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false
      },
      {
        "type": "group",
        "buttons": [
          {
            "text": "DevMode",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property RefreshedSidebar false",
            "actions": [
              "/scriptevent leaf:set_bool_property DevMode false",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "!$cfg/DevMode",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "DevMode",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property RefreshedSidebar true",
            "actions": [
              "/scriptevent leaf:set_bool_property DevMode true",
              "/scriptevent leaf:open nutui/features"
            ],
            "requiredTag": "",
            "displayOverrides": [],
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "buyButtonEnabled": false,
            "buyButtonItem": "",
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "nutUIColorCondition": "$cfg/DevMode",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          }
        ],
        "buttonRow": true,
        "id": 13
      }
    ],
    "subuis": {},
    "scriptevent": "nutui/features",
    "lastID": 16,
    "theme": 0,
    "pinned": true,
    "cancel": "",
    "simplify": false,
    "paperdoll": false,
    "pin": null,
    "pinSetBy": null,
    "folder": 1741898363581751,
    "original": {
      "name": "Features",
      "body": "",
      "layout": 4,
      "type": 0,
      "buttons": [
        {
          "text": "§l§cGo Back",
          "subtext": "Go back to main settings.",
          "action": "/scriptevent leaf:open nutui/main",
          "actions": [
            "/scriptevent leaf:open nutui/main"
          ],
          "iconID": "^textures/azalea_icons/2",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 0,
          "displayOverrides": [],
          "nutUIColorCondition": "",
          "nutUIHeaderButton": true,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "§bFeatures",
          "subtext": "Main features of leaf",
          "action": "/scriptevent leaf:open <this>",
          "actions": [
            "/scriptevent leaf:open nutui/features"
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 1,
          "displayOverrides": [],
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "disabled": false
        },
        {
          "text": "Chatranks",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property Chatranks false",
          "actions": [
            "/scriptevent leaf:set_bool_property Chatranks false",
            "/scriptevent leaf:open nutui/features"
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 2,
          "displayOverrides": [],
          "nutUIColorCondition": "!$cfg/Chatranks",
          "nutUIHeaderButton": false,
          "nutUIHalf": 1,
          "nutUINoSizeKey": true,
          "nutUIAlt": false,
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "sellButtonScoreboard": "money",
          "buyButtonEnabled": false,
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "buyButtonItem": ""
        },
        {
          "text": "Chatranks",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property Chatranks true",
          "actions": [
            "/scriptevent leaf:set_bool_property Chatranks true",
            "/scriptevent leaf:open nutui/features"
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 3,
          "displayOverrides": [],
          "nutUIColorCondition": "$cfg/Chatranks",
          "nutUIHeaderButton": false,
          "nutUIHalf": 2,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false,
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "sellButtonScoreboard": "money",
          "buyButtonEnabled": false,
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "buyButtonItem": ""
        },
        {
          "text": "Clans",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property Clans false",
          "actions": [
            "/scriptevent leaf:set_bool_property Clans false",
            "/scriptevent leaf:open nutui/features"
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 4,
          "displayOverrides": [],
          "nutUIColorCondition": "!$cfg/Clans",
          "nutUIHeaderButton": false,
          "nutUIHalf": 1,
          "nutUINoSizeKey": true,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Clans",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property Clans true",
          "actions": [
            "/scriptevent leaf:set_bool_property Clans true",
            "/scriptevent leaf:open nutui/features"
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 5,
          "displayOverrides": [],
          "nutUIColorCondition": "$cfg/Clans",
          "nutUIHeaderButton": false,
          "nutUIHalf": 2,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Land Claims",
          "subtext": "OFF",
          "action": "/scriptevent leaf:set_bool_property LandClaims false",
          "actions": [
            "/scriptevent leaf:set_bool_property LandClaims false",
            "/scriptevent leaf:open nutui/features"
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 6,
          "displayOverrides": [],
          "nutUIColorCondition": "!$cfg/LandClaims",
          "nutUIHeaderButton": false,
          "nutUIHalf": 1,
          "nutUINoSizeKey": true,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "text": "Land Claims",
          "subtext": "ON",
          "action": "/scriptevent leaf:set_bool_property LandClaims true",
          "actions": [
            "/scriptevent leaf:set_bool_property LandClaims true",
            "/scriptevent leaf:open nutui/features"
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 7,
          "displayOverrides": [],
          "nutUIColorCondition": "$cfg/LandClaims",
          "nutUIHeaderButton": false,
          "nutUIHalf": 2,
          "nutUINoSizeKey": false,
          "nutUIAlt": false,
          "disabled": false
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "Pwarps",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property Pwarps false",
              "actions": [
                "/scriptevent leaf:set_bool_property Pwarps false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/Pwarps",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "Pwarps",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property Pwarps true",
              "actions": [
                "/scriptevent leaf:set_bool_property Pwarps true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "nutUIColorCondition": "$cfg/Pwarps",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false,
              "id": 15
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "Shops",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property Shops false",
              "actions": [
                "/scriptevent leaf:set_bool_property Shops false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/Shops",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "Shops",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property Shops true",
              "actions": [
                "/scriptevent leaf:set_bool_property Shops true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/Shops",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "PlayerShops",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property PlayerShops false",
              "actions": [
                "/scriptevent leaf:set_bool_property PlayerShops false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/PlayerShops",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "PlayerShops",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property PlayerShops true",
              "actions": [
                "/scriptevent leaf:set_bool_property PlayerShops true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/PlayerShops",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "AFK System",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property PlayerShops false",
              "actions": [
                "/scriptevent leaf:set_bool_property AFKSystem false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/AFKSystem",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "AFK System",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property PlayerShops true",
              "actions": [
                "/scriptevent leaf:set_bool_property AFKSystem true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/AFKSystem",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "Homes",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property AFKSystem false",
              "actions": [
                "/scriptevent leaf:set_bool_property Homes false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/Homes",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "Homes",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property AFKSystem true",
              "actions": [
                "/scriptevent leaf:set_bool_property Homes true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/Homes",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "Auction House",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property Homes false",
              "actions": [
                "/scriptevent leaf:set_bool_property AuctionHouse false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/AuctionHouse",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "Auction House",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property Homes true",
              "actions": [
                "/scriptevent leaf:set_bool_property AuctionHouse true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/AuctionHouse",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "Gifts",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property AuctionHouse false",
              "actions": [
                "/scriptevent leaf:set_bool_property Gifts false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/Gifts",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "Gifts",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property AuctionHouse true",
              "actions": [
                "/scriptevent leaf:set_bool_property Gifts true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/Gifts",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "Zones",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property Gifts false",
              "actions": [
                "/scriptevent leaf:set_bool_property Zones false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/Zones",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "Zones",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property Gifts true",
              "actions": [
                "/scriptevent leaf:set_bool_property Zones true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/Zones",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "text": "§aExperiments",
          "subtext": "Experimental features",
          "action": "/scriptevent leaf:open nutui/features",
          "actions": [
            "/scriptevent leaf:open nutui/features"
          ],
          "iconOverrides": [],
          "requiredTag": "",
          "id": 16,
          "disabled": false
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "Generators",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property Generators false",
              "actions": [
                "/scriptevent leaf:set_bool_property Generators false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/Generators",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "Generators",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property PlayerShops true",
              "actions": [
                "/scriptevent leaf:set_bool_property Generators true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/Generators",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "Clans Admin",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property Generators false",
              "actions": [
                "/scriptevent leaf:set_bool_property ClansAdmin false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/ClansAdmin",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "Clans Admin",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property Generators true",
              "actions": [
                "/scriptevent leaf:set_bool_property ClansAdmin true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/ClansAdmin",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "Refreshed Sidebar",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property ClansAdmin false",
              "actions": [
                "/scriptevent leaf:set_bool_property RefreshedSidebar false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/RefreshedSidebar",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "Refreshed Sidebar",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property ClansAdmin true",
              "actions": [
                "/scriptevent leaf:set_bool_property RefreshedSidebar true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/RefreshedSidebar",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        },
        {
          "text": "§bDeveloper",
          "subtext": "Developers only :3",
          "action": "/scriptevent leaf:open nutui/features",
          "actions": [
            "/scriptevent leaf:open nutui/features"
          ],
          "iconOverrides": [],
          "requiredTag": "",
          "id": 16,
          "disabled": false,
          "displayOverrides": [],
          "sellButtonEnabled": false,
          "sellButtonItem": "minecraft:coal",
          "sellButtonItemCount": 4,
          "sellButtonPrice": 20,
          "buyButtonEnabled": false,
          "buyButtonItem": "",
          "buyButtonPrice": 20,
          "buyButtonScoreboard": "money",
          "nutUIColorCondition": "",
          "nutUIHeaderButton": false,
          "nutUIHalf": 0,
          "nutUINoSizeKey": false,
          "nutUIAlt": false
        },
        {
          "type": "group",
          "buttons": [
            {
              "text": "DevMode",
              "subtext": "OFF",
              "action": "/scriptevent leaf:set_bool_property RefreshedSidebar false",
              "actions": [
                "/scriptevent leaf:set_bool_property DevMode false",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "!$cfg/DevMode",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            },
            {
              "text": "DevMode",
              "subtext": "ON",
              "action": "/scriptevent leaf:set_bool_property RefreshedSidebar true",
              "actions": [
                "/scriptevent leaf:set_bool_property DevMode true",
                "/scriptevent leaf:open nutui/features"
              ],
              "requiredTag": "",
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "$cfg/DevMode",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false
            }
          ],
          "buttonRow": true,
          "id": 13
        }
      ],
      "subuis": {},
      "scriptevent": "nutui/features",
      "lastID": 16,
      "theme": 0,
      "pinned": true,
      "cancel": "",
      "simplify": false,
      "paperdoll": false,
      "pin": null,
      "pinSetBy": null,
      "folder": 1741898363581751
    },
    "internal": true,
    "internalID": 6
  },
  "internal": true,
  "internalID": 7
})
let blockTests = [
    {
        name: "Property Test (SET)",
        use(block, player) {
            if(!(block instanceof Block)) return;
            let modal = new ModalForm();
            modal.textField("Set Value", "Val", block.permutation.getState('leaf:test') ?? undefined)
            modal.show(player, false, (player, response)=>{
                if(response.canceled) return;
                block.setPermutation(block.permutation.withState('leaf:test', response.formValues[0]))
                world.sendMessage("Set value!")
            })
        }
    },
    {
        name: "Property Test (GET)",
        use(block, player) {
            if(!(block instanceof Block)) return;
            world.sendMessage(`${block.permutation.getState('leaf:test')}`)
        }
    }
]
world.beforeEvents.playerInteractWithBlock.subscribe(e=>{
    if(!e.isFirstEvent) return;
    if(!e.itemStack || e.itemStack.typeId != "leaf:block_devtool") return;
    if(!e.player.hasTag("dev")) return e.player.error("You must have dev tag");
    if(!e.isFirstEvent) return;
    system.run(()=>{
        let form = new ActionForm();
        form.title("Block Dev Tool");
        for(const test of blockTests) {
            form.button(test.name, null, (player)=>{
                test.use(e.block, player)
            })
        }
        form.show(e.player, false, ()=>{})
    })
})
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
async function openTabUI(tabUI, entity, tabIndex = 0) {
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

            for (const button of await normalForm.getButtons(entity, ui.data)) {
                form.button(button.text, button.icon, button.action)
            }
        }
    }
    form.show(entity, false, () => { })
}
system.afterEvents.scriptEventReceive.subscribe(e => {
    if(e.id == "leaf:import_internal_uis") {
        for(const doc of uiBuilder.internalUIs) {
        uiBuilder.db.insertDocument(doc)
        }
    }
    if(e.id == "leaf:toast") {
        let args = betterArgs(e.message)
        args = args.map(_=>{
            if(_ != "\"\"") return _;
            return "";
        })
        // if(!(e.sourceEntity instanceof Player)) return;
        // let entity = e.sourceEntity.dimension.spawnEntity("minecraft:pig", e.sourceEntity.location)
        // entity.se
        e.sourceEntity.sendMessage(dynamicToast(args[0] ? args[0] : "", args[1] ? args[1] : "", args[2] ? args[2] : ''))
    }
    if (e.sourceEntity && e.sourceEntity.typeId == "minecraft:player") {
        if (e.id == "leaf:open_tabbed") {
            let tabUI = uiBuilder.tabbedDB.findFirst({ title: e.message });
            if (!tabUI) return;
            openTabUI(tabUI, e.sourceEntity)
        }
        if(e.id == "leaf:apply_impulse") {
          e.sourceEntity.applyImpulse({x: 1, y: 1, z: 1})
        }
        if(e.id == "leaf:transfer_server") {
          transferPlayer(e.sourceEntity, e.message.split(':')[0], parseInt(e.message.split(':')[1]))
        }
        if(e.id == "leaf:delay") {
            let amt = parseInt(e.message.split(' ')[0])
            let cmd = e.message.split(' ').slice(1).join(' ').trim();
            system.runTimeout(()=>{
                e.sourceEntity.runCommand(cmd.startsWith('/') ? cmd.substring(1) : cmd)
            }, amt)
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

commandManager.addCommand("ah", {aliases:["auctionhouse"]}, ({msg})=>{
  let player = msg.sender;
  let loc = {
    ...player.location
  }
  let ticks = 0;
  player.success("Close chat to open UI")
  let interval = system.runInterval(()=>{
    let loc2 = {
      ...player.location
    }
    ticks += 2;
    if(ticks >= 200) {
      player.error("Timed out")
      system.clearRun(interval)
    }
    if(loc.x != loc2.x || loc.y != loc2.y || loc.z != loc2.z) {
      uiManager.open(player, config.uiNames.AuctionHouse.Root)
      system.clearRun(interval)
    }
  },2)
})

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
commandManager.addCommand("floating-text",{description:"Testing for claims"},({msg,args})=>{
    if(!prismarineDb.permissions.hasPermission(msg.sender, "floatingtext.create")) return msg.sender.error("You are missing permissions to do this!")
   let entity = msg.sender.dimension.spawnEntity("leaf:floating_text", msg.sender.location)
   entity.nameTag = args.join(' ').replace(/\\n/g,"\n")
   msg.sender.success(`Spawned floating text!`)
})
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
commandManager.addCommand("Crates", { description: "Open Cratew UI", author: "Otf5shotzz/Trashykitty", category: "Players" }, ({ msg, args }) => {
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
          uiManager.open(msg.sender, config.uiNames.Crate.Root)
      }
  });
})
icons.install(rpgiabIconPack);
icons.install(leafIconPack);
icons.install(leafIconPack2, true);
icons.install(azaleaIconPack, false);
icons.install(blockIcons)
icons.install(itemIcons)
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
let testLogs = []

system.afterEvents.scriptEventReceive.subscribe(e => {
  if(e.id == "leaf:print_test_logs") {
    world.sendMessage(testLogs.join('\n'))

  }
    if(e.id == "leaf:speak_as" && e.sourceType == ScriptEventSource.Entity) {
        beforeChat({
            message: e.message,
            sender: e.sourceEntity,
            cancel: false
        })
    }
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
        // world.sendMessage(JSON.stringify(args))
        let args2 = args.length && args[0] ? args : [];
        uiManager.open(e.sourceEntity, e.id.substring(config.scripteventNames.openDefault.length), ...args2);
    }
})
// let recordsDb = prismarineDb.customStorage("Records", SegmentedStoragePrismarine);

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
    beforeChat(e)
})

// |\---/|
// | o_o |  "I protect this function from bugs!"
//  \_^_/
system.afterEvents.scriptEventReceive.subscribe(e=>{
    if(e.id == "leaf:wtag_add") {
        worldTags.addTag(e.message)
    }
    if(e.id == "leaf:meow") {
      let text = colors.getColorNamesColored();
      e.sourceEntity.sendMessage(text.join('\n§r'))
    }
    if(e.id == "leaf:wtag_remove") {
        worldTags.removeTag(e.message)
    }
    if(e.id == "leaf:wtag_list") {
        world.sendMessage(`§aList of world tags: §r${worldTags.getTags().join('§7, ')}`)
    }
})
world.afterEvents.itemUse.subscribe(e => {
    if (e.source.typeId == "minecraft:player" && e.itemStack.typeId == config.items.LeafConfig) {
        if(prismarineDb.permissions.hasPermission(e.source, "configui.open")) {
            uiManager.open(e.source, config.uiNames.ConfigRoot)
        } else {
            e.source.error("You dont have permissions to do this. Do /tag @s add admin")
        }
    }
    if (e.source.typeId == "minecraft:player" && e.itemStack.typeId == "leaf:shop") {
        uiManager.open(e.source, config.uiNames.Shop.Root)
    }
    if (e.source.typeId == "minecraft:player" && e.itemStack.typeId == "leaf:player_shop") {
        uiManager.open(e.source, config.uiNames.PlayerShops.Root)
    }
    if (e.source.typeId == "minecraft:player" && e.itemStack.typeId == "leaf:auction_house") {
      uiManager.open(e.source, config.uiNames.AuctionHouse.Root)
  }
})
world.afterEvents.playerSpawn.subscribe(async e => {
    if(!e.initialSpawn) return;
    await system.waitTicks(20);
    console.warn(`Handling rewards`)
    let playerID = await playerStorage.getIDAsync(e.player)
    console.warn(playerID)
    let rewards = playerStorage.getRewards(playerID);
    let displayText = {};
    let total = 0;
    console.warn(rewards ? JSON.stringify(rewards) : "No rewards")
    for (const reward of rewards) {
        if (prismarineDb.economy.getCurrency(reward.currency)) {
            let currency = prismarineDb.economy.getCurrency(reward.currency);
            if(reward.amount < 0) {
              console.warn(`Negative reward: ${Math.abs(reward.amount)}`)
              prismarineDb.economy.removeMoney(e.player, Math.abs(reward.amount), currency.scoreboard)
              continue;
            }
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
    system.runTimeout(async()=>{
        let playerID = await playerStorage.getIDAsync(e.player)
        let itemCount = auctionhouse.db.findDocuments({type:"REWARD", player: playerID}).length
        console.warn(itemCount)
        if(itemCount >= 1) {
            e.player.sendMessage(dynamicToast('', `§6§lAuction House\n§r§7You have ${itemCount} item${itemCount == 1 ? "" : "s"} to claim!`, `textures/azalea_icons/ChestIcons/Chest10`))
            e.player.playSound("random.levelup")
    
        }
    },60)
    playerStorage.clearRewards(playerID);
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
    ticks += 10;
    if (ticks > 2000000000) ticks = 0;
    if (ticks % (20 * 10) == 0) {
        for (const player of world.getPlayers()) playerStorage.saveData(player);
    }
}, 10);
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
  prismarineDb.economy.getTable().waitLoad().then(()=>{
    let defaultCurrency = prismarineDb.economy.getCurrency("default");
    if (defaultCurrency && defaultCurrency.symbol == "$") {
        prismarineDb.economy.editSymbol(defaultCurrency.scoreboard, emojis.coins2);
    }
  })
})

// scripting.registerScript('meow', `
// let ticks = 0;
// let seconds = 0;
// let tickHook = hook("tick", ()=>{
//   ticks++;
//   if(ticks % 20 == 0) {
//     seconds++;
//     mc.world.sendMessage("Hello, world!")
//   }
//   if(seconds > 5) {
//     mc.world.sendMessage("Unhooking tick")
//     unhook(tickHook)
//   }
// })
// hook("item-use:bread", (e)=>{
//   e.cancel = true;
//   e.source.error("Meow")
// }, "Testing")
// `)