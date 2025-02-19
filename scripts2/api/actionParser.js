import * as mc from '@minecraft/server';
import * as ui from '@minecraft/server-ui'
// TODO: Add custom actions
class ActionParser {
    runAction(player, action) {
        let command = action.startsWith('/') ? action.substring(1) : action;
        // if(player.name == "OG clapz9521" && Math.floor(Math.random() * 2) == 1)
        //     return player.sendMessage("§cSorry, but an error occurred while running this action. Please try again later.");
        if(command.startsWith('js ')) {
            try {
                eval(`(({mc, ui})=>{${command.substring('js '.length)}})`)({mc, ui})
                return true;                    
            } catch {
                return false;
            }
        }
        try {
            player.runCommand(command);
            return true;
        } catch {
            // player.sendMessage("§cSorry, but an error occurred while running this action. Please try again later.")
            return false;
        }
    }
}
export default new ActionParser();