import { Player } from "@minecraft/server";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import { themes } from "../uiBuilder/cherryThemes";
import { insertBackButton } from "../sharedUtils/insertBackButton";

uiManager.addUI(versionData.uiNames.FloatingText.Root, "", (player)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[25][0]}§rHolograms`)
    form.button(`§aAdd New Hologram\n§7[ Click to Add ]`, `textures/azalea_icons/other/add`, (player)=>{
        let modalForm = new ModalForm();
        modalForm.title(`Add a label`)
        modalForm.textField("Label", "Display name for your floating text in the editor", "")
        modalForm.show(player, false, (player, response)=>{
            let modalForm2 = new ModalForm();
            modalForm2.title("Code Editor")
            modalForm2.textField("Text", "Enter the text of the hologram here...", "")
            modalForm2.show(player, false, (player, response2)=>{
                let floatingText = player.dimension.spawnEntity("leaf:floating_text", player.location)
                floatingText.addTag("is_v2_hologram")
                floatingText.setDynamicProperty('label', response.formValues[0])
                floatingText.setDynamicProperty('id', Date.now())
                floatingText.nameTag = response2.formValues[0]
                uiManager.open(player, versionData.uiNames.FloatingText.Root)
            })
        })
    })
    if(!(player instanceof Player)) return;
    let entities = player.dimension.getEntities({
        "tags": ["is_v2_hologram"]
    })
    for(const entity of entities) {
        if(!entity.getDynamicProperty('label')) continue;
        form.button(`§b${entity.getDynamicProperty('label')}\n§7[ Click to Edit ]`, null, (player)=>{
            let form2 = new ActionForm();
            form2.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[25][0]}§r§f${entity.getDynamicProperty('label')}`)
            insertBackButton(form2, "/scriptevent leafgui:floating_text_root", true)
            form2.button(`§cSet Label\n§7Edit the label`, null, (player)=>{
                let modalForm = new ModalForm();
                modalForm.title(`Edit Label`)
                modalForm.textField("New Label", "Yes uwu", entity.getDynamicProperty('label'))
                modalForm.show(player, false, (player, response)=>{
                    if(response.canceled) return uiManager.open(player, versionData.uiNames.FloatingText.Root)
                        entity.setDynamicProperty('label', response.formValues[0])
                    uiManager.open(player, versionData.uiNames.FloatingText.Root)
                })
            })
            form2.button(`§dSet Text\n§7Edit the text`, null, (player)=>{
                let modalForm = new ModalForm();
                modalForm.title(`Code Editor`)
                modalForm.textField("New Label", "New text for shitt", entity.nameTag)
                modalForm.show(player, false, (player, response)=>{
                    if(response.canceled) return uiManager.open(player, versionData.uiNames.FloatingText.Root)
                    entity.nameTag = response.formValues[0]
                    uiManager.open(player, versionData.uiNames.FloatingText.Root)
                })
            })
            form2.button(`§eTeleport to me\n§7Teleport this hologram to you`, null, (player)=>{
                entity.teleport(player.location)
                uiManager.open(player, versionData.uiNames.FloatingText.Root)
            })
            form2.button(`§nDelete\n§7Delete this hologram`, null, (player)=>{
                entity.remove()
                uiManager.open(player, versionData.uiNames.FloatingText.Root)
            })
            form2.show(player, false, (player, response)=>{})
        })
    }
    form.show(player, false, (player, response)=>{

    })
})