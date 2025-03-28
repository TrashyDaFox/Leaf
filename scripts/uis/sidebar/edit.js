import sidebarEditor from "../../api/sidebarEditor";
import config from "../../versionData";
import uiManager from "../../uiManager";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import { sidebarConfig } from "../../configs";
import { formatStr } from "../../api/azaleaFormatting";
import icons from "../../api/icons";
import { NUT_UI_HEADER_BUTTON, NUT_UI_TAG } from "../preset_browser/nutUIConsts";
import uiBuilder from "../../api/uiBuilder";
uiManager.addUI(config.uiNames.SidebarEditorEdit, "Sidebar editor root", (player, sidebarName)=>{
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rEditing Sidebar`)
    form.button(NUT_UI_HEADER_BUTTON+"§r§cBack\n§r§7Go back", icons.resolve(`^textures/azalea_icons/2`), (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderEdit, uiBuilder.db.findFirst({name: sidebarName, type: 7}).id);
    })
    form.button("§aAdd line\n§r§7Adds a line", "textures/azalea_icons/1", (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorAddLine, sidebarName);
    })
    for(const line of sidebarEditor.getLines(sidebarName)) {
        form.button("§r§f"+sidebarEditor.parseLine(player, line.text), undefined, (player)=>{
            uiManager.open(player, config.uiNames.SidebarEditorEditLine, sidebarName, line.id)
        })
    }
    // form.button("§nDelete Sidebar\n§r§7Delete the sidebar", icons.resolve("^textures/azalea_icons/Delete"), (player)=>{
    //     sidebarEditor.deleteSidebar(sidebarName);
    //     uiManager.open(player, config.uiNames.SidebarEditorRoot);
    // })
    // form.button("§bDuplicate Sidebar\n§r§7Clone the sidebar", icons.resolve("^textures/azalea_icons/copy"), (player)=>{
    //     let modal = new ModalForm();
    //     modal.textField("Name", "Name of the new sidebar");
    //     modal.show(player, false, (player, response)=>{
    //         sidebarEditor.duplicateSidebar(sidebarName, response.formValues[0]);
    //         uiManager.open(player, config.uiNames.SidebarEditorRoot);
    //     })
    // })
    form.show(player, false, (player, response)=>{})
})