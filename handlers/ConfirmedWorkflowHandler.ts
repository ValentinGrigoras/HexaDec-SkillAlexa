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

export class ConfirmedWorkflowHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'ConfirmedWorkflow';
    }

    handle(handlerInput: HandlerInput): Promise<Response> { //  Response | Promise<Response>
        const responseBuilder = handlerInput.responseBuilder;

        // getting the session attributes
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const Username = sessionAttributes.Username;
        const userId = sessionAttributes.IDUser;
        const PIN = sessionAttributes.PIN;

        let suggestedWorkflow = <WorkflowTupla> sessionAttributes.suggestedWorkflow;

        let WelcomeText = suggestedWorkflow.WelcomeText;
        let workflow: Workflow = new Workflow();

        if (containsPinBlock(suggestedWorkflow.Blocks)) {
            return new Promise<Response> ((resolve) => {resolve (askPin(handlerInput))});
        }
            
        sessionAttributes.suggestedWorkflow = null;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return workflow.runWorkflow(suggestedWorkflow.Blocks).then((value) =>{ 
                    let speechOutput = WelcomeText + '<break time=\"1.5s\" />' + value + phraseGenerator.NextWorkflow();
                    return responseBuilder
                            .speak(speechOutput)
                            .reprompt(phraseGenerator.StartWorkflowReprompt())
                            .getResponse();
                });

        // }
    }
}


function containsPinBlock (blocksFromDB : Blocchi []) : boolean {
    let pinBlock : boolean = false;
    for (let i = 0; i < blocksFromDB.length && !pinBlock; i++) {
        if (blocksFromDB[i].BlockName === "Security") pinBlock = true;
    }
    return pinBlock;
}

function askPin(handlerInput : HandlerInput) : Response{
    return handlerInput.responseBuilder
            .speak(phraseGenerator.AskPin())
            .reprompt(phraseGenerator.AskPin())
            .getResponse();
}