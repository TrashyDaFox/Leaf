class Session extends Map {
    constructor() {
        super();
    }
    toObject() {
        let obj = {};
        for(const key of this.keys()) {
            obj[key] = this.get(key);
        }
    }
}
export class JSEnvironment {
    constructor() {
        this.fns = {};
    }
    defineFunc(name, fn) {
        this.fns[name] = fn;
    }
    run(code) {
        let fn = eval(`(({env, session})=>{${code}})`);
        let env = {};
        let session = new Session();
        for(const key in this.fns) {
            env[key] = function(...data) {
                let error = this.fns[key](session, ...data);
                if(error) throw new Error(error);
            }
        }
        fn({env, session});
    }
}