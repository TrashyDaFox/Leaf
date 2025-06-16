import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.TpaRoot, (player) => {
    let form = new ActionForm();

    form.button("§aSend Request", null, (player) => {
        uiManager.open(player, config.uiNames.TpaSend);
    });

    form.button("§bIncoming Requests", null, (player) => {
        uiManager.open(player, config.uiNames.TpaIncoming);
    });

    form.button("§bOutgoing Requests", null, (player) => {
        uiManager.open(player, config.uiNames.TpaOutgoing);
    });

    form.show(player, false, () => {});
});
