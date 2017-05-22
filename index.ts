import * as Alexa from "alexa-sdk"
import {GetCollectionsIntent} from './intent-getCollections'

var intent = GetCollectionsIntent.create();

let handlers: Alexa.Handlers = {
    'LaunchRequest': function () {
        this.emit('GetCollectionsIntent');
    },

    'GetCollectionsIntent': async function() {
        await intent.handler(this);
    }
 };

 export const handler = function(event: any, context: any, callback: any) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = "";
    alexa.registerHandlers(handlers);
    alexa.execute();
 }