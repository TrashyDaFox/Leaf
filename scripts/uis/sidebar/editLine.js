import sidebarEditor from "../../api/sidebarEditor";
import config from "../../config";
import uiManager from "../../uiManager";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import { sidebarConfig } from "../../configs";
import icons from "../../api/icons";
import { formatStr } from "../../api/azaleaFormatting";
uiManager.addUI(config.uiNames.SidebarEditorEditLine, "Sidebar editor root", (player, sidebarName, lineID = "")=>{
    if(!sidebarEditor.getLineByID(sidebarName, lineID)) return;
    let actionForm = new ActionForm();
    actionForm.title(`§r`+formatStr(sidebarEditor.getLineByID(sidebarName, lineID).text, player))
    actionForm.button("§cBack\n§r§7Go back", icons.resolve("2.2/left"), (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorEdit, sidebarName);
    })
    actionForm.button("§bEdit Line\n§r§7Edit the line", `textures/blocks/dirt`, (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorAddLine, sidebarName, lineID);
    })
    actionForm.button("§eMove Up\n§r§7Move this line up", `textures/azalea_icons/Up`, (player)=>{
        sidebarEditor.moveLineUp(sidebarName, lineID);
        uiManager.open(player, config.uiNames.SidebarEditorEditLine, sidebarName, lineID);
    })
    actionForm.button("§eMove Down\n§r§7Move this line down", `textures/azalea_icons/Down`, (player)=>{
        sidebarEditor.moveLineDown(sidebarName, lineID);
        uiManager.open(player, config.uiNames.SidebarEditorEditLine, sidebarName, lineID);
    })
    actionForm.button("§nDelete\n§r§7Delete this line", icons.resolve("2.2/x"), (player)=>{
        sidebarEditor.removeLine(sidebarName, lineID);
        uiManager.open(player, config.uiNames.SidebarEditorEdit, sidebarName);
    })
    actionForm.show(player, false, ()=>{})
})