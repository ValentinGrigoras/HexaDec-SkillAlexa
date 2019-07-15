import { DB } from "../src/dynamo"
//import { number } from "aws-sdk/clients/pi";
import { Block } from "../blocks/Block";
import { WorkflowTupla } from "../blocks/Blockstype"
import { Blocchi } from "../blocks/blockstype"
import { resolveSoa } from "dns";
import { BlockFeedRSS } from "../blocks/BlockFeedRSS";
import { rejects } from "assert";

export function onFirstExecute(userId:string) :Promise<WorkflowTupla> {
    let actualTime :string = getActualTime();
    // console.log(actualTime);
    let random:number = Math.floor(Math.random() * (100) ); // random determina che IA eseguire
    // console.log("ofe");

    if(random < 40)
        return firstTypeOfIa(userId,actualTime);

    if(random >= 40 && random < 50)
        return secondTypeOfIa(userId,actualTime);

    if(random >= 50 && random < 68)
        return thirdTypeOfIa(userId,actualTime);

    if(random >= 68 && random < 78)
        return fourthTypeOfIa(userId,actualTime);

    if(random >= 78 && random < 95)
        return fifthTypeOfIa(userId,actualTime);

    if(random >= 95 && random < 97)
        return sixthTypeOfIa(userId,actualTime);

    return seventhTypeOfIa(userId);

}

/** 
 * @param userId id utente
 * @param actualTime momento della giornata
 * @return un WF random tra quelli che hanno almeno un blocco con SuggestedTime == actualTime; se non presenti guardo momento giornata prima o dopo di quello attuale
*/
function firstTypeOfIa(userId:string,actualTime:string) :Promise<WorkflowTupla> {
    let dynamo = new DB(userId);
    // console.log("1");
    return new Promise<WorkflowTupla> ((resolve , reject) => {
        return dynamo.getAllWorkflow().then( (items) => {
            if(items.Count && items.Items) {
                // console.log("if1");
                let WFL : WorkflowTupla[] = JSON.parse(JSON.stringify(items.Items));
                // console.log(WFL.length);
                let W2L : WorkflowTupla[] = [];
                let r:number = 0;
                let s:number = Math.floor(Math.random() * (WFL.length) );
                let d1:string = distanceMinus(actualTime); //momento giornata successivo
                // console.log("d1: " + d1);
                let d2:string = distancePlus(actualTime); //momento giornata precedente
                // console.log("d2: " + d2);
                // console.log("actualTime: " + actualTime);

                W2L = fetchBlock(WFL,actualTime);
                //console.log("dopo fetchBlock 1");
                if(W2L.length == 0) { //nessun WF match con actualTime, guardo momento giornata precedente a actualTime
                    W2L = fetchBlock(WFL,d2);
                    //console.log("dopo fetchBlock 2" + W2L.length);
                    r = Math.floor(Math.random() * (WFL.length) );
                    if(W2L.length == 0) { //nessun WF match con actualTime, guardo momento giornata successivo a actualTime
                        W2L = fetchBlock(WFL,d1);
                        //console.log("dopo fetchBlock 3");
                        r = Math.floor(Math.random() * (WFL.length) );
                    }
                    if(W2L.length == 0) {
                        //console.log("ultimo if")
                        resolve(WFL[s]);
                    }
                }
                //console.log("dopo tutti if" + W2L.length);

                //console.log("r: " + r);
                //console.log(W2L[r].WorkflowName);
                W2L && W2L.length > 0 ? resolve(W2L[r]) : resolve(WFL[Math.floor(Math.random() * (WFL.length))]);
            }
            else reject("La query non ha restituito risultati");
        });
    }); 
}

/** 
 * @param userId id utente
 * @param actualTime momento della giornata
 * @return un WF random, oridnati per Iteraction, tra quelli che matchano actualTime
*/
function secondTypeOfIa(userId:string,actualTime:string) :Promise<WorkflowTupla> { 
    let dynamo = new DB(userId);
    //console.log("2");
    return new Promise<WorkflowTupla>((resolve, reject) => {
        return dynamo.getAllWorkflowOrderBy('Iteraction').then( (items) => {
            if(items.Count && items.Items) {
                //console.log("if2");
                let WFL :WorkflowTupla[] = JSON.parse(JSON.stringify(items.Items));        
                let n :number = WFL.length >= 3 ? 3 : WFL.length;   
                //console.log("post n");
                let WFL_aux :WorkflowTupla[] = [];
                for(let i=0; i<n; i++)
                    WFL_aux[i] = WFL[i];

                let WFL2 = fetchTime(WFL_aux,actualTime);

                WFL2 && WFL2.length > 0 ? resolve(WFL2[Math.floor(Math.random() * (n))]) : resolve(WFL[Math.floor(Math.random() * (WFL.length))]);
            } else {
                reject("La query non ha restituito risultati");
            }
        });
});
}

