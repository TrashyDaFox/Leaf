import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.UIBuilderEditButtons, "Edit Buttons in a UI", (player, id)=>{
    let form = uiBuilder.db.getByID(id);
    let actionForm = new ActionForm();
    let pre = `§r`;
    if(form.data.layout == 1) pre = `§g§r§i§d§u§i§r`;
    if(form.data.layout == 2) pre = `§f§u§l§l§s§c§r§e§e§n§r`;
    if(form.data.layout == 3) pre = `§t§e§s§t§r`;
    actionForm.title(`${pre}${form.data.name}`)
    actionForm.button(`§nBack`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderEdit, id)
    })
    actionForm.button(`§aAdd Button\n§7Adds a button`, `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderAddButton, id);
    })
    for(let index = 0;index < form.data.buttons.length;index++) {
        let button = form.data.buttons[index];
        actionForm.button(`${button.text}${button.subtext ? `\n§r§7${button.subtext}` : ``}`, button.iconID ? icons.resolve(button.iconID) : null, (player)=>{
            uiManager.open(player, config.uiNames.UIBuilderEditButton, id, index)
        })
    }
    actionForm.show(player, false, (player, response)=>{

    })
})