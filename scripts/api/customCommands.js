import { prismarineDb } from '../lib/prismarinedb'
import commandManager from './commands/commandManager'
import actionParser from './actionParser'

class CustomCommands {
    constructor() {
        this.db = prismarineDb.table('CustomCommands')
        this.pushCommands()
    }
    add(name, action1, category, author) {
        let cmd = this.db.findFirst({name})
        if(cmd) return false;
        this.db.insertDocument({
            name,
            actions: [action1],
            subcommands: [],
            category,
            author
        })
        this.pushCommands()
        return true;
    }
    remove(id) {
        let cmd = this.db.getByID(id)
        if(!cmd) return false;
        for (const subcommand of cmd.data.subcommands) {
            commandManager.removeSubcmd(cmd.data.name, subcommand.name)
        }
        this.db.deleteDocumentByID(id)
        commandManager.removeCmd(this.db.getByID(id).data.name)
        return true;
    }
    addAction(action, id) {
        let cmd = this.db.getByID(id)
        if(!cmd) return false;
        cmd.data.actions.push(action)
        this.db.overwriteDataByID(id, cmd.data)
        return true;
    }
    removeAction(index, id) {
        let cmd = this.db.getByID(id)
        if(!cmd) return false;
        cmd.data.actions.splice(index, 1)
        this.db.overwriteDataByID(id, cmd.data)
        return true;
    }
    addSubcommand(id, name, action1) {
        let cmd = this.db.getByID(id)
        if(cmd.data.subcommands.indexOf(name) > -1) return false;
        if(!cmd) return false;
        cmd.data.subcommands.push({name, actions: [action1]})
        this.db.overwriteDataByID(id, cmd.data)
        this.pushCommands()
        return true;
    }
    addActiontoSubCmd(parent, name, action) {
        let cmd = this.db.getByID(parent) 
        const subcmd = cmd.data.subcommands.find(sub => sub.name === name);
        subcmd.actions.push(action)
        this.db.overwriteDataByID(parent, cmd.data)
        return true;
    }
    removeActionFromSubCommand(parent, name, index) {
        let cmd = this.db.getByID(parent)
        const subcmd = cmd.data.subcommands.find(sub => sub.name === name);
        if(!subcmd) return false;
        subcmd.actions.splice(index, 1)
        this.db.overwriteDataByID(parent, cmd.data)
        return true;
    }
    removeSubcommand(parentID, name) {
        let cmd = this.db.getByID(parentID)
        const index = cmd.data.subcommands.findIndex(sub => sub.name === name);
        if(!index) return false;
        cmd.data.subcommands.splice(index, 1)
        this.db.overwriteDataByID(parentID, cmd.data)
        commandManager.removeSubcmd(cmd.data.name, name)
        return true;
    }
    pushCommands() {
        for (const cmd of this.db.findDocuments()) {
            let { name, actions, subcommands, category, author } = cmd.data
            commandManager.addCommand(
                name,
                { description: `Custom command made by an admin!`, category, author },
                ({msg,args}) => {
                    if(!actions) return msg.sender.info('This command has no actions! Please contact a member of the server`s staff.');
                    for (const action of actions) {
                        actionParser.runAction(msg.sender, action)
                    }
                }
            )
            for (const subcmd of subcommands) {
                commandManager.addSubcommand(name, subcmd.name, {description: 'Custom command made by an admin!'}, ({msg}) => {
                    if(!subcmd.actions) return;
                    for (const action of subcmd.actions) {
                        actionParser.runAction(msg.sender, action)
                    }
                })
            }
        }
    }
}

export default new CustomCommands()