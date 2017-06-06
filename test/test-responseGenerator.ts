import {GetCollectionsIntent} from '../intent-getCollections';
import {suite, test} from 'mocha-typescript';
import * as Moq from 'typemoq';
import { ICollectionItem } from "../collectionDataService";
import { IAlexaApi } from "../alexaApi";
import { IAddressService } from "../addressService";
import {expect} from 'chai';
import * as lolex from 'lolex'
import {createResponseFromCollectionData} from '../responseGenerator';

@suite.only class ResponseGeneratorTests {

    clock : lolex.Clock;
    
    before() {
        this.clock = lolex.install(new Date(2017, 4, 25, 20, 25, 0, 0));
    }

    after() {
        this.clock.uninstall();
    }

    @test "Generates correct message with single collection"() {

        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,5,7)},
            {id:2, name: "Household Waste", date: new Date(2017,4,30)},
            {id:3, name: "General Recycling", date: new Date(2017,5,7)},
            {id:4, name: "Cardboard Reycling", date: new Date(2017,5,7)}
        ];

        let response = createResponseFromCollectionData(collectionData);
        expect(response).to.contain("Your next collection is Household Waste");
    }

    @test "Generates correct message with multiple collections"() {

        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,5,29)},
            {id:2, name: "Household Waste", date: new Date(2017,5,15)},
            {id:3, name: "General Recycling", date: new Date(2017,5,15)},
            {id:4, name: "Cardboard Reycling", date: new Date(2017,5,15)}
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
        
        let response = createResponseFromCollectionData(collectionData);
        expect(response).to.contain("Your next collection is Garden");
    }

    @test "Appends reminder message when next collection is tomorrow."() {
        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,4,25)}, // occurs "today", past threshold time, so skipped.
            {id:2, name: "Household Waste", date: new Date(2017,4,26)}, // Match
            {id:3, name: "General Recycling", date: new Date(2017,4,26)}, // Match
            {id:4, name: "Cardboard Reycling", date: new Date(2017,4,29)} // Match
        ];
        
        let response = createResponseFromCollectionData(collectionData);
        expect(response).to.contain("Don't forget to put the bins out!");
    }

    @test "Appends warning message when next collection occurs today."() {
        let collectionData: ICollectionItem[] = [
            {id:1, name: "Garden", date: new Date(2017,4,25)}, // Matching collection
            {id:2, name: "Household Waste", date: new Date(2017,4,26)},
            {id:3, name: "General Recycling", date: new Date(2017,4,26)},
            {id:4, name: "Cardboard Reycling", date: new Date(2017,4,29)}
        ];

        let clock = lolex.install(new Date(2017, 4, 25, 10, 0, 0, 0));
                
        let response = createResponseFromCollectionData(collectionData);
        expect(response).to.contain("Hope you put the bin out!");

        clock.uninstall();
    }

}
