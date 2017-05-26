import {IAlexaApi, AlexaApi, AddressResponse} from './alexaApi';
import { IAddressService, AddressService, Address } from "./addressService";
import { Intent } from "./intent";
import { WiltsApi } from "./wiltshireApi";
import { Handler } from "alexa-sdk";
import responses from './responses';


export class SetAddressIntent implements Intent {

    _alexaApi: IAlexaApi;
    _addressService: IAddressService;

    static Create(): SetAddressIntent {
        let alexaApi = new AlexaApi(), wiltsApi = new WiltsApi();
        return new SetAddressIntent(new AddressService(wiltsApi), alexaApi);
    }

    constructor(addressService: IAddressService, alexaApi: IAlexaApi){
        this._addressService = addressService;
        this._alexaApi = alexaApi;
    }

    getSlot(alexa: Handler, slot: string) {
        try {
            let slotsObj = (alexa.event.request as any).intent.slots;
            return slotsObj[slot].value;
        }
        catch(e)
        {
            console.error("Error getting slot value ", e);
            return "";
        }
    }

    public async handler(alexa: Handler) {
        let addressData : AddressResponse, matchingAddreses: Address[];
        
        try {
            addressData = await this._alexaApi.getAddressForDevice(alexa);
        }
        catch(e) {
            // alexa.emit(":tell", responses.ErrorGettingAddressData );
            console.log("Couln't get address, using defaults.")
            addressData = {
                postcode: "SN15 1DF",
                addressLine1: ""
            }
        }
        
        if (!alexa.state) {
            alexa.state = {};
            alexa.state.postcode = addressData.postcode; 
        }
        console.log(alexa.state);

        // console.log("Setting postcode state");
        // alexa.state.postcode = addressData.postcode;
        // console.log("state ", alexa.state.postcode);
        
        let houseNumber = this.getSlot(alexa, "HouseNumber");
        console.log("housenumber", houseNumber);

        if (!houseNumber) {

            if (!addressData.addressLine1) {
                console.log("getting slot...")
                alexa.emit(":elicitSlot", "HouseNumber", "Okay, I think your postcode is " + addressData.postcode + ". What is your house number?" );
                return;
            }
        }
        else {

            try {
                matchingAddreses = await this._addressService.getAddresses(addressData.postcode, houseNumber);

                if (matchingAddreses.length > 1) {
                    alexa.emit(":tell", "Multiple addresses found at this address. You'll need to setup ")
                }
                else {
                    
                }

            }
            catch(e) {
                alexa.emit(":tell", responses.ErrorFindingAddress);
                return;
            }
        }
    }

}