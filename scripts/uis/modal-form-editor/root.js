import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import uiBuilder from "../../api/uiBuilder";
import { builderTabUI } from "../uiBuilder/root";

// builderTabUI.registerTab("\uE187 Modal UIs", (player)=>{
//     let buttons = [];
//     buttons.push({
//         text: "New Modal Form",
//         callback() {
//             uiManager.open(player, config.uiNames.Modal.Add)
//         }
//     })
//     for(const ui of uiBuilder.getModalUIs()) {
//         buttons.push({
//             text: `§a${ui.data.name}\n§7${ui.data.controls.length} ${ui.data.controls.length == 1 ? "control" : "controls"} (${ui.data.scriptevent})`,
//             callback() {
//                 uiManager.open(player, config.uiNames.Modal.Edit, ui.id)
//             }
//         })
//     }
//     return {
//         buttons
//     }
// })

uiManager.addUI(config.uiNames.Modal.Root, "rexy is bad", (player) => {
    return uiManager.open(player, config.uiNames.UIBuilderRoot);
    builderTabUI.open(player, 3);
    // let form = new ActionForm();
    // form.title("Modal Forms");
    // form.button("New Modal Form", null, (player)=>{
    //     uiManager.open(player, config.uiNames.Modal.Add)
    // })
    // for(const ui of uiBuilder.getModalUIs()) {
    //     form.button(`§a${ui.data.name}\n§7${ui.data.controls.length} ${ui.data.controls.length == 1 ? "control" : "controls"} (${ui.data.scriptevent})`, null, player=>{
    //         uiManager.open(player, config.uiNames.Modal.Edit, ui.id)
    //     })
    // }
    // form.show(player, false, (player, response)=>{

    // })
});
