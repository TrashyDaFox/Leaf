import { Container } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { typeIdToDataId, typeIdToID } from "./typeIds.js";
import * as mc from "@minecraft/server";
let num_of_items = 0;
let i2 = -1;
let i3 = -1;
function sort(es) {
    // let id = e.id.split(':')[1];
    return es.sort((a, b) => {
        return a.id.localeCompare(b.id);
    });
}
// [...sort(mc.BlockTypes.getAll()), ...sort(mc.ItemTypes.getAll().filter(_=>mc.BlockTypes.get(_.id) ? false : true))].forEach((e)=>{
// [...sort(mc.ItemTypes.getAll().filter(_=>mc.BlockTypes.get(_.id) ? false : true)), ...sort(mc.BlockTypes.getAll())].forEach((e)=>{
let charsToReove = "_spawn_egg".length;
// [...sort(mc.ItemTypes.getAll().filter(e=>!(e.id.endsWith("_spawn_egg") && mc.EntityTypes.get(e.id.slice(0, -charsToReove))))), ...sort(mc.ItemTypes.getAll().filter(e=>e.id.endsWith("_spawn_egg") && mc.EntityTypes.get(e.id.slice(0, -charsToReove))))].forEach((e)=>{
mc.system.run(() => {
    mc.ItemTypes.getAll().forEach((e) => {
        if (e.id.startsWith("minecraft:")) return;
        // mc.world.sendMessage(e.id)
        let isItem = mc.BlockTypes.get(e.id) ? false : true;
        // testLogs.push(`${e.id} - ${isItem ? "ITEM" : "BLOCK"}`)
        // world.sendMessage(testLogs.join('\n'))
        // if(isItem) i2++;
        // else i3++;
        // typeIdToID.set(e.id, isItem ? 256+i2 : 256-i3)
        if (
            e.id.endsWith("_spawn_egg") &&
            mc.EntityTypes.get(e.id.slice(0, -charsToReove))
        )
            return;

        if (isItem) {
            // console.log(e.id)
            // mc.world.sendMessage(e.id)
            num_of_items += 1;
        }
    });
});
function number_of_1_16_100_items() {
    return num_of_items;
}

/**
 * Turns the logic for inventory slots on/off. Only set this to false if you have disabled inventory in RP/ui/_global_variables.json side!
 * Disabling this may also reduce form opening lag a bit.
 */
const inventory_enabled = false;
/**
 * Defines the custom block & item IDs for the form.
 * You can reference either a vanilla texture icon, which functions identically to other items...
 * ...or reference a texture path, which removes enchant glint and 3d block render capability.
 */
