import { ChatSendBeforeEvent } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
import configAPI from "../api/config/configAPI";

commandManager.addCommand("pwarp", {description: "Pwarp", usage: "pwarp"}, ({msg, args})=>{
    if(!configAPI.getProperty("Pwarps")) return msg.sender.error("Pwarps are disabled");
})

commandManager.addSubcommand("pwarp", "set", {description: "Pwarp", usage: "pwarp"}, ({msg, args})=>{
    if(!configAPI.getProperty("Pwarps")) return msg.sender.error("Pwarps are disabled");
    msg.sender.setDynamicProperty(`pwarp:${args[0]}`, msg.sender.location);
    msg.sender.success(`§aPwarp set to ${args[0]}`);
})

commandManager.addSubcommand("pwarp", "tp", {description: "Pwarp", usage: "pwarp"}, ({msg, args})=>{
    if(!configAPI.getProperty("Pwarps")) return msg.sender.error("Pwarps are disabled");
    let warp = msg.sender.getDynamicProperty(`pwarp:${args[0]}`);
    if(!warp) return msg.sender.error(`§cNo warp found with the name ${args[0]}`);
    msg.sender.teleport(warp);
    msg.sender.success(`§aTeleported to ${args[0]}`);
})

commandManager.addSubcommand("pwarp", "list", {description: "Pwarp", usage: "pwarp"}, ({msg, args})=>{
    if(!configAPI.getProperty("Pwarps")) return msg.sender.error("Pwarps are disabled");
    let warps = msg.sender.getDynamicPropertyIds().filter(prop => prop.startsWith("pwarp:"));
    msg.sender.sendMessage(`§aWarps: ${warps.map(warp => warp.split(":")[1]).join(", ")}`);
})

commandManager.addSubcommand("pwarp", "remove", {description: "Pwarp"}, ({msg, args})=>{
    if(!configAPI.getProperty("Pwarps")) return msg.sender.error("Pwarps are disabled");
    msg.sender.setDynamicProperty(`pwarp:${args[0]}`, undefined);
    msg.sender.success(`§aPwarp removed`);
})
