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
- responseFormat
 - dropdown label
 - index (starting with 0)
 - index (starting with 1)
- command
- label
- options
 - label

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

import { world } from "@minecraft/server";
import { ModalForm } from "../../lib/form_func";
import actionParser from "../actionParser";
import { formatStr } from "../azaleaFormatting";

class ModalFormOpener {
    constructor() {}
    parseArgs(player, str, ...args) {
        let newStr = str;
        for (let i = 0; i < args.length; i++) {
            newStr = newStr.replaceAll(`<$${i + 1}>`, args[i]);
        }
        return formatStr(newStr, player);
    }
    open(player, ui, ...args) {
        let modal = new ModalForm();
        if (ui.data.name)
            modal.title(this.parseArgs(player, ui.data.name, ...args));
        if (ui.data.submitText)
            modal.submitButton(
                `${ui.data.submitText}${
                    ui.data.submitSubtext
                        ? `\n§r§7${ui.data.submitSubtext}`
                        : ``
                }`
            );
        for (const control of ui.data.controls) {
            if (control.type == "divider") {
                modal.divider();
            } else if (control.type == "header") {
                modal.header(this.parseArgs(player, control.text, ...args));
            } else if (control.type == "label") {
                modal.label(this.parseArgs(player, control.text, ...args));
            } else if (control.type == "text-field-using-command") {
                let defaultValue = "";
                if (control.preserve) {
                    let data = player.getDynamicProperty(
                        `PRESERVE:${ui.id}:${control.id}`
                    );
                    if (data) defaultValue = data;
                }
                modal.textField(
                    this.parseArgs(player, control.label, ...args),
                    this.parseArgs(player, control.placeholder, ...args),
                    defaultValue
                );
            } else if (control.type == "toggle-using-tag") {
                modal.toggle(
                    this.parseArgs(player, control.label, ...args),
                    player.hasTag(control.tag)
                );
            } else if (control.type == "toggle-using-command") {
                let data = player.getDynamicProperty(
                    `PRESERVE:${ui.id}:${control.id}`
                );
                let defaultValue = false;
                if (control.preserve && data && data == "true")
                    defaultValue = true;
                modal.toggle(
                    this.parseArgs(player, control.label, ...args),
                    defaultValue
                );
            } else if (control.type == "dropdown-using-command") {
                let defaultValue = 0;
                if (control.preserve) {
                    let data = player.getDynamicProperty(
                        `PRESERVE:${ui.id}:${control.id}`
                    );
                    if (typeof data === "number") defaultValue = data;
                }
                if (defaultValue < 0) defaultValue = 0;
                if (defaultValue >= control.options.length)
                    defaultValue = control.options.length - 1;
                modal.dropdown(
                    control.label,
                    control.options.map((_) => {
                        return {
                            option: _.label,
                            callback() {},
                        };
                    }),
                    defaultValue
                );
            } else if (control.type == "dropdown-using-tags") {
                let defaultValue = 0;
                for (let i = 0; i < control.options.length; i++) {
                    let opt = control.options[i];
                    if (player.hasTag(opt.tag)) defaultValue = i;
                }
                modal.dropdown(
                    control.label,
                    control.options.map((_) => {
                        return {
                            option: _.label,
                            callback() {},
                        };
                    }),
                    defaultValue
                );
            } else if (control.type == "dropdown-using-score") {
                let defaultValue = 0;
                let score = 0;
                try {
                    let objective = world.scoreboard.getObjective(
                        control.objective
                    );
                    if (!objective)
                        objective = world.scoreboard.addObjective(
                            control.objective,
                            control.objective
                        );
                    score = objective.getScore(player);
                } catch {
                    score = 0;
                }
                if (!score) score = 0;

                defaultValue = control.startsWithZero ? score : score - 1;
                if (defaultValue < 0) defaultValue = 0;
                if (defaultValue >= control.options.length)
                    defaultValue = control.options.length - 1;
                modal.dropdown(
                    control.label,
                    control.options.map((_) => {
                        return {
                            option: _.label,
                            callback() {},
                        };
                    }),
                    defaultValue
                );
            } else if (control.type == "slider-using-command") {
                let defaultValue = control.min;
                if (control.preserve) {
                    let data = player.getDynamicProperty(
                        `PRESERVE:${ui.id}:${control.id}`
                    );
                    if (typeof data === "number") defaultValue = data;
                }
                if (defaultValue < control.min) defaultValue = control.min;
                if (defaultValue > control.max) defaultValue = control.max;
                modal.slider(
                    control.label,
                    control.min,
                    control.max,
                    control.step,
                    defaultValue
                );
            } else if (control.type == "slider-using-score") {
                let defaultValue = 0;
                let score = 0;
                try {
                    let objective = world.scoreboard.getObjective(
                        control.objective
                    );
                    if (!objective)
                        objective = world.scoreboard.addObjective(
                            control.objective,
                            control.objective
                        );
                    score = objective.getScore(player);
                } catch {
                    score = 0;
                }
                if (!score) score = 0;

                defaultValue = score;
                if (defaultValue < control.min) defaultValue = control.min;
                if (defaultValue > control.max) defaultValue = control.max;
                modal.slider(
                    control.label,
                    control.min,
                    control.max,
                    control.step,
                    defaultValue
                );
            }
        }
        modal.show(player, false, (player, response) => {
            if (response.canceled) return;
            let responseIndex = -1;
            for (let i = 0; i < ui.data.controls.length; i++) {
                responseIndex++;
                let control = ui.data.controls[i];
                if (
                    control.type == "header" ||
                    control.type == "label" ||
                    control.type == "divider"
                ) {
                    continue;
                }
                if (control.type == "text-field-using-command") {
                    if (control.preserve) {
                        player.setDynamicProperty(
                            `PRESERVE:${ui.id}:${control.id}`,
                            response.formValues[responseIndex]
                        );
                    }
                    // console.warn(JSON.stringify(response.formValues[responseIndex]))
                    // console.warn(response.formValues[responseIndex])
                    actionParser.runAction(
                        player,
                        this.parseArgs(
                            player,
                            control.action,
                            ...args
                        ).replaceAll(
                            "<value>",
                            response.formValues[responseIndex]
                        ).replaceAll(
                            "<valueSafe>",
                            JSON.stringify(response.formValues[responseIndex]).slice(0,-1).substring(1)
                        )
                    );
                } else if (control.type == "toggle-using-tag") {
                    if (response.formValues[responseIndex]) {
                        try {
                            player.addTag(control.tag);
                        } catch {}
                    } else {
                        try {
                            player.removeTag(control.tag);
                        } catch {}
                    }
                } else if (control.type == "toggle-using-command") {
                    actionParser.runAction(
                        player,
                        this.parseArgs(
                            player,
                            control.action,
                            ...args
                        ).replaceAll(
                            "<value>",
                            control.responseFormat == "1/0"
                                ? response.formValue[responseIndex]
                                    ? "1"
                                    : "0"
                                : response.formValues[responseIndex]
                                ? "true"
                                : "false"
                        )
                    );
                    if (control.preserve) {
                        player.setDynamicProperty(
                            `PRESERVE:${ui.id}:${control.id}`,
                            response.formValues[responseIndex]
                                ? "true"
                                : "false"
                        );
                    }
                } else if (control.type == "dropdown-using-command") {
                    actionParser.runAction(
                        player,
                        this.parseArgs(
                            player,
                            control.options[response.formValues[responseIndex]]
                                .commandOverride
                                ? control.options[
                                      response.formValues[responseIndex]
                                  ].commandOverride
                                : control.action,
                            ...args
                        ).replaceAll(
                            "<value>",
                            control.responseFormat == 0
                                ? control.options[
                                      response.formValues[responseIndex]
                                  ].label
                                : control.responseFormat == 1
                                ? response.formValues[responseIndex]
                                : control.responseFormat[responseIndex] + 1
                        )
                    );
                    if (control.preserve) {
                        player.setDynamicProperty(
                            `PRESERVE:${ui.id}:${control.id}`,
                            response.formValues[responseIndex]
                        );
                    }
                } else if (control.type == "dropdown-using-tags") {
                    for (const opt of control.options) {
                        try {
                            player.removeTag(opt.tag);
                        } catch {}
                    }
                    player.addTag(
                        control.options[response.formValues[responseIndex]].tag
                    );
                } else if (control.type == "dropdown-using-score") {
                    try {
                        let objective = world.scoreboard.getObjective(
                            control.objective
                        );
                        if (!objective)
                            objective = world.scoreboard.addObjective(
                                control.objective,
                                control.objective
                            );
                        objective.setScore(
                            player,
                            control.startsWithZero
                                ? response.formValues[responseIndex]
                                : response.formValues[responseIndex] + 1
                        );
                    } catch {}
                } else if (control.type == "slider-using-command") {
                    actionParser.runAction(
                        player,
                        this.parseArgs(
                            player,
                            control.action,
                            ...args
                        ).replaceAll(
                            "<value>",
                            response.formValues[responseIndex].toString()
                        )
                    );
                    if (control.preserve) {
                        player.setDynamicProperty(
                            `PRESERVE:${ui.id}:${control.id}`,
                            response.formValues[responseIndex]
                        );
                    }
                } else if (control.type == "slider-using-score") {
                    try {
                        let objective = world.scoreboard.getObjective(
                            control.objective
                        );
                        if (!objective)
                            objective = world.scoreboard.addObjective(
                                control.objective,
                                control.objective
                            );
                        objective.setScore(
                            player,
                            response.formValues[responseIndex]
                        );
                    } catch {}
                }
            }
            if (ui.data.afterSubmitAction) {
                actionParser.runAction(
                    player,
                    this.parseArgs(player, ui.data.afterSubmitAction, ...args)
                );
            }
        });
    }
}

export default new ModalFormOpener();
