import eventsData from "../../../data/eventsData";
import { ActionForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";

uiManager.addUI(versionData.uiNames.EventsV2.AddActionTypeSelector, "", (player, eventType = 0, id)=>{
    let form = new ActionForm();
    form.title("Select action type")
    for(const action of eventsData[eventType].actionTypes) {
        form.button(`${action.name}`, null, (player)=>{
            uiManager.open(player, versionData.uiNames.EventsV2.AddAction, id, action.type)
        })
    }
    form.show(player, false, (player, response)=>{
        
    })
})