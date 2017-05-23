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

        this._getCollectionsIntent = 
            new GetCollectionsIntent(this._addressServiceMock.object, this._collectionServiceMock.object, this._alexaApiMock.object);        
        
    }

    before() {
        this._addressServiceMock.reset();
        this._collectionServiceMock.reset();
        this._alexaApiMock.reset();
    }

    @test "Generates correct message with single collection"() {

        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,3,7)},
            {id:2, name: "Household Waste", date: new Date(2017,3,1)},
            {id:3, name: "General Recycling", date: new Date(2017,3,7)},
            {id:4, name: "Cardboard Reycling", date: new Date(2017,3,7)}
        ];

        let response = this._getCollectionsIntent.createResponseFromCollectionData(collectionData);
        expect(response).to.contain("Your next collection is Household Waste");
    }

    @test "Generates correct message with multiple collections"() {

        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,4,25)},
            {id:2, name: "Household Waste", date: new Date(2017,4,15)},
            {id:3, name: "General Recycling", date: new Date(2017,4,15)},
            {id:4, name: "Cardboard Reycling", date: new Date(2017,4,15)}
        ];

        let response = this._getCollectionsIntent.createResponseFromCollectionData(collectionData);
        expect(response).to.contain("Your next collections are Cardboard Reycling, General Recycling and Household Waste");
    }

    @test.only "Generates correct message "() {
        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,4,28)},
            {id:2, name: "Household Waste", date: new Date(2017,4,25)},
            {id:3, name: "General Recycling", date: new Date(2017,4,25)},
            {id:4, name: "Cardboard Reycling", date: new Date(2017,4,25)}
        ];

        this._getCollectionsIntent._dateOverride = new Date(2017,4,25,19,20,0,0);    
        let response = this._getCollectionsIntent.createResponseFromCollectionData(collectionData);
        expect(response).to.contain("Your next collection is Garden");
    }

}
