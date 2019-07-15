import { Block } from "../blocks/Block";
//import request = require("request");
//const weather = require("openweather-apis")

export class BlockRadio implements Block {

    private URL :string;
    private result : string;
    private radio: string;
    //private stream: JSON;
    
    constructor( nomeRadio: string, url :string){
        this.URL = url;
        this.result = "inizializzato";
        this.radio= nomeRadio;
        /*let obj: any= [
            {
                "token": "12345",
                "url": url,
                "metadata": {
                    "title": nomeRadio,
                    "subtitle": "subtitle"
                }

            }
        ];
        this.stream = <JSON> obj;*/
        
    }


    async run() : Promise<string> {
        return new Promise((resolve, reject) => {
                if(!this.URL) 
                    //reject("error while creating the weather connector: £££££££" + err);
                    reject(Promise.resolve("It doesn't work"));
                
                else
                    resolve(Promise.resolve(phraseGenerator(this.radio, this.URL)));
                

    }
        )}


    getResult() : string {
        return this.result;
    }
    setResult(res : string) {
        this.result = res;
    }
}

function phraseGenerator(name: string, Url :string) : string {
     //let phrase = [];
     let phrase :string ="<audio src="+ Url+ "/>";
    //return phrase[Math.floor(Math.random() * phrase.length)];
    return phrase;
}