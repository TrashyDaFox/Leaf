import config from "../../versionData";
import leaderboardHandler from "../../leaderboardHandler";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { NUT_UI_HEADER_BUTTON, NUT_UI_MODAL, NUT_UI_TAG } from "../preset_browser/nutUIConsts";
import versionData from "../../versionData";
import { world } from "@minecraft/server";

uiManager.addUI(
    config.uiNames.Leaderboards.Edit,
    "Leaderboards Edit",
    (player, id) => {
        let lb = leaderboardHandler.db.getByID(id);
        let formSquared = new ActionForm();
        formSquared.title(`${NUT_UI_TAG}Drinkin' "tittyy milk" rn meow`);
        formSquared.button(`${NUT_UI_HEADER_BUTTON}§r§cGo Back\n§7AAAAAAAAAAAAAAAAAAAAA`, `textures/azalea_icons/2`, (player)=>{
            uiManager.open(player, versionData.uiNames.Leaderboards.Root)
        })
        formSquared.button(`edit settings lol uwu meow`, null, (player) => {
            let form = new ModalForm();
            form.title(`${NUT_UI_MODAL}§r§fEdit Leaderboard`)
            form.toggle("Show Offline Players", lb.data.showOffline);
            form.textField(
                "Display Name",
                "Type lb display name",
                lb.data.displayName ? lb.data.displayName : ""
            );
            form.slider(
                "Max Players",
                1,
                20,
                1,
                lb.data.maxPlayers ? lb.data.maxPlayers : 10
            );
            form.toggle(
                "Force Disable Currency Display",
                lb.data.disableCurrency ? lb.data.disableCurrency : false
            );
            form.dropdown(
                "Theme",
                leaderboardHandler.themes.map((_) => {
                    return {
                        option: _.name,
                        callback() {},
                    };
                }),
                lb.data.theme ? lb.data.theme : 0
            );
            form.toggle("Disable Ranks", lb.data.disableRanks ? true : false);
            form.toggle("Abbreviate", lb.data.abbreviate ? true : false);
            form.textField("Title Format", "Override the title", lb.data.tf ? lb.data.tf : "", ()=>{})
            form.textField("List Format", "Override the player list", lb.data.lf ? lb.data.lf : "", ()=>{})
            form.show(player, false, (player, response) => {
                if (response.canceled)
                    return uiManager.open(
                        player,
                        config.uiNames.Leaderboards.Root
                    );
                lb.data.showOffline = response.formValues[0];
                lb.data.displayName = response.formValues[1];
                lb.data.maxPlayers = response.formValues[2];
                lb.data.disableCurrency = response.formValues[3];
                lb.data.theme = response.formValues[4];
                lb.data.disableRanks = response.formValues[5];
                lb.data.abbreviate = response.formValues[6];
                lb.data.tf = response.formValues[7];
                lb.data.lf = response.formValues[8];
                leaderboardHandler.db.overwriteDataByID(lb.id, lb.data);
                uiManager.open(player, config.uiNames.Leaderboards.Root);

                return;
            });
        });
        formSquared.button("delete", `textures/azalea_icons/Delete`, (player) => {
            uiManager.open(
                player,
                versionData.uiNames.Basic.Confirmation,
                "Are you sure you want to delete this leaderboard?",
                () => {
                    leaderboardHandler.db.deleteDocumentByID(lb.id);
                    let dimension = world.getDimension(
                        lb.data.dimension ? lb.data.dimension : "overworld"
                    );
                    let entities = dimension.getEntities({
                        tags: [`lbid:${lb.id}`],
                        type: "leaf:floating_text",
                    });
                    if (entities && entities.length)
                        entities[0].remove();
                    uiManager.open(player, config.uiNames.Leaderboards.Root);
                },
                () => {
                    player.error("Frick you beach");
                    uiManager.open(player, config.uiNames.Leaderboards.Root);
                }
            );

        })
        formSquared.button("move n shake that asss uwu", null, (player) => {
            uiManager.open(
                player,
                versionData.uiNames.Basic.Confirmation,
                "Move this leaderboard to where u are currently? im so high uwu meow mrrp nya mrrp uwu",
                () => {
                    lb.data.loc = player.location;
                    lb.data.dimension = player.dimension.id;
                    leaderboardHandler.db.overwriteDataByID(lb.id, lb.data);
                    let dimension = world.getDimension(
                        lb.data.dimension ? lb.data.dimension : "overworld"
                    );
                    let entities = dimension.getEntities({
                        tags: [`lbid:${lb.id}`],
                        type: "leaf:floating_text",
                    });
                    if (entities && entities.length)
                        entities[0].teleport(player.location, {
                            dimension: player.dimension,
                        });
                    uiManager.open(player, config.uiNames.Leaderboards.Root);
                },
                () => {
                    player.error("Frick you beach");
                    uiManager.open(player, config.uiNames.Leaderboards.Root);
                }
            );
        });
        formSquared.show(player, false, () => {});
    }
);
