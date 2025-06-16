import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
// TODO: Add custom actions
class ActionParser {
    runAction(player, actions) {
        if (typeof actions == "function") {
            return actions(player);
        }
        let returns = [];
        for (const action of actions.split(" && ")) {
            let command = action.startsWith("/") ? action.substring(1) : action;
            // if(player.name == "OG clapz9521" && Math.floor(Math.random() * 2) == 1)
            //     return player.sendMessage("§cSorry, but an error occurred while running this action. Please try again later.");
            command = command.replaceAll(" ^&^& ", " && ");
            // mc.world.sendMessage(command)
            if (command.startsWith("js ")) {
                try {
                    eval(`(({mc, ui})=>{${command.substring("js ".length)}})`)({
                        mc,
                        ui,
                    });
                    returns.push(true);
                } catch {
                    returns.push(false);
                }
            }
            try {
                player.runCommand(command);
                returns.push(true);
            } catch {
                // player.sendMessage("§cSorry, but an error occurred while running this action. Please try again later.")
                returns.push(false);
            }
        }
        return returns.find((_) => _ == true) ? true : false;
    }
}
export default new ActionParser();
