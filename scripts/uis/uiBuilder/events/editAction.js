import uiBuilder from "../../../api/uiBuilder";
import { array_move } from "../../../api/utils/array_move";
import eventsData from "../../../data/eventsData";
import { ActionForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";

uiManager.addUI(versionData.uiNames.EventsV2.EditAction, "", (player, id, actionIndex = -1)=>{
    let doc = uiBuilder.db.getByID(id)
    let eventType = doc.data.eventType;

    let form = new ActionForm();
    form.button(`§cBack\n§7Go back`, `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, versionData.uiNames.EventsV2.EditActions, id)
    })
    form.button(`§6Edit Event\n§7Edit the event properties`, null, (player)=>{
        uiManager.open(player, versionData.uiNames.EventsV2.AddAction, id, doc.data.actions[actionIndex].type, actionIndex)
    })
    form.button(`§bMove Up`, `textures/azalea_icons/Up`, (player)=>{
        let newIndex = actionIndex - 1 < 0 ? 0 : actionIndex - 1;
        array_move(doc.data.actions, actionIndex, newIndex)
        uiBuilder.db.overwriteDataByID(doc.id, doc.data)
        uiManager.open(player, versionData.uiNames.EventsV2.EditAction, id, newIndex)
    })
    form.button(`§bMove Down`, `textures/azalea_icons/Down`, (player)=>{
        let newIndex = actionIndex + 1 >= doc.data.actions.length ? doc.data.actions.length - 1 : actionIndex + 1;
        array_move(doc.data.actions, actionIndex, newIndex)
        uiBuilder.db.overwriteDataByID(doc.id, doc.data)
        uiManager.open(player, versionData.uiNames.EventsV2.EditAction, id, newIndex)
    })
    form.button(`§cDelete\n§7Delete this action`, `textures/azalea_icons/Delete`, (player)=>{
        doc.data.actions.splice(actionIndex, 1)
        uiBuilder.db.overwriteDataByID(doc.id, doc.data)
        uiManager.open(player, versionData.uiNames.EventsV2.EditActions, id)
    })
    form.show(player, false, (player, response)=>{

    })
})