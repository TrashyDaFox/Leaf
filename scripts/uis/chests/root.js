import chestUIBuilder from "../../api/chest/chestUIBuilder";
import icons from "../../api/icons";
import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
let icons2 = new Map([
    [1,"leaf/image-651"],
    [2,"leaf/image-1303"],
    [3,"leaf/image-1140"],
    [4,"leaf/image-751"],
    [5,"leaf/image-751"],
    [6,"leaf/image-0909"],
    [7,"leaf/image-0909"],
    [8,"leaf/image-0909"],
    [9,"leaf/image-0909"],
    [10,"leaf/image-0909"],
])
uiManager.addUI(config.uiNames.ChestGuiRoot, "Chest GUI Root", (player)=>{
    let chests = chestUIBuilder.db.findDocuments(null);
    let form = new ActionForm();
    form.button("§aCreate Chest GUI\n§r§7Add a Chest GUI", `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, config.uiNames.ChestGuiAdd);
    })
    form.button("§aCreate Advanced Chest GUI\n§r§7Javascript Chest GUI", `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, config.uiNames.ChestGuiAddAdvanced);
    })
    for(const chest of chests) {
        form.button(`§6${chest.data.title}\n§r§7${chest.data.rows} ${chest.data.rows > 1 ? "rows" : "row"}${chest.data.advanced ? " (Advanced)" : ""}`, chest.data.icon && icons.resolve(chest.data.icon) ? icons.resolve(chest.data.icon) : chest.data.advanced ? icons.resolve("leaf/image-0876") : icons.resolve(icons2.get(chest.data.rows)), (player)=>{
            uiManager.open(player, config.uiNames.ChestGuiEdit, chest.id);
        });
    }
    form.show(player, false, ()=>{})
})