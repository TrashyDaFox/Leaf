import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import itemdb from "../../api/itemdb";
import { NUT_UI_DISABLE_VERTICAL_SIZE_KEY, NUT_UI_HEADER_BUTTON, NUT_UI_LEFT_HALF, NUT_UI_RIGHT_HALF, NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import { themes } from "./cherryThemes";

/*
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬛⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬛⬛⬛⬜⬜⬜⬜⬜⬜⬜⬛⬛🟧🟧⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬛⬛⬛⬛⬛⬜⬜⬜⬜⬛⬛🟧🟧⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬛🟧🟧⬛⬛⬛⬛⬛⬛⬛🟧🟧⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬛🟧⬜🟧🟧⬛🟧🟧🟧🟧🟧🟧⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬛🟧⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬛🟧⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬜⬛⬜🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬜⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬜⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬜⬛⬛🟧🟧⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜
⬜⬛🟧🟧🟧⬜⬛⬛🟧🟧🟧🟧🟧⬛⬛⬛⬛🟧⬛🟧🟧🟧🟧🟧⬛⬜⬜⬜
⬜⬛🟧🟧🟧⬛⬛⬛⬛🟧🟧🟧🟧⬛⬛⬜⬛🟧⬛🟧🟧🟧🟧🟧🟧⬛⬜⬜
⬜⬛🟧🟧🟧⬛⬛⬜⬛🟧🟧🟧🟧🟧⬛⬛🟧⬛🟧🟧🟧🟧🟧🟧🟧🟧⬛⬜
⬜⬛⬛⬜🟧🟧⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧⬜⬛🟧⬛⬛⬛⬛⬛🟧🟧⬛⬜
⬛⬛⬛⬛⬜⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧⬜⬛🟧⬛⬛🟧🟧🟧🟧⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬛⬜⬜⬜⬜🟧🟧🟧🟧⬜⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛
⬛⬜⬜⬜⬜⬜⬛⬛⬛⬜⬜⬛⬛⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
⬛⬜⬜⬜⬜⬜⬜⬜⬜⬛⬛⬛⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
⬛⬜⬜⬜⬜⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
⬛⬜⬜⬜⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛
⬛⬜⬜⬜⬜⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬜
⬜⬛⬜⬜🟧🟧🟧⬜🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬜
⬜⬛⬜⬜⬜🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬜⬜
⬜⬜⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬜⬜⬜
⬜⬜⬜⬛⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛⬛⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜⬜⬜

hes a silly lil goober isnt he?
*/

/**
 * UI for adding or editing a button
 * @param {Player} player - The player viewing the form
 * @param {string} id - The UI ID
 * @param {number} index - Button index (-1 for new button)
 * @param {Object} data2 - Button data
 * @param {boolean} initial - Whether this is the initial form load
 */
uiManager.addUI(config.uiNames.UIBuilderAddButton, "Add a button", (player, id, index = -1, data2, initial = true) => {
    if(id == 1719775088275) return;
    const form = new ActionForm();
    const ui = uiBuilder.db.getByID(id);
    const data = data2 || {};
    let themID = ui.data.theme ? ui.data.theme : 0;
    let themString = themID > 0 ? `${NUT_UI_THEMED}${themes[themID] ? themes[themID][0] : ""}` : ``;

    // Check if this is adding to a group or editing a group button
    const isAddingToGroup = data2?.parentGroup !== undefined;
    const isEditingGroupButton = data2?.isGroupButton;
    
    // Load existing button data if editing
    if (initial && index > -1) {
        if(isEditingGroupButton) {
            // Load group button data
            const button = ui.data.buttons[index].buttons[data2.buttonIndex];
            data.text = button.text;
            data.subtext = button.subtext;
            data.action = button.actions ? button.actions[0] : button.action;
            data.iconID = button.iconID;
            data.requiredTag = button.requiredTag;
            data.sellButtonEnabled = button.sellButtonEnabled ? button.sellButtonEnabled : false;
            data.sellButtonPrice = button.sellButtonPrice ? button.sellButtonPrice : 20;
            data.sellButtonItem = button.sellButtonItem ? button.sellButtonItem : "minecraft:coal";
            data.sellButtonItemCount = button.sellButtonItemCount ? button.sellButtonItemCount : 4;
            // Add buy button data
            data.buyButtonEnabled = button.buyButtonEnabled ? button.buyButtonEnabled : false;
            data.buyButtonPrice = button.buyButtonPrice ? button.buyButtonPrice : 20;
            data.buyButtonScoreboard = button.buyButtonScoreboard ? button.buyButtonScoreboard : "money";
            data.buyButtonItem = button.buyButtonItem ? button.buyButtonItem : "";
            data.displayOverrides = button.displayOverrides ? button.displayOverrides : [];
            data.nutUINoSizeKey = button.nutUINoSizeKey ? true : false;
            data.nutUIHalf = button.nutUIHalf ? button.nutUIHalf : 0;
            data.nutUIHeaderButton = button.nutUIHeaderButton ? true : false;
            data.nutUIAlt = button.nutUIAlt ? true : false;
            data.nutUIColorCondition = button.nutUIColorCondition ? button.nutUIColorCondition : "";
        } else {
            // Load existing button data if editing
            if (initial && index > -1) {
                const button = ui.data.buttons[index];
                data.text = button.text;
                data.subtext = button.subtext;
                data.action = button.actions ? button.actions[0] : button.action;
                data.iconID = button.iconID;
                data.requiredTag = button.requiredTag;
                data.sellButtonEnabled = button.sellButtonEnabled ? button.sellButtonEnabled : false;
                data.sellButtonPrice = button.sellButtonPrice ? button.sellButtonPrice : 20;
                data.sellButtonItem = button.sellButtonItem ? button.sellButtonItem : "minecraft:coal";
                data.sellButtonItemCount = button.sellButtonItemCount ? button.sellButtonItemCount : 4;
                // Add buy button data
                data.buyButtonEnabled = button.buyButtonEnabled ? button.buyButtonEnabled : false;
                data.buyButtonPrice = button.buyButtonPrice ? button.buyButtonPrice : 20;
                data.buyButtonScoreboard = button.buyButtonScoreboard ? button.buyButtonScoreboard : "money";
                data.buyButtonItem = button.buyButtonItem ? button.buyButtonItem : "";
                data.displayOverrides = button.displayOverrides ? button.displayOverrides : [];
                data.nutUINoSizeKey = button.nutUINoSizeKey ? true : false;
                data.nutUIHalf = button.nutUIHalf ? button.nutUIHalf : 0;
                data.nutUIHeaderButton = button.nutUIHeaderButton ? true : false;
                data.nutUIAlt = button.nutUIAlt ? true : false;
                data.nutUIColorCondition = button.nutUIColorCondition ? button.nutUIColorCondition : "";
            } else {
                if(initial) {
                    data.sellButtonEnabled = false;
                    data.sellButtonPrice = 20;
                    data.sellButtonItem = "minecraft:coal";
                    data.sellButtonItemCount = 4;
                    // Initialize buy button data
                    data.buyButtonEnabled = false;
                    data.buyButtonPrice = 20;
                    data.buyButtonScoreboard = "money";
                    data.buyButtonItem = "";
                    data.displayOverrides = [];
                    data.nutUINoSizeKey = false;
                    data.nutUIHalf = 0;
                    data.nutUIHeaderButton = false;
                }
            }
        }
    }
    form.title(`${NUT_UI_TAG}${themString}§r${index > -1 ? "Editing" : "Creating"} button${isAddingToGroup ? " in group" : ""} (${data.buyButtonEnabled ? "Buy" : data.sellButtonEnabled ? "Sell" : "Action"})`)

    // Back button
    form.button(NUT_UI_HEADER_BUTTON + "§r§cBack\n§7Go back", `textures/azalea_icons/2`, (player) => {
        uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
    });

    // Icon selector
    form.button(
        "§aSet Icon\n§7Set the icon",
        data.iconID ? icons.resolve(data.iconID) : `textures/azalea_icons/NoTexture`,
        (player) => {
            uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID) => {
                if (iconID != null) data.iconID = iconID;
                return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
            });
        }
    );

    // Display settings
    form.button(
        `§dSet display ${!data.text ? " §c*" : ""}\n§7Set the display of the button`,
        `textures/azalea_icons/edit display`,
        (player) => {
            const displayForm = new ModalForm();
            displayForm.textField("Text§c*", "Text on the button", data.text);
            displayForm.textField("Subtext", "Subtext on the button", data.subtext);
            displayForm.textField("Required Condition", "§r§fCondition required to use button", data.requiredTag, ()=>{}, "Anything you type here normally will just check if the player has the tag.\n\nPlease go to §ehttps://leaf.trashdev.org/conditions §r§ffor more advanced info");
            displayForm.toggle("Disabled?", data.disabled ? true : false, ()=>{}, "§fWill hide the button normally, but will make it grayed out in §cCherryUI §r§flayout.")
            displayForm.show(player, false, (player, response) => {
                if (response.canceled) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                
                data.text = response.formValues[0];
                data.subtext = response.formValues[1];
                data.requiredTag = response.formValues[2];
                data.disabled = response.formValues[3];

                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
            });
        }
    );

    // Action setting (only for new buttons)
    if (index == -1) {
        form.button(
            `§6Set action ${!data.action ? " §c*" : ""}\n§7Set the action of the button`,
            `textures/azalea_icons/action edit`,
            (player) => {
                const actionForm = new ModalForm();
                actionForm.textField("Action§c*", "Command when button clicked", data.action);
                
                actionForm.show(player, false, (player, response) => {
                    if (response.canceled) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                    
                    data.action = response.formValues[0];
                    uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                });
            }
        );
    }
    // if(index > -1) {
    form.button(`${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r§2Sell Button\n§7Sell buttons real`, `textures/azalea_icons/icontextures/diamond`, (player)=>{
        try {
            let modal = new ModalForm();
            modal.toggle("Enable Sell Button (will override any normal actions on the button)", data.sellButtonEnabled ? true : false)
            modal.textField("Item (example: coal, minecraft:diamond, leaf:example_item). Automatically assumes 'minecraft:'", "minecraft:coal", data.sellButtonItem ? data.sellButtonItem : "minecraft:coal")
            modal.slider("Item count", 1, 64, 1, data.sellButtonItemCount ? data.sellButtonItemCount : 4)
            modal.textField("Item Value", "20", data.sellButtonPrice ? data.sellButtonPrice.toString() : "20")
            modal.textField("Scoreboard", "money", data.sellButtonScoreboard ? data.sellButtonScoreboard : "money")
            modal.show(player, false, (player, response)=>{
                data.sellButtonEnabled = response.formValues[0];
                data.sellButtonItem = response.formValues[1];
                data.sellButtonItemCount = response.formValues[2];
                data.sellButtonPrice = parseInt(response.formValues[3]) ? parseInt(response.formValues[3]) : 0;
                data.sellButtonScoreboard = response.formValues[4];
                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
            })
    
        } catch(e) {
            world.sendMessage(`${e}`)
        }
    })
    // }
    // Add buy button menu after sell button
    form.button(`${NUT_UI_LEFT_HALF}§r§bBuy Button\n§7Configure buy button`, null, (player)=>{
        const buyForm = new ActionForm();
        buyForm.title(NUT_UI_TAG + "§rBuy Button Settings");
        
        buyForm.button("§cBack\n§7Return to button editor", "textures/azalea_icons/2", (player) => {
            uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
        });

        buyForm.button(`§aSet Price\n§7Configure price`, "textures/azalea_icons/icontextures/diamond", (player) => {
            const priceForm = new ModalForm();
            priceForm.toggle("Enable Buy Button (will override any normal actions on the button)", data.buyButtonEnabled ? true : false);
            priceForm.textField("Price", "20", data.buyButtonPrice ? data.buyButtonPrice.toString() : "20");
            priceForm.textField("Scoreboard", "money", data.buyButtonScoreboard ? data.buyButtonScoreboard : "money");

            priceForm.show(player, false, (player, response) => {
                if (response.canceled) return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                
                data.buyButtonEnabled = response.formValues[0];
                // Validate price is a number
                const price = parseInt(response.formValues[1]);
                data.buyButtonPrice = isNaN(price) ? 0 : price;
                data.buyButtonScoreboard = response.formValues[2];
                
                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
            });
        });

        buyForm.button(`§eSet Item\n§7Configure item to buy`, "textures/azalea_icons/ChestLarge", (player) => {
            // Placeholder - will be implemented later
            // uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
            uiManager.open(player, config.uiNames.Basic.ItemSelect, (player, item, slot)=>{
                if(item) {
                    let [stash, slot] = itemdb.saveItem(item);
                    data.buyButtonItem = `${stash}:${slot}`;
                    uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                } else {
                    uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                    // uiManager.open(player, config.uiNames.Shop.CategoryAdmin, shopID, categoryID);
    
                }
            })
        });
        if(data.buyButtonItem) {
            buyForm.button(`§cRemove Item\n§7Make this a paid button`, `textures/azalea_icons/Delete`, (player)=>{
                data.buyButtonItem = "";
                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);

            })
        }

        buyForm.show(player, false, () => {});
    });

    // Add Display Overrides button after the display settings button
    form.button(
        `§5Display Overrides\n§7Conditional display settings`,
        `textures/azalea_icons/edit display`,
        (player) => {
            const overridesForm = new ActionForm();
            overridesForm.title(NUT_UI_TAG + "§rDisplay Overrides");

            overridesForm.button("§cBack\n§7Return to button editor", "textures/azalea_icons/2", (player) => {
                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
            });

            // Add override button
            overridesForm.button("§aAdd Override\n§7Add new condition", "textures/azalea_icons/1", (player) => {
                const addOverrideForm = new ModalForm();
                addOverrideForm.textField("Condition (e.g. 'hasTag(\"vip\")')", "Enter condition", "");
                addOverrideForm.textField("Display Text", "Text to show if condition is true", "");
                addOverrideForm.textField("Display Subtext", "Subtext to show if condition is true", "");

                addOverrideForm.show(player, false, (player, response) => {
                    if (!response.canceled && response.formValues[0] && response.formValues[1]) {
                        const newOverride = {
                            condition: response.formValues[0],
                            text: response.formValues[1],
                            subtext: response.formValues[2]
                        };
                        
                        // Open icon selector after basic info is entered
                        uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID) => {
                            if (iconID != null) newOverride.iconID = iconID;
                            data.displayOverrides.push(newOverride);
                            return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                        });
                    } else {
                        uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                    }
                });
            });

            // List existing overrides
            for (let i = 0; i < data.displayOverrides.length; i++) {
                const override = data.displayOverrides[i];
                overridesForm.button(
                    `§eOverride #${i + 1}\n§7${override.condition}`,
                    override.iconID ? icons.resolve(override.iconID) : "textures/azalea_icons/edit display",
                    (player) => {
                        const editOverrideForm = new ActionForm();
                        editOverrideForm.title(`${NUT_UI_TAG}§rEdit Override #${i + 1}`);

                        // Add move up button if not first item
                        if (i > 0) {
                            editOverrideForm.button("§6Move Up\n§7Move override up", "textures/azalea_icons/up_arrow", (player) => {
                                const temp = data.displayOverrides[i];
                                data.displayOverrides[i] = data.displayOverrides[i - 1];
                                data.displayOverrides[i - 1] = temp;
                                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                            });
                        }

                        // Add move down button if not last item
                        if (i < data.displayOverrides.length - 1) {
                            editOverrideForm.button("§6Move Down\n§7Move override down", "textures/azalea_icons/down_arrow", (player) => {
                                const temp = data.displayOverrides[i];
                                data.displayOverrides[i] = data.displayOverrides[i + 1];
                                data.displayOverrides[i + 1] = temp;
                                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                            });
                        }

                        editOverrideForm.button("§cDelete Override\n§7Remove this override", "textures/azalea_icons/Delete", (player) => {
                            data.displayOverrides.splice(i, 1);
                            uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                        });

                        editOverrideForm.button("§aEdit Text\n§7Modify text settings", "textures/azalea_icons/edit display", (player) => {
                            const editForm = new ModalForm();
                            editForm.textField("Condition", "Enter condition", override.condition);
                            editForm.textField("Display Text", "Text to show if condition is true", override.text);
                            editForm.textField("Display Subtext", "Subtext to show if condition is true", override.subtext);

                            editForm.show(player, false, (player, response) => {
                                if (!response.canceled && response.formValues[0] && response.formValues[1]) {
                                    data.displayOverrides[i] = {
                                        ...override,
                                        condition: response.formValues[0],
                                        text: response.formValues[1],
                                        subtext: response.formValues[2]
                                    };
                                }
                                uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                            });
                        });

                        editOverrideForm.button(
                            "§aEdit Icon\n§7Change icon",
                            override.iconID ? icons.resolve(override.iconID) : "textures/azalea_icons/NoTexture",
                            (player) => {
                                uiManager.open(player, config.uiNames.IconViewer, 0, (player, iconID) => {
                                    if (iconID != null) {
                                        data.displayOverrides[i] = {
                                            ...override,
                                            iconID: iconID
                                        };
                                    }
                                    return uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                                });
                            }
                        );

                        editOverrideForm.show(player, false, () => {});
                    }
                );
            }

            overridesForm.show(player, false, () => {});
        }
    );

    // form.button(`§6Cooldown (BETA)\n§7Configure Cooldown`, `textures/items/clock_item`, (player)=>{
    //     let cooldownEditor = new ModalForm();
    //     cooldownEditor.slider("Seconds", 0, 60, 5, da)
    // })


    // Add NUT UI Properties button
    if(ui.data.layout == 4) {
        form.button(
            `§cCherryUI Properties\n§7Configure UI layout`,
            `textures/azalea_icons/DevSettingsClickyClick`,
            (player) => {
                const nutForm = new ModalForm();
                
                // Only show these options if not in a group
                if(!data2?.isGroupButton) {
                    nutForm.toggle("Disable Vertical Size Key (2 buttons on same row)", data.nutUINoSizeKey);
                    nutForm.dropdown("Button Position", [
                        { option: "Whole" },
                        { option: "Left Half" },
                        { option: "Right Half" },
                        { option: "Left Third" },
                        { option: "Middle Third" },
                        { option: "Right Third" }
                    ], data.nutUIHalf);
                    nutForm.toggle("Header Button", data.nutUIHeaderButton);
                }

                nutForm.toggle("Alt Colors", data.nutUIAlt ? true : false);
                nutForm.textField("Alt Color Condition", "Example: $cfg/DevMode", data.nutUIColorCondition ? data.nutUIColorCondition : "");

                nutForm.show(player, false, (player, response) => {
                    if (!response.canceled) {
                        if(!data2?.isGroupButton) {
                            data.nutUINoSizeKey = response.formValues[0];
                            data.nutUIHalf = response.formValues[1];
                            data.nutUIHeaderButton = response.formValues[2];
                            data.nutUIAlt = response.formValues[3];
                            data.nutUIColorCondition = response.formValues[4];
                        } else {
                            data.nutUIAlt = response.formValues[0];
                            data.nutUIColorCondition = response.formValues[1];
                        }
                    }
                    uiManager.open(player, config.uiNames.UIBuilderAddButton, id, index, data, false);
                });
            }
        );
    }

    // Create/Edit button (only shown when required fields are filled)
    if (data.text && (data.action || data.sellButtonEnabled || data.buyButtonEnabled)) {
        const isEditing = index > -1;
        form.button(
            `§a${isEditing ? "Save" : "Create"} button\n§7Click me to ${isEditing ? "save" : "create"}`,
            isEditing ? `textures/azalea_icons/Save` : `textures/azalea_icons/1`,
            (player) => {
                let buttonData = {
                    text: data.text,
                    subtext: data.subtext,
                    action: data.action,
                    iconID: data.iconID,
                    requiredTag: data.requiredTag,
                    displayOverrides: data.displayOverrides,
                    sellButtonEnabled: data.sellButtonEnabled,
                    buyButtonEnabled: data.buyButtonEnabled,
                    nutUIHalf: data.nutUIHalf,
                    nutUINoSizeKey: data.nutUINoSizeKey,
                    nutUIAlt: data.nutUIAlt,
                    disabled: data.disabled,
                    nutUIColorCondition: data.nutUIColorCondition,
                    nutUIHeaderButton: data.nutUIHeaderButton,
                };
                if(data.buyButtonEnabled) {
                    buttonData = {
                        ...buttonData,
                        buyButtonItem: data.buyButtonItem,
                        buyButtonPrice: data.buyButtonPrice,
                        buyButtonScoreboard: data.buyButtonScoreboard,
                    }
                }
                if(data.sellButtonEnabled) {
                    buttonData = {
                        ...buttonData,
                        sellButtonItem: data.sellButtonItem,
                        sellButtonItemCount: data.sellButtonItemCount,
                        sellButtonPrice: data.sellButtonPrice
                    }
                }

                if(isEditing) {
                    if(isEditingGroupButton) {
                        // Update group button
                        ui.data.buttons[index].buttons[data2.buttonIndex] = {
                            ...ui.data.buttons[index].buttons[data2.buttonIndex],
                            ...buttonData
                        }
                    } else {
                        // Update regular button
                        ui.data.buttons[index] = {
                            ...ui.data.buttons[index],
                            ...buttonData
                        }
                    }
                    uiBuilder.db.overwriteDataByID(id, ui.data);
                } else if(isAddingToGroup) {
                    // Add new button to group
                    uiBuilder.addButtonToGroup(id, data2.parentGroup, buttonData);
                } else {
                    // Add new regular button
                    uiBuilder.addButtonToUI(id, data.text, data.subtext, data.action, data.iconID, data.requiredTag, buttonData);
                }
                
                uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
            }
        );
    }

    form.show(player, false, () => {});
});