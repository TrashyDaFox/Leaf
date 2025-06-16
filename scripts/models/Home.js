export class Home {
    constructor(data) {
        this.id = data.id;
        this.owner = data.owner;
        this.name = data.name;
        this.location = data.loc;
        this.sharedTo = data.sharedTo || [];
    }

    toJSON() {
        return {
            owner: this.owner,
            name: this.name,
            loc: this.location,
            sharedTo: this.sharedTo,
        };
    }
}
