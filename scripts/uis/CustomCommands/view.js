import CustomCommands from '../../api/customCommands.js'
import { ActionForm } from '../../lib/form_func.js'
import { ModalFormData } from '@minecraft/server-ui'
import uiManager from '../../uiManager.js'
import config from '../../versionData.js'
import icons from '../../api/icons.js'

uiManager.addUI(config.uiNames.CustomCommands.view, 'View custom command', (player, id) => {
    let cmd = CustomCommands.db.getByID(id)
    if(!cmd) return uiManager.open(player, config.uiNames.CustomCommands.root);
    let form = new ActionForm();
    form.title(`§f§0§0§f` + '§a' + cmd.data.name)
    form.button('§cDelete', 'textures/azalea_icons/Delete.png', (player) => {
        CustomCommands.remove(cmd.id)
        uiManager.open(player, config.uiNames.CustomCommands.root)
    })
    form.button('§aAdd Action', 'textures/azalea_icons/1.png', (player) => {
        let form2 = new ModalFormData();
        form2.title('§aAdd Action')
        form2.textField('§aAction', 'Set action..', null)
        form2.show(player).then((res) => {
            if(!res) return uiManager.open(player, config.uiNames.CustomCommands.view, id);

            CustomCommands.addAction(res.formValues[0], cmd.id)

            return uiManager.open(player, config.uiNames.CustomCommands.view, id), player.success('Added action: ' + res.formValues[0]);
        })
    })
    form.button('§bEdit Subcommands', icons.resolve('azalea/name_tag'), (player) => {
        let form69 = new ActionForm();
        form69.title('§f§0§0§fEdit subcommands')
        form69.button('§cBack', 'textures/azalea_icons/2.png', (player) => {
            uiManager.open(player, config.uiNames.CustomCommands.view, id)
        })
        form69.button('§aAdd Subcommand', 'textures/azalea_icons/1.png', (player) => {
            let pleasehelpmeimgoinginsane = new ModalFormData();
            pleasehelpmeimgoinginsane.title('Add subcommand')
            pleasehelpmeimgoinginsane.textField('Subcommand', 'Subcommand here..', null)
            pleasehelpmeimgoinginsane.textField('First Action', 'Action here..', null)
            pleasehelpmeimgoinginsane.show(player).then((res) => {
                let action = res.formValues[1]
                let name = res.formValues[0]

                CustomCommands.addSubcommand(id, name, action)
            })
        })
        for (const subcmd of cmd.data.subcommands) {
            form69.button('§a' + subcmd.name, null, (player) => {
                let form600probably = new ActionForm();
                form600probably.title('§f§0§0§fEdit subcommand')
                form600probably.button('§cDelete', 'textures/azalea_icons/Delete.png', (player) => {
                    CustomCommands.removeSubcommand(id, subcmd.name)
                })
                form600probably.button('§aAdd Action', 'textures/azalea_icons/1.png', (player) => {
                    let form5000 = new ModalFormData();
                    form5000.title('§aAdd Action')
                    form5000.textField('§aAction', 'Set action..', null)
                    form5000.show(player).then((res) => {
                        if(!res) return uiManager.open(player, config.uiNames.CustomCommands.view, id);
            
                        CustomCommands.addActiontoSubCmd(id, subcmd.name, res.formValues[0])
                   })
                })
                form600probably.button('§cDelete action', 'textures/azalea_icons/CustomCommands.png', (player) => {
                    let form12398 = new ActionForm();
                    form12398.title('§cDelete an action')
                    for (const action of subcmd.actions) {
                        form12398.button(`§a${action}`, null, (player) => {
                            CustomCommands.removeActionFromSubCommand(id, subcmd.name, subcmd.actions.indexOf(action))
                        })
                    }
                    form12398.show(player)
                })
                form600probably.show(player)
            })
        }
        form69.show(player)
    })
    form.button('§cDelete action', 'textures/azalea_icons/CustomCommands.png', (player) => {
        let form3 = new ActionForm();
        form3.title('§f§0§0§f§cDelete an action')
        form3.button('§cBack', 'textures/azalea_icons/2.png', (player) => {
            uiManager.open(player, config.uiNames.CustomCommands.view, id)
        })
        for (const action of cmd.data.actions) {
            form3.button(`§a${action}`, null, (player) => {
                CustomCommands.removeAction(cmd.data.actions.indexOf(action), cmd.id)
                uiManager.open(player, config.uiNames.CustomCommands.view, id)
            })
        }
        form3.show(player)
    })
    form.show(player)
})