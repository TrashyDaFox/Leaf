import sidebarEditor from "../../api/sidebarEditor";
import config from "../../versionData";
import uiManager from "../../uiManager";
import { ModalForm } from "../../lib/form_func";
import { NUT_UI_MODAL } from "../preset_browser/nutUIConsts";
uiManager.addUI(
    config.uiNames.SidebarEditorAdd,
    "Sidebar editor root",
    (player) => {
        let form = new ModalForm();
        form.title(`${NUT_UI_MODAL}Create Sidebar`);
        form.textField("Name", "Name of the sidebar");
        form.show(player, false, (player, response) => {
            sidebarEditor.createSidebar(response.formValues[0]);
            uiManager.open(player, config.uiNames.SidebarEditorRoot);
        });
    }
);
