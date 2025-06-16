import icons from "../../api/icons";
import playerStorage from "../../api/playerStorage";
import shopAPI from "../../api/shopAPI";
import config from "../../versionData";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { worldTags } from "../../worldTags";
import { NUT_UI_TAG } from "../preset_browser/nutUIConsts";
import { insertBackButton } from "../sharedUtils/insertBackButton";
uiManager.addUI(
    config.uiNames.PlayerShops.View,
    "View Player Shops",
    (player, featuredOnly, myShopsOnly, backButton) => {
        let form = new ActionForm();
        let myTitle = myShopsOnly
            ? `My Shops`
            : featuredOnly
            ? `Featured Player Shops`
            : `All Player Shops`;
        form.title(`${NUT_UI_TAG}§r§f${myTitle}`);
        insertBackButton(form, backButton);
        let pshops = shopAPI.shops.findDocuments({ type: "PLAYER_SHOP" });
        form.button(
            `§cBack\n§7Go back to main page`,
            `textures/blocks/barrier`,
            (player) => {
                uiManager.open(player, config.uiNames.PlayerShops.Root);
            }
        );
        if (!featuredOnly) {
            form.button(
                `§bCreate A Shop\n§7Make your own shop`,
                icons.resolve("leaf/image-1202"),
                (player) => {
                    let modal = new ModalForm();
                    modal.textField("Name", "Name of your shop", undefined);
                    modal.show(player, false, (player, response) => {
                        if (
                            response.canceled ||
                            !response ||
                            !response.formValues ||
                            !response.formValues[0]
                        )
                            return uiManager.open(
                                player,
                                config.uiNames.PlayerShops.View
                            );
                        shopAPI.createPlayerShop(
                            response.formValues[0],
                            player
                        );
                        return uiManager.open(
                            player,
                            config.uiNames.PlayerShops.View
                        );
                    });
                }
            );
        }
        let playerID = playerStorage.getID(player);
        for (const shop of pshops) {
            if (featuredOnly && !worldTags.hasTag(`Featured-Shop:${shop.id}`))
                continue;
            if (myShopsOnly && shop.data.owner != playerID) continue;
            let owner = playerStorage.getPlayerByID(shop.data.owner);
            form.button(
                `${
                    worldTags.hasTag(`Featured-Shop:${shop.id}`)
                        ? "§e\uE10A "
                        : "§a"
                }${shop.data.title}\n§r§7${owner.name}`,
                shop.data.icon
                    ? icons.resolve(shop.data.icon)
                    : icons.resolve("leaf/image-1202"),
                (player) => {
                    uiManager.open(player, config.uiNames.Shop.Root, shop.id);
                }
            );
        }
        form.show(player, false, (player, response) => {});
    }
);
uiManager.addUI(
    config.uiNames.PlayerShops.Root,
    "Player Shops",
    (player, backButton) => {
        let form = new ActionForm();
        form.title(`${NUT_UI_TAG}§r§fPlayer Shops`);
        insertBackButton(form, backButton);

        //let pshops = shopAPI.shops.findDocuments({type:"PLAYER_SHOP"});
        form.button(
            "§dPlayer Shops\n§7View all player shops",
            icons.resolve("leaf/image-1202"),
            (player) => {
                uiManager.open(player, config.uiNames.PlayerShops.View);
            }
        );
        form.button(
            "§aMy Shops\n§7View your shops",
            icons.resolve("leaf/image-1202"),
            (player) => {
                uiManager.open(
                    player,
                    config.uiNames.PlayerShops.View,
                    false,
                    true
                );
            }
        );
        form.button(
            "§eFeatured Shops\n§7View featured shops",
            icons.resolve("leaf/image-626"),
            (player) => {
                uiManager.open(player, config.uiNames.PlayerShops.View, true);
            }
        );
        form.button(
            "§bShop Leaderboards\n§7View player shop leaderboard",
            icons.resolve("leaf/image-068"),
            (player) => {
                uiManager.open(player, config.uiNames.PlayerShops.Leaderboard);
            }
        );
        // form.button("§eFeatured\n§7View all featured shops", icons.resolve("leaf/image-626"))
        // form.button("§aCollect\n§7Collect items & money", icons.resolve("leaf/image-630"))
        // form.button("§6Leaderboards\n§7View shop leaderboards", icons.resolve("leaf/image-068"))
        //
        //
        //
        form.show(player, false, () => {});
    }
);
//image-1334
