import * as chai from 'chai';
import * as chaiAsPromised from "chai-as-promised";
import { suite, test } from 'mocha-typescript'
import { WiltshireCouncilProvider } from '../council-providers/wiltshireCouncilProvider'


@suite class WiltsApiTest {
    
    wiltsApi:WiltshireCouncilProvider;

    constructor() {
        this.wiltsApi = new WiltshireCouncilProvider();

        chai.should();
        chai.use(chaiAsPromised);
    }

    @test 'can get a list of address based on postcode'() {
        return this.wiltsApi.getAddresses('sn15 1nd', "").then(function(r) {
            r.should.be.an('array');
            r.length.should.be.at.least(1);
        });
    }

    @test 'returns an error with a non-wiltshire postcode'() {
        let promise = this.wiltsApi.getAddresses('BA1 1AA', '');
        return promise.should.be.eventually.rejected;
    }

    @test 'returns an error with an invalid postcode'() {
        let promise = this.wiltsApi.getAddresses('wibble', '');
        return promise.should.be.eventually.rejected;
    }

    @test 'returns raw collection HTML with a valid uprn'() {
        return this.wiltsApi.getRawCollectionData('100121082706').then(function(r) {
           r.should.be.a('string');
           r.should.not.include('Sorry');
        });
    }

    @test 'returns an error with an invalid uprn'() {
        let promise = this.wiltsApi.getRawCollectionData('wibble');
        return promise.should.to.be.eventually.rejected;
    }
}
