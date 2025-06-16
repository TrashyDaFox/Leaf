import configAPI from "../../api/config/configAPI";
import { ModalForm } from "../../lib/form_func";
import { colors, prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_MODAL } from "../preset_browser/nutUIConsts";

uiManager.addUI(versionData.uiNames.ChatRanks.Config, "a", (player) => {
    let modalForm = new ModalForm();
    modalForm.title(`${NUT_UI_MODAL}Chat ranks config`);
    modalForm.textField(
        "Default Rank",
        "Member",
        configAPI.getProperty("DefaultRank")
    );
    // modalForm.textField("Default Name Color", "Member", configAPI.getProperty("DefaultRank"))
    modalForm.dropdown(
        "Default Name Color",
        colors.getColorNamesColored().map((_) => {
            return { option: _ };
        }),
        Math.max(
            0,
            colors
                .getColorCodes()
                .indexOf(configAPI.getProperty("DefaultNameColor"))
        )
    );
    modalForm.dropdown(
        "Default Bracket Color",
        colors.getColorNamesColored().map((_) => {
            return { option: _ };
        }),
        Math.max(
            0,
            colors
                .getColorCodes()
                .indexOf(configAPI.getProperty("DefaultBracketColor"))
        )
    );
    modalForm.dropdown(
        "Default Message Color",
        colors.getColorNamesColored().map((_) => {
            return { option: _ };
        }),
        Math.max(
            0,
            colors
                .getColorCodes()
                .indexOf(configAPI.getProperty("DefaultMessageColor"))
        )
    );
    modalForm.show(player, false, (player, response) => {
        if (response.canceled)
            return uiManager.open(player, versionData.uiNames.ChatRanks.Main);
        configAPI.setProperty("DefaultRank", response.formValues[0]);
        configAPI.setProperty(
            "DefaultNameColor",
            colors.getColorCodes()[response.formValues[1]]
        );
        configAPI.setProperty(
            "DefaultBracketColor",
            colors.getColorCodes()[response.formValues[2]]
        );
        configAPI.setProperty(
            "DefaultMessageColor",
            colors.getColorCodes()[response.formValues[3]]
        );
        return uiManager.open(player, versionData.uiNames.ChatRanks.Main);
    });
});
