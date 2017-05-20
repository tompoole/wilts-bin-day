import { IWiltsApi } from './wiltshireApi';
import constants from './constants';

export interface ICollectionService {
    getData(addressId:string): Promise<ICollectionData>
}

export interface ICollectionData {
    waste?: ICollectionItem
    blackBox?: ICollectionItem
    plasticBottle?: ICollectionItem
    garden?: ICollectionItem
}

export interface ICollectionItem {
    name: string
    date: Date
}

export class CollectionDataService implements ICollectionService {
    
    private _wiltsApi:IWiltsApi;

    constructor(wiltsApi: IWiltsApi ) {
        this._wiltsApi = wiltsApi;
    }

    public getData(addressId:string):Promise<ICollectionData> {

        return this._wiltsApi.getRawCollectionHtml(addressId).then((rawHtml : string) => {
            let response : ICollectionData  = {
                waste: this.getCollectionById(rawHtml, constants.collectionTypes.waste),
                blackBox:this.getCollectionById(rawHtml, constants.collectionTypes.recycling),
                plasticBottle: this.getCollectionById(rawHtml, constants.collectionTypes.plasticBottle),
                garden: this.getCollectionById(rawHtml, constants.collectionTypes.garden)
            };

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

        return { name, date };
    }
}