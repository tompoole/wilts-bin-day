import {IAddressService, AddressService} from './addressService';
import {WiltsApi} from './wiltshireApi';
import {IAlexaApi, AlexaApi, AddressResponse} from './alexaApi';
import {ICollectionService, ICollectionItem, CollectionDataService}  from './collectionDataService';
import {Handler} from 'alexa-sdk'
import {humaniseDate} from './dateHumaniser'
import responses from './responses';
import {Intent} from './intent'
import ErrorType from "./errorTypes";

export class GetCollectionsIntent implements Intent {
    _alexaApi: IAlexaApi;
    _addressService: IAddressService;
    _collectionService: ICollectionService;

    constructor(addressService: IAddressService, collectionService: ICollectionService, alexaApi: IAlexaApi){
        this._addressService = addressService;
        this._collectionService = collectionService;
        this._alexaApi = alexaApi;
    }

    _dateOverride: Date | undefined = undefined;

    public getNow(): Date {
        if (this._dateOverride) return new Date(this._dateOverride.valueOf());
        return new Date();
    }

    private isToday(date:Date){
        let now = this.getNow();
        now.setHours(0,0,0,0);
        date.setHours(0,0,0,0);
        return (now.valueOf() === date.valueOf());
    }

    createResponseFromCollectionData(collectionData: ICollectionItem[]): string {
        collectionData = collectionData.sort((a,b) => a.date.valueOf() - b.date.valueOf());
        
        let firstCollection = collectionData[0];
 
        if (this.isToday(firstCollection.date) && this.getNow().getHours() >= 17)
        {
            collectionData = collectionData.filter(x => x.date.valueOf() !== firstCollection.date.valueOf());
            firstCollection = collectionData[0];
        }

        let allCollectionsOnDate = collectionData.filter(c => c.date.valueOf() == firstCollection.date.valueOf());

        if (allCollectionsOnDate.length > 1) {
            let allCollectionsStr = allCollectionsOnDate.map(x => x.name).sort().join(', ');
            allCollectionsStr = allCollectionsStr.replace(/(, )(?!.*,)/, " and ");
            return `Your next collections are ${allCollectionsStr} ${humaniseDate(firstCollection.date)}`;
        }
        else {
            return `Your next collection is ${firstCollection.name} ${humaniseDate(firstCollection.date)}`;
        }
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
            console.error(e);
            alexa.emit(":tell", responses.ErrorFindingAddress);
            return;
        }

        try {
            collectionData = await this._collectionService.getData(addressId);
            let response = this.createResponseFromCollectionData(collectionData);
            alexa.emit(":tell", response);
        }
        catch (e) {
            console.error(e);
            alexa.emit(":tell", responses.ErrorGettingCollectionData);
        }
    }

    static create(): GetCollectionsIntent {
        let wiltsApi = new WiltsApi(), alexaApi = new AlexaApi();
        return new GetCollectionsIntent(new AddressService(wiltsApi), new CollectionDataService(wiltsApi), alexaApi);
    }
}


