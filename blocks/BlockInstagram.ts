import { Block } from "../blocks/Block";

import https from "https";

export class BlockInstagram implements Block {
    private access_token ="";
    
    constructor(){
        this.access_token = "15285277868.d377e97.ce38c94b4fb64787bc2bdc010c3e60e5";
    }


    async run() : Promise<string> {
        return new Promise<string> ((resolve, reject) => {
            let rawData = '';

            let resu = https.request("https://api.instagram.com/v1/users/self/media/recent/?access_token=15285277868.d377e97.ce38c94b4fb64787bc2bdc010c3e60e5&count=10",((res) => {
                    res.on('data', (chunk) => {
                        rawData += chunk;
                    });
                    res.on('end', () => {
                        let json = JSON.parse(rawData);
                        let i = 0; let existImages : boolean = true;
                        while (existImages) {
                            if(json.data[i] && json.data[i].images){
                                console.log(json.data[i].images.standard_resolution.url);
                                i++;
                            }
                            else {
                                existImages = false;
                            }
                            
                        }
                    });
                })
            );
            resu.end()
        });
    }
}

// data[i].images.standard_resolution.url