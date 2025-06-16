import { system } from "@minecraft/server";
import icons from "../../api/icons";
import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import http from "../../networkingLibs/currentNetworkingLib";
import uiManager from "../../uiManager";
import { ModalForm } from "../../lib/prismarinedb";
import uiBuilder from "../../api/uiBuilder";
import {
    NUT_UI_DISABLE_VERTICAL_SIZE_KEY,
    NUT_UI_HEADER_BUTTON,
    NUT_UI_LEFT_HALF,
    NUT_UI_RIGHT_HALF,
    NUT_UI_TAG,
    NUT_UI_THEMED,
} from "../preset_browser/nutUIConsts";
import { themes } from "./cherryThemes";
import normalForm from "../../api/openers/normalForm";
let leafPfps = [
    ["magma_cube", "Magma Cube", ""],
    ["fox", "Fox", ""],
    ["fox_arctic", "Arctic Fox", ""],
    ["piglin", "Piglin", ""],
    ["allay", "Allay", ""],
    ["zombie", "Zombie", ""],
    ["frog", "Frog", ""],
    ["bee", "Bee", ""],
    ["breeze", "Breeze", ""],
];
function getIcon(ui) {
    try {
        return ui.id == 1719775088275
            ? `textures/azalea_icons/icontextures/uwu`
            : ui.icon
            ? icons.resolve(ui.icon)
            : ui.layout == 4
            ? `textures/azalea_icons/DevSettingsClickyClick`
            : ui.type == 4
            ? `textures/azalea_icons/ChestIcons/Chest${ui.rows ? ui.rows : 3}`
            : `textures/azalea_icons/ClickyClick`;
    } catch {
        return "textures/azalea_icons/ClickyClick";
    }
}
function getBtnText(ui) {
    return `${ui.layout == 4 ? "§c§h§e§1§r§c" : "§e"}${
        ui.type == 4 ? ui.title : ui.name
    }`;
}

