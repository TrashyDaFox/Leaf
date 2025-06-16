import config from "../../versionData";
import uiManager from "../../uiManager";
import { ActionForm } from "../../lib/form_func";
import icons from "../../api/icons";
import OpenClanAPI from "../../api/OpenClanAPI";
import playerStorage from "../../api/playerStorage";
import configAPI from "../../api/config/configAPI";
import "./extra.js";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts.js";
import { colors } from "../../lib/prismarinedb.js";
uiManager.addUI(config.uiNames.Clans.Root, "Clans Root", (player) => {
    if (!configAPI.getProperty("Clans"))
        return player.sendMessage("Clans are not enabled");
    if(!(player.hasTag("disable-new-clans-ui") && configAPI.getProperty("DevMode")))
        return player.runCommand("scriptevent leaf:open leaf/clans")
    let clanBaseEnabled = configAPI.getProperty("clans:enable_clan_base");
    let form = new ActionForm();
    form.title(`${NUT_UI_TAG}§rClans`);
    let clan = OpenClanAPI.getClan(player);
    form.button(
        `§dClan Invites\n§7View invites to clans`,
        `textures/amethyst_icons/Utilities/envelope`,
        (player) => {
            uiManager.open(player, config.uiNames.Clans.ViewInvites);
        }
    );
    if (!clan) {
        form.button(
            "§aCreate Clan\n§7Create a clan",
            icons.resolve("leaf/image-740"),
            (player) => {
                uiManager.open(player, config.uiNames.Clans.Create);
            }
        );
    } else {
        let clanNameNew = clan.data.name;
        for (const colorCode of colors.getColorCodes()) {
            clanNameNew = clanNameNew.replaceAll(colorCode, "");
        }
        let isClanOwner = clan.data.owner == playerStorage.getID(player);
        form.title(`${NUT_UI_TAG}§r${clanNameNew}`);
        form.button(
            `§bEnter/leave clan chat\n§7${
                player.hasTag("clan-chat") ? "Click to leave" : "Click to enter"
            }`,
            icons.resolve(`leaf/image-631`),
            (player) => {
                if (player.hasTag("clan-chat")) player.removeTag("clan-chat");
                else player.addTag("clan-chat");
            }
        );
        form.button(
            `§eClan Members\n§7Clan members`,
            icons.resolve(`leaf/image-483`),
            (player) => {
                uiManager.open(
                    player,
                    config.uiNames.Clans.ClanMembers,
                    clan.id
                );
            }
        );

        if (isClanOwner) {
            form.button(
                `§dInvite to clan\n§7Invite people to your clan`,
                icons.resolve(`leaf/image-517`),
                (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.Clans.Invite,
                        clan.id
                    );
                }
            );
            if (clanBaseEnabled) {
                form.button(
                    `§aSet clan base\n§7Set the clan base`,
                    icons.resolve(`leaf/image-480`),
                    (player) => {
                        player.success(
                            `Set clan base to §bX: ${Math.floor(
                                player.location.x
                            )}, Y: ${Math.floor(
                                player.location.y
                            )}, Z: ${Math.floor(player.location.z)}`
                        );
                        player.playSound("note.pling");
                        uiManager.open(player, config.uiNames.Clans.Root);
                        OpenClanAPI.setClanBase(clan.id, player.location);
                    }
                );
            }
        }
        if (clan.data.settings.clanBase && clanBaseEnabled) {
            form.button(
                `§6Go to clan base\n§7Teleport to the clan base`,
                icons.resolve(`leaf/image-521`),
                (player) => {
                    player.teleport(clan.data.settings.clanBase);
                    player.playSound("mob.shulker.teleport");
                }
            );
        }
        if (isClanOwner) {
            form.button(
                `§cDisband\n§7Delete this clan`,
                `textures/blocks/barrier`,
                (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.Basic.Confirmation,
                        "Are you sure you want to disband your clan?",
                        () => {
                            OpenClanAPI.disbandClan(clan.id);
                            uiManager.open(player, config.uiNames.Clans.Root);
                        },
                        () => {
                            uiManager.open(player, config.uiNames.Clans.Root);
                        }
                    );
                }
            );
        } else {
            form.button(
                `§cLeave\n§7Leave this clan`,
                `textures/blocks/barrier`,
                (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.Basic.Confirmation,
                        "Are you sure you want to leave this clan?",
                        () => {
                            OpenClanAPI.kickMemberFromClan(
                                clan.id,
                                playerStorage.getID(player)
                            );
                            uiManager.open(player, config.uiNames.Clans.Root);
                        },
                        () => {
                            uiManager.open(player, config.uiNames.Clans.Root);
                        }
                    );
                }
            );
        }
    }
    form.show(player, false, (player, response) => {});
});
