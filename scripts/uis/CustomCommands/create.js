import CustomCommands from '../../api/customCommands.js'
import { ModalFormData } from '@minecraft/server-ui'
import uiManager from '../../uiManager.js'
import config from '../../config.js'

uiManager.addUI(config.uiNames.CustomCommands.create, 'Create Custom Command', (player) => {
    const form = new ModalFormData()
    form.title('§aCreate Custom Command')
    form.textField('§aName', 'Name here..', null)
    form.textField('§aFirst Action', 'Action here..', null)
    form.textField('§aCategory', 'Category here..', null)
    form.textField('§aAuthor', 'Author here..', null)
    form.show(player).then((res) => {
        

        if (!res.formValues[0] || !res.formValues[1] || !res.formValues[2] || !res.formValues[3]) {
            return player.error('Missing fields');
        }

        if(CustomCommands.db.findFirst({name: res.formValues[0]})) {
            return player.error('Command already exists');
        }

        CustomCommands.add(res.formValues[0], res.formValues[1], res.formValues[2], res.formValues[3])
    })
})