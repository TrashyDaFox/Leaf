import {
    ButtonState,
    Player,
    system,
    world,
    InputButton,
} from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";

class TextUI {
    constructor(buttons) {
        this.buttonsDb = prismarineDb.table("textUI");
    }
    getTextUIs() {
        return this.buttonsDb.data;
    }
    getTextUI(id) {
        return this.buttonsDb.getByID(id);
    }
    createTextUI(name, buttons) {
        return this.buttonsDb.insertDocument({
            name: name,
            buttons: buttons,
        });
    }
    deleteTextUI(id) {
        return this.buttonsDb.deleteDocumentByID(id);
    }
    updateTextUI(id, name, buttons) {
        return this.buttonsDb.overwriteDocumentByID(id, {
            name: name,
            buttons: buttons,
        });
    }
    open(id, player) {
        if (!this.buttonsDb.getByID(id)) return;
        if (!player instanceof Player) return;
        let session = {};
        let expiresAt = system.currentTick + 20 * 30;

        session.keyMap = new Map();
        session.uis = [id];
        function cb(event) {
            if (!event instanceof ItemUseBeforeEvent) return;
        }

        let originalSlot = player.selectedSlotIndex;
        world.beforeEvents.itemUse.subscribe(cb);
        // let interval = system.runInterval(() => {
        //     if (session[player.id] && expiresAt < system.currentTick) {
        //         delete session[player.id];
        //     }
        //     if (!session[player.id]) {
        //         world.beforeEvents.itemUse.unsubscribe(cb);
        //         system.clearRun(interval);
        //         player.onScreenDisplay.setActionBar("");
        //     }

        //     if (player.selectedSlotIndex != originalSlot) {
        //         world.beforeEvents.itemUse.unsubscribe(cb);
        //         system.clearRun(interval);
        //         player.onScreenDisplay.setActionBar("");
        //     }

        //     let ui = session.uis[session.uis.length - 1];

        //     let opts = [...ui.data.buttons];

        //     if (session.uis.length > 1) {
        //         opts.unshift({
        //             type: "goto",
        //             id: session.uis[session.uis.length - 2],
        //             back: true,
        //         });
        //     }

        //     let currSelectedOpt = 0;

        //     let textForm = [];

        //     for (let i = 0; i < opts.length; i++) {
        //         let opt = opts[i];
        //         if (opt.type == "goto") {
        //             let otherUI = this.buttonsDb.getByID(opt.id);
        //             if (!otherUI) continue;
        //             textForm.push(
        //                 `${currSelectedOpt == i ? "§b" : "§7"}> ${
        //                     opt.back ? "Back" : otherUI.data.name
        //                 } §r${currSelectedOpt == i ? "§b" : "§7"}<`
        //             );
        //         } else if (opt.type == "action") {
        //             textForm.push(
        //                 `${currSelectedOpt == i ? "§b" : "§7"}> ${opt.name} §r${
        //                     currSelectedOpt == i ? "§b" : "§7"
        //                 }<`
        //             );
        //         }
        //     }

        //     if (
        //         player.inputInfo.getButtonState(InputButton.Sneak) ==
        //         ButtonState.Released
        //     ) {
        //         session.keyMap.delete(InputButton.Sneak);
        //     }

        //     if (
        //         player.inputInfo.getButtonState(InputButton.Sneak) ==
        //         ButtonState.Pressed
        //     ) {
        //         if (session.keyMap.get(InputButton.Sneak)) return;
        //         session.keyMap.set(InputButton.Sneak, true);
        //         if (currSelectedOpt == opts.length - 1) {
        //             currSelectedOpt = 0;
        //         } else {
        //             currSelectedOpt++;
        //         }
        //     }

        //     player.onScreenDisplay.setActionBar(textForm.join("\n§r"));
        // }, 1);
    }
}

let textUI = new TextUI();

export default textUI;
