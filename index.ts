import { HandlerInput, RequestHandler, SkillBuilders, BaseSkillBuilder } from "ask-sdk";
import { LambdaHandler } from "ask-sdk-core/dist/skill/factory/BaseSkillFactory";

import { LaunchRequestHandler } from "./handlers/LaunchRequestHandler";
import { AmazonCancelIntentHandler } from "./handlers/AMAZON_CancelIntent_Handler";
import { AmazonStopIntentHandler } from "./handlers/AMAZON_StopIntent_Handler";
import { ConfirmedWorkflowHandler } from "./handlers/ConfirmedWorkflowHandler";
import { StartWorkflowHandler } from "./handlers/StartWorkflowHandler";
import { SessionEndedHandler } from "./handlers/SessionEndedHandler";
import { CustomErrorHandler } from "./handlers/CustomErrorHandler";
import { PinWorkflowHandler } from "./handlers/PinWorkflowHandler";
import { DenyIntentHandler } from "./handlers/DenyIntentHandler";

function buildLambdaSkill(): LambdaHandler {
    return SkillBuilders.standard()
    .addRequestHandlers(
        new LaunchRequestHandler(),
        new StartWorkflowHandler(),
        new ConfirmedWorkflowHandler(),
        new DenyIntentHandler(),
        new PinWorkflowHandler(),
        new AmazonCancelIntentHandler(),
        new AmazonStopIntentHandler(),        
        new SessionEndedHandler()
    )
    .addErrorHandlers(new CustomErrorHandler())
    .lambda();
 }

 // Lambda handler - entry point for skill
 export let handler = buildLambdaSkill();
