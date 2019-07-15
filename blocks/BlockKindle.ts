import { Block } from "../blocks/Block";
import https from "https";
import { rejects } from "assert";
import { stat } from "fs";
const fs = require('fs');

export class BlockKindle implements Block {
    private url = "https://www.iso.nl/website/wp-content/uploads/2018/03/pdf-sample-3.pdf";
    constructor(url : string) {
        this.url = url;
    }
    
    run() : Promise<string> {
        return new Promise<string> (async (resolve, reject) => {
            const id = await postRequest(this.url);
            // console.log("id: " + id);
            let fileURI = "test";
            setTimeout( async function () {
                fileURI = await isReady(id); 
                // console.log("fileURI: " + fileURI);
                resolve(getFileText(fileURI));
            }, 2000);
        });
    }
}

function postRequest(urlPDF : string) : Promise<string>{
    return new Promise<string> ((resolve, reject) => {
        const data = JSON.stringify({
            "input": [{
                "type": "remote",
                "source": urlPDF,
                }],
            "conversion": [{
                "target": "txt"
            }]
        });
    
        const options = {
            hostname: 'api2.online-convert.com',
            port: 443,
            path: '/jobs',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'X-Oc-Api-Key': '0842776bba5e9292d1b9ec3e35c75ca1'
              }
        };
        const req = https.request(options, (res) => {
            
            res.on('data', (d) => {
                resolve((JSON.parse(d).id).toString());
            })
        });

        req.on('error', (error) => {
            console.error(error);
            reject(error);
        });
        
        req.write(data);
        req.end();
    });
}

function isReady(id : string) : Promise<string> {

    return new Promise<string> ((resolve, reject) => {
            const options = {
                hostname: 'api2.online-convert.com',
                port: 443,

                path: '/jobs/' + id,
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'X-Oc-Api-Key': '0842776bba5e9292d1b9ec3e35c75ca1'
                }
            };
            
            console.log("options path: " + options.path);

            let statusCode : string = "";
            let UriKey = "non e pronto";
            const req = https.request(options, (res) => {
                        console.log(`statusCode: ${res.statusCode}`)
                        res.on('data', (d) => {
                            let jsonResponse : any = JSON.parse(d);
                            console.log(jsonResponse);
                            statusCode = JSON.parse(d).status.code;
                            // console.log("status: " + statusCode);
                                if (statusCode === 'completed') {
                                    UriKey = jsonResponse.output[0].uri;
                                    // console.log("UriKey: " + UriKey);
                                    resolve(UriKey);
                                }
                                else {
                                    // console.log("status: " + JSON.parse(d).status.code);
                                    reject("error");
                                }
                });
            });

            req.on('error', (error) => {
                    console.error(error.message);
                    // reject(error);
            });
                
            req.end();
        });
}


async function getFileText(url : string) : Promise<string> {
        // url = "https://www44.online-convert.com/dl/web2/download-file/1b00a2ea-e3a0-4fc8-b250-4fc6e53deb24/dummy.txt";
        // console.log(url);
    return new Promise((resolve, reject) => {

        
        let rawData = '';
        const req = https.request(url, (res) => {
                res.on('data', (chunk) => { 
                    rawData += chunk;
                    var regex = /[\n|\t|\f]/gi;
                    
                    resolve(rawData.replace(regex, " "));
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    // console.log(parsedData);
                } catch (e) {
                    console.error(e.message);
                }
            });
            }).on('error', (e) => {
                    reject(`Got error: ${e.message}`);
                    console.error(`Got error: ${e.message}`);
                });

        req.end();
    });
}