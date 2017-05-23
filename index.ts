import * as Alexa from "alexa-sdk"
import {Intent} from './intent'
import {GetCollectionsIntent} from './intent-getCollections'
import responses from './responses'

const intent = GetCollectionsIntent.create();

let handlers: Alexa.Handlers = {
    'LaunchRequest': function () {
        this.emit('GetCollectionsIntent');
    },
    'GetNextBinCollection': async function() {
        await intent.handler(this);
    },
    'AMAZON.HelpIntent': function() {
        this.emit(":tell", responses.Help);
    },
    'Unhandled': function() {
        this.emit(":tell", responses.Unhandled);
    },
 };

 export const handler = function(event: any, context: any, callback: any) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = process.env.SKILL_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
 }