import sidebarEditor from "../../api/sidebarEditor";
import config from "../../versionData";
import uiManager from "../../uiManager";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { colors, prismarineDb } from "../../lib/prismarinedb";
import { sidebarConfig } from "../../configs";
import { system } from "@minecraft/server";
import { NUT_UI_MODAL } from "../preset_browser/nutUIConsts";
import uiBuilder from "../../api/uiBuilder";
uiManager.addUI(
    config.uiNames.SidebarEditorAddLine,
    "Sidebar editor root",
    (player, sidebarName, lineID = "", cfg = {}) => {
        let form = new ModalForm();
        form.title(`${NUT_UI_MODAL}${lineID ? "Edit Line Text" : "Add Line"}`);
        if(cfg.textEffect) {
            let line = lineID ? sidebarEditor.getLineByID(sidebarName, lineID) : null;
            form.slider(
                "Ticks per frame",
                1,
                20,
                1,
                lineID ? sidebarEditor.getLineTickSpeed(sidebarName, lineID) : 10
            );
            form.textField("Text", "Type text for your effect", line ? line.text : "")

            let colors2 = colors.getColorNamesColored().map(_=>{
                return {
                    option: _,
                    callback() {}
                }
            })
            form.dropdown("Background", colors2, line ? colors2.findIndex(_=>_.option.startsWith(line.bg)) : 0)
            form.dropdown("Glow (inner)", colors2, line ? colors2.findIndex(_=>_.option.startsWith(line.glowin)) : 0)
            form.dropdown("Glow (outer)", colors2, line ? colors2.findIndex(_=>_.option.startsWith(line.glowout)) : 0)
            form.show(player, false, (player, response)=>{
                if(!response.canceled) {
                    if(line) {
                        let sidebar = sidebarEditor.getSidebar(sidebarName)
                        let index = sidebar.data.lines.findIndex(_=>_.id == line.id)
                        sidebarEditor.clearLineTickSpeedCache()
                        line.tickSpeed = response.formValues[0]
                        line.text = response.formValues[1]
                        line.bg = colors.getColorCodes()[response.formValues[2]]
                        line.glowin = colors.getColorCodes()[response.formValues[3]]
                        line.glowout = colors.getColorCodes()[response.formValues[4]]
                        sidebar.data.lines[index] = line;
                        uiBuilder.db.overwriteDataByID(sidebar.id, sidebar.data)
                    } else {
                        let sidebar = sidebarEditor.getSidebar(sidebarName)
                        sidebarEditor.clearLineTickSpeedCache()
                        let nl = {
                            id: Date.now().toString(),
                            type: "text-effect",
                            tickSpeed: response.formValues[0],
                            text: response.formValues[1],
                            bg: colors.getColorCodes()[response.formValues[2]],
                            glowin: colors.getColorCodes()[response.formValues[3]],
                            glowout: colors.getColorCodes()[response.formValues[4]],
                        }
                        sidebar.data.lines.push(nl)
                        uiBuilder.db.overwriteDataByID(sidebar.id, sidebar.data)
                    }
                }
                uiManager.open(
                    player,
                    config.uiNames.SidebarEditorEdit,
                    sidebarName
                );
            })
            return;
        }
        let maxFrameCount = lineID
            ? sidebarEditor.getSidebarLineAnimFrameCount(sidebarName, lineID)
            : 5;
        form.slider(
            "Ticks per frame",
            1,
            20,
            1,
            lineID ? sidebarEditor.getLineTickSpeed(sidebarName, lineID) : 10
        );
        for (let i = 0; i < maxFrameCount; i++) {
            let lineText = undefined;
            if (lineID && sidebarEditor.getLineByID(sidebarName, lineID)) {
                let lineTextTemp = sidebarEditor
                    .getLineByID(sidebarName, lineID)
                    .text.split("\n")[i];
                if (lineTextTemp) lineText = lineTextTemp;
            }
            form.textField(`Frame ${i + 1}`, ``, lineText);
        }
        form.show(player, false, (player, response) => {
            let text = [];
            for (const value of response.formValues) {
                if (typeof value !== "string") continue;
                if (!value || !value.length) continue;
                if (typeof value === "string") text.push(value);
            }
            if (lineID) {
                sidebarEditor.editLine(sidebarName, lineID, text.join("\n"));
                system.runTimeout(() => {
                    if (lineID)
                        sidebarEditor.editLineTickSpeed(
                            sidebarName,
                            lineID,
                            response.formValues[0]
                        );
                }, 5);
            } else {
                sidebarEditor.addLine(sidebarName, text.join("\n"));
            }
            uiManager.open(
                player,
                config.uiNames.SidebarEditorEdit,
                sidebarName
            );
        });
    }
);
