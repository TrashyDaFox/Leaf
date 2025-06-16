import actionParser from "../../api/actionParser";
import icons from "../../api/icons";
import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import {
    NUT_UI_DISABLE_VERTICAL_SIZE_KEY,
    NUT_UI_LEFT_HALF,
    NUT_UI_RIGHT_HALF,
    NUT_UI_TAG,
} from "../preset_browser/nutUIConsts";
import { world } from "@minecraft/server";

uiManager.addUI(
    config.uiNames.Basic.Confirmation,
    "Basic Confirmation UI",
    (player, actionLabel, actionYes, actionNo) => {
        let form = new ActionForm();
        form.title(`${NUT_UI_TAG}§rConfirmation`);
        form.body(actionLabel);
        form.button(
            `${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r§aYes`,
            icons.resolve("^textures/ui/confirm"),
            (player) => {
                if (typeof actionYes === "function") {
                    actionYes(player);
                } else if (typeof actionYes === "string") {
                    actionParser.runAction(player, actionYes);
                }
            }
        );
        form.button(
            `${NUT_UI_LEFT_HALF}§r§cNo`,
            icons.resolve("^textures/ui/cancel"),
            (player) => {
                if (typeof actionNo === "function") {
                    actionNo(player);
                } else if (typeof actionNo === "string") {
                    // world.sendMessage(`Running`)
                    actionParser.runAction(player, actionNo);
                }
            }
        );
        form.show(player, false, (player, response) => {
            if (response.canceled) {
                if (typeof actionNo === "function") {
                    actionNo(player);
                } else if (typeof actionNo === "string") {
                    actionParser.runAction(player, actionNo);
                }
            }
        });
    }
);
