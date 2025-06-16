import { ItemTypes } from "@minecraft/server";
import auctionhouse from "../../api/AH/auctionhouse";
import configAPI from "../../api/config/configAPI";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import {
    NUT_UI_HEADER_BUTTON,
    NUT_UI_TAG,
} from "../preset_browser/nutUIConsts";

configAPI.registerProperty("AuctionLimit", configAPI.Types.Number, 15);

uiManager.addUI(
    versionData.uiNames.AuctionHouse.Settings.Root,
    "Yes",
    (player) => {
        let form = new ActionForm();
        form.title(`${NUT_UI_TAG}§rAuction House Settings`);
        form.button(
            `${NUT_UI_HEADER_BUTTON}§r§cGo Back`,
            `textures/azalea_icons/2`,
            (player) => {
                uiManager.open(player, versionData.uiNames.Config.Misc);
            }
        );
        form.button(
            `§cItem Blacklist\n§7Blacklist items from being auctioned`,
            `textures/azalea_icons/Delete`,
            (player) => {
                let form = new ActionForm();
                form.title(`${NUT_UI_TAG}§rAuction House / Blacklists`);
                form.button(
                    `${NUT_UI_HEADER_BUTTON}§r§cGo back`,
                    `textures/azalea_icons/2`,
                    (player) => {
                        uiManager.open(
                            player,
                            versionData.uiNames.AuctionHouse.Settings.Root
                        );
                    }
                );
                form.button(
                    `§aBlacklist Item\n§7Blacklist an item`,
                    `textures/azalea_icons/1`,
                    (player) => {
                        let modal = new ModalForm();
                        modal.textField("Item ID", "Example: minecraft:stone");
                        modal.show(player, false, (player, response) => {
                            if (response.canceled)
                                return uiManager.open(
                                    player,
                                    versionData.uiNames.AuctionHouse.Settings
                                        .Root
                                );
                            let itemID =
                                response.formValues[0].split(":").length == 1
                                    ? `minecraft:${response.formValues[0]}`
                                    : response.formValues[0];
                            if (!ItemTypes.get(itemID)) {
                                player.error("Unknown item ID");
                                return uiManager.open(
                                    player,
                                    versionData.uiNames.AuctionHouse.Settings
                                        .Root
                                );
                            }
                            auctionhouse.addBlacklistedItem(itemID);
                            return uiManager.open(
                                player,
                                versionData.uiNames.AuctionHouse.Settings.Root
                            );
                        });
                    }
                );
                for (const blacklistedItem of auctionhouse.getBlacklistedItems()) {
                    form.button(blacklistedItem, null, (player) => {
                        let newForm = new ActionForm();
                        newForm.title(`${NUT_UI_TAG}§rBlacklist Actions`);
                        newForm.button(
                            `${NUT_UI_HEADER_BUTTON}§r§cGo back`,
                            `textures/azalea_icons/2`,
                            (player) => {
                                uiManager.open(
                                    player,
                                    versionData.uiNames.AuctionHouse.Settings
                                        .Root
                                );
                            }
                        );
                        newForm.button(
                            `§cRemove Blacklist\n§7Removes this item from blacklist`,
                            `textures/azalea_icons/Delete`,
                            (player) => {
                                auctionhouse.removeBlacklistedItem(
                                    blacklistedItem
                                );
                                uiManager.open(
                                    player,
                                    versionData.uiNames.AuctionHouse.Settings
                                        .Root
                                );
                            }
                        );
                        newForm.show(player, false, () => []);
                    });
                }
                form.show(player, false, () => {});
            }
        );
        form.button(
            `§dAuction Limit (Current: ${configAPI.getProperty(
                "AuctionLimit"
            )})\n§7Set limit of active auctions per player`,
            `textures/azalea_icons/Conditions`,
            (player) => {
                let modal = new ModalForm();
                modal.slider(
                    "Auction Limit",
                    5,
                    50,
                    5,
                    configAPI.getProperty("AuctionLimit")
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.AuctionHouse.Settings.Root
                        );
                    configAPI.setProperty(
                        "AuctionLimit",
                        response.formValues[0]
                    );
                    return uiManager.open(
                        player,
                        versionData.uiNames.AuctionHouse.Settings.Root
                    );
                });
            }
        );
        form.show(player, false, () => {});
    }
);
