import { ModalFormData } from '@minecraft/server-ui'
import uiManager from '../../uiManager'
import homes from '../../api/homes'
import config from '../../versionData'

uiManager.addUI(config.uiNames.Homes.Create, 'Create a home', (player) => {
    const form = new ModalFormData();
    form.title('§aCreate home!')
    form.textField('Name', 'Example: Base', null)
    form.show(player).then((response) => {

        if(!response.formValues[0]) return player.error('Enter a name!');
        homes.createHome(response.formValues[0], player);
    })
})