import { ButtonState, InputButton, system, world } from "@minecraft/server";
import configAPI from "../../api/config/configAPI";
import emojis from "../../api/emojis";
import icons from "../../api/icons";
import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import http from "../../networkingLibs/currentNetworkingLib";
import uiManager from "../../uiManager";
import uiBuilder from "../../api/uiBuilder";

const CONFIG_ICONS = {
    LEAF_SETTINGS: "Packs/Asteroid/jungle_leaves",
    UI_BUILDER: "Packs/Asteroid/ui",
    CHEST_GUIS: "Packs/Asteroid/chest_tappable",
    SIDEBAR: "Packs/Asteroid/beacon",
    CURRENCY: "Packs/Asteroid/adventure_crystal_uncommon",
    MAIN_SETTINGS: "^textures/azalea_icons/MainSettings",
    ADVANCED: "leaf/image-515",
    MISC_SETTINGS: "^textures/update_pings_icons/config-ui/misc",
    FEATURES: `^textures/update_pings_icons/config-ui/Features`,
    MODERATION: "leaf/image-613",
    DEVELOPER: "^textures/azalea_icons/DevSettings",
    PLATFORM: "^textures/update_pings_icons/config-ui/devices",
    CREDITS: "^textures/update_pings_icons/config-ui/credits",
    DISCORD: "leaf/image-0910"
};

