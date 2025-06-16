import configAPI from "../../api/config/configAPI";
import landclaims from "../../api/landclaims/landclaims";
import playerStorage from "../../api/playerStorage";
import zones from "../../api/zones";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import {
    NUT_UI_HEADER_BUTTON,
    NUT_UI_TAG,
} from "../preset_browser/nutUIConsts";

let locMap = new Map();
uiManager.addUI(
    versionData.uiNames.LandClaims.ManageClaim,
    "Manage claim",
    async (player, claimID) => {
        let id = await playerStorage.getIDAsync(player);
        let claims = landclaims.db.findDocuments({ type: "CLAIM", owner: id });
        let form = new ActionForm();
        let claim = landclaims.db.getByID(claimID);
        if (!claim) return;
        form.title(`${NUT_UI_TAG}§r${claim.data.name}`);
        form.button(
            `${NUT_UI_HEADER_BUTTON}§r§cGo back`,
            `textures/azalea_icons/2`,
            (player) => {
                uiManager.open(player, versionData.uiNames.Manage);
            }
        );
        form.button(
            `§cUnclaim\n§7Unclaim this land`,
            `textures/azalea_icons/Delete`,
            (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.Basic.Confirmation,
                    "Are you sure you want to unclaim this land?",
                    async () => {
                        let res = await landclaims.unclaim(claimID);
                        if (res == 0) player.error("Claim does not exist");
                        if (res == 1) player.error("Land claims are disabled");
                        if (res >= 100) {
                            player.success(
                                `Successfully unclaimed land claim and you were refunded $${
                                    res - 100
                                }`
                            );
                        }
                        uiManager.open(
                            player,
                            versionData.uiNames.LandClaims.Root
                        );
                    },
                    () => {
                        uiManager.open(
                            player,
                            versionData.uiNames.LandClaims.ManageClaim,
                            claimID
                        );
                    }
                );
            }
        );
        form.button(
            `§aAdd Player\n§7Add a player that can do things in your claim`,
            null,
            (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.Basic.PlayerSelector,
                    "",
                    (playerID) => {
                        if (!claim.data.allowedPlayers)
                            claim.data.allowedPlayers = [];
                        claim.data.allowedPlayers.push(playerID);
                        landclaims.db.overwriteDataByID(claim.id, claim.data);
                        uiManager.open(
                            player,
                            versionData.uiNames.LandClaims.ManageClaim,
                            claimID
                        );
                    },
                    [
                        (id) => {
                            return !(
                                claim.data.allowedPlayers &&
                                claim.data.allowedPlayers.includes(id)
                            );
                        },
                    ],
                    "Add Player"
                );
            }
        );
        form.button(
            `§eEdit Flags\n§7Edit what normal people can do in this claim`,
            null,
            (player) => {
                let flagsUI = new ModalForm();
                flagsUI.title(`Flags`);
                for (const flag of zones.flags) {
                    flagsUI.toggle(`${flag}`, claim.data.flags.includes(flag));
                }
                flagsUI.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.LandClaims.ManageClaim,
                            claimID
                        );
                    let newFlags = [];
                    for (let i = 0; i < response.formValues.length; i++) {
                        if (response.formValues[i])
                            newFlags.push(zones.flags[i]);
                    }
                    claim.data.flags = newFlags;
                    landclaims.db.overwriteDataByID(claim.id, claim.data);
                    uiManager.open(
                        player,
                        versionData.uiNames.LandClaims.ManageClaim,
                        claimID
                    );
                });
            }
        );
        form.button(`§dEdit Name\n§7Edit name of claim`, null, (player) => {
            let modal = new ModalForm();
            modal.textField(
                "Claim Name (18 characters max)",
                `${claim.data.name}`,
                claim.data.name
            );
            modal.show(player, false, (player, response) => {
                if (response.canceled)
                    return uiManager.open(
                        player,
                        versionData.uiNames.LandClaims.ManageClaim,
                        claimID
                    );
                claim.data.name = response.formValues[0].slice(0, 18);
                landclaims.db.overwriteDataByID(claim.id, claim.data);
                uiManager.open(
                    player,
                    versionData.uiNames.LandClaims.ManageClaim,
                    claimID
                );
            });
        });
        if (claim.data.allowedPlayers && claim.data.allowedPlayers.length) {
            for (const allowedPlayer of claim.data.allowedPlayers) {
                if (typeof allowedPlayer != "string") continue;
                let playerData = playerStorage.getPlayerByID(allowedPlayer);
                form.button(
                    `§c${playerData.name}\n§7[ Click to Remove Player ]`,
                    null,
                    (player) => {
                        claim.data.allowedPlayers =
                            claim.data.allowedPlayers.filter(
                                (_) => _ != allowedPlayer
                            );
                        landclaims.db.overwriteDataByID(claim.id, claim.data);
                        uiManager.open(
                            player,
                            versionData.uiNames.LandClaims.ManageClaim,
                            claimID
                        );
                    }
                );
            }
        }
        form.show(player, false, (player, response) => {});
    }
);
uiManager.addUI(
    versionData.uiNames.LandClaims.Manage,
    "Manage",
    async (player, admin = false) => {
        let id = await playerStorage.getIDAsync(player);
        let claims = admin
            ? landclaims.db.findDocuments({ type: "CLAIM" })
            : landclaims.db.findDocuments({ type: "CLAIM", owner: id });
        let form = new ActionForm();
        form.title(`${NUT_UI_TAG}§rLand Claims`);
        form.button(
            `${NUT_UI_HEADER_BUTTON}§r§cGo Back`,
            `textures/azalea_icons/2`,
            (player) => {
                uiManager.open(player, versionData.uiNames.LandClaims.Root);
            }
        );
        for (const claim of claims) {
            form.button(`§r§d${claim.data.name}`, null, (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.LandClaims.ManageClaim,
                    claim.id
                );
            });
        }
        form.show(player, false, (player, response) => {});
    }
);

