import {GetCollectionsIntent} from './intent-getCollections'
import {AddressService} from './addressService'
import {IAlexaApi,AddressResponse} from './alexaApi'
import { Handler, RequestBody, IRequest, IntentRequest } from "alexa-sdk";
import * as Moq from 'typemoq'
import {argv} from 'yargs';


let postcode = argv.postcode as string,
    addressLine1 = argv.address as string;

if (!postcode || !addressLine1) {
    
    console.error("You haven't specified a postcode and/or address.")
    process.exit(1);
}

console.log(`Using ${postcode} & ${addressLine1}`);


let testAlexaApi: IAlexaApi = {
    getAddressForDevice: function(event:any) {
        return new Promise<AddressResponse>((resolve, reject) => {
            resolve({addressLine1: addressLine1, postcode: postcode});
        });
    }
}

let intentRequest: IntentRequest = {
    requestId: "",
    type: "IntentRequest",
    timeStamp: "123",
    intent: {
        name: "",
        slots: []
    }
};

var handler = {
    event: {
        request: intentRequest,
        version: "",
        session: {
            new: true,
            sessionId: "123",
            attributes: [],
            application: {
                applicationId: "",
            },
            user: {
                userId: "123",
                accessToken: "fake-token"
            }
        }
    },
    on: '',
    emitWithState: '',
    state: '',
    handler: '',
    attributes: 'any',
    context: 'any',
    name: 'any',
    isOverriden: 'any',
    emit: function (event: string, ...args: any[]) {
        console.log("Emitting event: " + event);
        console.log(args);
        return true
    }

};

let addressService = new AddressService();
let getCollectionsIntent = new GetCollectionsIntent(addressService, testAlexaApi);
getCollectionsIntent.handler(handler);
