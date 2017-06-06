import rp = require('request-promise-native')
import { ICouncilProvider, IAddress, ICollectionItem } from './ICouncilApi'

interface IWiltsAddressResponse {
    response: IAddress[]
    message: string
}

export class WiltshireCouncilProvider implements ICouncilProvider {
    name = "Wiltshire"

    public getAddresses(postcode: string, houseNumber: string) {
        let options = {
            uri: "http://www.wiltshire.gov.uk/rubbish-collection/address-list",
            method: "POST",
            json:true,
            form: {
                postcode: postcode
            }
        };

        return rp(options).then<IAddress[]>((response: IWiltsAddressResponse) => {

            if (response.message !== "OK") {
                throw "API call error: " + response.message;
            }

            return response.response;
        });
    };

    public getRawCollectionData(uprn:string) {
        let options = {
            uri: "http://www.wiltshire.gov.uk/rubbish-collection/address-area",
            method: "POST",
            form: {
                uprn
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest' // Required, otherwise server 500s
            }
        };

        return rp(options).then<string>((response: string) => {
            if (response.indexOf('Sorry...') >= 0) {
                throw "Collection data not found for UPRN " + uprn;
            }

            return response;
        });
    }

    static collectionTypes = {
        waste: 56,
        recycling: 8,
        plasticBottle: 63,
        garden: 92
    }
    
    parseRawCollectionData(rawData: any): ICollectionItem[] {
        let response: ICollectionItem[] = [];

        let wasteCollection = this.getCollectionById(rawData, WiltshireCouncilProvider.collectionTypes.waste);
        if (wasteCollection) response.push(wasteCollection);

        let recyclingCollection = this.getCollectionById(rawData, WiltshireCouncilProvider.collectionTypes.recycling);
        if (recyclingCollection) response.push(recyclingCollection);

        let plasticBottleCollection = this.getCollectionById(rawData, WiltshireCouncilProvider.collectionTypes.plasticBottle);
        if (plasticBottleCollection) response.push(plasticBottleCollection);

        let gardenCollection = this.getCollectionById(rawData, WiltshireCouncilProvider.collectionTypes.garden);
        if (gardenCollection) response.push(gardenCollection);

        return response;
    }

    private getCollectionById(html: string, id: number):ICollectionItem | undefined {
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