import { world } from "@minecraft/server";
import { ActionForm } from "../lib/form_func";
import uiManager from "../uiManager";
import versionData from "../versionData";
import {
    NUT_UI_HEADER_BUTTON,
    NUT_UI_TAG,
    NUT_UI_THEMED,
} from "./preset_browser/nutUIConsts";
import { themes } from "./uiBuilder/cherryThemes";

function findOnlinePlayer(name) {
    return world.getPlayers().find((player) => player.name === name);
}

function getInventory(player) {
    return player.getComponent("inventory")?.container;
}

function getSlotLabel(slot) {
    return `Slot ${slot}`;
}

function getItemName(item) {
    return item.nameTag && item.nameTag.length ? item.nameTag : item.typeId;
}

function getItemLore(item) {
    try {
        return item.getLore();
    } catch {
        return [];
    }
}

function getItemButtonText(item, slot) {
    if (!item) return `§8${getSlotLabel(slot)}\n§7Empty`;
    return `§f${getSlotLabel(slot)} §7x${item.amount}\n§r§f${getItemName(item)}`;
}

function openAdminBack(player) {
    player.runCommand("scriptevent leaf:open adm/moderation_main");
}

uiManager.addUI(
    versionData.uiNames.InventoryViewer.Root,
    "Inventory Viewer",
    (player) => {
        const players = world.getPlayers().sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        const form = new ActionForm();
        form.title(
            `${NUT_UI_TAG}${NUT_UI_THEMED}${themes[68][0]}§rInventory Viewer`
        );
        form.button(
            `${NUT_UI_HEADER_BUTTON}§cBack\n§7Return to moderation`,
            "textures/azalea_icons/2",
            openAdminBack
        );
        if (!players.length) {
            form.label("§7No online players found.");
        }
        for (const target of players) {
            const inventory = getInventory(target);
            const filledSlots = inventory
                ? Array.from({ length: inventory.size }, (_, slot) =>
                      inventory.getItem(slot) ? 1 : 0
                  ).reduce((total, filled) => total + filled, 0)
                : 0;
            form.button(
                `§a${target.name}\n§7${filledSlots} filled slot${
                    filledSlots === 1 ? "" : "s"
                }`,
                "textures/azalea_icons/other/inventory",
                (player) => {
                    uiManager.open(
                        player,
                        versionData.uiNames.InventoryViewer.Player,
                        target.name
                    );
                }
            );
        }
        form.show(player, false, () => {});
    }
);

uiManager.addUI(
    versionData.uiNames.InventoryViewer.Player,
    "Inventory Viewer Player",
    (player, targetName) => {
        const target = findOnlinePlayer(targetName);
        if (!target) {
            player.error(`Player "${targetName}" is not online.`);
            return uiManager.open(player, versionData.uiNames.InventoryViewer.Root);
        }
        const inventory = getInventory(target);
        const form = new ActionForm();
        form.title(
            `${NUT_UI_TAG}${NUT_UI_THEMED}${themes[68][0]}§r${target.name}`
        );
        form.button(
            `${NUT_UI_HEADER_BUTTON}§cBack\n§7Select another player`,
            "textures/azalea_icons/2",
            (player) => {
                uiManager.open(player, versionData.uiNames.InventoryViewer.Root);
            }
        );
        form.button("§eRefresh\n§7Reload this inventory", "textures/azalea_icons/other/arrow_refresh", (player) => {
            uiManager.open(
                player,
                versionData.uiNames.InventoryViewer.Player,
                targetName
            );
        });
        if (!inventory) {
            form.label("§cThis player does not have an inventory container.");
            return form.show(player, false, () => {});
        }
        for (let slot = 0; slot < inventory.size; slot++) {
            const item = inventory.getItem(slot);
            form.button(getItemButtonText(item, slot), null, (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.InventoryViewer.Slot,
                    targetName,
                    slot
                );
            });
        }
        form.show(player, false, () => {});
    }
);

uiManager.addUI(
    versionData.uiNames.InventoryViewer.Slot,
    "Inventory Viewer Slot",
    (player, targetName, slot) => {
        const target = findOnlinePlayer(targetName);
        if (!target) {
            player.error(`Player "${targetName}" is not online.`);
            return uiManager.open(player, versionData.uiNames.InventoryViewer.Root);
        }
        const inventory = getInventory(target);
        const item = inventory?.getItem(slot);
        const form = new ActionForm();
        form.title(
            `${NUT_UI_TAG}${NUT_UI_THEMED}${themes[68][0]}§r${target.name} ${getSlotLabel(slot)}`
        );
        form.button(
            `${NUT_UI_HEADER_BUTTON}§cBack\n§7Return to inventory`,
            "textures/azalea_icons/2",
            (player) => {
                uiManager.open(
                    player,
                    versionData.uiNames.InventoryViewer.Player,
                    targetName
                );
            }
        );
        if (!inventory) {
            form.label("§cThis player does not have an inventory container.");
        } else if (!item) {
            form.label(`§7${getSlotLabel(slot)} is empty.`);
        } else {
            const lore = getItemLore(item);
            form.label(
                [
                    `§7Type: §f${item.typeId}`,
                    `§7Amount: §f${item.amount}`,
                    item.nameTag ? `§7Name: §f${item.nameTag}` : "",
                    lore.length ? `§7Lore:\n§r${lore.join("\n§r")}` : "",
                ]
                    .filter(Boolean)
                    .join("\n")
            );
        }
        form.button("§eRefresh\n§7Reload this slot", "textures/azalea_icons/other/arrow_refresh", (player) => {
            uiManager.open(
                player,
                versionData.uiNames.InventoryViewer.Slot,
                targetName,
                slot
            );
        });
        form.show(player, false, () => {});
    }
);
