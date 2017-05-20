import { suite, test } from "mocha-typescript";
import { expect } from 'chai';
import { CollectionDataService } from '../collectionDataService'
import { IWiltsApi } from '../wiltshireApi'
import * as Moq from 'typemoq'
import * as fs from 'fs';

@suite class DataServiceTests {
    apiMock: Moq.IMock<IWiltsApi>;
    collectionDataService: CollectionDataService;

    constructor() {
        this.apiMock = Moq.Mock.ofType<IWiltsApi>();
        this.collectionDataService = new CollectionDataService(this.apiMock.object);
    }

    afterEach() {
        this.apiMock.reset();
    }

    @test 'Can parse garden collection data'() {
        this.apiMock.setup(x => x.getRawCollectionHtml(Moq.It.isValue('123')))
                    .returns(x => this.createPromise(this.getSampleDataFromFile("with-garden.html")) );
        
            return this.collectionDataService.getData('123').then(function(data) {
                
                expect(data.waste).is.not.undefined;
                expect(data.garden).is.not.undefined;


                if (data.waste) {
                    expect(data.waste.name).to.equal('Household waste');
                    expect(data.waste.date).to.be.a('date');
                    expect(data.waste.date.getDate()).to.eq(11)
                    expect(data.waste.date.getMonth()).to.equal(4);
                    expect(data.waste.date.getFullYear()).to.equal(2017);
                }

                
                if (data.garden) {
                    expect(data.garden.name).to.equal('Garden waste');
                    expect(data.garden.date).to.be.a('date');
                    expect(data.garden.date.getDate()).to.eq(10);
                    expect(data.garden.date.getMonth()).to.equal(4);
                    expect(data.garden.date.getFullYear()).to.equal(2017);
                }
            });
    }

    @test 'can parse collection data without garden'() {
        this.apiMock.setup(x => x.getRawCollectionHtml(Moq.It.isValue('400')))
                    .returns(x => this.createPromise(this.getSampleDataFromFile("without-garden.html")) );

        return this.collectionDataService.getData('400').then(function(data) {
            
            expect(data.waste).to.not.be.undefined;

            if (data.waste) {
                expect(data.waste.name).to.equal('Household waste');
                expect(data.waste.date).to.be.a('date');
                expect(data.waste.date.getFullYear()).to.equal(2017);
            }
            
            expect(data.garden).to.be.undefined;            
        });
    }

    @test 'should correctly parse empty collection data'() {
        this.apiMock.setup(x => x.getRawCollectionHtml(Moq.It.isValue('98')))
                    .returns(x => this.createPromise(this.getSampleDataFromFile("no-collections.html")) );

        return this.collectionDataService.getData('98').then(function(data) {
            expect(data.blackBox).to.be.undefined;
            expect(data.plasticBottle).to.be.undefined;
            expect(data.waste).to.be.undefined;
            expect(data.garden).to.be.undefined;
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
