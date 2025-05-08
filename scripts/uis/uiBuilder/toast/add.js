import uiBuilder from "../../../api/uiBuilder";
import { ModalForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";

uiManager.addUI(versionData.uiNames.ToastBuilderAdd, "Add", (player, id = -1)=>{
    let ui = null;
    if(id >= 0) {
        ui = uiBuilder.db.getByID(id);
    }
    let modalForm = new ModalForm();
    modalForm.textField("Title", "Name for your notification", ui ? ui.data.name : "", ()=>{}, "A title for your notification. By default it will display, but if you prefer it not to you can disable it")
    modalForm.textField("Scriptevent", "Scriptevent to send your toast", ui ? ui.data.scriptevent : "", ()=>{}, "The scriptevent to open your UI. It is the part after /scriptevent leaf:open")
    modalForm.toggle("Hide title on player view?", ui ? ui.data.hideTitleInNotification ? true : false : false, ()=>{}, "Hide the title for if you think it looks ugly")
    modalForm.show(player, false, (player, response)=>{
        if(!ui || !ui.data || !ui.data.type || ui.data.type != 6) {
            uiBuilder.createToast(response.formValues[0], response.formValues[1], response.formValues[2])
        } else {
            ui.data.name = response.formValues[0];
            ui.data.scriptevent = response.formValues[1];
            ui.data.hideTitleInNotification = response.formValues[2];
            uiBuilder.db.overwriteDataByID(ui.id, ui.data)
        }
        uiManager.open(player, versionData.uiNames.UIBuilderRoot)
    })
})