/*
share your home with me uwu⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⡔⠉⠑⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣰⠋⠉⠉⠓⡆⠀⠀
⠀⣸⠁⠀⠀⠀⠙⢦⡀⢸⡉⠓⠲⣄⡀⢀⡞⠀⠀⠀⠀⣀⣽⡤⠀
⠀⡇⠀⠀⠀⠀⠀⠀⠙⣦⠷⠄⠀⠀⠙⠞⠀⠀⠀⠀⠀⠒⠚⡏⠁
⠀⡇⠀⠀⠀⠀⣀⣀⡚⠓⠒⠒⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀
⠀⡇⠀⠀⠀⡎⠀⠀⠈⡆⠀⠀⠀⠀⠘⢄⣀⣀⡀⠀⠀⠀⣸⠁⠀
⠀⠈⣇⠀⠐⡶⠖⣲⣶⡆⠀⠀⠀⠀⣶⣶⡒⠲⡒⠀⢀⡼⠁⠀⠀
⠰⣖⠺⠧⢸⠁⠀⣿⣿⠇⠀⠀⠀⠀⣿⣿⠇⠀⡇⠀⠉⣩⠇⠀⠀
⠀⠈⣳⠀⣨⢃⠀⠈⠉⠀⠒⠂⠀⠀⠈⠁⢀⠄⡡⠀⢼⡁⠀⠀⠀
⠀⢰⣃⣈⣀⠁⠀⠀⠀⠦⠔⠓⠲⡲⠃⠀⠀⢈⣀⣀⣀⣹⡄⠀⠀
⠀⠀⠀⠀⠀⠉⢳⠲⠤⢄⣀⣀⣀⣠⢶⠒⣏⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⣳⠒⢲⠋⢱⠤⠧⠚⠋⠘⡆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠘⠓⡆⠈⠒⠁⠀⠀⠀⠀⠀⢹⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣼⣁⣀⣀⣀⣀⣀⣀⣀⣀⣀⡇⠀⠀⠀⠀⠀⠀
*/
import homes from '../../api/homes.js'
import { ActionForm } from '../../lib/prismarinedb'
import { ModalFormData } from '@minecraft/server-ui'
import { world } from '@minecraft/server'
import uiManager from '../../uiManager.js'
import config from '../../versionData.js'
import icons from '../../api/icons.js'

uiManager.addUI(config.uiNames.Homes.ViewShared, 'View homes', (player, id) => {
    let h = homes.get(id)
    if(!h) return uiManager.open(player, config.uiNames.Homes.Root);
    let form = new ActionForm()
    form.title('§aView home: ' + h.data.name)
    form.body(`Name: ${h.data.name}`) 
    form.button('§aTeleport\n§7TP to this home', icons.resolve('leaf/image-045'), (player) => {
        homes.teleport(id, player)
    })
    form.show(player)
})