export let targetLeafDBVersion = 11.0
// system.runInterval(()=>{
//     for(const player of world.getPlayers()) {
//         if(player.inputInfo.getButtonState(InputButton.Jump) == ButtonState.Pressed) {
//             world.sendMessage(`${player.name} is pressing jump`);
//         }
//     }
// },1);
uiBuilder.internalUIs.push({
      "name": "Config UI / Main ",
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
          "text": "Main Settings",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui",
          "actions": [
            "/scriptevent leaf:open nutui/main"
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 0,
          "displayOverrides": [],
          "nutUIHeaderButton": false,
          "nutUIHalf": 3,
          "nutUINoSizeKey": true,
          "nutUIAlt": true,
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
          "text": "Misc Settings",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/misc",
          "actions": [
            "/scriptevent leaf:open nutui/misc"
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 1,
          "displayOverrides": [],
          "nutUIHeaderButton": false,
          "nutUIHalf": 4,
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
          "text": "Info & Support",
          "subtext": "",
          "action": "/scriptevent leaf:open nutui/credits",
          "actions": [
            "/scriptevent leaf:open nutui/credits"
          ],
          "iconID": "",
          "iconOverrides": [],
          "requiredTag": "",
          "id": 3,
          "displayOverrides": [],
          "nutUIHeaderButton": false,
          "nutUIHalf": 5,
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
          "action": "/scriptevent leaf:open <this>",
          "actions": [
            "/scriptevent leaf:open <this>"
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
          "buyButtonItem": ""
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
        }
      ],
      "subuis": {},
      "scriptevent": "nutui/main",
      "lastID": 10
})
uiManager.addUI(config.uiNames.ConfigRoot, "Config Root", (player)=>{
    return player.runCommand("scriptevent leaf:open nutui/main")
    let actionForm = new ActionForm();
    let body = [];
    if(prismarineDb.version > targetLeafDBVersion || prismarineDb.version < targetLeafDBVersion)
        body.push(prismarineDb.version > targetLeafDBVersion ? `I see u are time travelling :3` : prismarineDb.version < targetLeafDBVersion ? `You are 100%% going to break something in here bro` : `idk`)
    if(http.player) {
        body.push(`§bExternal Network is setup properly. You can now get more features from Leaf Essentials`);
    }
    if(body && body.length) {
        actionForm.body(body.join('\n§r'))
    }

    actionForm.title(`§r${emojis.book36} §6Config UI ${emojis.book36}`)
    // actionForm.button(`§2Leaf Settings\n§r§7Common settings`, icons.resolve(CONFIG_ICONS.LEAF_SETTINGS), (player)=>{
    //     player.sendMessage(`§cThis feature is coming soon`);
    //     uiManager.open(player, config.uiNames.ConfigRoot)
    // })
    // actionForm.button(`§cUI Builder\n§r§7Make UIs easily!`, icons.resolve(CONFIG_ICONS.UI_BUILDER), (player)=>{
    //     uiManager.open(player, config.uiNames.UIBuilderRoot)
    // })
    // actionForm.button(`§6Chest GUIs\n§r§7Make Chest UIs easily!`, icons.resolve(CONFIG_ICONS.CHEST_GUIS), (player)=>{
    //     uiManager.open(player, config.uiNames.ChestGuiRoot)
    // })
    // actionForm.button(`§bSidebar\n§r§7Make sidebars easily!`, icons.resolve(CONFIG_ICONS.SIDEBAR), (player)=>{
    //     uiManager.open(player, config.uiNames.SidebarEditorRoot)
    // })
    // actionForm.button(`§nCurrency Editor\n§r§7idfk`, icons.resolve(CONFIG_ICONS.CURRENCY), (player)=>{
    //     uiManager.open(player, config.uiNames.CurrencyEditor)
    // })
    // actionForm.header("§e§lWARNING")
    // actionForm.label("This is a development version of leaf, and made for a major Minecraft scripting api update. Please report any and all bugs.")
    // actionForm.label("NOTE: If you are going to use this on a real server, §cPLEASE §fmake a backup. This version has erased all config on my testing world before.")
    // actionForm.button(`§l§aLeaf Essentials\n§r§7Version 3.0`, `textures/azalea_icons/Azalea`, (player)=>{
        // uiManager.open(player, config.uiNames.ConfigRoot)
    // })
    // actionForm.label("§7-------------------------------")

    actionForm.button(`§l§nMain Settings\n§r§7Configure most features here`, icons.resolve(CONFIG_ICONS.MAIN_SETTINGS), (player)=>{
        uiManager.open(player, config.uiNames.ConfigMain)
    })
    // actionForm.button(`§l§dAdvanced Settings\n§r§7Very advanced fr fr`, icons.resolve(CONFIG_ICONS.ADVANCED), (player)=>{
    //     uiManager.open(player, config.uiNames.ConfigMain)
    // })
    actionForm.button(`§l§bMisc Settings\n§r§7Chat rank formats & more!`, icons.resolve(CONFIG_ICONS.MISC_SETTINGS), (player)=>{
        uiManager.open(player, config.uiNames.Config.Misc)
    })
    actionForm.button(`§l§aFeatures/Experiments\n§r§7Manage leaf features`, icons.resolve(CONFIG_ICONS.FEATURES), (player)=>{
        uiManager.open(player, config.uiNames.Config.Modules);
    })
    // actionForm.button(`§l§dModeration Settings\n§r§7Change moderation settings`, icons.resolve(CONFIG_ICONS.MODERATION))
    actionForm.button(`§l§nPlatform Settings\n§r§7[ Click to view info ]`, icons.resolve(CONFIG_ICONS.PLATFORM), player=>{
        uiManager.open(player, config.uiNames.PlatformSettings.Root)
    })
    // actionForm.label("§7-------------------------------")
    actionForm.divider()
    actionForm.button(`§l§eCredits\n§r§7See who helped with leaf`, icons.resolve(CONFIG_ICONS.CREDITS), player=>{
        uiManager.open(player, config.uiNames.ConfigCredits)
    })
    if(configAPI.getProperty("DevMode")) {
        // actionForm.label("§7-------------------------------")
        actionForm.label("§v------- Developer Settings -------")
        actionForm.button(`§l§eDeveloper Settings\n§r§7MAY CAUSE BUGS.`, icons.resolve(CONFIG_ICONS.DEVELOPER))
    }

    if(http.player) {
        actionForm.label("§7-------------------------------")
        actionForm.button(`§l§9Discord Logs\n§r§7Online Exclusive`, icons.resolve(CONFIG_ICONS.DISCORD), (player)=>{
            
        })
    }
    actionForm.show(player, false, ()=>{})
})