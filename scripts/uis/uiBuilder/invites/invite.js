import { world } from "@minecraft/server";
import { ModalForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";
import uiBuilder from "../../../api/uiBuilder";
import actionParser from "../../../api/actionParser";

uiManager.addUI(
    versionData.uiNames.InviteManager.Invite,
    "",
    (player, invite_name, leaveAction) => {
        let modalForm = new ModalForm();
        let players = world.getPlayers().filter((_) => {
            return _.id != player.id;
        });
        if (!players.length) {
            player.error("No players to choose from!");
            if(leaveAction) return actionParser.runAction(player, leaveAction);
        }
        modalForm.dropdown(
            "Select a player",
            players.map((_) => {
                return {
                    option: _.name,
                    callback() {},
                };
            })
        );
        modalForm.show(player, false, (player, response) => {
            if (response.canceled)
                return actionParser.runAction(player, leaveAction);
            uiBuilder.inviteCMD(
                {},
                "send",
                invite_name,
                player,
                players[response.formValues[0]]
            );
            if(leaveAction) return actionParser.runAction(player, leaveAction);
        });
    }
);
