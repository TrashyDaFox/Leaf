import icons from "../../api/icons";
import sidebarEditor from "../../api/sidebarEditor";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.SidebarEditorTrashEdit, "Sidebar Trash", (player, id)=>{
    let form = new ActionForm();
    form.button("§cBack\n§7Go back", icons.resolve("2.2/left"), (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorRoot);  
    })
    form.button("§aRecover\n§7Recover this sidebar", icons.resolve("2.2/document"), (player)=>{
        sidebarEditor.db.untrashDocumentByID(id);
        uiManager.open(player, config.uiNames.SidebarEditorTrash);
    })
    form.button("§nDelete\n§7Permanently delete", icons.resolve("2.2/x"), (player)=>{
        sidebarEditor.db.deleteTrashedDocumentByID(id);
        uiManager.open(player, config.uiNames.SidebarEditorTrash);

    })
    form.show(player, false, ()=>{})
})