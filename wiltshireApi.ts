import rp = require('request-promise-native')

export interface ICouncilApi {
    getAddresses(postcode: string): Promise<IAddress[]>
    getRawCollectionHtml(uprn:string): Promise<string>
}

export interface IAddress {
    UPRN: string;
    address: string;
    district: string;
}

export interface IWiltsAddressResponse {
    response: IAddress[]
    message: string
}

export class WiltsApi implements ICouncilApi {
    
    public getAddresses(postcode: string) {    
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

    public getRawCollectionHtml(uprn:string) {
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

}