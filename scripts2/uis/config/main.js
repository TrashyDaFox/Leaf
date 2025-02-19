import icons from "../../api/icons";
import config from "../../versionData";
import { prismarineDb } from "../../lib/prismarinedb";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { world } from "@minecraft/server";

const MENU_ICONS = {
    help: `textures/azalea_icons/getHELP`,
    guiMaker: `textures/azalea_icons/GUIMaker/FormsV2`,
    chestMaker: `textures/azalea_icons/ChestLarge`,
    sidebarEditor: `textures/update_pings_icons/main-settings/SidebarEDITOR`,
    customCommands: `textures/azalea_icons/CustomCommandMAKER`,
    rtp: `textures/update_pings_icons/main-settings/RngTP`,
    clans: `textures/update_pings_icons/main-settings/clans`,
    events: `textures/update_pings_icons/main-settings/eventsICON`,
    currency: `textures/update_pings_icons/main-settings/Money settings`,
    misc: `textures/update_pings_icons/main-settings/extraTools`
};

uiManager.addUI(config.uiNames.ConfigMain, "Config Main", (player)=>{
    return player.runCommand("scriptevent leaf:open nutui/main")
    let form = new ActionForm();
    form.title("§r§nMain Settings")
    form.button("§cBack\n§7Click to Go Back", `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, config.uiNames.ConfigRoot);
    });
    form.label("§7---- §eSupport §7----")
    form.button(`§l§aGet Help\n§r§7Full documentation for leaf`, MENU_ICONS.help, (player)=>{
        uiManager.open(player, config.uiNames.Help)
    })
    form.label("§7---- §dMain stuff §7----")
    form.button(`§l§cGUI Maker\n§r§7Make GUIs`, MENU_ICONS.guiMaker, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot)
    })
    // form.button(`§l§eChest Maker\n§r§7Make GUIs`, MENU_ICONS.chestMaker, (player)=>{
    //     uiManager.open(player, config.uiNames.ChestGuiRoot)
    // })
    form.button(`§l§qSidebar Editor\n§r§7Make Custom Sidebars Easily`, MENU_ICONS.sidebarEditor, (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorRoot)
    })
    form.button(`§l§5Custom Commands\n§r§7Make commands like !command`, MENU_ICONS.customCommands, (player)=>{
        uiManager.open(player, config.uiNames.CustomCommands.root)
    })

    // form.button(`§l§bWeekly Rewards\n§r§7Give players weekly rewards`, icons.resolve("Packs/Asteroid/winPING"), (player)=>{
    //     uiManager.open(player, config.uiNames.DailyRewards.Root, "REWARDS_WEEKLY")
    // })
    // form.button(`§l§bMonthly Rewards\n§r§7Give players monthly rewards`, icons.resolve("Packs/Asteroid/winPING"), (player)=>{
    //     uiManager.open(player, config.uiNames.DailyRewards.Root, "REWARDS_MONTHLY")
    // })
    form.label("§7---- §dMiscellaneous §7----")
    form.button(`§l§bLeaderboards\n§r§7Configure Leaderboards`, icons.resolve("^textures/azalea_icons/13"), (player)=>{
        uiManager.open(player, config.uiNames.Leaderboards.Root)
    })

    form.button(`§l§dRTP\n§r§7Configure RTP`, MENU_ICONS.rtp, (player)=>{
        uiManager.open(player, config.uiNames.Config.RTP)
    })



    // form.button(`§l§6Bounty Settings\n§r§7Configure Bounties`, icons.resolve("leaf/image-0909"), (player)=>{

    // })
    // form.button(`§l§bCrate Settings\n§r§7Crate and mange crates`, icons.resolve("leaf/image-630"), (player)=>{

    // })
    form.button(`§l§cClans\n§r§7Configure clans`, MENU_ICONS.clans, (player)=>{
        uiManager.open(player, config.uiNames.Config.Clans)
    })



    // form.button(`§l§9Permissions\n§r§7Manage player permissions`, `textures/update_pings_icons/main-settings/perms`, (player)=>{

    // })


    // form.button(`§l§3PVP Settings\n§r§7Configure pvp settings`, `textures/update_pings_icons/main-settings/PVP`, (player)=>{

    // })
    // form.button(`§l§cAnti Cheat\n§r§7Configure ant cheat`, icons.resolve("Packs/Asteroid/smithing_icon"), (player)=>{

    // })







    // form.button(`§l§fPlayer Settings\n§r§7Configure player settings`, `textures/update_pings_icons/main-settings/player settings`, (player)=>{

    // })
    // form.button(`§l§gChat Settings\n§r§7Configure chat`, `textures/update_pings_icons/main-settings/Chat settings`, (player)=>{

    // })
    





    

    // form.button(`§l§dVerification Settings\n§r§7Stop annoying kids from joining`, icons.resolve("Packs/Asteroid/adventure_crystal_epic"), (player)=>{

    // })
    // form.button(`§l§aWarp Settings\n§r§7Warp`, `textures/update_pings_icons/main-settings/warp settings`, (player)=>{

    // })
    // form.button(`§l§nBank Settings\n§r§7Banky wanky`, `textures/update_pings_icons/main-settings/bank`, (player)=>{

    // })
    // form.button(`§l§qAuction House\n§r§7Manage auction house`, `textures/update_pings_icons/main-settings/Ah`, (player)=>{

    // })
    // form.button(`§l§6Crates\n§r§7Configure crates`, `textures/update_pings_icons/main-settings/crates`, (player)=>{
    //     uiManager.open(player, config.uiNames.Crates.Root)
    // })
    form.button(`§l§eEvents\n§r§7Events`, MENU_ICONS.events, (player)=>{
        uiManager.open(player, config.uiNames.Events.EventsRoot)
    })
    form.button(`§l§aCurrency Settings\n§r§7Manage currencies`, MENU_ICONS.currency, (player)=>{
        uiManager.open(player, config.uiNames.CurrencyEditor)
    })
    // form.button(`§l§pMiscellaneous Tools\n§r§7Extra utilities`, MENU_ICONS.misc, (player)=>{
    //     uiManager.open(player, config.uiNames.CurrencyEditor)
    // })
    form.label("§7-------------------------------")
    form.header("  §l§cDANGER ZONE")
    form.label("§r§eONLY USE THESE IF YOU REALLY NEED TO")
    form.button(`§cDelete All Config\n§7DANGER`, `textures/azalea_icons/Delete`, (player)=>{
        uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to do this?", ()=>{
            uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you ABSOLUTELY sure? This cant be undone!", ()=>{
                for(const id of world.getDynamicPropertyIds()) {
                    world.setDynamicProperty(id)
                }
                prismarineDb.sendToAllTables("CLEAR")
                prismarineDb.sendToAllTables("RELOAD")
                player.success("Deleted ALL config")

            }, ()=>{
                uiManager.open(player, config.uiNames.ConfigMain)
            })
        }, ()=>{
            uiManager.open(player, config.uiNames.ConfigMain)
        })
    })

    form.show(player, false, ()=>{})
})