/*
configAPI.registerProperty("LandClaimsBasePrice", configAPI.Types.Number, 100)
configAPI.registerProperty("LandClaimsRegionPrice", configAPI.Types.Number, 25)
configAPI.registerProperty("LandClaimsIncreasingPrice", configAPI.Types.Number, 10)
configAPI.registerProperty("LandClaimsIncreasingPriceGrowthFactor", configAPI.Types.Number, 1.2)
configAPI.registerProperty("LandClaimsCurrency", configAPI.Types.String, "default")
configAPI.registerProperty("LandClaimsRefundPercent", configAPI.Types.Number, 100)
configAPI.registerProperty("LandClaimsMaxArea", configAPI.Types.Number, 10000)
configAPI.registerProperty("LandClaimsRegionSize", configAPI.Types.Number, 12)
*/

function getNum(str) {
    let num = parseFloat(str);
    if (isNaN(num)) return 0;
    return num;
}

uiManager.addUI(versionData.uiNames.LandClaims.Configure, "a", (player) => {
    let modalForm = new ModalForm();
    modalForm.title("Land claims settings");
    modalForm.label(
        `§bNOTE: If you dont understand these settings, please just leave them as default.`
    );
    modalForm.toggle(
        `Land Claims Enabled?`,
        configAPI.getProperty("LandClaims")
    );
    modalForm.textField(
        "Base Price",
        `100`,
        configAPI.getProperty("LandClaimsBasePrice").toString(),
        () => {},
        "The minimum price for land claims. All extra things will increase this price"
    );
    modalForm.textField(
        "Region Price",
        `25`,
        configAPI.getProperty("LandClaimsRegionPrice").toString(),
        () => {},
        "The price for 12x12 regions outside of the first 12x12 area (the 12x12 area can be changed to a 32x32 area for example)"
    );
    modalForm.textField(
        "Increasing Price (Grow price as player gets more claims)",
        `10`,
        configAPI.getProperty("LandClaimsIncreasingPrice").toString(),
        () => {},
        "The base price for having more than one land claim. This price will increase by the growth factor"
    );
    modalForm.textField(
        "Increasing Price Growth Factor (Grow increasing price as player gets more claims)",
        `1.2`,
        configAPI
            .getProperty("LandClaimsIncreasingPriceGrowthFactor")
            .toString(),
        () => {},
        "The growth factor for increasing price. Set to 1 to disable"
    );
    let currencies = prismarineDb.economy.getCurrencies();
    modalForm.dropdown(
        "Currency",
        currencies.map((_) => {
            return {
                option: `${_.symbol} ${_.displayName}`,
                callback() {},
            };
        }),
        0,
        () => {},
        "The currency that the player pays in for claims."
    );
    modalForm.textField(
        "Refund Percent (refund player when they unclaim their land)",
        `100`,
        configAPI.getProperty("LandClaimsRefundPercent").toString(),
        () => {},
        "When players unclaim their land, it gives x% of the money they paid to claim."
    );
    modalForm.textField(
        "Max Area (Area = Claim Width * Claim height)",
        `20000`,
        configAPI.getProperty("LandClaimsMaxArea").toString(),
        () => {},
        "The max area of the claim. The area is Claim Width multiplied by Claim Height"
    );
    modalForm.textField(
        "Region Size (The threshold of the price increasing for larger claims)",
        `12`,
        configAPI.getProperty("LandClaimsRegionSize").toString(),
        () => {},
        "The region size for claims, to increase price based on claim size"
    );
    modalForm.show(player, false, (player, response) => {
        if (response.canceled)
            return uiManager.open(player, versionData.uiNames.ConfigMain);
        configAPI.setProperty("LandClaims", response.formValues[1]);
        configAPI.setProperty(
            "LandClaimsBasePrice",
            getNum(response.formValues[2])
        );
        configAPI.setProperty(
            "LandClaimsRegionPrice",
            getNum(response.formValues[3])
        );
        configAPI.setProperty(
            "LandClaimsIncreasingPrice",
            getNum(response.formValues[4])
        );
        configAPI.setProperty(
            "LandClaimsIncreasingPriceGrowthFactor",
            getNum(response.formValues[5])
        );
        configAPI.setProperty(
            "LandClaimsCurrency",
            currencies[response.formValues[6]].scoreboard
        );
        configAPI.setProperty(
            "LandClaimsRefundPercent",
            getNum(response.formValues[7])
        );
        configAPI.setProperty(
            "LandClaimsMaxArea",
            getNum(response.formValues[8])
        );
        configAPI.setProperty(
            "LandClaimsRegionSize",
            getNum(response.formValues[9])
        );

        return uiManager.open(player, versionData.uiNames.ConfigMain);
    });
});

