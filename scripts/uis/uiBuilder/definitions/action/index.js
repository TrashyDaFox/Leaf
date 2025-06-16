import uiBuilder from "../../../../api/uiBuilder";

uiBuilder.definitions.push({
    deftype: "ROOT",
    type: 0,
    name: "Action Form",
    getName(doc) {
        return doc.data.name
    },
    defaultIcon: "textures/azalea_icons/other/node"
})