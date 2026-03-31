import uiBuilder from "../../api/uiBuilder";
import adminMenus from "./admin_menu";
uiBuilder.db.waitLoad().then(() => {
    for (const menu of adminMenus) {
        uiBuilder.addInternalUI(menu);
    }
    uiBuilder.addInternalUI({
        "name": "Bank",
        "body": "<INTERNAL_BANK_MAINPAGE_BODY>",
        "layout": 4,
        "type": 0,
        "buttons": [
            {
                "text": "§bDeposit",
                "subtext": "Deposit currency into the bank",
                "action": "scriptevent leaf:deposit_to_bank",
                "actions": [
                    "scriptevent leaf:deposit_to_bank"
                ],
                "iconID": "rpgiab/arrow_up",
                "iconOverrides": [],
                "requiredTag": "$cfg/BankCMD",
                "disabled": false,
                "id": 31262298843,
                "displayOverrides": [],
                "altBtnColorOverride": -1,
                "sellButtonEnabled": false,
                "buyButtonEnabled": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "nutUIColorCondition": "",
                "nutUIHeaderButton": false,
                "meta": ""
            },
            {
                "text": "§aWithdraw",
                "subtext": "Withdraw currency from bank",
                "action": "scriptevent leaf:withdraw_from_bank",
                "actions": [
                    "scriptevent leaf:withdraw_from_bank"
                ],
                "iconID": "rpgiab/arrow_down",
                "iconOverrides": [],
                "requiredTag": "$cfg/BankCMD",
                "disabled": false,
                "id": 31262713170,
                "displayOverrides": [],
                "altBtnColorOverride": -1,
                "sellButtonEnabled": false,
                "buyButtonEnabled": false,
                "nutUIHalf": 0,
                "nutUINoSizeKey": false,
                "nutUIAlt": false,
                "nutUIColorCondition": "",
                "nutUIHeaderButton": false
            }
        ],
        "subuis": {},
        "scriptevent": "leaf/bank",
        "cancel": "",
        "folder": null,
        "theme": 68,
        "internal": true,
        "internalID": 14,
        "pag": false,
        "pagLength": 1,
        "pagFormat": "Page <p>/<mp>",
        "pagIcons": false,
        "pagNext1": "§aNext",
        "pagNext2": "Go to next page",
        "pagPrev1": "§cBack",
        "pagPrev2": "Go to previous page",
        "pagFBack": "",
        "pagpb": false
    })
    uiBuilder.addInternalUI({
        "type": 9,
        "name": "!bank",
        "command": "bank",
        "description": "Bank command. Opens bank ui",
        "category": "Economy",
        "requiredTag": true,
        "ensureChatClosed": true,
        "actions": [
            {
                "type": 0,
                "action": "leaf:open @s \"leaf/bank\""
            }
        ],
        "subcommands": [],
        "execother": false,
        "noself": false
    })
});
