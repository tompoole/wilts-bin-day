import {IAddressService, AddressService} from './addressService';
import {WiltsApi} from './wiltshireApi';
import {IAlexaApi, AlexaApi, AddressResponse} from './alexaApi';
import {ICollectionService, ICollectionItem, CollectionDataService}  from './collectionDataService';
import {Handler} from 'alexa-sdk'
import responses from './responses';
import {Intent} from './intent'
import ErrorType from "./errorTypes";
import {createResponseFromCollectionData} from './responseGenerator'
import * as addressHelpers from './addressHelpers'


export class GetCollectionsIntent implements Intent {
    _alexaApi: IAlexaApi;
    _addressService: IAddressService;
    _collectionService: ICollectionService;

    constructor(addressService: IAddressService, collectionService: ICollectionService, alexaApi: IAlexaApi){
        this._addressService = addressService;
        this._collectionService = collectionService;
        this._alexaApi = alexaApi;
    }

    public async handler(alexa: Handler) {
        let address:AddressResponse, addressId: string, collectionData : ICollectionItem[];

        try {
            address = await this._alexaApi.getAddressForDevice(alexa.event);
        }
        catch (e) {
            if (e == ErrorType.NoAccessToken) {
                alexa.emit(":tell", responses.ErrorNoAccessToken);
            }
            else {
                alexa.emit(":tell", responses.ErrorGettingAddressData);
            }

            return;
        }

        try {
            console.log(`Getting address ID for address: ${address.postcode}, ${address.addressLine1}`);
            addressId = await this._addressService.getAddressId(address.postcode, address.addressLine1);
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
            collectionData = await this._collectionService.getData(addressId);
            let response = createResponseFromCollectionData(collectionData);
            console.log(`Successfully returned response for ${addressId}. Response was "${response}"`);
            alexa.emit(":tell", response);
        }
        catch (e) {
            console.error("Error getting collection data", e);
            alexa.emit(":tell", responses.ErrorGettingCollectionData);
        }
    }

    static create(): GetCollectionsIntent {
        let wiltsApi = new WiltsApi(), alexaApi = new AlexaApi();
        return new GetCollectionsIntent(new AddressService(wiltsApi), new CollectionDataService(wiltsApi), alexaApi);
    }
}


