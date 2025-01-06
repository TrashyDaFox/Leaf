import { ActionForm } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import config from "../../config";
import reports from "../../api/reports";

uiManager.addUI(config.uiNames.Reports.View, 'View report as player', (player, id) => {
    let form = new ActionForm()
    let r = reports.get(id)
    if(!r) return uiManager.open(player, config.uiNames.Reports.Dashboard), player.error('No report found');
    form.title('§aView Report: ' + r.data.name)
    form.body(`Player who sent this: ${r.data.player}\nReport body: ${r.data.body}`)
    form.button(`§cBack\n§7Go back to reports`, 'textures/azalea_icons/2.png', (player) => {
        uiManager.open(player, config.uiNames.Reports.Dashboard)
    })
    form.show(player)
})