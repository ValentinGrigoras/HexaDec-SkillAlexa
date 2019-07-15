import { HandlerInput, RequestHandler } from "ask-sdk";
import { DB } from "./dynamo";
import { phraseGenerator } from "../blocks/PhraseGenerator";
import { Blocchi, WorkflowTupla } from "../blocks/Blockstype";
import { Workflow } from "./workflow";
import { Response } from "ask-sdk-model";
// import * as Alexa from 'ask-sdk-core';

import { GoogleApi} from "../src/googleApi";
const access_token = new GoogleApi();

// const STREAMS = [
//     {
//       "token": "stream-12",
//       "url": 'https://audio1.maxi80.com/',
//       "metadata" : {
//         "title": "Stream One",
//         "subtitle": "A subtitle for stream one",
//         "art": {
//           "sources": [
//             {
//               "contentDescription": "example image",
//               "url": "https://s3.amazonaws.com/cdn.dabblelab.com/img/audiostream-starter-512x512.png",
//               "widthPixels": 512,
//               "heightPixels": 512
//             }
//           ]
//         },
//         "backgroundImage": {
//           "sources": [
//             {
//               "contentDescription": "example image",
//               "url": "https://s3.amazonaws.com/cdn.dabblelab.com/img/wayfarer-on-beach-1200x800.png",
//               "widthPixels": 1200,
//               "heightPixels": 800
//             }
//           ]
//         }
//       }
//     }
//   ];

export class runWorkflow {

    runWorkflow(handlerInput : HandlerInput) : Promise<Response> {

    let responseBuilder = handlerInput.responseBuilder;

        // getting the session attributes
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
                // getting workflowName from slots
            let workflowName = <string> handlerInput.requestEnvelope.request.intent.slots.workflow.value;
            if (handlerInput.requestEnvelope.request.intent.slots.workflowOp.value) {
                workflowName += " " + <string> handlerInput.requestEnvelope.request.intent.slots.workflowOp.value;
            
                if (handlerInput.requestEnvelope.request.intent.slots.workflowOpt.value) {
                    workflowName += " " + <string> handlerInput.requestEnvelope.request.intent.slots.workflowOpt.value;
                }
            }
            workflowName = workflowName.toLowerCase();
            if(handlerInput.requestEnvelope.context.System.user.accessToken){
                access_token.setToken(handlerInput.requestEnvelope.context.System.user.accessToken);
                console.log(access_token.getToken());
            }
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
                        return Promise.resolve(responseBuilder
                                .speak(speechOutput)
                                .reprompt(phraseGenerator.StartWorkflowReprompt())
                                .getResponse())
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
                            return Promise.resolve(askPin(handlerInput));
                        }
                
                        let workflow: Workflow = new Workflow();
                        return workflow.runWorkflow(blocksFromDB).then((value) =>{ 
                            speechOutput = WelcomeText + '<break time=\"1.5s\" />' + value + phraseGenerator.NextWorkflow();
                            // let stream = STREAMS[0];
                            return Promise.resolve(responseBuilder
                            .speak(speechOutput)
                            // .addAudioPlayerPlayDirective('REPLACE_ALL', stream.url, stream.token, 0, undefined, stream.metadata)
                            .reprompt(phraseGenerator.StartWorkflowReprompt())
                            .getResponse());
                        
                        });
                    }
                    
                }
                else {
                    let workflowNotFound = phraseGenerator.WorkflowNotFound();

                    return Promise.resolve(responseBuilder
                    .speak(workflowNotFound)
                    .reprompt(phraseGenerator.StartWorkflowReprompt())
                    .getResponse());
                }
            })
            .catch((error) => {
                console.log(error.toString);
                return error.toString();
            });
    }
}

function containsPinBlock (blocksFromDB : Blocchi []) : boolean {
    let pinBlock : boolean = false;
    for (let i = 0; i < blocksFromDB.length && !pinBlock; i++) {
        if (blocksFromDB[i].BlockName === "Security") pinBlock = true;
    }
    return pinBlock;
}

function askPin(handlerInput : HandlerInput) : Response {
    return handlerInput.responseBuilder
            .speak(phraseGenerator.AskPin())
            .reprompt(phraseGenerator.AskPin())
            .getResponse();
}

function supportsDisplay(handlerInput : HandlerInput) : boolean {
    var hasDisplay =
    handlerInput.context &&
    handlerInput.context.System &&
    handlerInput.context.System.device &&
    handlerInput.context.System.device.supportedInterfaces &&
    handlerInput.context.System.device.supportedInterfaces.Display

    return hasDisplay;
}

    