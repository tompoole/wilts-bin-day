import {IAddress, IWiltsApi} from './wiltshireApi'

export interface IAddressService {
    getAddressId(postcode: string, addressFirstLine: string): Promise<string>
    getAddresses(postcode: string, houseNumber: string): Promise<Address[]>
}

export interface Address {
    UPRN: string;
    address: string;
}

export class AddressService {
    _wiltsApi: IWiltsApi;

    constructor(wiltsApi: IWiltsApi) {
        this._wiltsApi = wiltsApi;
    }

    public getAddresses(postcode: string, houseNumber: string):Promise<Address[]>
    {
        return this._wiltsApi.getAddresses(postcode).then(function(addresses: Array<IAddress>) {
            let re = new RegExp("^"+houseNumber, 'i');
            let filteredAddresses = addresses.filter(x => re.test(x.address));

            if (filteredAddresses.length) {
                return filteredAddresses.map(x => { return {address: x.address, UPRN: x.UPRN}});
            }
            else {
                throw "Could not find any addresses."
            }
        });
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