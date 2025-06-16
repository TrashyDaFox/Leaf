import uiBuilder from "../../../../api/uiBuilder";
import scriptEditUiContents from "./scriptEditUiContents";

uiBuilder.definitions.push({
    deftype: "ROOT",
    type: 8,
    name: "Script",
    getName(doc) {
        return doc.data.name
    },
    ...scriptEditUiContents,
    defaultIcon: "textures/azalea_icons/other/script_code"
})