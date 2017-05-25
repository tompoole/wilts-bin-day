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

            let address = addresses.find(x => re.test(x.address));

            if (address) {
                return address.UPRN;
            }
            else {
                throw "Could not find address";
            }
            
        });
    }
}