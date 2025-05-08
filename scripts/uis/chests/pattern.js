import uiBuilder from "../../api/uiBuilder";
import { ChestFormData } from "../../lib/chestUI";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import config from '../../versionData'

uiManager.addUI(versionData.uiNames.ChestGuiEditPattern, "Edit Pattern", (player, id)=>{
    let chest = uiBuilder.db.getByID(id);
    if(!chest) return uiManager.open(player, config.uiNames.ChestGuiRoot);
    if(chest.data.type !== 4) return uiManager.open(player, config.uiNames.ChestGuiRoot);
    let form = new ChestFormData((Math.min(chest.data.rows * 9, 6 * 9)).toString());
    form.title(`Edit (${chest.data.title}§r) - Pattern`)
    if(!chest.data.patterns) chest.data.patterns = [];
    for(let i = 0;i < (chest.data.rows * 9);i++) {
        let pattern = chest.data.patterns.find(_=>_[0]==i);
        let icon = null;
        if(pattern) icon = uiBuilder.patternIDs[pattern[1]].dispTexture ? uiBuilder.patternIDs[pattern[1]].dispTexture : uiBuilder.patternIDs[pattern[1]].texture
        form.button(i, `§b[+] Add Pattern Here`, [`Click to add a pattern here`], icon, 1, false, ()=>{
            uiManager.open(player, config.uiNames.ChestGuiPatternSelect, (patternID)=>{
                if(patternID != null) {
                    uiBuilder.setPatternSlot(chest.id, i, patternID)
                }
                uiManager.open(player, config.uiNames.ChestGuiEditPattern, id)
            })
        })
    }
    //player, id, defaultItemName = "", defaultIconID = "", defaultIconLore = "", defaultAction = "", defaultAmount = 1, defaultRow = 1, defaultColumn = 1, error = "", index = -1
    form.show(player).then(res=>{
        if(res.canceled) return uiManager.open(player, config.uiNames.UIBuilderEdit, id)
    })
})

uiManager.addUI(versionData.uiNames.ChestGuiPatternSelect, "meow", (player, callback)=>{
    let form = new ActionForm();
    form.title(`Select Pattern`)
    for(let i = 0; i < uiBuilder.patternIDs.length; i++) {
        let pattern = uiBuilder.patternIDs[i];
        form.button(pattern.name, pattern.dispTexture ? pattern.dispTexture : pattern.texture, (player)=>{
            callback(i)
        })
    }
    form.show(player, false, (player, response)=>{
        if(response.canceled) return callback(null)
    })
})