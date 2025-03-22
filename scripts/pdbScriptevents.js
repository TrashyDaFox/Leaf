import { system, world } from "@minecraft/server";
import versionData from "./versionData";
import { prismarineDb } from "./lib/prismarinedb";
import { SegmentedStoragePrismarine } from "./prismarineDbStorages/segmented";

let disallowedTables = [versionData.tableNames.uis]

export let tables = {}

export function parseCommandLine(input) {
    // Match arguments including quoted strings with spaces, and flags
    const args = input.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const command = args.shift();    // First argument is the command
    const result = {
        command: command.toLowerCase(),
        positionalArguments: [],
        flags: {}
    };

    let i = 0;
    while (i < args.length) {
        const arg = args[i];

        // Check if it's a flag (starts with '--')
        if (arg.startsWith('--')) {
            const flag = arg.slice(2);  // Remove the '--' from the flag
            let value = true;           // Default for boolean flags

            // If the next argument is not another flag, treat it as the value
            if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
                value = parseValue(args[i + 1]);
                i++;  // Skip the value argument
            }

            result.flags[flag] = value;
        } else {
            // Otherwise, it's a positional argument
            result.positionalArguments.push(parseValue(arg));
        }

        i++;  // Move to the next argument
    }

    return result;
}

export let temp = {};

function parseValue2(value) {
    // Check for boolean strings
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    }
    // Try to convert to an integer if possible
    else if (!isNaN(value)) {
        return parseInt(value, 10);  // Convert to an integer
    }
    // Attempt to parse as JSON object (detect if it's a JSON-like structure)
    else if (isJsonObject(value)) {
        try {
            return JSON.parse(value);  // Attempt to parse as JSON object
        } catch (e) {
            return (value.endsWith('"') && value.startsWith('"')) || (value.endsWith("'") && value.startsWith("'")) ? value.slice(0,-1).substring(1) : value;  // If it's invalid JSON, return the original string
        }
    }
    // return value;  // Return the string itself if nothing else matches
    return (value.endsWith('"') && value.startsWith('"')) || (value.endsWith("'") && value.startsWith("'")) ? value.slice(0,-1).substring(1) : value;  // If it's invalid JSON, return the original string
}

function parseValue(valueOld) {
    let value = parseValue2(valueOld);
    if(typeof value === "string" && value.startsWith('@tmp/') && temp[value.substring(5)]) {
        return temp[value.substring(5)]
    }
    return value;
}

function isJsonObject(value) {
    // Check if the value looks like a JSON object
    return (value.startsWith('{') && value.endsWith('}')) || 
           (value.startsWith('[') && value.endsWith(']'));
}

// // Example usage
// const input = 'command arg1 arg2 --flag1 value1 --flag2 123 --flag3 --json {"key": "value"}';
// const parsed = parseCommandLine(input);
// console.log(parsed);

export async function getTable(name) {
    if(tables[name]) return tables[name]

    let table = prismarineDb.customStorage(name, SegmentedStoragePrismarine)
    await table.waitLoad()
    tables[name] = table;
    return table;
}

function hasTable(cmd) {
    return cmd.flags && cmd.flags.table && typeof cmd.flags.table === "string" ? true : false;
}

system.afterEvents.scriptEventReceive.subscribe(async e=>{
    if(e.id == "pdb:send") {
        let cmd = parseCommandLine(e.message)
        let table = null;
        if(hasTable(cmd)) {
            table = await getTable(cmd.flags.table)
        }
        switch(cmd.command) {
            case "dump_temp":
                world.sendMessage(JSON.stringify(temp, null, 2))
            case "insert_document":
                if(!hasTable(cmd)) return;
                if(cmd.flags.data && typeof cmd.flags.data === "object") {
                    table.insertDocument(cmd.flags.data)
                }
                break;
            case "print_data_in_chat":
                if(!hasTable(cmd)) return;
                world.sendMessage(JSON.stringify(table.data, null, 2))
                break;
            case "clear":
                if(!hasTable(cmd)) return;
                table.clear()
                break;
            case "create_temp_object":
                // if(!hasTable(cmd)) return;
                var name = cmd.flags.name && typeof cmd.flags.name == "string" ? cmd.flags.name : "InvalidName";
                temp[name] = {}
                break;
            case "set_temp_key":
                var name = cmd.flags.name && typeof cmd.flags.name == "string" ? cmd.flags.name : "InvalidName";
                var key = cmd.flags.key && typeof cmd.flags.key == "string" ? cmd.flags.key : "key";
                var value = typeof cmd.flags.value != "null" && typeof cmd.flags.value != "undefined" ? cmd.flags.value : "value";
                if(!temp[name]) temp[name] = {};
                temp[name][key] = value;
                break;
            case "delete_by_id":
                if(!hasTable(cmd)) return;
                var id = cmd.flags.id && typeof cmd.flags.id == "number" ? cmd.flags.id : 0;
                table.deleteDocumentByID(id)
                break;
            case "delete_temp_key":
                var name = cmd.flags.name && typeof cmd.flags.name == "string" ? cmd.flags.name : "InvalidName";
                var key = cmd.flags.key && typeof cmd.flags.key == "string" ? cmd.flags.key : "key";
                if(!temp[name]) temp[name] = {};
                delete temp[name][key];
                break;
            case "print":
                world.sendMessage(typeof cmd.flags.value == "object" ? JSON.stringify(cmd.flags.value, null, 2) : typeof cmd.flags.value == "string" ? cmd.flags.value : typeof cmd.flags.value == "boolean" ? cmd.flags.value ? "true" : "false" : cmd.flags.value.toString())
            case "find_doc_by_id":
                if(!hasTable(cmd)) return;
                var name = cmd.flags.name && typeof cmd.flags.name == "string" ? cmd.flags.name : "InvalidName";
                var id = cmd.flags.id && typeof cmd.flags.id == "number" ? cmd.flags.id : 0;
                var doc = table.getByID(id);
                if(!doc) return;
                temp[name] = {__TEMP_ORIGINAL_DOCID: doc.id, ...doc.data}
                break;
            case "find_doc_and_store_in_temp":
                if(!hasTable(cmd)) return;
                var name = cmd.flags.name && typeof cmd.flags.name == "string" ? cmd.flags.name : "InvalidName";
                var doc = table.findFirst(cmd.flags.query && typeof cmd.flags.query === "object" ? cmd.flags.query : {})
                if(!doc) return;
                temp[name] = {__TEMP_ORIGINAL_DOCID: doc.id, ...doc.data}
                break;
            case "overwrite":
                if(!hasTable(cmd)) return;
                var value = cmd.flags.value && typeof cmd.flags.value == "object" ? cmd.flags.value : null;
                if(!value) return null;
                var id = value.__TEMP_ORIGINAL_DOCID ? value.__TEMP_ORIGINAL_DOCID : cmd.flags.id && typeof cmd.flags.id == "number" ? cmd.flags.id : null;
                if(id == null) return;
                var newValue = {...value};
                if(newValue.__TEMP_ORIGINAL_DOCID) delete newValue.__TEMP_ORIGINAL_DOCID;
                table.overwriteDataByID(id, newValue);
                break;
            case "add_entity_id_to_temp":
                var name = cmd.flags.name && typeof cmd.flags.name == "string" ? cmd.flags.name : "InvalidName";
                if(!temp[name]) return;
                if(!e.sourceEntity) return;
                var key = cmd.flags.key && typeof cmd.flags.key === "string" ? cmd.flags.key : "entity_id"
                temp[name][key] = e.sourceEntity.id;
                break;
        }
    }
})