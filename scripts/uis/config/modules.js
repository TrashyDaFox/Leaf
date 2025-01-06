import configAPI from "../../api/config/configAPI";
import emojis from "../../api/emojis";
import config from "../../config";
import { ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";

configAPI.registerProperty("Clans", configAPI.Types.Boolean, true);
configAPI.registerProperty("LandClaims", configAPI.Types.Boolean, true);
configAPI.registerProperty("Generators", configAPI.Types.Boolean, false);
configAPI.registerProperty("Shops", configAPI.Types.Boolean, true);
configAPI.registerProperty("PlayerShops", configAPI.Types.Boolean, true);
configAPI.registerProperty("ExtendedUIBuilder", configAPI.Types.Boolean, false);
configAPI.registerProperty("ExperimentalChatRankFormatting", configAPI.Types.Boolean, false);
configAPI.registerProperty("Chatranks", configAPI.Types.Boolean, true);
configAPI.registerProperty("DevMode", configAPI.Types.Boolean, false);
configAPI.registerProperty("ShopRewrite", configAPI.Types.Boolean, false);
configAPI.registerProperty("AH", configAPI.Types.Boolean, false);
configAPI.registerProperty("Placeholders", configAPI.Types.Boolean, false);
configAPI.registerProperty("Meowify", configAPI.Types.Boolean, false);

let data = [
    {}
]
const toggleOptions = [
    { display: "Clans", property: "Clans" },
    { display: "Land Claims", property: "LandClaims" },
    { display: "§aGenerators " + emojis.potion48 + "\n§7Very experimental, not recommended", property: "Generators" },
    { display: "Shops", property: "Shops" },
    { display: "PlayerShops", property: "PlayerShops" },
    // { display: "§aExtended UI Builder " + emojis.potion48, property: "ExtendedUIBuilder" },
    { display: "§aShop Rewrite" + emojis.potion48 + "\n§7May not be functional", property: "ShopRewrite" },
    { display: "§aAuction house" + emojis.potion48 + "\n§7May not be functional", property: "AH" },
    { display: "§aPlaceholder buttons" + emojis.potion48 + "\n§7Will not be functional", property: "Placeholders" },
    { display: "§aExperimental Chat Rank Formatting " + emojis.potion48 + "\n§7WILL BREAK CHAT. NOT RECOMMENDED AT THE MOMENT", property: "ExperimentalChatRankFormatting" },
    { display: "Chat Ranks", property: "Chatranks" },
    { display: "§bDeveloper Mode " + emojis.potion49, property: "DevMode" },
    { display: "§dMeow" + emojis.potion65 + "\n§7Erm could I get a meow? :3", property: "Meowify" },
];
uiManager.addUI(config.uiNames.Config.Modules, "Module Config", (player)=>{
    let modalForm = new ModalForm();
    modalForm.title("Modules");
    for(const option of toggleOptions) {
        modalForm.toggle(option.display, configAPI.getProperty(option.property));
    }
    modalForm.show(player, false, (player, response)=>{
        if(response.canceled) return uiManager.open(player, config.uiNames.ConfigRoot);
        // configAPI.setProperty("Clans", response.formValues[0]);
        // configAPI.setProperty("LandClaims", response.formValues[1]);
        // configAPI.setProperty("Generators", response.formValues[2]);
        // configAPI.setProperty("Shops", response.formValues[3]);
        // configAPI.setProperty("PlayerShops", response.formValues[4]);
        // configAPI.setProperty("ExtendedUIBuilder", response.formValues[5]);
        // configAPI.setProperty("ExperimentalChatRankFormatting", response.formValues[6]);
        // configAPI.setProperty("Chatranks", response.formValues[7]);
        // configAPI.setProperty("DevMode", response.formValues[8]);
        for(let i = 0;i < toggleOptions.length;i++) {
            configAPI.setProperty(toggleOptions[i].property, response.formValues[i])
        }
        return uiManager.open(player, config.uiNames.ConfigRoot);
    })
})