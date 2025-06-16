import uiBuilder from "../../../api/uiBuilder";
import config from "../../../versionData";
import { ActionForm, ModalForm } from "../../../lib/form_func";
import uiManager from "../../../uiManager";
import { formatStr } from "../../../api/azaleaFormatting";
import { array_move } from "../../../api/utils/array_move";
uiManager.addUI(
    config.uiNames.UIBuilderTabbedEditTabs,
    "Edit Tabs",
    (player, id) => {
        let form = new ActionForm();
        let tabUI = uiBuilder.tabbedDB.getByID(id);
        form.title(`§t§a§b§b§e§d${tabUI.data.title}`);
        if (tabUI.data.tabs.length) {
            for (let i = 0; i < tabUI.data.tabs.length; i++) {
                let tab = tabUI.data.tabs[i];
                form.button(
                    `§t§a§b§r§f${formatStr(tab.title, player)}`,
                    null,
                    (player) => {
                        let form2 = new ActionForm();
                        form2.button(`Delete Tab`, null, (player) => {
                            tabUI.data.tabs = tabUI.data.tabs.filter(
                                (_) => _.title != tab.title
                            );
                            uiBuilder.tabbedDB.overwriteDataByID(
                                tabUI.id,
                                tabUI.data
                            );
                            uiManager.open(
                                player,
                                config.uiNames.UIBuilderTabbedEditTabs,
                                id
                            );
                        });
                        form2.button(`<-`, null, (player) => {
                            // tabUI.data.tabs = tabUI.data.tabs.filter(_=>_.data.title != tab.title);
                            if (i > 0) array_move(tabUI.data.tabs, i, i - 1);
                            uiBuilder.tabbedDB.overwriteDataByID(
                                tabUI.id,
                                tabUI.data
                            );
                            uiManager.open(
                                player,
                                config.uiNames.UIBuilderTabbedEditTabs,
                                id
                            );
                        });
                        form2.button(`->`, null, (player) => {
                            // tabUI.data.tabs = tabUI.data.tabs.filter(_=>_.data.title != tab.title);
                            if (i + 1 < tabUI.data.tabs.length)
                                array_move(tabUI.data.tabs, i, i + 1);
                            uiBuilder.tabbedDB.overwriteDataByID(
                                tabUI.id,
                                tabUI.data
                            );
                            uiManager.open(
                                player,
                                config.uiNames.UIBuilderTabbedEditTabs,
                                id
                            );
                        });
                        form2.show(player, false, (player) => {});
                    }
                );
            }
        } else {
            form.button(`§t§a§b§r§fNo Tabs`, null, (player) => {});
        }
        form.button("Back", null, (player) => {
            uiManager.open(player, config.uiNames.UIBuilderTabbed);
        });
        form.button("Add Tab", null, (player) => {
            let modal = new ModalForm();
            modal.title("Add Tab");
            modal.textField(
                "Tab Title",
                "Title for the tab",
                undefined,
                () => {}
            );
            let uis2 = uiBuilder
                .getUIs()
                .filter((_) => {
                    return _.data && _.data.name && _.data.scriptevent;
                })
                .map((_) => {
                    return {
                        id: _.id,
                        title: _.data.name,
                        scriptevent: _.data.scriptevent,
                    };
                });
            if (uis2.length == 0)
                return player.sendMessage(
                    "§cyou need a normal ui to use tab uis"
                );
            modal.dropdown(
                "UI",
                uis2.map((_) => {
                    return {
                        option: _.title,
                        callback() {},
                    };
                }),
                0,
                (player) => {}
            );
            modal.show(player, false, (player, response) => {
                if (response.formValues[0]) {
                    uiBuilder.addTab(
                        id,
                        response.formValues[0],
                        uis2[response.formValues[1]].scriptevent
                    );
                }
                uiManager.open(
                    player,
                    config.uiNames.UIBuilderTabbedEditTabs,
                    id
                );
            });
        });
        form.show(player, false, (player) => {});
    }
);
