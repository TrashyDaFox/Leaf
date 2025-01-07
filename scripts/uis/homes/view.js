import homes from '../../api/homes.js'
import { ActionForm } from '../../lib/prismarinedb'
import { ModalFormData } from '@minecraft/server-ui'
import { world } from '@minecraft/server'
import uiManager from '../../uiManager.js'
import config from '../../config.js'
import icons from '../../api/icons.js'

uiManager.addUI(config.uiNames.Homes.View, 'View homes', (player, id) => {
    let h = homes.get(id)
    if(!h) return uiManager.open(player, config.uiNames.Homes.Root);
    let form = new ActionForm()
    form.title('§aView home: ' + h.data.name)
    form.body(`Name: ${h.data.name}`) 
    form.button('§cDelete\n§7Delete this home', 'textures/azalea_icons/Delete', (player) => {
        homes.delete(id)
        uiManager.open(player, config.uiNames.Homes.Root)
    })
    form.button(`§bShare home\n§7Share this home with other users`, icons.resolve('azalea/name_tag'), (player) => {
        let form2 = new ActionForm()
        form2.title('Share home!')
        form2.button(`§cBack\n§7Back to home ui`, 'textures/azalea_icons/2.png', (player) => {
            uiManager.open(player, config.uiNames.Homes.View, id)
        })
        for (const plr of world.getPlayers()) {
            if(plr.name == player.name) continue;
            if(!h.data.sharedTo) h.data.sharedTo = [];
            if(h.data.sharedTo.includes(plr.name)) continue;
            form2.button(`§a${plr.name}\n§7[Click to share]`, 'textures/azalea_icons/1.png', (player) => {
                homes.shareHome(id, plr)
                uiManager.open(player, config.uiNames.Homes.View, id)
            })
        }
        form2.show(player)
    })
    form.button(`§cRemove Share\n§7Remove someone from shared home`, icons.resolve('azalea/name_tag'), (player) => {
        let form2 = new ActionForm()
        form2.title('Share home!')
        form2.button(`§cBack\n§7Back to home ui`, 'textures/azalea_icons/2.png', (player) => {
            uiManager.open(player, config.uiNames.Homes.View, id)
        })
        for (const sh of h.data.sharedTo) {
            form2.button(`§a${sh}\n§7[Click to remove]`, 'textures/azalea_icons/Delete', (player) => {
                homes.removeShare(id, sh)
                uiManager.open(player, config.uiNames.Homes.View, id)
            })
        }
        form2.show(player)
    })
    form.button('§aTeleport\n§7TP to this home', icons.resolve('leaf/image-045'), (player) => {
        homes.teleport(id, player)
    })
    form.show(player)
})