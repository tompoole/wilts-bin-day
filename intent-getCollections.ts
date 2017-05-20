import {IAddressService, AddressService} from './addressService';
import {WiltsApi} from './wiltshireApi';
import {ICollectionService, ICollectionData, ICollectionItem, CollectionDataService}  from './collectionDataService';
import {Handler} from 'alexa-sdk'

export interface IIntent {
    handler(alexa:Handler): void
}

export class GetCollectionsIntent implements IIntent {

    _addressService: IAddressService;
    _collectionService: ICollectionService;

    constructor(addressService: IAddressService, collectionService: ICollectionService){
        this._addressService = addressService;
        this._collectionService = collectionService;
    }

    public async handler(alexa: Handler) {
        let address = await this._addressService.getAddressId("SN151DF", "7 Cedar");
        alexa.emit(":tell", "Hello there!");
    }

    static create(): GetCollectionsIntent {
        let wiltsApi = new WiltsApi();
        return new GetCollectionsIntent(new AddressService(wiltsApi), new CollectionDataService(wiltsApi));
    }
}


