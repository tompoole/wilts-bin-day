import {CouncilProviderFactory} from '../councilProviderFactory'
import {suite, test} from 'mocha-typescript'
import {expect} from 'chai'

@suite class CouncilProviderFactoryTests {

    @test "Factory returns single providers for matching postcode area"() {

        let factory = new CouncilProviderFactory();
        let providers = factory.getCouncilProvidersByPostcode("SN159ZD");

        expect(providers.length).is.equal(1);
        expect(providers[0].constructor.name).is.equal("WiltshireCouncilProvider");
    }

    @test "Factory returns multiple providers for matching postcode area"() {

        let factory = new CouncilProviderFactory();
        let providers = factory.getCouncilProvidersByPostcode("SN4 1AA");

        expect(providers.length).is.equal(2);
        expect(providers[0].constructor.name).is.equal("SwindonCouncilProvider");
    }

 
}