import config from "../../config";
import { ChestFormData } from "../../lib/chestUI";
import { ModalForm } from "../../lib/form_func";
import { prismarineDb } from "../../lib/prismarinedb";
import uiManager from "../../uiManager";
import common from "../chest/common";
import icons from "../icons";
import iconViewerCategories from "../../iconViewerCategories";
import * as _ from './underscore';
uiManager.addUI(config.uiNames.IconViewer, "Icon Viewer", (player, page = 0, callbackFn, favoritedOnly = false, iconIDSearch = false, iconIDSearchError = false, defaultIconID = null)=>{
    let pdbTable = prismarineDb.entityTable("icons", player).keyval("main");
    let recentlyUsed = pdbTable.has("RecentlyUsed") ? pdbTable.get("RecentlyUsed") : []

    if(iconIDSearch) {
        let modalForm = new ModalForm();
        modalForm.textField("Icon ID", "Example: leaf/image-001", defaultIconID)
        modalForm.title(iconIDSearchError ? "§cIcon not found" : "Input Icon ID")
        modalForm.show(player, false, function (player, response) {
            if(response.canceled) return uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly);
            let iconID = response.formValues[0]
            if(!iconID || !icons.resolve(iconID)) {
                uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly, iconIDSearch, true, iconID ? iconID : null);
            } else {
                recentlyUsed.unshift(iconID);
                recentlyUsed = recentlyUsed.slice(0, 45);
                pdbTable.set("RecentlyUsed", recentlyUsed);
                callbackFn(player, iconID);
            }
        })
        return;
    }
    let keys = Array.from(icons.icons.keys());
    if(favoritedOnly == true) keys = keys.filter(_=>player.hasTag(`favorited-icon:${_}`))
    
    if(favoritedOnly == "RECENTLY_USED") keys = recentlyUsed.filter(_=>Array.from(icons.icons.keys()).includes(_));
    let tags = player.getTags().filter(_=>_.startsWith(`favorited-icon:`));
    let icons_ = _.chunk(keys, (11 * 6) + 11);
    if(typeof page !== "number") {
        if(page === "PAGE_SELECT") {
            let modalForm = new ModalForm();
            modalForm.title("Page Select");
            modalForm.textField(`Page Number (Max: ${icons_.length}, Min: 1)`, `Example: 5`, undefined)
            modalForm.show(player, false, (player, response)=>{
                if(response.canceled) {
                    uiManager.open(player, config.uiNames.IconViewer, 0, callbackFn, favoritedOnly);
                }
                if(response.formValues && response.formValues.length && /^\d+$/.test(response.formValues[0]) && parseInt(response.formValues[0]) > 0 && parseInt(response.formValues[0]) <= icons_.length) {
                    uiManager.open(player, config.uiNames.IconViewer, parseInt(response.formValues[0]) - 1, callbackFn, favoritedOnly);
                } else {
                    uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly);
                }
            })
            return;
        }
    }
    let icons2 = icons_.length ? icons_[page] : [];
    let chest = new ChestFormData((11 * 8).toString());
    chest.title(`${favoritedOnly == true ? "Favorited Icons" : favoritedOnly == "RECENTLY_USED" ? "Recently Used" : "Icon Viewer"} (Page ${page+1}/${icons_&&icons_.length?icons_.length:1})`)
    for(let i = 0;i < 9 * 9;i++) {
        chest.button(i, `§cX`, [], `textures/blocks/tinted_glass`, 1, false, ()=>{
            uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly, iconIDSearch, iconIDSearchError, defaultIconID)

        })
    }
    for(let i = 0;i < icons2.length;i++) {
        let iconData = icons.getIconData(icons2[i]);
        let lore = [];
        if(iconData && iconData.name) {
            lore.push(`§8${icons2[i]}`);
        }
        if(iconData && iconData.category) {
            lore.push(` `)
            lore.push(`${iconViewerCategories[iconData.category] ? iconViewerCategories[iconData.category].Name : "§bUnknown"}`)
        }
        chest.button(i, iconData && iconData.name ? iconData.name : icons2[i], lore, icons.resolve(icons2[i]), favoritedOnly ? 1 : player.hasTag(`favorited-icon:${icons2[i]}`) ? 2 : 1, false, ()=>{
            let hopper = new ChestFormData("27");
            hopper.title(`${icons2[i]} actions`)
            for(let i = 0;i < 27;i++) {
                hopper.button(i, `§cX`, [], `textures/blocks/glass_gray`, 1, false, ()=>{
                    hopper.show(player).then(res=>{})

                })
            }
            hopper.button(common.rowColToSlotId(2, 2), "§cGo Back", ["Go back to the previous page"], "textures/blocks/barrier", 1, false, ()=>{
                uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly);
            })
            if(player.hasTag(`favorited-icon:${icons2[i]}`)) {
                hopper.button(common.rowColToSlotId(2, 8), "§eUnfavorite", ["Unfavorite this icon"], "textures/ui/sidebar_icons/star", 1, false, ()=>{
                    player.removeTag(`favorited-icon:${icons2[i]}`)
                    uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly);
                })
            } else {
                hopper.button(common.rowColToSlotId(2, 8), "§eAdd to favorites", ["Favorite this icon"], "textures/ui/sidebar_icons/star", 1, false, ()=>{
                    player.addTag(`favorited-icon:${icons2[i]}`)
                    uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly);
                })
            }
            if(callbackFn) {
                hopper.button(common.rowColToSlotId(2, 5), "§dUse", ["Use this icon"], "textures/ui/check.png", 1, false, ()=>{
                    recentlyUsed.unshift(icons2[i]);
                    recentlyUsed = recentlyUsed.slice(0, 45);
                    pdbTable.set("RecentlyUsed", recentlyUsed);
                    callbackFn(player, icons2[i]);
                })
            }
            hopper.show(player).then(res=>{})
            // if(callbackFn) {
            //     return callbackFn(player, icons2[i]);
            // }
            // if(player.hasTag(`favorited-icon:${icons2[i]}`)) {
            //     player.removeTag(`favorited-icon:${icons2[i]}`)
            // } else {
            //     player.addTag(`favorited-icon:${icons2[i]}`);
            // }
            // uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly);
        })
    }
    let rowCount = 7;
    for(let i = 0;i < 11;i++) {
        chest.button((11 * rowCount) + i, "§cX", [], "textures/blocks/glass_gray", 1, false, ()=>{
            uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly, iconIDSearch, iconIDSearchError, defaultIconID)
        })
    }
    // chest.button(9 * 5, "§cBack", ["Go back 1 page"], "textures/ui/arrow_left.png", 1, false, ()=>{
    chest.button(11 * rowCount, "§cBack", ["Go back 1 page"], "textures/blocks/glass_red", 1, false, ()=>{
        let prevPage = page - 1 < 0 ? icons_.length - 1 : page - 1;
        uiManager.open(player, config.uiNames.IconViewer, prevPage, callbackFn, favoritedOnly);
    });
    chest.button(callbackFn ? (11 * rowCount) + 3 : (11 * rowCount) + 4, "§dGo to page", ["Select a page to go to"], "textures/items/compass_item", 1, false, ()=>{
        uiManager.open(player, config.uiNames.IconViewer, "PAGE_SELECT", callbackFn, favoritedOnly);
    });
    // chest.button((9 * 5) + 1, "§dFirst page", ["Go to the first page"], "textures/blocks/glass_light_blue", 1, false, ()=>{
    //     uiManager.open(player, config.uiNames.IconViewer, 0, callbackFn, favoritedOnly);
    // });
    // chest.button((9 * 5) + 7, "§dLast page", ["Go to the last page"], "textures/blocks/glass_light_blue", 1, false, ()=>{
    //     uiManager.open(player, config.uiNames.IconViewer, icons_.length - 1, callbackFn, favoritedOnly);
    // });
    if(callbackFn) {
        chest.button((11 * rowCount) + 2, "§cCancel", ["Cancel"], "textures/ui/cancel", 1, false, ()=>{
            callbackFn(player, null);
        });

        chest.button((11 * rowCount) + 4, "§dUse Icon ID", ["Manually input an icon ID"], "textures/items/spyglass", 1, false, ()=>{
            uiManager.open(player, config.uiNames.IconViewer, 0, callbackFn, favoritedOnly, true);
        });
        chest.button((11 * rowCount) + 6, "§eRecently Used", ["View recently used icons"], "textures/items/clock_item", 1, false, ()=>{
            uiManager.open(player, config.uiNames.IconViewer, 0, callbackFn, favoritedOnly == "RECENTLY_USED" || favoritedOnly == true ? false : "RECENTLY_USED");
        });
        chest.button((11 * rowCount) + 8, "§cRemove Icon", ["Remove the icon"], "textures/ui/icon_trash", 1, false, ()=>{
            callbackFn(player, "");
        });
        // textures/ui/icon_trash.png
    }
    chest.button((11 * rowCount) + 5, "§6Favorites", ["Favorited icons"], "textures/ui/sidebar_icons/star", tags.length, false, ()=>{
        uiManager.open(player, config.uiNames.IconViewer, 0, callbackFn, !favoritedOnly);
    });
    chest.button(callbackFn ? (11 * rowCount) + 7 : (11 * rowCount) + 6, favoritedOnly == "RECENTLY_USED" ? "§dClear Recently Used" : "§cClear Favorites", favoritedOnly == "RECENTLY_USED" ? ["Clear icons you have recently used"] : ["Clear all the icons you have favorited"], "textures/blocks/barrier", 1, false, ()=>{
        if(favoritedOnly=="RECENTLY_USED") {
            pdbTable.set("RecentlyUsed", []);
            uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly, iconIDSearch, iconIDSearchError, defaultIconID)

        } else {
            for(const tag of player.getTags()) {
                if(tag.startsWith(`favorited-icon:`)) player.removeTag(tag);
            }
            uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly, iconIDSearch, iconIDSearchError, defaultIconID)

        }
    })

    // chest.button((9 * 5) + 8, "§aNext", ["Go next 1 page"], "textures/ui/arrow_right.png", 1, false, ()=>{
    chest.button((11 * rowCount) + 10, "§aNext", ["Go next 1 page"], "textures/blocks/glass_lime", 1, false, ()=>{
        let nextPage = page + 1 >= icons_.length ? 0 : page + 1;
        uiManager.open(player, config.uiNames.IconViewer, nextPage, callbackFn, favoritedOnly);

    });
    // chest.range((9 * 5) + 1, (9 * 5) + 7, (loopIndex, slotID)=>{
    //     chest.button(slotID, "§cX", [], "textures/blocks/gray_glass", 1, false, ()=>{
    //         uiManager.open(player, config.uiNames.IconViewer, page, callbackFn, favoritedOnly);
    //     });
    // })
    chest.show(player).then(res=>{

    })
})