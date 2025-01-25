import { ButtonState, InputButton, system, world } from "@minecraft/server";
import configAPI from "../../api/config/configAPI";
import emojis from "../../api/emojis";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import http from "../../networkingLibs/currentNetworkingLib";
import uiManager from "../../uiManager";

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
uiManager.addUI(config.uiNames.ConfigRoot, "Config Root", (player)=>{
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

    actionForm.title(`§t§e§s§t§r${emojis.book36} §6Config UI ${emojis.book36}`)
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
    if(configAPI.getProperty("DevMode")) {
        actionForm.button(`§l§eDeveloper Settings\n§r§7MAY CAUSE BUGS.`, icons.resolve(CONFIG_ICONS.DEVELOPER))
    }
    actionForm.button(`§l§nPlatform Settings\n§r§7[ Click to view info ]`, icons.resolve(CONFIG_ICONS.PLATFORM), player=>{
        uiManager.open(player, config.uiNames.PlatformSettings.Root)
    })
    actionForm.button(`§l§eCredits\n§r§7See who helped with leaf`, icons.resolve(CONFIG_ICONS.CREDITS), player=>{
        uiManager.open(player, config.uiNames.ConfigCredits)
    })
    if(http.player) {
        actionForm.button(`§l§9Discord Logs\n§r§7Online Exclusive`, icons.resolve(CONFIG_ICONS.DISCORD), (player)=>{
            
        })
    }
    actionForm.show(player, false, ()=>{})
})