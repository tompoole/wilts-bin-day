import {ICouncilProvider,IAddress} from './council-providers/ICouncilApi'

export interface IAddressService {
    getAddressId(councilProviders: ICouncilProvider[], postcode: string, addressFirstLine: string): Promise<AddressResult>
}

export interface AddressResult {
    provider: string;
    UPRN: string;
}

export class AddressService implements IAddressService {
    
    private static normaliseAddress(address: string) {
        return address.replace(/[^a-z0-9 ]/ig, '').trim();
    }

    private static extractHouseNumber(addressFirstLine: string) {
        let match = /^[0-9]+/.exec(addressFirstLine);
        return match ? match[0] : "";
    }

    public async getAddressId(councilProviders: ICouncilProvider[], postcode: string, addressFirstLine: string): Promise<AddressResult> {
        let re = new RegExp(addressFirstLine, 'i');        
        addressFirstLine = AddressService.normaliseAddress(addressFirstLine);
        let houseNumber = AddressService.extractHouseNumber(addressFirstLine);
        
        let uprn: string | undefined, providerName: string | undefined;

        for (let provider of councilProviders) {
            let addresses = await provider.getAddresses(postcode, houseNumber);
            if (addresses.length == 0) continue;
            
            addresses.forEach(x => x.address = AddressService.normaliseAddress(x.address))
            let address = addresses.find(x => re.test(x.address));

            if (address) {
                uprn = address.UPRN;
                providerName = provider.name;
                break;
            }    
        }

       if (!uprn || !providerName) {
           throw new Error("No UPRN found in any providers.");
        }

        return {
            UPRN: uprn,
            provider: providerName
        };
    
    }
}