/** 
 * @param userId id utente
 * @param actualTime momento della giornata
 * @return il primo WF, oridnati per Iteraction, tra quelli che matchano actualTime, oridnati per Iteraction
*/
function thirdTypeOfIa(userId:string,actualTime:string) :Promise<WorkflowTupla> { 
    let dynamo = new DB(userId);
    //console.log("3");
    return new Promise<WorkflowTupla> ((resolve, reject) => {
        return dynamo.getAllWorkflow().then( (items) => {
            if(items.Count && items.Items) {
                //console.log("if3");
                let WFL :WorkflowTupla[] = JSON.parse(JSON.stringify(items.Items));
                let WFL2 = sortWorkflowByIteraction(fetchTime(WFL,actualTime));

                WFL2 && WFL2.length > 0 ? resolve(WFL2[0]) : resolve(WFL[Math.floor(Math.random() * (WFL.length))]);
            } else {
                reject("La query non ha restituito risultati");
            }
        });
});
}

/** 
 * @param userId id utente
 * @param actualTime momento della giornata
 * @return un WF random, oridnati per ModifyDate, tra quelli che matchano actualTime
*/
function fourthTypeOfIa(userId:string,actualTime:string) :Promise<WorkflowTupla> { 
    let dynamo = new DB(userId);
    //console.log("4");
    return new Promise<WorkflowTupla> ((resolve, reject) => {

        return dynamo.getAllWorkflowOrderBy('ModifyDate').then( (items) => {
            if(items.Count && items.Items) {
                //console.log("if4");
                let WFL :WorkflowTupla[] = JSON.parse(JSON.stringify(items.Items));
                let n :number = WFL.length >= 3 ? 3 : WFL.length

                let WFL_aux :WorkflowTupla[] = [];
                for(let i=0; i<n; i++)
                    WFL_aux[i] = WFL[i];

                let WFL2 = fetchTime(WFL_aux,actualTime);
        
                WFL2 && WFL2.length > 0 ? resolve(WFL2[Math.floor(Math.random() * (WFL2.length))]) : resolve(WFL[Math.floor(Math.random() * (WFL.length))]);
            } else {
                reject("La query non ha restituito risultati");
            }
        });
});
}

/** 
 * @param userId id utente
 * @param actualTime momento della giornata
 * @return il primo WF, oridnati per ModifyDate, tra quelli che matchano actualTime
*/
function fifthTypeOfIa(userId:string,actualTime:string) :Promise<WorkflowTupla> { 
    let dynamo = new DB(userId);
    //console.log("5");
    return new Promise<WorkflowTupla> ((resolve, reject) => {

        return dynamo.getAllWorkflow().then( (items) => {
            if(items.Count && items.Items) {
                //console.log("if5");
                let WFL :WorkflowTupla[] = JSON.parse(JSON.stringify(items.Items));
                let WFL2 = sortWorkflowByModifyDate(fetchTime(WFL,actualTime));
                
                WFL2 && WFL2.length > 0 ? resolve(WFL2[0]) : resolve(WFL[Math.floor(Math.random() * (WFL.length))]);
            } else {
                reject("La query non ha restituito risultati");
            }
        });
});
}

/** 
 * @param userId id utente
 * @param actualTime momento della giornata
 * @return un WF random tra quelli che matchano actualTime
*/
function sixthTypeOfIa(userId:string,actualTime:string) :Promise<WorkflowTupla> { 
    let dynamo = new DB(userId);
    //console.log("6");
    return new Promise<WorkflowTupla> ((resolve , reject) => { 
        return dynamo.getAllWorkflow().then( (items) => {
            if(items.Count && items.Items) {
                //console.log("if6");
                let WFL :WorkflowTupla[] = JSON.parse(JSON.stringify(items.Items));;
                let WFL2 = fetchTime(WFL,actualTime);

                WFL2 && WFL2.length > 0 ? resolve(WFL2[Math.floor(Math.random() * (WFL2.length))]) : resolve(WFL[Math.floor(Math.random() * (WFL.length))]);
            } else {
                reject("La query non ha restituito risultati");
            }
        });    
    });
}

/** 
 * @param userId id utente
 * @return un WF random
*/
function seventhTypeOfIa(userId:string) :Promise<WorkflowTupla> { 
    let dynamo = new DB(userId);
    //console.log("7");
    return new Promise<WorkflowTupla> ((resolve, reject) => {

        return dynamo.getAllWorkflow().then( (items) => {
            //console.log("primaif7");
            if(items.Count && items.Items) {
                //console.log("if7");
                let WFL :WorkflowTupla[] = JSON.parse(JSON.stringify(items.Items));;
                //console.log("WFL.length", WFL.length)
                let n = Math.floor(Math.random() * (WFL.length))
                //console.log("n",n)
                resolve(WFL[n]);
            } else {
                //console.log("pippo");
                reject("La query non ha restituito risultati");
            }
        }); 
});   
}

/** 
 * @param WFL array di workflow
 * @return WFL ordinato per Iteraction descrescente
*/
function sortWorkflowByIteraction(WFL :WorkflowTupla[]) :WorkflowTupla[] {
    let WFL2_new = WFL.sort((a,b) => (a.Iteraction > b.Iteraction) ? 1 : ((b.Iteraction > a.Iteraction) ? -1 : 0));
    return WFL2_new;
}

