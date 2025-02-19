import { world } from "@minecraft/server";
import commandManager from "../api/commands/commandManager";
import leaderboardHandler from "../leaderboardHandler";
import { prismarineDb } from "../lib/prismarinedb";
import {CommandHandler} from '../api/commandHandler'

commandManager.addCommand("lb", { description: "Leaderboards", category: "Setup" }, ({ msg, args }) => {
    msg.sender.sendMessage(`!lb add <objective> - Add a leaderboard`);
})
commandManager.addSubcommand("lb", "add", { description: "Add a leaderboard", format: "!lb add <objective>" }, ({ msg, args }) => {
    if (!prismarineDb.permissions.hasPermission(msg.sender, "lb.create")) return;
    if (args.length) {
        leaderboardHandler.addLeaderboard(args[0], msg.sender.location, msg.sender.dimension.id);
    }
})
commandManager.addSubcommand("lb", "remove", { description: "Remove a leaderboard", format: "!lb remove <objective>" }, ({ msg, args }) => {
    if (!prismarineDb.permissions.hasPermission(msg.sender, "lb.remove")) return;
    for (const doc of leaderboardHandler.db.data) {
        if (doc.data.objective == args[0]) {
            leaderboardHandler.db.deleteDocumentByID(doc.id)
            let entities = world.getDimension(doc.data.dimension ? doc.data.dimension : "overworld").getEntities({ type: 'leaf:floating_text', tags: [`lbid:${doc.id}`] });
            if (entities && entities.length) {
                for (const entity of entities) {
                    entity.remove();
                }
            }
            leaderboardHandler.db.deleteDocumentByID(doc.id)
        }
    }
    msg.sender.success('removed leaderboards')
})

CommandHandler.registerCommand('lb', (args,sender) => {
    if (!prismarineDb.permissions.hasPermission(sender, "lb.create")) return;
    if (args.length) {
        leaderboardHandler.addLeaderboard(args[0], sender.location, sender.dimension.id);
    }
}, {description: 'Add leaderboards'})

CommandHandler.registerSubCommand("lb", "remove", (args,sender) => {
    if (!prismarineDb.permissions.hasPermission(sender, "lb.remove")) return;
    for (const doc of leaderboardHandler.db.data) {
        if (doc.data.objective == args[0]) {
            leaderboardHandler.db.deleteDocumentByID(doc.id)
            let entities = world.getDimension(doc.data.dimension ? doc.data.dimension : "overworld").getEntities({ type: 'leaf:floating_text', tags: [`lbid:${doc.id}`] });
            if (entities && entities.length) {
                for (const entity of entities) {
                    entity.remove();
                }
            }
            leaderboardHandler.db.deleteDocumentByID(doc.id)
        }
    }
    sender.success('removed leaderboards')
})