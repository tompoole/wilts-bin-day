import {IAddressService, AddressService} from './addressService';
import {WiltsApi} from './wiltshireApi';
import {ICollectionService, ICollectionItem, CollectionDataService}  from './collectionDataService';
import {Handler} from 'alexa-sdk'
import {humaniseDate} from './dateHumaniser'

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

    public createResponseFromCollectionData(collectionData: ICollectionItem[]): string {
        let sorted = collectionData.sort((a,b) => a.date.valueOf() - b.date.valueOf());
        let str:string = "";

        let firstCollection = sorted[0];

        let humanisedDate = humaniseDate(firstCollection.date);
        let output = `Your next collection is ${firstCollection.name} ${humanisedDate}`;

        return output;
    }

    public getDeviceData(alexa:Handler) {
        try {
            let event:any = alexa.event;

            return {
                accessToken: event.context.System.user.permissions.consentToken as string,
                deviceId: event.context.System.device.deviceId as string,
                endpoint: event.context.System.apiEndpoint as string
            }
        }
        catch(e){
            console.log("Couldn't get device info. " + e)
            return {
                accessToken: "",
                deviceId: "",
                endpoint: ""
            }
        }
    }

    public async handler(alexa: Handler) {
        let addressId: string, collectionData : ICollectionItem[];

        let data = this.getDeviceData(alexa);
        console.log(data);

        try {
            console.log(`Getting address ID`);
            addressId = await this._addressService.getAddressId("SN151DF", "7 Cedar");
        }
        catch (e) {
            console.error(e);
            alexa.emit(":tell", "I'm sorry, I couldn't find your address.");
            return;
        }

        try {
            collectionData = await this._collectionService.getData(addressId);
            let response = this.createResponseFromCollectionData(collectionData);
            alexa.emit(":tell", response);
        }
        catch (e) {
            console.error(e);
            alexa.emit(":tell", "Sorry, I couldn't get your collection information");
        }
    }

    static create(): GetCollectionsIntent {
        let wiltsApi = new WiltsApi();
        return new GetCollectionsIntent(new AddressService(wiltsApi), new CollectionDataService(wiltsApi));
    }
}


