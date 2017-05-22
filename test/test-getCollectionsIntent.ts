import {GetCollectionsIntent} from '../intent-getCollections';
import {suite, test} from 'mocha-typescript';
import * as Moq from 'typemoq';
import { ICollectionService, ICollectionItem } from "../collectionDataService";
import { IAddressService } from "../addressService";
import {expect} from 'chai';

@suite class GetCollectionsIntentTests {
    _getCollectionsIntent: GetCollectionsIntent;
    _collectionServiceMock: Moq.IMock<ICollectionService>;
    _addressServiceMock: Moq.IMock<IAddressService>;

    constructor() {

        this._collectionServiceMock = Moq.Mock.ofType<ICollectionService>();
        this._addressServiceMock = Moq.Mock.ofType<IAddressService>();

        this._getCollectionsIntent = 
            new GetCollectionsIntent(this._addressServiceMock.object, this._collectionServiceMock.object);        
        
    }

    before() {
        this._addressServiceMock.reset();
        this._collectionServiceMock.reset();
    }

    @test test() {

        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,3,3)},
            {id:2, name: "Waste", date: new Date(2017,0,1)},
            {id:3, name: "Recycling", date: new Date(2017,3,1)},
        ];

        let str = this._getCollectionsIntent.createResponseFromCollectionData(collectionData);

        expect(str).to.contain("Waste");
    }

}
