import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
function parseItemID(id) {
    let text = id.split(':')[1];
    return text.split('_').map(_=>`${_[0].toUpperCase()}${_.substring(1)}`).join(' ');
}
uiManager.addUI(config.uiNames.Basic.ItemSelect, "Item selector", (player, callback)=>{
    let inv = player.getComponent('inventory');
    let items = [];
    for(let i = 0;i < inv.container.size;i++) {
        if(inv.container.getItem(i)) items.push([inv.container.getItem(i), i])
    }
    let form = new ActionForm();
    form.button("§cBack\n§7Go back", `textures/blocks/barrier`, (player)=>{
        callback(player, null);
    })
    for(const item of items) {
        form.button(`§b${item[0].nameTag ? item[0].nameTag : parseItemID(item[0].typeId)} x${item[0].amount}\n§7${item[0].typeId}`, null, (player)=>{
            callback(player, item[0], item[1]);
        })
    }
    form.show(player, false, (player)=>{
        
    })
})