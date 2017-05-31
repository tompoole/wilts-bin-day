export interface ICouncilProvider {
    getAddresses(postcode: string): Promise<IAddress[]>
    getRawCollectionHtml(uprn:string): Promise<string>
}

export interface IAddress {
    UPRN: string;
    address: string;
    district: string;
}