import { ICouncilProvider, IAddress, ICollectionItem } from './ICouncilApi'
import * as rp from 'request-promise-native';

export class BristolCouncilProvider implements ICouncilProvider {
    
    name: string = "Bristol";

    getAddresses(postcode: string, houseNumber: string): Promise<IAddress[]> {
        
        let request = {
            uri: "http://www2.bristol.gov.uk/rest/gis/v1/property",
            method: "GET",
            qs: {
                action: "find",
                output: "json",
                propertynumber: houseNumber,
                postcode: postcode
            },
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json"
            },
            json: true
        };

        return rp(request).then(response => {
            let code = response.findPropertyResponse.Operation_Result.Operation_Result_Code;

            if (code === "SUCCESS_NO_WARNINGS") {
                let address = response.findPropertyResponse.Property;

                return [{
                    UPRN: address.UPRN,
                    address: address.addressFull
                }];
            }
            else {
                let properties: Array<any> = response.findPropertyResponse.Property;

                return properties.map(p => {
                    return {
                        UPRN: p.GAZ_ID,
                        addressFull: p.addressFull
                    }
                });
            }
        });

    }
    getRawCollectionData(uprn: string): Promise<string> {
        let request = {
            uri: "http://www2.bristol.gov.uk/forms/collection-day-finder/confirmation",
            method: "GET",
            qs: {
                token: "fbd973b681dca7e7281df78f3649a424",
                gaz: uprn,
                uprn: "0",
                add: ""
            },
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36", // u wot m8?
            },
            rejectUnauthorized: false // Sad, but needed
        };

        return rp(request).then((response: string) => {

            if (response.indexOf('unable to find any round information for this address') > -1) {
                throw new Error(`No collection data found for ${uprn}`);
            }

            return response;
        });
    }
    parseRawCollectionData(rawData: any): ICollectionItem[] {
        throw new Error("Method not implemented.");
    }

}