import icons from "../api/icons";
import config from "../versionData";
import { ActionForm } from "../lib/form_func";
import uiManager from "../uiManager";
import { ActionFormData } from "@minecraft/server-ui";
import {
    NUT_UI_DISABLE_VERTICAL_SIZE_KEY,
    NUT_UI_HEADER_BUTTON,
    NUT_UI_LEFT_HALF,
    NUT_UI_RIGHT_HALF,
    NUT_UI_TAG,
} from "./preset_browser/nutUIConsts";
let pages = [
    {
        path: "formatting-vars",
        title: "Formatting",
        icon: "^textures/azalea_icons/RainbowPaintBrush",
        text: [
            "NOTE: Formatting can be used almost everywhere in leaf, not just sidebars",
            "",
            "- <drj> - default rank joiner, useful for chat rank formats",
            "- <msg> - only available in chat rank formats, but is the players message",
            "- <rc> - default rank color",
            "- <nc> - name color",
            "- <bc> - bracket color",
            "- <mc> - message color",
            "- <x> <y> <z> - players coordinates",
            "- <name> - players name",
            "- <username> - an alternative way to show players name",
            "- <name_tag> - players nametag (not available in nametags+)",
            "- <xp> - players XP",
            "- <level> - players xp level",
            "- <hp> - players hp",
            "- <hp_max> - players max hp (without other addons, should always be 20",
            "- <hp_min> - players min hp (always 0)",
            "- <hp_default> - players default hp (should equal max)",
            "- <rank> - players rank",
            "- <kills> - players kill count",
            "- <deaths> - players death count",
            "- <blocks_broken> - players broken block count",
            "- <blocks_placed> - players placed block count",
            "- <cps> - players CPS",
            "- <clanID> - players clan id (not useful for much)",
            "- <k/d> - players kill/death ratio",
            "- <claim> - the land claim/zone the player is in",
            "- <tps> - the servers TPS",
            "- <online> - the amount of online players",
            "- <day> - the amount of ingame days",
            "- <yr> - the current year",
            "- <mo> - the current month (in number form)",
            "- <mo/n> - the current month (in name form)",
            "- <m> - the current minute",
            "- <h> - the current hour (in UCT timezone)",
            "- <s> - the current seconds",
            "- <ms> - the current milliseconds",
            "- <d> - the current irl day",
            "- <dra> - double right arrow character",
            "- <lra> - double left arrow character",
            "- <moonPhase> - the current moon phase",
            "- <h/12> - the hours (in 12 hour time)",
            "- <am/pm> - if the time is AM or PM",
            "- <days_played> - the amount of days the player has played",
            "- <hours_played> - the amount of hours the player has played",
            "- <minutes_played> - the amount of minutes the player has played",
            "- <seconds_played> - the amount of seconds the player has played",
            "- {{score objective}} - the players score",
            "- {{scoreshort objective}} - the players score, but shortened (example: 1,234 becomes 1.2k)",
        ],
    },
    {
        path: "freesex",
        title: "Notes - Top 10 Corn Categories",
        text: [
            "Asteroids top 10 corn categories!",
            "10. Straight corn",
            "9. Lesbian corn",
            "8. Linux copy command",
            "8. Femboy corn",
            "7. Femboy corn",
            "6. Femboy corn",
            "5. Femboy corn",
            "4. Femboy corn",
            "3. Femboy corn",
            "3. Furry corn",
            "2. Gay Furry corn",
            "1. Gay Furry Femboy corn",
        ],
    },
    {
        path: "292949402-icantfindaname",
        title: "Welcome to Leaf 2.2",
        icon: "Packs/Asteroid/dev",
        text: [
            `§aWelcome to Leaf 2.2`,
            `- Added custom commands`,
            `- Added world border`,
            `- Added ban system`,
            `- Added mute system`,
            `- Added warn system`,
            `- Added reports UI`,
            `+ more!`,
        ],
        links: [`home`],
    },
    {
        path: "home",
        title: "Help Home",
        icon: "leaf/image-1191",
        text: [
            `§bWelcome to Leaf Essentials!`,
            ``,
            `This guide will help you setup the addon`,
            `Click what page you want to read below`,
            `Also, there is a website for this.`,
            `docs.leafessentials.org`,
        ],
        links: [
            `ui_builder/root`,
            `292949402-icantfindaname`,
            `how-to-properly-make-a-server`,
            `formatting-vars`,
        ],
    },
    {
        path: "ui_builder/root",
        title: "UI Builder Home",
        icon: "Packs/Asteroid/ui",
        links: [`home`, `ui_builder/buttons`],
        text: [
            `§2-=-=-=-=- Leaf UI Builder -=-=-=-=-`,
            ``,
            `To get started, go over to admin panel and click "UI Builder"`,
            `This will open a UI`,
            ``,
            `§2-=-=-=-=- Adding a UI -=-=-=-=-`,
            `Click the button that says "Create UI"`,
            ``,
            `There will be 3 text boxes:`,
            `§7- Title`,
            `§7- Body`,
            `§7- Scriptevent`,
            ``,
            `Title is the text at the top of the form`,
            `Body is the text under the title and above the buttons. This is not required to use the UI Builder`,
            ``,
            `Scriptevent is the thing you use to open the UI. Remember to make it something short, and remember that it is not a place to type a full command`,
            `For example, if you type §etest §fin the scriptevent box, you can open it using §a/scriptevent leaf:open test`,
            ``,
            `§2-=-=-=-=- Editing the UI -=-=-=-=-`,
            `Once you create the UI, you can edit it. You will see 2 buttons:`,
            `§7- Edit Buttons`,
            `§7- Edit Form`,
            ``,
            `Edit form can be used to change the title and body of the form`,
            `Edit buttons can be used to edit the buttons`,
        ],
    },
    {
        path: "how-to-properly-make-a-server",
        title: "About Platform Settings",
        links: [`home`],
        text: [
            `§aLeaf is heavily against banning players purely based on the platform they play Minecraft on. §7People should be able to play Minecraft on any platform.`,
            `§7Banning players based on the platform is not the best way to remove hackers from your server.`,
            `§7Not everyone who plays on platforms like §bWindows §ror §aAndroid §ruses hacks, so the people who don't use hacks on those platforms can't even play most servers.`,
            `§7Platform settings ONLY exist because I felt like adding it to see how people would react to it. §oIf I ever want to remove it at ANY point, §rI will. §7Use this feature at your own risk.`,
            `§7We are not obligated to help you with Leaf outside of basic questions if you use this feature or any other device banning system.`,
            `§eWe would suggest getting a moderation team (and maybe a somewhat decent anti-cheat, if you can find one).`,
        ],
    },
    {
        path: "ui_builder/buttons",
        title: "UI Builder - Buttons",
        icon: "Packs/Asteroid/ui",
        links: [`home`, `ui_builder/root`],
        text: [
            `§2-=-=-=-=- Adding Buttons -=-=-=-=-`,
            `To add a button, edit your UI and click §aEdit Buttons§r. This should bring up a UI with all your buttons, and an option to add buttons`,
            ``,
            `§2-=-=-=-=- Creating Buttons -=-=-=-=-`,
            `When adding or editing an already existing button, you have a UI with a few options:`,
            `§7- Set display`,
            `§7- Set icon`,
            `§7- Set action`,
            ``,
            `To create the button, you need to set both the display and the action. The icon is optional, but highly recommended`,
            ``,
            `§bINFO: Display is the text and subtext on the button`,
            `§bINFO: Action is the command run when using the button`,
            `§bINFO: Icon is an image displayednext to the button`,
            ``,
            `Once you are done making the button, click the button at the bottom under all the other options (assuming you have set a display and action). It should say either §b"Edit"§r or §b"Create"`,
        ],
    },
];
uiManager.addUI(config.uiNames.Help, "Help Page", (player, page = "home") => {
    let form = new ActionForm();
    let pageData = pages.find((_) => _.path == page);
    if (!pageData) pageData = pages[0];
    form.title(NUT_UI_TAG + `§r${pageData.title}`);
    // form.body(Array.isArray(pageData.text) ? pageData.text.join('\n§r') : pageData.text);
    form.button(
        `${NUT_UI_HEADER_BUTTON}§r§cBack\n§7Click to Go Back`,
        `textures/azalea_icons/2`,
        (player) => {
            uiManager.open(player, config.uiNames.ConfigMain);
        }
    );
    let form2 = new ActionFormData();
    if (false) {
        for (const line of pageData.text) {
            if (line.startsWith("# ")) form.header(line.substring(2));
            else form.label(line);
        }
    } else {
        form.body(pageData.text.join("\n§r"));
    }

    let links =
        pageData.links && pageData.links.length ? pageData.links : [`home`];
    let i = 0;
    for (const link of links) {
        let pageData2 = pages.find((_) => _.path == link);
        i++;
        if (pageData2) {
            form.button(
                `${
                    i == links.length && links.length % 2 != 0
                        ? ``
                        : i % 2 == 0
                        ? `${NUT_UI_LEFT_HALF}`
                        : `${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}`
                }§r${pageData2.title}`,
                pageData2.icon ? icons.resolve(pageData2.icon) : null,
                (player) => {
                    uiManager.open(player, config.uiNames.Help, pageData2.path);
                }
            );
        } //§
    }
    form.show(player, false, (player, response) => {});
});
