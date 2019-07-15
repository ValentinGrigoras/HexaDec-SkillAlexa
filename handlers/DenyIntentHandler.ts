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

export class DenyIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'DenyIntent';
    }

    handle(handlerInput: HandlerInput): Promise<Response> { //  Response | Promise<Response>
        const responseBuilder = handlerInput.responseBuilder;

        // getting the session attributes
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        if (handlerInput.requestEnvelope.request.intent.slots.workflow.value){
            let workflowName = <string> handlerInput.requestEnvelope.request.intent.slots.workflow.value;
                if (handlerInput.requestEnvelope.request.intent.slots.workflowOp.value) {
                    workflowName += " " + <string> handlerInput.requestEnvelope.request.intent.slots.workflowOp.value;
                
                    if (handlerInput.requestEnvelope.request.intent.slots.workflowOpt.value) {
                        workflowName += " " + <string> handlerInput.requestEnvelope.request.intent.slots.workflowOpt.value;
                    }
                }
                workflowName = workflowName.toLowerCase();
                console.log(workflowName);
                const dynamo = new DB('amzn1.account.AH5DVJLOTICZRQ3YQ2I3HREE7IDQ');//userId);
                const workflow = dynamo.getWorkflow(workflowName);

                return workflow.then((val) => {
                    if (val.Count == 1 && val.Items) {
                        let WelcomeText = val.Items[0].WelcomeText;
                        // sessionAttributes.WelcomeText = WelcomeText;
                        // handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                        let speechOutput;
                        if (typeof(val.Items[0].Blocks) === 'undefined') {
                            speechOutput = phraseGenerator.NoBlocksWorkflow(WelcomeText);
                            return responseBuilder
                                    .speak(speechOutput)
                                    .reprompt(phraseGenerator.StartWorkflowReprompt())
                                    .getResponse();
                        }
                        else {
                            let paramJSON: string = JSON.stringify(val.Items[0].Blocks);
                            let blocksFromDB : Blocchi[] = JSON.parse(paramJSON);
                            //sessionAttributes.blocksFromDB = blocksFromDB;
                            //handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                            //does a BlockPin exist?
                            
                            //
                            if (containsPinBlock(blocksFromDB)) {
                                sessionAttributes.suggestedWorkflow = <WorkflowTupla> val.Items[0];
                                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                                return askPin(handlerInput);
                            }

                            let workflow: Workflow = new Workflow();
                            return workflow.runWorkflow(blocksFromDB).then((value) =>{ 
                                speechOutput = WelcomeText + '<break time=\"1.5s\" />' + value + phraseGenerator.NextWorkflow();
                                return responseBuilder
                                .speak(speechOutput)
                                .reprompt(phraseGenerator.StartWorkflowReprompt())
                                .getResponse();
                            
                            });
                        }
                        
                    }
                    else {
                        let workflowNotFound = phraseGenerator.WorkflowNotFound();

                        return responseBuilder
                        .speak(workflowNotFound)
                        .reprompt(phraseGenerator.StartWorkflowReprompt())
                        .getResponse();
                    }
                })
                .catch((error) => {
                    console.log(error.toString);
                    return error.toString();
                });
        }
    
        sessionAttributes.suggestedWorkflow = null;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return Promise.resolve(responseBuilder.speak(phraseGenerator.StartWorkflowReprompt()).reprompt(phraseGenerator.StartWorkflowReprompt()).getResponse());
    }
}

function containsPinBlock (blocksFromDB : Blocchi []) : boolean {
    let pinBlock : boolean = false;
    for (let i = 0; i < blocksFromDB.length && !pinBlock; i++) {
        if (blocksFromDB[i].BlockName === "Pin") pinBlock = true;
    }
    return pinBlock;
}

function askPin(handlerInput : HandlerInput) : Response{
    return handlerInput.responseBuilder
            .speak(phraseGenerator.AskPin())
            .reprompt(phraseGenerator.AskPin())
            .getResponse();
}