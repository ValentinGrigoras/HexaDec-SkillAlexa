import { HandlerInput, RequestHandler, getSlotValue } from "ask-sdk";
import { Response } from "ask-sdk-model"
import { DB } from "../src/dynamo"
import { Workflow } from "../src/workflow";
import { Blocchi } from "../blocks/Blockstype";
import {phraseGenerator} from "../blocks/PhraseGenerator";
import { Pin } from "../blocks/Blockstype"
import { resolve } from "dns";
import { WorkflowTupla } from "../blocks/blockstype";

// import { Block } from "../blocks/block"

export class PinWorkflowHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'PinWorkflowIntent';
    }

    handle(handlerInput: HandlerInput): Promise<Response> { //  Response | Promise<Response>
        const responseBuilder = handlerInput.responseBuilder;

        // getting the session attributes
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const Username = sessionAttributes.Username;
        const userId = sessionAttributes.IDUser;
        const PIN = sessionAttributes.PIN;

        let pinslots = handlerInput.requestEnvelope.request.intent.slots;
        if (sessionAttributes.suggestedWorkflow){
            if (pinslots.pinOne.value && pinslots.pinTwo.value && pinslots.pinThree.value && pinslots.pinFour.value) {
                let suggestedWorkflow = <WorkflowTupla> sessionAttributes.suggestedWorkflow; 
                
                let pinstring =  <string> pinslots.pinOne.value;
                    pinstring +=<string> pinslots.pinTwo.value +<string> pinslots.pinThree.value +<string> pinslots.pinFour.value;
                
                pinstring = pinstring.replace('zero', '0');

                if (pinstring === PIN) { 
                    let workflow = new Workflow();
                    let blocksFromDB : Blocchi[] = suggestedWorkflow.Blocks;

                    sessionAttributes.suggestedWorkflow = null;
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                    
                    return workflow.runWorkflow(blocksFromDB).then((value) => { 
                        let speechOutput = suggestedWorkflow.WelcomeText + '<break time=\"1.5s\" />' + value + phraseGenerator.NextWorkflow();
                        return responseBuilder
                            .speak(speechOutput)
                            .reprompt(phraseGenerator.StartWorkflowReprompt())
                            .getResponse();                    
                        });
                    }
                else {
                    console.log("pin non corretto");
                    let pinIncorrect = new Promise<string> ((resolve) => {
                                        resolve(phraseGenerator.WrongPin());
                                    });

                    return pinIncorrect.then((value) => {
                        return responseBuilder
                                .speak(value)
                                .reprompt(value)
                                .getResponse();
                    });
                }
            }
            else {
                console.log("pin non corretto");
                let pinIncorrect = new Promise<string> ((resolve) => {
                                    resolve(phraseGenerator.WrongPin());
                                });

                return pinIncorrect.then((value) => {
                    return responseBuilder
                            .speak(value)
                            .reprompt(value)
                            .getResponse();
                });
            }            
        }
        else {
            let noWorkflow = new Promise<string> ((resolve) => {
                resolve(phraseGenerator.StartWorkflowReprompt());
            });
            return noWorkflow.then((value) => {
                return responseBuilder
                        .speak(value)
                        .reprompt(value)
                        .getResponse();
            });
        }

    }
}