import { ActionForm } from "../../lib/form_func";
import reports from "../../api/reports";
import uiManager from "../../uiManager";
import config from "../../versionData";

uiManager.addUI(
    config.uiNames.Reports.Admin.Dashboard,
    "Reports admin dashboard",
    (player) => {
        let form = new ActionForm();
        form.title("§aReports!");
        form.button(
            "§cBack\n§7Go back to config ui",
            "textures/azalea_icons/2.png",
            (player) => {
                uiManager.open(player, config.uiNames.Config.Misc);
            }
        );
        for (const report of reports.getAll()) {
            form.button(
                `§a${report.data.name}\n§7${report.data.type} Report`,
                null,
                (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.Reports.Admin.View,
                        report.id
                    );
                }
            );
        }
        form.show(player);
    }
);
