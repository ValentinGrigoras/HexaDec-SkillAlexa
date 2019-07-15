import { Block } from "../blocks/Block";
import { BlockText } from "../blocks/BlockText"
import { BlockFeedRSS } from "../blocks/BlockFeedRSS"
import * as BlockType from "../blocks/blockstype";
import { BlockWeather } from "../blocks/BlockWeather";
import { BlockTVProgram } from "../blocks/BlockTVProgram";
import { BlockRadio } from "../blocks/BlockRadio";
import { BlockMail } from "../blocks/BlockMail";
import { BlockInstagram } from "../blocks/BlockInstagram";
import { BlockKindle } from "../blocks/BlockKindle";
import { BlockMp3 } from "../blocks/BlockMp3";
import { GoogleApi } from "../src/googleApi";
const access_token = new GoogleApi();

export class Workflow {
    private speech :string;
    constructor() {
        this.speech="inizializzato";
    }
    private buildWorkflow(wf : BlockType.Blocchi[]) : Block[] {
        let b : Block[] = [];
        let filtro : number = 3;
        for(let i = 0; i < wf.length; i++){
            switch (wf[i].BlockName) {
                case "FeedRSS" : { 
                    let blockFeedRSS = <BlockType.FeedRSS> wf[i];

                    if(i+1<wf.length && wf[i+1].BlockName === "Filter"){
                            console.log(wf[i+1].BlockName);
                            let blockFilter = <BlockType.Filter> wf[i+1];
                            console.log("qui");
                            b.push(new BlockFeedRSS(blockFeedRSS.URLValue, blockFilter.FilterValue));
                            i++;
                    }
                    else{
                        b.push(new BlockFeedRSS(blockFeedRSS.URLValue, filtro)); 
                    }
                    // console.log(element.BlockName);
                    break;
                }
                case "Text" : {
                    let blockText = <BlockType.Text> wf[i];
                    b.push(new BlockText(blockText)); 
                    // console.log(element.BlockName);
                    break;                    
                }
                case "Weather" : { 
                    let blockWeather = <BlockType.Weather> wf[i];
                    b.push(new BlockWeather(blockWeather.CityValue)); 
                    break;
                }
                case "TVProgram" : {
                    let blockTVProgram = <BlockType.TVProgram> wf[i];
                    b.push(new BlockTVProgram(blockTVProgram.ProgrValue));
                    break;
                }
                case "Radio" : {
                    let blockRadio = <BlockType.Radio> wf[i];
                    b.push(new BlockRadio(blockRadio.radioName, blockRadio.URLValue));
                    break;
                }
                // case "Mail" : {
                //     // let blockMail = <BlockType.Mail> wf[i];
                //     // if(i+1<wf.length && wf[i+1].BlockName === "Filter"){
                //     //     let blockFilter = <BlockType.Filter> wf[i+1];
                //         b.push(new BlockMail(access_token.getToken())); 
                //     // }
                //     // else{
                //     //     b.push(new BlockMail(blockMail.token.access_token));
                //     // }
                //     break;
                // }
                // case "Instagram" : {
                //     let blockInstagram = <BlockType.Blocchi> wf[i];
                //     b.push(new BlockInstagram());
                //     break;
                // }
                case "Kindle" : {
                    let blockKindle = <BlockType.Kindle> wf[i];
                    b.push(new BlockKindle(blockKindle.URLValue));
                    break;
                }
                // case "YouTubeMusic" : {
                //     let blockYouTubeMusic = <BlockType.YouTubeMusic> wf[i];
                //     b.push(new BlockMp3(blockYouTubeMusic.URL));
                // }
                // case "Radio" : {
                //     let blockYouTubeMusic = <BlockType.YouTubeMusic> wf[i];
                //     b.push(new BlockRadio());
                // }
                default : break;
            }
        }

        return b;
    }

    runWorkflow(wf :  BlockType.Blocchi []) : Promise<string> {
        let runnableBlocks : Block [] = this.buildWorkflow(wf);
        let res = getResponse(runnableBlocks);

        return res.then((value) => { 
            console.log(value);
            return value;
        });
    }
}

async function getResponse(blocks : Block[]) : Promise<string> {
    let result : string="";
    for(var el of blocks) {
        let resB : any = await el.run();
        result += <string> resB + '<break time=\"1s\" />';
    }
    return new Promise<string> ((resolve) => resolve(result));
}