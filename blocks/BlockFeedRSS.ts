import Parser from 'rss-parser';
const parser = new Parser();

import { Block } from "./Block";
import {phraseGenerator} from "./PhraseGenerator";

export class BlockFeedRSS implements Block {

    private URL :string;
    private result : string;
    private filter :number;
    constructor(ULR : string, limit :number){
        this.URL = ULR;
        this.result = "";
        this.filter = limit;
    }

    getFilter() :number{
        return this.filter;
    }    

    async run() : Promise<string> {
        await parserr(this.URL, this);
        console.log(this.result);
        return this.result;
    }

    getResult() : string {
        return this.result;
    }
    setResult(res : string) {
        this.result = res;
    }
}

async function parserr(url : string, obj: BlockFeedRSS) {
    await parser.parseURL(url).then(
        (data: any) => {
            let parsedURL = "";
            let i = 0;
            parsedURL = phraseGenerator.FeedRSSSentence(data.title) + ' <break time=\"1.2s\"/> ';
            data.items.forEach(                    
                (item :any) => {
                    if (i < obj.getFilter()) {
                        parsedURL += item.title + ' <break time=\"1.5s\"/> ';
                        i++;
                    }
            });
            obj.setResult(parsedURL);
        }
        ,() => {return "Non riesco a elaborare il FeddRSS" }
    )
}

