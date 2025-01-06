import config from "../../config";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI(config.uiNames.ConfigCredits, "Credits", (player)=>{
    let form = new ActionForm();
    // form.button("§dTheLegendaryTrashCan\n§7Main Developer", `textures/minidevs/trash2024`, (player)=>{
    form.button("§dTrashyKitty\n§7Main Developer", `textures/minidevs/TrashyKitty`, (player)=>{
        uiManager.open(player, config.uiNames.ConfigRoot);
    })
    form.button("§eFruitKitty\n§7Helper dev and co-founder", `textures/minidevs/FruitKitty`, (player)=>{
        uiManager.open(player, config.uiNames.ConfigRoot);
    })
    form.button("§aXdNikhilLoL\n§7Emotional support", `textures/minidevs/XdNikhilLoL`, (player)=>{
        uiManager.open(player, config.uiNames.ConfigRoot);
    })
    form.button("§5Quxioo\n§7leaf butt plug user", `textures/minidevs/danser`, (player)=>{
        uiManager.open(player, config.uiNames.ConfigRoot);
    })
    form.button("§bmy dog\n§7shes extremely cute :3", `textures/leaf_icons/image-433`, (player)=>{
        uiManager.open(player, config.uiNames.ConfigRoot);
    })
    // form.button("§aRexy Cloudy\n§7Fortnite balls", `textures/minidevs/icon`, (player)=>{
    //     uiManager.open(player, config.uiNames.ConfigRoot);
    // })
    form.button("tbh rexy is kinda gay\n§7frfr (rexy is a tool)", `textures/items/settings`, (player)=>{
        uiManager.open(player, config.uiNames.ConfigRoot);
    })
    form.show(player, false, ()=>{})
})