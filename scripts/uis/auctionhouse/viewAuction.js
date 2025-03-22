import { world } from "@minecraft/server";
import auctionhouse from "../../api/AH/auctionhouse";
import itemdb from "../../api/itemdb";
import playerStorage from "../../api/playerStorage";
import { ActionForm, ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_HEADER_BUTTON, NUT_UI_TAG } from "../preset_browser/nutUIConsts";
import moment from '../../lib/moment'
import emojis from "../../api/emojis";
function parseItemID(id) {
    let text = id.split(':')[1];
    return text.split('_').map(_=>`${_[0].toUpperCase()}${_.substring(1)}`).join(' ');
}
function toRoman(num) {
    const romanNumerals = [
        { value: 1000, symbol: "M" },
        { value: 900, symbol: "CM" },
        { value: 500, symbol: "D" },
        { value: 400, symbol: "CD" },
        { value: 100, symbol: "C" },
        { value: 90, symbol: "XC" },
        { value: 50, symbol: "L" },
        { value: 40, symbol: "XL" },
        { value: 10, symbol: "X" },
        { value: 9, symbol: "IX" },
        { value: 5, symbol: "V" },
        { value: 4, symbol: "IV" },
        { value: 1, symbol: "I" }
    ];

    let result = "";

    for (const { value, symbol } of romanNumerals) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }

    return result;
}
function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
uiManager.addUI(versionData.uiNames.AuctionHouse.ViewAuction, "View Auction", (player, auctionID)=>{
    try {
        let form = new ActionForm();
        form.title(`${NUT_UI_TAG}§rViewing Auction`)
        let auction = auctionhouse.db.getByID(auctionID)
        let item = itemdb.getItem(auction.data.stash, auction.data.slot)
        if(!item) return;
        let lore = [];
        lore.push(`§e${parseItemID(item.typeId)}${item.nameTag ? ` §6(${item.nameTag}§r§6)` : ``}`)
        lore.push(`${emojis.clock} §7Ends ${moment(auction.data.endTime).fromNow()}`)
        let currency = prismarineDb.economy.getCurrency(auction.data.currency)
        let price = auction.data.startingBid ? auction.data.startingBid : 0;
        for(const bid of auction.data.bids) {
            if(bid.amount > price) price = bid.amount
        }
        let highestBidder = playerStorage.getPlayerByID(auction.data.player).name;
        let highestBidderAmt = auction.data.startingBid ? auction.data.startingBid : 0;
        for(const bid of auction.data.bids) {
            if(bid.amount > highestBidderAmt) {
                highestBidderAmt = bid.amount;
                highestBidder = playerStorage.getPlayerByID(bid.player).name;    
            }
        }
        lore.push(`§7Minimum bid price: §a${currency.symbol} ${addCommas(price)}`)
        lore.push(`§7Highest bidder: §6${highestBidder}`)
        lore.push(' ')
        lore.push(...item.getLore())
        if(item.getLore().length) lore.push(" ");
        
        let enchantable = item.getComponent('enchantable')
        let enchants = []
        let enchanted = []
        if(enchantable && enchantable.isValid) {
            enchants = enchantable.getEnchantments()
            enchanted = enchantable.getEnchantments().length > 4
            if(enchanted) {
                for(const enchant of enchants) {
                    try {
                        lore.push(`§r§5${parseItemID(enchant.type.id)} ${toRoman(enchant.level)}`)

                    } catch {}
                }
                lore.push(` `)
            }
    
        }
        let potion = item.getComponent('potion');
        let durability = item.getComponent('durability');
        if(potion && potion.isValid) {
            lore.push(`§dPotion Effect: ${potion.potionEffectType.id}`)
            lore.push(` `)
        }
        if(durability) {
            lore.push(`§cDurability: ${durability.maxDurability - durability.damage}/${durability.maxDurability}`)
            lore.push(` `)
        }

        let playerData = playerStorage.getPlayerByID(auction.data.player);
        lore.push(`§a${auction.data.bids.length} bid(s)`);
        lore.push(`§7By ${playerData.name}`);
        lore.push(` `)
        lore.push(`§6----- Bids -----`);
        lore.push(` `)
        if(!auction.data.bids.length) lore.push(`§7(none)`);
        for(const bid of auction.data.bids) {
            let playerData = playerStorage.getPlayerByID(bid.player);
            lore.push(`§e${playerData.name} §7: §a$${bid.amount}`)
        }
        form.body(`${lore.join('\n§r')}`);
        form.button(`${NUT_UI_HEADER_BUTTON}§r§cBack\n§7Click to go back`, `textures/azalea_icons/2`, (player)=>{
            uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions, 0)
        })
        let playerMoney = prismarineDb.economy.getMoney(player, auction.data.currency);
        let playerHasEnough = playerStorage.getID(player) == auction.data.player ? false : true;
        if(playerMoney < auction.data.startingBid ? auction.data.startingBid : 0) playerHasEnough = false;
        for(const bid of auction.data.bids) {
            if(playerMoney < bid.amount) playerHasEnough = false;
        }
        let highestAmounts = auction.data.bids.sort((a,b)=>b.amount-a.amount);
        form.button(`${playerHasEnough ? `§a` : `§p§3§0§r§a`}Add Bid\n§7${playerStorage.getID(player) == auction.data.player ? "You cant bid on your own item" : playerHasEnough ? `Adds a bid` : `You dont have enough to bid`}`, `textures/azalea_icons/1`, (player)=>{
            if(!playerHasEnough) {
                uiManager.open(versionData.uiNames.AuctionHouse.ViewAuction, auctionID)
                return;
            }
            let modal = new ModalForm();
            modal.title(`Add Bid`);
            modal.textField(`Amount (Min: ${highestAmounts.length ? highestAmounts[0].amount : auction.data.startingBid ? auction.data.startingBid : 0}, Max: ${playerMoney})`, `Set an amount`, highestAmounts.length ? highestAmounts[0].amount.toString() : auction.data.startingBid ? auction.data.startingBid.toString() : "0")
            modal.show(player, false, async (player, response)=>{
                try {
                    if(!/^\d+$/.test(response.formValues[0])) {
                        player.error(`Amount is not a number!`);
                        uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuction, auctionID)
                        return;
                    }
                    let amt = Math.max(parseInt(response.formValues[0]), 0);
                    // world.sendMessage(`${amt}`)
                    let res = await auctionhouse.addBid(player, auction.id, amt);
                    // world.sendMessage(JSON.stringify(res))
                    if(res.error) {
                        player.error(res.errorMessage)
                        uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuction, auctionID)
                        return;
                    }
                    uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuction, auctionID)
    
                } catch(e) {
                    player.error(`${e} ${e.stack}`)

                }
            })
        })
        if(playerStorage.getID(player) == auction.data.player) {
            form.button(`§cEnd Auction\n§7End auction now and select winner`, `textures/azalea_icons/Delete`, (player)=>{
                auction.data.endTime = Date.now();
                auctionhouse.db.overwriteDataByID(auction.id, auction.data)
                uiManager.open(player, versionData.uiNames.AuctionHouse.Root)
            })
        }
        if(prismarineDb.permissions.hasPermission(player, "ah.delete")) {
            form.button(`§cAdmin: Delete Auction\n§7Delete this auction`, `textures/azalea_icons/Delete`, (player)=>{
                uiManager.open(player, versionData.uiNames.Basic.Confirmation, "Are you sure you want to delete this auction?", ()=>{
                    uiManager.open(player, versionData.uiNames.Basic.Confirmation, "Do you want to return the item to the owner?", ()=>{
                        auctionhouse.db.deleteDocumentByID(auctionID);
                        auctionhouse.db.insertDocument({
                            type: "REWARD",
                            player: auction.data.player,
                            stash: auction.data.stash,
                            slot: auction.data.slot
                        })
                        uiManager.open(player, versionData.uiNames.AuctionHouse.Root)
                    }, ()=>{
                        auctionhouse.db.deleteDocumentByID(auctionID);
                        uiManager.open(player, versionData.uiNames.AuctionHouse.Root)
                    })
                }, ()=>{
                    uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuction, auctionID)
                })
            })
        }
        form.show(player, false, (player, response)=>{
    
        })
    } catch(e) {
        player.error(`${e} ${e.stack}`)
    }
})