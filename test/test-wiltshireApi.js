var wiltshireApi = require('../wiltshireApi');
const chai = require('chai').use(require('chai-as-promised'));
const should = chai.should();

describe('The Wiltshire Council API', function() {
    it('can get a list of address based on postcode', function(done) {
        wiltshireApi.getAddresses('sn15 1nd').then(function(r) {
            r.should.be.an('array');
            r.length.should.be.at.least(1);
            done();
        });
    });

    it('returns an error with a non-wiltshire postcode', function() {
        return wiltshireApi.getAddresses('BA1 1AA').should.be.rejected;
    });

    it('returns an error with an invalid postcode', function() {
        return wiltshireApi.getAddresses('wibble').should.be.rejected;
    });

    it('returns raw collection HTML with a valid uprn', function(done) {
        wiltshireApi.getRawCollectionHtml('100121082706').then(function(r) {
            r.should.be.a('string');
            r.should.not.include('Sorry...');
            done();
        });
        
    });

    it('returns an error with an invalid uprn', function() {
        return wiltshireApi.getRawCollectionHtml('wibble').should.be.rejected;
    });
});
