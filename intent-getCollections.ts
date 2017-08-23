import {IAddressService, AddressService} from './addressService';
import {CouncilProviderFactory} from './councilProviderFactory'
import {IAlexaApi, AlexaApi, AddressResponse} from './alexaApi';
import {Handler} from 'alexa-sdk'
import responses from './responses';
import {Intent} from './intent'
import ErrorType from "./errorTypes";
import {createResponseFromCollectionData} from './responseGenerator'
import * as addressHelpers from './addressHelpers'
import { ICouncilProvider, ICollectionItem } from "./council-providers/ICouncilApi";
import * as util from 'util';
import { CachedAlexaApi } from "./cachedAlexaApi";


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
        let userId = alexa.event.session.user.userId;


    
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
            } 
            else {
                alexa.emit(":tell", responses.ErrorFindingAddress);
            }

            return;
        }

        try {
            let councilProvider = this._providerFactory.getCouncilProviderByName(addressResult.provider);
            let rawData = await councilProvider.getRawCollectionData(addressResult.UPRN)
            let parsedData = councilProvider.parseRawCollectionData(rawData);
            let response = createResponseFromCollectionData(parsedData);

            console.log(`Successfully returned response for ${addressResult.UPRN} using Provider ${councilProvider.name}. Response was "${response}"`);
            alexa.emit(":tell", response);
        }
        catch (e) {
            console.error("Error getting collection data", e);
            alexa.emit(":tell", responses.ErrorGettingCollectionData);
        }
    }

    static create(): GetCollectionsIntent {
        let alexaApi = new CachedAlexaApi(new AlexaApi());
        return new GetCollectionsIntent(new AddressService(), alexaApi);
    }
}


