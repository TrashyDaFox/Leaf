import auctionhouse from "../../api/AH/auctionhouse";
import { ChestFormData } from "../../lib/chestUI";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import {chunk} from '../../api/iconViewer/underscore'
import itemdb from "../../api/itemdb";
import { BlockTypes, ItemTypes, world } from "@minecraft/server";
import playerStorage from "../../api/playerStorage";
import { typeIdToID } from "../../lib/typeIds";
import moment from '../../lib/moment'
import { prismarineDb } from "../../lib/prismarinedb";
import emojis from "../../api/emojis";
import icons from "../../api/icons";
function parseItemID(id) {
    let text = id.includes(':') ? id.split(':')[1] : id;
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
uiManager.addUI(versionData.uiNames.AuctionHouse.ViewAuctions, "", (player, page = 0, sortMode = 0, filterMode = 0, currencyFilter = 0)=>{
    let chest = new ChestFormData((9 * 6).toString())
    let auctions = auctionhouse.db.findDocuments({type:"AUCTION"})
    let sorts = [
        {
            name: "Newest First",
            sort(a, b) {
                return b.createdAt - a.createdAt
            }
        },
        {
            name: "Oldest First",
            sort(a, b) {
                return a.createdAt - b.createdAt
            }
        },
        {
            name: "Price (Ascending)",
            sort(a, b) {
                let bidsA = a.data.bids.sort((a,b)=>b.amount-a.amount);
                let bidsB = b.data.bids.sort((a,b)=>b.amount-a.amount);
                let priceA = a.data.bids.length ? bidsA[0].amount : a.data.startingBid ? a.data.startingBid : 0;
                let priceB = b.data.bids.length ? bidsB[0].amount : b.data.startingBid ? b.data.startingBid : 0;
                return priceA - priceB
            }
        },
        {
            name: "Price (Descending)",
            sort(a, b) {
                let bidsA = a.data.bids.sort((a,b)=>b.amount-a.amount);
                let bidsB = b.data.bids.sort((a,b)=>b.amount-a.amount);
                let priceA = a.data.bids.length ? bidsA[0].amount : a.data.startingBid ? a.data.startingBid : 0;
                let priceB = b.data.bids.length ? bidsB[0].amount : b.data.startingBid ? b.data.startingBid : 0;
                return priceB - priceA
            }
        }
    ]
    let filters = [
        {
            name: "All",
            icon: "minecraft:compass",
            filter() {
                return true;
            }
        },
        {
            name: "Blocks",
            icon: "minecraft:cobblestone",
            filter(doc) {
                let item = itemdb.getItem(doc.data.stash, doc.data.slot)
                return BlockTypes.get(item.typeId) ? true : false;
            }
        },
        {
            name: "Items",
            icon: "minecraft:torch",
            filter(doc) {
                let item = itemdb.getItem(doc.data.stash, doc.data.slot)
                return ItemTypes.get(item.typeId) && !BlockTypes.get(item.typeId) ? true : false;
            }
        },
        {
            name: "Armor",
            icon: "minecraft:iron_chestplate",
            filter(doc) {
                let item = itemdb.getItem(doc.data.stash, doc.data.slot)
                return item.typeId.endsWith('chestplate') || item.typeId.endsWith('leggings') || item.typeId.endsWith('boots') || item.typeId.endsWith('helmet')
            }
        },
        {
            name: "Weapons",
            icon: "minecraft:iron_sword",
            filter(doc) {
                let item = itemdb.getItem(doc.data.stash, doc.data.slot)
                return item.typeId.endsWith('sword') || item.typeId.endsWith('axe') || item.typeId.endsWith('trident') || item.typeId.endsWith('mace')
            }
        }
    ]
    let currencies = [0, ...prismarineDb.economy.getCurrencies()]

    auctions = auctions.filter(filters[filterMode].filter)
    auctions = auctions.filter(_=>{
        if(Date.now() >= _.data.endTime) return false;
        return true;
    })
    auctions = auctions.filter((_)=>{
        let currencyToFilter = currencies[currencyFilter];
        if(currencyToFilter == 0) return true;
        return _.data.currency == currencyToFilter.scoreboard
    })
    auctions = auctions.sort(sorts[sortMode].sort)
    let chunks = chunk(auctions, 4 * 9);
    if(!chunks.length) chunks.push([])
    for(let i = 0;i < 9;i++) {
        chest.button(i, "§cX", [], `textures/blocks/glass_silver`, 1, false, ()=>{
            uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions, page, sortMode, filterMode, currencyFilter);
        })
    }
    chest.button(0, "§eSort Mode", sorts.map((_,i)=>{
        return `${i == sortMode ? "§l§f" : "§7"}> ${_.name}`
    }), sortMode <= 1 ? `minecraft:clock` : `minecraft:gold_ingot`, 1, true, ()=>{
        uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions, page, sortMode + 1 >= sorts.length ? 0 : sortMode + 1, filterMode, currencyFilter);
    })
    chest.button(8, "§dFilter Mode", filters.map((_,i)=>{
        return `${i == filterMode ? "§l§f" : "§7"}> ${_.name}`
    }), filters[filterMode].icon, 1, false, ()=>{
        uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions, page, sortMode, filterMode + 1 >= filters.length ? 0 : filterMode + 1, currencyFilter);
    })
    chest.button(4, "§aCurrency Filter", currencies.map((_,i)=>{
        return `${i == currencyFilter ? "§l§f" : "§7"}> ${_ == 0 ? `All` : `${_.symbol} ${_.displayName}`}`
    }), `minecraft:sunflower`, 1, true, ()=>{
        uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions, page, sortMode, filterMode, currencyFilter + 1 >= currencies.length ? 0 : currencyFilter + 1);
    })
    // world.sendMessage(JSON.stringify(auctionhouse.db.data, null, 2))
    let pageIndex = page >= chunks.length ? chunks.length - 1 : page < 0 ? 0 : page;
    chest.title(`Auction House (Page ${pageIndex + 1}/${chunks.length})`)
    for(let i = 9;i < 5 * 9;i++) {
        if(i - 9 >= chunks[pageIndex].length) {
            chest.button(i, "§cX", [], `textures/blocks/glass_gray`, 1, false, ()=>{
                uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions, page, sortMode, filterMode, currencyFilter);
            })
        } else {
            let auction = chunks[pageIndex][i - 9];
            let item = itemdb.getItem(auction.data.stash, auction.data.slot)
            if(!item) continue;
            let lore = [];
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
            lore.push(` `)

            lore.push(...item.getLore())
            if(item.getLore().length) lore.push(" ");
            let durability = item.getComponent('durability');
            let enchantable = item.getComponent('enchantable')
            let enchants = [];
            let enchanted = false;
            if(enchantable && enchantable.isValid) {
                enchants = enchantable.getEnchantments()
                enchanted = enchantable.getEnchantments().length > 0
                if(enchanted) {
                    for(const enchant of enchants) {
                        // world.sendMessage(`${enchant.type.id}`)
                        lore.push(`§r§5${parseItemID(enchant.type.id)} ${toRoman(enchant.level)}`)
                    }
                    lore.push(` `)
                }
    
            }
            let potion = item.getComponent('potion');
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
            chest.button(i, `§e${parseItemID(item.typeId)}${item.nameTag ? ` §6(${item.nameTag}§r§6)` : ``}`, lore, typeIdToID.has(item.typeId) ? item.typeId : `textures/azalea_icons/NoTexture`, item.amount, enchanted, ()=>{
                uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuction, auction.id)
            }, durability ? durability.damage == 0 ? 0 : Math.floor(((durability.maxDurability - durability.damage) / durability.maxDurability) * 100) -1 : 0)
        }
    }
    for(let i = 0;i < 9;i++) {
        if(i == 0) {
            chest.button((5 * 9) + i, "§cPrevious Page", [], `textures/blocks/glass_red`, 1, false, ()=>{
                uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions, page - 1 < 0 ? chunks.length - 1 : page - 1, sortMode, filterMode, currencyFilter);
            })
        } else if(i == 8) {
            chest.button((5 * 9) + i, "§aNext Page", [], `textures/blocks/glass_lime`, 1, false, ()=>{
                uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions, page + 1 >= chunks.length ? 0 : page + 1, sortMode, filterMode, currencyFilter);
            })
        } else if(i == 3) {
            let playerID = playerStorage.getID(player)
            let rewards = auctionhouse.db.findDocuments({type: "REWARD", player: playerID});
            chest.button((5 * 9) + i, `§eClaim Rewards (${rewards.length})`, [`§7Claim rewards stored for you`], icons.resolve(rewards.length ? "Packs/Asteroid/winPING" : "leaf/image-625"), Math.max(rewards.length, 1), false, ()=>{
                let inventory = player.getComponent('inventory')
                for(const reward of rewards) {
                    let item = itemdb.getItem(reward.data.stash, reward.data.slot);
                    inventory.container.addItem(item)
                    auctionhouse.db.deleteDocumentByID(reward.id)
                }
                uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions, page, sortMode, filterMode, currencyFilter);
            })
        } else if(i == 5) {
            chest.button((5 * 9) + i, `§aAdd Auction`, [`§7Add an auction`], `textures/azalea_icons/1`, 1, false, ()=>{
                uiManager.open(player, versionData.uiNames.AuctionHouse.Start)
            })
        } else {
            chest.button((5 * 9) + i, "§cX", [], `textures/blocks/glass_silver`, 1, false, ()=>{
                uiManager.open(player, versionData.uiNames.AuctionHouse.ViewAuctions, page, sortMode, filterMode, currencyFilter);
            })
            // leaf/image-265
        }
    }
    chest.show(player)
})