import uiBuilder from "../../api/uiBuilder";
import { array_move } from "../../api/utils/array_move";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";

uiManager.addUI(versionData.uiNames.Modal.EditControl, "Edit control", (player, id, controlIndex)=>{
    let form = new ActionForm();
    let ui = uiBuilder.db.getByID(id);
    form.button(`§eEdit\n§7Edit this control`, `textures/azalea_icons/Pencil`, player=>{
        uiManager.open(player, versionData.uiNames.Modal.AddControl, id, controlIndex)
    })
    form.button(`§bUp\n§7Move this component up`, `textures/azalea_icons/Up`, player=>{
        array_move(ui.data.controls, controlIndex, controlIndex - 1 < 0 ? controlIndex : controlIndex - 1)
        uiBuilder.db.overwriteDataByID(ui.id, ui.data)
        uiManager.open(player, versionData.uiNames.Modal.EditControls, id)
    })
    form.button(`§bDown\n§7Move this component down`, `textures/azalea_icons/Down`, player=>{
        array_move(ui.data.controls, controlIndex, controlIndex + 1 >= ui.data.controls.length ? controlIndex : controlIndex + 1)
        uiBuilder.db.overwriteDataByID(ui.id, ui.data)
        uiManager.open(player, versionData.uiNames.Modal.EditControls, id)
    })
    form.button(`§cDelete\n§7Delete this control`, `textures/azalea_icons/Delete`, player=>{
        ui.data.controls.splice(controlIndex, 1)
        uiBuilder.db.overwriteDataByID(ui.id, ui.data)
        uiManager.open(player, versionData.uiNames.Modal.EditControls, id)
    })
    form.show(player, false, (player, response)=>{})
})