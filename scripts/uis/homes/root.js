import config from "../../config";
import uiManager from "../../uiManager";
import homes from '../../api/homes'
import './create'
import './view'
import { ActionForm } from "../../lib/prismarinedb";

uiManager.addUI(config.uiNames.Homes.Root, "Homes Root", player=>{
    let form = new ActionForm()
    form.title('§aHomes')
    form.button('§aCreate Home\n§7Create a home', 'textures/azalea_icons/1.png', (player) => {
        uiManager.open(player, config.uiNames.Homes.Create)
    })
    for (const home of homes.getAllFromPlayer(player)) {
        form.button(`§a${home.data.name}\n§7View this home`, null, (player) => {
            uiManager.open(player, config.uiNames.Homes.View, home.id)
        })
    }
    form.show(player)
})