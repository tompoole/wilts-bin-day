import { suite, test } from "mocha-typescript";
import { expect } from 'chai';
import { CollectionDataService } from '../collectionDataService'
import { ICouncilProvider } from '../council-providers/ICouncilApi'
import * as Moq from 'typemoq'
import * as fs from 'fs';
import constants from '../constants';

@suite class DataServiceTests {
    apiMock: Moq.IMock<ICouncilProvider>;
    collectionDataService: CollectionDataService;

    constructor() {
        this.apiMock = Moq.Mock.ofType<ICouncilProvider>();
        this.collectionDataService = new CollectionDataService(this.apiMock.object);
    }

    afterEach() {
        this.apiMock.reset();
    }

    @test 'Can parse garden collection data'() {
        this.apiMock.setup(x => x.getRawCollectionData(Moq.It.isValue('123')))
                    .returns(x => this.createPromise(this.getSampleDataFromFile("with-garden.html")) );
        
            return this.collectionDataService.getData('123').then(function(data) {

                let garden = data.find(x => x.id == constants.collectionTypes.garden);
                expect(garden).is.not.undefined;

                if (garden) {
                    expect(garden.name).to.equal('Garden waste');
                    expect(garden.date).to.be.a('date');
                    expect(garden.date.getDate()).to.eq(10)
                    expect(garden.date.getMonth()).to.equal(4);
                    expect(garden.date.getFullYear()).to.equal(2017);
                }

                let waste = data.find(x => x.id == constants.collectionTypes.waste);
                expect(waste).is.not.undefined;
                
                if (waste) {
                    expect(waste.name).to.equal('Household waste');
                    expect(waste.date).to.be.a('date');
                    expect(waste.date.getDate()).to.eq(11);
                    expect(waste.date.getMonth()).to.equal(4);
                    expect(waste.date.getFullYear()).to.equal(2017);
                }
            });
    }

    @test 'can parse collection data without garden'() {
        this.apiMock.setup(x => x.getRawCollectionData(Moq.It.isValue('400')))
                    .returns(x => this.createPromise(this.getSampleDataFromFile("without-garden.html")) );

        return this.collectionDataService.getData('400').then(function(data) {
            
            var garden = data.find(x => x.id == constants.collectionTypes.garden);
            expect(garden).to.be.undefined;

            var waste = data.find(x => x.id == constants.collectionTypes.waste);
            expect(waste).to.not.be.undefined;

            if (waste) {
                expect(waste.name).to.equal('Household waste');
                expect(waste.date).to.be.a('date');
                expect(waste.date.getFullYear()).to.equal(2017);
            }
            
        });
    }

    @test 'should correctly parse empty collection data'() {
        this.apiMock.setup(x => x.getRawCollectionData(Moq.It.isValue('98')))
                    .returns(x => this.createPromise(this.getSampleDataFromFile("no-collections.html")) );

        return this.collectionDataService.getData('98').then(function(data) {
            expect(data).to.be.empty;
        });
    }

    private getSampleDataFromFile(fileName: string)
    {
        // OK to use sync version here, happens in a console
        return fs.readFileSync("test/data/" + fileName, 'utf8');
    }

    private createPromise<T>(returnValue:T): Promise<T> {
        return new Promise<T>((resolve,reject) => { resolve(returnValue); });
    }
}
