import config from "../../versionData";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import emojis from '../../api/emojis'
let useNewCreditsUI = true;

let creditsList = [
    {
        name: `§dTrashy§bKitty ${emojis.trans}`,
        role: `Main Developer and Founder`,
        message: `leaf leaf leaf leaf leaf leaf leaf leaf leaf leaf leaf, azalea?!\n\nchronic strawberry eater\n(she/her btw)`,
        socials: {
            bsky: "trashdev.org",
            discord: "powertrash"
        },
        icon: `textures/minidevs/TrashyKittyFem`
    },
    {
        name: `§eFruitKitty`,
        role: `Helper dev and co-founder`,
        message: `I love oiled up big black men!`,
        socials: {
            bsky: "fruitkitty.xyz",
            discord: "fruitkitty"
        },
        icon: `textures/minidevs/TrashyKitty`
    },
    {
        name: `§nUpdate Pings`,
        role: `Texture Designer`,
        socials: {
            discord: "i_ate_my_keyboard_i_think"
        },
        icon: `textures/minidevs/UpdatePings`,
        message: "WHAT THE FUCKK IS OATMEAL?!"
    },
    {
        name: `§6DisBready`,
        role: `Community Manager`,
        socials: {
            discord: "disbready"
        },
        icon: "textures/minidevs/DisBready",
        message: "cat kitty cat cat kitty! nya :3"
    },
    {
        name: `§aAsteroid`,
        role: `Designer`,
        socials: {
            discord: `asteroid3946`
        },
        icon: `textures/minidevs/Astroidboi`,
        // message: `i like femboys, but IM NOT GAY I SWEAR ON MY LIFE >_<`
        message: `helped somewhat but kinda useless now ngl`
    },
    {
        name: `§vFeRaSs1429`,
        role: `Dark Mode Pack`,
        socials: {
            discord: `ferass1454`
        },
        message: `sample text`,
        icon: `textures/minidevs/FeRaSs1429`
    }
]

uiManager.addUI(config.uiNames.ConfigCredits, "Credits", (player, index = -1)=>{
    let form = new ActionForm();
    form.title("§r§dCredits")
    if(useNewCreditsUI) {
        if(index == -1) {
            let form = new ActionForm();
            form.title("§r§dCredits")
            form.button(`§cBack\n§7Goes Back`, `textures/azalea_icons/2`, (player)=>{
                uiManager.open(player, config.uiNames.ConfigRoot)
            })
            for(let i = 0;i < creditsList.length;i++) {
                let entry = creditsList[i]
                form.button(`${entry.name}\n§r§7${entry.role}`, entry.icon, (player)=>{
                    uiManager.open(player, config.uiNames.ConfigCredits, i)
                })
            }
            form.show(player, false, (player, response)=>{})
        } else {
            let form = new ActionForm();
            let entry = creditsList[index];
            form.title(entry.name);
            form.body(entry.message);
            form.button(`§cBack\n§7Goes Back`, `textures/azalea_icons/2`, (player)=>{
                uiManager.open(player, config.uiNames.ConfigCredits)
            })

            if(entry.socials.discord) {
                form.button(`§dDiscord\n§7${entry.socials.discord}`, `textures/azalea_icons/CreditsUI/Discord`, (player)=>{
                    uiManager.open(player, config.uiNames.ConfigCredits, index)
                })
            }
            if(entry.socials.bsky) {
                form.button(`§bBluesky\n§7@${entry.socials.bsky}`, `textures/azalea_icons/CreditsUI/BSky`, (player)=>{
                    uiManager.open(player, config.uiNames.ConfigCredits, index)
                })
            }
            form.show(player, false, (player, response)=>{})
        }
    } else {
        // form.button("§dTheLegendaryTrashCan\n§7Main Developer", `textures/minidevs/trash2024`, (player)=>{
        form.button("§dTrashyKitty\n§7Main Developer and Founder", `textures/minidevs/TrashyKittyNew`, (player)=>{
            uiManager.open(player, config.uiNames.ConfigRoot);
        })
        form.button("§eFruitKitty\n§7Helper dev and co-founder", `textures/minidevs/TrashyKitty`, (player)=>{
            uiManager.open(player, config.uiNames.ConfigRoot);
        })
        form.button("§6Hazel\n§7Emotional support", `textures/minidevs/DisBready`, (player)=>{
            uiManager.open(player, config.uiNames.ConfigRoot);
        })
        // form.button("§aSapphire\n§7Emotional support", `textures/minidevs/AverageAzaleaUser3`, (player)=>{
            // uiManager.open(player, config.uiNames.ConfigRoot);
        // })
        form.button("§aAsteroid\n§7Designer", `textures/minidevs/Astroidboi`, (player)=>{
            uiManager.open(player, config.uiNames.ConfigRoot);
        })
    
        // form.button("§5Quxioo\n§7leaf butt plug user", `textures/minidevs/danser`, (player)=>{
        //     uiManager.open(player, config.uiNames.ConfigRoot);
        // })
        form.button("§bmy dog\n§7shes extremely cute :3", `textures/leaf_icons/image-433`, (player)=>{
            uiManager.open(player, config.uiNames.ConfigRoot);
        })
        // form.button("§aRexy Cloudy\n§7Fortnite balls", `textures/minidevs/icon`, (player)=>{
        //     uiManager.open(player, config.uiNames.ConfigRoot);
        // })
        // form.button("tbh rexy is kinda gay\n§7frfr (rexy is a tool)", `textures/items/settings`, (player)=>{
            // uiManager.open(player, config.uiNames.ConfigRoot);
        // })
        form.show(player, false, ()=>{})
    
    }
})