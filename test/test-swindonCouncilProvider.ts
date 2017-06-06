import * as chai from 'chai';
import * as chaiAsPromised from "chai-as-promised";
import { suite, test, timeout, slow } from 'mocha-typescript'
import { SwindonCouncilProvider } from '../council-providers/swindonCouncilProvider'
import * as fs from 'fs';
import * as lolex from 'lolex';

@suite(slow(1000), timeout(2000)) 
class SwindonCouncilProviderTests {

    councilProvider:SwindonCouncilProvider;
    clock: lolex.Clock;

    before() {
        this.councilProvider = new SwindonCouncilProvider();
        
        chai.should();
        chai.use(chaiAsPromised);

        this.clock =lolex.install(new Date(2017, 5, 2));
    }

    after() {
        this.clock.uninstall();
    }

    @test 'can get a list of address based on postcode'() {
        return this.councilProvider.getAddresses('SN1 1RQ', '').then(function(r) {
            r.should.be.an('array');
            r.length.should.be.at.least(1);
        });
    }

    @test 'returns an error with a non-swindon postcode'() {
        let promise = this.councilProvider.getAddresses('BA1 1AA', '');
        return promise.should.be.eventually.rejected;
    }

    @test 'returns an error with an invalid postcode'() {
        let promise = this.councilProvider.getAddresses('wibble', '22');
        return promise.should.be.eventually.rejected;
    }

    @test 'returns raw collection HTML with a valid uprn'() {
        return this.councilProvider.getRawCollectionData('10008544370').then(function(r) {
           r.should.be.a('string');
           r.should.not.include('Sorry');
        });
    }

    @test 'returns an error with an invalid uprn'() {
        let promise = this.councilProvider.getRawCollectionData('wibble');
        return promise.should.to.be.eventually.rejected;
    }

    @test 'can parse Swindon XML data'() {
        let xmlData = this.loadFile('standard.xml');
        
        let data = this.councilProvider.parseRawCollectionData(xmlData);

        data.length.should.be.equal(4);
        
        data[0].name.should.be.equal("Refuse");
        data[0].date.getDate().should.be.equal(5);
        data[0].date.getMonth().should.be.equal(5);
        data[0].date.getFullYear().should.be.equal(2017);
    }

    @test 'can parse Swindon XML data with tomorrow value'() {
        let xmlData = this.loadFile('tomorrow.xml');
        let data = this.councilProvider.parseRawCollectionData(xmlData);

        data.length.should.be.equal(4);

        data[0].name.should.be.equal("Refuse");

        // Ensure "Tomorrow" collection is set to the fixed "tomorrow" date (2017-06-03)
        data[0].date.getDate().should.be.equal(3);
        data[0].date.getMonth().should.be.equal(5);
        data[0].date.getFullYear().should.be.equal(2017);
    }

    @test 'can parse Swindon XML data, ignoring invalid data'() {
        let xmlData = this.loadFile('invalid.xml');
        let data = this.councilProvider.parseRawCollectionData(xmlData);

        data.length.should.be.equal(3);
    }


    private loadFile(file: string) {
        return fs.readFileSync('test/data/swindon/' + file, 'utf8');
    }
}
