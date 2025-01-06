import chestUIBuilder from "../../api/chest/chestUIBuilder";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.ChestGuiEdit, "Edit Chest GUIs", (player, id)=>{
    let chest = chestUIBuilder.db.getByID(id);
    if(!chest) return uiManager.open(player, config.uiNames.ChestGuiRoot);
    let form = new ActionForm();
    form.title(`Edit (${chest.data.title}§r)`)
    form.body(`Scriptevent: ${chest.data.scriptevent}`)
    form.button("§eEdit Properties\n§r§7Edit title and more", icons.resolve("leaf/image-0910"), (player)=>{
        if(chest.data.advanced) {
            //player, defaultTitle = "", defaultScriptevent = "", defaultRows = 3, error = null, id = null
            uiManager.open(player, config.uiNames.ChestGuiAddAdvanced, chest.data.title, chest.data.scriptevent, chest.data.rows, null, chest.id);
        }
        uiManager.open(player, config.uiNames.ChestGuiAdd, chest.data.title, chest.data.scriptevent, chest.data.rows, null, chest.id);

    })
    form.button("§aEdit Items\n§r§7Edit all the items", icons.resolve("leaf/image-842"), (player)=>{
        uiManager.open(player, config.uiNames.ChestGuiEditItems, id)
    })
    form.button("§bEdit Icon\n§r§7Edit icon in the editor", icons.resolve("leaf/image-1063"), (player)=>{
        uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID)=>{
            if(iconID != null) {
                let chest = chestUIBuilder.db.getByID(id);
                chest.data.icon = iconID;
                chestUIBuilder.db.overwriteDataByID(chest.id, chest.data)
            }
            return uiManager.open(player, config.uiNames.ChestGuiRoot)
        })
    })
    form.button("§cDelete\n§7Delete this chest", icons.resolve("leaf/image-1289"), (player)=>{
        uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to delete this Chest GUI?", ()=>{
            chestUIBuilder.deleteChestGUI(chest.id);
            return uiManager.open(player, config.uiNames.ChestGuiRoot)    
        }, ()=>{
            return uiManager.open(player, config.uiNames.ChestGuiEdit, id);
        });
    })
    form.show(player, false, ()=>{})
})