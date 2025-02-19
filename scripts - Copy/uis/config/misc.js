import configAPI from "../../api/config/configAPI";
import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import icons from "../../api/icons";
uiManager.addUI(config.uiNames.Config.Misc, "Misc Config", (player)=>{
    let form = new ActionForm();
    form.button("§cBack\n§7Click to Go Back", `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, config.uiNames.ConfigRoot);
    });
    form.label("§7>>> §fChat Formats §e(Very Advanced)")
    form.button("§bChat Format\n§7Advanced", `textures/azalea_icons/Chat`, (player)=>{
        uiManager.open(player, config.uiNames.Config.ChatrankFormat);
    });
    form.button("§cReset Chat Format\n§7reset the chat format", `textures/azalea_icons/resetchatrankformat`, (player)=>{
        configAPI.setProperty("chatformat", config.defaults.chatformat);
        uiManager.open(player, config.uiNames.Config.ChatrankFormat);
    });
    form.label("§7>>> §fModeration")
    form.button("§aView reports\n§7View reports from players", `textures/azalea_icons/view reports`, (player)=>{
        uiManager.open(player, config.uiNames.Reports.Admin.Dashboard)
    });
    form.label("§7>>> §fOther Settings")
    form.button(`§l§6Gift Codes\n§r§7Make gift codes people can redeem`, `textures/azalea_icons/gift`, (player)=>{
        uiManager.open(player, config.uiNames.Gifts.Root)
    })
    form.button(`§l§nGenerator Settings\n§r§7Make high quality custom generators`, `textures/azalea_icons/Gen`, (player)=>{
        uiManager.open(player, config.uiNames.Generator.EditRoot)
    })
    form.button(`§l§dRewards\n§r§7Give players time based rewards`, `textures/azalea_icons/rewards`, (player)=>{
        uiManager.open(player, config.uiNames.DailyRewards.Root, "REWARDS")
    })
    form.label("§7>>> §fWhy?")
    form.button(`§l§aVERY misc toggles\n§r§7why are these here?`, `textures/items/bucket_lava`, (player)=>{
        uiManager.open(player, config.uiNames.SuperMisc)
    })
    form.show(player, false, (player, response)=>{})
})