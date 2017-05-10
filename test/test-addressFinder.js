const proxyquire = require('proxyquire');
const should = require('chai').should();
const sinon = require('sinon');

const apiStub = {};
const addressFinder = proxyquire('../addressFinder', {
    './wiltshireApi': apiStub
});

const addressData = [
    {'UPRN': '321', 'address': '1 Cedar Grove'},
    {'UPRN': '123', 'address': '7 Cedar Grove'},
    {'UPRN': '432', 'address': '9 Cedar Grove'}
];

describe('Address Finder', function() {
    it('should return a single address', function(done) {

        var getAddresses = sinon.stub(apiStub, 'getAddresses')
        getAddresses.resolves(addressData);

        addressFinder.getAddress('SN151DF', '7 Cedar Grove').then(function(address) {
            address.should.be.an('object');
            address.UPRN.should.equal('123');
            done();
        });

        getAddresses.restore();
    });

  
});
