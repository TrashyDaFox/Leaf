import { world } from "@minecraft/server";
import uiBuilder from "../../api/uiBuilder";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import emojis from "../../api/emojis";
import moment from '../../lib/moment'
import { NUT_UI_HEADER_BUTTON, NUT_UI_TAG } from "../preset_browser/nutUIConsts";
function getIcon(ui) {
    return ui.id == 1719775088275 ? `textures/azalea_icons/icontextures/uwu`
        : ui.data.icon ? icons.resolve(ui.data.icon)
        : ui.data.layout == 4 ? `textures/azalea_icons/DevSettingsClickyClick`
        : ui.data.type == 4 ? `textures/azalea_icons/ChestIcons/Chest${ui.data.rows ? ui.data.rows : 3}`
        : `textures/azalea_icons/ClickyClick`
}
function getBtnText(ui) {
    return `${ui.data.layout == 4 ? "§c§h§e§1§r§c" : "§e"}${ui.data.type == 4 ? ui.data.title : ui.data.name}${ui.data.pinned ? ` \uE174` : ''}\n§r§7${emojis.clock} Expires ${moment(ui.expirationDate).fromNow()}`
}

uiManager.addUI(versionData.uiNames.UIBuilderTrash, "", (player)=>{
    let docs = uiBuilder.db.getTrashedDocuments()
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rUI Trash`)
    form.button(`${NUT_UI_HEADER_BUTTON}§r§cBack\n§7Click to go back`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, versionData.uiNames.UIBuilderRoot)
    })
    for(const doc of docs) {
        form.button(getBtnText(doc), getIcon(doc), (player)=>{
            let newForm = new ActionForm();
            newForm.title(`${NUT_UI_TAG}§rTrash Options`)
            newForm.button(`${NUT_UI_HEADER_BUTTON}§cBack\n§7Click to go back`, `textures/azalea_icons/2`, (player)=>{
                uiManager.open(player, versionData.uiNames.UIBuilderTrash)
            })
            newForm.button(`§aRecover\n§7Recover this UI`, null, (player)=>{
                uiBuilder.db.untrashDocumentByID(doc.id)
                uiManager.open(player, versionData.uiNames.UIBuilderTrash)
            })
            newForm.button(`§cPermanently Delete\n§7Permanently delete this UI`, null, (player)=>{
                uiManager.open(player, versionData.uiNames.Basic.Confirmation, "Are you sure you want to permanently delete this UI?", ()=>{
                    uiBuilder.db.deleteTrashedDocumentByID(doc.id)
                    uiManager.open(player, versionData.uiNames.UIBuilderTrash)
    
                }, ()=>{
                    uiManager.open(player, versionData.uiNames.UIBuilderTrash)

                })
            })
            newForm.show(player, false, ()=>{})
        })
    }
    if(!docs.length) {
        form.body(`There are no trashed UIs!`)
        form.button(`§cBack\n§7Click to go back`, `textures/azalea_icons/2`, (player)=>{
            uiManager.open(player, versionData.uiNames.UIBuilderRoot)
        })
    }
    form.show(player, false, ()=>{})
})