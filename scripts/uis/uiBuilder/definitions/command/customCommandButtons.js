export default {
    extendEditButtons(actionForm, doc) {
        if(doc.data.type == 9) {
            actionForm.button(`§eEdit Commands\n§7Edit this command`, `textures/azalea_icons/other/page_edit`, (player)=>{
            
            })
        }
    }
}