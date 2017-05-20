import {IAddress, IWiltsApi} from './wiltshireApi'

export interface IAddressService {
    getAddressId(postcode: string, addressFirstLine: string): Promise<string>
}

export class AddressService {
    _wiltsApi: IWiltsApi;

    constructor(wiltsApi: IWiltsApi) {
        this._wiltsApi = wiltsApi;
    }

    public getAddressId(postcode: string, addressFirstLine: string) {

        return this._wiltsApi.getAddresses(postcode).then(function(addresses: Array<IAddress>) {
            let re = new RegExp("^"+addressFirstLine, 'i');

            let filteredAddreses = addresses.filter(x => re.test(x.address));

            if (filteredAddreses.length > 0) {
                return filteredAddreses[0].UPRN;
            }
            else {
                throw "Could not find address";
            }
        });
    }
}