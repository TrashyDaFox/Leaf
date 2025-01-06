import { ActionForm } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import config from "../../config";
import reports from "../../api/reports";

uiManager.addUI(config.uiNames.Reports.Admin.View, 'View report as admin', (player, id) => {
    let form = new ActionForm()
    let r = reports.get(id)
    if(!r) return uiManager.open(player, config.uiNames.Reports.Admin.Dashboard), player.error('No report found');
    form.title('§aView Report: ' + r.data.name)
    form.body(`Player who sent this: ${r.data.player}\nReport body: ${r.data.body}`)
    form.button(`§cDelete\n§7Delete this report`, 'textures/azalea_icons/Delete', (player) => {
        reports.delete(id)
        uiManager.open(player, config.uiNames.Reports.Admin.Dashboard)
        player.success('Deleted report: ' + r.data.name)
    })
    form.show(player)
})