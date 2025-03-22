import zones from "../../api/zones";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_HEADER_BUTTON, NUT_UI_TAG } from "../preset_browser/nutUIConsts";

uiManager.addUI(versionData.uiNames.Zones.Root, "Zones Root", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rZones`)
    form.button(`${NUT_UI_HEADER_BUTTON}§r§cBack`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, versionData.uiNames.ConfigMain)
    })
    form.button(`§aAdd Zone\n§7Create a zone`, `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, versionData.uiNames.Zones.Add)
    })
    for(const zone of zones.getZones()) {
        form.button(`§v${zone.data.name}\n§7Priority: ${zone.data.priority}`, null, (player)=>{
            uiManager.open(player, versionData.uiNames.Zones.Edit, zone.id)
        })
    }
    form.show(player, false, ()=>{

    })
})