import icons from "../api/icons";
import config from "../config";
import { ActionForm } from "../lib/form_func";
import uiManager from "../uiManager";
let pages = [
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
            `+ more!`
        ],
        links: [
            `home`
        ]
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
            `docs.leafessentials.org`
        ],
        links: [
            `ui_builder/root`,
            `292949402-icantfindaname`
        ]
    },
    {
        path: "ui_builder/root",
        title: "UI Builder Home",
        icon: "Packs/Asteroid/ui",
        links: [
            `home`,
            `ui_builder/buttons`
        ],
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
        ]
    },
    {
        path: "ui_builder/buttons",
        title: "UI Builder - Buttons",
        icon: "Packs/Asteroid/ui",
        links: [
            `home`,
            `ui_builder/root`
        ],
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
            `Once you are done making the button, click the button at the bottom under all the other options (assuming you have set a display and action). It should say either §b"Edit"§r or §b"Create"`
        ]
    }
]
uiManager.addUI(config.uiNames.Help, "Help Page", (player, page = "home")=>{
    let form = new ActionForm();
    let pageData = pages.find(_=>_.path == page);
    if(!pageData) pageData = pages[0];
    form.title(pageData.title)
    form.body(Array.isArray(pageData.text) ? pageData.text.join('\n§r') : pageData.text);
    let links = pageData.links && pageData.links.length ? pageData.links : [`home`];
    for(const link of links) {
        let pageData2 = pages.find(_=>_.path == link);
        if(pageData2) {
            form.button(`${pageData2.title}`, pageData2.icon ? icons.resolve(pageData2.icon) : null, (player)=>{
                uiManager.open(player, config.uiNames.Help, pageData2.path);
            })
        }//§
    }
    form.show(player, false, (player, response)=>{

    })
})