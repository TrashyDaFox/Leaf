import { formatStr } from "../../api/azaleaFormatting";
import icons from "../../api/icons";
import uiBuilder from "../../api/uiBuilder";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { world } from "@minecraft/server";
import {
    NUT_UI_ALT,
    NUT_UI_HEADER_BUTTON,
    NUT_UI_MODAL,
    NUT_UI_PAPERDOLL,
    NUT_UI_TAG,
    NUT_UI_THEMED,
} from "../preset_browser/nutUIConsts";
import { themes } from "./cherryThemes";
import { ActionFormData } from "@minecraft/server-ui";
import versionData from "../../versionData";
import emojis from "../../api/emojis";
import configAPI from "../../api/config/configAPI";
uiManager.addUI(
    config.uiNames.UIBuilderEditButtonsLegacy,
    "Edit buttons in a UI but make it modern!",
    (player, id, sessionData = {}) => {
        let form = new ActionForm();
        let ui = uiBuilder.db.getByID(id);
        form.title(ui.data.name);
        form.show(player, false, (player, response) => {

        })
    }
)
uiManager.addUI(
    config.uiNames.UIBuilderEditButtons,
    "Edit Buttons in a UI",
    (player, id, multiselect = [], selectingButton = false, response) => {
        if (id == 1719775088275) return;
        let form = uiBuilder.db.getByID(id);
        let view = player.getDynamicProperty(`ViewFilter:${id}`)
            ? player.getDynamicProperty(`ViewFilter:${id}`)
            : 0;
        let views = [];
        for (const button of form.data.buttons) {
            if (!views.length && button.type != "separator") {
                views.push({ name: "Default View", id: -1 });
            }
            if (button.type == "separator") {
                views.push({ name: button.label, id: button.id });
            }
        }
        if (!views.length) {
            views.push({ name: "Default View", id: -1 });
        }
        let viewFilter = -2;
        if (view > 0) {
            let newView = view - 1;
            let viewIndex =
                newView < 0
                    ? 0
                    : newView >= views.length
                        ? views.length - 1
                        : newView;
            viewFilter = views[viewIndex].id;
        }
        let actionForm = new ActionForm();
        let pre = `§r`;
        let snippetBook = uiBuilder.getSnippetBook();
        let nutUIPreview = !player.hasTag("nut-ui-preview-disable");
        if (form.data.layout == 1) pre = `§g§r§i§d§u§i§r`;
        if (form.data.layout == 2) pre = `§f§u§l§l§s§c§r§e§e§n§r`;
        if (form.data.layout == 3) pre = `§t§e§s§t§r`;
        let themID = form.data.theme ? form.data.theme : 0;
        let themString =
            themID > 0
                ? `${NUT_UI_THEMED}${themes[themID] ? themes[themID][0] : ""}`
                : ``;
        let nutUIAlt =
            themID > 0
                ? `${NUT_UI_ALT}${themes[themID] ? themes[themID][0] : ""}`
                : `${NUT_UI_ALT}`;
        if (form.data.layout == 4 && nutUIPreview)
            pre = `§f§0§0${themString}§r`;
        let titleLabels = [];
        if (form.data.layout == 4 && nutUIPreview) {
            titleLabels.push(emojis.green_dot)
        }
        if (form.data.buttons.find(_ => {
            if (_.meta) return true;
            if (_.template && _.template.on) return true;
            if (_.comment) return true;
            if (_.requiredTag) return true;
            return false;
        }) && !player.hasTag("DisableEditorLabels")) {
            titleLabels.push(emojis.oak_sign)
        }
        actionForm.title(
            `${form.data.layout == 4 && form.data.paperdoll
                ? NUT_UI_PAPERDOLL
                : ``
            }${pre}${titleLabels ? `${titleLabels.join('')} ${formatStr("<dra> ")}` : ``}§r${form.data.name}`
        );
        let multiselectMode =
            player.hasTag("ui-builder-multiselect") && !selectingButton;
        // nutUIText = `${button.disabled ? "§e(DISABLED) " : ""}${button.nutUIAlt ? "§a§l§t§b§t§n" : ""}${button.nutUIHalf == 2 ? "§p§1§2" : button.nutUIHalf == 1 ? "§p§2§2" : button.nutUIHalf == 3 ? "§p§2§2§p§2§1" : button.nutUIHalf == 4 ? "§p§2§1§p§1§2" : button.nutUIHalf == 5 ? "§p§1§1§p§1§2" : ""}${button.nutUIHeaderButton ? "§p§4§0" : ""}${button.nutUINoSizeKey ? "§p§0§0" : ""}`;

        actionForm.button(
            `${multiselectMode
                ? ""
                : form.data.layout == 4 && nutUIPreview
                    ? "§p§0§0§p§2§2§r"
                    : ""
            }§cBack\n§7Exit this menu`,
            `textures/azalea_icons/2`,
            (player) => {
                if (selectingButton) {
                    return response(null);
                }
                uiManager.open(player, config.uiNames.UIBuilderEdit, id);
            }
        );
        if (multiselectMode && multiselect.length) {
            actionForm.button(
                `§cDelete ${multiselect.length} button${multiselect.length > 1 ? "s" : ""
                }\n§7Deletes all selected buttons`,
                `textures/azalea_icons/Delete`,
                (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.Basic.Confirmation,
                        `Are you sure you want to delete ${multiselect.length
                        } button${multiselect.length > 1 ? "s" : ""}?`,
                        () => {
                            form.data.buttons = form.data.buttons.filter(
                                (_) => !multiselect.includes(_.id)
                            );
                            uiManager.open(
                                player,
                                config.uiNames.UIBuilderEditButtons,
                                id
                            );
                        },
                        () => {
                            uiManager.open(
                                player,
                                config.uiNames.UIBuilderEditButtons,
                                id,
                                multiselect
                            );
                        }
                    );
                }
            );
        }
        if (!multiselectMode) {
            if (form.data.layout == 4 || form.data.layout == 1) {
                actionForm.button(
                    `${form.data.layout == 4 && nutUIPreview ? "§p§1§2§r" : ""
                    }§dPreview Mode\n§7Current: ${nutUIPreview ? "ON" : "OFF"
                    }`,
                    nutUIPreview
                        ? `textures/azalea_icons/other/play`
                        : `textures/azalea_icons/other/stop`,
                    (player) => {
                        if (player.hasTag("nut-ui-preview-disable")) {
                            player.removeTag("nut-ui-preview-disable");
                        } else {
                            player.addTag("nut-ui-preview-disable");
                        }
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderEditButtons,
                            id,
                            multiselect,
                            selectingButton,
                            response
                        );
                    }
                );
            }
            if (!selectingButton) {
                actionForm.button(
                    `§bAdd Element\n§7Add button, header, or label`,
                    `textures/azalea_icons/other/voxel_add`,
                    (player) => {
                        let addMenu = new ActionForm();
                        addMenu.title(
                            `${NUT_UI_TAG}${themString}§rAdd Element`
                        );

                        addMenu.button(
                            `${NUT_UI_HEADER_BUTTON}§cBack\n§7Return to buttons`,
                            "textures/azalea_icons/2",
                            (player) => {
                                uiManager.open(
                                    player,
                                    config.uiNames.UIBuilderEditButtons,
                                    id
                                );
                            }
                        );

                        addMenu.button(
                            "§aAdd Button\n§7Interactive button",
                            "textures/azalea_icons/other/button",
                            (player) => {
                                uiManager.open(
                                    player,
                                    config.uiNames.UIBuilderAddButton,
                                    id
                                );
                            }
                        );

                        addMenu.button(
                            "§dAdd Button Group\n§7Group of buttons",
                            "textures/azalea_icons/other/group_tiles",
                            (player) => {
                                let modal = new ModalForm();
                                modal.title("Create Button Group");

                                if (form.data.layout === 4) {
                                    modal.toggle(
                                        "Button Row (max 3 buttons)",
                                        false
                                    );
                                    modal.show(
                                        player,
                                        false,
                                        (player, response) => {
                                            if (response.canceled)
                                                return uiManager.open(
                                                    player,
                                                    config.uiNames
                                                        .UIBuilderEditButtons,
                                                    id
                                                );

                                            uiBuilder.addButtonGroupToUI(
                                                id,
                                                form.data.layout === 4
                                                    ? response.formValues[0]
                                                    : false
                                            );
                                            uiManager.open(
                                                player,
                                                config.uiNames
                                                    .UIBuilderEditButtons,
                                                id
                                            );
                                        }
                                    );
                                } else {
                                    uiBuilder.addButtonGroupToUI(id, false);
                                    uiManager.open(
                                        player,
                                        config.uiNames.UIBuilderEditButtons,
                                        id
                                    );
                                }
                            }
                        );
                        let form2 = new ActionFormData();
                        if (form2.divider && form2.header && form2.label) {
                            // if(true) {
                            addMenu.button(
                                "§bAdd Header\n§7Large text display",
                                "textures/azalea_icons/other/font",
                                (player) => {
                                    let modal = new ModalForm();
                                    modal.textField(
                                        "Header Text",
                                        "Enter header text",
                                        ""
                                    );
                                    modal.show(
                                        player,
                                        false,
                                        (player, response) => {
                                            if (response.canceled)
                                                return uiManager.open(
                                                    player,
                                                    config.uiNames
                                                        .UIBuilderEditButtons,
                                                    id
                                                );
                                            if (!response.formValues[0])
                                                return uiManager.open(
                                                    player,
                                                    config.uiNames
                                                        .UIBuilderEditButtons,
                                                    id
                                                );

                                            uiBuilder.addButtonToUI(
                                                id,
                                                response.formValues[0],
                                                null,
                                                "",
                                                "",
                                                "",
                                                {
                                                    type: "header",
                                                    text: response
                                                        .formValues[0],
                                                }
                                            );
                                            uiManager.open(
                                                player,
                                                config.uiNames
                                                    .UIBuilderEditButtons,
                                                id
                                            );
                                        }
                                    );
                                }
                            );
                            addMenu.button(
                                "§eAdd Label\n§7Regular text display",
                                "textures/azalea_icons/other/text",
                                (player) => {
                                    let modal = new ModalForm();
                                    modal.textField(
                                        "Label Text",
                                        "Enter label text",
                                        "",
                                        () => { },
                                        "Meow meow meow! (test)"
                                    );
                                    modal.show(
                                        player,
                                        false,
                                        (player, response) => {
                                            if (response.canceled)
                                                return uiManager.open(
                                                    player,
                                                    config.uiNames
                                                        .UIBuilderEditButtons,
                                                    id
                                                );
                                            if (!response.formValues[0])
                                                return uiManager.open(
                                                    player,
                                                    config.uiNames
                                                        .UIBuilderEditButtons,
                                                    id
                                                );

                                            uiBuilder.addButtonToUI(
                                                id,
                                                response.formValues[0],
                                                null,
                                                "",
                                                "",
                                                "",
                                                {
                                                    type: "label",
                                                    text: response
                                                        .formValues[0],
                                                }
                                            );
                                            uiManager.open(
                                                player,
                                                config.uiNames
                                                    .UIBuilderEditButtons,
                                                id
                                            );
                                        }
                                    );
                                }
                            );

                            addMenu.button(
                                "§9Add Divider\n§7Separator Line",
                                "textures/azalea_icons/other/group",
                                (player) => {
                                    uiBuilder.addButtonToUI(
                                        id,
                                        " ",
                                        null,
                                        "",
                                        "",
                                        "",
                                        {
                                            type: "divider",
                                        }
                                    );
                                    uiManager.open(
                                        player,
                                        config.uiNames.UIBuilderEditButtons,
                                        id
                                    );
                                }
                            );
                        }
                        addMenu.button(`§vAdd State\n§7Add player preferences to this UI!`, `textures/azalea_icons/Save`, (player) => {
                            player.error("Coming Soon")
                            uiManager.open(player, config.uiNames.UIBuilderEditButtons, id, multiselect, selectingButton, response)
                        })
                        addMenu.button(
                            "§6Add View Separator\n§7Permission separator",
                            "textures/azalea_icons/other/door",
                            (player) => {
                                uiManager.open(
                                    player,
                                    config.uiNames.UIBuilderAddSeparator,
                                    id
                                );
                            }
                        );
                        if (form.data.pag) {
                            if (!form.data.buttons.find(_ => _.type == 'pagstart')) {
                                addMenu.button(`§2Pagination Start\n§7Start pagination here`, `textures/azalea_icons/other/play`, (player) => {
                                    form.data.buttons.push({ id: Date.now(), type: "pagstart" })
                                    uiBuilder.db.overwriteDataByID(form.id, form.data)
                                    uiManager.open(player, versionData.uiNames.UIBuilderEditButtons, id, multiselect, selectingButton, response)
                                })
                            }
                            if (!form.data.buttons.find(_ => _.type == 'pagend')) {
                                addMenu.button(`§nPagination End\n§7End pagination here`, `textures/azalea_icons/other/stop`, (player) => {
                                    form.data.buttons.push({ id: Date.now(), type: "pagend" })
                                    uiBuilder.db.overwriteDataByID(form.id, form.data)
                                    uiManager.open(player, versionData.uiNames.UIBuilderEditButtons, id, multiselect, selectingButton, response)
                                })
                            }
                        }
                        addMenu.button(
                            "§5Add Poll\n§7Allow players to vote",
                            "textures/azalea_icons/other/clipboard",
                            (player) => {
                                uiManager.open(
                                    player,
                                    config.uiNames.UIBuilderAddPoll,
                                    id
                                );
                            }
                        );
                        if (id != snippetBook.id) {
                            addMenu.button(
                                "§cAdd from Snippet Book\n§7Snippet book component",
                                icons.resolve(
                                    `^textures/azalea_icons/other/book`
                                ),
                                (player) => {
                                    uiManager.open(
                                        player,
                                        config.uiNames.UIBuilderEditButtons,
                                        snippetBook.id,
                                        [],
                                        true,
                                        (snID) => {
                                            if (snID != null) {
                                                uiBuilder.addButtonToUI(
                                                    id,
                                                    " ",
                                                    null,
                                                    "",
                                                    "",
                                                    "",
                                                    {
                                                        ...snippetBook.data.buttons.find(
                                                            (_) => _.id == snID
                                                        ),
                                                    }
                                                );
                                            }
                                            uiManager.open(
                                                player,
                                                config.uiNames
                                                    .UIBuilderEditButtons,
                                                id
                                            );
                                        }
                                    );
                                }
                            );
                        }

                        addMenu.show(player, false, () => { });
                    }
                );
            }
        }

        if (!selectingButton) {
            actionForm.button(
                `§aMultiselect ${multiselectMode ? "OFF" : "ON"
                }\n§7Multiselect buttons`,
                `textures/azalea_icons/other/checkmark`,
                (player) => {
                    if (multiselectMode) {
                        player.removeTag("ui-builder-multiselect");
                    } else {
                        player.addTag("ui-builder-multiselect");
                    }
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderEditButtons,
                        id
                    );
                }
            );
        }
        if (views.length > 1) {
            let viewList = ["All", ...views.map((_) => _.name)];
            let viewIndex =
                view < 0
                    ? 0
                    : view >= viewList.length
                        ? viewList.length - 1
                        : view;
            actionForm.button(
                `§cSet View Filter\n§7Current: ${viewList[viewIndex]}`,
                null,
                (player) => {
                    player.setDynamicProperty(
                        `ViewFilter:${id}`,
                        viewIndex + 1 >= viewList.length ? 0 : viewIndex + 1
                    );
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderEditButtons,
                        id,
                        multiselect,
                        selectingButton,
                        response
                    );
                }
            );
        }
        if (player.hasTag("DisableEditorLabels") || form.data.buttons.find(_ => {
            if (_.meta) return true;
            if (_.template && _.template.on) return true;
            if (_.comment) return true;
            if (_.requiredTag) return true;
            return false;
        })) {
            actionForm.button(`${form.data.layout == 4 && nutUIPreview ? `${NUT_UI_HEADER_BUTTON}§r` : ``}§dEditor Labels\n§7Current: ${player.hasTag("DisableEditorLabels") ? `OFF` : `ON`}`, `textures/azalea_icons/11`, (player) => {
                if (player.hasTag("DisableEditorLabels")) player.removeTag("DisableEditorLabels")
                else player.addTag("DisableEditorLabels")
                uiManager.open(
                    player,
                    config.uiNames.UIBuilderEditButtons,
                    id,
                    multiselect,
                    selectingButton,
                    response
                );
            })
        }
        if (!nutUIPreview && form.data.layout == 4) {
            // actionForm.button(`§p§4§0§r§f§aPreview Mode OFF\n§7This will give you a raw view of your UI.`, `textures/ui/icon_preview`)
        }
        // Add Button section with submenu

        if (form.data.layout == 0 || form.data.layout == 4) {
            if (form.data.body && !player.hasTag("DisableEditorLabels")) {
                actionForm.label(`§r${form.data.body}`)
            }
            actionForm.divider();
        }
        /*
        "$key": "§p§4§0",
"$BUTTON_SIZER_left_third": "§p§1§1",
    "$BUTTON_SIZER_right_third": "§p§2§1",
    "$BUTTON_SIZER_left_half": "§p§1§2",
    "$BUTTON_SIZER_right_half": "§p§2§2",
    "$VERTICAL_PROCESSING_no_height_key": "§p§0§0",
    */
        // List existing buttons/headers/labels
        let currView = -1;
        for (let index = 0; index < form.data.buttons.length; index++) {
            let button = form.data.buttons[index];
            if (viewFilter != -2) {
                if (button.type == "separator") {
                    currView = button.id;
                    continue;
                }
                if (currView != viewFilter) continue;
            }
            // let isSnippetBook = false;
            // if(button.type == "snippetbook") {
            //     button = snippetBook.buttons.find(_=>_.id == button.snippetBookID)
            //     if(!button) continue;
            //     isSnippetBook = true;
            // }
            if (button.type == "pagstart") {
                let btnIndex = index;
                actionForm.button(`§2Pagination Start\n§r§7Pagination starts here`, `textures/azalea_icons/other/play`, (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderEditButton,
                        id,
                        btnIndex
                    )
                })
                continue;
            }
            if (button.type == "pagend") {
                let btnIndex = index;
                actionForm.button(`§nPagination End\n§r§7Pagination ends here`, `textures/azalea_icons/other/stop`, (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderEditButton,
                        id,
                        btnIndex
                    )
                })
                continue;
            }
            if (button.type == "poll") {
                let btnIndex = index;
                actionForm.button(`§b[POLL] ${button.title ? button.title : "Unknown"}\n§r§7${button.options.join('§r§7, ')}`, null, (player) => {
                    uiManager.open(
                        player,
                        config.uiNames.UIBuilderEditButton,
                        id,
                        btnIndex
                    )
                })
                continue;
            }
            if (button.type == "separator") {
                let clearModes = ["NONE", "ALL", "VIEW", "NOTDEFAULT"];
                let btnIndex = index;
                actionForm.button(
                    `§d[Separator] ${button.label}\n§r§7Condition: ${button.condition
                    }, ${clearModes[button.clearMode ? button.clearMode : 0]}`,
                    null,
                    (player) => {
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderEditButton,
                            id,
                            btnIndex
                        );
                    }
                );
                continue;
            }
            if (button.type === "group") {
                let isButtonRow = form.data.layout === 4 && button.buttonRow;
                let groupText = isButtonRow ? "§eButton Row" : "§eButton Group"; // probably wouldnt care
                const groupIndex = index;
                let buttonCount = button.buttons.length;

                actionForm.button(
                    `${groupText}\n§7${buttonCount} button${buttonCount !== 1 ? "s" : ""
                    }`,
                    "textures/azalea_icons/ClickyClick",
                    (player) => {
                        if (selectingButton) return response(button.id);
                        let groupMenu = new ActionForm();
                        groupMenu.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[68][0]}${isButtonRow ? "Edit Button Row" : "Edit Button Group"}`);

                        groupMenu.button(
                            "§cBack\n§7Return to buttons",
                            "textures/azalea_icons/2",
                            (player) => {
                                uiManager.open(
                                    player,
                                    config.uiNames.UIBuilderEditButtons,
                                    id
                                );
                            }
                        );

                        groupMenu.button(
                            "§dPreview\n§7See how it looks",
                            "textures/ui/icon_preview",
                            (player) => {
                                let previewForm = new ActionForm();
                                previewForm.title(`${pre}${form.data.name}`);

                                for (const groupButton of button.buttons) {
                                    let nutUIText = "";
                                    if (
                                        form.data.layout === 4 &&
                                        nutUIPreview
                                    ) {
                                        // Base NUT UI formatting
                                        nutUIText = `${groupButton.disabled ? "§p§3§0" : ""
                                            }${groupButton.nutUIAlt ||
                                                (groupButton.nutUIColorCondition
                                                    ? this.playerIsAllowed(
                                                        player,
                                                        groupButton.nutUIColorCondition
                                                    )
                                                    : false)
                                                ? "§a§l§t§b§t§n"
                                                : ""
                                            }`;

                                        if (button.buttonRow) {
                                            // Button Row formatting (max 3 buttons)
                                            switch (button.buttons.length) {
                                                case 1:
                                                    nutUIText += "§p§0§0"; // Whole width
                                                    break;
                                                case 2:
                                                    if (index === 0) {
                                                        nutUIText +=
                                                            "§p§2§2§p§0§0"; // Left half with no vertical size key
                                                    } else {
                                                        nutUIText += "§p§1§2"; // Right half
                                                    }
                                                    break;
                                                case 3:
                                                    if (index === 0) {
                                                        nutUIText +=
                                                            "§p§2§2§p§2§1§p§0§0"; // Left third with no vertical size key
                                                    } else if (index === 1) {
                                                        nutUIText +=
                                                            "§p§2§1§p§1§2§p§0§0"; // Middle third with no vertical size key
                                                    } else {
                                                        nutUIText +=
                                                            "§p§1§1§p§1§2"; // Right third
                                                    }
                                                    break;
                                            }
                                        } else {
                                            nutUIText += "§p§0§0"; // Full width for each button
                                        }

                                        if (groupButton.nutUIHeaderButton) {
                                            nutUIText += "§p§4§0";
                                        }
                                    }

                                    previewForm.button(
                                        `${form.data.layout == 4 &&
                                            nutUIPreview
                                            ? `${nutUIText}§r§f`
                                            : ""
                                        }${groupButton.text}${groupButton.subtext
                                            ? `\n§7${groupButton.subtext}`
                                            : ""
                                        }`,
                                        groupButton.iconID
                                            ? icons.resolve(groupButton.iconID)
                                            : null,
                                        () => { }
                                    );
                                }

                                previewForm.show(player, false, () => {
                                    uiManager.open(
                                        player,
                                        config.uiNames.UIBuilderEditButtons,
                                        id
                                    );
                                });
                            }
                        );

                        if (form.data.layout === 4) {
                            groupMenu.button(
                                `§6Button Row: ${button.buttonRow ? "ON" : "OFF"
                                }\n§7Max 3 buttons per row`,
                                null,
                                (player) => {
                                    button.buttonRow = !button.buttonRow;
                                    uiBuilder.db.overwriteDataByID(
                                        id,
                                        form.data
                                    );
                                    uiManager.open(
                                        player,
                                        config.uiNames.UIBuilderEditButtons,
                                        id
                                    );
                                }
                            );
                        }

                        if (!button.buttonRow || button.buttons.length < 3) {
                            groupMenu.button(
                                "§aAdd Button\n§7Add to group",
                                "textures/azalea_icons/add_button",
                                (player) => {
                                    uiManager.open(
                                        player,
                                        config.uiNames.UIBuilderAddButton,
                                        id,
                                        -1,
                                        {
                                            parentGroup: groupIndex,
                                            displayOverrides: [],
                                            iconOverrides: [],
                                            actions: [],
                                        }
                                    );
                                }
                            );
                        }

                        for (let i = 0; i < button.buttons.length; i++) {
                            let groupButton = button.buttons[i];
                            let moveText = isButtonRow
                                ? `§r${groupButton.text}`
                                : `§r${groupButton.text}`;

                            groupMenu.button(
                                `${moveText}${groupButton.subtext
                                    ? `\n§7${groupButton.subtext}`
                                    : ""
                                }`,
                                groupButton.iconID
                                    ? icons.resolve(groupButton.iconID)
                                    : null,
                                (player) => {
                                    let buttonMenu = new ActionForm();
                                    buttonMenu.title(`${NUT_UI_TAG}${NUT_UI_THEMED}${themes[68][0]}` + "Button Options");

                                    buttonMenu.button(
                                        "§cBack",
                                        "textures/azalea_icons/2",
                                        (player) => {
                                            uiManager.open(
                                                player,
                                                config.uiNames
                                                    .UIBuilderEditButtons,
                                                id
                                            );
                                        }
                                    );

                                    buttonMenu.button(
                                        "§eEdit Button",
                                        "textures/azalea_icons/Extra UI settings",
                                        (player) => {
                                            uiManager.open(
                                                player,
                                                config.uiNames
                                                    .UIBuilderAddButton,
                                                id,
                                                groupIndex,
                                                {
                                                    isGroupButton: true,
                                                    buttonIndex: i,
                                                    ...groupButton,
                                                }
                                            );
                                        }
                                    );

                                    // Add edit actions button
                                    buttonMenu.button(
                                        `§uEdit Actions\n§7Edit the actions`,
                                        `textures/azalea_icons/action edit`,
                                        (player) => {
                                            // Initialize actions array if it doesn't exist
                                            if (!groupButton.actions) {
                                                groupButton.actions =
                                                    groupButton.action
                                                        ? [groupButton.action]
                                                        : [];
                                                uiBuilder.db.overwriteDataByID(
                                                    id,
                                                    form.data
                                                );
                                            }

                                            uiManager.open(
                                                player,
                                                "edit_actions",
                                                id,
                                                groupIndex,
                                                i
                                            );
                                        }
                                    );

                                    if (i > 0) {
                                        buttonMenu.button(
                                            isButtonRow
                                                ? "§aMove Left"
                                                : "§aMove Up",
                                            isButtonRow
                                                ? icons.resolve('rpgiab/arrow_left')
                                                : icons.resolve('rpgiab/arrow_raise'),
                                            (player) => {
                                                // Store current button
                                                const currentButton =
                                                    button.buttons[i];
                                                // Store previous button
                                                const prevButton =
                                                    button.buttons[i - 1];
                                                // Swap positions
                                                button.buttons[i - 1] =
                                                    currentButton;
                                                button.buttons[i] = prevButton;
                                                // Save changes
                                                uiBuilder.db.overwriteDataByID(
                                                    id,
                                                    form.data
                                                );
                                                uiManager.open(
                                                    player,
                                                    config.uiNames
                                                        .UIBuilderEditButtons,
                                                    id
                                                );
                                            }
                                        );
                                    }
                                    // were u on crack when making this
                                    if (i < button.buttons.length - 1) {
                                        buttonMenu.button(
                                            isButtonRow
                                                ? "§6Move Right"
                                                : "§6Move Down",
                                            isButtonRow
                                                ? icons.resolve('rpgiab/arrow_right')
                                                : icons.resolve('rpgiab/arrow_lower'),
                                            (player) => {
                                                // Store current button
                                                const currentButton =
                                                    button.buttons[i];
                                                // Store next button
                                                const nextButton =
                                                    button.buttons[i + 1];
                                                // Swap positions
                                                button.buttons[i + 1] =
                                                    currentButton;
                                                button.buttons[i] = nextButton;
                                                // Save changes
                                                uiBuilder.db.overwriteDataByID(
                                                    id,
                                                    form.data
                                                );
                                                uiManager.open(
                                                    player,
                                                    config.uiNames
                                                        .UIBuilderEditButtons,
                                                    id
                                                );
                                            }
                                        );
                                    }

                                    buttonMenu.button(
                                        "§cDelete Button",
                                        "textures/azalea_icons/Delete",
                                        (player) => {
                                            // Remove button at specific index
                                            button.buttons.splice(i, 1);
                                            // Save changes
                                            uiBuilder.db.overwriteDataByID(
                                                id,
                                                form.data
                                            );
                                            uiManager.open(
                                                player,
                                                config.uiNames
                                                    .UIBuilderEditButtons,
                                                id
                                            );
                                        }
                                    );

                                    buttonMenu.show(player, false, () => { });
                                }
                            );
                        }

                        if (groupIndex > 0) {
                            groupMenu.button(
                                "§aMove Up\n§7Move group up",
                                icons.resolve('rpgiab/arrow_raise'),
                                (player) => {
                                    uiBuilder.moveButtonInUI(
                                        id,
                                        "up",
                                        groupIndex
                                    );
                                    uiManager.open(
                                        player,
                                        config.uiNames.UIBuilderEditButtons,
                                        id
                                    );
                                }
                            );
                        }

                        if (groupIndex < form.data.buttons.length - 1) {
                            groupMenu.button(
                                "§6Move Down\n§7Move group down",
                                icons.resolve('rpgiab/arrow_lower'),
                                (player) => {
                                    uiBuilder.moveButtonInUI(
                                        id,
                                        "down",
                                        groupIndex
                                    );
                                    uiManager.open(
                                        player,
                                        config.uiNames.UIBuilderEditButtons,
                                        id
                                    );
                                }
                            );
                        }

                        groupMenu.button(
                            "§aDuplicate Group\n§7Create a copy",
                            "textures/azalea_icons/copy",
                            (player) => {
                                // Create deep copy of the group
                                const groupCopy = JSON.parse(
                                    JSON.stringify(button)
                                );

                                // Insert copy after current group
                                form.data.buttons.splice(
                                    groupIndex + 1,
                                    0,
                                    groupCopy
                                );
                                uiBuilder.db.overwriteDataByID(id, form.data);
                                uiManager.open(
                                    player,
                                    config.uiNames.UIBuilderEditButtons,
                                    id
                                );
                            }
                        );

                        groupMenu.button(
                            "§cDelete Group\n§7Remove entire group",
                            "textures/azalea_icons/Delete",
                            (player) => {
                                uiManager.open(
                                    player,
                                    config.uiNames.Basic.Confirmation,
                                    "Are you sure you want to delete this group?",
                                    () => {
                                        form.data.buttons.splice(groupIndex, 1);
                                        uiBuilder.db.overwriteDataByID(
                                            id,
                                            form.data
                                        );
                                        uiManager.open(
                                            player,
                                            config.uiNames.UIBuilderEditButtons,
                                            id
                                        );
                                    },
                                    () => {
                                        uiManager.open(
                                            player,
                                            config.uiNames.UIBuilderEditButtons,
                                            id
                                        );
                                    }
                                );
                            }
                        );

                        groupMenu.show(player, false, () => { });
                    }
                );
                continue;
            }

            let nutUIText = "";
            try {
                nutUIText = `${button.disabled ? "§e(DISABLED) " : ""}${button.nutUIAlt ? typeof button.altBtnColorOverride === "number" && button.altBtnColorOverride != -1 ? `${NUT_UI_ALT}${themes[button.altBtnColorOverride][0]}` : nutUIAlt : ""
                    }${button.nutUIHalf == 2
                        ? "§p§1§2"
                        : button.nutUIHalf == 1
                            ? "§p§2§2"
                            : button.nutUIHalf == 3
                                ? "§p§2§2§p§2§1"
                                : button.nutUIHalf == 4
                                    ? "§p§2§1§p§1§2"
                                    : button.nutUIHalf == 5
                                        ? "§p§1§1§p§1§2"
                                        : ""
                    }${button.nutUIHeaderButton ? "§p§4§0" : ""}${button.nutUINoSizeKey ? "§p§0§0" : ""
                    }`;
            } catch (e) {
                player.sendMessage(`Failed to load NUT UI DATA: ${e}`);
            }
            let displayText =
                button.type === "header"
                    ? `§b[Header] §r§f${button.text}`
                    : button.type === "label"
                        ? `§e[Label] §r§f${button.text}`
                        : button.type == "divider"
                            ? `§v-=-=-=- §f[Divider] §v-=-=-=-`
                            : formatStr(
                                `${form.data.layout == 4 && nutUIPreview
                                    ? `${nutUIText}§r§f`
                                    : ""
                                }${button.text}${button.subtext ? `\n§r§7${button.subtext}` : ``
                                }`,
                                player
                            );
            let labels = [];
            if (button.meta) {
                labels.push(`${emojis.blue_dot} §9${button.meta}`)
            }
            if (button.template && button.template.on) {
                labels.push(`${emojis.green_dot} §2TEMPLATE, ${button.template.start}-${button.template.end}`)
            }
            if (button.comment && button.comment) {
                labels.push(`${emojis.orange_dot} §6${button.comment}`)
            }
            if (button.requiredTag) {
                labels.push(`${emojis.yellow_check} §eCondition: ${button.requiredTag}`)
            }
            if (labels.length && !player.hasTag("DisableEditorLabels")) {
                if (index > 0) actionForm.divider();
                actionForm.label(`§r§f${labels.join('§r ')}`)
            }
            actionForm.button(
                displayText,
                multiselectMode
                    ? multiselect.includes(button.id)
                        ? "textures/azalea_icons/other/checkbox"
                        : "textures/azalea_icons/other/checkbox_off"
                    : button.type == "header" ? "textures/azalea_icons/other/font"
                        : button.type == "label" ? "textures/azalea_icons/other/text"
                            : button.type == "divider" ? "textures/azalea_icons/other/group"
                                : button.iconID
                                    ? icons.resolve(button.iconID)
                                    : null,
                (player) => {
                    if (multiselectMode) {
                        if (multiselect.includes(button.id)) {
                            multiselect = multiselect.filter(
                                (_) => _ != button.id
                            );
                        } else {
                            multiselect.push(button.id);
                        }
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderEditButtons,
                            id,
                            multiselect
                        );
                        return;
                    }
                    if (button.type === "header" || button.type === "label") {
                        if (selectingButton) return response(button.id);

                        // let modal = new ModalForm();
                        // modal.textField(`${button.type === "header" ? "Header" : "Label"} Text`, "Enter text", button.text);
                        // modal.show(player, false, (player, response)=>{
                        //     if(response.canceled) return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                        //     if(!response.formValues[0]) return uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);

                        //     form.data.buttons[index].text = response.formValues[0];
                        //     uiBuilder.db.overwriteDataByID(id, form.data);
                        //     uiManager.open(player, config.uiNames.UIBuilderEditButtons, id);
                        // });
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderEditButton,
                            id,
                            index
                        );
                    } else {
                        if (selectingButton) return response(button.id);
                        uiManager.open(
                            player,
                            config.uiNames.UIBuilderEditButton,
                            id,
                            index
                        );
                    }
                }
            );
            if (labels.length && !player.hasTag("DisableEditorLabels")) actionForm.divider();
        }

        actionForm.show(player, false, (player, response) => { });
    }
);
