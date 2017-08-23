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
        address = address.replace(/[^a-z0-9 ]/gi, '').trim();
        address = address.replace(/\s+(?:Street|Lane|Road|Boulevard|Grove|St|Ln|Rd|Bv|Grv)$/i, '');
        return address;
    }

    private static extractHouseNumber(addressFirstLine: string) {
        let match = /^[0-9]+/.exec(addressFirstLine);
        return match ? match[0] : "";
    }

    public async getAddressId(councilProviders: ICouncilProvider[], postcode: string, addressFirstLine: string): Promise<AddressResult> {
        addressFirstLine = AddressService.normaliseAddress(addressFirstLine);
        let houseNumber = AddressService.extractHouseNumber(addressFirstLine);
        let addressRe = new RegExp(addressFirstLine, 'i');        

        let uprn: string | undefined, providerName: string | undefined;

        for (let provider of councilProviders) {
            let addresses = await provider.getAddresses(postcode, houseNumber);
            if (addresses.length == 0) continue;
            
            addresses.forEach(x => x.address = AddressService.normaliseAddress(x.address))
            let address = addresses.find(x => addressRe.test(x.address));

            if (address) {
                uprn = address.UPRN;
                providerName = provider.name;
                console.log(`Found address. UPRN: ${address.UPRN}, Address: ${address.address}`);
                break;
            }    
        }

       if (!uprn || !providerName) {
           let providers = councilProviders.map(p => p.name).join(', ');
           throw new Error("No UPRN found in any providers. Searched: " + providers);
        }

        return {
            UPRN: uprn,
            provider: providerName
        };
    
    }
}