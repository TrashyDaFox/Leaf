function encodeConfig(config) {
    let buffer = [];
    
    function writeUInt32(value) {
        buffer.push(...new Uint8Array(new Uint32Array([value]).buffer));
    }
    
    function writeString(str) {
        let encoded = new TextEncoder().encode(str);
        writeUInt32(encoded.length);
        buffer.push(...encoded);
    }
    
    writeString(config.name);
    writeUInt32(config.layout);
    writeUInt32(config.type);
    writeUInt32(config.buttons.length);
    
    for (let button of config.buttons) {
        writeString(button.text);
        writeString(button.subtext || "");
        writeUInt32(button.id);
    }
    
    return btoa(String.fromCharCode(...buffer));
}

function decodeConfig(encodedStr) {
    let decoded = new Uint8Array([...atob(encodedStr)].map(c => c.charCodeAt(0)));
    let offset = 0;
    
    function readUInt32() {
        let value = new DataView(decoded.buffer).getUint32(offset, true);
        offset += 4;
        return value;
    }
    
    function readString() {
        let length = readUInt32();
        let str = new TextDecoder().decode(decoded.slice(offset, offset + length));
        offset += length;
        return str;
    }
    
    let name = readString();
    let layout = readUInt32();
    let type = readUInt32();
    let buttonCount = readUInt32();
    let buttons = [];
    
    for (let i = 0; i < buttonCount; i++) {
        let text = readString();
        let subtext = readString();
        let id = readUInt32();
        buttons.push({ text, subtext: subtext || null, id });
    }
    
    return { name, layout, type, buttons };
}

console.log(encodeConfig({
    "name": "Config UI / Main",
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
        "text": " ",
        "subtext": null,
        "action": "",
        "actions": [
          ""
        ],
        "iconID": "",
        "iconOverrides": [],
        "requiredTag": "",
        "type": "group",
        "buttons": [
          {
            "text": "Main Settings",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/main",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/main",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 1,
            "actions": [
              "/scriptevent leaf:open nutui/main"
            ]
          },
          {
            "text": "Misc Settings",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/misc",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/misc",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 2,
            "actions": [
              "/scriptevent leaf:open nutui/misc"
            ]
          },
          {
            "text": "Info & Support",
            "subtext": "",
            "action": "/scriptevent leaf:open nutui/credits",
            "requiredTag": "",
            "displayOverrides": [],
            "nutUIColorCondition": "$thiseq/nutui/credits",
            "nutUIHeaderButton": false,
            "nutUIHalf": 0,
            "nutUINoSizeKey": false,
            "nutUIAlt": false,
            "disabled": false,
            "id": 3,
            "actions": [
              "/scriptevent leaf:open nutui/credits"
            ]
          }
        ],
        "buttonRow": true,
        "id": 22
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
        "action": "/scriptevent leafgui:uihelp",
        "actions": [
          "/scriptevent leafgui:uihelp"
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
        "buyButtonItem": "",
        "nutUIColorCondition": ""
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
        "disabled": false,
        "id": 15
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
        "text": "§vEvents",
        "subtext": "Do things when things happen",
        "action": "/scriptevent leafgui:actions",
        "actions": [
          "/scriptevent leafgui:events_editor_root"
        ],
        "iconID": "Packs/Asteroid/slash",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 13,
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
        "text": "§eBack to old design",
        "subtext": "Click to go back to old config UI design",
        "action": "/tag @s add old-config",
        "actions": [
          "/tag @s add old-config",
          "/scriptevent leafgui:config_menu_start_page"
        ],
        "iconID": "leaf/image-1135",
        "iconOverrides": [],
        "requiredTag": "!$cfg/DisableOldDesignButton",
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
        "nutUIHeaderButton": true,
        "nutUIHalf": 0,
        "nutUINoSizeKey": false,
        "nutUIAlt": false,
        "id": 16
      },
      {
        "text": "§aSkills",
        "subtext": "Coming soon",
        "action": "/scriptevent leafgui:skills",
        "actions": [
          "/scriptevent leafgui:skills"
        ],
        "iconID": "leaf/image-0973",
        "iconOverrides": [],
        "requiredTag": "",
        "disabled": true,
        "id": 18,
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
        "text": "§eZones §6Config",
        "subtext": "Manage zones",
        "action": "/scriptevent leafgui:zones",
        "actions": [
          "/scriptevent leafgui:zones"
        ],
        "iconID": "leaf/image-1190",
        "iconOverrides": [],
        "requiredTag": "$cfg/Zones",
        "disabled": false,
        "id": 19,
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
        "text": "§bRoquefort",
        "subtext": "Roquefort!",
        "action": "/say roquefort",
        "actions": [
          "/scriptevent leaf:open leaf/roquefort"
        ],
        "iconID": "leaf/roquefort-hd",
        "iconOverrides": [],
        "requiredTag": "",
        "id": 24,
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
        "nutUIAlt": false,
        "disabled": false
      }
    ],
    "subuis": {},
    "scriptevent": "nutui/main",
    "lastID": 25,
    "theme": 8,
    "pinned": true,
    "paperdoll": true,
    "pin": [
      0,
      7,
      2,
      3
    ],
    "pinSetBy": "-8589934591",
    "cancel": ""
  }))
  EAAAAENvbmZpZyBVSSAvIE1haW4EAAAAAAAAAA4AAAAPAAAAwqdjRGV2IFNldHRpbmdzLQAAAHV3dSBrYXdhaWkgc2V0dGluZ3MgcGxlYXNlIGRvbnQgdG91Y2ggOnRyYW5zOgUAAAABAAAAIAAAAAAWAAAAIAAAAMKnbcKnMMKnMcKncsKnYVByZXNldCDCp2JCcm93c2VyIwAAAFByZXNldHMgbWFkZSBieSB0aGUgbGVhZiBjb21tdW5pdHkhDAAAABkAAADCp2FGZWF0dXJlcyAmIEV4cGVyaW1lbnRzFAAAAFRvZ2dsZSBwYXJ0cyBvZiBsZWFmBAAAAAcAAADCp2RHVUlzDgAAAEVkaXQgeW91ciBHVUlzAgAAAAsAAADCp2VHZXQgSGVscAAAAAAIAAAAFAAAAMKnY01vZGVyYXRpb24gwqdkSHViFQAAAFJlcG9ydHMsIEJhbnMgJiBNb3JlIQ8AAAARAAAAwqdxU2lkZWJhciBFZGl0b3IbAAAATWFrZSBDdXN0b20gU2lkZWJhcnMgRWFzaWx5BwAAABYAAADCp2FFY29ub215IMKnMlNldHRpbmdzGgAAAE1hbmFnZSBjdXJyZW5jaWVzIGFuZCBtb3JlDgAAAAkAAADCp3ZFdmVudHMcAAAARG8gdGhpbmdzIHdoZW4gdGhpbmdzIGhhcHBlbg0AAAAVAAAAwqdlQmFjayB0byBvbGQgZGVzaWduKAAAAENsaWNrIHRvIGdvIGJhY2sgdG8gb2xkIGNvbmZpZyBVSSBkZXNpZ24QAAAACQAAAMKnYVNraWxscwsAAABDb21pbmcgc29vbhIAAAASAAAAwqdlWm9uZXMgwqc2Q29uZmlnDAAAAE1hbmFnZSB6b25lcxMAAAAMAAAAwqdiUm9xdWVmb3J0CgAAAFJvcXVlZm9ydCEYAAAA