uiManager.addUI(
    versionData.uiNames.LandClaims.Root,
    "Land CLaims",
    async (player) => {
        if (!configAPI.getProperty("LandClaims"))
            return player.error("Land claims are disabled");
        let form = new ActionForm();
        form.title(`${NUT_UI_TAG}§rLand Claims`);
        if (!locMap.has(player.id)) locMap.set(player.id, {});
        let playerLocs = locMap.get(player.id);
        let disableAll = landclaims.isInClaim(player.location);
        let disablePos1 = disableAll || playerLocs.pos1;
        let disablePos2 = disableAll || playerLocs.pos2;
        form.button(
            `§eManage Land Claims\n§7Manage your land claims`,
            null,
            (player) => {
                uiManager.open(player, versionData.uiNames.LandClaims.Manage);
            }
        );
        if (
            prismarineDb.permissions.hasPermission(player, "landclaims.manage")
        ) {
            form.button(
                `§eAdmin: Manage Land Claims\n§7Manage all land claims`,
                null,
                (player) => {
                    uiManager.open(
                        player,
                        versionData.uiNames.LandClaims.Manage,
                        true
                    );
                }
            );
            let zone = zones.getZoneAtVec3(player.location);
            if (zone && zone.data.type == "CLAIM") {
                form.button(
                    `§eAdmin: Unclaim Current\n§7Unclaim land claim that you are in`,
                    null,
                    (player) => {
                        uiManager.open(
                            player,
                            versionData.uiNames.Basic.Confirmation,
                            "Are you sure you want to unclaim this?",
                            async () => {
                                let res = await landclaims.unclaim(zone.id);
                                player.success(
                                    `Removed land claim and refunded ${
                                        res >= 100 ? `$${res - 100}` : `$0`
                                    } to the owner`
                                );
                                locMap.delete(player.id);
                                uiManager.open(
                                    player,
                                    versionData.uiNames.LandClaims.Root
                                );
                            },
                            () => {
                                uiManager.open(
                                    player,
                                    versionData.uiNames.LandClaims.Root
                                );
                            }
                        );
                    }
                );
            }
        }
        form.button(
            `§cClear Locations\n§7Clear locations`,
            `textures/azalea_icons/Delete`,
            (player) => {
                locMap.delete(player.id);
                uiManager.open(player, versionData.uiNames.LandClaims.Root);
            }
        );
        form.button(
            `${
                disablePos1 ? `§p§3§0` : ``
            }§r§aSet position 1\n§7Set position 1 of the claim area`,
            null,
            (player) => {
                if (disablePos1) return;
                playerLocs.pos1 = player.location;
                locMap.set(player.id, playerLocs);
                if (playerLocs.pos1 && playerLocs.pos2) {
                    uiManager.open(player, versionData.uiNames.LandClaims.Root);
                } else {
                    player.success(
                        `Set position 1! Now go to position 2 and set position 2`
                    );
                }
            }
        );
        form.button(
            `${
                disablePos2 ? `§p§3§0` : ``
            }§r§aSet position 2\n§7Set position 2 of the claim area`,
            null,
            (player) => {
                if (disablePos2) return;
                playerLocs.pos2 = player.location;
                locMap.set(player.id, playerLocs);
                if (playerLocs.pos2 && playerLocs.pos2) {
                    uiManager.open(player, versionData.uiNames.LandClaims.Root);
                } else {
                    player.success(
                        `Set position 1! Now go to position 2 and set position 2`
                    );
                }
            }
        );
        if (playerLocs.pos2 && playerLocs.pos1) {
            let price = await landclaims.getClaimPrice(
                player,
                playerLocs.pos1,
                playerLocs.pos2
            );
            let currency = configAPI.getProperty("LandClaimsCurrency");
            let currencyData = prismarineDb.economy.getCurrency(currency);
            form.button(
                `§aCreate\n§7${currencyData.symbol} ${price}`,
                null,
                (player) => {
                    uiManager.open(
                        player,
                        versionData.uiNames.Basic.Confirmation,
                        `Are you sure you want to create this claim for ${currencyData.symbol} ${price}?`,
                        async () => {
                            let res = await landclaims.claim(
                                `${player.name}'s Claim`,
                                player,
                                playerLocs.pos1,
                                playerLocs.pos2
                            );
                            let error =
                                res == 3
                                    ? "Land claim is too big!"
                                    : res == 1
                                    ? "Owner is not player."
                                    : res == 2
                                    ? "You dont have enough money to create this claim"
                                    : res == 4
                                    ? "Land claims are disabled"
                                    : "";
                            if (error) {
                                player.error(error);
                                player.playSound("random.glass");
                                uiManager.open(
                                    player,
                                    versionData.uiNames.LandClaims.Root
                                );
                            } else {
                                player.success(`Created land claim!`);
                            }
                        }
                    );
                }
            );
        }
        form.show(player, false, (player, response) => {});
    }
);
