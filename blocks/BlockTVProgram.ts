import Parser from 'rss-parser';
const parser = new Parser();

import { Block } from "../blocks/Block";
import { resolve } from 'dns';
import {phraseGenerator} from "./PhraseGenerator";

export class BlockTVProgram implements Block {

    private program :string;
    private result : string;
    constructor(programVal : string){
        this.program = programVal;
        this.result = "inizializzato";
    }

    

    async run() : Promise<string> {
        await parserr("https://www.questaseratv.it/feed.xml", this);
        return this.result;
    }

    getProgram() : string {
        return this.program;
    }

    getResult() : string {
        return this.result;
    }
    setResult(res : string) {
        this.result = res;
    }
}

async function parserr(url : string, obj: BlockTVProgram) {
    await parser.parseURL(url).then(
        (data: any) => {
            let parsedURL = "";
            let i :string = obj.getProgram();
            let index=0;
            //parsedURL = phraseGenerator(data.title) + ' <break time=\"1.5s\"/> ';
            data.items.forEach(                    
                (item :any) => {
                    if (item.title.indexOf(i)>-1) {
                        parsedURL += phraseGenerator.TVProgramSentence(item.title, obj);
                    }
            });
            obj.setResult(parsedURL);
        }
        ,() => {return "Non riesco a elaborare il feddRSS" }
    )
}

    //http://www.rai.it/dl/portale/html/PublishingBlock-8d20de42-b77c-4e1b-9fd0-a8e4b5497a84-rss.xml

    //http://www.independent.co.uk/sport/football/rss