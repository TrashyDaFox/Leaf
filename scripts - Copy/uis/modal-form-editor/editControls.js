/*
control types:

text-field-using-command
properties:
- preserve
- placeholder
- label
- default value
- command

toggle-using-tag
properties:
- tag
- label

toggle-using-command
properties:
- responseFormat
 - can be true/false, 1/0
 - default: true/false
- command

dropdown-using-command
properties:
- responseFormat
 - dropdown label
 - index (starting with 0)
 - index (starting with 1)
- command
- label
- options
 - label

dropdown-using tag
properties:
- label
- options
 - label
 - tag

dropdown-using-score
properties:
- objective
- startWithZero
- options
 - label

slider-using-command
properties:
- command
- label
- max
- min
- step

slider-using-score
properties:
- objective
- label
- min
- max
- step
*/

import uiBuilder from "../../api/uiBuilder";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";

uiManager.addUI(versionData.uiNames.Modal.EditControls, "", (player, id)=>{
    let ui = uiBuilder.getByID(id);
    let form = new ActionForm();
    form.button(`§aAdd control\n§7Adds a control`, `textures/azalea_icons/GUIMaker/ModalsV2/add control`, (player)=>{
        uiManager.open(player, versionData.uiNames.Modal.AddControl, id)
    })
    form.button(`§dPreview\n§7Previews the UI`, null, (player)=>{
        uiBuilder.open(id, player)
    })
    for(let i = 0; i < ui.data.controls.length;i++) {
        let control = ui.data.controls[i];
        form.button(`§6${control.type == "header" || control.type == "label" ? control.text : control.label}\n§r§7${control.type}`, null, (player)=>{
            uiManager.open(player, versionData.uiNames.Modal.EditControl, id, i)
        })
    }
    form.show(player, false, (player, response)=>{})
})