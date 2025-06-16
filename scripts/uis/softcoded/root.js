import uiBuilder from "../../api/uiBuilder";
import adminMenus from "./admin_menu";
uiBuilder.db.waitLoad().then(() => {
    for (const menu of adminMenus) {
        uiBuilder.addInternalUI(menu);
    }
});
