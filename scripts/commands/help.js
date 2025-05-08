import commandManager from "../api/commands/commandManager";
import playerStorage from "../api/playerStorage";
import config from "../versionData";
import { prismarineDb } from "../lib/prismarinedb";

commandManager.addCommand("help", {description: "Get help with Leaf Essentials", category: "Help", format: `${commandManager.prefix}help`}, ({msg,args})=>{
    let commands = commandManager.cmds.findDocuments(null);
    let commandData = {};
    for(const command of commands) {
        let category = command.data.category ? command.data.category : "Development";
        if(commandData[category]) commandData[category].push(command.data)
        else commandData[category] = [command.data];
    }
    let text = [];
    for(const category of Object.keys(commandData)) {
        text.push(`§8----------- §a${category} §r§8-----------`)
        for(const command of commandData[category]) {
            text.push(`§e${command.format ? `${command.format}` : `${commandManager.prefix}${command.name}`} §r§7${command.description ? command.description : "No Description"} §8(By ${command.author ? command.author : "TrashyKitty"})`)
            let subcommands = commandManager.getSubCommandsFromCommand(command.name);
            if(subcommands.length) {
                for(const subcommand of subcommands) {
                    text.push(`§f- §b${subcommand.format ? `${subcommand.format}` : `${commandManager.prefix}${command.name} ${subcommand.name}`} §r§7${subcommand.description ? subcommand.description : "No Description"}`)
                }
            }
        }
    }
    msg.sender.sendMessage(text.join('\n§r'))
})

commandManager.addSubcommand("help", "setup", {description: "Get help setting up Leaf Essentials"}, ({msg})=>{
    msg.sender.sendMessage("WIP. Update (August 13, 2024): havent forgot about this one lmao")
    msg.sender.sendMessage("WIP. Update (Semtember 25, 2024): i totally forgot about this one lmao")
})
commandManager.addSubcommand("help", "version", {description: "Get help setting up Leaf Essentials"}, ({msg})=>{
    // msg.sender.sendMessage(`Leaf Version - V${config.versionInfo.versionName}`);
    // msg.sender.sendMessage(`Version Internal ID - V${config.versionInfo.versionInternalID}`);
    // msg.sender.sendMessage(`LeafDB Version - V${prismarineDb.version.toFixed(1)}`);
    // msg.sender.sendMessage(`OpenClanAPI Version - V1.1.1`);
    let text = [];
    text.push(`§8------------ §2Leaf Essentials §8------------`)
    text.push(`§eVersion Name: §f${config.versionInfo.versionName}`)
    text.push(`§eVersion Internal ID: §f${config.versionInfo.versionInternalID}`)
    text.push(`§8------------ §bLeafDB §8------------`)
    text.push(`§eVersion: §fV${prismarineDb.version.toFixed(1)}`)
    text.push(`§8------------ §eOpenClanAPI §8------------`)
    text.push(`§eVersion: §fV2.0`)
    msg.sender.sendMessage(text.join('\n§r'))
})
commandManager.addSubcommand("help", "my-id", {description: "Get your player ID"}, ({msg})=>{
    msg.sender.sendMessage(playerStorage.getID(msg.sender))
})
commandManager.addSubcommand("help", "bcd", {description: "For recreation purposes"}, ({msg, args})=>{
    msg.sender.sendMessage(`Player Detection
§a Tags§f: §e '§6isFalling§e' - If Player is Falling
§a Tags§f: §e '§6isClimbing§e' - If Player is Climbing
§a Tags§f: §e '§6isFlying§e' - If Player is Flying
§a Tags§f: §e '§6isGliding§e' - If Player is Gliding(with elytra)
§a Tags§f: §e '§6isInWater§e' - If Player is in Water
§a Tags§f: §e '§6isJumping§e' - If Player is Jumping
§a Tags§f: §e '§6isOnGround§e' - If Player is on the ground
§a Tags§f: §e '§6isSneaking§e' - If Player is Sneaking
§a Tags§f: §e '§6isSprinting§e' - If Player is Sprinting
§a Tags§f: §e '§6isSwimming§e' - If Player is Swimming
§a Tags§f: §e '§6isSleeping§e' - If Player is Sleeping
§a Tags§f: §e '§6isEmoting§e' - If Player is Emoting
§a Tags§f: §e '§6playerInitialSpawn§e' - After Loaded Into The Game
§a Tags§f: §e '§6playerSpawn§e' - Before Loaded Into The Game
§a Tags§f: §e '§6showtags§e' - Summons a entity containing the player tags 
                                (the entity has the tag sts, execute as it to get the tags)
§2 Objectives§f: §e'health§e' - Displays Player Health
§2 Objectives§f: §e'x§e' - Displays X Coordinate
§2 Objectives§f: §e'y§e' - Displays Y Coordinate
§2 Objectives§f: §e'z§e' - Displays Z Coordinate
§2 Objectives§f: §e'selectedSlot§e' - Displays Selected Slot
§2 Objectives§f: §e'level§e' - Displays Selected Slot
§2 Objectives§f: §e'xpEarnedCurrentLevel§e' - Displays XP Earned
§2 Objectives§f: §e'totalXpNeededToNextLevel§e' - Displays Total XP Needed for Next Level
§2 Objectives§f: §e'xpNeededToNextLevel§e' - Displays Total XP Needed 
§d Objectives§f: §e'kills§e' - Displays Total kills (Player Kills)
§d Objectives§f: §e'deaths§e' - Displays Total deaths

§7Permissions Modifier
§a Tags§f: §e '§6disable:chat§e' - Disables Player from Chatting
§a Tags§f: §e '§6disable:break§e' - Disables Player from Breaking
§a Tags§f: §e '§6disable:place§e' - Disables Player from Placing
§a Tags§f: §e '§6disable:blockinteract§e' - Disables Player from Interacting Blocks
§a Tags§f: §e '§6disable:entityinteract§e' Disables Player from Interacting Entitys
§a Tags§f: §e '§6disable:blockinteract:{blockid}§e' - Disables Player from Interacting the provided block
§a Tags§f: §e '§6disable:entityinteract:{entityid}§e' Disables Player from Interacting the provided entity
§d Tags§f: §e '§6disable:blockbreak:{blockid}§e' Disables Player from breaking the provided block
§d Tags§f: §e '§6disable:blockplace:{blockid}§e' Disables Player from placing the provided block
§a Tags§f: §e '§6disable:greif' Disables Player from interacting with Signs, Frames, Logs, Armor_stands,
                §6Repeaters, Comparactors, Trapdoors (Notice, Interacting with frames arent working yet)

§7Projectile Detection
§a Tags§f: §e '§6projectile:hit§e' - Entity damaged by projectile
§a Tags§f: §e '§6projectile:shot§e' - Entity which shot a projectile and hit a entity

§d [] §fNewly Added
§a [] §fTag related
§2 [] §fScoreboard related (Under Objectives)`)
})