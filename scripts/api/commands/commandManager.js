import { system } from "@minecraft/server";
import { prismarineDb } from "../../lib/prismarinedb";
import translation from "../translation";
import { parseCommand } from "./parseCommand";
import configAPI from "../config/configAPI";
import { combatMap } from "../../features/clog";

class CommandManager {
    constructor() {
        this.prefix = "!";
        this.cmds = prismarineDb.nonPersistentTable("Commands");
        this.subcmds = prismarineDb.nonPersistentTable("SubCommands");
    }
    addCommand(name, data, callback) {
        this.cmds.waitLoad().then(() => {
            let cmd = this.cmds.findFirst({ name });
            if (cmd) {
                this.cmds.deleteDocumentByID(cmd.id);
            }
            this.cmds.insertDocument({
                name,
                ...data,
                callback,
            });
        });
    }
    addSubcommand(parent, name, data, callback) {
        this.subcmds.waitLoad().then(() => {
            this.subcmds.insertDocument({
                parent,
                name,
                ...data,
                callback,
            });
        });
    }
    getCmdPerms() {
        let permsList = [];
        for(const cmd of this.cmds.data) {
            permsList.push([`!${cmd.data.name}`, `commands.${cmd.data.name}`]);
            for(const subcommand of this.subcmds.findDocuments({parent: cmd.data.name})) {
                permsList.push([`!${cmd.data.name} ${subcommand.data.name}`, `commands.${cmd.data.name}.${subcommand.data.name}`])
            }
        }
        return permsList;
    }
    removeCmd(name) {
        this.cmds.deleteFirstDocumentByQuery({ name });
        for (const subcmd of this.subcmds.findDocuments({ parent: name })) {
            this.subcmds.deleteDocumentByID(subcmd.id);
        }
    }
    removeSubcmd(parent, name) {
        let doc = this.subcmds.findFirst({ parent, name });
        this.subcmds.deleteDocumentByID(doc.id);
    }
    getSubCommandsFromCommand(name) {
        return this.subcmds.findDocuments({ parent: name }).map((_) => _.data);
    }
    run(msg) {
        system.run(() => {
            if (!msg.message.startsWith(this.prefix)) return;
            let data = parseCommand(msg.message, this.prefix);
            let cmdName = data[0];
            let args = data.slice(1);
            let cmd = this.cmds.findFirst({ name: cmdName });
            if (!cmd)
                return msg.sender.sendMessage(
                    translation.getTranslation(
                        msg.sender,
                        "error",
                        translation.getTranslation(
                            msg.sender,
                            "commands.errors.notfound"
                        )
                    )
                );
            if (
                configAPI.getProperty("CLog") &&
                configAPI.getProperty("CLogDisableCommands") &&
                combatMap.has(msg.sender)
            )
                return msg.sender.error(
                    `You cant do this command while in combat`
                );
            if (data.length > 1) {
                let subcmd = this.subcmds.findFirst({
                    name: data[1],
                    parent: data[0],
                });
                if (subcmd) {
                    if(!prismarineDb.permissions.hasPermission(msg.sender, `commands.${subcmd.data.parent}.${subcmd.data.name}`)) {
                        return msg.sender.error(`You do not have permission to run this command. You require: commands.${subcmd.data.parent}.${subcmd.data.name}`)
                    }
                    return subcmd.data.callback({ msg, args: args.slice(1) });
                }
            }
            if(!prismarineDb.permissions.hasPermission(msg.sender, `commands.${cmd.data.name}`)) {
                return msg.sender.error(`You do not have permission to run this command. You require: commands.${cmd.data.name}`)
            }

            return cmd.data.callback({ msg, args });
        });
    }
}

export default new CommandManager();
