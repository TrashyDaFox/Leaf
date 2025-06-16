import { ChatSendBeforeEvent } from "@minecraft/server";
import { formatStr } from "../azaleaFormatting";
import normalForm from "../openers/normalForm";
import uiBuilder from "../uiBuilder";

class ChatRankHandler {
    constructor() {
        this.plugins = [];
        this.widgets = [];
    }
    // get widgets() {
    //     return uiBuilder.db.findDocuments({type: 13}).map(_=>_.data)
    // }
    addWidget(config) {
        this.widgets.push(config);
    }
    addPlugin(fn) {
        this.plugins.push([]);
    }
    getMessageContent(msg) {
        if (!(msg instanceof ChatSendBeforeEvent)) return;

        let message = [];
        for (const widget of this.widgets) {
            if (widget.disabled) continue;
            if (
                widget.requiredCondition &&
                !normalForm.playerIsAllowed(
                    msg.sender,
                    widget.requiredCondition
                )
            )
                continue;
            let text = widget.text;
            let overrides = widget.overrides ? widget.overrides : [];
            overrides.sort((a, b) => b.priority - a.priority);
            for (const override of overrides) {
                if (normalForm.playerIsAllowed(override.condition)) {
                    text = override.text;
                    continue;
                }
            }
            let finalText = formatStr(text, msg.sender, {
                msg: msg.message,
                rc: "§7",
            }).replaceAll("%", "%%");
            if (finalText && finalText.length) message.push(finalText);
        }

        return message
            .filter((_) => _.trim().length > 0)
            .join("§r ")
            .trim();
    }
}

const chatRankHandler = new ChatRankHandler();

chatRankHandler.addWidget({
    disabled: false,
    text: `{{has_tag clan-chat ":mini_sword:"}}`,
    requiredCondition: "clan-chat",
});

chatRankHandler.addWidget({
    disabled: false,
    text: `:proximity:`,
    requiredCondition: "proxchat && $cfg/ProximityChat",
});

// chatRankHandler.addWidget({
//     disabled: false,
//     text: `:global:`,
//     requiredCondition: "!proxchat && $cfg/ProximityChat",
// });

chatRankHandler.addWidget({
    disabled: false,
    text: `{{clan "<bc>[§r<nc>[@CLAN]§r<bc>]" "a"}}`,
    requiredCondition: "$IN_CLAN",
});

chatRankHandler.addWidget({
    disabled: false,
    text: `<bc>[§r<rc>{{rank_joiner "<drj>"}}§r<bc>]`,
});

chatRankHandler.addWidget({
    disabled: false,
    text: `{{get_tag "badge:" "<tag>" "<bl>"}}`,
});

chatRankHandler.addWidget({
    disabled: false,
    text: `<nc><name>`,
});

chatRankHandler.addWidget({
    disabled: false,
    text: `<bc><dra>`,
});

chatRankHandler.addWidget({
    disabled: false,
    text: `<mc><msg>`,
});

export { chatRankHandler };
