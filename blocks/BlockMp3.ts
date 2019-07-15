import { Block } from "./Block";

export class BlockMp3 implements Block{
    private url : string;

    constructor(url : string){
        this.url = url;
    }
    run () : Promise<string> {
        return new Promise ((resolve) => {
            resolve('<audio src="' + this.url + '" />');
        });
    }
}