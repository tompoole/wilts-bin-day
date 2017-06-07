import {GetCollectionsIntent} from '../intent-getCollections';
import {suite, test, skip} from 'mocha-typescript';
import * as Moq from 'typemoq';
import { ICollectionItem } from "../council-providers/ICouncilApi";
import { IAlexaApi } from "../alexaApi";
import { IAddressService } from "../addressService";
import {expect} from 'chai';
import {Handler} from 'alexa-sdk'

@suite.skip class GetCollectionsIntentTests {
    _getCollectionsIntent: GetCollectionsIntent;
    _addressServiceMock: Moq.IMock<IAddressService>;
    _alexaApiMock: Moq.IMock<IAlexaApi>;

    constructor() {
        this._addressServiceMock = Moq.Mock.ofType<IAddressService>();
        this._alexaApiMock = Moq.Mock.ofType<IAlexaApi>();
        
        this._getCollectionsIntent = new GetCollectionsIntent(this._addressServiceMock.object,  this._alexaApiMock.object);
    }

    @test "Collection service"() {
        
        let handlerMoq = Moq.Mock.ofType<Handler>();

        let address = {
            postcode: "SN22 1AA",
            addressLine1: "12 Some Street"
        }

        let collectionData = [ 
            {id: 123, name: "Collection A", date: new Date(2017,3,2,0,0,0,0)},
            {id: 321, name: "Collection B", date: new Date(2017,3,2,0,0,0,0)}
        ];
        
        this._alexaApiMock.setup(x => x.getAddressForDevice(Moq.It.isAny())).returns(x => this.createResolvingPromise(address));
        let result = {UPRN: "1234", provider: ""};
        this._addressServiceMock.setup(x => x.getAddressId([], Moq.It.isAnyString(), Moq.It.isAnyString())).returns(x => this.createResolvingPromise(result));

        this._getCollectionsIntent.handler(handlerMoq.object);

    }

    private createResolvingPromise<T>(returnObj: T) : Promise<T>
    {
        return new Promise<T>((resolve,reject) => { 
            resolve(returnObj);
        });
    }

}