import * as Alexa from "alexa-sdk"
import {Intent} from './intent'
import {GetCollectionsIntent} from './intent-getCollections'
import {SetAddressIntent} from './intent-setAddress'
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
    "SetAddress": async function() {
        let addressHandler = SetAddressIntent.Create();
        await addressHandler.handler(this);
    },
    'AMAZON.HelpIntent': function() {
        console.log("Received HelpIntent")
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