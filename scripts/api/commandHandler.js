// huge thanks to mrdouglax for allowing me to use this!
// https://mcpedl.com/user/mrdouglax/

import { system, world } from "@minecraft/server";
import { prismarineDb } from "../lib/prismarinedb";

const SUFFIX = "!";

export class CommandHandler {
    static commands = new Map();

    static init() {
        world.beforeEvents.chatSend.subscribe((eventData) => {
            return;
            // Check if message starts with prefix
            const message = eventData.message.trim();
            if (!message.startsWith(SUFFIX)) return;

            // Get arguments
            const args = message.slice(1).split(" ");
            // Get command
            const command = args.shift()?.toLowerCase();
            const commandData = this.commands.get(command || "");

            if (command && commandData) {
                // Get player who sent the message
                const sender = eventData.sender;

                // OPTION: Keep event
                if (!commandData.config?.keepMessage) eventData.cancel = true;

                // OPTION: Required tag
                if (
                    commandData.config?.requiredPermission &&
                    !prismarineDb.permissions.hasPermission(
                        eventData.sender,
                        commandData.config.requiredPermission
                    )
                ) {
                    sender.sendMessage(
                        `§cYou don't have permission to use this command!`
                    );
                    return;
                }

                // Handle subcommands
                if (commandData.subcommands && args.length > 0) {
                    const subCommandName = args[0].toLowerCase();
                    let currentCommand = commandData;
                    let depth = 0;

                    // Navigate through nested subcommands
                    while (
                        currentCommand.subcommands?.has(
                            args[depth]?.toLowerCase()
                        )
                    ) {
                        currentCommand = currentCommand.subcommands.get(
                            args[depth].toLowerCase()
                        );
                        depth++;

                        // Check permissions for subcommand
                        if (
                            currentCommand.config?.requiredPermission &&
                            !prismarineDb.permissions.hasPermission(
                                sender,
                                currentCommand.config.requiredPermission
                            )
                        ) {
                            sender.sendMessage(
                                `§cYou don't have permission to use this subcommand!`
                            );
                            return;
                        }
                    }

                    // Remove used subcommand arguments
                    args.splice(0, depth);

                    // If we found a valid subcommand
                    if (depth > 0) {
                        // OPTION: Validate arguments for subcommand
                        if (
                            currentCommand.config?.validateArgs &&
                            !currentCommand.config.validateArgs(args)
                        ) {
                            sender.sendMessage(
                                `§cInvalid arguments! Use: ${currentCommand.config.structure?.replace(
                                    "{cmd}",
                                    `!${command}`
                                )}`
                            );
                            return;
                        }

                        // Execute subcommand
                        system.run(() => {
                            currentCommand.callback(args, sender, eventData);
                        });
                        return;
                    }
                }

                // If no subcommand matched or no subcommands exist, execute main command
                // OPTION: Validate arguments
                if (
                    commandData.config?.validateArgs &&
                    !commandData.config.validateArgs(args)
                ) {
                    sender.sendMessage(
                        `§cInvalid arguments! Use: ${commandData.config.structure?.replace(
                            "{cmd}",
                            `!${commandData.name}`
                        )}`
                    );
                    return;
                }

                // OPTION: Execute on next tick
                system.run(() => {
                    commandData.callback(args, sender, eventData);
                });
            } else {
                // If command doesn't exist
                eventData.sender.sendMessage(
                    `§cUnknown command! Use !help to see available commands.`
                );
            }
        });
    }

    /**
     * Register a new command.
     * @param {string} name Command name
     * @param {Function} callback Function executed when calling the command
     * @param {Object} [config={}] Optional command configuration
     * @param {Map} [subcommands=null] Optional subcommands map
     */
    static registerCommand(name, callback, config, subcommands = null) {
        const mainName = name.toLowerCase();
        const commandData = {
            callback,
            config,
            name: mainName,
            subcommands: subcommands instanceof Map ? subcommands : null,
        };

        // Add main command
        this.commands.set(mainName, commandData);

        // Add aliases to main Map
        config?.aliases?.forEach((alias) => {
            this.commands.set(alias.toLowerCase(), commandData);
        });
    }

    /**
     * Creates a subcommand for an existing command
     * @param {string} commandName Parent command name
     * @param {string} subCommandName Subcommand name
     * @param {Function} callback Function executed when calling the subcommand
     * @param {Object} [config={}] Optional subcommand configuration
     * @param {Map} [nestedSubcommands=null] Optional nested subcommands
     */
    static registerSubCommand(
        commandName,
        subCommandName,
        callback,
        config = {},
        nestedSubcommands = null
    ) {
        const command = this.commands.get(commandName.toLowerCase());
        if (!command) {
            // console.warn(
                // `Cannot register subcommand for non-existent command: ${commandName}`
            // );
            return;
        }

        if (!command.subcommands) {
            command.subcommands = new Map();
        }

        const subCommandData = {
            callback,
            config,
            name: subCommandName.toLowerCase(),
            subcommands:
                nestedSubcommands instanceof Map ? nestedSubcommands : null,
        };

        command.subcommands.set(subCommandName.toLowerCase(), subCommandData);
    }

