import uiManager from "../uiManager";
import { ActionForm } from "./form_func";

export class TabUI {
    constructor() {
        this.tabs = [];
        this.tabsPerPage = 3;
    }
    registerTab(title, fn) {
        this.tabs.push({ title, fn });
    }
    open(player, tab = 0, currentPage = Math.floor(tab / this.tabsPerPage)) {
        if (tab < 0) tab = 0;
        if (tab >= this.tabs.length) tab = this.tabs.length - 1;

        let form = new ActionForm();
        form.title(`§t§a§b§b§e§d§r§f${this.tabs[tab].title}`);
        // form.title(`${this.tabs[tab].title}`);

        // Calculate pagination
        const totalPages = Math.ceil(this.tabs.length / this.tabsPerPage);

        // If less than or equal to 5 tabs, show all on one page
        if (this.tabs.length <= 5) {
            for (let i = 0; i < this.tabs.length; i++) {
                form.button(
                    `§t§a§b${i == tab ? "§a§c§t§i§v§e" : ""}§r§f${
                        this.tabs[i].title
                    }`,
                    null,
                    (player) => {
                        this.open(player, i, 0);
                    }
                );
            }
        } else {
            // Show 4 tabs on first page
            if (currentPage === 0) {
                for (let i = 0; i < 4; i++) {
                    form.button(
                        `§t§a§b${i == tab ? "§a§c§t§i§v§e" : ""}§r§f${
                            this.tabs[i].title
                        }`,
                        null,
                        (player) => {
                            this.open(player, i, currentPage);
                        }
                    );
                }
                form.button(`§t§a§b§r§f->`, null, (player) => {
                    this.open(player, tab, currentPage + 1);
                });
            }
            // Show 4 tabs on last page
            else if (currentPage === totalPages - 1) {
                form.button(`§t§a§b§r§f<-`, null, (player) => {
                    this.open(player, tab, currentPage - 1);
                });
                for (
                    let i = currentPage * this.tabsPerPage;
                    i < this.tabs.length;
                    i++
                ) {
                    form.button(
                        `§t§a§b${i == tab ? "§a§c§t§i§v§e" : ""}§r§f${
                            this.tabs[i].title
                        }`,
                        null,
                        (player) => {
                            this.open(player, i, currentPage);
                        }
                    );
                }
            }
            // Show 3 tabs on middle pages
            else {
                form.button(`§t§a§b§r§f<-`, null, (player) => {
                    this.open(player, tab, currentPage - 1);
                });
                for (
                    let i = currentPage * this.tabsPerPage;
                    i < currentPage * this.tabsPerPage + 3;
                    i++
                ) {
                    form.button(
                        `§t§a§b${i == tab ? "§a§c§t§i§v§e" : ""}§r§f${
                            this.tabs[i].title
                        }`,
                        null,
                        (player) => {
                            this.open(player, i, currentPage);
                        }
                    );
                }
                form.button(`§t§a§b§r§f->`, null, (player) => {
                    this.open(player, tab, currentPage + 1);
                });
            }
        }

        let data = this.tabs[tab].fn(player);

        if (data) {
            if (data.buttons) {
                for (const button of data.buttons) {
                    form.button(button.text, button.iconPath, button.callback);
                }
            }

            if (data.body) {
                form.body(data.body);
            }
        }

        form.show(player, false, (player, response) => {});
    }
}

let tabUI = new TabUI();
tabUI.registerTab("Tab 1", (player) => {
    let buttons = [
        {
            text: "Dimond :3",
            iconPath: "textures/items/diamond",
            callback(player) {
                player.sendMessage("haii");
            },
        },
    ];
    return { buttons, body: "Body 1" };
});

tabUI.registerTab("Tab 2", (player) => {
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)");
            },
        },
    ];
    return { buttons, body: "Body 2" };
});
tabUI.registerTab("Tab 3", (player) => {
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)");
            },
        },
    ];
    return { buttons, body: "Body 2" };
});
tabUI.registerTab("Tab 4", (player) => {
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)");
            },
        },
    ];
    return { buttons, body: "Body 2" };
});
tabUI.registerTab("Tab 5", (player) => {
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)");
            },
        },
    ];
    return { buttons, body: "Body 2" };
});
tabUI.registerTab("Tab 6", (player) => {
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)");
            },
        },
    ];
    return { buttons, body: "Body 2" };
});
tabUI.registerTab("Tab 7", (player) => {
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)");
            },
        },
    ];
});
tabUI.registerTab("Tab 8", (player) => {
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)");
            },
        },
    ];
});
tabUI.registerTab("Tab 9", (player) => {
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)");
            },
        },
    ];
});
tabUI.registerTab("Tab 10", (player) => {
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)");
            },
        },
    ];
});
tabUI.registerTab("Tab 11", (player) => {
    let buttons = [
        {
            text: "Emerald >:3",
            iconPath: "textures/items/emerald",
            callback(player) {
                player.sendMessage("haii (part 2)");
            },
        },
    ];
});

uiManager.addUI("tab_test_2 | Leaf/Tests/Tab/2", "a", (player) => {
    tabUI.open(player);
});
// very simple
// also if u put an emoji on the tab the title will display the emoji id
// i will fix that uwu]
// am back
// yo what are u doing
// i am meowing~ :3 uwu
// u` have a whole list of things u can do on the trello thing
// ik, im going to add custom commands :3
