import en from "../lang/en";

class TranslationAPI {
    constructor() {
        this.langauges = {en};
        this.defaultLang = "en";
    }
    getTranslation(player, path, ...args) {
        let lang = player.getTags().find(_=>_.startsWith('lang:'));
        if(!lang) lang = this.defaultLang;
        else lang = lang.substring(5);
        let current = this.langauges[lang] ? this.langauges[lang] : this.langauges[this.defaultLang];
        for(const part of path.split('.')) {
            current = current[part];
        }
        for(const arg of [...args]) {
            current = current.replace('%s', arg);
        }
        return current;
    }
}

export default new TranslationAPI();