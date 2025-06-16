import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { ChestFormData } from "../../lib/chestUI";
import { typeIdToID } from "../../lib/typeIds";
import { ItemLockMode } from "@minecraft/server";
function parseItemID(id) {
    let text = id.includes(":") ? id.split(":")[1] : id;
    return text
        .split("_")
        .map((_) => `${_[0].toUpperCase()}${_.substring(1)}`)
        .join(" ");
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
        { value: 1, symbol: "I" },
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
uiManager.addUI(
    config.uiNames.Basic.ItemSelect,
    "Item selector",
    (player, callback) => {
        let inv = player.getComponent("inventory");
        let items = [];
        let hotbar = [];
        for (let i = 0; i < 9; i++) {
            if (inv.container.getItem(i)) {
                let item = inv.container.getItem(i);
                if (item.lockMode != ItemLockMode.none) {
                    hotbar.push(null);
                    continue;
                }
                hotbar.push([item, i]);
            } else hotbar.push(null);
        }
        for (let i = 9; i < inv.container.size; i++) {
            if (inv.container.getItem(i)) {
                let item = inv.container.getItem(i);
                if (item.lockMode != ItemLockMode.none) {
                    items.push(null);
                    continue;
                }
                items.push([item, i]);
            } else items.push(null);
        }
        // let form = new ActionForm();
        // form.button("§cBack\n§7Go back", `textures/blocks/barrier`, (player)=>{
        // callback(player, null);
        // })

        let chest = new ChestFormData((9 * 6).toString());
        function getItemLore(item) {
            let lore = [];
            lore.push(...item.getLore());
            if (item.getLore().length) lore.push(" ");

            let enchantable = item.getComponent("enchantable");
            let enchants = [];
            let enchanted = false;
            if (enchantable && enchantable.isValid) {
                enchants = enchantable.getEnchantments();
                enchanted = enchantable.getEnchantments().length > 0;
                if (enchanted) {
                    for (const enchant of enchants) {
                        try {
                            lore.push(
                                `§r§5${parseItemID(enchant.type.id)} ${toRoman(
                                    enchant.level
                                )}`
                            );
                        } catch {}
                        // world.sendMessage(`${enchant.type.id}`)
                    }
                    lore.push(` `);
                }
            }
            let potion = item.getComponent("potion");
            if (potion && potion.isValid) {
                lore.push(`§dPotion Effect: ${potion.potionEffectType.id}`);
                lore.push(` `);
            }
            // let playerData = playerStorage.getPlayerByID(auction.data.player);
            // lore.push(`§a${auction.data.bids.length} bid(s)`);
            // lore.push(`§7By ${playerData.name}`);
            return {
                name: `§e${parseItemID(item.typeId)}${
                    item.nameTag ? ` §6(${item.nameTag}§r§6)` : ``
                }`,
                lore,
                enchanted,
            };
        }
        for (let i = 0; i < 9 * 6; i++) {
            chest.button(
                i,
                `§cX`,
                [],
                `textures/blocks/glass_gray`,
                1,
                false,
                () => {
                    uiManager.open(
                        player,
                        config.uiNames.Basic.ItemSelect,
                        callback
                    );
                }
            );
        }
        for (let i = 0; i < 9; i++) {
            chest.button(
                i,
                `§cX`,
                [],
                `textures/blocks/glass_silver`,
                1,
                false,
                () => {
                    uiManager.open(
                        player,
                        config.uiNames.Basic.ItemSelect,
                        callback
                    );
                }
            );
        }
        for (let i = 5 * 9; i < 5 * 9 + 9; i++) {
            chest.button(
                i,
                `§cX`,
                [],
                `textures/blocks/glass_silver`,
                1,
                false,
                () => {
                    uiManager.open(
                        player,
                        config.uiNames.Basic.ItemSelect,
                        callback
                    );
                }
            );
        }
        for (let i = 0; i < hotbar.length; i++) {
            if (hotbar[i] == null) continue;
            let [item, slot] = hotbar[i];
            let { name, lore, enchanted } = getItemLore(item);
            chest.button(
                4 * 9 + i,
                name,
                lore,
                typeIdToID.has(item.typeId)
                    ? item.typeId
                    : `textures/azalea_icons/NoTexture`,
                item.amount,
                enchanted,
                () => {
                    let confText = [`§l§eIS THIS INFO CORRECT?`, ` `];
                    confText.push(name);
                    confText.push(` `);
                    confText.push(...lore);
                    uiManager.open(
                        player,
                        config.uiNames.Basic.Confirmation,
                        confText.join("\n§r"),
                        () => {
                            callback(player, item, slot);
                        },
                        () => {
                            uiManager.open(
                                player,
                                config.uiNames.Basic.ItemSelect,
                                callback
                            );
                        }
                    );
                }
            );
        }
        for (let i = 0; i < items.length; i++) {
            if (items[i] == null) continue;
            let [item, slot] = items[i];
            let { name, lore, enchanted } = getItemLore(item);
            chest.button(
                9 + i,
                name,
                lore,
                typeIdToID.has(item.typeId)
                    ? item.typeId
                    : `textures/azalea_icons/NoTexture`,
                item.amount,
                enchanted,
                () => {
                    let confText = [`§l§eIS THIS INFO CORRECT?`, ` `];
                    confText.push(name);
                    confText.push(` `);
                    confText.push(...lore);
                    uiManager.open(
                        player,
                        config.uiNames.Basic.Confirmation,
                        confText.join("\n§r"),
                        () => {
                            callback(player, item, slot);
                        },
                        () => {
                            uiManager.open(
                                player,
                                config.uiNames.Basic.ItemSelect,
                                callback
                            );
                        }
                    );
                }
            );
        }
        chest.title("Item Select");
        chest.button(
            0,
            `§cBack`,
            [`§7Click to go back`],
            `textures/azalea_icons/2`,
            1,
            false,
            () => {
                callback(player, null);
            }
        );
        // for(const item of items) {
        // form.button(`§b${item[0].nameTag ? item[0].nameTag : parseItemID(item[0].typeId)} x${item[0].amount}\n§7${item[0].typeId}`, null, (player)=>{
        // callback(player, item[0], item[1]);
        // })
        // }
        chest.show(player, false);
    }
);
