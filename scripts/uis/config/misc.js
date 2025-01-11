import configAPI from "../../api/config/configAPI";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import icons from "../../api/icons";
uiManager.addUI(config.uiNames.Config.Misc, "Misc Config", (player)=>{
    let form = new ActionForm();
    form.button("§bChat Format\n§7Advanced", null, (player)=>{
        uiManager.open(player, config.uiNames.Config.ChatrankFormat);
    });
    form.button("§cReset Chat Format\n§7reset the chat format", `textures/blocks/barrier`, (player)=>{
        configAPI.setProperty("chatformat", config.defaults.chatformat);
        uiManager.open(player, config.uiNames.Config.ChatrankFormat);
    });
    form.button("§aView reports\n§7View reports from players", `textures/misc_icons/report`, (player)=>{
        uiManager.open(player, config.uiNames.Reports.Admin.Dashboard)
    });
    form.button(`§l§6Gift Codes\n§r§7Make gift codes people can redeem`, icons.resolve("leaf/image-630"), (player)=>{
        uiManager.open(player, config.uiNames.Gifts.Root)
    })
    form.button(`§l§nGenerator Settings\n§r§7Make high quality custom generators`, icons.resolve("leaf/image-045"), (player)=>{
        uiManager.open(player, config.uiNames.Generator.EditRoot)
    })
    form.button(`§l§dRewards\n§r§7Give players time based rewards`, icons.resolve("Packs/Asteroid/winPING"), (player)=>{
        uiManager.open(player, config.uiNames.DailyRewards.Root, "REWARDS")
    })
    form.button(`§l§aVERY misc toggles\n§r§7why are these here?`, `textures/items/bucket_lava`, (player)=>{
        uiManager.open(player, config.uiNames.SuperMisc)
    })
    form.show(player, false, (player, response)=>{})
})