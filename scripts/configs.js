import configAPI from "./api/config/configAPI";
import config from "./config";
import { prismarineDb } from "./lib/prismarinedb";

export const sidebarConfig = prismarineDb.table("SidebarConfig2").keyval("main");
export const generalConfig = prismarineDb.table("GeneralConfig2").keyval("main");
export const combatLogDB = prismarineDb.table("CombatLog2").keyval("main");
export const discordLogs = prismarineDb.table("DiscordLogs").keyval("main");
configAPI.registerProperty("chatformat", configAPI.Types.String, config.defaults.chatformat);
if(!generalConfig.has("ChatRanks")) {
    generalConfig.set("ChatRanks", true);
}