const custom_content = {
    /*
	'custom:block': {
		texture: 'minecraft:gold_block',
		type: 'block'
	},
	'custom:item': {
		texture: 'textures/items/paper',
		type: 'item'
	},
	*/
};
//Blocks are excluded from the count, as they do not shift vanilla IDs.
const number_of_custom_items = Object.values(custom_content).filter(
    (v) => v.type === "item"
).length;
const custom_content_keys = new Set(Object.keys(custom_content));
//Add custom sizes defined in UI
const sizes = new Map([
    ["single", ["§c§h§e§s§t§2§7§r", 27]],
    ["small", ["§c§h§e§s§t§2§7§r", 27]],
    ["double", ["§c§h§e§s§t§5§4§r", 54]],
    ["large", ["§c§h§e§s§t§5§4§r", 54]],
    ["1", ["§c§h§e§s§t§0§1§r", 1]],
    ["5", ["§c§h§e§s§t§0§5§r", 5]],
    ["9", ["§c§h§e§s§t§0§9§r", 9]],
    ["18", ["§c§h§e§s§t§1§8§r", 18]],
    ["27", ["§c§h§e§s§t§2§7§r", 27]],
    ["meow", ["§c§h§e§s§t§p§2§7§r", 27]],
    ["36", ["§c§h§e§s§t§3§6§r", 36]],
    ["45", ["§c§h§e§s§t§4§5§r", 45]],
    ["54", ["§c§h§e§s§t§5§4§r", 54]],
    [1, ["§c§h§e§s§t§0§1§r", 1]],
    [5, ["§c§h§e§s§t§0§5§r", 5]],
    [9, ["§c§h§e§s§t§0§9§r", 9]],
    [18, ["§c§h§e§s§t§1§8§r", 18]],
    [27, ["§c§h§e§s§t§2§7§r", 27]],
    [36, ["§c§h§e§s§t§3§6§r", 36]],
    [45, ["§c§h§e§s§t§4§5§r", 45]],
    [54, ["§c§h§e§s§t§5§4§r", 54]],
]);
class ChestFormData {
    #titleText;
    #buttonArray;
    constructor(size = "small") {
        const sizing = sizes.get(size) ?? ["§c§h§e§s§t§2§7§r", 27];
        /** @internal */
        this.#titleText = { rawtext: [{ text: `${sizing[0]}` }] };
        /** @internal */
        this.#buttonArray = Array(sizing[1]).fill(["", undefined]);
        this.slotCount = sizing[1];
        this.callbacks = {};
    }
    title(text) {
        if (typeof text === "string") {
            this.#titleText.rawtext.push({ text: text });
        } else if (typeof text === "object") {
            if (text.rawtext) {
                this.#titleText.rawtext.push(...text.rawtext);
            } else {
                this.#titleText.rawtext.push(text);
            }
        }
        return this;
    }
    button(
        slot,
        itemName,
        itemDesc,
        texture,
        stackSize = 1,
        enchanted = false,
        callback,
        durability = 0
    ) {
        const targetTexture = custom_content_keys.has(texture)
            ? custom_content[texture]?.texture
            : texture;
        const ID =
            typeIdToDataId.get(targetTexture) ?? typeIdToID.get(targetTexture);
        let buttonRawtext = {
            rawtext: [
                {
                    text: `stack#${String(
                        Math.min(Math.max(stackSize, 1), 99)
                    ).padStart(2, "0")}dur#${String(
                        Math.min(Math.max(durability, 0), 99)
                    ).padStart(2, "0")}§r`,
                },
            ],
        };
        if (typeof itemName === "string") {
            buttonRawtext.rawtext.push({
                text: itemName ? `${itemName}§r` : "§r",
            });
        } else if (typeof itemName === "object" && itemName.rawtext) {
            buttonRawtext.rawtext.push(...itemName.rawtext, { text: "§r" });
        } else return;
        if (Array.isArray(itemDesc) && itemDesc.length > 0) {
            for (const obj of itemDesc) {
                if (typeof obj === "string") {
                    buttonRawtext.rawtext.push({ text: `\n${obj}` });
                } else if (typeof obj === "object" && obj.rawtext) {
                    buttonRawtext.rawtext.push({ text: `\n` }, ...obj.rawtext);
                }
            }
        }
        if (callback) this.callbacks[slot] = callback;
        this.#buttonArray.splice(
            Math.max(0, Math.min(slot, this.slotCount - 1)),
            1,
            [
                buttonRawtext,
                ID === undefined
                    ? targetTexture
                    : (ID + (ID < 256 ? 0 : number_of_1_16_100_items())) *
                          65536 +
                      (enchanted ? 32768 : 0),
            ]
        );
        return this;
    }
    pattern(pattern, key) {
        for (let i = 0; i < pattern.length; i++) {
            const row = pattern[i];
            for (let j = 0; j < row.length; j++) {
                const letter = row.charAt(j);
                const data = key[letter];
                if (!data) continue;
                const slot = j + i * 9;
                const targetTexture = custom_content_keys.has(data.texture)
                    ? custom_content[data.texture]?.texture
                    : data.texture;
                const ID =
                    typeIdToDataId.get(targetTexture) ??
                    typeIdToID.get(targetTexture);
                const {
                    stackAmount = 1,
                    durability = 0,
                    itemName,
                    itemDesc,
                    enchanted = false,
                } = data;
                const stackSize = String(
                    Math.min(Math.max(stackAmount, 1), 99)
                ).padStart(2, "0");
                const durValue = String(
                    Math.min(Math.max(durability, 0), 99)
                ).padStart(2, "0");
                let buttonRawtext = {
                    rawtext: [{ text: `stack#${stackSize}dur#${durValue}§r` }],
                };
                if (typeof itemName === "string") {
                    buttonRawtext.rawtext.push({ text: `${itemName}§r` });
                } else if (itemName?.rawtext) {
                    buttonRawtext.rawtext.push(...itemName.rawtext, {
                        text: "§r",
                    });
                } else continue;
                if (Array.isArray(itemDesc) && itemDesc.length > 0) {
                    for (const obj of itemDesc) {
                        if (typeof obj === "string") {
                            buttonRawtext.rawtext.push({ text: `\n${obj}` });
                        } else if (obj?.rawtext) {
                            buttonRawtext.rawtext.push({
                                text: `\n`,
                                ...obj.rawtext,
                            });
                        }
                    }
                }
                this.#buttonArray.splice(
                    Math.max(0, Math.min(slot, this.slotCount - 1)),
                    1,
                    [
                        buttonRawtext,
                        ID === undefined
                            ? targetTexture
                            : (ID +
                                  (ID < 256 ? 0 : number_of_1_16_100_items())) *
                                  65536 +
                              (enchanted ? 32768 : 0),
                    ]
                );
            }
        }
        return this;
    }
    show(player) {
        const form = new ActionFormData().title(this.#titleText);
        this.#buttonArray.forEach((button) => {
            form.button(button[0], button[1]?.toString());
        });
        if (!inventory_enabled) {
            let res = form.show(player);
            res.then((res) => {
                if (res.canceled) return;
                // console.warn(res.selection);
                // console.warn(Object.keys(this.callbacks));
                if (this.callbacks[res.selection])
                    this.callbacks[res.selection]();
            });
            return res;
        }
        /** @type {Container} */
        const container = player.getComponent("inventory").container;
        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (!item) continue;
            const typeId = item.typeId;
            const targetTexture = custom_content_keys.has(typeId)
                ? custom_content[typeId]?.texture
                : typeId;
            const ID =
                typeIdToDataId.get(targetTexture) ??
                typeIdToID.get(targetTexture);
            const durability = item.getComponent("durability");
            const durDamage = durability
                ? Math.round(
                      ((durability.maxDurability - durability.damage) /
                          durability.maxDurability) *
                          99
                  )
                : 0;
            const amount = item.amount;
            const formattedItemName = typeId
                .replace(/.*(?<=:)/, "")
                .replace(/_/g, " ")
                .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
            let buttonRawtext = {
                rawtext: [
                    {
                        text: `stack#${String(amount).padStart(
                            2,
                            "0"
                        )}dur#${String(durDamage).padStart(
                            2,
                            "0"
                        )}§r${formattedItemName}`,
                    },
                ],
            };
            const loreText = item.getLore().join("\n");
            if (loreText) buttonRawtext.rawtext.push({ text: loreText });
            const finalID =
                ID === undefined
                    ? targetTexture
                    : (ID + (ID < 256 ? 0 : number_of_1_16_100_items())) *
                      65536;
            form.button(buttonRawtext, finalID.toString());
        }
        let res = form.show(player);
        res.then((res) => {
            if (res.canceled) return;
            // console.warn(res.selection);
            if (this.callbacks[res.selection]) this.callbacks[res.selection]();
        });
        return res;
    }
}

