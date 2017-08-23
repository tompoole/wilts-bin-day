import * as Alexa from "alexa-sdk"
import {Intent} from './intent'
import {GetCollectionsIntent} from './intent-getCollections'
import responses from './responses'

const intent = GetCollectionsIntent.create();

let handlers: Alexa.Handlers = {
    'LaunchRequest': function () {
        console.log("Received LaunchRequest.")
        this.emit('GetNextBinCollection');
    },
    'GetNextBinCollection': async function() {
        await intent.handler(this);
    },
    'AMAZON.HelpIntent': function() {
        console.log("Received HelpIntent")
        this.emit(":tell", responses.Help);
    },
    'Unhandled': function() {
        this.emit(":tell", responses.Unhandled);
    },
 };

function validateAndGetAppId(alexa: Alexa.AlexaObject): string {
    
    let appIdsStr = process.env["APP_IDS"] as string,
        appIds = appIdsStr.split(','),
        currentAppId = alexa.appId;
    
    if (appIds.some(x => x === currentAppId)) return currentAppId;

    console.warn(`App ID '${currentAppId}' not was found in the list of allowed IDs`);
    return '';
}

 export const handler = function(event: any, context: any, callback: any) {
    let alexa = Alexa.handler(event, context);

    let appId = validateAndGetAppId(alexa);
    alexa.appId = appId;

    alexa.registerHandlers(handlers);
    alexa.execute();
 }

