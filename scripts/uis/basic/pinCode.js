import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import {
    NUT_UI_ALT,
    NUT_UI_DISABLE_VERTICAL_SIZE_KEY,
    NUT_UI_LEFT_HALF,
    NUT_UI_LEFT_THIRD,
    NUT_UI_MIDDLE_THIRD,
    NUT_UI_RIGHT_HALF,
    NUT_UI_RIGHT_THIRD,
    NUT_UI_TAG,
} from "../preset_browser/nutUIConsts";

uiManager.addUI(
    versionData.uiNames.Basic.PinCode,
    "Pin code",
    (player, inputs = [], callback) => {
        let form = new ActionForm();
        form.title(`${NUT_UI_TAG}§rPin`);
        form.button(
            `${NUT_UI_ALT}§r${inputs.map((_) => _.toString()).join("")}`,
            null,
            (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.Basic.PinCode,
                    inputs,
                    callback
                );
            }
        );
        function inputNumber(num) {
            if (inputs.length <= 6) {
                inputs.push(num);
                uiManager.open(
                    player,
                    versionData.uiNames.Basic.PinCode,
                    inputs,
                    callback
                );
            } else {
                uiManager.open(
                    player,
                    versionData.uiNames.Basic.PinCode,
                    inputs,
                    callback
                );
            }
        }
        form.button(
            `${
                inputs.length >= 6 ? "§p§3§0" : ""
            }${NUT_UI_LEFT_THIRD}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r1`,
            null,
            (player) => {
                inputNumber(1);
            }
        );
        form.button(
            `${
                inputs.length >= 6 ? "§p§3§0" : ""
            }${NUT_UI_MIDDLE_THIRD}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r2`,
            null,
            (player) => {
                inputNumber(2);
            }
        );
        form.button(
            `${inputs.length >= 6 ? "§p§3§0" : ""}${NUT_UI_RIGHT_THIRD}§r3`,
            null,
            (player) => {
                inputNumber(3);
            }
        );
        form.button(
            `${
                inputs.length >= 6 ? "§p§3§0" : ""
            }${NUT_UI_LEFT_THIRD}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r4`,
            null,
            (player) => {
                inputNumber(4);
            }
        );
        form.button(
            `${
                inputs.length >= 6 ? "§p§3§0" : ""
            }${NUT_UI_MIDDLE_THIRD}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r5`,
            null,
            (player) => {
                inputNumber(5);
            }
        );
        form.button(
            `${inputs.length >= 6 ? "§p§3§0" : ""}${NUT_UI_RIGHT_THIRD}§r6`,
            null,
            (player) => {
                inputNumber(6);
            }
        );
        form.button(
            `${inputs.length >= 6 ? "§p§3§0" : ""}${
                inputs.length >= 6 ? "§p§3§0" : ""
            }${NUT_UI_LEFT_THIRD}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r7`,
            null,
            (player) => {
                inputNumber(7);
            }
        );
        form.button(
            `${
                inputs.length >= 6 ? "§p§3§0" : ""
            }${NUT_UI_MIDDLE_THIRD}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r8`,
            null,
            (player) => {
                inputNumber(8);
            }
        );
        form.button(
            `${inputs.length >= 6 ? "§p§3§0" : ""}${NUT_UI_RIGHT_THIRD}§r9`,
            null,
            (player) => {
                inputNumber(9);
            }
        );
        form.button(
            `${
                inputs.length >= 6 ? "§p§3§0" : ""
            }${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}${NUT_UI_MIDDLE_THIRD}§r0`,
            null,
            (player) => {
                inputNumber(0);
            }
        );
        form.button(
            `${NUT_UI_LEFT_THIRD}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§rClear`,
            null,
            (player) => {
                inputs = [];
                return uiManager.open(
                    player,
                    versionData.uiNames.Basic.PinCode,
                    inputs,
                    callback
                );
            }
        );
        form.button(
            `${inputs.length < 4 ? "§p§3§0" : ""}${NUT_UI_RIGHT_THIRD}§rEnter`,
            null,
            (player) => {
                if (inputs.length < 4) {
                    return uiManager.open(
                        player,
                        versionData.uiNames.Basic.PinCode,
                        inputs,
                        callback
                    );
                }
                callback(inputs);
            }
        );
        form.show(player, false, (player, response) => {
            if (response.canceled) {
                return callback(null);
            }
        });
    }
);
