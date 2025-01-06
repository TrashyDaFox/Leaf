import icons from "../../api/icons";
import sidebarEditor from "../../api/sidebarEditor";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import moment from '../../lib/moment';
uiManager.addUI(config.uiNames.SidebarEditorTrash, "Trash", (player)=>{
    let form = new ActionForm();
    form.title("Trash");
    form.body("Here are some deleted sidebars. You can recover them here, but they will be deleted in 30 days if they are not recovered");
    let trashedSidebars = sidebarEditor.db.getTrashedDocuments();
    form.button("Back", icons.resolve("2.2/left"), (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorRoot);
    })
    for(const sidebar of trashedSidebars) {
        form.button(`§n${sidebar.data._name}\n§r§7Deletes on ${moment(sidebar.expirationDate).calendar()}`, icons.resolve("2.2/document"), (player)=>{
            uiManager.open(player, config.uiNames.SidebarEditorTrashEdit, sidebar.id);
        })
    }
    form.show(player, false, (player, response)=>{})
})