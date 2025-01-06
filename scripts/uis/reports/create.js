import { ModalFormData } from '@minecraft/server-ui'
import uiManager from '../../uiManager'
import Reports from '../../api/reports.js'
import config from '../../config'

let types = [ { option: 'Player' }, { option: 'Bug' } ]
uiManager.addUI(config.uiNames.Reports.Create, 'Create report', (player)=>{
    let form = new ModalFormData();
    form.title('§aCreate Report')
    form.textField('Title', 'Player1 is hacking!', null)
    form.textField('Body', 'Explain more about the report', null)
    form.textField('Type', 'Report type', null)
    form.show(player).then((res) => {
        if(!res.formValues[0] || !res.formValues[1] || !res.formValues[2]) return player.error('Missing fields'), uiManager.open(player, config.uiNames.Reports.Dashboard)

        if(res.formValues[0].length > 15) return player.error('Title too long. Max: 15 characters'), uiManager.open(player, config.uiNames.Reports.Dashboard);

        Reports.create(res.formValues[0], res.formValues[1], res.formValues[2], player)
    })
})