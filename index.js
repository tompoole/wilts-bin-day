var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};


var handlers = {

    'GetNextBinCollection': function () {
        this.emit(':tell', 'Hello World!');
    }

};