import { MessageFormData } from "@minecraft/server-ui";
import configAPI from "./api/config/configAPI";
import { combatMap } from "./features/clog";
import versionData from "./versionData";
import { NUT_UI_TAG, NUT_UI_THEMED } from "./startup";
import { themes } from "./uis/uiBuilder/cherryThemes";
import { world } from "@minecraft/server";
import { ActionForm } from "./lib/form_func";

class UIManager {
    #mainUIs;
    #altUIs;
    #descriptions;
    #builders;
    constructor() {
        this.#mainUIs = new Map();
        this.#altUIs = new Map();
        this.#descriptions = new Map();
        this.#builders = new Map();
    }

    get uis() {
        return [
            ...Array.from(this.#mainUIs.keys()).map((id) => {
                return {
                    id: id,
                    ui: this.#mainUIs.get(id),
                    description: this.#descriptions.get(id),
                };
            }),
            ...Array.from(this.#builders.keys()).map((id) => {
                return {
                    id: id,
                    ui: this.#builders.get(id),
                    description: "BUILDER UI",
                };
            }),
        ];
    }
    registerBuilder(id, ui) {
        this.#builders.set(id, ui);
    }
    addUI(id, desc, ui) {
        this.#descriptions.set(id, desc ?? "No Description");

        const names = id.split(" | ");
        const mainName = names[0];

        // Store main UI
        this.#mainUIs.set(mainName, ui);

        // Store alternate UI if it exists
        if (names.length > 1) {
            const altName = names.slice(1).join(" | ");
            this.#altUIs.set(altName, ui);
        }
    }
    #open(player, id, ...data) {
        try {
            if (this.#builders.has(id)) {
                // this is why we dont have nice things
                let result = this.#builders
                    .get(id)(player, ...data)
                    .toUIData();
                if (result.type == "ACTION") {
                    let form = new ActionForm();
                    if (result.title) form.title(result.title);
                    if (result.body) form.body(result.body);
                    for (const control of result.controls) {
                        if (control.type == "label") {
                            form.label(control.data.text);
                        } else if (control.type == "header") {
                            form.header(control.data.text);
                        } else if (control.type == "divider") {
                            form.divider();
                        } else if (control.type == "button") {
                            form.button(
                                control.data.text,
                                control.data.icon ? control.data.icon : null,
                                control.data.callback
                            );
                        }
                    }
                    form.show(player, false, (player, response) => {});
                }
                return;
            }

            const names = id.split(" | ");
            const name = names[0];

            // Try to find and execute the UI function
            const mainUI = this.#mainUIs.get(name);
            if (mainUI) {
                mainUI(player, ...data);
                return;
            }

            const altUI = this.#altUIs.get(name);
            if (altUI) {
                altUI(player, ...data);
                return;
            }

            if (!altUI && !mainUI) {
                let form = new MessageFormData();
                form.body(
                    `§cError: UI §e'${
                        id.split(" | ")[0]
                    }' §r§cdoes NOT exist.\n\n§fTell §vtrashy §r§fto get her shitt checked if you saw this §enormally without doing random scriptevents§r§f.`
                );
                form.button1("Close");
                form.button2("Meow");
                form.show(player).then(() => {});
            }
        } catch (e) {
            if (configAPI.getProperty("DevMode"))
                player.error(`${e} ${e.stack}`);
        }
    }
    open(player, id, ...data) {
        if (
            configAPI.getProperty("CLog") &&
            configAPI.getProperty("CLogDisableUIs") &&
            combatMap.has(player.id)
        )
            return player.error("You cant open this UI while in combat");
        let MASSAHEX = ["MassaHex"];
        if (
            MASSAHEX.includes(player.name) &&
            id != versionData.uiNames.Basic.Confirmation
        ) {
            this.open(
                player,
                versionData.uiNames.Basic.Confirmation,
                `Are you sure you want to open ${
                    id.split(" | ")[0]
                }? This action is irreversible!\n\n(maybe stop being an asss if u dont like this lol)`,
                () => {
                    this.#open(player, id, ...data);
                },
                () => {
                    player.error("imagine being homophobic");
                }
            );
        } else {
            this.#open(player, id, ...data);
        }
    }
}

class UI {
    constructor() {
        this.titlePrefix = [];
        this.title = "";
        this.controls = [];
        this.body = "";
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setCherryUI(bool) {
        if (!bool && this.titlePrefix.includes(NUT_UI_TAG)) {
            this.titlePrefix.splice(this.titlePrefix.indexOf(NUT_UI_TAG), 1);
        }
        if (bool && !this.titlePrefix.includes(NUT_UI_TAG)) {
            this.titlePrefix.push(NUT_UI_TAG);
        }
        return this;
    }
    setCherryUITheme(num) {
        this.titlePrefix.push(`${NUT_UI_THEMED}${themes[num][0]}`);
        return this;
    }
    addLabel(text) {
        this.controls.push({
            type: "label",
            data: {
                text,
            },
        });
        return this;
    }
    addHeader(text) {
        this.controls.push({
            type: "header",
            data: {
                text,
            },
        });
        return this;
    }
    addButton(btn) {
        this.controls.push({
            type: "button",
            data: btn.toData(),
        });
        return this;
    }
    addDivider() {
        this.controls.push({ type: "divider" });
        return this;
    }
    setBody(body) {
        this.body = body;
        return this;
    }
    toUIData() {
        let data = { type: "ACTION" };
        if (this.title || this.titlePrefix.length)
            data.title = `${this.titlePrefix.join("")}${
                this.titlePrefix.length ? "§r§f" : ""
            }${this.title}`;
        if (this.body) data.body = this.body;
        data.controls = this.controls;
        return data;
    }
}

class Button {
    constructor() {
        this.text = "";
        this.icon = "";
        this.callback = () => {};
    }

    setText(text) {
        this.text = text;
        return this;
    }

    setIcon(icon) {
        this.icon = icon;
        return this;
    }

    setCallback(fn) {
        this.callback = fn;
        return this;
    }

    toData() {
        return {
            text: this.text,
            icon: this.icon,
            callback: this.callback,
        };
    }
}

export default new UIManager();

export { UI, Button };
