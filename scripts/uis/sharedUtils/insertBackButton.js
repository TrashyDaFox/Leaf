import actionParser from "../../api/actionParser";
import { ActionForm } from "../../lib/form_func";
import { ActionForm as meow } from "../../lib/prismarinedb";
import { NUT_UI_HEADER_BUTTON } from "../preset_browser/nutUIConsts";

export function insertBackButton(form, backButton, usecherryui = true) {
    if (!(form instanceof ActionForm) && !(form instanceof meow)) return;
    if (!backButton) return;
    form.button(
        `${
            usecherryui ? NUT_UI_HEADER_BUTTON : ""
        }§r§cGo Back\n§7[ Click to Go Back ]`,
        `textures/azalea_icons/2`,
        (player) => {
            actionParser.runAction(player, backButton);
        }
    );
}
