/*
once a file, full of features, now just an ancient left behind remnant. why did i abandon tab uis for cherryui?
either way, this was fucking usless

!uis command FTW!!!!!
*/

// import { builderTabUI } from './root';
// import { ModalForm } from "../../lib/form_func";
// import uiManager from "../../uiManager";

// builderTabUI.registerTab("\uE186 Leaf UIs", (player) => {
//     const buttons = [];
//     let uiList = uiManager.uis.slice().sort((a, b) => a.id.localeCompare(b.id));
    
//     // buttons.push({
//     //     text: "§bSearch\n§7Search through the list",
//     //     callback: (player) => {
//     //         let searchQueryForm = new ModalForm();
//     //         searchQueryForm.title("§7Search");
//     //         searchQueryForm.textField("§7Enter the search query", "example: tpa");
//     //         searchQueryForm.show(player, false, (player, response) => {
//     //             if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderList);
//     //             if(response.formValues[0]) {
//     //                 builderTabUI.open(player, 3)
//     //                 return;
//     //             }
//     //             builderTabUI.open(player, 3)
//     //         });
//     //     }
//     // });

//     for(const ui of uiList) {
//         if(!ui.ui) continue;
//         buttons.push({
//             text: `§e${ui.ui.length > 1 ? " §d" : ""}${ui.id}\n§7${ui.description ? ui.description : "No Description"}`,
//             callback: (player) => {
//                 if(ui.ui.length > 1) {
//                     uiManager.open(player, "confirmation", 
//                         "Are you sure you want to open this UI? It requires data to be passed to it, and might not work if you open it this way.",
//                         () => uiManager.open(player, ui.id),
//                         () => builderTabUI.open(player, 3)
//                     );
//                 } else {
//                     uiManager.open(player, ui.id);
//                 }
//             }
//         });
//     }

//     return {
//         buttons,
//         body: "§d* §7= §fThis UI requires data."
//     };
// });