import {IAddress, ICouncilApi} from './wiltshireApi'

export interface IAddressService {
    getAddressId(postcode: string, addressFirstLine: string): Promise<string>
}

export class AddressService {
    _wiltsApi: ICouncilApi;

    constructor(wiltsApi: ICouncilApi) {
        this._wiltsApi = wiltsApi;
    }

    private static normaliseAddress(address: string) {
        return address.replace(/[^a-z0-9 ]/ig, '').trim();
    }

    public getAddressId(postcode: string, addressFirstLine: string) {

        addressFirstLine = AddressService.normaliseAddress(addressFirstLine);

        return this._wiltsApi.getAddresses(postcode).then(function(addresses: Array<IAddress>) {
            let re = new RegExp(addressFirstLine, 'i');
            
            addresses.forEach(x => x.address = AddressService.normaliseAddress(x.address))
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