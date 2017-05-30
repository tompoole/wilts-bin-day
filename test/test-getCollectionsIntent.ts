import {GetCollectionsIntent} from '../intent-getCollections';
import {suite, test} from 'mocha-typescript';
import * as Moq from 'typemoq';
import { ICollectionService, ICollectionItem } from "../collectionDataService";
import { IAlexaApi } from "../alexaApi";
import { IAddressService } from "../addressService";
import {expect} from 'chai';

@suite class GetCollectionsIntentTests {
    _getCollectionsIntent: GetCollectionsIntent;
    _collectionServiceMock: Moq.IMock<ICollectionService>;
    _addressServiceMock: Moq.IMock<IAddressService>;
    _alexaApiMock: Moq.IMock<IAlexaApi>;

    constructor() {

        this._collectionServiceMock = Moq.Mock.ofType<ICollectionService>();
        this._addressServiceMock = Moq.Mock.ofType<IAddressService>();
        this._alexaApiMock = Moq.Mock.ofType<IAlexaApi>();
        
        this._getCollectionsIntent = new GetCollectionsIntent(this._addressServiceMock.object, this._collectionServiceMock.object, this._alexaApiMock.object);
    }

}