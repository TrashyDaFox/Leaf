import sidebarEditor from "../../api/sidebarEditor";
import config from "../../config";
import uiManager from "../../uiManager";
import { ActionForm } from "../../lib/form_func";
import icons from "../../api/icons";
uiManager.addUI(config.uiNames.SidebarEditorRoot, "Sidebar editor root", (player)=>{
    let form = new ActionForm();
    form.button("§bSettings\n§r§7Edit sidebar settings", `textures/azalea_icons/Settings`, (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorSettings);
    });
    form.button("§aCreate a sidebar\n§r§7Creates a new sidebar", `textures/azalea_icons/1`, (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorAdd)
    });
    for(const sidebar of sidebarEditor.getSidebarNames()) {
        form.button(`§a${sidebar}\n§r§7${sidebarEditor.getLines(sidebar).length} line(s)`, icons.resolve("Packs/Asteroid/ui"), (player)=>{
            uiManager.open(player, config.uiNames.SidebarEditorEdit, sidebar);
        });
    }
    form.button("§bTrash\n§7View deleted sidebars", icons.resolve("Packs/Asteroid/garbage"), (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorTrash);
    })
    form.show(player, false, (player, response)=>{

    })
})