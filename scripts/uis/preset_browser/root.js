import configAPI from "../../api/config/configAPI";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { themes } from "../uiBuilder/cherryThemes";
import { NUT_UI_OCEAN, NUT_UI_THEMED, NUT_UI_TAG, NUT_UI_HEADER_BUTTON, NUT_UI_PAPERDOLL } from "./nutUIConsts";

let presets = {
    nametagsPlus: {
        name: "§6Nametags+ Presets",
        subtext: "Customize your players nametags!",
        presets: [
            {
                type: "nametag",
                title: "Simple Name + Rank",
                by: "Trash9240",
                value: "<bc>[ §r§7<rank> §r<bc>] §r§7<name>"
            },
            {
                type: "nametag",
                title: "Simple Name + Rank + Clan",
                by: "Trash9240",
                value: "<bc>[ §r§7<rank> §r<bc>] §r§7<name>{{clan \"\\n:mini_sword: §r§7[@CLAN]\"}}"
            },
            {
                type: "nametag",
                title: "Rainbow Usernames :3",
                by: "Trash9240",
                value: "{{gay \"<name>\"}}"
            }
        ]
    }
}

uiManager.addUI(versionData.uiNames.PresetBrowser.Root, "", (player, currCategory = "root")=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[4][0]}§rPreset Browser`)
    // form.body("No presets are here yet. Go to the leaf essentials discord server and submit your UIs! (also if you want, you can send a minecraft skin from namemc and a name to have your own profile here)")
    form.button(`${NUT_UI_HEADER_BUTTON}§r§c§lGo Back\n§r§7Click this button to go back to main settings`, `textures/azalea_icons/2`, (player)=>{
        if(currCategory != "root") {
            return uiManager.open(player, versionData.uiNames.PresetBrowser.Root, "root")
        }
        uiManager.open(player, versionData.uiNames.ConfigMain)
    })

    if(currCategory == "root") {
        for(const preset in presets) {
            let presetData = presets[preset];
            form.button(`${presetData.name}\n§r§7${presetData.subtext}`, null, (player)=>{
                uiManager.open(player, versionData.uiNames.PresetBrowser.Root, preset)
            })
        }
    } else {
        if(presets[currCategory]) {
            for(const preset of presets[currCategory].presets) {
                form.button(`§e${preset.title}\n§7By ${preset.by}`, null, (player)=>{
                    if(preset.type == "nametag") {
                        uiManager.open(player, versionData.uiNames.Basic.Confirmation, "Are you sure you want to override the current nametag format?", ()=>{
                            configAPI.setProperty("NametagPlusFormat", preset.value);
                            uiManager.open(player, "nametags_plus_config")
                        }, ()=>{
                            uiManager.open(player, versionData.uiNames.PresetBrowser.Root, currCategory)    
                        })
                    }
                })
            }
        }
    }

    form.show(player, false, ()=>{})
})