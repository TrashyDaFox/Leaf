import sidebarEditor from "../../api/sidebarEditor";
import config from "../../versionData";
import uiManager from "../../uiManager";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import { sidebarConfig } from "../../configs";
import icons from "../../api/icons";
import { formatStr } from "../../api/azaleaFormatting";
import { NUT_UI_DISABLE_VERTICAL_SIZE_KEY, NUT_UI_HEADER_BUTTON, NUT_UI_LEFT_HALF, NUT_UI_RIGHT_HALF, NUT_UI_TAG } from "../preset_browser/nutUIConsts";
uiManager.addUI(config.uiNames.SidebarEditorEditLine, "Sidebar editor root", (player, sidebarName, lineID = "")=>{
    if(!sidebarEditor.getLineByID(sidebarName, lineID)) return;
    let actionForm = new ActionForm();
    actionForm.title(`${NUT_UI_TAG}§r`+formatStr(sidebarEditor.getLineByID(sidebarName, lineID).text, player).replaceAll(/§./g, ''))
    actionForm.button(NUT_UI_HEADER_BUTTON+"§r§cBack\n§r§7Go back", `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorEdit, sidebarName);
    })
    actionForm.button("§bEdit Line\n§r§7Edit the line", `textures/azalea_icons/edit text`, (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorAddLine, sidebarName, lineID);
    })
    actionForm.button(NUT_UI_RIGHT_HALF+NUT_UI_DISABLE_VERTICAL_SIZE_KEY+"§r§eMove Up\n§r§7Move this line up", `textures/azalea_icons/Up`, (player)=>{
        sidebarEditor.moveLineUp(sidebarName, lineID);
        uiManager.open(player, config.uiNames.SidebarEditorEditLine, sidebarName, lineID);
    })
    actionForm.button(NUT_UI_LEFT_HALF+"§r§eMove Down\n§r§7Move this line down", `textures/azalea_icons/Down`, (player)=>{
        sidebarEditor.moveLineDown(sidebarName, lineID);
        uiManager.open(player, config.uiNames.SidebarEditorEditLine, sidebarName, lineID);
    })
    actionForm.button("§nDelete\n§r§7Delete this line", `textures/azalea_icons/Delete`, (player)=>{
        uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this line?", ()=>{
            sidebarEditor.removeLine(sidebarName, lineID);
            uiManager.open(player, config.uiNames.SidebarEditorEdit, sidebarName);
        }, ()=>{
            uiManager.open(player, config.uiNames.SidebarEditorEditLine, sidebarName, lineID);
        })
    })
    actionForm.show(player, false, ()=>{})
})