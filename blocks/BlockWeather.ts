import { Block } from "../blocks/Block";
import { language } from "../src/language";
import request = require("request");
import {phraseGenerator} from "./PhraseGenerator";
import { SSL_OP_NO_TICKET } from "constants";
const weather = require("openweather-apis");


const lang = new language();


export class BlockWeather implements Block {

    private URL :string;
    private result : string;
    private city: string;
    private api: string  ="e07a9f58adb007b8772d0f7e417f4107";
    
    constructor( city: string){
        this.URL = "https://api.apixu.com/v1/current.json?key=8cb556e244164291bf6122113191506&q=";
        this.result = "inizializzato";
        this.city=city;
        weather.setCity(city);
        weather.setLang(lang.getLang().slice(0,2));
        weather.setAPPID(this.api);
       
        
    }
 getAPI():string{
    return this.URL+this.city;
}

    async run() : Promise<string> {
        return new Promise((resolve, reject) => {
            weather.getAllWeather(function(err: string, data: any) {
                //in caso di città non trovata getAllWeather ritorna data = { cod: '404', message: 'city not found' }, err è sempre null
                if(data.cod == '404') {
                    if(lang.getLang() == "en-US")
                    resolve(Promise.resolve("City of " + weather.getCity() + " not found"));

                    resolve(Promise.resolve("Città di " + weather.getCity() + " non trovata"));
                }
                else {
                    resolve(Promise.resolve(phraseGenerator.WeatherSentence(data)));
                }

            }
        )}
    )}


    getResult() : string {
        return this.result;
    }
    setResult(res : string) {
        this.result = res;
    }
}