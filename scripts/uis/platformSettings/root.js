import configAPI from "../../api/config/configAPI";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import { world } from "@minecraft/server";

uiManager.addUI(config.uiNames.PlatformSettings.Root, "Platform Settings", (player)=>{
    let form = new ActionForm();
    form.title("Platform Settings §9[ BETA ]")
    form.body("Here you can edit the behavior of players on different platforms.")
    form.button("§bDesktop\n§7[ Click to view ]", "textures/misc_icons/platform_icons/keybord", (player)=>{
        uiManager.open(player, config.uiNames.PlatformSettings.Desktop)
    })
    form.button("§eMobile\n§7[ Click to view ]", "textures/misc_icons/platform_icons/phon", (player)=>{
        uiManager.open(player, config.uiNames.PlatformSettings.Mobile)
    })
    form.button("§dConsole\n§7[ Click to view ]", "textures/misc_icons/platform_icons/controller", (player)=>{
        uiManager.open(player, config.uiNames.PlatformSettings.Console)
    })
    form.show(player, false, (player, response)=>{

    })
})

let platforms = ["Desktop", "Mobile", "Console"]

configAPI.registerProperty("desktop_tag", configAPI.Types.String, "platform_desktop")
configAPI.registerProperty("desktop_ban", configAPI.Types.Boolean, false)
configAPI.registerProperty("mobile_tag", configAPI.Types.String, "platform_mobile")
configAPI.registerProperty("mobile_ban", configAPI.Types.Boolean, false)
configAPI.registerProperty("console_tag", configAPI.Types.String, "platform_console")
configAPI.registerProperty("console_ban", configAPI.Types.Boolean, false)

uiManager.addUI(config.uiNames.PlatformSettings.EditPlatform, "a", (player, platform)=>{
    if(!platforms.includes(platform)) return;
    let form = new ModalForm();
    form.title(`${platform} Settings`);
    form.textField("§dPlatform Tag", "Type a tag for the platform", configAPI.getProperty(`${platform.toLowerCase()}_tag`))
    form.toggle("§cPlatform Ban", configAPI.getProperty(`${platform.toLowerCase()}_ban`))
    form.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, config.uiNames.PlatformSettings.Root);
        if(response.formValues[0]) configAPI.setProperty(`${platform.toLowerCase()}_tag`, response.formValues[0])
        configAPI.setProperty(`${platform.toLowerCase()}_ban`, response.formValues[1])
        uiManager.open(player, config.uiNames.PlatformSettings.Root);
    })
})
world.afterEvents.playerSpawn.subscribe(e=>{
    let platform = e.player.clientSystemInfo.platformType;
    if(
        configAPI.getProperty(`${platform.toLowerCase()}_ban`) &&
        !prismarineDb.permissions.hasPermission(e.player, "bypass_device_bans") &&
        !prismarineDb.permissions.hasPermission(e.player, `bypass_${platform.toLowerCase()}_bans`)) {
        return e.player.dimension.runCommand(`kick "${e.player.name}" banned device`)
    }
    try {
        let tags = [configAPI.getProperty("desktop_tag"),configAPI.getProperty("console_tag"),configAPI.getProperty("mobile_tag")]

        for(const tag of tags) {
            try {
                e.player.removeTag(tag)
            } catch {}
        }
        e.player.addTag(configAPI.getProperty(`${platform.toLowerCase()}_tag`))
    } catch {}
})
uiManager.addUI(config.uiNames.PlatformSettings.Desktop, "a", (player)=>{
    uiManager.open(player, config.uiNames.PlatformSettings.EditPlatform, "Desktop")
})
uiManager.addUI(config.uiNames.PlatformSettings.Console, "a", (player)=>{
    uiManager.open(player, config.uiNames.PlatformSettings.EditPlatform, "Console")
})
uiManager.addUI(config.uiNames.PlatformSettings.Mobile, "a", (player)=>{
    uiManager.open(player, config.uiNames.PlatformSettings.EditPlatform, "Mobile")
})