import CustomCommands from '../../api/customCommands.js'
import { ActionForm } from '../../lib/form_func.js'
import uiManager from '../../uiManager.js'
import config from '../../versionData.js'
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts.js";
import './create'
import './view'

uiManager.addUI(config.uiNames.CustomCommands.root, 'Custom Commands Root', (player)=> {
    let form = new ActionForm();
    form.title(`§f§0§0§f§aCustom Commands`)
    form.button('§aCreate Command', 'textures/azalea_icons/1.png', (player) => {
        uiManager.open(player, config.uiNames.CustomCommands.create);
    })
    for (const cmd of CustomCommands.db.findDocuments()) {
        form.button(`§a${cmd.data.name}\n§7${cmd.data.category}`, null, (player) => {
            uiManager.open(player, config.uiNames.CustomCommands.view, cmd.id)
        })
    }
    form.show(player)
})