import uiBuilder from "../../../../api/uiBuilder";
import inviteMgrEditUIContents from "./inviteMgrEditUIContents";

uiBuilder.definitions.push({
    deftype: "ROOT",
    type: 11,
    name: "Invite",
    getName(doc) {
        return doc.data.name
    },
    ...inviteMgrEditUIContents,
    defaultIcon: "textures/azalea_icons/other/script_code"
})