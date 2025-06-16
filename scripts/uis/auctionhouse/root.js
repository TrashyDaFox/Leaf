import auctionhouse from "../../api/AH/auctionhouse";
import itemdb from "../../api/itemdb";
import playerStorage from "../../api/playerStorage";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";

uiManager.addUI(
    versionData.uiNames.AuctionHouse.Root,
    "fgtrwbhiujg",
    (player) => {
        uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions);
        return;
        let form = new ActionForm();
        form.title(`${NUT_UI_TAG}§rAuction House`);
        form.button(`View Auctions`, null, (player) => {
            uiManager.open(
                player,
                versionData.uiNames.AuctionHouse.ViewAuctions
            );
        });
        form.button(`Start An Auction`, null, (player) => {
            uiManager.open(player, versionData.uiNames.AuctionHouse.Start);
        });
        let playerID = playerStorage.getID(player);
        let rewards = auctionhouse.db.findDocuments({
            type: "REWARD",
            player: playerID,
        });
        form.button(`Claim Rewards (${rewards.length})`, null, (player) => {
            let inventory = player.getComponent("inventory");
            for (const reward of rewards) {
                let item = itemdb.getItem(reward.data.stash, reward.data.slot);
                inventory.container.addItem(item);
                auctionhouse.db.deleteDocumentByID(reward.id);
            }
            return uiManager.open(
                player,
                versionData.uiNames.AuctionHouse.Root
            );
        });
        form.show(player, false, (player, response) => {});
    }
);
