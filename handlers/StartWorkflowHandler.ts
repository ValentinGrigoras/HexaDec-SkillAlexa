import { HandlerInput, RequestHandler, getSlotValue } from "ask-sdk";
import { Response } from "ask-sdk-model"
import { runWorkflow } from "../src/runworkflow"

// import { Block } from "../blocks/block"

export class StartWorkflowHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'StartWorkflowIntent';
    }

    handle(handlerInput: HandlerInput): Promise<Response> { //  Response | Promise<Response>
        let work = new runWorkflow();
        return work.runWorkflow(handlerInput);
    }
}
