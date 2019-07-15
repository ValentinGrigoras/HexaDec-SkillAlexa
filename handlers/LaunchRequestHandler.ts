import { HandlerInput, RequestHandler } from "ask-sdk";
import { Response } from "ask-sdk-model";
import { DB } from "../src/dynamo";
import {phraseGenerator} from "../blocks/PhraseGenerator";
// import { request } from "https";
import {onFirstExecute} from "../src/AI";
// import { Workflow } from "../src/workflow";
import { language } from "../src/language";
import { WorkflowTupla } from "../blocks/blockstype";
// import { resolve } from "path";
const lang = new language();

export class LaunchRequestHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    }

    handle(handlerInput: HandlerInput): Promise<Response> {
        const idUser = handlerInput.requestEnvelope.context.System.user.userId;
        console.log(idUser);
        const user = new DB('amzn1.account.AH5DVJLOTICZRQ3YQ2I3HREE7IDQ');//qui metteremo idUser

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.IDUser = 'amzn1.account.AH5DVJLOTICZRQ3YQ2I3HREE7IDQ'; //FIXARE PER RA

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        lang.setLang (<string> handlerInput.requestEnvelope.request.locale);
        const username = user.getUserInfo();
        const responseBuilder = handlerInput.responseBuilder;
            return username.then((val) => {
                
                let Username ="";
                if (val.Count == 1 && val.Items) {
                    sessionAttributes.PIN = val.Items[0].PIN.toString();
                    Username = val.Items[0].Username.toString();
                    sessionAttributes.Username = Username;
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                    //let allWorkflow = user.getAllWorkflow();
                    return onFirstExecute('amzn1.account.AH5DVJLOTICZRQ3YQ2I3HREE7IDQ').then((data)=>{
                        console.log("sono prima di suggest");
                        
                        let suggestedWorkflow = ((<WorkflowTupla>(data)).WorkflowName);
                        sessionAttributes.suggestedWorkflow = data;
                        console.log("sono dopo suggest");
                        console.log(suggestedWorkflow);
                        let speechOutput: string = phraseGenerator.LaunchPhrase(Username, suggestedWorkflow);
                        return responseBuilder
    
                            .speak(speechOutput)
                            .reprompt(speechOutput)
                            .getResponse();
                    })
                    .catch((error) => {
                        console.error(error + " " + error.message);
                    });
                } 
                // let speakOutput = "che workflow?"
                //     return responseBuilder
                //         .speak(speakOutput)
                //         .reprompt(speakOutput)
                        // .getResponse();
                let speakOutput = phraseGenerator.ErrorLaunch();
                    return handlerInput.responseBuilder
                        .speak(speakOutput)
                        .reprompt(phraseGenerator.ErrorLaunch())
                        .getResponse();
                
            })
            .catch((error) => {
                console.log("An error has verified");
                return error.toString();
            });

    }
}
