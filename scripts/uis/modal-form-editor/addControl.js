import uiBuilder from "../../api/uiBuilder";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import versionData from "../../versionData";
import { NUT_UI_TAG, NUT_UI_THEMED } from "../preset_browser/nutUIConsts";
import { themes } from "../uiBuilder/cherryThemes";

/*
control types:

text-field-using-command
properties:
- preserve
- placeholder
- label
- default value
- command

toggle-using-tag
properties:
- tag
- label

toggle-using-command
properties:
- responseFormat
 - can be true/false, 1/0
 - default: true/false
- command

dropdown-using-command
properties:
- label
- preserve
- options
 - label
 - commandOverride (optional)
- responseFormat
 - dropdown label
 - index (starting with 0)
 - index (starting with 1)
- action (base command)

dropdown-using tag
properties:
- label
- options
 - label
 - tag

dropdown-using-score
properties:
- objective
- startWithZero
- options
 - label

slider-using-command
properties:
- command
- label
- max
- min
- step

slider-using-score
properties:
- objective
- label
- min
- max
- step
*/

uiManager.addUI(
    versionData.uiNames.Modal.AddControl,
    "ADD CONTROL",
    (player, id, controlIndex = -1, data = {}, tempData = {}) => {
        let ui = uiBuilder.getByID(id);
        if (controlIndex != -1) {
            data = ui.data.controls[controlIndex];
        } else {
            data.id = Date.now();
        }

        if (!data.type) {
            let form = new ActionForm();
            form.title(NUT_UI_TAG+NUT_UI_THEMED+themes[25][0]+"§rSelect control type");
            form.button(
                `§6Divider\n§7Separator line`,
                `textures/azalea_icons/other/door`,
                (player) => {
                    data.type = `divider`;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.button(
                `§eHeader\n§7Large display text`,
                `textures/azalea_icons/add_header`,
                (player) => {
                    data.type = `header`;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.button(
                `§eLabel\n§7(Small display text)`,
                `textures/azalea_icons/add_label`,
                (player) => {
                    data.type = `label`;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.button(
                `§vText Field\n§7(Using command)`,
                `textures/azalea_icons/GUIMaker/ModalsV2/add text box`,
                (player) => {
                    data.type = `text-field-using-command`;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.button(
                `§nToggle\n§7(Using tag)`,
                `textures/azalea_icons/GUIMaker/ModalsV2/Toggle tag`,
                (player) => {
                    data.type = `toggle-using-tag`;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.button(
                `§nToggle\n§7(Using command)`,
                `textures/azalea_icons/GUIMaker/ModalsV2/Toggle command`,
                (player) => {
                    data.type = `toggle-using-command`;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.button(
                `§bDropdown\n§7(Using command)`,
                `textures/azalea_icons/GUIMaker/ModalsV2/dropdown`,
                (player) => {
                    data.type = `dropdown-using-command`;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.button(
                `§bDropdown\n§7(Using tags)`,
                `textures/azalea_icons/GUIMaker/ModalsV2/Dropdown tags`,
                (player) => {
                    data.type = `dropdown-using-tags`;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.button(
                `§bDropdown\n§7(Using score)`,
                `textures/azalea_icons/GUIMaker/ModalsV2/Dropdown score`,
                (player) => {
                    data.type = `dropdown-using-score`;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.button(
                `§cSlider\n§c(Using score)`,
                `textures/azalea_icons/GUIMaker/ModalsV2/Slider score`,
                (player) => {
                    data.type = `slider-using-score`;
                    data.step = 1;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.button(
                `§cSlider\n§c(Using command)`,
                `textures/azalea_icons/GUIMaker/ModalsV2/Slider command`,
                (player) => {
                    data.type = `slider-using-command`;
                    data.step = 1;
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                }
            );
            form.show(player, false, (player, response) => {});
            return;
        }

        function createOrEdit() {
            if (controlIndex != -1) {
                ui.data.controls[controlIndex] = data;
                uiBuilder.db.overwriteDataByID(ui.id, ui.data);
            } else {
                ui.data.controls.push(data);
                uiBuilder.db.overwriteDataByID(ui.id, ui.data);
            }
            uiManager.open(player, versionData.uiNames.Modal.EditControls, id);
        }

        if (data.type == "text-field-using-command") {
            /*
            text-field-using-command
            properties:
            - preserve
            - placeholder
            - label
            - default value
            - command
        */

            let form = new ActionForm();
            form.button(`Set Display`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Label",
                    "Type a label here",
                    data.label ? data.label : undefined
                );
                modal.textField(
                    "Placeholder",
                    "Type a placeholder here",
                    data.placeholder ? data.placeholder : undefined
                );
                modal.toggle("Preserve Value", data.preserve ?? false);
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.label = response.formValues[0];
                    data.placeholder = response.formValues[1];
                    data.preserve = response.formValues[2];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(`Set Action`, null, (player) => {
                let modal = new ModalForm();
                modal.title("Code Editor")
                modal.textField(
                    "Action",
                    "Type an action here",
                    data.action ? data.action : undefined
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.action = response.formValues[0];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            if (data.label && data.placeholder && data.action) {
                form.button(
                    `${controlIndex == -1 ? "Create" : "Edit"}`,
                    null,
                    (player) => {
                        createOrEdit();
                    }
                );
            }
            form.show(player, false, (player, response) => {});
        }
        if (data.type == "toggle-using-tag") {
            let form = new ActionForm();
            form.button(`Set Display`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Label",
                    "Type a label here",
                    data.label ? data.label : undefined
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.label = response.formValues[0];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(`Set Tag`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Tag",
                    "Type a tag here",
                    data.tag ? data.tag : undefined
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.tag = response.formValues[0];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            if (data.label && data.tag) {
                form.button(
                    `${controlIndex == -1 ? "Create" : "Edit"}`,
                    null,
                    (player) => {
                        createOrEdit();
                    }
                );
            }
            form.show(player, false, () => {});
        }
        if (data.type == "toggle-using-command") {
            let form = new ActionForm();
            form.button(`Set Display`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Label",
                    "Type a label here",
                    data.label ? data.label : undefined
                );
                modal.toggle("Preserve Value", data.preserve ?? false);
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.label = response.formValues[0];
                    data.preserve = response.formValues[1];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(`Set Action`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Action",
                    "Type an action here",
                    data.action ? data.action : undefined
                );
                modal.dropdown(
                    "Response Format",
                    ["true/false", "1/0"].map((_) => {
                        return {
                            option: _,
                            callback() {},
                        };
                    }),
                    data.responseFormat == "1/0" ? 1 : 0
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.action = response.formValues[0];
                    data.responseFormat =
                        response.formValues[1] == 1 ? "1/0" : "true/false";
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            if (data.label && data.action) {
                form.button(
                    `${controlIndex == -1 ? "Create" : "Edit"}`,
                    null,
                    (player) => {
                        createOrEdit();
                    }
                );
            }
            form.show(player, false, () => {});
        }
        if (data.type == "dropdown-using-command") {
            if (!data.options) data.options = [];
            let form = new ActionForm();
            form.button(`Set Display`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Label",
                    "Type a label here",
                    data.label ? data.label : undefined
                );
                modal.toggle("Preserve Value", data.preserve ?? false);
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.label = response.formValues[0];
                    data.preserve = response.formValues[1];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(`Add Option`, null, (player) => {
                let modal = new ModalForm();
                modal.textField("Label", "Option label", undefined);
                modal.textField(
                    "Command Override (optional)",
                    "Custom command for this option",
                    undefined
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.options.push({
                        label: response.formValues[0],
                        commandOverride: response.formValues[1] || undefined,
                    });
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            if (data.options.length > 0) {
                form.button(`Remove Option`, null, (player) => {
                    let modal = new ActionForm();
                    for (let option of data.options) {
                        modal.button(option.label, null, () => {
                            data.options = data.options.filter(
                                (o) => o != option
                            );
                            uiManager.open(
                                player,
                                versionData.uiNames.Modal.AddControl,
                                id,
                                controlIndex,
                                data,
                                tempData
                            );
                        });
                    }
                    modal.show(player, false, () => {});
                });

                form.button(`Rearrange Options`, null, (player) => {
                    let modal = new ActionForm();
                    modal.body(
                        "Select an option to move, then choose its new position"
                    );
                    for (let option of data.options) {
                        modal.button(option.label, null, () => {
                            let moveModal = new ActionForm();
                            moveModal.body(
                                `Where should "${option.label}" be moved to?`
                            );

                            for (let i = 0; i < data.options.length; i++) {
                                if (data.options[i] !== option) {
                                    moveModal.button(
                                        `Move before "${data.options[i].label}"`,
                                        null,
                                        () => {
                                            data.options = data.options.filter(
                                                (o) => o !== option
                                            );
                                            data.options.splice(
                                                i > data.options.indexOf(option)
                                                    ? i - 1
                                                    : i,
                                                0,
                                                option
                                            );
                                            uiManager.open(
                                                player,
                                                versionData.uiNames.Modal
                                                    .AddControl,
                                                id,
                                                controlIndex,
                                                data,
                                                tempData
                                            );
                                        }
                                    );
                                }
                            }
                            moveModal.button(`Move to end`, null, () => {
                                data.options = data.options.filter(
                                    (o) => o !== option
                                );
                                data.options.push(option);
                                uiManager.open(
                                    player,
                                    versionData.uiNames.Modal.AddControl,
                                    id,
                                    controlIndex,
                                    data,
                                    tempData
                                );
                            });
                            moveModal.show(player, false, () => {});
                        });
                    }
                    modal.show(player, false, () => {});
                });
            }
            form.button(`Set Base Command`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Base Command",
                    "Type base command here",
                    data.action ? data.action : undefined
                );
                modal.dropdown(
                    "Response Format",
                    ["Dropdown Label", "Index (0)", "Index (1)"].map((_) => {
                        return {
                            option: _,
                            callback() {},
                        };
                    }),
                    data.responseFormat || 0
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.action = response.formValues[0];
                    data.responseFormat = response.formValues[1];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            if (data.label && data.action && data.options.length > 0) {
                form.button(
                    `${controlIndex == -1 ? "Create" : "Edit"}`,
                    null,
                    (player) => {
                        createOrEdit();
                    }
                );
            }
            form.show(player, false, () => {});
        }
        if (data.type == "dropdown-using-tags") {
            if (!data.options) data.options = [];
            let form = new ActionForm();
            form.button(`Set Display`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Label",
                    "Type a label here",
                    data.label ? data.label : undefined
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.label = response.formValues[0];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(`Add Option`, null, (player) => {
                let modal = new ModalForm();
                modal.textField("Label", "Option label", undefined);
                modal.textField("Tag", "Tag to set", undefined);
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.options.push({
                        label: response.formValues[0],
                        tag: response.formValues[1],
                    });
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            if (data.options.length > 0) {
                form.button(`Remove Option`, null, (player) => {
                    let modal = new ActionForm();
                    for (let option of data.options) {
                        modal.button(option.label, null, () => {
                            data.options = data.options.filter(
                                (o) => o != option
                            );
                            uiManager.open(
                                player,
                                versionData.uiNames.Modal.AddControl,
                                id,
                                controlIndex,
                                data,
                                tempData
                            );
                        });
                    }
                    modal.show(player, false, () => {});
                });

                form.button(`Rearrange Options`, null, (player) => {
                    let modal = new ActionForm();
                    modal.body(
                        "Select an option to move, then choose its new position"
                    );
                    for (let option of data.options) {
                        modal.button(option.label, null, () => {
                            let moveModal = new ActionForm();
                            moveModal.body(
                                `Where should "${option.label}" be moved to?`
                            );

                            for (let i = 0; i < data.options.length; i++) {
                                if (data.options[i] !== option) {
                                    moveModal.button(
                                        `Move before "${data.options[i].label}"`,
                                        null,
                                        () => {
                                            // Remove option from current position
                                            data.options = data.options.filter(
                                                (o) => o !== option
                                            );
                                            // Insert at new position
                                            data.options.splice(
                                                i > data.options.indexOf(option)
                                                    ? i - 1
                                                    : i,
                                                0,
                                                option
                                            );
                                            uiManager.open(
                                                player,
                                                versionData.uiNames.Modal
                                                    .AddControl,
                                                id,
                                                controlIndex,
                                                data,
                                                tempData
                                            );
                                        }
                                    );
                                }
                            }
                            moveModal.button(`Move to end`, null, () => {
                                // Remove option from current position
                                data.options = data.options.filter(
                                    (o) => o !== option
                                );
                                // Add to end
                                data.options.push(option);
                                uiManager.open(
                                    player,
                                    versionData.uiNames.Modal.AddControl,
                                    id,
                                    controlIndex,
                                    data,
                                    tempData
                                );
                            });
                            moveModal.show(player, false, () => {});
                        });
                    }
                    modal.show(player, false, () => {});
                });
            }
            if (data.label && data.options.length > 0) {
                form.button(
                    `${controlIndex == -1 ? "Create" : "Edit"}`,
                    null,
                    (player) => {
                        createOrEdit();
                    }
                );
            }
            form.show(player, false, () => {});
        }
        if (data.type == "dropdown-using-score") {
            if (!data.options) data.options = [];
            let form = new ActionForm();
            form.button(`Set Display`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Label",
                    "Type a label here",
                    data.label ? data.label : undefined
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.label = response.formValues[0];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(`Set Score Settings`, null, (player) => {
                let modal = new ModalForm();
                modal.textField("Objective", "Score objective", data.objective);
                modal.toggle("Start With Zero", data.startWithZero ?? true);
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.objective = response.formValues[0];
                    data.startWithZero = response.formValues[1];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(
                `Set Options (${data.options.length})`,
                null,
                (player) => {
                    let modal = new ModalForm();
                    modal.textField(
                        "Options (separate with comma)",
                        "Option 1, Option 2, Option 3",
                        data.options.map((o) => o.label).join(", ")
                    );
                    modal.show(player, false, (player, response) => {
                        if (response.canceled)
                            return uiManager.open(
                                player,
                                versionData.uiNames.Modal.AddControl,
                                id,
                                controlIndex,
                                data,
                                tempData
                            );
                        data.options = response.formValues[0]
                            .split(",")
                            .map((label) => ({ label: label.trim() }));
                        uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    });
                }
            );
            if (data.label && data.objective && data.options.length > 0) {
                form.button(
                    `${controlIndex == -1 ? "Create" : "Edit"}`,
                    null,
                    (player) => {
                        createOrEdit();
                    }
                );
            }
            form.show(player, false, () => {});
        }
        if (data.type == "slider-using-score") {
            let form = new ActionForm();
            form.button(`Set Display`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Label",
                    "Type a label here",
                    data.label ? data.label : undefined
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.label = response.formValues[0];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(`Set Score Settings`, null, (player) => {
                let modal = new ModalForm();
                modal.textField("Objective", "Score objective", data.objective);
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.objective = response.formValues[0];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(`Set Range`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Minimum",
                    "Minimum value",
                    data.min?.toString() ?? "0"
                );
                modal.textField(
                    "Maximum",
                    "Maximum value",
                    data.max?.toString() ?? "10"
                );
                modal.textField(
                    "Step",
                    "Step value",
                    data.step?.toString() ?? "1"
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.min = Number(response.formValues[0]);
                    data.max = Number(response.formValues[1]);
                    data.step = Number(response.formValues[2]);
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            if (
                data.label &&
                data.objective &&
                data.min !== undefined &&
                data.max !== undefined
            ) {
                form.button(
                    `${controlIndex == -1 ? "Create" : "Edit"}`,
                    null,
                    (player) => {
                        createOrEdit();
                    }
                );
            }
            form.show(player, false, () => {});
        }
        if (data.type == "slider-using-command") {
            let form = new ActionForm();
            form.button(`Set Display`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Label",
                    "Type a label here",
                    data.label ? data.label : undefined
                );
                modal.toggle("Preserve Value", data.preserve ?? false);
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.label = response.formValues[0];
                    data.preserve = response.formValues[1];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(`Set Action`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Action",
                    "Type an action here",
                    data.action ? data.action : undefined
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.action = response.formValues[0];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            form.button(`Set Range`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Minimum",
                    "Minimum value",
                    data.min?.toString() ?? "0"
                );
                modal.textField(
                    "Maximum",
                    "Maximum value",
                    data.max?.toString() ?? "10"
                );
                modal.textField(
                    "Step",
                    "Step value",
                    data.step?.toString() ?? "1"
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.min = Number(response.formValues[0]);
                    data.max = Number(response.formValues[1]);
                    data.step = Number(response.formValues[2]);
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            if (
                data.label &&
                data.action &&
                data.min !== undefined &&
                data.max !== undefined
            ) {
                form.button(
                    `${controlIndex == -1 ? "Create" : "Edit"}`,
                    null,
                    (player) => {
                        createOrEdit();
                    }
                );
            }
            form.show(player, false, () => {});
        }
        if (data.type == "header" || data.type == "label") {
            let form = new ActionForm();
            form.button(`Set Text`, null, (player) => {
                let modal = new ModalForm();
                modal.textField(
                    "Text",
                    "Type text here",
                    data.text ? data.text : undefined
                );
                modal.show(player, false, (player, response) => {
                    if (response.canceled)
                        return uiManager.open(
                            player,
                            versionData.uiNames.Modal.AddControl,
                            id,
                            controlIndex,
                            data,
                            tempData
                        );
                    data.text = response.formValues[0];
                    uiManager.open(
                        player,
                        versionData.uiNames.Modal.AddControl,
                        id,
                        controlIndex,
                        data,
                        tempData
                    );
                });
            });
            if (data.text) {
                form.button(
                    `${controlIndex == -1 ? "Create" : "Edit"}`,
                    null,
                    (player) => {
                        createOrEdit();
                    }
                );
            }
            form.show(player, false, () => {});
        }
        if (data.type == "divider") {
            let form = new ActionForm();
            form.button(
                `${controlIndex == -1 ? "Create" : "Edit"}`,
                null,
                (player) => {
                    createOrEdit();
                }
            );
            form.show(player, false, () => {});
        }
    }
);
