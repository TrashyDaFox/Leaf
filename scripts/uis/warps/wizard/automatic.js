import uiBuilder from "../../../api/uiBuilder";
import { ModalForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";

uiManager.addUI(versionData.uiNames.Warps.Wizard.Automatic, "", (player) => {
    let loc = player.location;
    /*
    seriously, why the fuck did mojang make player.getRotation() a function?!
    like, its not an unreasonable way to do it
    but for location its just "player.location"
    WHY IS IT SO INCONSISTENT?
    PLAYER.ROTATION WOULD HAVE BEEN FINE
    */
    let rot = player.getRotation();
    let modal = new ModalForm();
    modal.textField("Name", "Name of your warp", "", () => {});
    modal.toggle(
        "Preserve Rotation",
        false,
        () => {},
        "Store where you are facing in a warp. useful if u want people to look in a specific direction when teleporting :3"
    );
    modal.submitButton("Create Warp");
    modal.show(player, false, (player, response) => {
        uiBuilder.createWarp(
            response.formValues[0],
            loc,
            response.formValues[1] ? rot : null,
            player.dimension
        );
        uiManager.open(player, versionData.uiNames.UIBuilderRoot);
    });
});