uiManager.addUI(
    config.uiNames.OnlineGUIsList,
    "",
    (player, data, page = "main") => {
        if (!http.player || !http.player.isValid())
            return player.error("No valid http player");
        let form = new ActionForm();
        if (player.getDynamicProperty("MCBEToolsToken")) {
            if (page == "main") {
                form.button(
                    `§6Edit Profile\n§7Edit your profile`,
                    null,
                    (player) => {
                        try {
                            http.makeRequest(
                                {
                                    method: "post",
                                    url: `${config.Endpoint}/my-profile`,
                                    headers: {
                                        Authorization:
                                            player.getDynamicProperty(
                                                "MCBEToolsToken"
                                            ),
                                    },
                                },
                                (status, res) => {
                                    try {
                                        // §o§1
                                        if (res.startsWith(".ERR")) return;
                                        // console.warn(res);
                                        let data2 = JSON.parse(res);
                                        let newForm = new ActionForm();
                                        newForm.title(
                                            `${NUT_UI_TAG}${NUT_UI_THEMED}${themes[11][0]}§rSelect a profile picture`
                                        );
                                        newForm.button(
                                            `${NUT_UI_HEADER_BUTTON}§r§cGo Back`,
                                            `textures/azalea_icons/2`,
                                            (player) => {
                                                uiManager.open(
                                                    player,
                                                    config.uiNames
                                                        .OnlineGUIsList,
                                                    data,
                                                    page
                                                );
                                            }
                                        );
                                        // console.warn(JSON.stringify(leafPfps));
                                        for (const pfp of leafPfps) {
                                            newForm.button(
                                                `${
                                                    pfp[0] == data2.leafPfp
                                                        ? "§o§1"
                                                        : ""
                                                }§r${pfp[2]} ${pfp[1]}`,
                                                null,
                                                (player) => {
                                                    http.makeRequest(
                                                        {
                                                            method: "post",
                                                            url: `${config.Endpoint}/set-leaf-pfp/${pfp[0]}`,
                                                            headers: {
                                                                Authorization:
                                                                    player.getDynamicProperty(
                                                                        "MCBEToolsToken"
                                                                    ),
                                                            },
                                                        },
                                                        (status, res) => {
                                                            if (res == ".ERR")
                                                                player.error(
                                                                    "Failed to update profile"
                                                                );
                                                            else
                                                                player.success(
                                                                    "Updated profile"
                                                                );

                                                            uiManager.open(
                                                                player,
                                                                config.uiNames
                                                                    .OnlineGUIsList,
                                                                data,
                                                                page
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                        newForm.show(
                                            player,
                                            false,
                                            (player, response) => {}
                                        );
                                    } catch (e) {
                                        // console.warn(`${e} ${e.stack}`);
                                    }
                                }
                            );
                        } catch (e) {
                            // console.warn(`${e} ${e.stack}`);
                        }
                    }
                );
            }
        }
        form.button(
            `${NUT_UI_HEADER_BUTTON}§r§cBack\n§7Go back`,
            icons.resolve("^textures/azalea_icons/2"),
            (player) => {
                if (page == "main")
                    uiManager.open(player, config.uiNames.UIBuilderRoot);
                else {
                    http.makeRequest(
                        {
                            method: "get",
                            url: `${config.Endpoint}/guis/list`,
                        },
                        (status, data) => {
                            system.run(() => {
                                uiManager.open(
                                    player,
                                    config.uiNames.OnlineGUIsList,
                                    data,
                                    "main"
                                );
                            });
                        }
                    );
                }
            }
        );
        if (page == "main") {
            form.button(
                `${NUT_UI_RIGHT_HALF}${NUT_UI_DISABLE_VERTICAL_SIZE_KEY}§r§bSearch\n§7Search Templates`,
                icons.resolve(`azalea/book`),
                (player) => {
                    let modalForm = new ModalForm();
                    modalForm.textField(
                        "q",
                        "Search Query",
                        "Example Server GUI"
                    );
                    modalForm.show(player, function (player) {
                        let query = this.get("q");
                        http.makeRequest(
                            {
                                method: "get",
                                url: `${config.Endpoint}/guis/list/search`,
                                params: {
                                    q: query,
                                },
                            },
                            (status, data) => {
                                system.run(() => {
                                    uiManager.open(
                                        player,
                                        config.uiNames.OnlineGUIsList,
                                        data,
                                        "query"
                                    );
                                });
                            }
                        );
                    });
                }
            );
            form.button(
                `${NUT_UI_LEFT_HALF}§r§2Featured\n§7Featured Templates`,
                icons.resolve(`azalea/diamond`),
                (player) => {
                    http.makeRequest(
                        {
                            method: "get",
                            url: `${config.Endpoint}/guis/list/featured`,
                        },
                        (status, data) => {
                            system.run(() => {
                                uiManager.open(
                                    player,
                                    config.uiNames.OnlineGUIsList,
                                    data,
                                    "featured"
                                );
                            });
                        }
                    );
                }
            );
        }
        form.title(
            `${NUT_UI_TAG}${NUT_UI_THEMED}${
                themes[11][0]
            }§rOnline GUI Templates (${JSON.parse(data).length})`
        );
        for (const thing of JSON.parse(data)) {
            // world.sendMessage(JSON.stringify(thing.guiData.name, null, 2))
            form.button(
                `${getBtnText(thing.guiData)}\n§7${thing.publishedBy} ${
                    leafPfps.find((_) => _[0] == thing.pfp)[2]
                } §f(v${thing.madeInLeafVersion})`,
                getIcon(thing.guiData),
                (player) => {
                    // uiBuilder.db.insertDocument(thing.guiData)
                    let form2 = new ActionForm();
                    form2.title(
                        `${NUT_UI_TAG}${NUT_UI_THEMED}${themes[11][0]}§r${
                            thing.guiData.type == 4
                                ? thing.guiData.title
                                : thing.guiData.name
                        }`
                    );
                    form2.button(
                        `${NUT_UI_HEADER_BUTTON}§r§cBack`,
                        `textures/azalea_icons/2`,
                        (player) => {
                            uiManager.open(
                                player,
                                config.uiNames.OnlineGUIsList,
                                data,
                                page
                            );
                        }
                    );
                    form2.button(
                        `§eImport\n§7Import this UI`,
                        null,
                        (player) => {
                            uiManager.open(
                                player,
                                config.uiNames.ImportUI,
                                thing.guiData
                            );
                        }
                    );
                    form2.button(
                        `§aView User Profile\n§7View the uploader's profile`,
                        null,
                        (player) => {
                            http.makeRequest(
                                {
                                    method: "get",
                                    url: `${config.Endpoint}/guis/by-user/${thing.publishedBy}`,
                                },
                                (status, res) => {
                                    try {
                                        let data = JSON.parse(res);
                                        uiManager.open(
                                            player,
                                            config.uiNames.OnlineGUIsList,
                                            JSON.stringify(data.uis),
                                            "user"
                                        );
                                    } catch {}
                                }
                            );
                        }
                    );
                    if (thing.guiData.type == 0) {
                        form2.button(`§ePreview UI`, null, (player) => {
                            normalForm.open(player, {
                                ...thing.guiData,
                                body: `NOTE: This GUI is from the internet and hasnt been imported yet. Buttons will not work as they should.${
                                    thing.guiData.body
                                        ? `\n\n${thing.guiData.body}`
                                        : ``
                                }`,
                                name: `${thing.guiData.name} §r§f(P)`,
                                buttons: thing.guiData.buttons.map((_) => {
                                    return {
                                        ..._,
                                        actions: [],
                                        action: "",
                                    };
                                }),
                                cancel() {
                                    uiManager.open(
                                        player,
                                        config.uiNames.OnlineGUIsList,
                                        data,
                                        page
                                    );
                                },
                            });
                        });
                    }
                    form2.show(player, false, (player, response) => {});
                }
            );
            // form.button(`§a${thing.guiData.name}`, icons.resolve(thing.guiData.buttons[0].iconID), (player)=>{
            //     uiBuilder.db.insertDocument(thing.guiData)
            // })
        }
        form.show(player, false, (player, response) => {});
    }
);
