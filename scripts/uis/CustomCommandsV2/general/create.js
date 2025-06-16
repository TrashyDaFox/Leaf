import commandManager from "../../../api/commands/commandManager";
import uiBuilder from "../../../api/uiBuilder";
import { ModalForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import versionData from "../../../versionData";
import { NUT_UI_MODAL } from "../../preset_browser/nutUIConsts";

function resetCommands() {
    commandManager;
}

// erm... what da tuna
uiManager.addUI(
    versionData.uiNames.CustomCommandsV2.create,
    "CREATE CUSTOM COMMAND! :D",
    (player, id = -1) => {
        let modalForm = new ModalForm(); //?????????????????????????

        let command = id == -1 ? null : uiBuilder.db.getByID(id);

        modalForm.title(`${NUT_UI_MODAL}Create Custom Command`);
        modalForm.textField(
            "Label",
            "Display name for your command",
            command ? command.data.name : "",
            () => {},
            "Display name for your command, for convenience in customizer UI"
        );
        modalForm.textField(
            "Unique Name",
            "Name for your command...",
            command ? command.data.command : "",
            () => {},
            "Unique Name for your command. This is what players do in chat.\n\nAllowed characters: §eLowercase letters§f, §eUnderscores (_)§f, §eHyphens (-)"
        );
        modalForm.textField(
            "Description",
            "Description for your command",
            command ? command.data.description : ""
        );
        modalForm.textField(
            "Category",
            "Category for your command",
            command ? command.data.category : ""
        );
        modalForm.textField(
            "Required Condition (optional)",
            "Required condition for your command",
            command ? command.data.requiredTag : ""
        );
        modalForm.toggle(
            "Ensure chat is closed?",
            command ? command.data.ensureChatClosed : false,
            () => {},
            "Ensure chat is closed when the command is run. Useful for opening UIs"
        );
        modalForm.show(player, false, (player, response) => {
            if (id == -1) {
                uiBuilder.createCommand(
                    response.formValues[0],
                    response.formValues[1],
                    response.formValues[2],
                    response.formValues[3],
                    response.formValues[4],
                    response.formValues[5]
                );
            } else {
                command.data.name = response.formValues[0];
                command.data.command = response.formValues[1];
                command.data.description = response.formValues[2];
                command.data.category = response.formValues[3];
                command.data.requiredTag = response.formValues[4];
                command.data.ensureChatClosed = response.formValues[5];
                uiBuilder.db.overwriteDataByID(command.id, command.data);
            }
        });
    }
);
