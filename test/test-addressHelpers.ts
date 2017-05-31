import * as addressHelpers from '../addressHelpers'
import {suite, test} from 'mocha-typescript'
import {expect} from 'chai'

@suite class TestHelpers {

    @test.only "Postcode validator identifies valid postcodes"() {

        var validPostcodes = [
            "SN15 1AA",
            "SN1 1AB",
            "SN121AA",
            "W1 1AA",
            "E23AB"
        ];

        for (let i in validPostcodes) {
            let postcode = validPostcodes[i];
            let result = addressHelpers.isValidPostcode(postcode);
            expect(result).to.be.true;
        }
        
    }

    @test.only "Postcode validator identifies invalid postcodes"() {

        var invalidPostcodes = [
            "SN15 1A",
            "SN12 1",
            "SN12",
            "A1 1"
        ];

        for (let i in invalidPostcodes) {
            let postcode = invalidPostcodes[i];
            let result = addressHelpers.isValidPostcode(postcode);
            expect(result).to.be.false;
        }
        
    }
}
