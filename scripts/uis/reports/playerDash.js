import { ActionForm } from "../../lib/form_func";
import reports from "../../api/reports";
import uiManager from "../../uiManager";
import config from "../../versionData";

uiManager.addUI(
    config.uiNames.Reports.Dashboard,
    "Reports player dashboard",
    (player) => {
        let form = new ActionForm();
        form.title("§aReports!");
        form.button(
            "§aCreate\n§7Create a report",
            "textures/azalea_icons/1.png",
            (player) => {
                uiManager.open(player, config.uiNames.Reports.Create);
            }
        );
        for (const report of reports.getFromPlayer(player.name)) {
            form.button(
                `§a${report.data.name}\n§7${report.data.type} Report`,
                null,
                (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.Reports.View,
                        report.id
                    );
                }
            );
        }
        form.show(player);
    }
);
