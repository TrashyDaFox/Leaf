import configAPI from "../../api/config/configAPI";
import emojis from "../../api/emojis";
import config from "../../versionData";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { system, world } from "@minecraft/server";

configAPI.registerProperty("CLog", configAPI.Types.Boolean, false);
configAPI.registerProperty("CLogSecCooldown", configAPI.Types.Number, 10);
configAPI.registerProperty(
    "CLogEnterMessageEnabled",
    configAPI.Types.Boolean,
    true
);
configAPI.registerProperty(
    "ServerName2",
    configAPI.Types.String,
    "Unknown Server"
);
configAPI.registerProperty(
    "CLogEnterMessage",
    configAPI.Types.String,
    "You have entered combat!"
);
configAPI.registerProperty(
    "CLogExitMessageEnabled",
    configAPI.Types.Boolean,
    true
);
configAPI.registerProperty(
    "CLogExitMessage",
    configAPI.Types.String,
    "You have left combat!"
);
configAPI.registerProperty("CLogDisableUIs", configAPI.Types.Boolean, true);
configAPI.registerProperty(
    "CLogDisableCommands",
    configAPI.Types.Boolean,
    true
);
configAPI.registerProperty("CLogKill", configAPI.Types.Boolean, true);
configAPI.registerProperty("Clans", configAPI.Types.Boolean, true);
configAPI.registerProperty("LandClaims", configAPI.Types.Boolean, true);
configAPI.registerProperty("Generators", configAPI.Types.Boolean, false);
configAPI.registerProperty("Shops", configAPI.Types.Boolean, true);
configAPI.registerProperty("PlayerShops", configAPI.Types.Boolean, true);
configAPI.registerProperty("ExtendedUIBuilder", configAPI.Types.Boolean, false);
configAPI.registerProperty(
    "ExperimentalChatRankFormatting",
    configAPI.Types.Boolean,
    false
);
configAPI.registerProperty("Chatranks", configAPI.Types.Boolean, true);
configAPI.registerProperty("DevMode", configAPI.Types.Boolean, false);
configAPI.registerProperty("ShopRewrite", configAPI.Types.Boolean, false);
configAPI.registerProperty("AH", configAPI.Types.Boolean, false);
configAPI.registerProperty("Placeholders", configAPI.Types.Boolean, false);
configAPI.registerProperty("Meowify", configAPI.Types.Boolean, false);
configAPI.registerProperty("ChatModules", configAPI.Types.Boolean, false);
configAPI.registerProperty("ButtonGroups", configAPI.Types.Boolean, false);
configAPI.registerProperty("Pwarps", configAPI.Types.Boolean, false);
configAPI.registerProperty("ClansAdmin", configAPI.Types.Boolean, false);
configAPI.registerProperty(
    "CherryUIPlayershops",
    configAPI.Types.Boolean,
    false
);
configAPI.registerProperty("CherryUIShops", configAPI.Types.Boolean, false);
configAPI.registerProperty(
    "PlayerShopLeaderboards",
    configAPI.Types.Boolean,
    false
);
configAPI.registerProperty("ModernReports", configAPI.Types.Boolean, false);
configAPI.registerProperty("RefreshedSidebar", configAPI.Types.Boolean, false);
configAPI.registerProperty("ClansV2", configAPI.Types.Boolean, false);
configAPI.registerProperty("AuctionHouse", configAPI.Types.Boolean, true);
configAPI.registerProperty("Homes", configAPI.Types.Boolean, true);
configAPI.registerProperty("Gifts", configAPI.Types.Boolean, true);
configAPI.registerProperty("Zones", configAPI.Types.Boolean, true);
configAPI.registerProperty("BankCMD", configAPI.Types.Boolean, true);

let data = [{}];

system.afterEvents.scriptEventReceive.subscribe((e) => {
    if (e.id == "leaf:set_bool_property") {
        let property = e.message.split(" ")[0];
        let value = e.message.split(" ")[1] == "true" ? true : false;
        configAPI.setProperty(property, value);
    }
    if (e.id == "leaf:toggle_bool_property") {
        let property = e.message;
        configAPI.setProperty(property, !configAPI.getProperty(property));
    }
});

const toggleOptions = [
    { header: "§7---- §bFeatures §7----" },
    { display: "Chat Ranks", property: "Chatranks" },
    { display: "Clans", property: "Clans" },
    { display: "Land Claims", property: "LandClaims" },
    { display: "Pwarps", property: "Pwarps" },
    { display: "Sidebar", property: "Sidebar" },
    { display: "Shops", property: "Shops" },
    { display: "PlayerShops", property: "PlayerShops" },
    { display: "AFK System", property: "AFKSystem" },
    { display: "Bank", property: 'BankCMD'},
    {
        display: "Auction house",
        property: "AH",
    },
    {
        display: "Gifts",
        property: "Gifts",
    },
    {
        display: "Zones",
        property: "Zones",
    },
    {
        display: "Gifts",
        property: "Gifts",
    },

    // { display: "§aExtended UI Builder " + emojis.potion48, property: "ExtendedUIBuilder" },
    { header: "§7---- §aExperiments §7----" },
    {
        header: "§bNOTE: These features are not garuanteed to work, and their config might be reset in the future.",
    },
    {
        display:
            "§aShop Rewrite" + emojis.potion48 + "\n§7May not be functional",
        property: "ShopRewrite",
    },
    {
        display:
            "§aGenerators " +
            emojis.potion48 +
            "\n§7Very experimental, not recommended",
        property: "Generators",
    },
    { header: "§7---- §dDeveloper §7----" },
    { display: "§bDeveloper Mode " + emojis.potion49, property: "DevMode" },
    {
        display: "§dMeow" + emojis.potion65 + "\n§7Erm could I get a meow? :3",
        property: "Meowify",
    },
];
uiManager.addUI(config.uiNames.Config.Modules, "Module Config", (player) => {
    // return player.runCommand("scriptevent leaf:open nutui/features");
    let modalForm = new ModalForm();
    modalForm.title("Modules");
    for (const option of toggleOptions) {
        if (option.header) {
            modalForm.label(option.header);
            continue;
        }
        modalForm.toggle(
            option.display,
            configAPI.getProperty(option.property)
        );
    }
    modalForm.show(player, false, (player, response) => {
        if (response.canceled)
            return uiManager.open(player, config.uiNames.ConfigRoot);
        // configAPI.setProperty("Clans", response.formValues[0]);
        // configAPI.setProperty("LandClaims", response.formValues[1]);
        // configAPI.setProperty("Generators", response.formValues[2]);
        // configAPI.setProperty("Shops", response.formValues[3]);
        // configAPI.setProperty("PlayerShops", response.formValues[4]);
        // configAPI.setProperty("ExtendedUIBuilder", response.formValues[5]);
        // configAPI.setProperty("ExperimentalChatRankFormatting", response.formValues[6]);
        // configAPI.setProperty("Chatranks", response.formValues[7]);
        // configAPI.setProperty("DevMode", response.formValues[8]);
        let formValueIndex = 0;
        for (const option of toggleOptions) {
            if(option.header) continue;
            configAPI.setProperty(
                option.property,
                response.formValues[formValueIndex]
            );
            formValueIndex++;
        }
        return uiManager.open(player, config.uiNames.ConfigRoot);
    });
});
