import sidebarEditor from "../../api/sidebarEditor";
import config from "../../config";
import uiManager from "../../uiManager";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import { sidebarConfig } from "../../configs";
import { formatStr } from "../../api/azaleaFormatting";
import icons from "../../api/icons";
uiManager.addUI(config.uiNames.SidebarEditorEdit, "Sidebar editor root", (player, sidebarName)=>{
    let form = new ActionForm();
    form.button("§cBack\n§r§7Go back", icons.resolve(`2.2/left`), (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorRoot);
    })
    form.button("§aAdd line\n§r§7Adds a line", "textures/azalea_icons/1", (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorAddLine, sidebarName);
    })
    for(const line of sidebarEditor.getLines(sidebarName)) {
        form.button(sidebarEditor.parseLine(player, line.text), undefined, (player)=>{
            uiManager.open(player, config.uiNames.SidebarEditorEditLine, sidebarName, line.id)
        })
    }
    form.button("§nDelete Sidebar\n§r§7Delete the sidebar", icons.resolve("2.2/x"), (player)=>{
        sidebarEditor.deleteSidebar(sidebarName);
        uiManager.open(player, config.uiNames.SidebarEditorRoot);
    })
    form.button("§bDuplicate Sidebar\n§r§7Clone the sidebar", icons.resolve("2.2/document"), (player)=>{
        let modal = new ModalForm();
        modal.textField("Name", "Name of the new sidebar");
        modal.show(player, false, (player, response)=>{
            sidebarEditor.duplicateSidebar(sidebarName, response.formValues[0]);
            uiManager.open(player, config.uiNames.SidebarEditorRoot);
        })
    })
    form.show(player, false, (player, response)=>{})
})