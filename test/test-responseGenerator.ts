import {GetCollectionsIntent} from '../intent-getCollections';
import {suite, test} from 'mocha-typescript';
import * as Moq from 'typemoq';
import { ICollectionService, ICollectionItem } from "../collectionDataService";
import { IAlexaApi } from "../alexaApi";
import { IAddressService } from "../addressService";
import {expect} from 'chai';
import {createResponseFromCollectionData, _setNowOverride} from '../responseGenerator';

@suite class ResponseGeneratorTests {

    @test "Generates correct message with single collection"() {

        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,3,7)},
            {id:2, name: "Household Waste", date: new Date(2017,3,1)},
            {id:3, name: "General Recycling", date: new Date(2017,3,7)},
            {id:4, name: "Cardboard Reycling", date: new Date(2017,3,7)}
        ];

        let response = createResponseFromCollectionData(collectionData);
        expect(response).to.contain("Your next collection is Household Waste");
    }

    @test "Generates correct message with multiple collections"() {

        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,4,25)},
            {id:2, name: "Household Waste", date: new Date(2017,4,15)},
            {id:3, name: "General Recycling", date: new Date(2017,4,15)},
            {id:4, name: "Cardboard Reycling", date: new Date(2017,4,15)}
        ];

        let response = createResponseFromCollectionData(collectionData);
        expect(response).to.contain("Your next collections are Cardboard Reycling, General Recycling and Household Waste");
    }

    @test "Generates correct message when multiple collections today after threshold time"() {
        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,4,28)},
            {id:2, name: "Household Waste", date: new Date(2017,4,25)},
            {id:3, name: "General Recycling", date: new Date(2017,4,25)},
            {id:4, name: "Cardboard Reycling", date: new Date(2017,4,25)}
        ];

        _setNowOverride(new Date(2017,4,25,19,20,0,0)); 
        let response = createResponseFromCollectionData(collectionData);
        expect(response).to.contain("Your next collection is Garden");
    }

}
