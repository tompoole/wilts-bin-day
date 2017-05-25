import * as rp from 'request-promise-native'
import ErrorType from './errorTypes'

export interface AddressResponse {
    postcode: string;
    addressLine1: string;
}

export interface IAlexaApi {
    getAddressForDevice(alexaEvent:any):Promise<AddressResponse>
}

export class AlexaApi {

    readonly endpoint:string = "https://api.eu.amazonalexa.com";
    
    private extractRequestDataFromAlexaEvent(event:any) {
         try {
            return {
                accessToken: event.context.System.user.permissions.consentToken as string,
                deviceId: event.context.System.device.deviceId as string
            }
        }
        catch(e) {
            console.error("Couldn't extract Device ID/Access Token " + e)
            return {
                accessToken: "",
                deviceId: ""
            }
        }
    }

    public getAddressForDevice(alexaEvent:any): Promise<AddressResponse> {
        let deviceData = this.extractRequestDataFromAlexaEvent(alexaEvent);

        if (!deviceData.accessToken || !deviceData.deviceId) {
            return new Promise<AddressResponse>((resolve,reject) => reject(ErrorType.NoAccessToken));
        }

        console.log("Extracted request data from event: ", deviceData);

        let request = {
            uri: `${this.endpoint}/v1/devices/${deviceData.deviceId}/settings/address`,
            method: 'GET',
            json: true,
            headers: {
                'Authorization': 'Bearer ' + deviceData.accessToken
            }
        };

        return rp(request)
               .then(response => {

                    console.log("Address response: ", response);

                    if (!response.postalCode || !response.addressLine1) {
                        throw ErrorType.InvalidAddress;
                    }

                    return {
                        postcode: response.postalCode,
                        addressLine1: response.addressLine1
                    };
                })
                .catch(function(e) {
                    console.log("Error retriving address data from Alexa API", e);
                    throw ErrorType.InvalidAddress;
                });
    }

}