/** 
 * @param WFL array di workflow
 * @return WFL ordinato per ModifyDate
*/
function sortWorkflowByModifyDate(WFL :WorkflowTupla[]) :WorkflowTupla[] {
    let WFL2_new = WFL.sort((a,b) => (a.ModifyDate > b.ModifyDate) ? 1 : ((b.ModifyDate > a.ModifyDate) ? -1 : 0));
    return WFL2_new;
}

/** 
 * @param db array di workflow
 * @param actualTime: momento della giornata
 * @return tutti i wf che hanno SuggestedTime == actualTime
*/
function fetchTime(db:WorkflowTupla[], actualTime :string) :WorkflowTupla[] {
    let WSL:WorkflowTupla[] = [];//array di WorkflowTupla vuota
    //console.log("fetchtime");
    for(let i=0; i < db.length; i++) {
        let element :any = db[i];
        if(element.SuggestedTime.length > 0 && actualTime == element.SuggestedTime){
            WSL.push(element);
        }
    }
    return WSL;
}

/** 
 * @param WSL array di workflow
 * @param aT: momento della giornata
 * @return tutti i wf che hanno almeno un blocco con SuggestedTime == actualTime
*/
function fetchBlock(WSL:WorkflowTupla[],aT:string) :WorkflowTupla[] {
    //console.log("fetchblock");
    let app :WorkflowTupla[] = [];
        // //console.log("vuoto nooo");
        for(let i=0; i < WSL.length; i++) {
            let w :WorkflowTupla = WSL[i];
            let exist = false;
            for(let i=0; !exist && w.Blocks && i < w.Blocks.length;  i++) {
                let blocco = w.Blocks[i];
                if(matchSuggestedTime(blocco,aT)) {
                    exist = true;
                    //console.log("if(matchSuggestedTime(blocco,aT))");
                    // app.push(w);
                }
            }
            app.push(w);
        }
    return app;
}

/**
 * @return il momento della giornata
*/
function getActualTime() :string {
    //console.log("getTime");
    let currentDate :Date = new Date();
    let dateTime :number= currentDate.getHours();
    if(dateTime > 21 || dateTime < 6) return "Night";
    if(dateTime >= 6 && dateTime < 11) return "Morning";
    if(dateTime >= 11 && dateTime < 13 ) return "Noon";
    if(dateTime >= 13 && dateTime < 19) return "Afternoon";
    return "Evening";
}

/**
 * @param actualTime momento della giornata
 * @return il momento della giornata precedente a actualTime; se actualTime == Morning, ritorna Morning
*/
function distanceMinus(aT:string):string { 
    //console.log("dminus");
    let time :string[] = ["Morning","Noon","Afternoon","Evening","Night"];

    for(let i = 0; i<time.length; i++) {
        let item = time[i];
        if(item == aT) {
            if(item != "Morning"){
                return time[i-1];
            } else {
                return "Morning";
            }
        }
    }
    return "Qualquadra non cosa";
}

/**
 * @param actualTime momento della giornata
 * @return il momento della giornata successivo a actualTime, se actualTime == Night, ritorna Night
*/
function distancePlus(aT:string){
    //console.log("dplus");
    let time :string[] = ["Morning","Noon","Afternoon","Evening","Night"];

    for(let i = 0; i<time.length; i++) {
        let item = time[i];
        if(item == aT) {
            if(item != "Night"){
                return time[i+1];
            } else {
                return "Night";
            }
        }
    }
    return "Qualquadra non cosa";
}

/**
 * @param blocco  blocco
 * @param actualTime momento della giornata
 * @return actualTime == blocco.(blockTime)
*/
function matchSuggestedTime(blocco:Blocchi, actualTime:string) :boolean {
    // console.log("suggTime");
    let data = [
        //{ key:"AlarmClock", value: "Evening" },
        //{ key:"Calendar", value: "Morning" },
        //{ key:"Cinema", value: "Evening" },
        { key:"Email", value: "Noon" },
        //{ key:"Facebook", value: "Noon" },
        { key:"FeedRSS", value: "Morning" },
        { key:"Filter", value: "" },
        { key:"Instagram", value: "Morning" },
        { key:"Kindle", value: "Afternoon" },
        //{ key:"LinkedIn", value: "Afternoon" },
        //{ key:"List", value: "Noon" },
        //{ key:"Messenger", value: "" },
        //{ key:"Radio", value: "Noon" },
        { key:"Sicurity", value: "" },
        //{ key:"Slack", value: "Noon" },
        //{ key:"Spotify", value: "Morning" },
        { key:"TVProgram", value: "Night" },
        { key:"Telegram", value: "Noon" },
        //{ key:"Text", value: "" },
        //{ key:"Transport", value: "Noon" },
        { key:"Weather", value: "Night" },
        //{ key:"YouTube", value: "Afternoon" },
        //{ key:"YouTubeMusic", value: "Afternoon" },
    ];

    let mappedData = data.map(x => [x.key, x.value] as [string, string] );
    let map = new Map<string, string>(mappedData);

    return (map.get(blocco.BlockName) ) ? actualTime == map.get(blocco.BlockName) : false;
}