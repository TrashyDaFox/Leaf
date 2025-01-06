import sidebarEditor from "../../api/sidebarEditor";
import config from "../../config";
import uiManager from "../../uiManager";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import { sidebarConfig } from "../../configs";
import { system } from "@minecraft/server";
uiManager.addUI(config.uiNames.SidebarEditorAddLine, "Sidebar editor root", (player, sidebarName, lineID = "")=>{
    let form = new ModalForm();
    let maxFrameCount = 24;
    form.slider("Ticks per frame", 1, 20, 1, lineID ? sidebarEditor.getLineTickSpeed(sidebarName, lineID) : 10);
    for(let i = 0;i < maxFrameCount;i++) {
        let lineText = undefined;
        if(lineID && sidebarEditor.getLineByID(sidebarName, lineID)) {
            let lineTextTemp = sidebarEditor.getLineByID(sidebarName, lineID).text.split('\n')[i];
            if(lineTextTemp) lineText = lineTextTemp;
        }
        form.textField(`Frame ${i + 1}`, ``, lineText);
    }
    form.show(player, false, (player, response)=>{
        let text = [];
        for(const value of response.formValues) {
            if(typeof value !== "string") continue;
            if(!value || !value.length) continue;
            if(typeof value === "string") text.push(value);
        }
        if(lineID) {
            sidebarEditor.editLine(sidebarName, lineID, text.join('\n'))
            system.runTimeout(()=>{
                if(lineID) sidebarEditor.editLineTickSpeed(sidebarName, lineID, response.formValues[0]);

            },5);
        } else {
            sidebarEditor.addLine(sidebarName, text.join('\n'))
        }
        uiManager.open(player, config.uiNames.SidebarEditorEdit, sidebarName);
    })
})