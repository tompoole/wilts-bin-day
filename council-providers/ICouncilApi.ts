export interface ICouncilProvider {
    name: string;
    getAddresses(postcode: string, houseNumber: string): Promise<IAddress[]>
    getRawCollectionData(uprn:string): Promise<string>
    parseRawCollectionData(rawData:any): ICollectionItem[]
}

export interface IAddress {
    UPRN: string;
    address: string;
    district: string;
}

export interface ICollectionItem {
    id: number
    name: string
    date: Date
}
