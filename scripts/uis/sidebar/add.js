import sidebarEditor from "../../api/sidebarEditor";
import config from "../../config";
import uiManager from "../../uiManager";
import { ModalForm } from "../../lib/form_func";
uiManager.addUI(config.uiNames.SidebarEditorAdd, "Sidebar editor root", (player)=>{
    let form = new ModalForm();
    form.textField("Name", "Name of the sidebar");
    form.show(player, false, (player, response)=>{
        sidebarEditor.createSidebar(response.formValues[0]);
        uiManager.open(player, config.uiNames.SidebarEditorRoot);
    })
})