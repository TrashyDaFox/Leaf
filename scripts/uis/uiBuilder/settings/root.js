import icons from "../../../api/icons";
import { ActionForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";
import { NUT_UI_HEADER_BUTTON, NUT_UI_TAG, NUT_UI_THEMED } from "../../preset_browser/nutUIConsts";
import { insertBackButton } from "../../sharedUtils/insertBackButton";
import { themes } from "../cherryThemes";

uiManager.addUI(versionData.uiNames.CustomizerSettings, "a", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[38][0]}§rCustomizer Settings`)
    insertBackButton(form, `scriptevent leafgui:ui_builder_main_page`)
    form.button(`§dRegistered Icon Packs\n§7View this servers icon packs`, `textures/azalea_icons/other/image`, (player)=>{
        let form2 = new ActionForm();
        form2.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[38][0]}§rIcon Packs`)
        insertBackButton(form2, `scriptevent leafgui:customizer_settings`)
        for(const iconPack of icons.iconPacks.entries()) {
            form2.button(`§a${iconPack[1].get("pack_name")}\n§7${iconPack[0]}`, iconPack[1].has("pack_icon") ? iconPack[1].get("pack_icon") : `textures/azalea_icons/other/missing`, (player)=>{
                uiManager.open(player, versionData.uiNames.CustomizerSettings)
            })
        }
        form2.show(player, false, (player, response)=>{

        })
    })
    form.show(player, false, (player, response)=>{

    })
})