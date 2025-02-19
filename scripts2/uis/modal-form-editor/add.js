import translation from "../../api/translation";
import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Modal.Add, "a", (player, defaultTitle = "", defaultScriptevent = "", error = "", id = -1)=>{
    let modalForm = new ModalForm();
    modalForm.title(error ? `§c${error}` : `create modal ui`)
    modalForm.textField(`${translation.getTranslation(player, "uibuilder.title")}§c*`, translation.getTranslation(player, "uibuilder.titleplaceholder"), defaultTitle);
    modalForm.textField(`${translation.getTranslation(player, "uibuilder.scriptevent")}§c*`, `/scriptevent ${config.scripteventNames.open} <scriptevent>`, defaultScriptevent);
    if(id != -1) {
        let ui = uiBuilder.getByID(id)
        modalForm.textField("Submit Button Text", "Submit Button Text", ui.data.submitText ? ui.data.submitText : "")
        modalForm.textField("After submit", "After submit", ui.data.afterSubmitAction ? ui.data.afterSubmitAction : "")
    }
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, config.uiNames.Modal.Root)
        if(!response.formValues[0] || !response.formValues[1]) return uiManager.open(player, config.uiNames.Modal.Root)
        if(id == -1 ) {
            uiBuilder.createModalUI(response.formValues[0], response.formValues[1])
        } else {
            let ui = uiBuilder.getByID(id)
            ui.data.name = response.formValues[0];
            ui.data.scriptevent = response.formValues[1];
            ui.data.submitText = response.formValues[2];
            ui.data.afterSubmitAction = response.formValues[3];
            uiBuilder.db.overwriteDataByID(ui.id, ui.data)
        }
        
        return uiManager.open(player, config.uiNames.Modal.Root)
    })
})