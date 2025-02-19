import { world } from "@minecraft/server";
import base64 from "./base64";

type Control = {
    type: number,
    text: string,
    subtext?: string,
    action: string,
    requiredTag?: string
}

type PasswordProtectedOptions = {
    enabled: boolean,
    password: string
}

type UI = {
    title: string,
    scriptevent: string,
    uniqueId: string,
    extensions: string[],
    type: number,
    body?: string,
    subuis: UI[],
    controlData: Control[]
    contributors: string[],
    updatedAt: number,
    versionHistory: UI[],
    version: number,
    passwordProtected: PasswordProtectedOptions
}

class UIBuilderV2 {
    uis: UI[]

    constructor() {
        this.uis = [];
    }

    createUI(root: string = "MAIN_ROOT", title: string, scriptevent: string, body?: string) {
        // this.uis.push({
        //     title,
        //     scriptevent,
        //     body,
        //     subuis: [],
        //     type: 0,
        //     extensions: [],
        //     uniqueId: Date.now().toString(),
        //     controlData: []
        // })
    }
}

export default UIBuilderV2;