    static registerDefaultCommands() {
        // Echo Command
        this.registerCommand(
            "echo",
            (args, sender) => {
                sender.sendMessage(`§eEcho: ${args.join(" ")}`);
            },
            {
                description: "Repeats the provided message.",
                structure: "{cmd} [message]",
                validateArgs: (args) => args.length > 0,
            }
        );

        // Help Command
        this.registerCommand(
            "help",
            (args, sender) => {
                // If a specific command was provided
                if (args.length > 0) {
                    const commandPath = args[0].split(" ");
                    const mainCommand = commandPath[0].toLowerCase();
                    let commandEntry = this.commands.get(mainCommand);
                    let currentPath = mainCommand;

                    // Navigate through subcommands if specified
                    for (
                        let i = 1;
                        i < commandPath.length && commandEntry?.subcommands;
                        i++
                    ) {
                        const subCmd = commandPath[i].toLowerCase();
                        if (!commandEntry.subcommands.has(subCmd)) {
                            sender.sendMessage(
                                "§cThe specified command/subcommand was not found!"
                            );
                            return;
                        }
                        commandEntry = commandEntry.subcommands.get(subCmd);
                        currentPath += ` ${subCmd}`;
                    }

                    if (!commandEntry) {
                        sender.sendMessage(
                            "§cThe specified command was not found!"
                        );
                        return;
                    }

                    if (
                        commandEntry.config?.requiredTag &&
                        !sender.hasTag(commandEntry.config.requiredTag)
                    ) {
                        sender.sendMessage(
                            "§cYou don't have permission to view this command!"
                        );
                        return;
                    }

                    const aliases = commandEntry.config?.aliases
                        ? `§3 | ${commandEntry.config.aliases.join(" | ")}§b`
                        : "";
                    const messageParts = [
                        `\n §b---- Command !${currentPath}${aliases} ----\n`,
                        commandEntry.config?.description
                            ? ` §f${commandEntry.config.description}\n`
                            : "",
                        commandEntry.config?.helpMessage
                            ? ` §7${commandEntry.config.helpMessage}\n`
                            : "",
                        commandEntry.config?.structure
                            ? ` §eStructure: §f${commandEntry.config.structure.replaceAll(
                                  "{cmd}",
                                  `!${currentPath}`
                              )}\n`
                            : "",
                        commandEntry.config?.requiredTag
                            ? ` §aRequired permission: §c${commandEntry.config.requiredTag}\n`
                            : "",
                    ];

                    // Add subcommands section if they exist
                    if (commandEntry.subcommands?.size > 0) {
                        messageParts.push("\n §dSubcommands:\n");
                        for (const [
                            subName,
                            subData,
                        ] of commandEntry.subcommands) {
                            messageParts.push(
                                ` §5${subName}${
                                    subData.config?.description
                                        ? ` §7- ${subData.config.description}`
                                        : ""
                                }${
                                    subData.subcommands?.size
                                        ? " §8(has subcommands)"
                                        : ""
                                }\n`
                            );
                        }
                        messageParts.push(
                            "\n§7Use §f!help <command> <subcommand> §7for more information about a specific subcommand."
                        );
                    }

                    sender.sendMessage(messageParts.join(""));
                } else {
                    // List all available commands
                    const helpMessageParts = ["\n§bAvailable commands:\n§f"];
                    const sortedCommands = Array.from(
                        this.commands.entries()
                    ).sort((a, b) => {
                        const tagA = a[1].config?.requiredTag || "";
                        const tagB = b[1].config?.requiredTag || "";
                        if (tagA !== tagB) return tagA.localeCompare(tagB);
                        return a[0].localeCompare(b[0]);
                    });

                    sortedCommands.forEach(([cmd, data]) => {
                        if (
                            !data.config?.requiredTag ||
                            sender.hasTag(data.config?.requiredTag)
                        ) {
                            helpMessageParts.push(
                                `${
                                    data.config?.requiredTag
                                        ? ` §c(${data.config.requiredTag}) `
                                        : " "
                                }§a!${cmd}${
                                    data.config?.description
                                        ? `§7: ${data.config.description}`
                                        : ""
                                }${
                                    data.subcommands?.size
                                        ? " §8(has subcommands)"
                                        : ""
                                }\n`
                            );
                        }
                    });

                    helpMessageParts.push(
                        "\n§7Use §f!help <command> §7for more information about a specific command."
                    );
                    sender.sendMessage(helpMessageParts.join(""));
                }
            },
            {
                description: "Lists all available commands.",
                aliases: ["help"],
                structure: "{cmd} <command: string> [subcommand: string]",
                helpMessage:
                    "If a command is specified, shows help for that command and its subcommands.",
            }
        );

        // Example of a command with subcommands
        this.registerCommand(
            "test",
            (args, sender) => {
                sender.sendMessage("§eMain test command executed!");
            },
            {
                description: "Test command with subcommands",
                structure: "{cmd}",
            }
        );

        // Add a subcommand
        this.registerSubCommand(
            "test",
            "sub1",
            (args, sender) => {
                sender.sendMessage("§eSubcommand 1 executed!");
            },
            {
                description: "Test subcommand 1",
                structure: "{cmd} sub1",
            }
        );

        // Add a nested subcommand
        this.registerSubCommand(
            "test",
            "nested",
            (args, sender) => {
                sender.sendMessage("§eNested command executed!");
            },
            {
                description: "Nested test command",
                structure: "{cmd} nested",
            }
        );

        // Add a sub-subcommand
        const command = this.commands.get("test");
        if (command.subcommands?.has("nested")) {
            const nestedCommand = command.subcommands.get("nested");
            if (!nestedCommand.subcommands) {
                nestedCommand.subcommands = new Map();
            }

            nestedCommand.subcommands.set("deep", {
                callback: (args, sender) => {
                    sender.sendMessage("§eDeep nested subcommand executed!");
                },
                config: {
                    description: "Deep nested test command",
                    structure: "{cmd} nested deep",
                },
            });
        }
    }
}

CommandHandler.init();
CommandHandler.registerDefaultCommands();
