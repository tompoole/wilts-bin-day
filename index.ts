import * as Alexa from "alexa-sdk"
import {GetCollectionsIntent} from './intent-getCollections'

const handler = function(event: any, context: any, callback: any){
    var alexa = Alexa.handler(event, context);

    let intent = new GetCollectionsIntent();

    var handlers: Alexa.Handlers = {
        'GetCollections': function() {
            intent.handler(this);
        }
    };

    alexa.registerHandlers(handlers);
    alexa.execute();

    
};

export { handler }