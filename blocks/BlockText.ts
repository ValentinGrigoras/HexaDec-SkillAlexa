import { Block } from "./Block";
import { Text } from "./blockstype"
export class BlockText implements Block{
    private text : string;

    constructor(txt : Text){
        this.text = txt.TextValue;
    }
    run () : Promise<string> {
        return new Promise ((resolve, reject) => {
            resolve(this.text);
        });
    }
}