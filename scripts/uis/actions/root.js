import plijkokfn from "../../api/HARDER DADDY/plijkokfn";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

uiManager.addUI("add_comment", "comment", (player, group) => {
    let modalForm = new ModalForm();
    modalForm.textField("Comment", "Does things");
    modalForm.show(player, false, (player, response) => {
        if (!response.formValues[0]) return;
        plijkokfn.addCommentInstruction(group, response.formValues[0]);
        uiManager.open(player, "manage_instructions", group);
    });
});

uiManager.addUI("add_instruction", "a", (player, group) => {
    let actionForm = new ActionForm();
    actionForm.title("Add new action");
    actionForm.button(
        `§dNew Comment\n§7Label ur stuff`,
        `textures/azalea_icons/Comment`,
        (player) => {
            uiManager.open(player, "add_comment", group);
        }
    );
    actionForm.button(
        `§dAdd command call\n§7Run commands`,
        `textures/azalea_icons/Command`,
        (player) => {
            uiManager.open(player, "add_command", group);
        }
    );
    actionForm.button(
        `§dAdd if condition\n§7Conditionally conditioner`,
        `textures/azalea_icons/If`,
        (player) => {
            uiManager.open(player, "add_if", group);
        }
    );
    actionForm.button(
        `§dAdd function\n§7Reusable code`,
        `textures/azalea_icons/Function`,
        (player) => {
            uiManager.open(player, "add_function", group);
        }
    );
    actionForm.button(
        `§dCall function\n§7Call functions`,
        `textures/azalea_icons/ActionPink`,
        (player) => {
            uiManager.open(player, "add_function_call", group);
        }
    );
    actionForm.show(player, false, (player, response) => {});
});

uiManager.addUI("manage_instructions", "a", (player, group) => {
    let actionGroup = new ActionForm();
    actionGroup.title(group);
    let instructions = plijkokfn.getInstructions(group);
    actionGroup.body(instructions.length.toString());

    actionGroup.button(`Add new instruction`, null, (player) => {
        uiManager.open(player, "add_instruction", group);
    });

    for (const instruction of instructions) {
        if (instruction.type == "comment") {
            actionGroup.button(
                instruction.label,
                `textures/azalea_icons/Comment`
            );
        }
    }
    actionGroup.show(player, false, (player, response) => {});
});

uiManager.addUI("actions_root", "a", (player) => {
    if (player.name != "Trash9240" && player.name != "FruitKitty7041") return;
    let actionForm = new ActionForm();

    actionForm.title("§6Actions");

    actionForm.button("Add Action Group", null, (player) => {
        uiManager.open(player, "actions_add");
    });

    for (const actionGroup of plijkokfn.db.data) {
        actionForm.button(
            actionGroup.data.name,
            `textures/azalea_icons/ActionRed`,
            (player) => {
                uiManager.open(
                    player,
                    "manage_instructions",
                    actionGroup.data.name
                );
            }
        );
    }

    actionForm.show(player, false, () => {});
});

uiManager.addUI("actions_add", null, (player) => {
    let modalForm = new ModalForm();
    modalForm.textField("action group name (only lowercase letters)", ".");
    modalForm.show(player, false, (player, response) => {
        if (response.formValues[0]) {
            plijkokfn.createActionGroup(response.formValues[0]);
        }
        uiManager.open("actions_root", player);
    });
});
