import uiBuilder from "../../../api/uiBuilder";
import eventsData from "../../../data/eventsData";
import { ModalForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";

uiManager.addUI(versionData.uiNames.EventsV2.AddAction, "", (player, id, actionType, actionIndex = -1)=>{
    let doc = uiBuilder.db.getByID(id)
    let modalForm = new ModalForm();
    let eventType = doc.data.eventType;
    let action = eventsData[eventType].actionTypes[actionType]
    modalForm.textField("Label", "Name for the action", actionIndex >= 0 ? doc.data.actions[actionIndex].label : "")
    if(action.inputMethod == "string") {
        modalForm.textField(action.name, " ", actionIndex >= 0 ? doc.data.actions[actionIndex].value : "")
        modalForm.show(player, false, (player, response)=>{
            if(actionIndex >= 0) {
                doc.data.actions[actionIndex].label = response.formValues[0];
                doc.data.actions[actionIndex].value = response.formValues[1];
            } else {
                doc.data.actions.push({type: actionType, label: response.formValues[0], value: response.formValues[1]})
            }
            uiBuilder.db.overwriteDataByID(doc.id, doc.data)
            uiManager.open(player, versionData.uiNames.EventsV2.EditActions, id)
        })
    }
})