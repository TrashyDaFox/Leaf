import icons from "../../api/icons";
import config from "../../versionData";
import { prismarineDb } from "../../lib/prismarinedb";
import { ActionForm } from "../../lib/form_func";
import uiManager from "../../uiManager";
import { world } from "@minecraft/server";
import uiBuilder from "../../api/uiBuilder";
import configAPI from "../../api/config/configAPI";

const MENU_ICONS = {
    help: `textures/azalea_icons/getHELP`,
    guiMaker: `textures/azalea_icons/GUIMaker/FormsV2`,
    chestMaker: `textures/azalea_icons/ChestLarge`,
    sidebarEditor: `textures/update_pings_icons/main-settings/SidebarEDITOR`,
    customCommands: `textures/azalea_icons/CustomCommandMAKER`,
    rtp: `textures/update_pings_icons/main-settings/RngTP`,
    clans: `textures/update_pings_icons/main-settings/clans`,
    events: `textures/update_pings_icons/main-settings/eventsICON`,
    currency: `textures/update_pings_icons/main-settings/Money settings`,
    misc: `textures/update_pings_icons/main-settings/extraTools`
};
if(false) {
    uiBuilder.internalUIs.push({
        "name": "§p§l§0§1§rConfig UI / Support & Info",
        "body": "",
        "layout": 4,
        "type": 0,
        "buttons": [
          {
            "text": "§cDev Settings",
            "subtext": "uwu kawaii settings please dont touch :trans:",
            "action": "/scriptevent leafgui:dev",
            "actions": [
              "/scriptevent leafgui:dev"
            ],
            "iconID": "^textures/azalea_icons/DevSettings",
            "iconOverrides": [],
            "requiredTag": "$cfg/DevMode",
            "id": 5,
            "displayOverrides": [],
            "nutUIHeaderButton": true,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "sellButtonScoreboard": "money",
            "buyButtonEnabled": false,
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "buyButtonItem": ""
          },
          {
            "text": "Main Settings",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui",
            "actions": [
              "/scriptevent leaf:open nutui/main"
            ],
            "iconID": "",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 0,
            "displayOverrides": [],
            "nutUIHeaderButton": false,
            "nutUIHalf": 3,
            "nutUINoSizeKey": true,
            "nutUIAlt": false,
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "sellButtonScoreboard": "money",
            "buyButtonEnabled": false,
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "buyButtonItem": ""
          },
          {
            "text": "Misc Settings",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/misc",
            "actions": [
              "/scriptevent leaf:open nutui/misc"
            ],
            "iconID": "",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 1,
            "displayOverrides": [],
            "nutUIHeaderButton": false,
            "nutUIHalf": 4,
            "nutUINoSizeKey": true,
            "nutUIAlt": false,
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "sellButtonScoreboard": "money",
            "buyButtonEnabled": false,
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "buyButtonItem": "",
            "nutUIColorCondition": ""
          },
          {
            "text": "Info & Support",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/credits",
            "actions": [
              "/scriptevent leaf:open nutui/credits"
            ],
            "iconID": "",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 3,
            "displayOverrides": [],
            "nutUIHeaderButton": false,
            "nutUIHalf": 5,
            "nutUINoSizeKey": false,
            "nutUIAlt": true,
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "sellButtonScoreboard": "money",
            "buyButtonEnabled": false,
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "buyButtonItem": "",
            "nutUIColorCondition": ""
          },
          {
            "text": "§aGuides",
            "subtext": "View guides on how to use leaf",
            "action": "/scriptevent leafgui:guides",
            "actions": [
              "/scriptevent leafgui:guides"
            ],
            "iconID": "leaf/image-0875",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 17,
            "disabled": false
          },
          {
            "text": "§6Changelogs",
            "subtext": "View changelogs for this update",
            "action": "/scriptevent leafgui:changelogs",
            "actions": [
              "/scriptevent leafgui:changelogs"
            ],
            "iconID": "leaf/image-068",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 18,
            "disabled": false
          },
          {
            "text": "§bCredits",
            "subtext": "People who have helped with leaf",
            "action": "/scriptevent leafgui:credits",
            "actions": [
              "/scriptevent leafgui:credits"
            ],
            "iconID": "^textures/minidevs/TrashyKittyFem",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 19,
            "disabled": false
          }
        ],
        "subuis": {},
        "scriptevent": "nutui/credits",
        "lastID": 19,
        "theme": 5,
        "pinned": true
      })
    uiBuilder.internalUIs.push({
          "name": "§p§l§0§1§rConfig UI / Misc",
          "body": "",
          "layout": 4,
          "type": 0,
          "buttons": [
            {
              "text": "§cDev Settings",
              "subtext": "uwu kawaii settings please dont touch :trans:",
              "action": "/scriptevent leafgui:dev",
              "actions": [
                "/scriptevent leafgui:dev"
              ],
              "iconID": "^textures/azalea_icons/DevSettings",
              "iconOverrides": [],
              "requiredTag": "$cfg/DevMode",
              "id": 5,
              "displayOverrides": [],
              "nutUIHeaderButton": true,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": ""
            },
            {
              "text": "Main Settings",
              "subtext": "",
              "action": "/scriptevent leaf:open nutui",
              "actions": [
                "/scriptevent leaf:open nutui/main"
              ],
              "iconID": "",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 0,
              "displayOverrides": [],
              "nutUIHeaderButton": false,
              "nutUIHalf": 3,
              "nutUINoSizeKey": true,
              "nutUIAlt": false,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": ""
            },
            {
              "text": "Misc Settings",
              "subtext": "",
              "action": "/scriptevent leaf:open nutui/misc",
              "actions": [
                "/scriptevent leaf:open nutui/misc"
              ],
              "iconID": "",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 1,
              "displayOverrides": [],
              "nutUIHeaderButton": false,
              "nutUIHalf": 4,
              "nutUINoSizeKey": true,
              "nutUIAlt": true,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": ""
            },
            {
              "text": "Info & Support",
              "subtext": "",
              "action": "/scriptevent leaf:open nutui/credits",
              "actions": [
                "/scriptevent leaf:open nutui/credits"
              ],
              "iconID": "",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 3,
              "displayOverrides": [],
              "nutUIHeaderButton": false,
              "nutUIHalf": 5,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": ""
            },
            {
              "text": "§eLeaderboards",
              "subtext": "Configure this servers leaderboards",
              "action": "/scriptevent leafgui:leaderboards_root",
              "actions": [
                "/scriptevent leafgui:leaderboards_root"
              ],
              "iconID": "leaf/image-625",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 11,
              "disabled": false
            },
            {
              "text": "§dClans",
              "subtext": "Configure & Manage Clans",
              "action": "/scriptevent leafgui:clans_admin",
              "actions": [
                "/scriptevent leafgui:clans_admin"
              ],
              "iconID": "leaf/image-1073",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 12,
              "disabled": false
            },
            {
              "text": "§aSnippet §bBook",
              "subtext": "Store & Reuse parts of your UIs",
              "action": "/scriptevent leafgui:snippet_book",
              "actions": [
                "/scriptevent leafgui:snippet_book"
              ],
              "iconID": "leaf/image-0876",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 13,
              "disabled": false
            },
            {
              "text": "§6Role §vEditor",
              "subtext": "Edit player permissions",
              "action": "/scriptevent leafgui:role_editor",
              "actions": [
                "/scriptevent leafgui:role_editor"
              ],
              "iconID": "leaf/image-068",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 14,
              "disabled": false
            },
            {
              "text": "§cModeration §dHub",
              "subtext": "Reports, Bans & More!",
              "action": "/scriptevent leafgui:moderation_hub",
              "actions": [
                "/scriptevent leafgui:moderation_hub"
              ],
              "iconID": "leaf/image-1191",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 15,
              "disabled": false
            },
            {
              "text": "§nMines §sConfig",
              "subtext": "Configure prison mines",
              "action": "/scriptevent leafgui:mines",
              "actions": [
                "/scriptevent leafgui:mines"
              ],
              "iconID": "leaf/image-0866",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 16,
              "disabled": false
            },
            {
              "text": "§6Homes §3Config",
              "subtext": "Configure homes",
              "action": "/scriptevent leafgui:homes_config",
              "actions": [
                "/scriptevent leafgui:homes_config"
              ],
              "iconID": "leaf/image-1169",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 17,
              "disabled": false
            },
            {
              "text": "§bBattle §uPass",
              "subtext": "I did NOT want to add this",
              "action": "/scriptevent leafgui:battle_pass",
              "actions": [
                "/scriptevent leafgui:battle_pass"
              ],
              "iconID": "leaf/image-1334",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 18,
              "disabled": false
            },
            {
              "text": "§ePlayer §aSettings",
              "subtext": "Manage ranks & more",
              "action": "/scriptevent leafgui:player_settings",
              "actions": [
                "/scriptevent leafgui:player_settings"
              ],
              "iconID": "leaf/image-1106",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 19,
              "disabled": false
            },
            {
              "text": "§bCombat §9Log",
              "subtext": "Configure combat log",
              "action": "/scriptevent leafgui:combat_log",
              "actions": [
                "/scriptevent leafgui:combat_log"
              ],
              "iconID": "leaf/image-1295",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 20,
              "disabled": false
            },
            {
              "text": "§dCustom §5Enchants",
              "subtext": "im starting an onlyfans",
              "action": "/scriptevent leafgui:custom_enchants",
              "actions": [
                "/scriptevent leafgui:custom_enchants"
              ],
              "iconID": "leaf/image-1299",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 21,
              "disabled": false
            }
          ],
          "subuis": {},
          "scriptevent": "nutui/misc",
          "lastID": 21,
          "theme": 5,
          "pinned": true
    })
    uiBuilder.internalUIs.push({
        "name": "§p§l§0§1§rConfig UI / Main",
        "body": "",
        "layout": 4,
        "type": 0,
        "buttons": [
            {
              "text": "§cDev Settings",
              "subtext": "uwu kawaii settings please dont touch :trans:",
              "action": "/scriptevent leafgui:dev",
              "actions": [
                "/scriptevent leafgui:dev"
              ],
              "iconID": "^textures/azalea_icons/DevSettings",
              "iconOverrides": [],
              "requiredTag": "$cfg/DevMode",
              "id": 5,
              "displayOverrides": [],
              "nutUIHeaderButton": true,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": ""
            },
            {
              "text": "Main Settings",
              "subtext": "",
              "action": "/scriptevent leaf:open nutui/main",
              "actions": [
                "/scriptevent leaf:open nutui/main"
              ],
              "iconID": "",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 0,
              "displayOverrides": [],
              "nutUIHeaderButton": false,
              "nutUIHalf": 3,
              "nutUINoSizeKey": true,
              "nutUIAlt": true,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": "",
              "nutUIColorCondition": "",
              "disabled": false
            },
            {
              "text": "Misc Settings",
              "subtext": "",
              "action": "/scriptevent leaf:open nutui/misc",
              "actions": [
                "/scriptevent leaf:open nutui/misc"
              ],
              "iconID": "",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 1,
              "displayOverrides": [],
              "nutUIHeaderButton": false,
              "nutUIHalf": 4,
              "nutUINoSizeKey": true,
              "nutUIAlt": false,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": ""
            },
            {
              "text": "Info & Support",
              "subtext": "",
              "action": "/scriptevent leaf:open nutui/credits",
              "actions": [
                "/scriptevent leaf:open nutui/credits"
              ],
              "iconID": "",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 3,
              "displayOverrides": [],
              "nutUIHeaderButton": false,
              "nutUIHalf": 5,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": ""
            },
            {
              "text": "§m§0§1§r§aPreset §bBrowser",
              "subtext": "Presets made by the leaf community!",
              "action": "/scriptevent leafgui:preset_browser",
              "actions": [
                "/scriptevent leafgui:preset_browser"
              ],
              "iconID": "Packs/Asteroid/global",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 12,
              "disabled": false,
              "displayOverrides": [],
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "buyButtonEnabled": false,
              "buyButtonItem": "",
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "nutUIColorCondition": "",
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "nutUIAlt": false
            },
            {
              "text": "§aFeatures & Experiments",
              "subtext": "Toggle parts of leaf",
              "action": "/scriptevent leafgui:modules_config",
              "actions": [
                "/scriptevent leafgui:modules_config"
              ],
              "iconID": "Packs/Asteroid/change",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 4,
              "displayOverrides": [],
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": "",
              "nutUIAlt": false
            },
            {
              "text": "§dGUIs",
              "subtext": "Edit your GUIs",
              "action": "/scriptevent leafgui:ui_builder_main_page",
              "actions": [
                "/scriptevent leafgui:ui_builder_main_page"
              ],
              "iconID": "Packs/Asteroid/ui",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 2,
              "displayOverrides": [],
              "nutUIHeaderButton": false,
              "nutUIHalf": 1,
              "nutUINoSizeKey": true,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": "",
              "nutUIAlt": false,
              "meta": ""
            },
            {
              "text": "§eGet Help",
              "subtext": "",
              "action": "/scriptevent leaf:open <this>",
              "actions": [
                "/scriptevent leaf:open <this>"
              ],
              "iconID": "leaf/image-853",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 8,
              "displayOverrides": [],
              "nutUIHeaderButton": false,
              "nutUIHalf": 2,
              "nutUINoSizeKey": false,
              "nutUIAlt": false,
              "disabled": false,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": ""
            },
            {
              "text": "§qSidebar Editor",
              "subtext": "Make Custom Sidebars Easily",
              "action": "scriptevent leafgui:sidebar_editor_root",
              "actions": [
                "scriptevent leafgui:sidebar_editor_root"
              ],
              "iconID": "leaf/image-521",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 7,
              "displayOverrides": [
                {
                  "condition": "$cfg/RefreshedSidebar",
                  "text": "§uSidebar §dV2",
                  "subtext": "The new and improved sidebar editor!",
                  "iconID": "leaf/image-521"
                }
              ],
              "nutUIHeaderButton": false,
              "nutUIHalf": 0,
              "nutUINoSizeKey": false,
              "sellButtonEnabled": false,
              "sellButtonItem": "minecraft:coal",
              "sellButtonItemCount": 4,
              "sellButtonPrice": 20,
              "sellButtonScoreboard": "money",
              "buyButtonEnabled": false,
              "buyButtonPrice": 20,
              "buyButtonScoreboard": "money",
              "buyButtonItem": "",
              "nutUIAlt": false,
              "nutUIColorCondition": "",
              "disabled": false
            },
            {
              "text": "§aEconomy §2Settings",
              "subtext": "Manage currencies and more",
              "action": "/scriptevent leaf:open nutui/economy",
              "actions": [
                "/scriptevent leaf:open nutui/economy"
              ],
              "iconID": "leaf/image-481",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 14,
              "disabled": false
            },
            {
              "text": "§vActions",
              "subtext": "Actions!! :3",
              "action": "/scriptevent leafgui:actions",
              "actions": [
                "/scriptevent leafgui:actions"
              ],
              "iconID": "Packs/Asteroid/slash",
              "iconOverrides": [],
              "requiredTag": "",
              "id": 13,
              "disabled": false
            }
          ],
          "subuis": {},
          "scriptevent": "nutui/main",
          "lastID": 14,
          "theme": 5,
          "pinned": true
    })
    uiBuilder.internalUIs.push({
        "name": "Features",
        "body": "",
        "layout": 4,
        "type": 0,
        "buttons": [
          {
            "text": "§l§cGo Back",
            "subtext": "Go back to main settings.",
            "action": "/scriptevent leaf:open nutui/main",
            "actions": [
              "/scriptevent leaf:open nutui/main"
            ],
            "iconID": "^textures/azalea_icons/2",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 0,
            "displayOverrides": [],
            "nutUIColorCondition": "",
            "nutUIHeaderButton": true,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "§bFeatures",
            "subtext": "Main features of leaf",
            "action": "/scriptevent leaf:open <this>",
            "actions": [
              "/scriptevent leaf:open nutui/features"
            ],
            "iconID": "",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 1,
            "displayOverrides": [],
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "disabled": false
          },
          {
            "text": "Chatranks",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property Chatranks false",
            "actions": [
              "/scriptevent leaf:set_bool_property Chatranks false",
              "/scriptevent leaf:open nutui/features"
            ],
            "iconID": "",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 2,
            "displayOverrides": [],
            "nutUIColorCondition": "!$cfg/Chatranks",
            "nutUIHeaderButton": false,
            "nutUIHalf": 1,
            "nutUINoSizeKey": true,
            "nutUIAlt": false,
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "sellButtonScoreboard": "money",
            "buyButtonEnabled": false,
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "buyButtonItem": ""
          },
          {
            "text": "Chatranks",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property Chatranks true",
            "actions": [
              "/scriptevent leaf:set_bool_property Chatranks true",
              "/scriptevent leaf:open nutui/features"
            ],
            "iconID": "",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 3,
            "displayOverrides": [],
            "nutUIColorCondition": "$cfg/Chatranks",
            "nutUIHeaderButton": false,
            "nutUIHalf": 2,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "sellButtonEnabled": false,
            "sellButtonItem": "minecraft:coal",
            "sellButtonItemCount": 4,
            "sellButtonPrice": 20,
            "sellButtonScoreboard": "money",
            "buyButtonEnabled": false,
            "buyButtonPrice": 20,
            "buyButtonScoreboard": "money",
            "buyButtonItem": ""
          },
          {
            "text": "Clans",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property Clans false",
            "actions": [
              "/scriptevent leaf:set_bool_property Clans false",
              "/scriptevent leaf:open nutui/features"
            ],
            "iconID": "",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 4,
            "displayOverrides": [],
            "nutUIColorCondition": "!$cfg/Clans",
            "nutUIHeaderButton": false,
            "nutUIHalf": 1,
            "nutUINoSizeKey": true,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Clans",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property Clans true",
            "actions": [
              "/scriptevent leaf:set_bool_property Clans true",
              "/scriptevent leaf:open nutui/features"
            ],
            "iconID": "",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 5,
            "displayOverrides": [],
            "nutUIColorCondition": "$cfg/Clans",
            "nutUIHeaderButton": false,
            "nutUIHalf": 2,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Land Claims",
            "subtext": "OFF",
            "action": "/scriptevent leaf:set_bool_property LandClaims false",
            "actions": [
              "/scriptevent leaf:set_bool_property LandClaims false",
              "/scriptevent leaf:open nutui/features"
            ],
            "iconID": "",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 6,
            "displayOverrides": [],
            "nutUIColorCondition": "!$cfg/LandClaims",
            "nutUIHeaderButton": false,
            "nutUIHalf": 1,
            "nutUINoSizeKey": true,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "text": "Land Claims",
            "subtext": "ON",
            "action": "/scriptevent leaf:set_bool_property LandClaims true",
            "actions": [
              "/scriptevent leaf:set_bool_property LandClaims true",
              "/scriptevent leaf:open nutui/features"
            ],
            "iconID": "",
            "iconOverrides": [],
            "requiredTag": "",
            "id": 7,
            "displayOverrides": [],
            "nutUIColorCondition": "$cfg/LandClaims",
            "nutUIHeaderButton": false,
            "nutUIHalf": 2,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false
          },
          {
            "type": "group",
            "buttons": [
              {
                "text": "Pwarps",
                "subtext": "OFF",
                "action": "/scriptevent leaf:set_bool_property Pwarps false",
                "actions": [
                  "/scriptevent leaf:set_bool_property Pwarps false",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "!$cfg/Pwarps",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              },
              {
                "text": "Pwarps",
                "subtext": "ON",
                "action": "/scriptevent leaf:set_bool_property Pwarps true",
                "actions": [
                  "/scriptevent leaf:set_bool_property Pwarps true",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "nutUIColorCondition": "$cfg/Pwarps",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false,
                "id": 15
              }
            ],
            "buttonRow": true,
            "id": 13
          },
          {
            "type": "group",
            "buttons": [
              {
                "text": "Shops",
                "subtext": "OFF",
                "action": "/scriptevent leaf:set_bool_property Shops false",
                "actions": [
                  "/scriptevent leaf:set_bool_property Shops false",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "!$cfg/Shops",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              },
              {
                "text": "Shops",
                "subtext": "ON",
                "action": "/scriptevent leaf:set_bool_property Shops true",
                "actions": [
                  "/scriptevent leaf:set_bool_property Shops true",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "$cfg/Shops",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              }
            ],
            "buttonRow": true,
            "id": 13
          },
          {
            "type": "group",
            "buttons": [
              {
                "text": "PlayerShops",
                "subtext": "OFF",
                "action": "/scriptevent leaf:set_bool_property PlayerShops false",
                "actions": [
                  "/scriptevent leaf:set_bool_property PlayerShops false",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "!$cfg/PlayerShops",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              },
              {
                "text": "PlayerShops",
                "subtext": "ON",
                "action": "/scriptevent leaf:set_bool_property PlayerShops true",
                "actions": [
                  "/scriptevent leaf:set_bool_property PlayerShops true",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "$cfg/PlayerShops",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              }
            ],
            "buttonRow": true,
            "id": 13
          },
          {
            "text": "§aExperiments",
            "subtext": "Experimental features",
            "action": "/scriptevent leaf:open nutui/features",
            "actions": [
              "/scriptevent leaf:open nutui/features"
            ],
            "iconOverrides": [],
            "requiredTag": "",
            "id": 16,
            "disabled": false
          },
          {
            "type": "group",
            "buttons": [
              {
                "text": "Generators",
                "subtext": "OFF",
                "action": "/scriptevent leaf:set_bool_property Generators false",
                "actions": [
                  "/scriptevent leaf:set_bool_property Generators false",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "!$cfg/Generators",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              },
              {
                "text": "Generators",
                "subtext": "ON",
                "action": "/scriptevent leaf:set_bool_property PlayerShops true",
                "actions": [
                  "/scriptevent leaf:set_bool_property Generators true",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "$cfg/Generators",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              }
            ],
            "buttonRow": true,
            "id": 13
          },
          {
            "type": "group",
            "buttons": [
              {
                "text": "Clans Admin",
                "subtext": "OFF",
                "action": "/scriptevent leaf:set_bool_property Generators false",
                "actions": [
                  "/scriptevent leaf:set_bool_property ClansAdmin false",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "!$cfg/ClansAdmin",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              },
              {
                "text": "Clans Admin",
                "subtext": "ON",
                "action": "/scriptevent leaf:set_bool_property Generators true",
                "actions": [
                  "/scriptevent leaf:set_bool_property ClansAdmin true",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "$cfg/ClansAdmin",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              }
            ],
            "buttonRow": true,
            "id": 13
          },
          {
            "type": "group",
            "buttons": [
              {
                "text": "Refreshed Sidebar",
                "subtext": "OFF",
                "action": "/scriptevent leaf:set_bool_property ClansAdmin false",
                "actions": [
                  "/scriptevent leaf:set_bool_property RefreshedSidebar false",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "!$cfg/RefreshedSidebar",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              },
              {
                "text": "Refreshed Sidebar",
                "subtext": "ON",
                "action": "/scriptevent leaf:set_bool_property ClansAdmin true",
                "actions": [
                  "/scriptevent leaf:set_bool_property RefreshedSidebar true",
                  "/scriptevent leaf:open nutui/features"
                ],
                "requiredTag": "",
                "displayOverrides": [],
                "sellButtonEnabled": false,
                "sellButtonItem": "minecraft:coal",
                "sellButtonItemCount": 4,
                "sellButtonPrice": 20,
                "buyButtonEnabled": false,
                "buyButtonItem": "",
                "buyButtonPrice": 20,
                "buyButtonScoreboard": "money",
                "nutUIColorCondition": "$cfg/RefreshedSidebar",
                "nutUIHeaderButton": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "disabled": false
              }
            ],
            "buttonRow": true,
            "id": 13
          }
        ],
        "subuis": {},
        "scriptevent": "nutui/features",
        "lastID": 16,
        "theme": 1,
        "pinned": true
      })
}
uiManager.addUI(config.uiNames.ConfigMain, "Config Main", (player)=>{
    if(!player.hasTag("old-config")) return player.runCommand("scriptevent leaf:open nutui/main")
    let form = new ActionForm();
    
    form.title("§r§nMain Settings")
    form.button("§cBack\n§7Click to Go Back", `textures/azalea_icons/2`, (player)=>{
        uiManager.open(player, config.uiNames.ConfigRoot);
    });
    form.label("§7---- §eSupport §7----")
    form.button(`§l§aGet Help\n§r§7Full documentation for leaf`, MENU_ICONS.help, (player)=>{
        uiManager.open(player, config.uiNames.Help)
    })
    form.label("§7---- §dMain stuff §7----")
    form.button(`§l§cGUI Maker\n§r§7Make GUIs`, MENU_ICONS.guiMaker, (player)=>{
        uiManager.open(player, config.uiNames.UIBuilderRoot)
    })
    // form.button(`§l§eChest Maker\n§r§7Make GUIs`, MENU_ICONS.chestMaker, (player)=>{
    //     uiManager.open(player, config.uiNames.ChestGuiRoot)
    // })
    form.button(`§l§qSidebar Editor\n§r§7Make Custom Sidebars Easily`, MENU_ICONS.sidebarEditor, (player)=>{
        uiManager.open(player, config.uiNames.SidebarEditorRoot)
    })
    form.button(`§l§5Custom Commands\n§r§7Make commands like !command`, MENU_ICONS.customCommands, (player)=>{
        uiManager.open(player, config.uiNames.CustomCommands.root)
    })

    // form.button(`§l§bWeekly Rewards\n§r§7Give players weekly rewards`, icons.resolve("Packs/Asteroid/winPING"), (player)=>{
    //     uiManager.open(player, config.uiNames.DailyRewards.Root, "REWARDS_WEEKLY")
    // })
    // form.button(`§l§bMonthly Rewards\n§r§7Give players monthly rewards`, icons.resolve("Packs/Asteroid/winPING"), (player)=>{
    //     uiManager.open(player, config.uiNames.DailyRewards.Root, "REWARDS_MONTHLY")
    // })
    form.label("§7---- §dMiscellaneous §7----")
    form.button(`§l§bLeaderboards\n§r§7Configure Leaderboards`, icons.resolve("^textures/azalea_icons/13"), (player)=>{
        uiManager.open(player, config.uiNames.Leaderboards.Root)
    })

    form.button(`§l§dRTP\n§r§7Configure RTP`, MENU_ICONS.rtp, (player)=>{
        uiManager.open(player, config.uiNames.Config.RTP)
    })



    // form.button(`§l§6Bounty Settings\n§r§7Configure Bounties`, icons.resolve("leaf/image-0909"), (player)=>{

    // })
    // form.button(`§l§bCrate Settings\n§r§7Crate and mange crates`, icons.resolve("leaf/image-630"), (player)=>{

    // })
    form.button(`§l§cClans\n§r§7Configure clans`, MENU_ICONS.clans, (player)=>{
        uiManager.open(player, config.uiNames.Config.Clans)
    })



    // form.button(`§l§9Permissions\n§r§7Manage player permissions`, `textures/update_pings_icons/main-settings/perms`, (player)=>{

    // })


    // form.button(`§l§3PVP Settings\n§r§7Configure pvp settings`, `textures/update_pings_icons/main-settings/PVP`, (player)=>{

    // })
    // form.button(`§l§cAnti Cheat\n§r§7Configure ant cheat`, icons.resolve("Packs/Asteroid/smithing_icon"), (player)=>{

    // })







    // form.button(`§l§fPlayer Settings\n§r§7Configure player settings`, `textures/update_pings_icons/main-settings/player settings`, (player)=>{

    // })
    // form.button(`§l§gChat Settings\n§r§7Configure chat`, `textures/update_pings_icons/main-settings/Chat settings`, (player)=>{

    // })
    





    

    // form.button(`§l§dVerification Settings\n§r§7Stop annoying kids from joining`, icons.resolve("Packs/Asteroid/adventure_crystal_epic"), (player)=>{

    // })
    // form.button(`§l§aWarp Settings\n§r§7Warp`, `textures/update_pings_icons/main-settings/warp settings`, (player)=>{

    // })
    // form.button(`§l§nBank Settings\n§r§7Banky wanky`, `textures/update_pings_icons/main-settings/bank`, (player)=>{

    // })
    // form.button(`§l§qAuction House\n§r§7Manage auction house`, `textures/update_pings_icons/main-settings/Ah`, (player)=>{

    // })
    // form.button(`§l§6Crates\n§r§7Configure crates`, `textures/update_pings_icons/main-settings/crates`, (player)=>{
    //     uiManager.open(player, config.uiNames.Crates.Root)
    // })
    form.button(`§l§eEvents\n§r§7Events`, MENU_ICONS.events, (player)=>{
        uiManager.open(player, config.uiNames.Events.EventsRoot)
    })
    form.button(`§l§aCurrency Settings\n§r§7Manage currencies`, MENU_ICONS.currency, (player)=>{
        uiManager.open(player, config.uiNames.CurrencyEditor)
    })
    // form.button(`§l§pMiscellaneous Tools\n§r§7Extra utilities`, MENU_ICONS.misc, (player)=>{
    //     uiManager.open(player, config.uiNames.CurrencyEditor)
    // })
    form.label("§7-------------------------------")
    form.header("  §l§cDANGER ZONE")
    form.label("§r§eONLY USE THESE IF YOU REALLY NEED TO")
    form.button(`§cDelete All Config\n§7DANGER`, `textures/azalea_icons/Delete`, (player)=>{
        uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you sure you want to do this?", ()=>{
            uiManager.open(player, config.uiNames.Basic.Confirmation, "Are you ABSOLUTELY sure? This cant be undone!", ()=>{
                for(const id of world.getDynamicPropertyIds()) {
                    world.setDynamicProperty(id)
                }
                prismarineDb.sendToAllTables("CLEAR")
                prismarineDb.sendToAllTables("RELOAD")
                player.success("Deleted ALL config")

            }, ()=>{
                uiManager.open(player, config.uiNames.ConfigMain)
            })
        }, ()=>{
            uiManager.open(player, config.uiNames.ConfigMain)
        })
    })

    form.show(player, false, ()=>{})
})