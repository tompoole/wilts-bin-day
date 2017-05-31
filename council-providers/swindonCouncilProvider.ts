import rp = require('request-promise-native')
import {ICouncilProvider, IAddress} from './ICouncilApi'


export interface IWiltsAddressResponse {
    response: IAddress[]
    message: string
}

export class WiltshireCouncilProvider implements ICouncilProvider {
    
    getAddresses(postcode: string): Promise<IAddress[]> {
        throw new Error("Method not implemented.");
    }
    getRawCollectionHtml(uprn: string): Promise<string> {
        throw new Error("Method not implemented.");
    }


}