class FurnaceFormData {
    #titleText;
    #buttonArray;
    constructor(isLit = false) {
        /** @internal */
        this.#titleText = {
            rawtext: [
                { text: isLit ? "§f§u§r§n§a§c§e§l§i§t§r" : "§f§u§r§n§a§c§e§r" },
            ],
        };
        /** @internal */
        this.#buttonArray = Array(3).fill(["", undefined]);
        this.slotCount = 3;
    }
    title(text) {
        if (typeof text === "string") {
            this.#titleText.rawtext.push({ text });
        } else if (typeof text === "object" && text.rawtext) {
            this.#titleText.rawtext.push(...text.rawtext);
        } else {
            this.#titleText.rawtext.push({ text: "" });
        }
        return this;
    }
    button(
        slot,
        itemName,
        itemDesc,
        texture,
        stackSize = 1,
        durability = 0,
        enchanted = false
    ) {
        const targetTexture = custom_content_keys.has(texture)
            ? custom_content[texture]?.texture
            : texture;
        const ID =
            typeIdToDataId.get(targetTexture) ?? typeIdToID.get(targetTexture);
        let buttonRawtext = {
            rawtext: [
                {
                    text: `stack#${String(
                        Math.min(Math.max(stackSize, 1), 99)
                    ).padStart(2, "0")}dur#${String(
                        Math.min(Math.max(durability, 0), 99)
                    ).padStart(2, "0")}§r`,
                },
            ],
        };

        if (typeof itemName === "string") {
            buttonRawtext.rawtext.push({
                text: itemName ? `${itemName}§r` : "§r",
            });
        } else if (typeof itemName === "object" && itemName.rawtext) {
            buttonRawtext.rawtext.push(...itemName.rawtext, { text: "§r" });
        } else return;
        if (Array.isArray(itemDesc) && itemDesc.length) {
            itemDesc.forEach((obj) => {
                if (typeof obj === "string") {
                    buttonRawtext.rawtext.push({ text: `\n${obj}` });
                } else if (typeof obj === "object" && obj.rawtext) {
                    buttonRawtext.rawtext.push({ text: `\n` }, ...obj.rawtext);
                }
            });
        }
        this.#buttonArray.splice(
            Math.max(0, Math.min(slot, this.slotCount - 1)),
            1,
            [
                buttonRawtext,
                ID === undefined
                    ? targetTexture
                    : (ID + (ID < 256 ? 0 : number_of_1_16_100_items())) *
                          65536 +
                      (enchanted ? 32768 : 0),
            ]
        );
        return this;
    }
    show(player) {
        const form = new ActionFormData().title(this.#titleText);
        this.#buttonArray.forEach((button) => {
            form.button(button[0], button[1]?.toString());
        });
        if (!inventory_enabled) return form.show(player);
        /** @type {Container} */
        const container = player.getComponent("inventory").container;
        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (!item) continue;
            const typeId = item.typeId;
            const targetTexture = custom_content_keys.has(typeId)
                ? custom_content[typeId]?.texture
                : typeId;
            const ID =
                typeIdToDataId.get(targetTexture) ??
                typeIdToID.get(targetTexture);
            const durability = item.getComponent("durability");
            const durDamage = durability
                ? Math.round(
                      ((durability.maxDurability - durability.damage) /
                          durability.maxDurability) *
                          99
                  )
                : 0;
            const amount = item.amount;
            const formattedItemName = typeId
                .replace(/.*(?<=:)/, "")
                .replace(/_/g, " ")
                .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
            let buttonRawtext = {
                rawtext: [
                    {
                        text: `stack#${String(amount).padStart(
                            2,
                            "0"
                        )}dur#${String(durDamage).padStart(
                            2,
                            "0"
                        )}§r${formattedItemName}`,
                    },
                ],
            };
            const loreText = item.getLore().join("\n");
            if (loreText) buttonRawtext.rawtext.push({ text: loreText });
            const finalID =
                ID === undefined
                    ? targetTexture
                    : (ID + (ID < 256 ? 0 : number_of_1_16_100_items())) *
                      65536;
            form.button(buttonRawtext, finalID.toString());
        }
        return form.show(player);
    }
}

export { ChestFormData, FurnaceFormData };
