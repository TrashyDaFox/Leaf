import icons from "../../api/icons";
import playerStorage from "../../api/playerStorage";
import shopAPI from "../../api/shopAPI";
import config from "../../config";
import { ActionForm, ModalForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { worldTags } from "../../worldTags";
uiManager.addUI(config.uiNames.PlayerShops.View, "View Player Shops", (player, featuredOnly, myShopsOnly)=>{
    let form = new ActionForm();
    form.title(myShopsOnly ? `My Shops` : featuredOnly ? `Featured Player Shops` : `All Player Shops`)
    let pshops = shopAPI.shops.findDocuments({type:"PLAYER_SHOP"});
    form.button(`§cBack\n§7Go back to main page`, `textures/blocks/barrier`, (player)=>{
        uiManager.open(player, config.uiNames.PlayerShops.Root)
    })
    if(!featuredOnly) {
        form.button(`§bCreate A Shop\n§7Make your own shop`, icons.resolve("leaf/image-1202"), (player)=>{
            let modal = new ModalForm();
            modal.textField("Name", "Name of your shop", undefined);
            modal.show(player, false, (player, response)=>{
                if(response.canceled || !response || !response.formValues || !response.formValues[0]) return uiManager.open(player, config.uiNames.PlayerShops.View)
                shopAPI.createPlayerShop(response.formValues[0], player)
                return uiManager.open(player, config.uiNames.PlayerShops.View)
            })
        })
    }
    let playerID = playerStorage.getID(player);
    for(const shop of pshops) {
        if(featuredOnly && !worldTags.hasTag(`Featured-Shop:${shop.id}`)) continue;
        if(myShopsOnly && shop.data.owner != playerID) continue;
        let owner = playerStorage.getPlayerByID(shop.data.owner)
        form.button(`${worldTags.hasTag(`Featured-Shop:${shop.id}`) ? "§e\uE10A " : "§a"}${shop.data.title}\n§r§7${owner.name}`, shop.data.icon ? icons.resolve(shop.data.icon) : icons.resolve("leaf/image-1202"), (player)=>{
            uiManager.open(player, config.uiNames.Shop.Root, shop.id);
        })
    }
    form.show(player, false, (player, response)=>{})
})
uiManager.addUI(config.uiNames.PlayerShops.Root, "Player Shops", (player)=>{
    let form = new ActionForm();
    form.title("Player Shops")
    //let pshops = shopAPI.shops.findDocuments({type:"PLAYER_SHOP"});
    form.button("§dPlayer Shops\n§7View all player shops", icons.resolve("leaf/image-1202"), (player)=>{
        uiManager.open(player, config.uiNames.PlayerShops.View)
    })
    form.button("§aMy Shops\n§7View your shops", icons.resolve("leaf/image-1202"), (player)=>{
        uiManager.open(player, config.uiNames.PlayerShops.View, false, true);
    })
    form.button("§eFeatured Shops\n§7View featured shops", icons.resolve("leaf/image-626"), (player)=>{
        uiManager.open(player, config.uiNames.PlayerShops.View, true)
    })
    form.button("§bShop Leaderboards\n§7View player shop leaderboard", icons.resolve("leaf/image-068"), (player)=>{
        player.sendMessage("Does not work yet")
    })
    // form.button("§eFeatured\n§7View all featured shops", icons.resolve("leaf/image-626"))
    // form.button("§aCollect\n§7Collect items & money", icons.resolve("leaf/image-630"))
    // form.button("§6Leaderboards\n§7View shop leaderboards", icons.resolve("leaf/image-068"))
    //
    //
    //
    form.show(player, false, ()=>{})
})
//image-1334