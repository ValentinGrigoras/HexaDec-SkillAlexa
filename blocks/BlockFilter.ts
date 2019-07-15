export class BlockFilter {
    private limit :number;

    constructor(l :number){
        this.limit = l;
    }

    getLimit(): number{
        return this.limit;
    }
}