import config from "../../versionData";
import uiManager from "../../uiManager";
import homes from '../../api/homes'
import { ActionForm } from "../../lib/prismarinedb";

uiManager.addUI(config.uiNames.Homes.Shared, "Homes Root", (player)=>{
    let form = new ActionForm()
    form.title('§aHomes')
    form.button('§cBack\n§7Go back to homes root', 'textures/azalea_icons/2.png', (player) => {
        uiManager.open(player, config.uiNames.Homes.Root)
    })
    for (const home of homes.getSharedHomes(player)) {
        form.button(`§a${home.data.name}\n§7View this home`, null, (player) => {
            uiManager.open(player, config.uiNames.Homes.ViewShared, home.id)
        })
    }
    form.show(player)
})