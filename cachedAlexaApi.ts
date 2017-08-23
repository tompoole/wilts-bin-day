import {IAlexaApi, AddressResponse} from './alexaApi'
import { DocumentClient } from "aws-sdk/clients/dynamodb";


export class CachedAlexaApi implements IAlexaApi {
    private _alexaApi:IAlexaApi;

    constructor(alexaApi:IAlexaApi) {
        this._alexaApi = alexaApi;
    }

    public async getAddressForDevice(alexaEvent: any): Promise<AddressResponse> {
        let userId = alexaEvent.session.user.userId as string,
            userIdReduced = this.getReducedUserId(userId);

        let cachedAddress = await this.getAddressFromDynamo(userId);

        if (cachedAddress != undefined) {
            console.log(`Found address for ${userIdReduced} in cache.`);
            return cachedAddress;
        }

        console.log(`Could not find user ID ${userIdReduced} in cache, using Alexa API.`);
        return this._alexaApi.getAddressForDevice(alexaEvent);
    }

    private async getAddressFromDynamo(userId:string): Promise<AddressResponse|undefined> {

        if (!userId) {
            return Promise.resolve(undefined)
        }

        try {
            console.log("Querying DynamoDB for " + userId);
            let dynamoClient = new DocumentClient();
            
            let request = {
                TableName: "bin-day-address-cache", 
                Key: { "accountId": userId }
            };

            let result = await dynamoClient.get(request).promise();

            if (result.Item) {
                console.log(`Found user ID ${userId} in cache, using cached address data`);
                return Promise.resolve({
                    addressLine1: result.Item["addressLine1"],
                    postcode: result.Item["postcode"]
                });
            }
        }
        catch (e) {
            console.error("Error getting address from Dynamo, continuing: " + e)
        }

        return Promise.resolve(undefined);
    }

    private getReducedUserId(userId:string): string {
        return userId ? userId.substr(0,30) : "UNKNOWN_USER_ID";
    }
}