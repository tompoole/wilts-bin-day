import { IWiltsApi } from './wiltshireApi';
import constants from './constants';

export interface ICollectionService {
    getData(addressId:string): Promise<ICollectionItem[]>
}

export interface ICollectionItem {
    id: number
    name: string
    date: Date
}

export class CollectionDataService implements ICollectionService {
    
    private _wiltsApi:IWiltsApi;

    constructor(wiltsApi: IWiltsApi ) {
        this._wiltsApi = wiltsApi;
    }

    public getData(addressId:string):Promise<ICollectionItem[]> {

        return this._wiltsApi.getRawCollectionHtml(addressId).then((rawHtml : string) => {
            let response: ICollectionItem[] = [];

            let wasteCollection = this.getCollectionById(rawHtml, constants.collectionTypes.waste);
            if (wasteCollection) response.push(wasteCollection);

            let recyclingCollection = this.getCollectionById(rawHtml, constants.collectionTypes.recycling);
            if (recyclingCollection) response.push(recyclingCollection);

            let plasticBottleCollection = this.getCollectionById(rawHtml, constants.collectionTypes.plasticBottle);
            if (plasticBottleCollection) response.push(plasticBottleCollection);

            let gardenCollection = this.getCollectionById(rawHtml, constants.collectionTypes.garden);
            if (gardenCollection) response.push(gardenCollection);

            return response;
        });
    }

    getCollectionById(html: string, id: number):ICollectionItem | undefined {
        var re = new RegExp('service-' + id + '"><\/span>([^]+?):<\/strong>[^]+?\">([^]+?)<\/div>', 'm');
        var matches = re.exec(html);

        if (matches == null) {
            return undefined;
        }

        var name = matches[1].replace('(chargeable)','').trim();
        
        var date = new Date(matches[2].trim());
        date.setHours(0,0,0);

        return { id, name, date };
    }
}