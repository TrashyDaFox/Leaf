import translation from "../../api/translation";
import uiBuilder from "../../api/uiBuilder";
import config from "../../config";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.Modal.Add, "a", (player, defaultTitle = "", defaultScriptevent = "", error = "")=>{
    let modalForm = new ModalForm();
    modalForm.title(error ? `§c${error}` : translation.getTranslation(player, "uibuilder.createmodalui"))
    modalForm.textField(`${translation.getTranslation(player, "uibuilder.title")}§c*`, translation.getTranslation(player, "uibuilder.titleplaceholder"), defaultTitle);
    modalForm.textField(`${translation.getTranslation(player, "uibuilder.scriptevent")}§c*`, `/scriptevent ${config.scripteventNames.open} <scriptevent>`, defaultScriptevent);
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, config.uiNames.Modal.Root)
        if(!response.formValues[0] || !response.formValues[1]) return uiManager.open(player, config.uiNames.Modal.Root)
        uiBuilder.createModalUI(response.formValues[0], respone.formValues[1])
        
        return uiManager.open(player, config.uiNames.Modal.Root)
    })
})