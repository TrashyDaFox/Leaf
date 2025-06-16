import { ItemLockMode, ItemStack, Player } from "@minecraft/server";
import auctionhouse from "../../api/AH/auctionhouse";
import { ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import playerStorage from "../../api/playerStorage";
import configAPI from "../../api/config/configAPI";

uiManager.addUI(
    versionData.uiNames.AuctionHouse.Start,
    "Start an auction",
    async (player) => {
        // if(!(player instanceof Player)) return;
        let playerID = await playerStorage.getIDAsync(player);
        let myAuctions = auctionhouse.db.findDocuments({
            player: playerID,
            type: "AUCTION",
        });
        if (myAuctions.length >= configAPI.getProperty("AuctionLimit")) {
            player.error(
                `You cant have more than ${configAPI.getProperty(
                    "AuctionLimit"
                )} auctions.`
            );
            player.playSound("random.glass");
            return uiManager.open(
                player,
                versionData.uiNames.AuctionHouse.Root
            );
        }
        uiManager.open(
            player,
            versionData.uiNames.Basic.ItemSelect,
            async (player, item, slot) => {
                if (item == null) {
                    return uiManager.open(
                        player,
                        versionData.uiNames.AuctionHouse.Root
                    );
                }
                let modal = new ModalForm();
                let currencies = prismarineDb.economy.getCurrencies();
                modal.dropdown(
                    "Starting Bid Currency",
                    currencies.map((_) => {
                        return {
                            option: `${_.symbol} ${_.displayName}`,
                            callback() {},
                        };
                    })
                );
                modal.textField(
                    "Starting Bid Amount",
                    "The amount for the starting bid"
                );
                let durations = [
                    {
                        name: "30 Seconds",
                        time: 1000 * 30,
                    },
                    {
                        name: "1 Day",
                        time: 1000 * 60 * 60 * 24,
                    },
                    {
                        name: "1 Week",
                        time: 1000 * 60 * 60 * 24 * 7,
                    },
                ];
                modal.dropdown(
                    "Duration",
                    durations.map((_) => {
                        return { option: _.name, callback() {} };
                    })
                );
                modal.show(player, false, async (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.AuctionHouse.Root
                        );
                    try {
                        let currency =
                            currencies[response.formValues[0]].scoreboard;
                        if (!/^\d+$/.test(response.formValues[1])) {
                            player.error("Amount is not a number!");
                            uiManager.open(
                                player,
                                versionData.uiNames.AuctionHouse.Start
                            );
                            return;
                        }
                        let amount = Math.max(
                            parseInt(response.formValues[1]),
                            0
                        );
                        let duration = durations[response.formValues[2]].time;
                        let inventory = player.getComponent("inventory");
                        let res = await auctionhouse.addItem(
                            player,
                            currency,
                            item,
                            amount,
                            duration
                        );
                        if (res.error) {
                            player.error(res.errorMessage);
                            uiManager.open(
                                player,
                                versionData.uiNames.AuctionHouse.Start
                            );
                            return;
                        }
                        inventory.container.setItem(slot);
                        uiManager.open(
                            player,
                            versionData.uiNames.AuctionHouse.ViewAuctions
                        );
                    } catch (e) {
                        player.error(`${e} ${e.stack}`);
                    }
                });
                // auctionhouse.addItem(player, currency, itemStack, startingBid, duration)
            }
        );
    }
);
