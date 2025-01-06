import uiBuilder from "../../../api/uiBuilder";
import config from "../../../config";
import { ModalForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";

uiManager.addUI(config.uiNames.UIBuilderTabbedCreate, "Create Tab UI", (player)=>{
    let modal = new ModalForm();
    modal.title("Create Tab UI")
    modal.textField("Title", "A label for your tab UI", undefined, (player)=>{})
    modal.show(player, false, (player, response)=>{
        if(response.formValues[0]) {
            uiBuilder.createTabbedUI(response.formValues[0])
        }
        uiManager.open(player, config.uiNames.UIBuilderTabbed)
    })
})