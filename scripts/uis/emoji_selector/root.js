import { world } from "@minecraft/server";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";
import { themes } from "../uiBuilder/cherryThemes";
import emojis, { emojiCategories } from "../../api/emojis";

function getEmojiDataFormatted() {
    let emojiKeys = Object.keys(emojis)
    let categories = {};
    for(const emojiKey of emojiKeys) {
        if(!categories[emojiCategories[emojiKey] || "uncategorized"]) categories[emojiCategories[emojiKey] || "uncategorized"] = [emojiKey]
        else categories[emojiCategories[emojiKey] || "uncategorized"].push(emojiKey)
    }
    return categories;
}

uiManager.addUI(versionData.uiNames.EmojiSelectorCategory, "", (player, category, cb)=>{
    let modalForm = new ModalForm();
    let categories = getEmojiDataFormatted();
    modalForm.title(category)
    modalForm.label("§o§bTIP: Close to the UI to go back")
    modalForm.dropdown("Select an emoji", categories[category].map(_=>{
        return {option: `${emojis[_]} :${_}:`, callback() {}}
    }))
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, versionData.uiNames.EmojiSelector, cb)
        cb(categories[category][response.formValues[1]])
    })
})

uiManager.addUI(versionData.uiNames.EmojiSelector, "", (player, cb)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}${themes[25][0]}§r§fEmoji Selector`)
    form.body(`Please select a category`)
    let categories = getEmojiDataFormatted();
    form.button(`§cCancel\n§7Cancel Selection`, `textures/azalea_icons/Delete`, (player)=>{
        cb(null)
    })
    for(const category of Object.keys(categories)) {
        form.button(`§b${category}\n§7[ Click to Open Category ]`, null, (player)=>{
            uiManager.open(player, versionData.uiNames.EmojiSelectorCategory, category, cb)
        })
    }
    form.show(player, false, (player, response)=>{})
})

uiManager.addUI("emoji_selector_test", "a", (player)=>{
    uiManager.open(player, versionData.uiNames.EmojiSelector, (emoji)=>{
        world.sendMessage(emoji ? emoji : "None")
    })
})