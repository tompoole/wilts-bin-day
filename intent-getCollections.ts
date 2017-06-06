import {IAddressService, AddressService} from './addressService';
import {WiltshireCouncilProvider} from './council-providers/wiltshireCouncilProvider';
import {CouncilProviderFactory} from './councilProviderFactory'
import {IAlexaApi, AlexaApi, AddressResponse} from './alexaApi';
import {ICollectionItem}  from './collectionDataService';
import {Handler} from 'alexa-sdk'
import responses from './responses';
import {Intent} from './intent'
import ErrorType from "./errorTypes";
import {createResponseFromCollectionData} from './responseGenerator'
import * as addressHelpers from './addressHelpers'
import { ICouncilProvider } from "./council-providers/ICouncilApi";


export class GetCollectionsIntent implements Intent {
    _alexaApi: IAlexaApi;
    _addressService: IAddressService;
    _providerFactory: CouncilProviderFactory;

    constructor(addressService: IAddressService, alexaApi: IAlexaApi){
        this._addressService = addressService;

        this._providerFactory = new CouncilProviderFactory();

        this._alexaApi = alexaApi;

    }

    public async handler(alexa: Handler) {
        let address:AddressResponse, addressId: string, collectionData : ICollectionItem[];

        try {
            address = await this._alexaApi.getAddressForDevice(alexa.event);
        }
        catch (e) {

            if (process.env["NODE_DEBUG"]) {
                console.log("Setting address to debug data.")
                address = {
                    postcode:"SN2 1HD",
                    addressLine1: "37 Rayfield Grove"
                }
            }
            else { 
                if (e == ErrorType.NoAccessToken) {
                    alexa.emit(":tell", responses.ErrorNoAccessToken);
                }
                else {
                    alexa.emit(":tell", responses.ErrorGettingAddressData);
                }
                return;
            }
        }

        let addressResult;
        try {
            let providers = this._providerFactory.getCouncilProvidersByPostcode(address.postcode);
            console.log(`Getting address ID for address: ${address.postcode}, ${address.addressLine1}`);

            addressResult = await this._addressService.getAddressId(providers, address.postcode, address.addressLine1);
        }
        catch (e) {
            console.error("Error finding address ", e);

            if (!addressHelpers.isValidPostcode(address.postcode)) {
                console.error("Invalid postcode ", address.postcode);
                alexa.emit(":tell", responses.ErrorInvalidPostcode);
            } else {
                alexa.emit(":tell", responses.ErrorFindingAddress);
            }

            return;
        }

        try {
            let collectionProvider = this._providerFactory.getCouncilProviderByName(addressResult.provider);
            let rawData = await collectionProvider.getRawCollectionData(addressResult.UPRN)
            let parsedData = collectionProvider.parseRawCollectionData(rawData);
            let response = createResponseFromCollectionData(parsedData);

            console.log(`Successfully returned response for ${addressResult.UPRN}. Response was "${response}"`);
            alexa.emit(":tell", response);
        }
        catch (e) {
            console.error("Error getting collection data", e);
            alexa.emit(":tell", responses.ErrorGettingCollectionData);
        }
    }

    static create(): GetCollectionsIntent {
        let alexaApi = new AlexaApi();
        return new GetCollectionsIntent(new AddressService(),  alexaApi);
    }
}


