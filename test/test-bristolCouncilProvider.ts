import * as chai from 'chai';
import * as chaiAsPromised from "chai-as-promised";
import { suite, test, slow, timeout } from 'mocha-typescript'
import { BristolCouncilProvider } from '../council-providers/bristolCouncilProvider'
import * as fs from 'fs';


@suite.only(slow(1000), timeout(5000)) 
class BristolCouncilProviderTests {
    
    provider:BristolCouncilProvider;

    constructor() {
        this.provider = new BristolCouncilProvider();

        chai.should();
        chai.use(chaiAsPromised);
    }

    @test 'can get a list of address based on postcode'() {
        return this.provider.getAddresses("BS6 7SS", "").then(function(r) {
            r.should.be.an('array');
            r.length.should.be.at.least(2);
        });
    }
    
    @test 'can get a single address based on postcode and house number'() {
        return this.provider.getAddresses("BS67SS", "7").then(r => {
            r.should.be.an('array');
            r.length.should.equal(1);
        })
    }
    
    @test 'returns an error with a non-Bristol postcode'() {
        let promise = this.provider.getAddresses("SN15 1AA", '');
        return promise.should.be.eventually.rejected;
    }

    @test 'returns an error with an invalid postcode'() {
        let promise = this.provider.getAddresses('wibble', '');
        return promise.should.be.eventually.rejected;
    }

    @test 'returns raw collection HTML with a valid uprn'() {
        return this.provider.getRawCollectionData('UPRN000000045787').then(function(r) {
           r.should.be.a('string');
           r.should.contain("Collection days we have listed for");
        });
    }

    @test 'returns an error with an invalid uprn'() {
        let promise = this.provider.getRawCollectionData('cake');
        return promise.should.be.eventually.rejected;
    }

    @test.only 'Can parse raw collection data'() {
        let response = this.provider;

        let file = this.loadFile("standard.html");
        let collectionData = this.provider.parseRawCollectionData(file);

        collectionData.length.should.be.equal(2);

        collectionData[0].name.should.be.equal("Refuse");
        
        collectionData[1].date.should.be.a('date');
        collectionData[1].date.getFullYear().should.be.equal(2017);
        collectionData[1].date.getMonth().should.be.equal(5);
        collectionData[1].date.getDate().should.be.equal(8);
    }

    private loadFile(file: string) {
        return fs.readFileSync('test/data/bristol/' + file, 'utf8');
    }
}
