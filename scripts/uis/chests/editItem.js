import chestUIBuilder from "../../api/chest/chestUIBuilder";
import common from "../../api/chest/common";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.ChestGuiEditItem, "Edit an item in a chest GUI", (player, id, index)=>{
    let chest = chestUIBuilder.db.getByID(id);
    if(!chest) return uiManager.open(player, config.uiNames.ChestGuiRoot);
    if(index < 0 || index >= chest.data.icons.length) return uiManager.open(player, config.uiNames.ChestGuiEditItems, id);
    let form = new ActionForm();
    //player, id, defaultItemName = "", defaultIconID = "", defaultIconLore = "", defaultAction = "", defaultAmount = 1, defaultRow = 1, defaultColumn = 1, error = "", index = -1
    form.button("§aEdit\n§7Edit properties of the item", icons.resolve("2.2/document"), (player)=>{
        if(chest.data.advanced) {
            uiManager.open(
                player,
                config.uiNames.ChestGuiAddItemAdvanced,
                id,
                0,
                0,
                chest.data.icons[index],
                index

            )
            return;
        }
        let [row,col] = common.slotIdToRowCol(chest.data.icons[index].slot);
        uiManager.open(
            player,
            config.uiNames.ChestGuiAddItem,
            id,
            row,
            col,
            index
        );
    });
    form.button("§nDelete\n§7Delete the item", icons.resolve("2.2/x"), (player)=>{
        chest.data.icons.splice(index, 1);
        chestUIBuilder.db.overwriteDataByID(chest.id, chest.data);
        uiManager.open(player, config.uiNames.ChestGuiEditItems, id);
    });
    form.show(player, false, ()=>{})
})