import uiBuilder from "../../../../api/uiBuilder";
import customCommandButtons from "./customCommandButtons";

uiBuilder.definitions.push({
    deftype: "ROOT",
    type: 9,
    name: "Custom Command",
    getName(doc) {
        return doc.data.name
    },
    defaultIcon: "textures/azalea_icons/other/node",
    ...customCommandButtons
})